import { Shield, Zap, Flame, Droplets, Microscope, Weight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

const advantages = [
  { icon: Shield,    title: "最強の耐食性",      desc: "フッ化水素酸・塩酸・硫酸などの強腐食性化学物質に対して優れた耐性。SUS 316L比10倍以上の耐食寿命。", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Weight,    title: "軽量高強度",         desc: "SUS 316L比40%軽量でありながら同等以上の強度。航空・モバイル機器に最適。", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Flame,     title: "幅広い温度対応",     desc: "極低温（-196°C）LNG配管から高温（350°C）スチーム配管まで一つの素材で対応。", color: "text-accent",     bg: "bg-accent/10" },
  { icon: Droplets,  title: "完璧な耐海水性",     desc: "海水・塩水環境でステンレスが急速に腐食する一方、チタンは半永久的な耐久性を発揮。", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Microscope,title: "生体適合性",         desc: "FDA認定の生体適合素材。医療機器・製薬配管に完全適用可能。", color: "text-silver-300", bg: "bg-ti-700" },
  { icon: Zap,       title: "柔軟性・振動吸収",   desc: "波形構造により配管変位・振動を吸収。熱膨張・機械振動による配管破損を防止。", color: "text-accent",     bg: "bg-accent/10" },
];

const comparisonRows = [
  { property: "耐食性",    titanium: "優秀 (HF, HCl 対応)", sus316: "不良（強酸に弱い）" },
  { property: "比重",      titanium: "4.51 g/cm³",          sus316: "7.98 g/cm³" },
  { property: "引張強度",  titanium: "≥ 345 MPa",           sus316: "≥ 515 MPa" },
  { property: "耐海水性",  titanium: "半永久",               sus316: "1〜3年（孔食発生）" },
  { property: "生体適合性",titanium: "✔ FDA 公認",          sus316: "✗" },
  { property: "使用温度",  titanium: "-196°C 〜 350°C",     sus316: "-180°C 〜 300°C" },
  { property: "メンテナンス",titanium: "ほぼ不要",           sus316: "定期交換が必要" },
];

export default function JaWhyTitanium() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-silver-200/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pad relative">
        <ScrollReveal>
          <SectionHeader
            label="なぜチタンなのか"
            title="ステンレスを超える性能"
            subtitle="単なる代替材ではありません。過酷な環境ほど、チタンの価値が輝きます。"
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
              <h3 className="text-silver-200 font-bold text-lg">チタン vs ステンレス（SUS 316L）比較</h3>
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
                    <th className="text-center py-3 px-6 text-silver-500 font-medium bg-ti-950/50">項目</th>
                    <th className="text-center py-3 px-6 text-accent font-semibold bg-accent/15 border-t-2 border-accent">チタン波管</th>
                    <th className="text-center py-3 px-6 text-silver-400 font-medium">SUS 316L 波管</th>
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
