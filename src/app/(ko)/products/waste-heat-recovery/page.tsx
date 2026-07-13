import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TabWrapper from "./TabWrapper";
import {
  CheckCircle2,
  Phone,
  ArrowRight,
  Zap,
  Thermometer,
  Award,
  AlertTriangle,
  Fish,
  Droplets,
  RotateCcw,
  ShieldCheck,
  TrendingDown,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "양식장 폐열회수기 | 무동력 82% 열에너지 회수",
  description:
    "버리는 폐수에서 평균 82% 열에너지 회수. 100% 티타늄 주름관 구조로 부식·막힘 없는 양식장 전기요금 절감 솔루션. KOMERI 공인 시험 완료, 특허 출원.",
  alternates: {
    canonical: "https://www.atx-titanium.co.kr/products/waste-heat-recovery",
  },
  openGraph: {
    title: "양식장 폐열회수기 | 무동력 82% 열에너지 회수 — ATX 티타늄",
    description:
      "버리는 폐수에서 평균 82% 열에너지 회수. 100% 티타늄 주름관 구조로 부식·막힘 없는 양식장 전기요금 절감 솔루션.",
    url: "https://www.atx-titanium.co.kr/products/waste-heat-recovery",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "ATX 양식장 폐열회수기" }],
  },
};

/* ─────────────────────────────────────────────
   데이터
───────────────────────────────────────────── */

const flowWinter = [
  {
    icon: Droplets,
    label: "바다 (겨울철)",
    temp: "5°C",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
    labelColor: "text-blue-400",
    tempColor: "text-blue-700",
    subColor: "text-blue-400",
  },
  {
    icon: RotateCcw,
    label: "폐열회수기",
    temp: "5°C → 17.3°C",
    sub: "12.3°C 열 회수",
    color: "bg-accent/10 border-accent",
    iconColor: "text-accent",
    labelColor: "text-accent",
    tempColor: "text-accent-dark",
    subColor: "text-accent",
    highlight: true,
  },
  {
    icon: Flame,
    label: "히트펌프",
    temp: "17.3°C → 20°C",
    sub: "2.7°C만 추가 가온",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-500",
    labelColor: "text-orange-400",
    tempColor: "text-orange-700",
    subColor: "text-orange-400",
  },
  {
    icon: Fish,
    label: "양식장",
    temp: "20°C 유지",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-500",
    labelColor: "text-emerald-400",
    tempColor: "text-emerald-700",
    subColor: "text-emerald-400",
  },
];

const flowSummer = [
  {
    icon: Droplets,
    label: "바다 (여름철)",
    temp: "29°C",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-400",
    labelColor: "text-red-400",
    tempColor: "text-red-600",
    subColor: "text-red-400",
  },
  {
    icon: RotateCcw,
    label: "폐열회수기",
    temp: "29°C → 16.5°C",
    sub: "12.5°C 냉기 회수",
    color: "bg-accent/10 border-accent",
    iconColor: "text-accent",
    labelColor: "text-accent",
    tempColor: "text-accent-dark",
    subColor: "text-accent",
    highlight: true,
  },
  {
    icon: Flame,
    label: "히트펌프",
    temp: "16.5°C → 14°C",
    sub: "2.5°C만 추가 냉각",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "text-cyan-500",
    labelColor: "text-cyan-500",
    tempColor: "text-cyan-700",
    subColor: "text-cyan-500",
  },
  {
    icon: Fish,
    label: "양식장",
    temp: "14°C 유지",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-500",
    labelColor: "text-emerald-400",
    tempColor: "text-emerald-700",
    subColor: "text-emerald-400",
  },
];

const case1 = {
  region: "전북 나주",
  name: "나주 대○수산",
  species: "장어 (요구수온 17°C)",
  capacity: "20ton급 폐열회수기 2대 설치",
  rows: [
    {
      season: "여름",
      before: "히트펌프로 하루 500톤의\n29°C 이상 지하수를 17°C로 냉각",
      after: "폐열회수기로 냉기 회수\n히트펌프 가동 대폭 절감",
      saving: null,
    },
    {
      season: "겨울",
      before: "히트펌프·전기보일러로 하루 500톤의\n10°C 지하수를 17°C로 가온",
      after: "폐열회수기로 열 회수\n히트펌프·보일러 부담 대폭 절감",
      saving: null,
    },
  ],
};

const case2 = {
  region: "전북 고창",
  name: "고창 해성수산",
  species: "가리비 (요구수온 20°C)",
  rows: [
    {
      season: "여름",
      before: "히트펌프로 하루 600톤의\n29°C 이상 해수를 12°C 냉각",
      after: "폐열회수기로 9.5°C 냉기 회수\n히트펌프로 2.5°C만 냉각",
      saving: "월 411만원",
    },
    {
      season: "겨울",
      before: "히트펌프로 하루 600톤의\n4°C 해수를 13°C 가온",
      after: "폐열회수기로 10.5°C 열 회수\n히트펌프로 2.5°C만 가온",
      saving: "월 445만원",
    },
  ],
};

