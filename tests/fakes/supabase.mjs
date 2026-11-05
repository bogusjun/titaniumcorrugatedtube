// 테스트 전용(tauti 검사 도구에서 옮김): Supabase REST(/rest/v1)를 흉내 내는 서버. 실제 Postgres 에 연결한다.
// 온라인 구매 코드가 쓰는 질의 형태만 지원한다. 운영 코드가 아니다.
import http from "node:http";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL ?? "postgres://postgres@127.0.0.1:54329/atx_test" });
const PORT = Number(process.env.FAKE_SUPABASE_PORT ?? 54321);

// parent -> child relationships for embedding
const REL = {
  "orders.order_items": { table: "order_items", kind: "many", fk: "order_id", pk: "id" },
};
const TABLES = new Set(["shop_items", "orders", "order_items"]);
const ident = (s) => {
  if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error("bad identifier " + s);
  return `"${s}"`;
};

// split by commas not inside parentheses
function splitTop(s) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function selectSql(table, select, alias) {
  const parts = splitTop(select || "*");
  const cols = [];
  for (const p of parts) {
    const m = p.match(/^(?:([a-z_]+):)?([a-z_]+)\((.*)\)$/);
    if (m) {
      const [, as, rel, inner] = m;
      const r = REL[`${table}.${rel}`];
      if (!r) throw new Error(`unknown relation ${table}.${rel}`);
      const sub = `s_${rel}`;
      const innerCols = selectSql(r.table, inner, sub);
      if (r.kind === "many") {
        cols.push(`coalesce((select json_agg(json_build_object(${innerCols})) from ${ident(r.table)} ${sub} where ${sub}.${ident(r.fk)} = ${alias}.${ident("id")}), '[]'::json) as ${ident(as ?? rel)}`);
      } else {
        cols.push(`(select json_build_object(${innerCols}) from ${ident(r.table)} ${sub} where ${sub}.${ident(r.pk)} = ${alias}.${ident(r.fk)}) as ${ident(as ?? rel)}`);
      }
    } else if (p === "*") {
      cols.push(`${alias}.*`);
    } else {
      cols.push(`${alias}.${ident(p)}`);
    }
  }
  // for nested json_build_object we need key/value pairs
  if (alias.startsWith("s_")) {
    return cols
      .flatMap((c) => {
        if (c.endsWith(".*")) throw new Error("nested * needs explicit expansion");
        const asMatch = c.match(/ as "([a-z_]+)"$/);
        if (asMatch) return [`'${asMatch[1]}'`, c.replace(/ as "[a-z_]+"$/, "")];
        const col = c.split(".")[1].replaceAll('"', "");
        return [`'${col}'`, c];
      })
      .join(", ");
  }
  return cols.join(", ");
}

async function expandNestedStar(table, select) {
  // replace rel(*) with explicit columns so json_build_object works
  const parts = splitTop(select || "*");
  const out = [];
  for (const p of parts) {
    const m = p.match(/^(?:([a-z_]+):)?([a-z_]+)\(\*\)$/);
    if (m) {
      const r = REL[`${table}.${m[2]}`];
      const { rows } = await pool.query(
        "select column_name from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position",
        [r.table],
      );
      out.push(`${m[1] ? m[1] + ":" : ""}${m[2]}(${rows.map((x) => x.column_name).join(",")})`);
    } else out.push(p);
  }
  return out.join(",");
}

function parseValue(v) {
  if (v === "null") return null;
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}

function filterSql(col, expr, params, alias = "t") {
  if (expr.startsWith("not.")) return `not (${filterSql(col, expr.slice(4), params, alias)})`;
  if (expr === "is.null") return `${alias}.${ident(col)} is null`;
  const dot = expr.indexOf(".");
  const op = expr.slice(0, dot);
  const val = expr.slice(dot + 1);
  const c = `${alias}.${ident(col)}`;
  switch (op) {
    case "eq": params.push(parseValue(val)); return `${c} = $${params.length}`;
    case "neq": params.push(parseValue(val)); return `${c} <> $${params.length}`;
    case "gt": params.push(parseValue(val)); return `${c} > $${params.length}`;
    case "gte": params.push(parseValue(val)); return `${c} >= $${params.length}`;
    case "lt": params.push(parseValue(val)); return `${c} < $${params.length}`;
    case "lte": params.push(parseValue(val)); return `${c} <= $${params.length}`;
    case "ilike": params.push(val.replaceAll("*", "%")); return `${c}::text ilike $${params.length}`;
    case "in": {
      const items = splitTop(val.replace(/^\(|\)$/g, "")).map((x) => x.replace(/^"|"$/g, ""));
      params.push(items);
      return `${c}::text = any($${params.length}::text[])`;
    }
    default: throw new Error("unsupported op " + op);
  }
}

function whereSql(sp, params) {
  const conds = [];
  for (const [k, v] of sp) {
    if (["select", "order", "limit", "offset", "on_conflict", "columns"].includes(k)) continue;
    if (k === "or") {
      const ors = splitTop(v.replace(/^\(|\)$/g, "")).map((e) => {
        const d = e.indexOf(".");
        return filterSql(e.slice(0, d), e.slice(d + 1), params);
      });
      conds.push(`(${ors.join(" or ")})`);
    } else conds.push(filterSql(k, v, params));
  }
  return conds.length ? `where ${conds.join(" and ")}` : "";
}

