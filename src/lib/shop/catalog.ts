import "server-only";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { SHOP_PRODUCT_SLUGS } from "@/lib/shop/config";
import type { ShopItem } from "@/lib/shop/types";

export type ShopItemRow = {
  id: string;
  sku: string;
  product_slug: string;
  name: string;
  option_label: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
  sort_order: number;
  updated_at?: string;
};

export function mapItem(row: ShopItemRow): ShopItem {
  return {
    id: row.id,
    sku: row.sku,
    productSlug: row.product_slug,
    name: row.name,
    optionLabel: row.option_label,
    price: row.price,
    compareAtPrice: row.compare_at_price && row.compare_at_price > row.price ? row.compare_at_price : null,
    stock: Math.max(0, row.stock),
  };
}

/**
 * 제품 페이지의 구매 상자에 보여 줄 품목 — 판매 중이고 가격이 있는 것만(품절 포함)
 * Supabase 가 아직 설정되지 않았거나 일시적으로 실패하면 빈 목록을 돌려준다 — 그러면 구매 상자 없이 견적 문의만 보인다.
 */
export async function getSellableItems(productSlug: string): Promise<ShopItem[]> {
  if (!isSupabaseConfigured() || !(SHOP_PRODUCT_SLUGS as readonly string[]).includes(productSlug)) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("shop_items")
    .select("*")
    .eq("product_slug", productSlug)
    .eq("is_active", true)
    .gt("price", 0)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[catalog] 판매 품목 조회 실패:", error.message);
    return [];
  }
  return (data as ShopItemRow[]).map(mapItem);
}

/** 가격·재고가 바뀌었을 때 구매 상자가 있는 페이지를 다시 만든다 */
export function revalidateStorefront() {
  try {
    for (const slug of SHOP_PRODUCT_SLUGS) revalidatePath(`/products/${slug}`);
  } catch (err) {
    console.error("[catalog] revalidate 실패:", err);
  }
}
