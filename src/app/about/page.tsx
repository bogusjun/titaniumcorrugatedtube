import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Factory, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "ATX 티타늄 주름관 회사 소개. 연혁, 인증, 설비 현황.",
};

const timeline = [
  { year: "2004", event: "ATX 창립 — 티타늄 특수 배관 전문 제조 시작" },
  { year: "2007", event: "ISO 9001:2000 인증 취득" },
  { year: "2009", event: "반도체 FAB 납품 본격화 (국내 주요 반도체사 공급)" },
  { year: "2011", event: "KS 인증 취득 / 연구소 설립" },
  { year: "2014", event: "ISO 9001:2008 인증 갱신 / 설비 증설 (CNC 프레스 도입)" },
  { year: "2016", event: "해외 수출 개시 — 일본·중국·동남아 시장 진출" },
  { year: "2018", event: "ISO 14001 환경경영 인증 / 항공우주 분야 납품 시작" },
  { year: "2020", event: "ISO 9001:2015 인증 갱신 / 연간 매출 OO억 달성" },
  { year: "2022", event: "미국 WEFTEC 전시회 참가 / 북미 시장 진출" },
  { year: "2024", event: "신공장 준공 — 생산 능력 2배 확장" },
];

const certs = [
  { name: "ISO 9001:2015", org: "품질경영시스템", body: "KR / TÜV" },
  { name: "ISO 14001:2015", org: "환경경영시스템", body: "KR" },
  { name: "KS B 2334", org: "가스켓 관련 KS 인증", body: "국가기술표준원" },
  { name: "ASME 대응", org: "미국기계학회 기준 설계·제조", body: "ASME" },
  { name: "ASTM B265", org: "티타늄 판재 규격 준수", body: "ASTM" },
  { name: "RoHS 준수", org: "환경 유해물질 제한", body: "EU" },
];

const facilities = [
  { name: "하이드로포밍 프레스", count: "5대", desc: "10~500톤 프레스" },
  { name: "CNC 선반", count: "8대", desc: "엔드 피팅 정밀 가공" },
  { name: "TIG 용접기", count: "6대", desc: "불활성 가스 백퍼징 용접" },
  { name: "수압 시험기", count: "3대", desc: "최대 500 MPa" },
  { name: "헬륨 누설 시험기", count: "2대", desc: "10⁻⁶ mbar·L/s급" },
  { name: "XRF 성분 분석기", count: "1대", desc: "즉시 성분 분석" },
];

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            About ATX
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            회사 소개
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            2004년 창립 이래 20년간 티타늄 배관 한 길을 걸어온 전문 제조사.
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <section className="bg-white py-16 border-b border-silver-100">
        <div className="container-pad">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Factory, value: 20, suffix: "+", label: "업력 (년)" },
              { icon: Globe, value: 500, suffix: "+", label: "납품 프로젝트" },
              { icon: Users, value: 50, suffix: "명+", label: "임직원" },
              { icon: Award, value: 6, suffix: "건", label: "보유 인증" },
            ].map(({ icon: Icon, value, suffix, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-4xl font-black text-ink">
                  <AnimatedNumber value={value} suffix={suffix} />
                </p>
                <p className="text-ink-muted text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="연혁"
              title="20년의 성장 역사"
              subtitle="한 걸음씩 쌓아온 기술과 신뢰."
            />
          </ScrollReveal>

          <div className="relative mt-14 max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-16 top-0 bottom-0 w-px bg-silver-100" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 60}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 pt-1 text-right">
                      <span className="text-sm font-bold text-accent">{item.year}</span>
                    </div>
                    <div className="relative flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-accent border-2 border-white shadow-sm mt-1.5" />
                    </div>
                    <div className="flex-1 bg-white rounded-xl px-5 py-3 border border-silver-100 shadow-sm">
                      <p className="text-ink-muted text-sm">{item.event}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-white">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="생산 설비"
              title="최신 설비로 완성하는 정밀함"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {facilities.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-silver-50 flex items-center justify-center flex-shrink-0">
                    <Factory className="w-6 h-6 text-ink" />
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">{f.name}</p>
                    <p className="text-accent font-black">{f.count}</p>
                    <p className="text-ink-subtle text-xs">{f.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Facility Photos */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            <ScrollReveal>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-100">
                <Image
                  src="/images/about/facility-1.jpg"
                  alt="생산 현장 1"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-100">
                <Image
                  src="/images/about/facility-2.jpg"
                  alt="생산 현장 2"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-dark">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="인증 현황"
              title="국제 기준이 인정한 품질"
              light
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {certs.map((cert, i) => (
              <ScrollReveal key={cert.name} delay={i * 80}>
                <div className="card-dark p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="text-silver-200 font-bold">{cert.name}</span>
                  </div>
                  <p className="text-silver-400 text-sm mb-1">{cert.org}</p>
                  <p className="text-silver-500 text-xs">발급 기관: {cert.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
