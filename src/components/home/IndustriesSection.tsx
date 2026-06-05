import Link from "next/link";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, React.ElementType> = { Cpu, Factory, Rocket, HeartPulse, Ship, Fish };

const industries = [
  { id: "semiconductor", icon: "Cpu",        name: "반도체·디스플레이", desc: "불산·황산 등 초부식성 약품 이송. 파티클 Zero, 클린룸 대응.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "chemical",      icon: "Factory",    name: "석유화학·플랜트",   desc: "고온·고압·강부식 환경. HCl 이송은 Grade 7 팔라듐 합금 적용.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "aerospace",     icon: "Rocket",     name: "항공우주·방산",     desc: "연료·유압 계통. SUS 대비 40% 경량, 극저온~고온 전범위 대응.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "medical",       icon: "HeartPulse", name: "의료기기·제약",     desc: "FDA 공인 생체 친화성. 멸균 공정 대응, 약품 청정 배관.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "marine",        icon: "Ship",       name: "해양·선박",         desc: "최강 내해수성. LNG 극저온 배관, 선박 엔진룸 진동 흡수 호스.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "aquaculture",   icon: "Fish",       name: "수산양식·식품",     desc: "해수 직접 접촉 배관. 폐열 회수 열교환기로 에너지 비용 절감.", accent: "border-silver-300/20 hover:border-accent/40" },
];

export default function IndustriesSection() {
  return (
    <section className="section-white">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="적용 사례"
            title="어떤 환경에 사용되나"
            subtitle="강부식·고온·고압·해수 환경 등 스테인리스가 한계를 보이는 곳에서 티타늄 주름관이 사용됩니다."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon];
            return (
              <ScrollReveal key={ind.id} delay={i * 80}>
                <Link
                  href={`/industries#${ind.id}`}
                  className={`group block p-6 rounded-xl border bg-white transition-all duration-300 ${ind.accent} hover:shadow-ti-md hover:-translate-y-0.5`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-ti-950 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors duration-300">
                      <Icon className="w-5 h-5 text-silver-300 group-hover:text-ti-950 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-base mb-1.5 group-hover:text-ti-950">
                        {ind.name}
                      </h3>
                      <p className="text-ink-subtle text-sm leading-relaxed">{ind.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-silver-400 group-hover:text-accent transition-colors font-medium gap-1">
                    적용 사례 보기
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