const case3 = {
  region: "강원도",
  name: "강원도 동○수산",
  species: "가리비 (요구수온 5°C)",
  intro: "봄·여름·가을 히트펌프로 해수를 5°C 냉각",
  result: "폐열회수기로 82% 냉기 회수 후 히트펌프로 18%만 추가 냉각",
  saving: "월 절감 효과 확인",
};

const certStats = [
  { value: "82.31%", label: "평균 폐열 회수 효율", sub: "3회 반복 시험 평균" },
  { value: "100%", label: "티타늄 소재", sub: "내·외부 전체 적용" },
  { value: "무동력", label: "100% 작동", sub: "전기 증설 불필요" },
  { value: "특허", label: "등록 완료", sub: "특허청 등록" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "티타늄 내식성",
    desc: "해수 환경에서 우수한 내식성을 가진 순수 티타늄 소재 (Ti Grade 2). 스테인리스 대비 월등한 내해수 성능.",
  },
  {
    icon: Zap,
    title: "무동력 운전",
    desc: "동력 장치 없어 고장 요소 없음. 별도 전기 증설 불필요. (역세용 공압 펌프·컨트롤러 제외)",
  },
  {
    icon: RotateCcw,
    title: "자동 역세 시스템",
    desc: "공압 펌프 가압 기능으로 이물질·물때 자동 제거·관리",
  },
  {
    icon: TrendingDown,
    title: "월 400만원 이상 절감",
    desc: "실 도입 사례 기준. 여름·겨울 냉·가온 모두 효과 검증",
  },
];

/* ─────────────────────────────────────────────
   컴포넌트
───────────────────────────────────────────── */