function orderSql(order) {
  if (!order) return "";
  return "order by " + order.split(",").map((o) => {
    const [col, dir = "asc"] = o.split(".");
    return `t.${ident(col)} ${dir === "desc" ? "desc" : "asc"}`;
  }).join(", ");
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function pgError(res, err) {
  const status = err.code === "P0001" || err.code === "22P02" || err.code === "23514" ? 400 : err.code === "23505" ? 409 : err.code === "42501" ? 401 : 500;
  send(res, status, { code: err.code, message: err.message, details: err.detail ?? null, hint: err.hint ?? null });
}

async function handle(req, res) {
  const url = new URL(req.url, "http://x");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const rawBuf = Buffer.concat(chunks);
  const raw = rawBuf.toString("binary");
  const isJson = (req.headers["content-type"] ?? "").includes("json");
  const body = raw && isJson ? JSON.parse(rawBuf.toString()) : undefined;
  const prefer = req.headers["prefer"] ?? "";
  const wantObject = (req.headers["accept"] ?? "").includes("vnd.pgrst.object");

  const path = url.pathname.replace(/^\/rest\/v1\//, "");
  try {
    if (path.startsWith("rpc/")) {
      const fn = path.slice(4);
      const names = Object.keys(body ?? {});
      const args = names.map((n, i) => `${ident(n)} => $${i + 1}`).join(", ");
      const vals = names.map((n) => (body[n] !== null && typeof body[n] === "object" ? JSON.stringify(body[n]) : body[n]));
      const { rows } = await pool.query(`select to_jsonb(${ident(fn)}(${args})) as result`, vals);
      return send(res, 200, rows[0].result);
    }

    if (!TABLES.has(path)) return send(res, 404, { message: "no table " + path });
    const table = path;
    const params = [];

    if (req.method === "GET") {
      const select = await expandNestedStar(table, url.searchParams.get("select"));
      const where = whereSql(url.searchParams, params);
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      const sql = `select ${selectSql(table, select, "t")} from ${ident(table)} t ${where} ${orderSql(url.searchParams.get("order"))} ${limit ? `limit ${Number(limit)}` : ""} ${offset ? `offset ${Number(offset)}` : ""}`;
      const { rows } = await pool.query(sql, params);
      const headers = {};
      if (prefer.includes("count=exact")) {
        const cnt = await pool.query(`select count(*)::int as n from ${ident(table)} t ${whereSql(url.searchParams, [])}`, params);
        const start = Number(offset ?? 0);
        headers["Content-Range"] = `${start}-${start + rows.length - 1}/${cnt.rows[0].n}`;
      }
      if (wantObject) {
        if (rows.length !== 1) return send(res, 406, { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" });
        return send(res, 200, rows[0], headers);
      }
      return send(res, 200, rows, headers);
    }

    const returning = prefer.includes("return=representation") ? "returning *" : "";

    if (req.method === "POST") {
      const list = Array.isArray(body) ? body : [body];
      const cols = Object.keys(list[0]);
      const valuesSql = list.map((row) => `(${cols.map((c) => { params.push(row[c] !== null && typeof row[c] === "object" ? JSON.stringify(row[c]) : row[c]); return `$${params.length}`; }).join(", ")})`).join(", ");
      const conflict = url.searchParams.get("on_conflict");
      const upsert = conflict && prefer.includes("merge-duplicates")
        ? `on conflict (${conflict.split(",").map(ident).join(", ")}) do update set ${cols.map((c) => `${ident(c)} = excluded.${ident(c)}`).join(", ")}`
        : "";
      const { rows } = await pool.query(`insert into ${ident(table)} (${cols.map(ident).join(", ")}) values ${valuesSql} ${upsert} ${returning}`, params);
      if (!returning) return send(res, 201, undefined);
      return send(res, 201, wantObject ? rows[0] : rows);
    }

    if (req.method === "PATCH") {
      const sets = Object.keys(body).map((c) => { params.push(body[c] !== null && typeof body[c] === "object" ? JSON.stringify(body[c]) : body[c]); return `${ident(c)} = $${params.length}`; });
      const where = whereSql(url.searchParams, params).replaceAll("t.", "");
      const { rows } = await pool.query(`update ${ident(table)} set ${sets.join(", ")} ${where} ${returning}`, params);
      if (!returning) return send(res, 204, undefined);
      if (wantObject) return rows.length === 1 ? send(res, 200, rows[0]) : send(res, 406, { code: "PGRST116", message: "no rows" });
      return send(res, 200, rows);
    }

    if (req.method === "DELETE") {
      const where = whereSql(url.searchParams, params).replaceAll("t.", "");
      await pool.query(`delete from ${ident(table)} ${where}`, params);
      return send(res, 204, undefined);
    }
    send(res, 405, { message: "method" });
  } catch (err) {
    if (err.code) return pgError(res, err);
    console.error(err);
    send(res, 500, { message: String(err.message) });
  }
}

http.createServer((req, res) => handle(req, res)).listen(PORT, () => console.log(`fake supabase on :${PORT}`));
