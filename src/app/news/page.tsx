import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "공지사항·뉴스",
  description: "ATX 티타늄 주름관 전시회 참가, 신제품 출시, 공지사항.",
};

const news = [
  {
    id: 1,
    category: "전시회",
    title: "2025 인천 INCHEM KOREA 전시회 참가 안내",
    date: "2025-11-05",
    excerpt:
      "ATX가 인천 송도 컨벤시아에서 열리는 INCHEM KOREA 2025에 참가합니다. 최신 티타늄 주름관 라인업과 열교환기 솔루션을 직접 확인하세요.",
    tag: "전시회",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/tube-coil.jpg",
  },
  {
    id: 2,
    category: "신제품",
    title: "Grade 9 (Ti-3Al-2.5V) 브레이드 주름관 출시",
    date: "2025-09-15",
    excerpt:
      "항공우주·방산 분야 고객 요구에 부응하여 Ti-3Al-2.5V (Grade 9) 브레이드형 주름관을 출시했습니다. 순수 티타늄 대비 30% 높은 강도를 제공합니다.",
    tag: "신제품",
    tagColor: "bg-green-100 text-green-700",
    image: "/images/products/tube-3.jpg",
  },
  {
    id: 3,
    category: "공지사항",
    title: "2025년 WEFTEC (미국 시카고) 참가 후기",
    date: "2025-10-20",
    excerpt:
      "세계 최대 수처리·환경 산업 전시회인 WEFTEC 2025에 참가하여 북미 시장 고객들에게 티타늄 주름관 솔루션을 소개했습니다.",
    tag: "전시회",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/heat-exchanger.jpg",
  },
  {
    id: 4,
    category: "인증",
    title: "ISO 9001:2015 인증 갱신 완료",
    date: "2025-08-01",
    excerpt:
      "ATX는 ISO 9001:2015 품질경영시스템 인증을 성공적으로 갱신했습니다. 지속적인 품질 향상과 고객 만족을 위해 노력하겠습니다.",
    tag: "인증",
    tagColor: "bg-amber-100 text-amber-700",
    image: "/images/products/tube-drawing.png",
  },
  {
    id: 5,
    category: "납품 사례",
    title: "국내 반도체 FAB 불산 이송 배관 500m 공급 완료",
    date: "2025-06-30",
    excerpt:
      "국내 주요 반도체 제조사의 세정 공정 불산 이송 배관 교체 프로젝트를 성공적으로 완료했습니다. Grade 1 티타늄 주름관 500m를 납품했습니다.",
    tag: "납품 사례",
    tagColor: "bg-purple-100 text-purple-700",
    image: "/images/products/tube-1.jpg",
  },
  {
    id: 6,
    category: "공지사항",
    title: "추석 연휴 생산 및 배송 일정 안내",
    date: "2025-09-01",
    excerpt:
      "2025년 추석 연휴 기간(9월 6일~9일) 중 생산 및 배송 일정을 안내드립니다. 긴급 건은 사전에 협의 부탁드립니다.",
    tag: "공지사항",
    tagColor: "bg-silver-100 text-ink-muted",
    image: null,
  },
];

export default function NewsPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            News & Notice
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            공지사항·뉴스
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            전시회 참가, 신제품 출시, 납품 사례 등 ATX의 최신 소식을 전합니다.
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["전체", "전시회", "신제품", "납품 사례", "인증", "공지사항"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat === "전체"
                  ? "bg-ti-950 text-silver-200"
                  : "bg-white text-ink-muted border border-silver-100 hover:bg-silver-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <article className="bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                {item.image && (
                  <div className="relative h-44 overflow-hidden bg-silver-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ti-950/30 to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1 text-ink-subtle text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>

                  <h2 className="font-bold text-ink text-base mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-ink-muted text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center text-accent text-sm font-semibold hover:gap-2 gap-1 transition-all">
                    자세히 보기 <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="btn-dark">
            더 보기
          </button>
        </div>
      </div>
    </div>
  );
}
