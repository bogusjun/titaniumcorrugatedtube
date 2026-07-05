'use client';

import { useState, useEffect, useCallback } from 'react';

type OrderStatus = 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  payment_id: string;
  buyer_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  shipping_address: string | null;
  product_name: string;
  product_slug: string | null;
  size: string | null;
  quantity: number;
  amount: number;
  status: OrderStatus;
  memo: string | null;
  created_at: string;
}

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  paid: '결제완료',
  preparing: '준비중',
  shipped: '발송완료',
  delivered: '배송완료',
  cancelled: '취소',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  paid: 'bg-blue-50 text-blue-600 border-blue-200',
  preparing: 'bg-amber-50 text-amber-600 border-amber-200',
  shipped: 'bg-purple-50 text-purple-600 border-purple-200',
  delivered: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-[#F8F7F4] text-[#999] border-[#E8E4DC]',
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    if (res.ok) {
      const data = await res.json() as OrdersResponse;
      setOrders(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdating(id);
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
    setUpdating(null);
  }

  return (
    <>
      {/* 필터 바 */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-[#E8E4DC] rounded px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] bg-white"
        >
          <option value="">전체 상태</option>
          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <span className="text-xs text-[#999]">총 {total.toLocaleString()}건</span>
      </div>

      {loading ? (
        <p className="text-sm text-[#999]">불러오는 중...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#E8E4DC] rounded-lg p-12 text-center">
          <p className="text-sm text-[#999]">주문이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                updating={updating === order.id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-[#E8E4DC] rounded hover:border-[#1a1a1a] disabled:opacity-30 transition-colors"
              >
                이전
              </button>
              <span className="text-sm text-[#999]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-[#E8E4DC] rounded hover:border-[#1a1a1a] disabled:opacity-30 transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function OrderCard({
  order,
  updating,
  onStatusChange,
}: {
  order: Order;
  updating: boolean;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const statusColor = STATUS_COLORS[order.status] ?? STATUS_COLORS.paid;
  const date = new Date(order.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-[#E8E4DC] rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-[#999] font-mono">{order.payment_id}</p>
            <span className="text-xs text-[#999]">·</span>
            <p className="text-xs text-[#999]">{date}</p>
          </div>
          <p className="font-semibold text-[#1a1a1a]">{order.buyer_name}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-medium border px-2 py-1 rounded ${statusColor}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
            disabled={updating}
            className="border border-[#E8E4DC] rounded px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] bg-white disabled:opacity-50"
          >
            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <InfoRow label="상품" value={order.product_name} />
        <InfoRow
          label="금액"
          value={`${order.amount.toLocaleString()}원`}
        />
        <InfoRow label="사이즈" value={order.size ?? '—'} />
        <InfoRow label="수량" value={`${order.quantity}개`} />
        {order.buyer_phone && <InfoRow label="연락처" value={order.buyer_phone} />}
        {order.buyer_email && <InfoRow label="이메일" value={order.buyer_email} />}
        {order.shipping_address && (
          <div className="col-span-2">
            <InfoRow label="배송지" value={order.shipping_address} />
          </div>
        )}
        {order.memo && (
          <div className="col-span-2">
            <InfoRow label="메모" value={order.memo} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-[#999] w-14 shrink-0 pt-0.5">{label}</span>
      <span className="text-[#1a1a1a] text-sm">{value}</span>
    </div>
  );
}
