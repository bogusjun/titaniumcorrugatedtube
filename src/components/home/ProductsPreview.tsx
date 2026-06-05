import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const sizes = [
  {
    size: "10A",
    od: "OD 17.3mm",
    desc: "소구경 정밀 배관. 반도체 세정라인·계측 배관에 사용됩니다.",
    slug: "tube-10a",
  },
  {
    size: "15A",
    od: "OD 21.7mm",
    desc: "범용 표준 규격. 화학약품·의료·선박 해수 배관에 가장 널리 사용됩니다.",
    slug: "tube-15a",
  },
  {
    size: "20A",
    od: "OD 27.2mm",
    desc: "중구경 중압 배관. 석유화학 플랜트 및 열교환기 연결배관에 적합합니다.",
    slug: "tube-20a",
  },
];

export default function ProductsPreview() {
  return (
    <section className="section-white">
      <div className="container-pad">
        <ScrollReveal>
          <SectionHeader
            label="제품"
            title="티타늄 주름관"
            subtitle="고순도 티타늄으로 제작한 플렉시블 주름관입니다. 내식성과 유연성이 동시에 요구되는 산업 배관에 사용됩니다."
          />
        </ScrollReveal>

        {/* Product image + description */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-silver-100">
              <Image
                src="/images/products/tube-coil.jpg"
                alt="티타늄 주름관"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-6">
              <p className="text-ink-muted text-base leading-relaxed">
                주름(corrugation) 형상이 배관의 유연성을 확보하여 진동·열팽창·변위를 흡수합니다.
                스테인리스로 대응이 어려운 강부식성 환경 — 불산, 염산, 해수, 고온 약품 라인 —
                에서 반영구적인 내구성을 제공합니다.
              </p>

              {/* Size table */}
              <div className="border border-silver-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ti-950 text-silver-300">
                      <th className="py-2.5 px-4 text-left font-semibold">규격</th>
                      <th className="py-2.5 px-4 text-left font-semibold">외경</th>
                      <th className="py-2.5 px-4 text-left font-semibold hidden sm:table-cell">주 적용처</th>
                      <th className="py-2.5 px-4 text-left font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map((s, i) => (
                      <tr key={s.slug} className={`border-t border-silver-100 ${i % 2 === 1 ? "bg-silver-50" : "bg-white"}`}>
                        <td className="py-3 px-4 font-bold text-ink">{s.size}</td>
                        <td className="py-3 px-4 text-ink-muted">{s.od}</td>
                        <td className="py-3 px-4 text-ink-subtle hidden sm:table-cell text-xs leading-snug">{s.desc}</td>
                        <td className="py-3 px-4">
                          <Link href={`/products/${s.slug}`} className="text-accent text-xs font-medium hover:underline whitespace-nowrap">
                            사양 보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
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
