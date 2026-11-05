import { NextResponse } from "next/server";
import { isOrderNo, ShopError, syncPayment, toReceipt } from "@/lib/shop/orders";
import { errorResponse, readJson } from "@/lib/shop/http";

// 결제창이 끝난 뒤(PC 응답 또는 모바일 리다이렉트) 포트원에 실제 결제 상태를 확인합니다.
export async function POST(req: Request) {
  try {
    const { paymentId } = await readJson(req);
    if (!isOrderNo(paymentId)) throw new ShopError("주문번호가 올바르지 않습니다.", "BAD_REQUEST");

    const synced = await syncPayment(paymentId);
    return NextResponse.json({
      result: synced.result,
      message: synced.result === "failed" ? synced.message : undefined,
      order: toReceipt(synced.order),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
