import type { Metadata } from "next";
import CasesCarousel from "@/app/(ko)/cases/CasesCarousel";

export const metadata: Metadata = {
  title: "導入事例",
  description: "化学プラント、半導体、電気めっき、海洋水産、原子力などATXチタン・特殊非鉄加工納入事例。",
};

const cases = [
  {
    id: 1,
    title: "陸上養殖場 海水配管システム",
    location: "韓国 全南 麗水",
    description: "PVC配管の頻繁なクラックと海水腐食問題をチタン波管で解決。設置後3年以上無交換で稼働中。",
    image: "/images/products/case-fish-farm-yeosu.jpg",
    tag: "水産・養殖",
  },
  {
    id: 2,
    title: "活魚運搬車 水槽配管",
    location: "活魚運搬専門業者",
    description: "移動中の振動と海水腐食が同時に作用する過酷な環境。波管の柔軟性とチタンの耐食性で問題を解決。",
    image: "/images/products/case-fish-tank-truck.jpg",
    tag: "水産・物流",
  },
  {
    id: 3,
    title: "海水サウナ 温水配管",
    location: "海水温浴施設",
    description: "高温海水が循環する配管で一般ステンレスの交換周期は6ヶ月。チタン転換後、腐食問題を完全解消。",
    image: "/images/products/case-seawater-sauna.jpg",
    tag: "温泉・温浴",
  },
];

export default function JaCasesPage() {
  return (
    <div className="pt-20 min-h-screen bg-ti-950">
      {/* Hero */}
      <div className="py-20 container-pad text-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Application Cases
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-6">
          ATXは腐食環境でのチタン、<br className="hidden sm:block" />
          特殊非鉄金属のみを専門としています。
        </h1>
        <p className="text-silver-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          化学プラント、半導体、電気めっき、海洋水産、原子力 —<br className="hidden sm:block" />
          腐食が設備を損なう環境で、ATXの技術力はすでに実証されています。
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-20">
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">水産・養殖</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              海水配管専門
              <br />
              <span className="text-silver-500 text-xs">養殖場 · 活魚車 · 海水施設</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">3年+</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              無交換現場多数
              <br />
              <span className="text-silver-500 text-xs">納入後のリピートが証明する</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">100%</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              チタン素材
              <br />
              <span className="text-silver-500 text-xs">海水・高温・腐食環境最適素材</span>
            </p>
          </div>
        </div>
      </div>

      <CasesCarousel cases={cases} />

      <div className="py-20 container-pad text-center">
        <p className="text-silver-400 mb-2 text-lg font-semibold text-silver-200">
          貴社設備の腐食問題、一緒に確認しましょう。
        </p>
        <p className="text-silver-500 text-sm mb-8">
          素材選定から加工仕様まで、問題環境に合った答えを見つけます。
        </p>
        <a href="/ja/support" className="btn-primary text-base px-8 py-3">
          技術相談のお問い合わせ
        </a>
      </div>
    </div>
  );
}
