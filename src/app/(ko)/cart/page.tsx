import type { Metadata } from "next";
import ShopPageShell from "@/components/shop/ShopPageShell";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = { title: "장바구니", robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <ShopPageShell label="Cart" title="장바구니">
      <CartView />
    </ShopPageShell>
  );
}
