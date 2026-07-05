import type { Metadata } from "next";
import Image from "next/image";
import { Award, Factory, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "ATX 티타늄 주름관 회사 소개. 연혁, 인증, 설비 현황.",
};

const timeline = [
  { year: "1991", event: "현대티타늄 창립" },
  { year: "2008", event: "(주)에이티엑스 설립" },
  { year: "2013", event: "ISO 9001 인증 취득" },
  { year: "2013", event: "마그네틱 파우더 회수 클러스터 특허 2건 등록" },
  { year: "2015", event: "도장시설용 코팅 에어 흡입 필터 특허 등록" },
  { year: "2018", event: "경기도 안산 시화공단으로 본사 이전" },
  { year: "2018", event: "부품소재 전문기업 인증 취득" },
  { year: "2019", event: "INNO-BIZ (기술혁신형 중소기업) 선정" },
  { year: "2019", event: "POSCO와 티타늄 정밀제품 공동개발 MOU 체결" },
  { year: "2019", event: "한국전력연구원 MOU 체결" },
  { year: "2019", event: "수출 유망 중소기업 인증 / 산업통상자원부 장관상 수상" },
  { year: "2019", event: "병역지정업체 선정 / 경기도 유망 중소기업 선정" },
  { year: "2020", event: "ASME U Stamp 인증 취득" },
  { year: "2020", event: "기업부설연구소 인정 / 노사문화 우수기업 선정 (경기도지사 표창)" },
  { year: "2021", event: "티타늄 박판 수출기업 인증" },
  { year: "2021", event: "한국기계산업진흥회 가입" },
  { year: "2022", event: "한국여성경제인협회 정회원 가입" },
  { year: "2022", event: "여성경영인 우수기업 표창 수상" },
  { year: "2022", event: "한국화학학회 가입" },
  { year: "2023", event: "ISO 45001 인증 취득" },
  { year: "2023", event: "코일형 열교환기 고효율 열교환 구조 관련 특허 4건 등록" },
  { year: "2023", event: "한국여성경제인협회 이사 선임" },
  { year: "2023", event: "PETRONAS(말레이시아) 공인 벤더 및 판매 대리점 선정" },
  { year: "2023", event: "여성기업 엑스포 Africa Pavilion 금상·우수상 수상" },
  { year: "2024", event: "국가전략산업 R&D 과제 선정" },
  { year: "2024", event: "티타늄 폐열회수시스템 NET(신기술) 인증 취득 (해양수산부)" },
  { year: "2025", event: "2천만불 수출의 탑 수상" },
  { year: "2025", event: "티타늄 폐열회수시스템 특허 등록" },
  { year: "2025", event: "사우디아라비아(리야드)·UAE(아부다비) 플랜트 수출 컨소시엄 사업 수행" },
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
            1991년 창립 이래 티타늄 배관 한 길을 걸어온 전문 제조사.
          </p>
        </div>
      </div>

      {/* Company Reality — 실체감 사진 */}
      <section className="bg-white py-14 border-b border-silver-100">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 전 직원 단체사진 — 메인 */}
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-silver-100 shadow-ti">
                <Image
                  src="/images/about/team-2021.jpg"
                  alt="ATX 에이티엑스 임직원 단체 사진"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                  <p className="text-white font-bold text-sm">ATX 에이티엑스(주) 전 직원</p>
                  <p className="text-silver-300 text-xs">타이타늄 특수비철 가공전문업체</p>
                </div>
              </div>
            </ScrollReveal>

            {/* 공장 내부 + 텍스트 */}
            <div className="flex flex-col gap-6">
              <ScrollReveal delay={100}>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-100 shadow-ti">
                  <Image
                    src="/images/about/factory-interior.jpg"
                    alt="ATX 공장 내부 — 대형 크레인 설비"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                    <p className="text-white font-bold text-sm">경기도 안산 시화공단 본사 공장</p>
                    <p className="text-silver-300 text-xs">대형 크레인 · 정밀 가공 설비 완비</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="bg-ti-950 rounded-2xl px-6 py-5 flex flex-col gap-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-widest">Since 1991</p>
                  <p className="text-silver-200 font-bold text-lg leading-snug">
                    30년 이상 티타늄 한 길,<br />국내 유일의 종합 티타늄 배관 전문 제조사
                  </p>
                  <p className="text-silver-400 text-sm leading-relaxed">
                    설계·성형·용접·검사까지 전 공정을 자체 생산합니다. POSCO, 한국전력, PETRONAS 등 국내외 주요 수요처에 납품하며 기술력을 검증받았습니다.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white py-16 border-b border-silver-100">
        <div className="container-pad">
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: Factory, value: 30, suffix: "+", label: "업력 (년)" },
              { icon: Globe, value: 500, suffix: "+", label: "납품 프로젝트" },
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
              title="30년의 성장 역사"
              subtitle="한 걸음씩 쌓아온 기술과 신뢰."
            />
          </ScrollReveal>

          {(() => {
            const grouped = timeline.reduce<Record<string, string[]>>((acc, item) => {
              if (!acc[item.year]) acc[item.year] = [];
              acc[item.year].push(item.event);
              return acc;
            }, {});
            const entries = Object.entries(grouped);
            return (
              <div className="mt-14 relative max-w-4xl mx-auto">
                {/* 중앙 세로 축선 */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-silver-200 -translate-x-1/2" />

                <div className="space-y-8">
                  {entries.map(([year, events], i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <ScrollReveal key={year} delay={i * 60}>
                        <div className={`flex items-start gap-0 md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                          {/* 카드 */}
                          <div className="flex-1 md:max-w-[calc(50%-2rem)]">
                            <div className="bg-white rounded-xl border border-silver-100 shadow-ti-sm p-5">
                              <p className="text-accent font-black text-lg mb-2">{year}</p>
                              <ul className="space-y-1.5">
                                {events.map((ev) => (
                                  <li key={ev} className="text-ink-muted text-sm flex gap-2">
                                    <span className="text-accent mt-0.5 flex-shrink-0">·</span>
                                    <span>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* 중앙 점 */}
                          <div className="hidden md:flex flex-col items-center flex-shrink-0 w-8 pt-5">
                            <div className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md ring-2 ring-accent/20" />
                          </div>

                          {/* 반대편 빈 공간 */}
                          <div className="hidden md:block flex-1 md:max-w-[calc(50%-2rem)]" />
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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

        </div>
      </section>

      {/* Factory Overview — 공장 전경 갤러리 */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Factory Overview"
              title="공장 전경"
              subtitle="경기도 안산 시화공단 본사 — 정밀 가공부터 클린룸, 연구소까지."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-factory.jpg", name: "공장 전경", desc: "Factory Overview" },
              { src: "/images/about/facilities/facility-machining-room.jpg", name: "기계가공실", desc: "Machining Room" },
              { src: "/images/about/facilities/facility-clean-room.jpg", name: "클린룸", desc: "Clean Room" },
              { src: "/images/about/facilities/facility-meeting-room.jpg", name: "회의실", desc: "Meeting Room" },
              { src: "/images/about/facilities/facility-research-center.jpg", name: "기술연구소", desc: "Research Center" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg", name: "진공열처리로", desc: "Vacuum Heat Treatment Furnace" },
            ].map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-silver-100">
                    <Image
                      src={item.src}
                      alt={`ATX ${item.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-bold text-ink text-sm">{item.name}</p>
                    <p className="text-ink-subtle text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Equipment — 설비 장비 사진 */}
      <section className="section-white">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Facilities"
              title="주요 생산 장비"
              subtitle="티타늄 특수 가공에 특화된 전용 설비."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-vacuum-heat-1.jpg", name: "진공 열처리기 1", desc: "Vacuum Heat Treatment" },
              { src: "/images/about/facilities/facility-cnc-machine.jpg", name: "CNC 가공기", desc: "CNC Machine (Mazak)" },
              { src: "/images/about/facilities/facility-pmi-tester.jpg", name: "PMI 성분 분석기", desc: "Positive Material Identification" },
              { src: "/images/about/facilities/facility-tig-welding.jpg", name: "TIG 용접기", desc: "TIG Welding Machines" },
              { src: "/images/about/facilities/facility-laser-welding.jpg", name: "레이저 용접기", desc: "Laser Welding Machines" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg", name: "진공 열처리기 2", desc: "Vacuum Heat Treatment Facility" },
            ].map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden bg-silver-100">
                    <Image
                      src={item.src}
                      alt={`ATX ${item.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-bold text-ink text-sm">{item.name}</p>
                    <p className="text-ink-subtle text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Capabilities"
              title="가공 역량"
              subtitle="티타늄·탄탈럼·지르코늄 전 공정을 자체 수행합니다."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "특수금속 가공",
                items: ["티타늄 / 탄탈럼 / 지르코늄 TIG 용접", "판재 및 파이프 성형", "주름관 성형"],
              },
              {
                num: "02",
                title: "압력기기 제작",
                items: ["압력용기 제작", "열교환기 조립", "ASME 기준 비파괴검사 및 품질관리"],
              },
              {
                num: "03",
                title: "정밀 기계 가공",
                items: ["CNC 가공", "절삭 / 밀링 / 드릴링"],
              },
              {
                num: "04",
                title: "표면처리 및 마감",
                items: ["산세 / 부동태화 처리", "세척 및 최종 검사"],
              },
              {
                num: "05",
                title: "검사 및 시험",
                items: ["KOLAS 공인 시험", "수압 및 헬륨 누설 시험", "치수 검사"],
              },
              {
                num: "06",
                title: "품질보증 시스템",
                items: ["ISO / ASME 품질 시스템", "공정 문서화 및 이력 추적", "규격 적합성 관리"],
              },
            ].map((cap, i) => (
              <ScrollReveal key={cap.num} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-6 h-full flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-black text-2xl leading-none">{cap.num}</span>
                    <div className="h-px flex-1 bg-silver-100" />
                  </div>
                  <p className="font-bold text-ink text-sm leading-snug">{cap.title}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {cap.items.map((it) => (
                      <li key={it} className="text-ink-muted text-xs flex gap-2">
                        <span className="text-accent flex-shrink-0 mt-0.5">·</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
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
