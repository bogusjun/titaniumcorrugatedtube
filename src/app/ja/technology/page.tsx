import type { Metadata } from "next";
import {
  Flame, Zap, Cog, CheckCircle2, FlaskConical,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "技術特長",
  description: "チタン波管の素材特性、製造工程、品質試験基準をご紹介します。",
};

const gradeData = [
  {
    grade: "Grade 1",
    desc: "最高純度の純チタン。延性が最も優れており、複雑な形状加工に最適。",
    uses: "半導体配管、医療機器、食品・製薬配管",
    corrosion: "◎ 最優秀",
    strength: "○ 標準",
    formability: "◎ 最優秀",
  },
  {
    grade: "Grade 2",
    desc: "最も汎用的に使用される純チタン。強度と成形性の完璧なバランス。",
    uses: "化学・石油化学配管、海洋・船舶配管、熱交換器",
    corrosion: "◎ 最優秀",
    strength: "● 優秀",
    formability: "● 優秀",
  },
  {
    grade: "Grade 7",
    desc: "パラジウム(Pd) 0.12〜0.25%合金。還元性酸環境（HCl, H2SO4）に独自の耐食性。",
    uses: "塩酸・硫酸移送、強酸性化学プラント、原子力",
    corrosion: "◎◎ 卓越 (HCl対応)",
    strength: "● 優秀",
    formability: "● 優秀",
  },
  {
    grade: "Grade 9",
    desc: "Ti-3Al-2.5V合金。純チタン比強度30%向上。軽量高強度配管に最適。",
    uses: "航空宇宙配管、高圧燃料ライン、防衛",
    corrosion: "● 優秀",
    strength: "◎ 最優秀",
    formability: "○ 標準",
  },
];

const processSteps = [
  {
    step: "01",
    title: "素材受入・検査",
    desc: "ミル証明書確認、成分分析（XRF）、肉厚全数測定により原材料品質を検証します。",
    icon: FlaskConical,
  },
  {
    step: "02",
    title: "ハイドロフォーミング成形",
    desc: "高圧流体を使用したハイドロフォーミングにより均一な波形形状を生成します。溶接なしの一体型構造。",
    icon: Cog,
  },
  {
    step: "03",
    title: "熱処理（必要な場合）",
    desc: "成形応力除去のための真空アニーリング処理。耐食性・延性の最適化。",
    icon: Flame,
  },
  {
    step: "04",
    title: "エンドフィッティング溶接",
    desc: "ソケット・フランジなど接続部をTIG溶接（不活性ガスバックパージ）で完全接合。",
    icon: Zap,
  },
  {
    step: "05",
    title: "圧力・リーク試験",
    desc: "水圧試験（使用圧力×1.5倍）とヘリウムリーク試験により100%全数検査。",
    icon: GaugeIcon,
  },
  {
    step: "06",
    title: "出荷検査・梱包",
    desc: "寸法全数測定、表面状態確認後、防錆梱包。ミルシート・試験成績書同封。",
    icon: CheckCircle2,
  },
];

function GaugeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
      <path d="m12 12-4-4"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2"/>
    </svg>
  );
}

const qualityTests = [
  { name: "水圧試験", standard: "ASME B31.3", detail: "使用圧力 × 1.5倍、10分保持" },
  { name: "気密試験", standard: "ISO 15848", detail: "ヘリウムリーク試験 (Leak Rate < 10⁻⁶ mbar·L/s)" },
  { name: "繰り返し曲げ試験", standard: "JIS B 8360", detail: "10万回曲げ後、漏れなし" },
  { name: "耐圧破裂試験", standard: "ISO 23277", detail: "破裂圧力 ≥ 使用圧力 × 4倍" },
  { name: "材質分析", standard: "ASTM B265", detail: "XRF・OES成分分析、機械的特性試験" },
  { name: "寸法検査", standard: "JIS B 8307", detail: "外径・肉厚・長さ全数測定" },
];

export default function JaTechnologyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Technology
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            技術特長
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            20年のチタン加工ノウハウと精密製造技術で作られる最高品質の波管。
          </p>
        </div>
      </div>

      {/* Grade Comparison */}
      <section className="section-light">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="素材選択ガイド"
              title="チタングレード別特性比較"
              subtitle="用途と環境に応じた最適グレードをお選びください。"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {gradeData.map((g, i) => (
              <ScrollReveal key={g.grade} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-6 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ti-950 text-silver-200 font-black mb-4">
                    {g.grade.split(" ")[1]}
                  </div>
                  <h3 className="font-bold text-ink text-lg mb-2">{g.grade}</h3>
                  <p className="text-ink-muted text-sm mb-4 leading-relaxed">{g.desc}</p>
                  <div className="space-y-1.5 mb-4">
                    {[
                      ["耐食性", g.corrosion],
                      ["強度", g.strength],
                      ["成形性", g.formability],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-xs">
                        <span className="text-ink-subtle">{k}</span>
                        <span className="font-semibold text-ink-muted">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-silver-100">
                    <p className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">主要用途</p>
                    <p className="text-xs text-ink-muted leading-relaxed">{g.uses}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="section-white">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="製造工程"
              title="厳格な工程、完璧な品質"
              subtitle="原材料受入から出荷まで、すべての段階を徹底管理します。"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {processSteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 80}>
                <div className="bg-white border border-silver-100 rounded-xl shadow-ti-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-silver-50 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-ink" />
                      </div>
                    </div>
                    <div>
                      <span className="text-accent text-xs font-bold">{step.step}</span>
                      <h3 className="font-bold text-ink text-base mt-0.5 mb-2">{step.title}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tests */}
      <section className="section-dark">
        <div className="container-pad">
          <ScrollReveal>
            <SectionHeader
              label="品質管理"
              title="国際基準を超える品質試験"
              subtitle="すべての製品は出荷前に6項目の品質試験をパスします。"
              light
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {qualityTests.map((test, i) => (
              <ScrollReveal key={test.name} delay={i * 80}>
                <div className="card-dark p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-silver-200 font-bold">{test.name}</h3>
                      <span className="text-accent text-xs font-medium">{test.standard}</span>
                    </div>
                  </div>
                  <p className="text-silver-500 text-sm pl-8">{test.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
