import type { Metadata } from "next";
import {
  Flame, Zap, Cog, CheckCircle2, FlaskConical,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "기술 특장점",
  description: "티타늄 주름관의 소재 특성, 제조 공정, 품질 시험 기준을 소개합니다.",
};

const gradeData = [
  {
    grade: "Grade 1",
    desc: "최고 순도 순수 티타늄. 연성이 가장 뛰어나 복잡한 형상 가공에 최적.",
    uses: "반도체 배관, 의료기기, 식품·제약 배관",
    corrosion: "◎ 최우수",
    strength: "○ 표준",
    formability: "◎ 최우수",
  },
  {
    grade: "Grade 2",
    desc: "가장 범용적으로 사용되는 순수 티타늄. 강도와 성형성의 완벽한 균형.",
    uses: "화학·석유화학 배관, 해양·선박 배관, 열교환기",
    corrosion: "◎ 최우수",
    strength: "● 우수",
    formability: "● 우수",
  },
  {
    grade: "Grade 7",
    desc: "팔라듐(Pd) 0.12~0.25% 합금. 환원성 산 환경(HCl, H2SO4)에 독보적 내식성.",
    uses: "염산·황산 이송, 강산성 화학 플랜트, 원자력",
    corrosion: "◎◎ 탁월 (HCl대응)",
    strength: "● 우수",
    formability: "● 우수",
  },
  {
    grade: "Grade 9",
    desc: "Ti-3Al-2.5V 합금. 순수 티타늄 대비 강도 30% 향상. 경량 고강도 배관에 최적.",
    uses: "항공우주 배관, 고압 연료 라인, 방산",
    corrosion: "● 우수",
    strength: "◎ 최우수",
    formability: "○ 표준",
  },
];

const processSteps = [
  {
    step: "01",
    title: "소재 입고 및 검사",
    desc: "밀(Mill) 인증서 확인, 성분 분석(XRF), 두께 전수 측정으로 원자재 품질을 검증합니다.",
    icon: FlaskConical,
  },
  {
    step: "02",
    title: "하이드로포밍 성형",
    desc: "고압 유체를 이용한 하이드로포밍으로 균일한 주름 형상을 생성합니다. 용접 없는 일체형 구조.",
    icon: Cog,
  },
  {
    step: "03",
    title: "열처리 (필요 시)",
    desc: "성형 응력 제거를 위한 진공 어닐링 처리. 내식성·연성 최적화.",
    icon: Flame,
  },
  {
    step: "04",
    title: "엔드 피팅 용접",
    desc: "소켓·플랜지 등 연결부를 TIG 용접(불활성 가스 백퍼징)으로 완벽하게 접합.",
    icon: Zap,
  },
  {
    step: "05",
    title: "압력·누설 시험",
    desc: "수압 시험(사용압력×1.5배)과 헬륨 누설 시험으로 100% 전수 검사.",
    icon: Gauge_icon,
  },
  {
    step: "06",
    title: "출하 검사 및 포장",
    desc: "치수 전수 측정, 표면 상태 확인 후 방청 포장. 밀 시트·시험 성적서 동봉.",
    icon: CheckCircle2,
  },
];

function Gauge_icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
      <path d="m12 12-4-4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2"/>
    </svg>
  );
}

const qualityTests = [
  { name: "수압 시험", standard: "ASME B31.3", detail: "사용압력 × 1.5배, 10분 유지" },
  { name: "기밀 시험", standard: "ISO 15848", detail: "헬륨 누설 시험 (Leak Rate < 10⁻⁶ mbar·L/s)" },
  { name: "반복 굴곡 시험", standard: "JIS B 8360", detail: "10만회 굴곡 후 누설 없음" },
  { name: "내압 파열 시험", standard: "ISO 23277", detail: "파열 압력 ≥ 사용압력 × 4배" },
  { name: "재질 분석", standard: "ASTM B265", detail: "XRF·OES 성분 분석, 기계적 특성 시험" },
  { name: "치수 검사", standard: "JIS B 8307", detail: "외경·두께·길이 전수 측정" },
];

export default function TechnologyPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Technology
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            기술 특장점
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            20년의 티타늄 가공 노하우와 정밀 제조 기술로 만들어지는 최고 품질의 주름관.
          </p>
        </div>
      </div>

      {/* Grade Comparison */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="소재 선택 가이드"
              title="티타늄 Grade별 특성 비교"
              subtitle="용도와 환경에 따른 최적 Grade를 선택하세요."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {gradeData.map((g, i) => (
              <ScrollReveal key={g.grade} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-6 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ti-950 text-silver-200 font-black mb-4">
                    {g.grade.split(" ")[1]}
                  </div>
                  <h3 className="font-bold text-ink text-lg mb-2">{g.grade}</h3>
                  <p className="text-ink-muted text-sm mb-4 leading-relaxed">{g.desc}</p>
                  <div className="space-y-1.5 mb-4">
                    {[
                      ["내식성", g.corrosion],
                      ["강도", g.strength],
                      ["성형성", g.formability],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-xs">
                        <span className="text-ink-subtle">{k}</span>
                        <span className="font-semibold text-ink-muted">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-silver-100">
                    <p className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">주요 용도</p>
                    <p className="text-xs text-ink-muted leading-relaxed">{g.uses}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="section-white">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="제조 공정"
              title="엄격한 공정, 완벽한 품질"
              subtitle="원자재 입고부터 출하까지 모든 단계를 철저히 관리합니다."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {processSteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-silver-50 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-ink" />
                      </div>
                    </div>
                    <div>
                      <span className="text-accent text-xs font-bold">{step.step}</span>
                      <h3 className="font-bold text-ink text-base mt-0.5 mb-2">{step.title}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tests */}
      <section className="section-dark">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="품질 관리"
              title="국제 기준을 초과하는 품질 시험"
              subtitle="모든 제품은 출하 전 6개 항목의 품질 시험을 통과합니다."
              light
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {qualityTests.map((test, i) => (
              <ScrollReveal key={test.name} delay={i * 80}>
                <div className="card-dark p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-silver-200 font-bold">{test.name}</h3>
                      <span className="text-accent text-xs font-medium">{test.standard}</span>
                    </div>
                  </div>
                  <p className="text-silver-500 text-sm pl-8">{test.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
