import Link from "next/link";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, React.ElementType> = { Cpu, Factory, Rocket, HeartPulse, Ship, Fish };

const industries = [
  { id: "aquaculture",   icon: "Fish",       name: "水産養殖・食品",     desc: "海水熱交換・廃熱回収に活用。重金属溶出なく安全に使用可能。", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "semiconductor", icon: "Cpu",        name: "半導体・ディスプレイ", desc: "フッ化水素酸・硫酸など超腐食性薬品の移送。パーティクルゼロ、クリーンルーム対応。", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "chemical",      icon: "Factory",    name: "石油化学・プラント",   desc: "高温・高圧・強腐食環境。HCl移送はGrade 7パラジウム合金を適用。", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "aerospace",     icon: "Rocket",     name: "航空宇宙・防衛",       desc: "燃料・油圧系統。SUS比40%軽量化、極低温〜高温の全範囲対応。", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "medical",       icon: "HeartPulse", name: "医療機器・製薬",       desc: "FDA公認の生体適合性。滅菌工程対応、薬品クリーン配管。", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "marine",        icon: "Ship",       name: "海洋・船舶",           desc: "最強の耐海水性。LNG極低温配管、船舶エンジンルーム振動吸収ホース。", accent: "border-silver-300/20 hover:border-accent/40" },
];

export default function JaIndustriesSection() {
  return (
    <section className="section-light">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="適用事例"
            title="どのような環境で使用されるのか"
            subtitle="強腐食・高温・高圧・海水環境など、ステンレスが限界を見せる場所でチタン波管が活躍します。"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.icon];
            return (
              <ScrollReveal key={ind.id} delay={i * 80}>
                <div className={`p-6 rounded-xl border bg-white ${ind.accent}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-ti-950 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-silver-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-base mb-1.5">{ind.name}</h3>
                      <p className="text-ink-subtle text-sm leading-relaxed">{ind.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={500}>
          <div className="mt-8 text-center">
            <Link
              href="/ja/industries"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-silver-500 hover:text-accent transition-colors"
            >
              産業別適用事例の詳細を見る
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
