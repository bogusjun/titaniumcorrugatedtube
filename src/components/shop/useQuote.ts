"use client";

import { useEffect, useState } from "react";
import type { CartItem, Quote } from "@/lib/shop/types";

/** 장바구니 항목의 지금 가격·재고·배송비를 서버에서 계산해 온다 */
export function useQuote(items: CartItem[], enabled = true) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const key = JSON.stringify(items.map((i) => [i.sku, i.quantity]));

  useEffect(() => {
    if (!enabled) return;
    if (items.length === 0) {
      setQuote(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "장바구니 정보를 불러오지 못했습니다.");
        setQuote(data);
        setError("");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 150);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return { quote, loading, error };
}
