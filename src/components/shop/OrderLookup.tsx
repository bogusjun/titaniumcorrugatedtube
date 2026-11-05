"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OrderDetailCard from "@/components/shop/OrderDetailCard";
import type { PublicOrder } from "@/lib/shop/types";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder-silver-400";

/** 비회원 주문 조회 — 주문번호 + 주문자 휴대폰 번호 */
export default function OrderLookup() {
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<PublicOrder | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNo.trim() || !phone.trim()) {
      setError("주문번호와 휴대폰 번호를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrder(null);
        setError(data.error ?? "주문을 찾을 수 없습니다.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="bg-white rounded-2xl border border-silver-100 p-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
        <input
          name="orderNo"
          className={`${inputCls} font-mono uppercase`}
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="A261105-ABC123"
          aria-label="주문번호"
          maxLength={20}
        />
        <input
          name="phone"
          className={inputCls}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="주문자 휴대폰 010-0000-0000"
          inputMode="tel"
          aria-label="주문자 휴대폰 번호"
          maxLength={13}
        />
        <button type="submit" disabled={loading} className="btn-primary justify-center disabled:opacity-50">
          <Search className="w-4 h-4" />
          {loading ? "조회 중…" : "조회"}
        </button>
        {error && <p className="sm:col-span-3 text-sm text-red-500" role="alert">{error}</p>}
      </form>
      {order && <OrderDetailCard order={order} />}
    </div>
  );
}
