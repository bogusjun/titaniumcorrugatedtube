"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setBuyNowItems, useCart } from "@/components/shop/CartProvider";
import ShopPolicyNotice from "@/components/shop/ShopPolicyNotice";
import { MAX_QTY_PER_LINE } from "@/lib/shop/config";
import { discountRate, formatPrice } from "@/lib/shop/format";
import type { ShopItem } from "@/lib/shop/types";

/**
 * 제품 상세의 온라인 구매 상자 (표준품·소켓) — 선택지·수량 고르고 장바구니 담기 / 바로 구매
 * 가격·재고는 페이지를 만들 때 서버에서 읽은 값이고, 결제 직전에 서버가 다시 확인한다.
 */
export default function PurchaseBox({ items }: { items: ShopItem[] }) {
  const router = useRouter();
  const { add } = useCart();
  const firstInStock = items.find((i) => i.stock > 0) ?? items[0];
  const [sku, setSku] = useState(firstInStock?.sku ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = items.find((i) => i.sku === sku);
  if (!selected) return null;

  const soldOut = selected.stock === 0;
  const maxQty = Math.max(1, Math.min(MAX_QTY_PER_LINE, selected.stock));
  const rate = discountRate(selected.price, selected.compareAtPrice);

  const choose = (next: string) => {
    setSku(next);
    setQty(1);
    setAdded(false);
  };
  const changeQty = (n: number) => {
    setQty(Math.max(1, Math.min(maxQty, n)));
    setAdded(false);
  };

  const addToCart = () => {
    add({ sku: selected.sku, quantity: qty });
    setAdded(true);
  };
  const buyNow = () => {
    setBuyNowItems([{ sku: selected.sku, quantity: qty }]);
    router.push("/checkout?mode=buynow");
  };

  return (
    <div className="bg-white rounded-2xl border border-silver-100 p-5 mb-6" data-testid="purchase-box">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-ink uppercase tracking-wider">온라인 구매</p>
        <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">재고품 바로 출고</span>
      </div>

      {/* 선택지 */}
      <div className="flex flex-col gap-2 mb-4" role="radiogroup" aria-label="선택지">
        {items.map((item) => {
          const active = item.sku === sku;
          return (
            <button
              key={item.sku}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(item.sku)}
              className={cn(
                "flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-colors",
                active ? "border-accent bg-accent/5" : "border-silver-100 hover:border-silver-300",
              )}
            >
              <span className={cn("font-medium", item.stock === 0 ? "text-silver-400" : "text-ink")}>{item.optionLabel}</span>
              <span className="flex items-center gap-2 whitespace-nowrap">
                {item.stock === 0 ? (
                  <span className="text-xs text-red-500 font-semibold">품절</span>
                ) : item.stock <= 5 ? (
                  <span className="text-xs text-amber-600">{item.stock}개 남음</span>
                ) : null}
                <span className="font-bold text-ink tabular-nums">{formatPrice(item.price)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 수량 · 금액 */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center border border-silver-100 rounded-lg" aria-label="수량">
          <button type="button" onClick={() => changeQty(qty - 1)} disabled={soldOut || qty <= 1} className="p-2.5 text-ink-muted disabled:opacity-30" aria-label="수량 줄이기">
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQty}
            value={qty}
            disabled={soldOut}
            onChange={(e) => changeQty(Number(e.target.value))}
            className="w-14 text-center text-sm font-semibold text-ink tabular-nums focus:outline-none disabled:bg-transparent"
            aria-label="수량 입력"
          />
          <button type="button" onClick={() => changeQty(qty + 1)} disabled={soldOut || qty >= maxQty} className="p-2.5 text-ink-muted disabled:opacity-30" aria-label="수량 늘리기">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-right">
          {rate && selected.compareAtPrice && (
            <p className="text-xs text-silver-400">
              <span className="line-through">{formatPrice(selected.compareAtPrice * qty)}</span>
              <span className="ml-1.5 text-accent font-semibold">{rate}%</span>
            </p>
          )}
          <p className="text-xl font-black text-ink tabular-nums" data-testid="purchase-total">{formatPrice(selected.price * qty)}</p>
          <p className="text-[11px] text-ink-subtle">부가세 포함</p>
        </div>
      </div>

      {soldOut ? (
        <p className="text-sm text-ink-muted bg-silver-50 rounded-lg px-4 py-3 mb-3">
          지금 품절입니다. 입고 일정이나 맞춤 제작은{" "}
          <Link href="/support" className="text-accent font-semibold hover:underline">견적 문의</Link>로 알려 드립니다.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button type="button" onClick={addToCart} className="btn-dark justify-center py-3">
            <ShoppingCart className="w-4 h-4" />
            장바구니
          </button>
          <button type="button" onClick={buyNow} className="btn-primary justify-center py-3">
            <Zap className="w-4 h-4" />
            바로 구매
          </button>
        </div>
      )}

      {added && (
        <p className="text-sm text-ink-muted flex items-center gap-1.5 mb-3" role="status">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          장바구니에 담았습니다.
          <Link href="/cart" className="text-accent font-semibold hover:underline ml-1">장바구니 보기</Link>
        </p>
      )}

      <p className="text-xs text-ink-subtle mb-3">
        {MAX_QTY_PER_LINE}개가 넘는 대량 구매나 다른 길이·피팅은{" "}
        <Link href="/support" className="text-accent hover:underline">견적 문의</Link>로 받습니다.
      </p>
      <ShopPolicyNotice compact />
    </div>
  );
}
