import { NextResponse } from "next/server";
import { abortPayment, isOrderNo, ShopError } from "@/lib/shop/orders";
import { errorResponse, readJson } from "@/lib/shop/http";

// 결제창을 닫거나 결제가 실패했을 때 잡아 둔 재고를 바로 풀어 줍니다.
// (실제로 결제가 된 경우에는 결제완료로 처리됩니다)
export async function POST(req: Request) {
  try {
    const { paymentId } = await readJson(req);
    if (!isOrderNo(paymentId)) throw new ShopError("주문번호가 올바르지 않습니다.", "BAD_REQUEST");
    const synced = await abortPayment(paymentId);
    return NextResponse.json({ result: synced.result });
  } catch (err) {
    return errorResponse(err);
  }
}
