import Link from "next/link";
import { ArrowRight, Home, Package, Phone, Send } from "lucide-react";

/**
 * 404 화면 본문 (국·영·일) — 각 언어의 not-found.tsx 가 레이아웃(헤더·푸터) 안에서 그린다
 * 없는 주소는 언어별 [...missing] 경로가 notFound() 를 던져 여기로 온다
 */
const copy = {
  ko: {
    title: "페이지를 찾을 수 없습니다",
    body: "주소가 바뀌었거나 없어진 페이지입니다. 아래에서 찾으시는 내용으로 이동해 주세요.",
    links: [
      { href: "/", label: "홈", desc: "ATX 티타늄 주름관 첫 화면", Icon: Home },
      { href: "/products", label: "제품 소개", desc: "주름관·열교환기·폐열회수기·소켓", Icon: Package },
      { href: "/support", label: "견적 문의", desc: "규격·수량을 알려 주시면 회신드립니다", Icon: Send },
    ],
    call: "찾으시는 제품이 있으면 전화로 문의해 주세요",
    tel: "1544-1909",
    telHref: "tel:1544-1909",
  },
  en: {
    title: "Page not found",
    body: "The page may have moved or no longer exists. Try one of the links below.",
    links: [
      { href: "/en", label: "Home", desc: "ATX Titanium home page", Icon: Home },
      { href: "/en/products", label: "Products", desc: "Tubes, heat exchangers, waste heat recovery, sockets", Icon: Package },
      { href: "/en/support", label: "Request a Quote", desc: "Send us your specs and we will reply", Icon: Send },
    ],
    call: "Looking for a specific product? Call us",
    tel: "+82-1544-1909",
    telHref: "tel:+82-1544-1909",
  },
  ja: {
    title: "ページが見つかりません",
    body: "ページが移動または削除された可能性があります。以下のリンクからお探しください。",
    links: [
      { href: "/ja", label: "ホーム", desc: "ATX チタン波管トップページ", Icon: Home },
      { href: "/ja/products", label: "製品紹介", desc: "波管・熱交換器・廃熱回収装置・ソケット", Icon: Package },
      { href: "/ja/support", label: "お見積もり依頼", desc: "規格・数量をお知らせください", Icon: Send },
    ],
    call: "お探しの製品がございましたら、お電話でお問い合わせください",
    tel: "+82-1544-1909",
    telHref: "tel:+82-1544-1909",
  },
} as const;

export type NotFoundLocale = keyof typeof copy;

export const notFoundTitle = (locale: NotFoundLocale) => copy[locale].title;

export default function NotFoundContent({ locale }: { locale: NotFoundLocale }) {
  const t = copy[locale];
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">404 · Not Found</p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">{t.title}</h1>
          <p className="text-silver-500 text-lg max-w-2xl">{t.body}</p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          {t.links.map(({ href, label, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl border border-silver-100 p-6 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Icon className="w-6 h-6 text-accent mb-3" />
              <p className="font-bold text-ink mb-1 flex items-center gap-1">
                {label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </p>
              <p className="text-sm text-ink-subtle leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-muted flex flex-wrap items-center gap-2">
          <Phone className="w-4 h-4 text-accent" />
          {t.call}
          <a href={t.telHref} className="font-semibold text-ink hover:text-accent transition-colors">{t.tel}</a>
        </p>
      </div>
    </div>
  );
}
