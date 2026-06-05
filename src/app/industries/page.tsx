import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, CheckCircle2, ArrowRight } from "lucide-react";
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

export default function IndustriesPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Industries
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            적용 산업 분야
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            극한 환경이 요구되는 모든 산업에서 티타늄 주름관이 활약하고 있습니다.
          </p>
        </div>
      </div>

      {/* Industries */}
      <div className="container-pad py-16 space-y-16">
        {industriesData.map((ind) => {
          const Icon = iconMap[ind.icon];
          const iconColor = colorMap[ind.id];
          const iconBg = bgMap[ind.id];

          return (
            <ScrollReveal key={ind.id} delay={50}>
              <div
                id={ind.id}
                className="bg-white rounded-2xl border border-silver-100 overflow-hidden shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Left: Info */}
                  <div className="lg:col-span-1 bg-ti-950 p-8 flex flex-col">
                    <div className={`inline-flex p-4 rounded-2xl ${iconBg} mb-5 self-start`}>
                      <Icon className={`w-8 h-8 ${iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-black text-silver-200 mb-2">{ind.name}</h2>
                    <p className="text-silver-500 text-sm leading-relaxed mb-6">{ind.description}</p>
                    <div className="mt-auto">
                      <Link
                        href="/support"
                        className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
                      >
                        이 분야 견적 요청 <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="lg:col-span-2 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Key Benefits */}
                      <div>
                        <h3 className="font-bold text-ink text-sm uppercase tracking-wider mb-4">
                          핵심 적용 포인트
                        </h3>
                        <ul className="space-y-2">
                          {ind.keyBenefits.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-ink-muted">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cases */}
                      <div>
                        <h3 className="font-bold text-ink text-sm uppercase tracking-wider mb-4">
                          납품 사례
                        </h3>
                        <div className="space-y-3">
                          {ind.cases.map((c) => (
                            <div
                              key={c.client}
                              className="bg-silver-50 rounded-xl p-4 border-l-2 border-accent"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-ink">{c.client}</span>
                                <span className="text-xs text-ink-subtle">{c.year}</span>
                              </div>
                              <p className="text-sm text-ink-muted">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
