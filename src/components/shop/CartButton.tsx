"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";

/** 헤더 장바구니 — 담은 게 있을 때만 보인다(온라인 구매는 일부 제품만이라 평소에는 감춘다) */
export default function CartButton({ className = "" }: { className?: string }) {
  const { count, hydrated } = useCart();
  if (!hydrated || count === 0) return null;
  return (
    <Link href="/cart" className={`relative p-2 text-silver-200 hover:text-white transition-colors ${className}`} aria-label={`장바구니 ${count}개`} data-testid="cart-button">
      <ShoppingCart className="w-5 h-5" />
      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}
