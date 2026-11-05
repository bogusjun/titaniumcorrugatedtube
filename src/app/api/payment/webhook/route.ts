import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/portone";
import { isOrderNo, ShopError, syncPayment } from "@/lib/shop/orders";

// 포트원 웹훅. 구매자가 결제 직후 창을 닫아도 주문이 결제완료로 처리되도록 합니다.
// 본문은 결제 ID를 찾는 데만 쓰고, 실제 상태는 항상 포트원 API로 다시 조회합니다.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let paymentId: unknown;
  try {
    const body = JSON.parse(raw);
    paymentId = body?.data?.paymentId ?? body?.payment_id;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // 이 쇼핑몰 주문이 아닌 결제는 무시
  if (!isOrderNo(paymentId)) return NextResponse.json({ ok: true, ignored: true });

  try {
    const synced = await syncPayment(paymentId);
    return NextResponse.json({ ok: true, result: synced.result });
  } catch (err) {
    if (err instanceof ShopError && err.status === 404) return NextResponse.json({ ok: true, ignored: true });
    console.error("[webhook]", err);
    // 5xx를 돌려주면 포트원이 재시도합니다.
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }
}
