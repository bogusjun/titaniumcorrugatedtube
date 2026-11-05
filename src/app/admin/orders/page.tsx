"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search, Truck, XCircle } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { cn } from "@/lib/utils";
import { COURIERS, DEFAULT_COURIER } from "@/lib/shop/config";
import { formatDateTime, formatPhone, formatPrice, ORDER_STATUS_LABELS } from "@/lib/shop/format";
import type { OrderStatus } from "@/lib/shop/types";

/** 관리자 › 주문 관리 — 발송 처리(택배사·송장), 배송 상태, 메모, 취소·환불 */

type OrderItem = { id: string; sku: string; item_name: string; option_label: string; unit_price: number; quantity: number };
type Order = {
  id: string;
  order_no: string;
  status: OrderStatus;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  buyer_company: string;
  recipient_name: string;
  recipient_phone: string;
  postcode: string;
  address1: string;
  address2: string;
  delivery_memo: string;
  items_total: number;
  shipping_fee: number;
  total_amount: number;
  pay_method: string | null;
  paid_at: string | null;
  courier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  admin_memo: string;
  created_at: string;
  items: OrderItem[];
};

const TABS = [
  { key: "todo", label: "처리할 주문" },
  { key: "active", label: "결제 완료 전체" },
  { key: "shipped", label: "배송중" },
  { key: "cancelled", label: "취소" },
  { key: "unpaid", label: "미결제·만료" },
  { key: "all", label: "전체" },
];

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-silver-100 text-ink-muted",
  paid: "bg-blue-50 text-blue-700",
  preparing: "bg-amber-50 text-amber-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
  expired: "bg-silver-100 text-silver-500",
  failed: "bg-silver-100 text-silver-500",
};

const inputCls = "w-full px-3 py-2 rounded-lg border border-silver-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