function ProductContent() {
  return (
    <div className="min-h-screen bg-ti-950">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-ti-950 via-ti-900 to-ti-950" />
        {/* 금속 광택 라인 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        {/* 배경 장식 원 */}
        <div className="absolute right-0 top-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl" />

        <div className="relative container-pad">
          <div className="max-w-4xl">
            <span className="section-label">
              <span className="w-5 h-px bg-accent inline-block" />
              양식장 에너지 절감 솔루션
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              버리는 물에서{" "}
              <span className="text-accent-glow">평균 82%</span>{" "}
              열 회수
            </h1>

            <p className="text-xl md:text-2xl font-bold text-silver-200 mb-3">
              무동력 작동 · 100% 티타늄 · 자동 역세
            </p>
            <p className="text-silver-400 text-base md:text-lg mb-10 max-w-2xl leading-relaxed">
              매년 높아지는 전기요금, 버려지는 에너지를 아직도 그냥 흘려보내고 있나요?<br />
              ATX 티타늄 주름관 폐열회수기로 냉각·가온 비용을 대폭 줄이세요.
            </p>

            {/* 핵심 지표 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {certStats.map((s) => (
                <div key={s.value} className="card-dark p-4 text-center">
                  <p className="text-2xl md:text-3xl font-black text-accent mb-1">{s.value}</p>
                  <p className="text-silver-200 text-xs font-semibold">{s.label}</p>
                  <p className="text-silver-500 text-xs mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/support" className="btn-primary text-base py-4 px-8">
                견적 문의하기
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:1544-1909" className="btn-outline text-base py-4 px-8">
                <Phone className="w-4 h-4" />
                1544-1909 전화 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          문제 제기 — 기존 판형 폐열회수기의 한계
      ══════════════════════════════════════ */}
      <section className="section-dark border-t border-ti-800">
        <div className="container-pad">
          <div className="text-center mb-14">
            <span className="section-label justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
              기존 제품의 문제점
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              기존 판형 폐열회수기의 문제를{" "}
              <span className="text-accent">근본부터 해결했습니다</span>
            </h2>
            <p className="text-silver-400 text-base max-w-xl mx-auto">
              현장에서 직접 확인한 기존 제품의 3가지 구조적 한계 — ATX 티타늄 주름관이 어떻게 해결하는지 비교해보세요
            </p>
          </div>

          {/* 문제 1: 부식 */}
          <div className="bg-ti-900 border border-ti-800 rounded-2xl overflow-hidden mb-6">
            {/* 헤더 */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-ti-800">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/60 border border-red-700 flex items-center justify-center text-red-400 text-base font-black">01</span>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-0.5">기존 문제</p>
                <h3 className="text-white font-black text-xl">외부 철 부위 부식</h3>
              </div>
            </div>
            {/* 이미지 비교 영역 */}
            <div className="grid grid-cols-2 divide-x divide-ti-800">
              {/* 왼쪽: 기존 문제 */}
              <div className="flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    기존 판형 열교환기
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    <Image src="/images/products/whr/problem-plate-hx-rusted.jpg" alt="판형 열교환기 외부 철 부식" fill className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    <Image src="/images/products/whr/problem-corrosion-exterior.jpg" alt="해수 환경 부식 흘러내림" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-red-400 font-bold text-base mb-1">내부만 티타늄 — 외부는 철</p>
                  <p className="text-silver-400 text-base leading-relaxed">외부 철 부위가 해수 환경에서 산화·부식되어 기기 고장 원인이 됩니다.</p>
                </div>
              </div>
              {/* 오른쪽: ATX 해결 */}
              <div className="bg-gradient-to-b from-accent/10 to-transparent flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    ATX 티타늄 주름관 — 해결
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image src="/images/products/whr/whr-install-1.jpg" alt="ATX 티타늄 100% 내외부 적용" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-accent font-bold text-base mb-1">내·외부 100% 티타늄</p>
                  <p className="text-silver-300 text-base leading-relaxed">Ti Grade 2 소재로 해수 환경에서도 부식이 없어 장기 신뢰 사용이 가능합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 문제 2: 막힘 */}
          <div className="bg-ti-900 border border-ti-800 rounded-2xl overflow-hidden mb-6">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-ti-800">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/60 border border-red-700 flex items-center justify-center text-red-400 text-base font-black">02</span>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-0.5">기존 문제</p>
                <h3 className="text-white font-black text-xl">찌꺼기 막힘 발생</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-ti-800">
              <div className="flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    기존 판형 열교환기
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    <Image src="/images/products/whr/problem-clogging-plate.jpg" alt="판형 열교환기 판 사이 찌꺼기" fill className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                    <Image src="/images/products/whr/problem-clogging-inside.jpg" alt="내부 찌꺼기 퇴적 클로즈업" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-red-400 font-bold text-base mb-1">어류 배설물·슬러지로 막힘 발생</p>
                  <p className="text-silver-400 text-base leading-relaxed">판 사이 좁은 틈에 찌꺼기가 쌓여 흐름이 막힙니다. 연속 사용이 불가합니다.</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-accent/10 to-transparent flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    ATX 티타늄 주름관 — 해결
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image src="/images/products/whr/whr-install-haesung-1.jpg" alt="ATX 주름관 관통형 구조" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-accent font-bold text-base mb-1">막힘 없는 관통형 구조</p>
                  <p className="text-silver-300 text-base leading-relaxed">주름관 내부를 물이 직선으로 통과하는 구조로 슬러지가 정체되지 않습니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 문제 3: 번거로운 관리 */}
          <div className="bg-ti-900 border border-ti-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-ti-800">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/60 border border-red-700 flex items-center justify-center text-red-400 text-base font-black">03</span>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-0.5">기존 문제</p>
                <h3 className="text-white font-black text-xl">번거로운 관리</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-ti-800">
              <div className="flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    기존 판형 열교환기
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image src="/images/products/whr/problem-maintenance-disassembly.jpg" alt="판형 열교환기 완전 분해 청소 현장" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-red-400 font-bold text-base mb-1">1주일마다 완전 분해 청소 필요</p>
                  <p className="text-silver-400 text-base leading-relaxed">가동 중단·인건비 손실이 반복됩니다.</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-accent/10 to-transparent flex flex-col">
                <div className="px-4 pt-4 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    ATX 티타늄 주름관 — 해결
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image src="/images/products/whr/solution-backwash-controller.jpg" alt="ATX 자동 역세 컨트롤러" fill className="object-cover" />
                  </div>
                </div>
                <div className="px-4 pb-5 pt-1 mt-auto">
                  <p className="text-accent font-bold text-base mb-1">자동 역세 — 분해 청소 불필요</p>
                  <p className="text-silver-300 text-base leading-relaxed">타이머 제어 자동 역세장치가 주기적으로 이물질을 제거합니다. 장기 연속 가동이 가능합니다.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          작동 원리 — 계통도
      ══════════════════════════════════════ */}
      <section className="section-white">
        <div className="container-pad">
          <div className="text-center mb-10">
            <span className="section-label justify-center">
              <span className="w-5 h-px bg-accent inline-block" />
              작동 원리
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
              겨울에도, 여름에도 똑같이 작동합니다
            </h2>
            <p className="text-ink-subtle text-base max-w-2xl mx-auto">
              폐열회수기는 <span className="font-semibold text-ink">&lsquo;열의 방향&rsquo;만 다를 뿐, 원리는 동일합니다.</span><br />
              폐수에서 열을 뽑아 해수에 전달하는 비접촉 열교환 — 겨울엔 가온 에너지를, 여름엔 냉각 에너지를 절약합니다.
            </p>
          </div>

          {/* 핵심 원리 강조 배너 */}
          <div className="max-w-3xl mx-auto mb-10 bg-ti-950 rounded-2xl border border-accent/30 px-6 py-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-white font-black text-lg mb-0.5">열(Heat)은 방향만 다를 뿐 — 원리는 365일 동일</p>
              <p className="text-silver-400 text-sm leading-relaxed">
                겨울: 따뜻한 폐수 → 차가운 해수에 열 전달 → 가온 비용 절감<br />
                여름: 뜨거운 폐수 → 해수로 열 배출 → 냉각 비용 절감
              </p>
            </div>
          </div>

          {/* 겨울 / 여름 흐름도 나란히 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

            {/* 겨울 카드 */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-sm">
              <div className="bg-blue-950 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">❄️</span>
                <div>
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">겨울철 가온</p>
                  <p className="text-white font-black">해수온도 5°C → 양식장 수온 20°C 목표</p>
                </div>
              </div>
              <div className="p-5">
                {/* 흐름 스텝 — 가로 4칸 */}
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {flowWinter.map((step, i) => (
                    <div key={step.label} className="flex items-center">
                      <div className={`relative rounded-xl border-2 p-3 text-center flex-1 ${step.color} ${step.highlight ? "shadow-md shadow-accent/20 ring-2 ring-accent/40" : ""}`}>
                        {step.highlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            ATX
                          </span>
                        )}
                        <step.icon className={`w-5 h-5 mx-auto mb-1 ${step.iconColor}`} />
                        <p className={`text-[10px] font-semibold leading-tight mb-0.5 ${step.labelColor}`}>{step.label}</p>
                        <p className={`font-black text-xs leading-tight ${step.tempColor}`}>{step.temp}</p>
                        {step.sub && <p className={`text-[10px] leading-tight mt-0.5 ${step.subColor}`}>{step.sub}</p>}
                      </div>
                      {i < flowWinter.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-silver-300 flex-shrink-0 mx-0.5" />
                      )}
                    </div>
                  ))}
                </div>
                {/* 수치 요약 */}
                <div className="bg-blue-50 rounded-xl px-4 py-3 grid grid-cols-3 text-center divide-x divide-blue-200">
                  <div className="pr-2">
                    <p className="text-blue-500 text-xs font-semibold mb-0.5">폐열회수기 기여</p>
                    <p className="text-blue-700 font-black text-2xl">12.3°C</p>
                    <p className="text-blue-400 text-xs">총 15°C 중 82%</p>
                  </div>
                  <div className="px-2">
                    <p className="text-blue-500 text-xs font-semibold mb-0.5">히트펌프 추가</p>
                    <p className="text-orange-500 font-black text-2xl">2.7°C</p>
                    <p className="text-blue-400 text-xs">18%만 가동</p>
                  </div>
                  <div className="pl-2">
                    <p className="text-blue-500 text-xs font-semibold mb-0.5">전기요금 절감</p>
                    <p className="text-emerald-600 font-black text-2xl">80%+</p>
                    <p className="text-blue-400 text-xs">가온 비용 대비</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 여름 카드 */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-sm">
              <div className="bg-orange-950 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-0.5">여름철 냉각</p>
                  <p className="text-white font-black">해수온도 29°C → 양식장 수온 14°C 목표</p>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {flowSummer.map((step, i) => (
                    <div key={step.label} className="flex items-center">
                      <div className={`relative rounded-xl border-2 p-3 text-center flex-1 ${step.color} ${step.highlight ? "shadow-md shadow-accent/20 ring-2 ring-accent/40" : ""}`}>
                        {step.highlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            ATX
                          </span>
                        )}
                        <step.icon className={`w-5 h-5 mx-auto mb-1 ${step.iconColor}`} />
                        <p className={`text-[10px] font-semibold leading-tight mb-0.5 ${step.labelColor}`}>{step.label}</p>
                        <p className={`font-black text-xs leading-tight ${step.tempColor}`}>{step.temp}</p>
                        {step.sub && <p className={`text-[10px] leading-tight mt-0.5 ${step.subColor}`}>{step.sub}</p>}
                      </div>
                      {i < flowSummer.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-silver-300 flex-shrink-0 mx-0.5" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-orange-50 rounded-xl px-4 py-3 grid grid-cols-3 text-center divide-x divide-orange-200">
                  <div className="pr-2">
                    <p className="text-orange-500 text-xs font-semibold mb-0.5">폐열회수기 기여</p>
                    <p className="text-orange-600 font-black text-2xl">12.5°C</p>
                    <p className="text-orange-400 text-xs">총 15°C 중 83%</p>
                  </div>
                  <div className="px-2">
                    <p className="text-orange-500 text-xs font-semibold mb-0.5">히트펌프 추가</p>
                    <p className="text-cyan-600 font-black text-2xl">2.5°C</p>
                    <p className="text-orange-400 text-xs">17%만 가동</p>
                  </div>
                  <div className="pl-2">
                    <p className="text-orange-500 text-xs font-semibold mb-0.5">전기요금 절감</p>
                    <p className="text-emerald-600 font-black text-2xl">80%+</p>
                    <p className="text-orange-400 text-xs">냉각 비용 대비</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 실제 시스템 계통도 이미지 */}
          <div className="max-w-3xl mx-auto mb-10 bg-white rounded-2xl border border-silver-100 overflow-hidden shadow-sm">
            <div className="bg-ti-950 px-5 py-3 flex items-center gap-2">
              <span className="w-4 h-px bg-accent inline-block" />
              <p className="text-silver-200 text-sm font-bold">실제 시스템 계통도 — 해수·폐수 흐름 및 가온 장치 구성</p>
            </div>
            <div className="p-6 bg-white flex justify-center">
              <Image
                src="/images/products/whr/whr-system-diagram.png"
                alt="ATX 폐열회수기 시스템 계통도 — 폐수온도 17°C 입구, 비접촉 열교환, 해수 31°C→20°C 회수, 가온장치 연결"
                width={2400}
                height={1718}
                className="w-full h-auto max-w-xl"
              />
            </div>
            <div className="bg-silver-50 px-5 py-2.5 border-t border-silver-100">
              <p className="text-xs text-ink-subtle text-center">폐수 17°C → 비접촉 열교환 → 해수 31°C를 20°C로 회수 / 부족분은 가온장치로 추가 가온</p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          4가지 핵심 강점
      ══════════════════════════════════════ */}
      <section className="section-dark border-t border-ti-800">
        <div className="container-pad">
          <div className="text-center mb-14">
            <span className="section-label justify-center">
              <span className="w-5 h-px bg-accent inline-block" />
              제품 강점
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              ATX 특허 주름관 폐열회수기만의{" "}
              <span className="text-accent">차별점</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-dark p-6 group hover:border-accent/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-silver-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          도입 사례
      ══════════════════════════════════════ */}
      <section className="section-light border-t border-silver-100">
        <div className="container-pad">
          <div className="text-center mb-14">
            <span className="section-label justify-center">
              <span className="w-5 h-px bg-accent inline-block" />
              실제 도입 사례
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">
              실제 양식장에서 검증된{" "}
              <span className="text-accent">절감 효과</span>
            </h2>
            <p className="text-ink-subtle text-base max-w-xl mx-auto">
              숫자로 증명하는 ATX 폐열회수기 도입 성과
            </p>
          </div>

          {/* 사례 1: 나주 대○수산 */}
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-6 shadow-sm">
            <div className="bg-ti-950 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-accent text-xs font-bold uppercase tracking-wider">도입사례 1</span>
                <h3 className="text-white font-black text-xl mt-0.5">{case1.name}</h3>
              </div>
              <span className="text-silver-400 text-sm">{case1.species} / {case1.region}</span>
            </div>
            <div className="px-6 py-3 bg-ti-900/50 border-b border-silver-100">
              <p className="text-silver-300 text-xs font-semibold">{case1.capacity}</p>
            </div>
            {/* 현장 사진 */}
            <div className="grid grid-cols-2 gap-1 border-b border-silver-100">
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-daea-wide.jpg"
                  alt="나주 대아수산 폐열회수기 2대 설치 현장"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-1.jpg"
                  alt="나주 대아수산 폐열회수기 배관 상세"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-silver-50 border-b border-silver-100">
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider w-20">계절</th>
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider">도입 전</th>
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider">도입 후</th>
                  </tr>
                </thead>
                <tbody>
                  {case1.rows.map((row) => (
                    <tr key={row.season} className="border-b border-silver-100 last:border-0">
                      <td className="px-4 py-5 align-top w-24">
                        {row.season === "여름" ? (
                          <div className="inline-flex flex-col items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 min-w-[60px]">
                            <span className="text-xl">☀️</span>
                            <span className="text-orange-600 text-xs font-black">여름</span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 min-w-[60px]">
                            <span className="text-xl">❄️</span>
                            <span className="text-blue-600 text-xs font-black">겨울</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="text-ink-subtle text-sm leading-relaxed whitespace-pre-line">{row.before}</p>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="text-ink text-sm leading-relaxed font-medium whitespace-pre-line">{row.after}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-accent/5 border-t border-silver-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
              <p className="text-sm text-ink-muted">2년째 사용 중 — 현장 실사 가능</p>
            </div>
          </div>

          {/* 사례 2: 고창 해○수산 */}
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-6 shadow-sm">
            <div className="bg-ti-950 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-accent text-xs font-bold uppercase tracking-wider">도입사례 2</span>
                <h3 className="text-white font-black text-xl mt-0.5">{case2.name}</h3>
              </div>
              <span className="text-silver-400 text-sm">{case2.species} / {case2.region}</span>
            </div>
            {/* 현장 사진 */}
            <div className="grid grid-cols-2 gap-1 border-b border-silver-100">
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-haesung-1.jpg"
                  alt="고창 해성수산 폐열회수기 설치 현장"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-haesung-2.jpg"
                  alt="고창 해성수산 폐열회수기 설치 현장"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-silver-50 border-b border-silver-100">
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider w-20">계절</th>
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider">도입 전</th>
                    <th className="text-left px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider">도입 후</th>
                    <th className="text-right px-6 py-3 text-ink-subtle text-xs font-semibold uppercase tracking-wider">절감 효과</th>
                  </tr>
                </thead>
                <tbody>
                  {case2.rows.map((row) => (
                    <tr key={row.season} className="border-b border-silver-100 last:border-0">
                      <td className="px-4 py-5 align-top w-24">
                        {row.season === "여름" ? (
                          <div className="inline-flex flex-col items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 min-w-[60px]">
                            <span className="text-xl">☀️</span>
                            <span className="text-orange-600 text-xs font-black">여름</span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 min-w-[60px]">
                            <span className="text-xl">❄️</span>
                            <span className="text-blue-600 text-xs font-black">겨울</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="text-ink-subtle text-sm leading-relaxed whitespace-pre-line">{row.before}</p>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="text-ink text-sm leading-relaxed font-medium whitespace-pre-line">{row.after}</p>
                      </td>
                      <td className="px-6 py-5 align-top text-right">
                        <span className="text-2xl font-black text-accent">{row.saving}</span>
                        <p className="text-ink-subtle text-xs mt-0.5">절감 효과</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-accent/5 border-t border-silver-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
              <p className="text-sm text-ink-muted">2년째 사용 중 — 현장 운용 검증 완료</p>
            </div>
          </div>

          {/* 사례 3: 강원도 동○수산 */}
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden shadow-sm">
            <div className="bg-ti-950 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-accent text-xs font-bold uppercase tracking-wider">도입사례 3</span>
                <h3 className="text-white font-black text-xl mt-0.5">{case3.name}</h3>
              </div>
              <span className="text-silver-400 text-sm">{case3.species} / {case3.region}</span>
            </div>
            {/* 현장 사진 */}
            <div className="grid grid-cols-3 gap-1 border-b border-silver-100">
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-gwangcheon.png"
                  alt="강원도 동○수산 폐열회수기 설치 현장"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-install-donghae-2.jpg"
                  alt="강원도 동○수산 폐열회수기 설치 현장"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48">
                <Image
                  src="/images/products/whr/whr-temp-data-gwangcheon.png"
                  alt="광천 온도 데이터"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-silver-100 flex items-center justify-center text-ink-subtle text-xs font-bold">전</span>
                  <p className="text-ink-subtle text-sm leading-relaxed">{case3.intro}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">후</span>
                  <p className="text-ink text-sm leading-relaxed font-medium">{case3.result}</p>
                </div>
              </div>
              <div className="bg-silver-50 rounded-xl p-5 text-center border border-silver-100">
                <p className="text-silver-500 text-xs font-semibold uppercase tracking-wider mb-2">성능 확인서 발급</p>
                <p className="text-3xl font-black text-accent mb-1">82%</p>
                <p className="text-ink-subtle text-sm">냉기 회수 후 히트펌프<br />18%만 추가 냉각</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          사용자 인터뷰
      ══════════════════════════════════════ */}
      <section className="section-dark border-t border-ti-800">
        <div className="container-pad">
          <div className="text-center mb-14">
            <span className="section-label justify-center">
              <span className="w-5 h-px bg-accent inline-block" />
              실제 사용자 인터뷰
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              도입한 분들이{" "}
              <span className="text-accent">직접 말합니다</span>
            </h2>
            <p className="text-silver-400 text-base max-w-xl mx-auto">
              홍보 문구가 아닌, 실제 양식장 운영자의 목소리입니다
            </p>
          </div>

          {/* 해성수산 — 도입 초기 → 1년 후 재방문 스토리 */}
          <div className="bg-ti-900 border border-ti-700 rounded-2xl overflow-hidden mb-8">
            {/* 헤더 */}
            <div className="px-6 py-5 border-b border-ti-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-accent text-xs font-bold uppercase tracking-wider">고창 해성수산 · 가리비 양식</span>
                <h3 className="text-white font-black text-xl mt-1">도입 초기도, 1년 후에도 — 변함없는 만족</h3>
              </div>
              <div className="flex items-center gap-2 text-silver-400 text-xs">
                <span className="inline-flex items-center gap-1 bg-ti-800 border border-ti-600 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  2년째 운용 중
                </span>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="px-6 pt-5 pb-2">
              <p className="text-silver-400 text-sm leading-relaxed">
                도입 직후 만족도와 1년 사용 후 만족도를 모두 담은 두 번의 방문 인터뷰입니다.
                <span className="text-silver-200 font-semibold"> 시간이 지나도 변하지 않는 신뢰</span>를 확인하세요.
              </p>
            </div>

            {/* 영상 2개 — 타임라인 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1차 인터뷰 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ti-800 border border-accent/40 flex items-center justify-center text-accent text-xs font-black">1차</span>
                  <div>
                    <p className="text-white font-bold text-sm">도입 초기 인터뷰</p>
                    <p className="text-silver-500 text-xs">2024년 4월 · 설치 직후 현장 방문</p>
                  </div>
                </div>
                <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{paddingTop: "56.25%"}}>
                  <iframe
                    src="https://player.vimeo.com/video/1204804693?badge=0&autopause=0&player_id=0&app_id=58479"
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title="해성수산 도입 초기 인터뷰"
                  />
                </div>
              </div>

              {/* 2차 인터뷰 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-black">2차</span>
                  <div>
                    <p className="text-white font-bold text-sm">1년 사용 후 재방문 인터뷰</p>
                    <p className="text-silver-500 text-xs">2024년 9월 · 여름·겨울 모두 경험 후</p>
                  </div>
                </div>
                <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{paddingTop: "56.25%"}}>
                  <iframe
                    src="https://player.vimeo.com/video/1025411104?badge=0&autopause=0&player_id=0&app_id=58479"
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title="해성수산 1년 사용 후 재방문 인터뷰"
                  />
                </div>
              </div>
            </div>

            {/* 연결 메시지 */}
            <div className="px-6 pb-6">
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-silver-200 text-sm leading-relaxed">
                  설치 직후 효과에 만족하여 겨울과 여름을 모두 경험한 후 다시 인터뷰에 응해주셨습니다.
                  <span className="text-white font-semibold"> 계절이 바뀌어도, 1년이 지나도 여전히 같은 평가입니다.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 동해상사 인터뷰 */}
          <div className="bg-ti-900 border border-ti-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-ti-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-accent text-xs font-bold uppercase tracking-wider">강원도 동해상사</span>
                <h3 className="text-white font-black text-xl mt-1">또 다른 현장의 목소리</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{paddingTop: "56.25%"}}>
                <iframe
                  src="https://player.vimeo.com/video/1025417162?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  title="동해상사 인터뷰"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          공인 시험 성적 — KOMERI
      ══════════════════════════════════════ */}
      <section className="section-dark border-t border-ti-800">
        <div className="container-pad">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-label justify-center">
                <Award className="w-3.5 h-3.5" />
                공인 성능 인증
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                해양기자재 전문 시험 기관<br />
                <span className="text-accent">한국조선해양기자재연구원</span>의<br />
                객관적 검증 완료
              </h2>
              <p className="text-silver-400 text-sm">시험성적서 번호: KOMERI-0314-24T1250-A</p>
            </div>

            {/* 시험 결과 테이블 */}
            <div className="bg-ti-900 rounded-2xl border border-ti-800 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-ti-800 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-accent" />
                <h3 className="text-silver-200 font-bold text-sm">폐열 회수 효율 시험 (17톤급, 10분 구동)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ti-700">
                      <th className="text-center py-3 px-4 text-silver-400 font-semibold">회차</th>
                      <th className="text-center py-3 px-4 text-silver-400 font-semibold">구분</th>
                      <th className="text-center py-3 px-4 text-silver-400 font-semibold">입구 온도 (°C)</th>
                      <th className="text-center py-3 px-4 text-silver-400 font-semibold">출구 온도 (°C)</th>
                      <th className="text-center py-3 px-4 text-silver-400 font-semibold">폐열 회수율</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ti-800">
                      <td className="text-center py-3 px-4 text-silver-200 font-semibold" rowSpan={2}>1회차</td>
                      <td className="text-center py-3 px-4 text-blue-400 font-medium">해수</td>
                      <td className="text-center py-3 px-4 text-silver-300">18.7°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">27.5°C</td>
                      <td className="text-center py-3 px-4 font-black text-accent text-base" rowSpan={2}>83.10%</td>
                    </tr>
                    <tr className="border-b border-ti-700 bg-ti-800/40">
                      <td className="text-center py-3 px-4 text-orange-400 font-medium">폐수</td>
                      <td className="text-center py-3 px-4 text-silver-300">29.5°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">20.8°C</td>
                    </tr>
                    <tr className="border-b border-ti-800">
                      <td className="text-center py-3 px-4 text-silver-200 font-semibold" rowSpan={2}>2회차</td>
                      <td className="text-center py-3 px-4 text-blue-400 font-medium">해수</td>
                      <td className="text-center py-3 px-4 text-silver-300">18.4°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">24.3°C</td>
                      <td className="text-center py-3 px-4 font-black text-accent text-base" rowSpan={2}>81.48%</td>
                    </tr>
                    <tr className="border-b border-ti-700 bg-ti-800/40">
                      <td className="text-center py-3 px-4 text-orange-400 font-medium">폐수</td>
                      <td className="text-center py-3 px-4 text-silver-300">25.5°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">19.7°C</td>
                    </tr>
                    <tr className="border-b border-ti-800">
                      <td className="text-center py-3 px-4 text-silver-200 font-semibold" rowSpan={2}>3회차</td>
                      <td className="text-center py-3 px-4 text-blue-400 font-medium">해수</td>
                      <td className="text-center py-3 px-4 text-silver-300">18.9°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">23.1°C</td>
                      <td className="text-center py-3 px-4 font-black text-accent text-base" rowSpan={2}>82.35%</td>
                    </tr>
                    <tr className="bg-ti-800/40">
                      <td className="text-center py-3 px-4 text-orange-400 font-medium">폐수</td>
                      <td className="text-center py-3 px-4 text-silver-300">24.0°C</td>
                      <td className="text-center py-3 px-4 text-silver-300">20.0°C</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-5 bg-accent/10 border-t border-ti-800 text-center">
                <p className="text-silver-300 text-sm mb-1">3회 구동 시 평균</p>
                <p className="text-4xl font-black text-accent">82.31%</p>
                <p className="text-silver-400 text-sm mt-1">폐열 회수 기능 확인</p>
              </div>
            </div>

            {/* 역세 성능 시험 */}
            <div className="bg-ti-900 rounded-2xl border border-ti-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-ti-800 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-accent" />
                <h3 className="text-silver-200 font-bold text-sm">역세장치 작동 시험</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-silver-300 text-sm">입구 라인 압력 <span className="text-white font-bold">10 kPa (0.1 bar) 감소</span> 확인</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-silver-300 text-sm">역세 전 149 kPa → 역세 후 139 kPa, <span className="text-white font-bold">슬러지 육안 확인</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-silver-300 text-sm">역세 동작 시 <span className="text-white font-bold">공압 펌프 가압(부스터) 기능 정상 작동</span> 확인</p>
                  </div>
                </div>
                <div className="bg-ti-950 rounded-xl p-5 text-center border border-ti-800">
                  <p className="text-silver-500 text-xs font-semibold uppercase tracking-wider mb-2">100% 무동력 작동</p>
                  <p className="text-white font-black text-lg mb-1">(폐열회수 기능)</p>
                  <p className="text-silver-400 text-sm leading-relaxed">동력 장치가 없어서 <span className="text-white">고장 요소가 없으며</span><br />운영을 위한 <span className="text-white">별도 전기 증설이 필요치 않습니다</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          기술 사양
      ══════════════════════════════════════ */}
      <section className="section-white border-t border-silver-100">
        <div className="container-pad">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-label justify-center">
                <span className="w-5 h-px bg-accent inline-block" />
                기술 사양
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-ink mb-4 text-center">
                제품 상세 사양
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden shadow-sm">
              <div className="bg-ti-950 px-6 py-4 text-center">
                <h3 className="text-silver-200 font-bold">ATX 티타늄 주름관 폐열회수기</h3>
              </div>
              <table className="w-full spec-table">
                <tbody>
                  {[
                    ["소재", "내·외부 100% 티타늄 (Ti Grade 2)"],
                    ["적용 어종", "가리비, 장어, 광어 등 수온 조절이 필요한 모든 어종"],
                    ["열 회수 효율", "평균 82.31% (KOMERI 공인 시험 기준)"],
                    ["작동 방식", "무동력 운전 — 동력 장치 없어 고장 요소 없음. 별도 전기 증설 불필요. (역세용 공압 펌프·컨트롤러 제외)"],
                    ["역세 방식", "자동 역세 (공압 펌프 가압 방식)"],
                    ["적용 규격", "맞춤 제작 (처리 수량에 따라 선택)"],
                    ["연결 방식", "고객 배관 사양에 맞춤 제작"],
                    ["인증·특허", "해양수산부 NET 신기술 인증 (제2024-0024호) / 특허 등록 제10-2832328호 / KOMERI 성능 시험 완료"],
                    ["제조사", "(주)에이티엑스 — since 1991, 35년 티타늄 가공 기술"],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="font-semibold text-ink bg-silver-50 w-40 md:w-48 text-center">{label}</td>
                      <td className="text-ink-muted">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          회사 신뢰도 배너
      ══════════════════════════════════════ */}
      <section className="section-dark border-t border-ti-800">
        <div className="container-pad">
          <div className="text-center mb-10">
            <p className="text-silver-500 text-xs font-semibold uppercase tracking-widest mb-3">since 1991</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              35년 가공기술, 티타늄 가공 선두기업
            </h2>
            <p className="text-accent font-black text-3xl md:text-4xl">ATX (주)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "설립", value: "1991년" },
              { label: "전문 분야", value: "티타늄 가공" },
              { label: "인증", value: "ASME / ISO" },
              { label: "주요 고객", value: "양식장·산업체" },
            ].map((item) => (
              <div key={item.label} className="card-dark p-4 text-center">
                <p className="text-silver-500 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-silver-400 text-sm mt-6">
            양식장의 티타늄을 활용한 각종 설비 함께 고민해드립니다.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-dark via-accent to-accent-dark opacity-90" />
        <div className="absolute inset-0 bg-ti-gradient opacity-30" />
        <div className="relative container-pad text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            버리는 물에서<br />
            <span className="text-white/90">평균 82% 열에너지를 회수하세요</span>
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-10 max-w-xl mx-auto">
            양식 어종·처리 수량·배관 사양에 맞춘 맞춤 견적을 제공합니다.<br />
            전화 또는 온라인으로 문의주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 bg-white text-accent font-black px-8 py-4 rounded-lg hover:bg-silver-50 transition-colors text-base shadow-lg"
            >
              온라인 견적 문의
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:1544-1909"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-base"
            >
              <Phone className="w-4 h-4" />
              1544-1909 전화 상담
            </a>
          </div>
          <p className="text-white/60 text-sm mt-6">
            (주)에이티엑스 · 경기도 안산시 단원구 번영로 44번길 2 (시화공단 4바 311)
          </p>
        </div>
      </section>

    </div>
  );
}

export default function WasteHeatRecoveryPage() {
  return <TabWrapper productContent={<ProductContent />} />;
}
