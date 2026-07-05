import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const specs = [
  { label: "Size",             "10A": "10A",      "15A": "15A"      },
  { label: "Outer Dia. (OD)",  "10A": "16.4 mm",  "15A": "19.4 mm"  },
  { label: "Inner Dia. (ID)",  "10A": "11.7 mm",  "15A": "15.4 mm"  },
  { label: "Tolerance",        "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "Wall Thickness",   "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "Material",         "10A": "Ti Gr.2",  "15A": "Ti Gr.2"  },
  { label: "Working Pressure", "10A": "10 MPa",   "15A": "10 MPa"   },
  { label: "Temp. Range",      "10A": "-196°C ~ 280°C", "15A": "-196°C ~ 280°C" },
  { label: "Connection",       "10A": "Socket / Flange / NPT", "15A": "Socket / Flange / NPT" },
];

export default function EnProductsPreview() {
  return (
    <section className="section-white">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="Products"
            title="Titanium Corrugated Tube"
            subtitle="Flexible corrugated tubes manufactured in-house from high-purity titanium. An industrial piping material that replaces stainless steel in highly corrosive environments."
          />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <div className="relative w-full bg-white rounded-2xl border border-silver-100 p-8 flex items-center justify-center">
                <Image
                  src="/images/products/tube-drawing-diagram.png"
                  alt="Titanium Corrugated Tube cross-section diagram"
                  width={480}
                  height={220}
                  className="object-contain w-full"
                />
              </div>
              <p className="text-xs text-ink-subtle text-center leading-relaxed">
                The corrugated structure absorbs vibration, thermal expansion, and displacement,<br />
                providing virtually permanent durability in highly corrosive environments such as HF, HCl, and seawater.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-silver-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ti-950 text-silver-200">
                      <th className="py-3 px-4 text-left font-semibold w-36">Item</th>
                      <th className="py-3 px-4 text-center font-semibold">
                        <span className="block text-base font-black text-white">10A</span>
                      </th>
                      <th className="py-3 px-4 text-center font-semibold">
                        <span className="block text-base font-black text-white">15A</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.slice(1).map((row, i) => (
                      <tr key={row.label} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                        <td className="py-3 px-4 text-ink-subtle text-xs font-medium">{row.label}</td>
                        <td className="py-3 px-4 text-center font-semibold text-ink">{row["10A"]}</td>
                        <td className="py-3 px-4 text-center font-semibold text-ink">{row["15A"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <Link href="/en/products/tube" className="flex-1 text-center py-2.5 rounded-lg border border-silver-200 text-sm font-semibold text-ink hover:bg-silver-50 transition-colors">
                  Full Specification Details
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <Link href="/en/products" className="btn-primary">
                  Full Specification Table
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/en/products/heat-exchanger" className="inline-flex items-center gap-1.5 text-ink-muted text-sm font-medium hover:text-ink transition-colors">
                  Application: Coil Heat Exchanger →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
