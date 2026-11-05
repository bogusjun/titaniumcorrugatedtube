import type { Metadata } from "next";
import { Suspense } from "react";
import ShopPageShell from "@/components/shop/ShopPageShell";
import CheckoutView from "@/components/shop/CheckoutView";

export const metadata: Metadata = { title: "주문·결제", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <ShopPageShell label="Checkout" title="주문·결제">
      <Suspense fallback={<p className="text-ink-muted py-16">불러오는 중…</p>}>
        <CheckoutView />
      </Suspense>
    </ShopPageShell>
  );
}
