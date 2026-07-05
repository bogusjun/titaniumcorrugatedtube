import Link from "next/link";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const iconMap: Record<string, React.ElementType> = { Cpu, Factory, Rocket, HeartPulse, Ship, Fish };

const industries = [
  { id: "aquaculture",   icon: "Fish",       name: "Aquaculture & Food",        desc: "Used in seawater heat exchange and waste heat recovery. No heavy-metal leaching — safe for food contact.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "semiconductor", icon: "Cpu",        name: "Semiconductor & Display",   desc: "Ultra-high-purity chemical transfer requiring extreme corrosion resistance and cleanliness. Zero particles, cleanroom ready.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "chemical",      icon: "Factory",    name: "Petrochemical & Plant",     desc: "High-temperature, high-pressure, highly corrosive environments. HCl transfer uses Grade 7 palladium alloy.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "aerospace",     icon: "Rocket",     name: "Aerospace & Defense",       desc: "Fuel and hydraulic systems demanding ultra-light, high-strength materials. 40% lighter than SUS, full cryogenic-to-high-temp range.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "medical",       icon: "HeartPulse", name: "Medical Device & Pharma",   desc: "FDA-approved biocompatibility. Sterilization-process compatible, clean pharmaceutical piping.", accent: "border-silver-300/20 hover:border-accent/40" },
  { id: "marine",        icon: "Ship",       name: "Marine & Offshore",         desc: "Unmatched seawater resistance. LNG cryogenic piping, vibration-absorbing hoses for ship engine rooms.", accent: "border-silver-300/20 hover:border-accent/40" },
];

export default function EnIndustriesSection() {
  return (
    <section className="section-light">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="Applications"
            title="Where Titanium Tubes Are Used"
            subtitle="Where stainless steel reaches its limits — highly corrosive, high-temperature, high-pressure, and seawater environments — titanium corrugated tubes step in."
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
              href="/en/industries"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-silver-500 hover:text-accent transition-colors"
            >
              View detailed application cases by industry
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
