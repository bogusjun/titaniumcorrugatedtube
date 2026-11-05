import { NextResponse } from "next/server";
import { createOrder, normalizeCartItems, orderNameOf, quoteCart, ShopError, validateCustomer } from "@/lib/shop/orders";
import { errorResponse, readJson } from "@/lib/shop/http";
import { clientKeyFrom } from "@/lib/shop/client-key";

// 결제 직전 주문 생성: 재고를 점유하고 서버가 계산한 결제 금액을 돌려줍니다.
export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    if (body.agreed !== true) {
      throw new ShopError("구매 조건 및 개인정보 수집·이용에 동의해 주세요.", "NOT_AGREED");
    }
    const customer = validateCustomer(body.customer);
    const items = normalizeCartItems(body.items);

    const quote = await quoteCart(items);
    if (!quote.ok) {
      return NextResponse.json(
        { error: "품절되었거나 재고가 부족한 상품이 있습니다. 장바구니를 확인해 주세요.", code: "CART_CHANGED", quote },
        { status: 409 },
      );
    }

    const order = await createOrder(customer, items, clientKeyFrom(req.headers));
    return NextResponse.json({
      orderNo: order.order_no,
      orderName: orderNameOf(order),
      totalAmount: order.total_amount,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
