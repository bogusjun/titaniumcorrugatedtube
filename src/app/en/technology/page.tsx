import type { Metadata } from "next";
import {
  Flame, Zap, Cog, CheckCircle2, FlaskConical,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Technology",
  description: "Material properties, manufacturing process, and quality test standards of titanium corrugated tubes.",
};

const gradeData = [
  {
    grade: "Grade 1",
    desc: "Highest-purity commercially pure titanium. Best ductility — ideal for complex shape forming.",
    uses: "Semiconductor piping, medical devices, food & pharmaceutical piping",
    corrosion: "◎ Excellent",
    strength: "○ Standard",
    formability: "◎ Excellent",
  },
  {
    grade: "Grade 2",
    desc: "The most widely used commercially pure titanium. A perfect balance of strength and formability.",
    uses: "Chemical / petrochemical piping, marine piping, heat exchangers",
    corrosion: "◎ Excellent",
    strength: "● Good",
    formability: "● Good",
  },
  {
    grade: "Grade 7",
    desc: "Palladium (Pd) 0.12–0.25% alloy. Unique corrosion resistance in reducing acid environments (HCl, H₂SO₄).",
    uses: "HCl / H₂SO₄ transfer, strong-acid chemical plants, nuclear",
    corrosion: "◎◎ Outstanding (HCl resistant)",
    strength: "● Good",
    formability: "● Good",
  },
  {
    grade: "Grade 9",
    desc: "Ti-3Al-2.5V alloy. 30% higher strength than commercially pure titanium. Ideal for lightweight, high-strength piping.",
    uses: "Aerospace piping, high-pressure fuel lines, defense",
    corrosion: "● Good",
    strength: "◎ Excellent",
    formability: "○ Standard",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Material Receipt & Inspection",
    desc: "Raw material quality verified through mill certificate review, elemental analysis (XRF), and 100% wall thickness measurement.",
    icon: FlaskConical,
  },
  {
    step: "02",
    title: "Hydroforming",
    desc: "Uniform corrugated shape produced by high-pressure fluid hydroforming. Integrated structure — no welding.",
    icon: Cog,
  },
  {
    step: "03",
    title: "Heat Treatment (when required)",
    desc: "Vacuum annealing to relieve forming stresses. Optimises corrosion resistance and ductility.",
    icon: Flame,
  },
  {
    step: "04",
    title: "End Fitting Welding",
    desc: "Connection ends such as sockets and flanges fully joined by TIG welding with inert gas back-purge.",
    icon: Zap,
  },
  {
    step: "05",
    title: "Pressure & Leak Testing",
    desc: "100% individual product inspection via hydrostatic test (working pressure × 1.5×) and helium leak test.",
    icon: GaugeIcon,
  },
  {
    step: "06",
    title: "Final Inspection & Packaging",
    desc: "100% dimensional measurement and surface condition check, then anti-rust packaging. Mill sheet and test certificate enclosed.",
    icon: CheckCircle2,
  },
];

function GaugeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
      <path d="m12 12-4-4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2"/>
    </svg>
  );
}

const qualityTests = [
  { name: "Hydrostatic Test",        standard: "ASME B31.3",  detail: "Working pressure × 1.5×, held for 10 minutes" },
  { name: "Leak Test",               standard: "ISO 15848",   detail: "Helium leak test (Leak Rate < 10⁻⁶ mbar·L/s)" },
  { name: "Repeated Bending Test",   standard: "JIS B 8360",  detail: "No leakage after 100,000 bending cycles" },
  { name: "Burst Pressure Test",     standard: "ISO 23277",   detail: "Burst pressure ≥ working pressure × 4×" },
  { name: "Material Analysis",       standard: "ASTM B265",   detail: "XRF / OES elemental analysis, mechanical property test" },
  { name: "Dimensional Inspection",  standard: "JIS B 8307",  detail: "100% measurement of OD, wall thickness, and length" },
];

export default function EnTechnologyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Technology
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            Technology & Features
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            Highest-quality corrugated tubes built with 20 years of titanium processing know-how and precision manufacturing technology.
          </p>
        </div>
      </div>

      {/* Grade Comparison */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Material Selection Guide"
              title="Titanium Grade Comparison"
              subtitle="Choose the optimal grade for your application and environment."
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
                      ["Corrosion Resistance", g.corrosion],
                      ["Strength",             g.strength],
                      ["Formability",          g.formability],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-xs">
                        <span className="text-ink-subtle">{k}</span>
                        <span className="font-semibold text-ink-muted">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-silver-100">
                    <p className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">Key Applications</p>
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
              label="Manufacturing Process"
              title="Rigorous Process, Perfect Quality"
              subtitle="Every stage from raw material receipt to shipment is strictly controlled."
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
              label="Quality Control"
              title="Quality Testing Beyond International Standards"
              subtitle="Every product passes 6 quality tests before shipment."
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
