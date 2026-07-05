import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const specs = [
  { label: "規格",           "10A": "10A",      "15A": "15A"      },
  { label: "外径 (OD)",      "10A": "16.4 mm",  "15A": "19.4 mm"  },
  { label: "内径 (ID)",      "10A": "11.7mm",   "15A": "15.4mm"   },
  { label: "公差",           "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "肉厚",           "10A": "± 0.3 mm", "15A": "± 0.3 mm" },
  { label: "材質",           "10A": "Ti Gr.2",  "15A": "Ti Gr.2"  },
  { label: "使用圧力",       "10A": "10 MPa",   "15A": "10 MPa"   },
  { label: "温度範囲",       "10A": "-196°C 〜 280°C", "15A": "-196°C 〜 280°C" },
  { label: "接続方式",       "10A": "Socket / Flange / NPT", "15A": "Socket / Flange / NPT" },
];

export default function JaProductsPreview() {
  return (
    <section className="section-white">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="製品"
            title="チタン波管"
            subtitle="高純度チタンで自社製造したフレキシブル波管。強腐食性環境においてステンレスを代替する産業用配管材です。"
          />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <div className="relative w-full bg-white rounded-2xl border border-silver-100 p-8 flex items-center justify-center">
                <Image
                  src="/images/products/tube-drawing-diagram.png"
                  alt="チタン波管断面図"
                  width={480}
                  height={220}
                  className="object-contain w-full"
                />
              </div>
              <p className="text-xs text-ink-subtle text-center leading-relaxed">
                波形（corrugation）構造が振動・熱膨張・変位を吸収し、<br />
                フッ化水素酸・塩酸・海水などの強腐食性環境で半永久的な耐久性を発揮します。
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-silver-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ti-950 text-silver-200">
                      <th className="py-3 px-4 text-left font-semibold w-36">項目</th>
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
                <Link href="/ja/products/tube" className="flex-1 text-center py-2.5 rounded-lg border border-silver-200 text-sm font-semibold text-ink hover:bg-silver-50 transition-colors">
                  全規格詳細仕様
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <Link href="/ja/products" className="btn-primary">
                  全規格仕様表
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/ja/products/heat-exchanger" className="inline-flex items-center gap-1.5 text-ink-muted text-sm font-medium hover:text-ink transition-colors">
                  応用品：コイル型熱交換器 →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
