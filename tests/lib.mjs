// 검사 파일들이 함께 쓰는 설정과 도우미. 포트·주소는 run.sh 와 맞춰야 한다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));

export const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3012";
export const PORTONE = "http://127.0.0.1:54400";
export const ADMIN_PASSWORD = "test-admin-pw";
export const SHOTS = process.env.TEST_SHOTS; // 지정하면 화면 캡처 저장
const DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgres://postgres@127.0.0.1:54329/atx_test";

// ---------- 결과 집계 ----------
let passed = 0;
let failed = 0;
export function ok(cond, msg) {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (cond) passed++;
  else failed++;
}

export async function finish(name) {
  await pool.end();
  console.log(`\n[${name}] ${passed} passed, ${failed} failed\n`);
  process.exitCode = failed ? 1 : 0;
}

/** 본문 실행 중 예외가 나도 실패로 기록하고 정리한다 */
export async function run(name, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(err);
    failed++;
  }
  await finish(name);
}

// ---------- DB ----------
export const pool = new pg.Pool({ connectionString: DATABASE_URL });

export async function db(sql, params = []) {
  return (await pool.query(sql, params)).rows;
}

export async function stock(sku) {
  return (await db("SELECT stock FROM shop_items WHERE sku = $1", [sku]))[0]?.stock;
}

export async function resetShopData() {
  await pool.query(fs.readFileSync(path.join(here, "fixtures/shop-data.sql"), "utf8"));
}

// ---------- 브라우저 ----------
export function launch() {
  // 설치된 Playwright 와 브라우저 버전이 다르면 TEST_CHROMIUM_PATH 로 실행 파일을 지정한다
  return chromium.launch(process.env.TEST_CHROMIUM_PATH ? { executablePath: process.env.TEST_CHROMIUM_PATH } : {});
}

/** 외부 글꼴·영상 등을 막아 오프라인에서도 같은 결과가 나오게 한다 */
export async function blockExternal(ctx) {
  await ctx.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ contentType: "text/css", body: "" }));
  await ctx.route("https://fonts.gstatic.com/**", (r) => r.fulfill({ status: 404, body: "" }));
  await ctx.route("https://player.vimeo.com/**", (r) => r.fulfill({ contentType: "text/html", body: "" }));
}

export async function adminLogin(page) {
  await page.goto(`${BASE}/admin/login`);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL(`${BASE}/admin/orders`);
}

export async function adminCookie() {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  return res.headers.get("set-cookie").split(";")[0];
}

export async function shot(page, name, fullPage = false) {
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage });
}
