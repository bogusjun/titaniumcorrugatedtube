"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { clearBuyNowItems, useCart } from "@/components/shop/CartProvider";
import { CHECKOUT_SOURCE_KEY, DRAFT_KEY } from "@/components/shop/CheckoutView";
import OrderDetailCard from "@/components/shop/OrderDetailCard";
import { trackPurchase } from "@/components/analytics/track";
import { SHOP_CONTACT } from "@/lib/shop/config";
import type { PublicOrder } from "@/lib/shop/types";

type State =
  | { kind: "loading" }
  | { kind: "paid"; order: PublicOrder }
  | { kind: "pending"; orderNo: string }
  | { kind: "failed"; message: string; mode: "cart" | "buynow" };

const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

function readSource(orderNo: string): "cart" | "buynow" | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_SOURCE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.orderNo === orderNo ? parsed.mode : null;
  } catch {
    return null;
  }
}

/** 결제 완료 확인 — PC 는 결제창 응답 뒤, 모바일은 포트원 리디렉트(?paymentId=…&code=…)로 온다 */
export default function CheckoutComplete() {
  const params = useSearchParams();
  const paymentId = params.get("paymentId") ?? "";
  const failCode = params.get("code");
  const failMessage = params.get("message");
  const { removePurchased, hydrated } = useCart();
  const [state, setState] = useState<State>({ kind: "loading" });
  const started = useRef(false);

  useEffect(() => {
    if (!hydrated || started.current) return;
    started.current = true;
    const mode = readSource(paymentId) ?? "cart";

    async function run() {
      if (!paymentId) {
        setState({ kind: "failed", message: "주문 정보가 없습니다.", mode });
        return;
      }

      // 모바일 리디렉트에서 실패·취소로 돌아온 경우
      if (failCode) {
        await post("/api/payment/abort", { paymentId }).catch(() => undefined);
        setState({ kind: "failed", message: failMessage ?? "결제가 취소되었습니다.", mode });
        return;
      }

      // 웹훅보다 먼저 도착할 수 있어 잠시 다시 시도한다
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await post("/api/payment/complete", { paymentId });
          const data = await res.json();
          if (!res.ok) {
            setState({ kind: "failed", message: data.error ?? "결제 확인에 실패했습니다.", mode });
            return;
          }
          if (data.result === "paid") {
            const order: PublicOrder = data.order;
            if (mode === "buynow") clearBuyNowItems();
            else removePurchased(order.items.map((i) => i.sku));
            try {
              sessionStorage.removeItem(CHECKOUT_SOURCE_KEY);
              sessionStorage.removeItem(DRAFT_KEY);
            } catch {
              // ignore
            }
            trackPurchase(order.orderNo, order.totalAmount);
            setState({ kind: "paid", order });
            return;
          }
          if (data.result === "failed") {
            setState({ kind: "failed", message: data.message ?? "결제가 완료되지 않았습니다.", mode });
            return;
          }
        } catch {
          // 네트워크 오류 → 다시 시도
        }
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
      setState({ kind: "pending", orderNo: paymentId });
    }
    run();
  }, [hydrated, paymentId, failCode, failMessage, removePurchased]);

  if (state.kind === "loading") {
    return <p className="text-ink-muted py-16 text-center">결제를 확인하고 있습니다…</p>;
  }

  if (state.kind === "paid") {
    return (
      <div data-testid="checkout-paid">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-8 h-8 text-accent" />
          <h2 className="text-2xl md:text-3xl font-black text-ink">주문이 접수되었습니다</h2>
        </div>
        <p className="text-ink-muted leading-relaxed mb-8">
          주문 확인 메일을 보내 드렸습니다. 출고되면 송장번호를 다시 알려 드리고,
          주문번호와 휴대폰 번호로 언제든 주문 상태를 확인하실 수 있습니다.
        </p>
        <OrderDetailCard order={state.order} />
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/orders" className="btn-dark">주문 조회</Link>
          <Link href="/products" className="btn-primary">제품 더 보기</Link>
        </div>
      </div>
    );
  }

  if (state.kind === "pending") {
    return (
      <div className="bg-white rounded-2xl border border-silver-100 p-8">
        <Clock className="w-8 h-8 text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-ink mb-2">결제 확인이 늦어지고 있습니다</h2>
        <p className="text-ink-muted leading-relaxed mb-6">
          결제가 끝났다면 잠시 뒤 주문 확인 메일이 갑니다.
          <br />
          주문번호 <span className="font-mono text-ink">{state.orderNo}</span> · 문의 {SHOP_CONTACT.phone}
        </p>
        <Link href="/orders" className="btn-dark">주문 조회</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-silver-100 p-8" data-testid="checkout-failed">
      <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
      <h2 className="text-xl font-bold text-ink mb-2">결제가 완료되지 않았습니다</h2>
      <p className="text-ink-muted leading-relaxed mb-6">{state.message}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={state.mode === "buynow" ? "/checkout?mode=buynow" : "/checkout"} className="btn-primary">다시 결제하기</Link>
        <Link href="/cart" className="btn-dark">장바구니</Link>
      </div>
    </div>
  );
}
