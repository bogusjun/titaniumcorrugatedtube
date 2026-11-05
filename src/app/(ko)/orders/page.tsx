import type { Metadata } from "next";
import ShopPageShell from "@/components/shop/ShopPageShell";
import OrderLookup from "@/components/shop/OrderLookup";

export const metadata: Metadata = { title: "주문 조회", robots: { index: false, follow: true } };

export default function OrdersPage() {
  return (
    <ShopPageShell label="Order Lookup" title="주문 조회" desc="주문 확인 메일에 있는 주문번호와 주문자 휴대폰 번호로 주문 상태와 송장번호를 확인할 수 있습니다.">
      <div className="max-w-3xl">
        <OrderLookup />
      </div>
    </ShopPageShell>
  );
}
