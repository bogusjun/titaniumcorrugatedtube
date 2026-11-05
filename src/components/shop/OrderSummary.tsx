import { FREE_SHIPPING_THRESHOLD } from "@/lib/shop/config";
import { formatPrice } from "@/lib/shop/format";

/** 장바구니·결제 화면 오른쪽의 금액 요약 */
export default function OrderSummary({
  itemsTotal,
  shippingFee,
  total,
  children,
}: {
  itemsTotal: number;
  shippingFee: number;
  total: number;
  children?: React.ReactNode;
}) {
  const remain = FREE_SHIPPING_THRESHOLD - itemsTotal;
  return (
    <div className="bg-white rounded-2xl border border-silver-100 p-6">
      <h2 className="font-bold text-ink text-lg mb-4">결제 금액</h2>
      <dl className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <dt className="text-ink-muted">제품 금액</dt>
          <dd className="text-ink tabular-nums">{formatPrice(itemsTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">배송비</dt>
          <dd className="text-ink tabular-nums">{shippingFee ? formatPrice(shippingFee) : itemsTotal > 0 ? "무료" : "-"}</dd>
        </div>
        {shippingFee > 0 && remain > 0 && (
          <p className="text-xs text-accent">{formatPrice(remain)} 더 담으면 배송비 무료</p>
        )}
      </dl>
      <div className="flex justify-between items-baseline border-t border-silver-100 pt-4 mb-5">
        <span className="font-bold text-ink">합계</span>
        <span className="text-2xl font-black text-ink tabular-nums" data-testid="summary-total">{formatPrice(total)}</span>
      </div>
      <p className="text-[11px] text-ink-subtle -mt-3 mb-5 text-right">부가세 포함</p>
      {children}
    </div>
  );
}
