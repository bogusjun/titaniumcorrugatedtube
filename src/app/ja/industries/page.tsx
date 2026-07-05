import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Factory, Rocket, HeartPulse, Ship, Fish, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "適用産業",
  description: "半導体・化学・航空宇宙・医療・海洋・水産産業別チタン波管適用事例。",
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
    name: "水産養殖・食品",
    nameEn: "Aquaculture & Food",
    icon: "Fish",
    description: "海水・養殖用温度調節システムに廃熱回収熱交換器としてエネルギー効率を最大化します。",
    keyBenefits: [
      "海水直接接触配管",
      "廃熱回収熱交換器",
      "食品衛生基準対応",
      "養殖場エネルギー削減",
    ],
    cases: [
      { client: "活魚運搬車業者", content: "海水循環熱交換器波管供給", year: "2024" },
      { client: "海水サウナ", content: "海水加熱熱交換器システム構築", year: "2023" },
    ],
  },
  {
    id: "semiconductor",
    name: "半導体・ディスプレイ",
    nameEn: "Semiconductor & Display",
    icon: "Cpu",
    description: "超高純度化学物質移送に求められる極限の耐食性と清浄度をチタン波管が満たします。",
    keyBenefits: [
      "フッ化水素酸(HF)・硫酸など強酸性薬品移送",
      "パーティクル発生ゼロ",
      "クリーンルーム対応表面処理",
      "高純度 Grade 1 適用",
    ],
    cases: [
      { client: "国内半導体FAB", content: "洗浄工程フッ化水素酸移送配管500m供給", year: "2023" },
      { client: "ディスプレイメーカー", content: "蒸着工程化学配管交換", year: "2022" },
    ],
  },
  {
    id: "chemical",
    name: "石油化学・プラント",
    nameEn: "Petrochemical & Plant",
    icon: "Factory",
    description: "高温・高圧・強腐食環境の石油化学プラントで一般ステンレスを完全代替します。",
    keyBenefits: [
      "塩酸(HCl)移送: Grade 7 (Pd合金) 適用",
      "高温高圧スチーム配管",
      "海水冷却水系統",
      "ASME/KS認証対応",
    ],
    cases: [
      { client: "国内化学プラント", content: "塩酸移送配管全面交換（SUS→Ti）", year: "2023" },
      { client: "精油所プラント", content: "海水冷却水系統波管供給", year: "2021" },
    ],
  },
  {
    id: "aerospace",
    name: "航空宇宙・防衛",
    nameEn: "Aerospace & Defense",
    icon: "Rocket",
    description: "超軽量・高強度が求められる航空宇宙分野の燃料・油圧系統に適用されます。",
    keyBenefits: [
      "SUS比40%軽量化",
      "極低温(-196°C)〜極高温(300°C)対応",
      "高圧燃料・油圧系統",
      "軍用認証(MIL規格)対応",
    ],
    cases: [
      { client: "航空機部品メーカー", content: "機体燃料移送フレキシブルホース供給", year: "2022" },
      { client: "防衛業者", content: "軍用装備高圧油圧ホース供給", year: "2023" },
    ],
  },
  {
    id: "medical",
    name: "医療機器・製薬",
    nameEn: "Medical Device",
    icon: "HeartPulse",
    description: "生体適合性と無毒性が認められたチタンで医療機器・製薬配管に使用されます。",
    keyBenefits: [
      "生体適合性 (ASTM F136)",
      "滅菌プロセス対応",
      "薬品移送クリーン配管",
      "FDA規制対応素材",
    ],
    cases: [
      { client: "製薬会社", content: "医薬品移送クリーン配管システム構築", year: "2023" },
      { client: "医療機器メーカー", content: "透析装置用接続ホース供給", year: "2022" },
    ],
  },
  {
    id: "marine",
    name: "海洋・船舶",
    nameEn: "Marine & Offshore",
    icon: "Ship",
    description: "最強の耐海水性を持つチタン波管で船舶エンジンルームから海洋プラントまで適用されます。",
    keyBenefits: [
      "優れた耐海水・耐塩水性",
      "海水冷却システム",
      "LNG船舶極低温配管",
      "振動吸収ブレード型",
    ],
    cases: [
      { client: "造船所", content: "LNG運搬船極低温配管供給", year: "2023" },
      { client: "海洋プラント業者", content: "海水処理システム波管供給", year: "2022" },
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
    { image: "/images/products/heat-exchanger-coil-multi.jpg", tagColor: "bg-purple-500" },
  ],
  medical: [
    { image: "/images/products/heat-exchanger-coil-single.jpg", tagColor: "bg-red-500" },
    { image: "/images/products/heat-exchanger-coil-multi.jpg", tagColor: "bg-red-500" },
  ],
  marine: [
    { image: "/images/products/case-seawater-sauna.jpg", tagColor: "bg-teal-600" },
    { image: "/images/products/case-fish-farm-yeosu.jpg", tagColor: "bg-cyan-600" },
  ],
};

export default function JaIndustriesPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-24">
        <div className="container-pad text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Industries
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-5">
            適用産業分野
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl mx-auto leading-relaxed">
            強腐食・高温・海水など極限環境が求められるすべての産業で
            <br className="hidden sm:block" />
            ATXチタン波管熱交換器が活躍しています。
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
                      href="/ja/support"
                      className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
                    >
                      見積依頼 <ArrowRight className="w-4 h-4" />
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
                        主要適用ポイント
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
                          納入事例
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
            貴社の環境に合った熱交換器が必要ですか？
          </h2>
          <p className="text-silver-500 text-base mb-8 max-w-xl mx-auto">
            適用環境・流体・温度条件をお知らせいただければ、最適な構成と見積もりをご案内します。
          </p>
          <Link href="/ja/support" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            無料見積もり依頼 <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
