"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBuyNowItems, useCart } from "@/components/shop/CartProvider";
import OrderSummary from "@/components/shop/OrderSummary";
import ShopPolicyNotice from "@/components/shop/ShopPolicyNotice";
import { PostcodeSearch, type PostcodeResult } from "@/components/shop/PostcodeSearch";
import { useQuote } from "@/components/shop/useQuote";
import { SHOP_CONTACT } from "@/lib/shop/config";
import { formatPrice, onlyDigits } from "@/lib/shop/format";
import type { CartItem, CheckoutCustomer } from "@/lib/shop/types";

/**
 * 결제 화면 — 주문자·배송지(·세금계산서) 입력 → /api/orders 로 주문 생성(재고 점유) → 포트원 결제창
 * PC 는 결제창 응답을 받아 /checkout/complete 로, 모바일은 포트원이 redirectUrl 로 돌려보낸다.
 */
export const DRAFT_KEY = "atx-checkout-draft-v1";
export const CHECKOUT_SOURCE_KEY = "atx-checkout-source-v1";

type Form = CheckoutCustomer;

const EMPTY: Form = {
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  buyerCompany: "",
  recipientName: "",
  recipientPhone: "",
  postcode: "",
  address1: "",
  address2: "",
  deliveryMemo: "",
};

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder-silver-400";

function Field({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-muted mb-1.5">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-ink-subtle mt-1">{hint}</span>}
    </label>
  );
}