export default function AdminOrdersPage() {
  const [tab, setTab] = useState("todo");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sp = new URLSearchParams({ status: tab, q: query, page: String(page) });
      const res = await fetch(`/api/admin/orders?${sp}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "주문을 불러오지 못했습니다.");
      setOrders(data.data);
      setTotal(data.total);
      setLimit(data.limit);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tab, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const replace = (o: Order) => setOrders((prev) => prev.map((p) => (p.id === o.id ? { ...o, items: o.items ?? p.items } : p)));
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
                setSelectedId(null);
              }}
              className={cn("px-3 py-1.5 rounded-lg text-sm font-medium", tab === t.key ? "bg-ti-950 text-white" : "bg-white border border-silver-100 text-ink-muted")}
            >
              {t.label}
            </button>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(q);
              setPage(1);
            }}
            className="ml-auto flex gap-2"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="주문번호·이름·회사·전화" className={cn(inputCls, "w-56")} />
            <button className="px-3 rounded-lg bg-white border border-silver-100" aria-label="검색"><Search className="w-4 h-4" /></button>
            <button type="button" onClick={load} className="px-3 rounded-lg bg-white border border-silver-100" aria-label="새로고침"><RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /></button>
          </form>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 items-start">
          <div className="bg-white rounded-xl border border-silver-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-silver-50 text-ink-subtle text-xs">
                <tr>
                  <th className="text-left px-3 py-2">주문</th>
                  <th className="text-left px-3 py-2">주문자</th>
                  <th className="text-right px-3 py-2">금액</th>
                  <th className="text-center px-3 py-2">상태</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-ink-subtle py-12">{loading ? "불러오는 중…" : "주문이 없습니다."}</td></tr>
                )}
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={cn("border-t border-silver-100 cursor-pointer hover:bg-silver-50", selectedId === o.id && "bg-accent/5")}
                    data-testid="admin-order-row"
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-mono text-xs font-semibold">{o.order_no}</p>
                      <p className="text-xs text-ink-subtle">{formatDateTime(o.created_at)}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p>{o.buyer_name}</p>
                      <p className="text-xs text-ink-subtle truncate max-w-[12rem]">{o.buyer_company || o.items?.[0]?.item_name}</p>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatPrice(o.total_amount)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_COLOR[o.status])}>{ORDER_STATUS_LABELS[o.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 py-3 border-t border-silver-100 text-sm">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-30">이전</button>
                <span className="text-ink-subtle">{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="disabled:opacity-30">다음</button>
              </div>
            )}
          </div>

          {selected ? (
            <OrderPanel key={selected.id} order={selected} onChange={replace} />
          ) : (
            <div className="bg-white rounded-xl border border-silver-100 p-8 text-center text-sm text-ink-subtle">주문을 고르면 자세한 내용이 여기 나옵니다.</div>
          )}
        </div>
      </div>
    </>
  );
}

function OrderPanel({ order, onChange }: { order: Order; onChange: (o: Order) => void }) {
  const paid = ["paid", "preparing", "shipped", "delivered"].includes(order.status);
  const open = !["cancelled", "expired", "failed"].includes(order.status);
  const [courier, setCourier] = useState(order.courier ?? DEFAULT_COURIER);
  const [tracking, setTracking] = useState(order.tracking_number ?? "");
  const [memo, setMemo] = useState(order.admin_memo);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [restock, setRestock] = useState(true);

  async function patch(body: Record<string, unknown>, done: string) {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "저장하지 못했습니다.");
      onChange(data);
      setMsg(done);
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!confirm(paid ? "결제 금액을 전액 환불하고 주문을 취소할까요?" : "주문을 취소할까요?")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, restock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "취소하지 못했습니다.");
      onChange(data.order);
      setMsg(data.refunded ? "취소하고 전액 환불했습니다." : "취소했습니다.");
      setCancelOpen(false);
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-silver-100 p-5 space-y-5 text-sm lg:sticky lg:top-4" data-testid="admin-order-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono font-bold">{order.order_no}</p>
          <p className="text-xs text-ink-subtle">주문 {formatDateTime(order.created_at)}{order.paid_at ? ` · 결제 ${formatDateTime(order.paid_at)}` : ""}</p>
        </div>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", STATUS_COLOR[order.status])}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>

      <ul className="divide-y divide-silver-100 border-y border-silver-100">
        {order.items.map((i) => (
          <li key={i.id} className="py-2 flex justify-between gap-3">
            <span>{i.item_name} <span className="text-ink-subtle">{i.option_label}</span> × {i.quantity}<span className="block text-[11px] text-silver-400 font-mono">{i.sku}</span></span>
            <span className="tabular-nums whitespace-nowrap">{formatPrice(i.unit_price * i.quantity)}</span>
          </li>
        ))}
        <li className="py-2 flex justify-between text-ink-muted"><span>배송비</span><span className="tabular-nums">{order.shipping_fee ? formatPrice(order.shipping_fee) : "무료"}</span></li>
        <li className="py-2 flex justify-between font-bold"><span>결제 금액</span><span className="tabular-nums">{formatPrice(order.total_amount)}</span></li>
      </ul>
      {order.pay_method && <p className="text-xs text-ink-subtle -mt-3">{order.pay_method}</p>}

      <div className="space-y-1">
        <p className="font-semibold">주문자</p>
        <p className="text-ink-muted">{order.buyer_name}{order.buyer_company ? ` · ${order.buyer_company}` : ""}<br />{formatPhone(order.buyer_phone)} · {order.buyer_email}</p>
      </div>
      <div className="space-y-1">
        <p className="font-semibold">배송지</p>
        <p className="text-ink-muted">{order.recipient_name} · {formatPhone(order.recipient_phone)}<br />[{order.postcode}] {order.address1} {order.address2}{order.delivery_memo && <><br />요청: {order.delivery_memo}</>}</p>
      </div>

      {paid && (
        <div className="space-y-2 border-t border-silver-100 pt-4">
          <p className="font-semibold flex items-center gap-1.5"><Truck className="w-4 h-4 text-accent" />발송</p>
          <div className="grid grid-cols-[8rem_1fr] gap-2">
            <select value={courier} onChange={(e) => setCourier(e.target.value)} className={inputCls} aria-label="택배사">
              {COURIERS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="송장번호" className={inputCls} name="tracking" />
          </div>
          <div className="flex flex-wrap gap-2">
            {order.status !== "shipped" && order.status !== "delivered" && (
              <button disabled={busy} onClick={() => patch({ courier, trackingNumber: tracking, status: "shipped" }, "발송 처리했습니다. 구매자에게 메일을 보냅니다.")} className="btn-primary text-sm py-2 px-4 disabled:opacity-50" data-testid="admin-ship">
                발송 처리
              </button>
            )}
            {order.status === "paid" && (
              <button disabled={busy} onClick={() => patch({ status: "preparing" }, "배송준비중으로 바꿨습니다.")} className="btn-dark text-sm py-2 px-4 disabled:opacity-50">배송준비중</button>
            )}
            {order.status === "shipped" && (
              <>
                <button disabled={busy} onClick={() => patch({ courier, trackingNumber: tracking }, "송장 정보를 고쳤습니다.")} className="btn-dark text-sm py-2 px-4 disabled:opacity-50">송장 수정</button>
                <button disabled={busy} onClick={() => patch({ status: "delivered" }, "배송완료로 바꿨습니다.")} className="btn-dark text-sm py-2 px-4 disabled:opacity-50">배송완료</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-silver-100 pt-4">
        <p className="font-semibold">관리자 메모</p>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} className={inputCls} maxLength={500} />
        <button disabled={busy || memo === order.admin_memo} onClick={() => patch({ adminMemo: memo }, "메모를 저장했습니다.")} className="text-sm font-semibold text-accent disabled:opacity-40">메모 저장</button>
      </div>

      {order.cancel_reason && <p className="text-xs text-red-600">취소 사유: {order.cancel_reason}</p>}

      {open && (
        <div className="border-t border-silver-100 pt-4">
          {!cancelOpen ? (
            <button onClick={() => setCancelOpen(true)} className="text-sm text-red-600 flex items-center gap-1.5"><XCircle className="w-4 h-4" />주문 취소{paid ? "·환불" : ""}</button>
          ) : (
            <div className="space-y-2">
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="취소 사유 (구매자 메일에 들어갑니다)" className={inputCls} maxLength={200} name="cancelReason" />
              <label className="flex items-center gap-2 text-ink-muted"><input type="checkbox" checked={restock} onChange={(e) => setRestock(e.target.checked)} />재고 되돌리기</label>
              <div className="flex gap-2">
                <button disabled={busy} onClick={cancel} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50" data-testid="admin-cancel">{paid ? "전액 환불하고 취소" : "취소"}</button>
                <button onClick={() => setCancelOpen(false)} className="px-4 py-2 rounded-lg border border-silver-100 text-sm">닫기</button>
              </div>
            </div>
          )}
        </div>
      )}

      {msg && <p className="text-sm text-accent" role="status">{msg}</p>}
    </div>
  );
}
