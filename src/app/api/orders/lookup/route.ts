import { NextResponse } from "next/server";
import { lookupOrder, toPublicOrder } from "@/lib/shop/orders";
import { errorResponse, readJson } from "@/lib/shop/http";

// 비회원 주문 조회 (주문번호 + 주문자 휴대폰 번호)
export async function POST(req: Request) {
  try {
    const { orderNo, phone } = await readJson(req);
    const order =
      typeof orderNo === "string" && typeof phone === "string"
        ? await lookupOrder(orderNo.trim().toUpperCase(), phone)
        : null;
    if (!order || ["pending", "expired", "failed"].includes(order.status)) {
      return NextResponse.json(
        { error: "일치하는 주문이 없습니다. 주문번호와 휴대폰 번호를 확인해 주세요." },
        { status: 404 },
      );
    }
    return NextResponse.json({ order: toPublicOrder(order) });
  } catch (err) {
    return errorResponse(err);
  }
}
