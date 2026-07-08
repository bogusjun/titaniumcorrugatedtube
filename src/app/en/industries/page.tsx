import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Industries",
  description: "Titanium corrugated tube application cases by industry: semiconductor, chemical, aerospace, medical, marine, and aquaculture.",
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

const industriesData = [
  {
    id: "aquaculture",
    name: "Aquaculture & Food",
    nameEn: "Aquaculture & Food Processing",
    icon: "Fish",
    description: "Maximises energy efficiency as a waste heat recovery heat exchanger in seawater and aquaculture temperature control systems.",
    keyBenefits: [
      "Direct seawater contact piping",
      "Waste heat recovery heat exchanger",
      "Food hygiene standard compliance",
      "Aquaculture energy reduction",
    ],
    cases: [
      { client: "Live Fish Transport Operator", content: "Seawater circulation heat exchanger tube supply", year: "2024" },
      { client: "Seawater Sauna Facility",      content: "Seawater heating heat exchanger system construction", year: "2023" },
    ],
  },
  {
    id: "semiconductor",
    name: "Semiconductor & Display",
    nameEn: "Semiconductor & Display",
    icon: "Cpu",
    description: "Titanium corrugated tubes meet the extreme corrosion resistance and cleanliness requirements for ultra-high-purity chemical transfer.",
    keyBenefits: [
      "Transfer of highly corrosive chemicals (HF, H₂SO₄)",
      "Zero particle generation",
      "Cleanroom-compatible surface treatment",
      "High-purity Grade 1 material",
    ],
    cases: [
      { client: "Domestic Semiconductor FAB",   content: "500 m HF transfer piping supply for cleaning process", year: "2023" },
      { client: "Display Manufacturer",          content: "Chemical piping replacement for deposition process", year: "2022" },
    ],
  },
  {
    id: "chemical",
    name: "Petrochemical & Plant",
    nameEn: "Petrochemical & Plant",
    icon: "Factory",
    description: "Fully replaces general stainless steel in high-temperature, high-pressure, highly corrosive petrochemical plants.",
    keyBenefits: [
      "HCl transfer: Grade 7 (Pd alloy) applied",
      "High-temperature / high-pressure steam piping",
      "Seawater cooling water systems",
      "ASME / KS certification compliant",
    ],
    cases: [
      { client: "Domestic Chemical Plant",  content: "Full replacement of HCl transfer piping (SUS → Ti)", year: "2023" },
      { client: "Refinery Plant",           content: "Seawater cooling system tube supply", year: "2021" },
    ],
  },
  {
    id: "aerospace",
    name: "Aerospace & Defense",
    nameEn: "Aerospace & Defense",
    icon: "Rocket",
    description: "Applied to fuel and hydraulic systems in aerospace where ultra-lightweight, high-strength materials are required.",
    keyBenefits: [
      "40% lighter than SUS",
      "Cryogenic (-196°C) to extreme high-temperature (300°C) range",
      "High-pressure fuel and hydraulic systems",
      "Military certification (MIL spec) compliant",
    ],
    cases: [
      { client: "Aircraft Parts Manufacturer", content: "Flexible hose supply for aircraft fuel transfer", year: "2022" },
      { client: "Defense Contractor",          content: "High-pressure hydraulic hose supply for military equipment", year: "2023" },
    ],
  },
  {
    id: "medical",
    name: "Medical Device & Pharma",
    nameEn: "Medical Device & Pharmaceutical",
    icon: "HeartPulse",
    description: "Titanium, recognised for biocompatibility and non-toxicity, is used in medical device and pharmaceutical piping.",
    keyBenefits: [
      "Biocompatibility (ASTM F136)",
      "Sterilization process compatible",
      "Clean piping for pharmaceutical transfer",
      "FDA-regulated material",
    ],
    cases: [
      { client: "Pharmaceutical Company",    content: "Clean piping system for pharmaceutical transfer", year: "2023" },
      { client: "Medical Device Manufacturer", content: "Connection hose supply for dialysis equipment", year: "2022" },
    ],
  },
  {
    id: "marine",
    name: "Marine & Offshore",
    nameEn: "Marine & Offshore",
    icon: "Ship",
    description: "Titanium corrugated tubes with unmatched seawater resistance are applied from ship engine rooms to offshore plants.",
    keyBenefits: [
      "Outstanding seawater and saltwater resistance",
      "Seawater cooling systems",
      "LNG vessel cryogenic piping",
      "Vibration-absorbing braided type",
    ],
    cases: [
      { client: "Shipyard",           content: "Cryogenic piping supply for LNG carrier", year: "2023" },
      { client: "Offshore Plant Operator", content: "Seawater treatment system tube supply", year: "2022" },
    ],
  },
];

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
    { image: "/images/products/heat-exchanger-coil-multi.jpg",  tagColor: "bg-purple-500" },
  ],
  medical: [
    { image: "/images/products/heat-exchanger-coil-single.jpg", tagColor: "bg-red-500" },
    { image: "/images/products/heat-exchanger-coil-multi.jpg",  tagColor: "bg-red-500" },
  ],
  marine: [
    { image: "/images/products/case-seawater-sauna.jpg",   tagColor: "bg-teal-600" },
    { image: "/images/products/case-fish-farm-yeosu.jpg",  tagColor: "bg-cyan-600" },
  ],
};

export default function EnIndustriesPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-24">
        <div className="container-pad text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Industries
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-5">
            Industries Served
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl mx-auto leading-relaxed">
            ATX titanium corrugated tube heat exchangers are at work across every industry<br className="hidden sm:block" />
            demanding extreme environments — highly corrosive, high-temperature, and seawater conditions.
          </p>
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
                      href="/en/support"
                      className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
                    >
                      Request Quote <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-ink-muted text-base leading-relaxed mb-8 max-w-3xl">
                    {ind.description}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider mb-4">
                        Key Application Points
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

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-accent" />
                        <h3 className="font-bold text-ink text-sm uppercase tracking-wider">
                          Delivery Cases
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

      <div className="bg-ti-950 py-16">
        <div className="container-pad text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h2 className="text-2xl md:text-3xl font-black text-silver-200 mb-4">
            Need a heat exchanger tailored to your environment?
          </h2>
          <p className="text-silver-500 text-base mb-8 max-w-xl mx-auto">
            Tell us your application environment, fluid type, and temperature conditions — we&apos;ll recommend the optimal configuration and provide a quote.
          </p>
          <Link href="/en/support" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            Request a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
