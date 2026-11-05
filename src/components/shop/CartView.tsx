"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { useQuote } from "@/components/shop/useQuote";
import OrderSummary from "@/components/shop/OrderSummary";
import ShopPolicyNotice from "@/components/shop/ShopPolicyNotice";
import { MAX_QTY_PER_LINE } from "@/lib/shop/config";
import { formatPrice } from "@/lib/shop/format";

export default function CartView() {
  const cart = useCart();
  const { quote, loading, error } = useQuote(cart.items, cart.hydrated);

  if (!cart.hydrated || (loading && !quote && cart.items.length > 0)) {
    return <p className="text-ink-muted py-16">불러오는 중…</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-silver-100 py-16 px-6 text-center" data-testid="cart-empty">
        <ShoppingCart className="w-10 h-10 text-silver-300 mx-auto mb-4" />
        <p className="text-ink-muted mb-6">장바구니가 비어 있습니다.</p>
        <p className="text-sm text-ink-subtle mb-6">온라인으로 바로 살 수 있는 제품: 티타늄 주름관 표준품 · 주름관 소켓</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products/tube-standard" className="btn-primary justify-center">표준품 보기</Link>
          <Link href="/products/socket" className="btn-dark justify-center">소켓 보기</Link>
        </div>
      </div>
    );
  }

  const blocked = !quote?.ok;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="bg-white rounded-2xl border border-silver-100 divide-y divide-silver-100">
        {error && <p className="p-4 text-sm text-red-500">{error}</p>}
        {(quote?.lines ?? []).map((l) => (
          <div key={l.sku} className="p-5 flex gap-4" data-testid="cart-line">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink">{l.name || "판매 중지된 품목"}</p>
              <p className="text-sm text-ink-muted">{l.optionLabel || l.sku}</p>
              {l.problem && (
                <p className="text-xs text-red-500 mt-1">
                  {l.problem === "insufficient" ? `남은 수량 ${l.available}개 — 수량을 줄여 주세요` : "품절·판매 중지 — 빼 주세요"}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-silver-100 rounded-lg">
                  <button type="button" onClick={() => cart.setQuantity(l.sku, l.quantity - 1)} disabled={l.quantity <= 1} className="p-2 text-ink-muted disabled:opacity-30" aria-label="수량 줄이기">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cart.setQuantity(l.sku, l.quantity + 1)}
                    disabled={l.quantity >= Math.min(MAX_QTY_PER_LINE, l.available || MAX_QTY_PER_LINE)}
                    className="p-2 text-ink-muted disabled:opacity-30"
                    aria-label="수량 늘리기"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {l.unitPrice > 0 && <span className="text-xs text-ink-subtle">개당 {formatPrice(l.unitPrice)}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button type="button" onClick={() => cart.remove(l.sku)} className="text-silver-400 hover:text-ink p-1" aria-label="빼기">
                <X className="w-4 h-4" />
              </button>
              <p className="font-bold text-ink tabular-nums">{formatPrice(l.lineTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:sticky lg:top-24 space-y-4">
        <OrderSummary itemsTotal={quote?.itemsTotal ?? 0} shippingFee={quote?.shippingFee ?? 0} total={quote?.total ?? 0}>
          {blocked ? (
            <p className="text-sm text-red-500 text-center">구매할 수 없는 품목을 빼거나 수량을 줄여 주세요.</p>
          ) : (
            <Link href="/checkout" className="btn-primary w-full justify-center py-3.5" data-testid="go-checkout">
              주문하기
            </Link>
          )}
        </OrderSummary>
        <ShopPolicyNotice />
      </div>
    </div>
  );
}
