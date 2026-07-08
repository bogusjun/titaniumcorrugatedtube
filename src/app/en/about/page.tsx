import type { Metadata } from "next";
import Image from "next/image";
import { Award, Factory, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export const metadata: Metadata = {
  title: "About ATX",
  description: "ATX Titanium Corrugated Tube company overview. History, certifications, and facility details.",
};

const timeline = [
  { year: "1991", event: "Founded as Hyundai Titanium" },
  { year: "2008", event: "ATX Co., Ltd. established" },
  { year: "2013", event: "ISO 9001 certification obtained" },
  { year: "2013", event: "2 patents registered for magnetic powder recovery cluster" },
  { year: "2015", event: "Patent registered for coating air intake filter for painting equipment" },
  { year: "2018", event: "Headquarters relocated to Siheung Industrial Complex, Ansan, Gyeonggi-do" },
  { year: "2018", event: "Certified as Parts & Materials Specialist Company" },
  { year: "2019", event: "Selected as INNO-BIZ (Technology Innovation SME)" },
  { year: "2019", event: "Joint development MOU signed with POSCO for precision titanium products" },
  { year: "2019", event: "MOU signed with Korea Electric Power Research Institute" },
  { year: "2019", event: "Certified as Promising Export SME / Minister of Trade, Industry & Energy Award" },
  { year: "2019", event: "Selected as Military Service Designated Company / Gyeonggi-do Promising SME" },
  { year: "2020", event: "ASME U Stamp certification obtained" },
  { year: "2020", event: "Corporate R&D Center certified / Labor-Management Culture Excellence Award (Gyeonggi Governor)" },
  { year: "2021", event: "Certified as titanium sheet exporter" },
  { year: "2021", event: "Joined Korea Machinery Industry Promotion Association" },
  { year: "2022", event: "Joined Korea Women Entrepreneurs Association as full member" },
  { year: "2022", event: "Excellence Award for Women-Owned Business" },
  { year: "2022", event: "Joined Korea Chemical Society" },
  { year: "2023", event: "ISO 45001 certification obtained" },
  { year: "2023", event: "4 patents registered for coil heat exchanger high-efficiency structure" },
  { year: "2023", event: "Appointed Director of Korea Women Entrepreneurs Association" },
  { year: "2023", event: "Selected as PETRONAS (Malaysia) approved vendor and sales agent" },
  { year: "2023", event: "Women Business Expo Africa Pavilion — Gold Award & Excellence Award" },
  { year: "2024", event: "Selected for National Strategic Industry R&D project" },
  { year: "2024", event: "Titanium Waste Heat Recovery System NET (New Technology) Certification (Ministry of Oceans and Fisheries)" },
  { year: "2025", event: "$20 Million Export Tower Award" },
  { year: "2025", event: "Titanium Waste Heat Recovery System patent registered" },
  { year: "2025", event: "Plant export consortium project implemented in Saudi Arabia (Riyadh) & UAE (Abu Dhabi)" },
];

const certs = [
  { name: "ISO 9001:2015",  org: "Quality Management System",       body: "KR / TÜV" },
  { name: "ISO 14001:2015", org: "Environmental Management System", body: "KR" },
  { name: "KS B 2334",      org: "Gasket-related KS Certification", body: "KATS" },
  { name: "ASME Compliant", org: "ASME design & manufacturing",     body: "ASME" },
  { name: "ASTM B265",      org: "Titanium Sheet Standard",         body: "ASTM" },
  { name: "RoHS Compliant", org: "Restriction of Hazardous Substances", body: "EU" },
];

const facilities = [
  { name: "Hydroforming Press",     count: "5 units",  desc: "10–500 ton press" },
  { name: "CNC Lathe",              count: "8 units",  desc: "End fitting precision machining" },
  { name: "TIG Welding Machine",    count: "6 units",  desc: "Inert gas back-purge welding" },
  { name: "Hydraulic Test Machine", count: "3 units",  desc: "Up to 500 MPa" },
  { name: "Helium Leak Tester",     count: "2 units",  desc: "10⁻⁶ mbar·L/s class" },
  { name: "XRF Analyzer",           count: "1 unit",   desc: "Instant elemental analysis" },
];

export default function EnAboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            About ATX
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            Company Overview
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            A specialist manufacturer dedicated exclusively to titanium piping since our founding in 1991.
          </p>
        </div>
      </div>

      {/* Company Reality */}
      <section className="bg-white py-14 border-b border-silver-100">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-silver-100 shadow-ti">
                <Image
                  src="/images/about/team-2021.jpg"
                  alt="ATX all-staff photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                  <p className="text-white font-bold text-sm">ATX Co., Ltd. — Full Staff</p>
                  <p className="text-silver-300 text-xs">Titanium & Special Non-Ferrous Metal Processing Specialist</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              <ScrollReveal delay={100}>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-100 shadow-ti">
                  <Image
                    src="/images/about/factory-interior.jpg"
                    alt="ATX factory interior — large crane equipment"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                    <p className="text-white font-bold text-sm">Headquarters Factory — Siheung Industrial Complex, Ansan</p>
                    <p className="text-silver-300 text-xs">Large crane & precision machining equipment on-site</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="bg-ti-950 rounded-2xl px-6 py-5 flex flex-col gap-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-widest">Since 1991</p>
                  <p className="text-silver-200 font-bold text-lg leading-snug">
                    30+ Years of Pure Titanium Expertise —<br />Korea&apos;s Only Comprehensive Titanium Piping Specialist
                  </p>
                  <p className="text-silver-400 text-sm leading-relaxed">
                    All processes in-house: design, forming, welding, and inspection. Supplying to major domestic and international clients including POSCO, Korea Electric Power, and PETRONAS — our technical capability is proven.
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
              { icon: Factory, value: 30, suffix: "+", label: "Years in Business" },
              { icon: Globe,   value: 500, suffix: "+", label: "Delivered Projects" },
              { icon: Award,   value: 6,   suffix: "",  label: "Certifications" },
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
              label="History"
              title="30 Years of Growth"
              subtitle="Technology and trust built step by step."
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
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-silver-200 -translate-x-1/2" />

                <div className="space-y-8">
                  {entries.map(([year, events], i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <ScrollReveal key={year} delay={i * 60}>
                        <div className={`flex items-start gap-0 md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
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

                          <div className="hidden md:flex flex-col items-center flex-shrink-0 w-8 pt-5">
                            <div className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md ring-2 ring-accent/20" />
                          </div>

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
              label="Production Equipment"
              title="Precision Built with Modern Facilities"
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

      {/* Factory Overview */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Factory Overview"
              title="Our Factory"
              subtitle="Headquarters at Siheung Industrial Complex, Ansan — from precision machining to cleanroom and research lab."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-factory.jpg",        name: "Factory Overview",    desc: "Factory Overview" },
              { src: "/images/about/facilities/facility-machining-room.jpg", name: "Machining Room",      desc: "Machining Room" },
              { src: "/images/about/facilities/facility-clean-room.jpg",     name: "Clean Room",          desc: "Clean Room" },
              { src: "/images/about/facilities/facility-meeting-room.jpg",   name: "Meeting Room",        desc: "Meeting Room" },
              { src: "/images/about/facilities/facility-research-center.jpg",name: "Research Center",     desc: "Research Center" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg",  name: "Vacuum Heat Furnace", desc: "Vacuum Heat Treatment Furnace" },
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

      {/* Facilities Equipment */}
      <section className="section-white">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="Facilities"
              title="Key Production Equipment"
              subtitle="Dedicated equipment specialised for titanium precision processing."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-vacuum-heat-1.jpg",  name: "Vacuum Heat Treatment 1", desc: "Vacuum Heat Treatment" },
              { src: "/images/about/facilities/facility-cnc-machine.jpg",    name: "CNC Machine",             desc: "CNC Machine (Mazak)" },
              { src: "/images/about/facilities/facility-pmi-tester.jpg",     name: "PMI Analyzer",            desc: "Positive Material Identification" },
              { src: "/images/about/facilities/facility-tig-welding.jpg",    name: "TIG Welding Machines",    desc: "TIG Welding Machines" },
              { src: "/images/about/facilities/facility-laser-welding.jpg",  name: "Laser Welding Machines",  desc: "Laser Welding Machines" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg",  name: "Vacuum Heat Treatment 2", desc: "Vacuum Heat Treatment Facility" },
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
              title="Processing Capabilities"
              subtitle="All processes for titanium, tantalum, and zirconium performed in-house."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Special Metal Processing",
                items: ["Titanium / Tantalum / Zirconium TIG welding", "Plate and pipe forming", "Corrugated tube forming"],
              },
              {
                num: "02",
                title: "Pressure Equipment Manufacturing",
                items: ["Pressure vessel fabrication", "Heat exchanger assembly", "ASME-standard NDT and quality control"],
              },
              {
                num: "03",
                title: "Precision Machining",
                items: ["CNC machining", "Turning / milling / drilling"],
              },
              {
                num: "04",
                title: "Surface Treatment & Finishing",
                items: ["Pickling / passivation treatment", "Cleaning and final inspection"],
              },
              {
                num: "05",
                title: "Inspection & Testing",
                items: ["KOLAS-accredited testing", "Hydrostatic and helium leak testing", "Dimensional inspection"],
              },
              {
                num: "06",
                title: "Quality Assurance System",
                items: ["ISO / ASME quality system", "Process documentation and traceability", "Standards compliance management"],
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
              label="Certifications"
              title="Quality Recognized by International Standards"
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
                  <p className="text-silver-500 text-xs">Issuing Body: {cert.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
