"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/shop/types";
import { MAX_QTY_PER_LINE } from "@/lib/shop/config";

/**
 * 장바구니 — 브라우저(localStorage)에 SKU·수량만 둔다. 가격·재고는 늘 서버에서 다시 계산한다(useQuote).
 * 「바로 구매」는 장바구니와 따로 sessionStorage 에 둔다.
 */
const STORAGE_KEY = "atx-cart-v1";
const BUY_NOW_KEY = "atx-buynow-v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  add: (item: CartItem) => void;
  setQuantity: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  removePurchased: (skus: string[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function read(storage: Storage | undefined, key: string): CartItem[] {
  try {
    const raw = storage?.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((i) => i && typeof i.sku === "string" && Number.isInteger(i.quantity) && i.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

function write(storage: Storage | undefined, key: string, items: CartItem[]) {
  try {
    storage?.setItem(key, JSON.stringify(items));
  } catch {
    // 사생활 보호 모드 등: 저장에 실패해도 지금 화면에서는 동작
  }
}

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(n) || 1));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage 는 브라우저에서만 읽을 수 있어 마운트 뒤 맞춘다
    setItems(read(globalThis.localStorage, STORAGE_KEY));
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(read(globalThis.localStorage, STORAGE_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = fn(prev);
      write(globalThis.localStorage, STORAGE_KEY, next);
      return next;
    });
  }, []);

  const add = useCallback(
    (item: CartItem) =>
      update((prev) => {
        const existing = prev.find((i) => i.sku === item.sku);
        if (existing) return prev.map((i) => (i === existing ? { ...i, quantity: clampQty(i.quantity + item.quantity) } : i));
        return [...prev, { sku: item.sku, quantity: clampQty(item.quantity) }];
      }),
    [update],
  );

  const setQuantity = useCallback(
    (sku: string, quantity: number) => update((prev) => prev.map((i) => (i.sku === sku ? { ...i, quantity: clampQty(quantity) } : i))),
    [update],
  );

  const remove = useCallback((sku: string) => update((prev) => prev.filter((i) => i.sku !== sku)), [update]);

  const removePurchased = useCallback(
    (skus: string[]) => update((prev) => prev.filter((i) => !skus.includes(i.sku))),
    [update],
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, count: items.reduce((sum, i) => sum + i.quantity, 0), hydrated, add, setQuantity, remove, removePurchased }),
    [items, hydrated, add, setQuantity, remove, removePurchased],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function setBuyNowItems(items: CartItem[]) {
  write(globalThis.sessionStorage, BUY_NOW_KEY, items);
}

export function getBuyNowItems(): CartItem[] {
  return read(globalThis.sessionStorage, BUY_NOW_KEY);
}

export function clearBuyNowItems() {
  try {
    globalThis.sessionStorage?.removeItem(BUY_NOW_KEY);
  } catch {
    // ignore
  }
}
