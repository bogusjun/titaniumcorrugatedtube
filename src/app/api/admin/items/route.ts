import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidateStorefront } from "@/lib/shop/catalog";
import { SHOP_PRODUCT_SLUGS } from "@/lib/shop/config";

/**
 * 관리자 › 판매 품목 — SKU 별 가격·재고·판매 여부
 * GET: 전체 목록, POST: 새 품목, PATCH: { id, ...바꿀 값 }
 * 저장하면 구매 상자가 있는 제품 페이지를 다시 만든다(revalidateStorefront).
 */

const SKU_RE = /^[A-Z0-9][A-Z0-9-]{1,39}$/;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

type Patch = Record<string, unknown>;

/** 입력값을 DB 컬럼 값으로 바꾼다. 잘못된 값이면 오류 문구를 던진다 */
function toColumns(input: Patch, creating: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const int = (v: unknown, label: string, min = 0) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < min || n > 100_000_000) throw new Error(`${label}을(를) 0 이상의 정수로 입력해 주세요.`);
    return n;
  };
  const str = (v: unknown, label: string, max: number) => {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) throw new Error(`${label}을(를) 입력해 주세요.`);
    if (s.length > max) throw new Error(`${label}이(가) 너무 깁니다.`);
    return s;
  };

  if (creating || input.sku !== undefined) {
    const sku = str(input.sku, "SKU", 40).toUpperCase();
    if (!SKU_RE.test(sku)) throw new Error("SKU 는 영문 대문자·숫자·하이픈(-)으로 2~40자입니다. 예: TS-300");
    out.sku = sku;
  }
  if (creating || input.productSlug !== undefined) {
    const slug = String(input.productSlug ?? "");
    if (!(SHOP_PRODUCT_SLUGS as readonly string[]).includes(slug)) throw new Error("제품을 선택해 주세요.");
    out.product_slug = slug;
  }
  if (creating || input.name !== undefined) out.name = str(input.name, "품목 이름", 60);
  if (creating || input.optionLabel !== undefined) out.option_label = str(input.optionLabel, "선택지 이름", 80);
  if (input.price !== undefined) out.price = int(input.price, "판매가");
  if (input.compareAtPrice !== undefined) {
    out.compare_at_price = input.compareAtPrice === null || input.compareAtPrice === "" ? null : int(input.compareAtPrice, "할인 전 가격");
  }
  if (input.stock !== undefined) out.stock = int(input.stock, "재고");
  if (input.sortOrder !== undefined) out.sort_order = int(input.sortOrder, "정렬 순서");
  if (input.isActive !== undefined) out.is_active = input.isActive === true;
  return out;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized();
  const { data, error } = await getSupabaseAdmin()
    .from("shop_items")
    .select("*")
    .order("product_slug", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized();
  let row: Record<string, unknown>;
  try {
    row = toColumns(await req.json(), true);
  } catch (err) {
    return bad(err instanceof Error ? err.message : "입력값을 확인해 주세요.");
  }
  if (row.is_active && !(Number(row.price) > 0)) return bad("판매가를 넣어야 판매 중으로 켤 수 있습니다.");
  const { data, error } = await getSupabaseAdmin().from("shop_items").insert(row).select().single();
  if (error) {
    return error.code === "23505" ? bad("같은 SKU 가 이미 있습니다.") : NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidateStorefront();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized();
  let id = "";
  let update: Record<string, unknown>;
  try {
    const body = (await req.json()) as Patch;
    id = String(body.id ?? "");
    update = toColumns(body, false);
  } catch (err) {
    return bad(err instanceof Error ? err.message : "입력값을 확인해 주세요.");
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return bad("품목을 찾을 수 없습니다.");
  if (Object.keys(update).length === 0) return bad("바꿀 값이 없습니다.");

  const supabase = getSupabaseAdmin();
  if (update.is_active === true && update.price === undefined) {
    const { data: current } = await supabase.from("shop_items").select("price").eq("id", id).maybeSingle();
    if (!current || !(current.price > 0)) return bad("판매가를 넣어야 판매 중으로 켤 수 있습니다.");
  }
  if (update.is_active === true && update.price !== undefined && !(Number(update.price) > 0)) {
    return bad("판매가를 넣어야 판매 중으로 켤 수 있습니다.");
  }

  const { data, error } = await supabase.from("shop_items").update(update).eq("id", id).select().maybeSingle();
  if (error) {
    return error.code === "23505" ? bad("같은 SKU 가 이미 있습니다.") : NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return bad("품목을 찾을 수 없습니다.");
  revalidateStorefront();
  return NextResponse.json(data);
}
