import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import industriesData from "@/data/industries.json";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "적용 산업",
  description: "반도체·화학·항공우주·의료·해양·수산 산업별 티타늄 주름관 적용 사례.",
};

const iconMap: Record<string, React.ElementType> = {
  Cpu, Factory, Rocket, HeartPulse, Ship, Fish,
};

const colorMap: Record<string, string> = {
  semiconductor: "text-accent",
  chemical: "text-amber-400",
  aerospace: "text-purple-400",
  medical: "text-red-400",
  marine: "text-cyan-400",
  aquaculture: "text-emerald-400",
};

const bgMap: Record<string, string> = {
  semiconductor: "bg-accent/10",
  chemical: "bg-amber-400/10",
  aerospace: "bg-purple-400/10",
  medical: "bg-red-400/10",
  marine: "bg-cyan-400/10",
  aquaculture: "bg-emerald-400/10",
};

const caseImageMap: Record<string, { image: string; tagColor: string }[]> = {
  aquaculture: [
    { image: "/images/products/case-fish-farm-yeosu.jpg", tagColor: "bg-blue-500" },
    { image: "/images/products/case-fish-tank-truck.jpg", tagColor: "bg-cyan-600" },
  ],
  semiconductor: [
    { image: "/images/products/heat-exchanger-square-1.jpg", tagColor: "bg-accent" },
    { image: "/images/products/heat-exchanger-square-2.jpg", tagColor: "bg-accent" },
  ],
  chemical: [
    { image: "/images/products/heat-exchanger-square-3.jpg", tagColor: "bg-amber-500" },
    { image: "/images/products/heat-exchanger-square-4.jpg", tagColor: "bg-amber-500" },
  ],
  aerospace: [
    { image: "/images/products/heat-exchanger-coil-single.jpg", tagColor: "bg-purple-500" },
    { image: "/images/products/heat-exchanger-coil-multi.jpg", tagColor: "bg-purple-500" },
  ],
  medical: [
    { image: "/images/products/heat-exchanger-coil-single.jpg", tagColor: "bg-red-500" },
    { image: "/images/products/heat-exchanger-coil-multi.jpg", tagColor: "bg-red-500" },
  ],
  marine: [
    { image: "/images/products/case-seawater-sauna.jpg", tagColor: "bg-teal-600" },
    { image: "/images/products/case-fish-farm-yeosu.jpg", tagColor: "bg-cyan-600" },
  ],
};

export default function IndustriesPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Header — 중앙정렬 */}
      <div className="bg-ti-950 py-24">
        <div className="container-pad text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Industries
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-5">
            적용 산업 분야
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl mx-auto leading-relaxed">
            고부식·고온·해수 등 극한 환경이 요구되는 모든 산업에서
            <br className="hidden sm:block" />
            ATX 티타늄 주름관 열교환기가 활약하고 있습니다.
          </p>
          {/* 산업 퀵 링크 */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {industriesData.map((ind) => {
              const Icon = iconMap[ind.icon];
              const iconColor = colorMap[ind.id];
              return (
                <a
                  key={ind.id}
                  href={`#${ind.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-silver-400 hover:text-accent hover:border-accent/40 text-sm font-medium transition-colors"
                >
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  {ind.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Industries */}
      <div className="container-pad py-16 space-y-16">
        {industriesData.map((ind) => {
          const Icon = iconMap[ind.icon];
          const iconColor = colorMap[ind.id];
          const iconBg = bgMap[ind.id];
          const caseImages = caseImageMap[ind.id] ?? [];

          return (
            <ScrollReveal key={ind.id} delay={50}>
              <div
                id={ind.id}
                className="bg-white rounded-2xl border border-silver-100 overflow-hidden shadow-sm"
              >
                {/* 섹션 헤더 */}
                <div className="bg-ti-950 px-8 py-6 flex items-center gap-4">
                  <div className={`inline-flex p-3 rounded-xl ${iconBg}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-silver-200">{ind.name}</h2>
                    <p className="text-silver-500 text-sm mt-0.5">{ind.nameEn}</p>
                  </div>
                  <div className="ml-auto">
                    <Link
                      href="/support"
                      className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
                    >
                      견적 요청 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-8">
                  {/* 설명 */}
                  <p className="text-ink-muted text-base leading-relaxed mb-8 max-w-3xl">
                    {ind.description}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 핵심 적용 포인트 */}
                    <div>
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider mb-4">
                        핵심 적용 포인트
                      </h3>
                      <ul className="space-y-3">
                        {ind.keyBenefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-ink-muted">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 납품 사례 — 강화된 카드 */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-accent" />
                        <h3 className="font-bold text-ink text-sm uppercase tracking-wider">
                          납품 사례
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {ind.cases.map((c, idx) => {
                          const imgInfo = caseImages[idx];
                          return (
                            <div
                              key={c.client}
                              className="rounded-xl overflow-hidden border border-silver-100 bg-silver-50"
                            >
                              {imgInfo && (
                                <div className="relative aspect-[16/7] w-full overflow-hidden">
                                  <Image
                                    src={imgInfo.image}
                                    alt={c.client}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                  <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${imgInfo.tagColor}`}>
                                    {ind.name}
                                  </span>
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white text-sm font-bold drop-shadow">{c.client}</span>
                                      <span className="text-white/70 text-xs">{c.year}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className={imgInfo ? "px-4 py-3" : "p-4"}>
                                {!imgInfo && (
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-semibold text-ink">{c.client}</span>
                                    <span className="text-xs text-ink-subtle">{c.year}</span>
                                  </div>
                                )}
                                <p className="text-sm text-ink-muted leading-relaxed">{c.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-ti-950 py-16">
        <div className="container-pad text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h2 className="text-2xl md:text-3xl font-black text-silver-200 mb-4">
            귀사의 환경에 맞는 열교환기가 필요하신가요?
          </h2>
          <p className="text-silver-500 text-base mb-8 max-w-xl mx-auto">
            적용 환경·유체·온도 조건을 알려주시면 최적의 구성과 견적을 안내해 드립니다.
          </p>
          <Link href="/support" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            무료 견적 요청 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
