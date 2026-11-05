import { NextResponse } from "next/server";
import { normalizeCartItems, quoteCart } from "@/lib/shop/orders";
import { errorResponse, readJson } from "@/lib/shop/http";

// 장바구니의 현재 가격·재고·배송비를 계산합니다.
export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const items = normalizeCartItems(body.items);
    return NextResponse.json(await quoteCart(items));
  } catch (err) {
    return errorResponse(err);
  }
}
