import { Truck } from "lucide-react";
import { formatDateTime, formatPhone, formatPrice, ORDER_STATUS_LABELS } from "@/lib/shop/format";
import type { PublicOrder } from "@/lib/shop/types";

/** 결제 완료·주문 조회 화면의 주문 내용 */
export default function OrderDetailCard({ order }: { order: PublicOrder }) {
  return (
    <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden" data-testid="order-card">
      <div className="bg-ti-950 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-silver-500 text-xs">주문번호</p>
          <p className="text-silver-200 font-mono font-bold tracking-wide" data-testid="order-no">{order.orderNo}</p>
        </div>
        <span className="text-xs font-semibold bg-accent/20 text-accent px-3 py-1 rounded-full" data-testid="order-status">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="p-6 space-y-6">
        <ul className="divide-y divide-silver-100">
          {order.items.map((i) => (
            <li key={i.sku} className="py-3 flex justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{i.name}</p>
                <p className="text-xs text-ink-muted">{i.optionLabel} · {i.quantity}개</p>
              </div>
              <p className="text-sm font-semibold text-ink tabular-nums whitespace-nowrap">{formatPrice(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="text-sm space-y-1.5 border-t border-silver-100 pt-4">
          <div className="flex justify-between"><dt className="text-ink-muted">제품 금액</dt><dd className="tabular-nums">{formatPrice(order.itemsTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-muted">배송비</dt><dd className="tabular-nums">{order.shippingFee ? formatPrice(order.shippingFee) : "무료"}</dd></div>
          <div className="flex justify-between font-bold text-ink"><dt>결제 금액 (부가세 포함)</dt><dd className="tabular-nums" data-testid="order-total">{formatPrice(order.totalAmount)}</dd></div>
          {order.payMethod && <div className="flex justify-between text-xs text-ink-subtle"><dt>결제 수단</dt><dd>{order.payMethod}{order.paidAt ? ` · ${formatDateTime(order.paidAt)}` : ""}</dd></div>}
        </dl>

        <div className="text-sm border-t border-silver-100 pt-4">
          <p className="font-semibold text-ink mb-1.5">배송지</p>
          <p className="text-ink-muted leading-relaxed">
            {order.recipientName} · {formatPhone(order.recipientPhone)}
            <br />[{order.postcode}] {order.address1} {order.address2}
            {order.deliveryMemo && <><br />요청사항: {order.deliveryMemo}</>}
          </p>
        </div>

        {order.trackingNumber && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-silver-50 rounded-xl px-4 py-3">
            <p className="text-sm text-ink flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              {order.courierName} · <span className="font-mono">{order.trackingNumber}</span>
            </p>
            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent hover:underline">
                배송 조회
              </a>
            )}
          </div>
        )}

        {order.cancelledAt && <p className="text-xs text-ink-subtle">취소 일시 {formatDateTime(order.cancelledAt)}</p>}
      </div>
    </div>
  );
}
