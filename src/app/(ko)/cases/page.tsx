import type { Metadata } from "next";
import CasesCarousel from "./CasesCarousel";

export const metadata: Metadata = {
  title: "적용 사례",
  description: "화학플랜트, 반도체, 원자력, 해양수산 등 ATX 티타늄·특수비철 가공 납품 사례.",
};

const cases = [
  {
    id: 1,
    title: "NEX-REVO 향 티타늄 코일 열교환기",
    location: "일본 · NEX-REVO(株式会社ネクスレボ)",
    description: "고부식 유체 환경에서 사용되는 나선형 티타늄 주름관 열교환 코일. 도면 사양에 맞춘 다권·다열 코일 구조로 4대 세트 납품, 일본 현지 라인에 투입.",
    image: "/images/products/case-nexrevo-japan-4.jpg",
    tag: "해외 수출 · 일본",
  },
  {
    id: 2,
    title: "육상 양식장 해수 배관 시스템",
    location: "전남 여수",
    description: "PVC 배관의 잦은 크랙과 해수 부식 문제를 티타늄 주름관으로 해결. 설치 후 3년 이상 무교체 운영 중.",
    image: "/images/products/case-fish-farm-yeosu.jpg",
    tag: "수산·양식",
  },
  {
    id: 3,
    title: "활어 운반차 수조 배관",
    location: "활어 운반 전문 업체",
    description: "이동 중 진동과 해수 부식이 동시에 작용하는 가혹한 환경. 주름관의 유연성과 티타늄의 내식성으로 문제 해결.",
    image: "/images/products/case-fish-tank-truck.jpg",
    tag: "수산·물류",
  },
  {
    id: 4,
    title: "해수 사우나 온수 배관",
    location: "해수 찜질 시설",
    description: "고온 해수가 순환하는 배관, 일반 스테인리스 교체 주기 6개월. 티타늄 전환 후 부식 문제 완전 해소.",
    image: "/images/products/case-seawater-sauna.jpg",
    tag: "온천·찜질",
  },
];

export default function CasesPage() {
  return (
    <div className="pt-20 min-h-screen bg-ti-950">
      {/* Hero */}
      <div className="py-20 container-pad text-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Application Cases
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-6">
          ATX는 부식환경에서의 티타늄,<br className="hidden sm:block" />
          특수비철만을 전문으로 합니다.
        </h1>
        <p className="text-silver-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          화학플랜트, 반도체, 도금공정, 해양수산, 원자력 —<br className="hidden sm:block" />
          부식이 설비를 죽이는 환경에서, ATX 기술력은 이미 검증되었습니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-20">
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">일본 수출</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              NEX-REVO 코일 열교환기
              <br />
              <span className="text-silver-500 text-xs">해외 현지 라인 직납 실적</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">3년+</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              무교체 현장 다수
              <br />
              <span className="text-silver-500 text-xs">납품 후 재발주가 증명한다</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">100%</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              티타늄 소재
              <br />
              <span className="text-silver-500 text-xs">해수·고온·부식 환경 최적 소재</span>
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <CasesCarousel cases={cases} />

      {/* CTA */}
      <div className="py-20 container-pad text-center">
        <p className="text-silver-400 mb-2 text-lg font-semibold text-silver-200">
          귀사 설비의 부식 문제, 같이 보겠습니다.
        </p>
        <p className="text-silver-500 text-sm mb-8">
          소재 선정부터 가공 사양까지, 문제 환경에 맞는 답을 찾아드립니다.
        </p>
        <a href="/support" className="btn-primary text-base px-8 py-3">
          기술 상담 문의
        </a>
      </div>
    </div>
  );
}
