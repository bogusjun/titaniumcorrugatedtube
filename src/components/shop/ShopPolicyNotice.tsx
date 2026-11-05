import Link from "next/link";
import { Truck, RotateCcw, Receipt } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, SHOP_CONTACT } from "@/lib/shop/config";
import { formatPrice } from "@/lib/shop/format";

/**
 * 배송·교환·반품·세금계산서 안내 — 구매 상자·장바구니·결제 화면 공통
 * 값은 @/lib/shop/config 와 이용약관(구매 조항)과 일치해야 한다.
 */
export default function ShopPolicyNotice({ compact = false }: { compact?: boolean }) {
  const rows = [
    {
      Icon: Truck,
      title: "배송",
      body: `${formatPrice(SHIPPING_FEE)} · ${formatPrice(FREE_SHIPPING_THRESHOLD)} 이상 무료. 결제 확인 후 영업일 기준 1~2일 안에 출고(택배).`,
    },
    {
      Icon: RotateCcw,
      title: "교환·반품",
      body: "받은 날부터 7일 안에 신청. 사용하거나 절단·가공한 제품은 반품할 수 없습니다. 단순 변심은 왕복 배송비를 부담합니다.",
    },
    {
      Icon: Receipt,
      title: "지출증빙",
      body: "카드 결제는 카드 매출전표로 비용 처리할 수 있습니다(같은 거래에 세금계산서 중복 발행 불가). 세금계산서가 필요하면 견적 문의로 계좌이체 주문을 받습니다.",
    },
  ];
  return (
    <div className={compact ? "space-y-2" : "space-y-3 bg-silver-50 rounded-xl p-4"}>
      {rows.map(({ Icon, title, body }) => (
        <p key={title} className="flex gap-2 text-xs text-ink-subtle leading-relaxed">
          <Icon className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
          <span>
            <span className="font-semibold text-ink-muted">{title}</span> {body}
          </span>
        </p>
      ))}
      {!compact && (
        <p className="text-xs text-ink-subtle">
          자세한 내용은 <Link href="/terms#purchase" className="text-accent hover:underline">이용약관 구매 조항</Link>을 참고하시고, 궁금한 점은 {SHOP_CONTACT.phone}로 문의해 주세요.
        </p>
      )}
    </div>
  );
}
