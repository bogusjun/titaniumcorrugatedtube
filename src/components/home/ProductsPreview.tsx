import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const specs = [
  { label: "규격",         "10A": "10A",      "15A": "15A"      },
  { label: "바깥지름 (OD)", "10A": "16.4 mm",  "15A": "19.4 mm"  },
  { label: "안지름 (ID)",   "10A": "11.7mm",   "15A": "15.4mm"   },
  { label: "공차",          "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "두께",          "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "재질",          "10A": "Ti Gr.2", "15A": "Ti Gr.2" },
  { label: "사용 압력",     "10A": "10 MPa",   "15A": "10 MPa"   },
  { label: "온도 범위",     "10A": "-196°C ~ 280°C", "15A": "-196°C ~ 280°C" },
  { label: "연결 방식",     "10A": "Socket / Flange / NPT", "15A": "Socket / Flange / NPT" },
];

export default function ProductsPreview() {
  return (
    <section className="section-white">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="제품"
            title="티타늄 주름관"
            subtitle="고순도 티타늄으로 직접 제조한 플렉시블 주름관. 강부식성 환경에서 스테인리스를 대체하는 산업용 배관재입니다."
          />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 도면 이미지 */}
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <div className="relative w-full bg-white rounded-2xl border border-silver-100 p-8 flex items-center justify-center">
                <Image
                  src="/images/products/tube-drawing-diagram.png"
                  alt="티타늄 주름관 단면 도면"
                  width={480}
                  height={220}
                  className="object-contain w-full"
                />
              </div>
              <p className="text-xs text-ink-subtle text-center leading-relaxed">
                주름(corrugation) 구조가 진동·열팽창·변위를 흡수하며,<br />
                불산·염산·해수 등 강부식성 환경에서 반영구적 내구성을 제공합니다.
              </p>
            </div>
          </ScrollReveal>

          {/* 스펙 테이블 */}
          <ScrollReveal delay={100}>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-silver-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ti-950 text-silver-200">
                      <th className="py-3 px-4 text-left font-semibold w-36">항목</th>
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
                <Link href="/products/tube" className="flex-1 text-center py-2.5 rounded-lg border border-silver-200 text-sm font-semibold text-ink hover:bg-silver-50 transition-colors">
                  전 규격 상세 사양
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <Link href="/products" className="btn-primary">
                  전 규격 사양표
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/products/heat-exchanger" className="inline-flex items-center gap-1.5 text-ink-muted text-sm font-medium hover:text-ink transition-colors">
                  응용품: 코일형 열교환기 →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
