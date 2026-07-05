import { Shield, Zap, Flame, Droplets, Microscope, Weight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const advantages = [
  { icon: Shield,    title: "Superior Corrosion Resistance", desc: "Outstanding resistance to highly corrosive chemicals such as HF, HCl, and H₂SO₄. Corrosion service life 10× longer than SUS 316L.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Weight,    title: "Lightweight & High Strength",   desc: "40% lighter than SUS 316L while delivering equal or greater strength. Ideal for aerospace and mobile equipment.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Flame,     title: "Wide Temperature Range",        desc: "A single material covering cryogenic (-196°C) LNG piping to high-temperature (350°C) steam piping.", color: "text-accent",     bg: "bg-accent/10" },
  { icon: Droplets,  title: "Perfect Seawater Resistance",   desc: "Stainless steel corrodes rapidly in seawater and brine environments, while titanium delivers virtually permanent durability.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Microscope,title: "Biocompatibility",              desc: "FDA-approved biocompatible material. Fully applicable for medical device and pharmaceutical piping.", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Zap,       title: "Flexibility & Vibration Absorption", desc: "Corrugated structure absorbs piping displacement and vibration, preventing pipe failure from thermal expansion and mechanical vibration.", color: "text-accent", bg: "bg-accent/10" },
];

const comparisonRows = [
  { property: "Corrosion Resistance", titanium: "Excellent (HF, HCl resistant)", sus316: "Poor (weak against strong acids)" },
  { property: "Specific Gravity",     titanium: "4.51 g/cm³",                    sus316: "7.98 g/cm³" },
  { property: "Tensile Strength",     titanium: "≥ 345 MPa",                     sus316: "≥ 515 MPa" },
  { property: "Seawater Resistance",  titanium: "Virtually Permanent",           sus316: "1–3 years (pitting corrosion)" },
  { property: "Biocompatibility",     titanium: "✔ FDA Approved",               sus316: "✗" },
  { property: "Service Temperature",  titanium: "-196°C to 350°C",              sus316: "-180°C to 300°C" },
  { property: "Maintenance",          titanium: "Almost none required",          sus316: "Regular replacement needed" },
];

export default function EnWhyTitanium() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-silver-200/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pad relative">
        <ScrollReveal>
          <SectionHeader
            label="Why Titanium"
            title="Performance Beyond Stainless Steel"
            subtitle="Not merely a substitute material. The harsher the environment, the brighter titanium's value shines."
            light
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {advantages.map((adv, i) => (
            <ScrollReveal key={adv.title} delay={i * 80}>
              <div className="card-dark p-6 hover:-translate-y-1 transition-transform duration-300 hover:border-ti-700">
                <div className={`inline-flex p-3 rounded-xl ${adv.bg} mb-4`}>
                  <adv.icon className={`w-6 h-6 ${adv.color}`} />
                </div>
                <h3 className="text-silver-200 font-bold text-lg mb-2">{adv.title}</h3>
                <p className="text-silver-500 text-sm leading-relaxed">{adv.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-16 max-w-3xl mx-auto bg-ti-900 rounded-2xl border border-ti-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-ti-800 flex items-center gap-3">
              <div className="metal-line w-6 h-px" />
              <h3 className="text-silver-200 font-bold text-lg">Titanium vs Stainless Steel (SUS 316L) Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <colgroup>
                  <col className="w-1/4" />
                  <col className="w-[37.5%]" />
                  <col className="w-[37.5%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-ti-800">
                    <th className="text-center py-3 px-6 text-silver-500 font-medium bg-ti-950/50">Property</th>
                    <th className="text-center py-3 px-6 text-accent font-semibold bg-accent/15 border-t-2 border-accent">Titanium Tube</th>
                    <th className="text-center py-3 px-6 text-silver-400 font-medium">SUS 316L Tube</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.property} className={`border-b border-ti-800/50 ${i % 2 === 0 ? "bg-ti-950/30" : ""}`}>
                      <td className="py-3 px-6 text-center text-silver-400 font-medium bg-ti-950/50">{row.property}</td>
                      <td className="py-3 px-6 text-center text-silver-200 bg-accent/10">{row.titanium}</td>
                      <td className="py-3 px-6 text-center text-silver-400">{row.sus316}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