function readDraft(): { form: Form; sameAsBuyer: boolean } | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CheckoutView() {
  const params = useSearchParams();
  const mode = params.get("mode") === "buynow" ? "buynow" : "cart";
  const router = useRouter();
  const cart = useCart();

  const [buyNow, setBuyNow] = useState<CartItem[] | null>(null);
  useEffect(() => {
    if (mode === "buynow") setBuyNow(getBuyNowItems());
  }, [mode]);

  const items = mode === "buynow" ? (buyNow ?? []) : cart.items;
  const ready = mode === "buynow" ? buyNow !== null : cart.hydrated;
  const { quote, loading: quoting, error: quoteError } = useQuote(items, ready);

  const [form, setForm] = useState<Form>(EMPTY);
  const [sameAsBuyer, setSameAsBuyer] = useState(true);
  const [agree, setAgree] = useState({ terms: false, privacy: false, thirdParty: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);

  // 결제를 취소하고 돌아왔을 때 입력값 복원
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setForm({ ...EMPTY, ...draft.form });
      setSameAsBuyer(draft.sameAsBuyer);
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, sameAsBuyer }));
    } catch {
      // ignore
    }
  }, [form, sameAsBuyer, draftLoaded]);

  const set = (key: keyof CheckoutCustomer) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const onAddress = useCallback((r: PostcodeResult) => {
    setError("");
    setForm((f) => ({ ...f, postcode: r.postcode, address1: r.address, address2: "" }));
    setTimeout(() => document.getElementById("address2")?.focus(), 50);
  }, []);

  const allAgreed = agree.terms && agree.privacy && agree.thirdParty;

  function clientValidate(c: Form): string | null {
    if (!c.buyerName.trim()) return "주문자 이름을 입력해 주세요.";
    if (!/^0\d{8,10}$/.test(onlyDigits(c.buyerPhone))) return "주문자 휴대폰 번호를 정확히 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.buyerEmail.trim())) return "이메일을 정확히 입력해 주세요.";
    if (!c.recipientName.trim()) return "받는 분 이름을 입력해 주세요.";
    if (!/^0\d{8,10}$/.test(onlyDigits(c.recipientPhone))) return "받는 분 연락처를 정확히 입력해 주세요.";
    if (!c.postcode || !c.address1) return "주소 검색으로 배송지를 입력해 주세요.";
    if (!allAgreed) return "필수 항목에 모두 동의해 주세요.";
    return null;
  }

  async function handlePay() {
    const customer: Form = sameAsBuyer ? { ...form, recipientName: form.buyerName, recipientPhone: form.buyerPhone } : form;
    const invalid = clientValidate(customer);
    if (invalid) {
      setError(invalid);
      return;
    }

    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
    if (!storeId || !channelKey) {
      setError(`결제 설정이 아직 끝나지 않았습니다. ${SHOP_CONTACT.phone}로 문의해 주세요.`);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, agreed: true }),
      });
      const order = await res.json();
      if (!res.ok) {
        setError(order.error ?? "주문을 만들지 못했습니다.");
        return;
      }

      try {
        sessionStorage.setItem(CHECKOUT_SOURCE_KEY, JSON.stringify({ orderNo: order.orderNo, mode }));
      } catch {
        // ignore
      }

      const PortOne = await import("@portone/browser-sdk/v2");
      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId: order.orderNo,
        orderName: order.orderName,
        totalAmount: order.totalAmount,
        currency: "KRW",
        payMethod: "CARD",
        customer: {
          fullName: customer.buyerName,
          email: customer.buyerEmail,
          phoneNumber: onlyDigits(customer.buyerPhone),
        },
        // 모바일 등 리디렉션 방식 결제에서 돌아올 주소
        redirectUrl: `${window.location.origin}/checkout/complete`,
      });

      // 리디렉션 방식이면 응답 없이 페이지가 이동한다
      if (!response) return;

      if (response.code) {
        await fetch("/api/payment/abort", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: order.orderNo }),
        }).catch(() => undefined);
        setError(response.message ?? "결제가 취소되었습니다.");
        return;
      }

      router.push(`/checkout/complete?paymentId=${encodeURIComponent(order.orderNo)}`);
    } catch (err) {
      console.error(err);
      setError("결제 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready || (quoting && !quote)) {
    return <p className="text-ink-muted py-16">불러오는 중…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-silver-100 py-16 text-center">
        <p className="text-ink-muted mb-6">주문할 제품이 없습니다.</p>
        <Link href="/products/tube-standard" className="btn-primary">제품 보러 가기</Link>
      </div>
    );
  }

  const blocked = !quote?.ok;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-6">
        {/* 주문자 */}
        <section className="bg-white rounded-2xl border border-silver-100 p-6">
          <h2 className="font-bold text-ink text-lg mb-4">주문자 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="이름" required>
              <input name="buyerName" className={inputCls} value={form.buyerName} onChange={set("buyerName")} autoComplete="name" maxLength={30} />
            </Field>
            <Field label="휴대폰" required hint="주문 조회에 씁니다.">
              <input name="buyerPhone" className={inputCls} value={form.buyerPhone} onChange={set("buyerPhone")} inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" maxLength={13} />
            </Field>
            <Field label="이메일" required hint="주문 확인·출고 안내를 보내 드립니다.">
              <input name="buyerEmail" type="email" className={inputCls} value={form.buyerEmail} onChange={set("buyerEmail")} autoComplete="email" placeholder="example@company.com" maxLength={100} />
            </Field>
            <Field label="회사명">
              <input name="buyerCompany" className={inputCls} value={form.buyerCompany} onChange={set("buyerCompany")} autoComplete="organization" placeholder="(주) 회사명" maxLength={60} />
            </Field>
          </div>

          <p className="text-xs text-ink-subtle mt-4">
            카드 결제는 카드 매출전표로 비용 처리할 수 있습니다. 같은 거래에 세금계산서를 따로 발행할 수 없어,
            세금계산서가 필요하면 <Link href="/support" className="text-accent hover:underline">견적 문의</Link>로 계좌이체 주문을 받습니다.
          </p>
        </section>

        {/* 배송지 */}
        <section className="bg-white rounded-2xl border border-silver-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink text-lg">배송지</h2>
            <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
              <input type="checkbox" checked={sameAsBuyer} onChange={(e) => setSameAsBuyer(e.target.checked)} className="accent-[#5B8DB8] w-4 h-4" />
              주문자와 같음
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!sameAsBuyer && (
              <>
                <Field label="받는 분" required>
                  <input name="recipientName" className={inputCls} value={form.recipientName} onChange={set("recipientName")} maxLength={30} />
                </Field>
                <Field label="연락처" required>
                  <input name="recipientPhone" className={inputCls} value={form.recipientPhone} onChange={set("recipientPhone")} inputMode="tel" placeholder="010-0000-0000" maxLength={13} />
                </Field>
              </>
            )}
            <div className="sm:col-span-2">
              <Field label="주소" required>
                <div className="flex gap-2">
                  <input name="postcode" className={cn(inputCls, "bg-silver-50 max-w-[9rem]")} value={form.postcode} readOnly placeholder="우편번호" tabIndex={-1} />
                  <PostcodeSearch onSelect={onAddress} />
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <input name="address1" className={cn(inputCls, "bg-silver-50")} value={form.address1} readOnly placeholder="주소 검색을 눌러 주세요" tabIndex={-1} />
              <input id="address2" name="address2" className={inputCls} value={form.address2} onChange={set("address2")} placeholder="상세주소 (동·호수, 공장동 등)" maxLength={100} autoComplete="address-line2" />
            </div>
            <div className="sm:col-span-2">
              <Field label="배송 요청사항">
                <input name="deliveryMemo" className={inputCls} value={form.deliveryMemo} onChange={set("deliveryMemo")} maxLength={100} placeholder="예) 평일 9~18시 수령 가능, 경비실 맡김" />
              </Field>
            </div>
          </div>
        </section>

        {/* 주문 제품 */}
        <section className="bg-white rounded-2xl border border-silver-100 p-6">
          <h2 className="font-bold text-ink text-lg mb-2">주문 제품</h2>
          {quoteError && <p className="text-sm text-red-500 mb-2">{quoteError}</p>}
          <ul className="divide-y divide-silver-100">
            {quote?.lines.map((l) => (
              <li key={l.sku} className="py-3 flex gap-4 items-center" data-testid="checkout-line">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{l.name || "판매 중지된 품목"}</p>
                  <p className="text-xs text-ink-muted">{l.optionLabel} · {l.quantity}개</p>
                  {l.problem && (
                    <p className="text-xs text-red-500">{l.problem === "insufficient" ? `남은 수량 ${l.available}개` : "품절·판매 중지"}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-ink tabular-nums">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          {blocked && (
            <p className="mt-3 text-sm text-red-500">
              구매할 수 없는 품목이 있습니다.{" "}
              {mode === "cart" ? <Link href="/cart" className="underline">장바구니에서 고치기</Link> : <Link href="/products/tube-standard" className="underline">다시 고르기</Link>}
            </p>
          )}
        </section>
      </div>

      {/* 결제 */}
      <div className="lg:sticky lg:top-24 space-y-4">
        <OrderSummary itemsTotal={quote?.itemsTotal ?? 0} shippingFee={quote?.shippingFee ?? 0} total={quote?.total ?? 0}>
          <div className="space-y-2.5 text-sm border-t border-silver-100 pt-4 mb-5">
            <label className="flex items-center gap-2 font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                className="accent-[#5B8DB8] w-4 h-4"
                checked={allAgreed}
                onChange={(e) => setAgree({ terms: e.target.checked, privacy: e.target.checked, thirdParty: e.target.checked })}
              />
              모두 동의합니다
            </label>
            {[
              { key: "terms" as const, label: "구매 조건·교환·반품 규정 확인", href: "/terms#purchase" },
              { key: "privacy" as const, label: "개인정보 수집·이용 동의", href: "/privacy" },
              { key: "thirdParty" as const, label: "결제대행·배송을 위한 개인정보 제공 동의", href: "/privacy" },
            ].map(({ key, label, href }) => (
              <label key={key} className="flex items-center gap-2 text-ink-muted cursor-pointer pl-1">
                <input
                  type="checkbox"
                  name={`agree-${key}`}
                  className="accent-[#5B8DB8] w-4 h-4"
                  checked={agree[key]}
                  onChange={(e) => {
                    setError("");
                    setAgree((a) => ({ ...a, [key]: e.target.checked }));
                  }}
                />
                <span className="flex-1">(필수) {label}</span>
                <Link href={href} target="_blank" className="text-xs text-accent hover:underline">보기</Link>
              </label>
            ))}
          </div>

          {error && (
            <p className="flex items-start gap-1.5 text-sm text-red-500 mb-3" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={submitting || blocked}
            className="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="pay"
          >
            <Lock className="w-4 h-4" />
            {submitting ? "결제창 여는 중…" : `${formatPrice(quote?.total ?? 0)} 결제하기`}
          </button>
          <p className="text-[11px] text-ink-subtle text-center mt-2">카드·간편결제 · 포트원 안전결제</p>
        </OrderSummary>
        <ShopPolicyNotice />
      </div>
    </div>
  );
}
