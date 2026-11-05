"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD, SHOP_PRODUCT_SLUGS } from "@/lib/shop/config";
import { formatPrice } from "@/lib/shop/format";

/**
 * 관리자 › 판매 품목·재고 — 가격(부가세 포함)·재고·판매 여부를 SKU 별로 관리
 * 「판매 중」을 켠 품목만 제품 페이지 구매 상자에 나온다(가격 0원이면 켤 수 없음).
 */

type Row = {
  id: string;
  sku: string;
  product_slug: string;
  name: string;
  option_label: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
  sort_order: number;
};

type Draft = { name: string; optionLabel: string; price: string; compareAtPrice: string; stock: string; sortOrder: string; isActive: boolean };

const PRODUCT_LABEL: Record<string, string> = { "tube-standard": "티타늄 주름관 표준품", socket: "주름관 소켓" };
const inputCls = "w-full px-2.5 py-1.5 rounded-md border border-silver-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

const toDraft = (r: Row): Draft => ({
  name: r.name,
  optionLabel: r.option_label,
  price: String(r.price),
  compareAtPrice: r.compare_at_price == null ? "" : String(r.compare_at_price),
  stock: String(r.stock),
  sortOrder: String(r.sort_order),
  isActive: r.is_active,
});

export default function AdminItemsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/items");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "품목을 불러오지 못했습니다.");
      return;
    }
    setRows(data.data);
    setDrafts(Object.fromEntries((data.data as Row[]).map((r) => [r.id, toDraft(r)])));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setDraft = (id: string, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  async function save(row: Row) {
    const d = drafts[row.id];
    setSavingId(row.id);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/admin/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          name: d.name,
          optionLabel: d.optionLabel,
          price: Number(d.price),
          compareAtPrice: d.compareAtPrice === "" ? null : Number(d.compareAtPrice),
          stock: Number(d.stock),
          sortOrder: Number(d.sortOrder),
          isActive: d.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "저장하지 못했습니다.");
      setRows((prev) => prev.map((r) => (r.id === row.id ? data : r)));
      setDrafts((prev) => ({ ...prev, [row.id]: toDraft(data) }));
      setMsg(`${row.sku} 저장했습니다. 제품 페이지에 바로 반영됩니다.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingId(null);
    }
  }

  const dirty = (r: Row) => JSON.stringify(drafts[r.id]) !== JSON.stringify(toDraft(r));

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold">판매 품목·재고</h1>
          <p className="text-sm text-ink-muted mt-1">
            가격은 부가세 포함 판매가입니다. 「판매 중」을 켠 품목만 제품 페이지에 구매 버튼이 나오고, 재고가 0이면 품절로 보입니다.
            결제창을 연 주문은 30분 동안 재고를 잡아 둡니다.
          </p>
        </div>

        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
        {msg && <p className="text-sm text-accent" role="status">{msg}</p>}

        {SHOP_PRODUCT_SLUGS.map((slug) => (
          <section key={slug} className="bg-white rounded-xl border border-silver-100 overflow-x-auto">
            <h2 className="px-4 py-3 font-semibold border-b border-silver-100">{PRODUCT_LABEL[slug]} <a href={`/products/${slug}`} target="_blank" className="text-xs text-accent font-normal ml-2">페이지 보기</a></h2>
            <table className="w-full text-sm min-w-[860px]">
              <thead className="bg-silver-50 text-ink-subtle text-xs">
                <tr>
                  <th className="text-left px-3 py-2 w-28">SKU</th>
                  <th className="text-left px-3 py-2">선택지 이름</th>
                  <th className="text-right px-3 py-2 w-28">판매가(원)</th>
                  <th className="text-right px-3 py-2 w-28">할인 전(원)</th>
                  <th className="text-right px-3 py-2 w-20">재고</th>
                  <th className="text-right px-3 py-2 w-16">순서</th>
                  <th className="text-center px-3 py-2 w-20">판매 중</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {rows.filter((r) => r.product_slug === slug).map((r) => {
                  const d = drafts[r.id];
                  if (!d) return null;
                  return (
                    <tr key={r.id} className="border-t border-silver-100 align-top" data-testid={`item-row-${r.sku}`}>
                      <td className="px-3 py-2 font-mono text-xs pt-3.5">{r.sku}</td>
                      <td className="px-3 py-2">
                        <input value={d.optionLabel} onChange={(e) => setDraft(r.id, { optionLabel: e.target.value })} className={inputCls} aria-label="선택지 이름" />
                        <input value={d.name} onChange={(e) => setDraft(r.id, { name: e.target.value })} className={cn(inputCls, "mt-1 text-xs text-ink-muted")} aria-label="품목 이름" />
                      </td>
                      <td className="px-3 py-2"><input name="price" inputMode="numeric" value={d.price} onChange={(e) => setDraft(r.id, { price: e.target.value.replace(/\D/g, "") })} className={cn(inputCls, "text-right")} aria-label="판매가" /></td>
                      <td className="px-3 py-2"><input inputMode="numeric" value={d.compareAtPrice} onChange={(e) => setDraft(r.id, { compareAtPrice: e.target.value.replace(/\D/g, "") })} className={cn(inputCls, "text-right")} placeholder="없음" aria-label="할인 전 가격" /></td>
                      <td className="px-3 py-2">
                        <input name="stock" inputMode="numeric" value={d.stock} onChange={(e) => setDraft(r.id, { stock: e.target.value.replace(/\D/g, "") })} className={cn(inputCls, "text-right", Number(d.stock) <= LOW_STOCK_THRESHOLD && "border-amber-300 bg-amber-50")} aria-label="재고" />
                      </td>
                      <td className="px-3 py-2"><input inputMode="numeric" value={d.sortOrder} onChange={(e) => setDraft(r.id, { sortOrder: e.target.value.replace(/\D/g, "") })} className={cn(inputCls, "text-right")} aria-label="정렬 순서" /></td>
                      <td className="px-3 py-2 text-center pt-3">
                        <input name="isActive" type="checkbox" checked={d.isActive} onChange={(e) => setDraft(r.id, { isActive: e.target.checked })} className="w-4 h-4 accent-[#5B8DB8]" aria-label="판매 중" />
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => save(r)} disabled={!dirty(r) || savingId === r.id} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-30" data-testid={`save-${r.sku}`}>
                          <Save className="w-3.5 h-3.5" />저장
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-ink-subtle border-t border-silver-100">
              현재 판매 중: {rows.filter((r) => r.product_slug === slug && r.is_active).map((r) => `${r.sku} ${formatPrice(r.price)}`).join(" · ") || "없음"}
            </p>
          </section>
        ))}

        <NewItemForm onCreated={load} />
      </div>
    </>
  );
}

function NewItemForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sku: "", productSlug: "socket", name: "주름관 소켓", optionLabel: "", price: "", stock: "0" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sku: form.sku.toUpperCase(), price: Number(form.price || 0), stock: Number(form.stock || 0), isActive: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "추가하지 못했습니다.");
      setForm({ sku: "", productSlug: form.productSlug, name: form.name, optionLabel: "", price: "", stock: "0" });
      setOpen(false);
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-semibold text-accent flex items-center gap-1.5">
        <Plus className="w-4 h-4" />새 판매 품목 추가 (예: 다른 길이·피팅)
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-silver-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <label>제품
        <select value={form.productSlug} onChange={(e) => setForm({ ...form, productSlug: e.target.value, name: PRODUCT_LABEL[e.target.value] })} className={inputCls}>
          {SHOP_PRODUCT_SLUGS.map((s) => <option key={s} value={s}>{PRODUCT_LABEL[s]}</option>)}
        </select>
      </label>
      <label>SKU (영문 대문자·숫자·-)
        <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} className={inputCls} placeholder="SK-TI-10A-F" />
      </label>
      <label>선택지 이름
        <input value={form.optionLabel} onChange={(e) => setForm({ ...form, optionLabel: e.target.value })} className={inputCls} placeholder='티타늄 · 10A (3/8") 암나사' />
      </label>
      <label>판매가(원, 부가세 포함)
        <input inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} className={inputCls} />
      </label>
      <label>재고
        <input inputMode="numeric" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })} className={inputCls} />
      </label>
      <div className="flex items-end gap-2">
        <button disabled={busy} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">추가 (판매 중지 상태로)</button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg border border-silver-100">닫기</button>
      </div>
      {error && <p className="sm:col-span-3 text-red-500">{error}</p>}
    </form>
  );
}
