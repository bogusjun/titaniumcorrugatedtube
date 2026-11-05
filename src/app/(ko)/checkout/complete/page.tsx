import type { Metadata } from "next";
import { Suspense } from "react";
import ShopPageShell from "@/components/shop/ShopPageShell";
import CheckoutComplete from "@/components/shop/CheckoutComplete";

export const metadata: Metadata = { title: "주문 완료", robots: { index: false, follow: false } };

export default function CheckoutCompletePage() {
  return (
    <ShopPageShell label="Order" title="주문 확인">
      <div className="max-w-3xl">
        <Suspense fallback={<p className="text-ink-muted py-16">결제를 확인하고 있습니다…</p>}>
          <CheckoutComplete />
        </Suspense>
      </div>
    </ShopPageShell>
  );
}
