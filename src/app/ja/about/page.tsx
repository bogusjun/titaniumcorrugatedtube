import type { Metadata } from "next";
import Image from "next/image";
import { Award, Factory, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export const metadata: Metadata = {
  title: "会社概要",
  description: "ATX チタン波管 会社概要。沿革、認証、設備状況。",
};

const timeline = [
  { year: "1991", event: "現代チタン創立" },
  { year: "2008", event: "ATX Co., Ltd. 設立" },
  { year: "2013", event: "ISO 9001 認証取得" },
  { year: "2013", event: "磁気粉体回収クラスター特許 2件登録" },
  { year: "2015", event: "塗装設備用コーティングエア吸入フィルター特許登録" },
  { year: "2018", event: "京畿道 安山 始華工団へ本社移転" },
  { year: "2018", event: "部品素材専門企業認定取得" },
  { year: "2019", event: "INNO-BIZ（技術革新型中小企業）選定" },
  { year: "2019", event: "POSCOとチタン精密製品共同開発MOU締結" },
  { year: "2019", event: "韓国電力研究院MOU締結" },
  { year: "2019", event: "輸出有望中小企業認定 / 産業通商資源部長官賞受賞" },
  { year: "2019", event: "兵役指定企業選定 / 京畿道有望中小企業選定" },
  { year: "2020", event: "ASME U Stamp 認証取得" },
  { year: "2020", event: "企業附設研究所認定 / 労使文化優秀企業選定（京畿道知事表彰）" },
  { year: "2021", event: "チタン薄板輸出企業認定" },
  { year: "2021", event: "韓国機械産業振興会加入" },
  { year: "2022", event: "韓国女性経済人協会正会員加入" },
  { year: "2022", event: "女性経営人優秀企業表彰受賞" },
  { year: "2022", event: "韓国化学学会加入" },
  { year: "2023", event: "ISO 45001 認証取得" },
  { year: "2023", event: "コイル型熱交換器高効率熱交換構造関連特許 4件登録" },
  { year: "2023", event: "韓国女性経済人協会理事選任" },
  { year: "2023", event: "PETRONAS（マレーシア）公認ベンダー及び販売代理店選定" },
  { year: "2023", event: "女性企業エキスポ Africa Pavilion 金賞・優秀賞受賞" },
  { year: "2024", event: "国家戦略産業R&D課題選定" },
  { year: "2024", event: "チタン廃熱回収システム NET（新技術）認証取得（海洋水産部）" },
  { year: "2025", event: "2,000万ドル輸出の塔受賞" },
  { year: "2025", event: "チタン廃熱回収システム特許登録" },
  { year: "2025", event: "サウジアラビア（リヤド）・UAE（アブダビ）プラント輸出コンソーシアム事業実施" },
];

const certs = [
  { name: "ISO 9001:2015", org: "品質マネジメントシステム", body: "KR / TÜV" },
  { name: "ISO 14001:2015", org: "環境マネジメントシステム", body: "KR" },
  { name: "KS B 2334", org: "ガスケット関連KS認証", body: "国家技術標準院" },
  { name: "ASME 対応", org: "米国機械学会基準 設計・製造", body: "ASME" },
  { name: "ASTM B265", org: "チタン板材規格準拠", body: "ASTM" },
  { name: "RoHS 準拠", org: "環境有害物質制限", body: "EU" },
];

const facilities = [
  { name: "ハイドロフォーミングプレス", count: "5台", desc: "10〜500トンプレス" },
  { name: "CNC旋盤",                    count: "8台", desc: "エンドフィッティング精密加工" },
  { name: "TIG溶接機",                  count: "6台", desc: "不活性ガスバックパージ溶接" },
  { name: "水圧試験機",                  count: "3台", desc: "最大500 MPa" },
  { name: "ヘリウムリーク試験機",        count: "2台", desc: "10⁻⁶ mbar·L/s級" },
  { name: "XRF成分分析器",              count: "1台", desc: "即時成分分析" },
];

export default function JaAboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            About ATX
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            会社概要
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            1991年の創立以来、チタン配管一筋を歩んできた専門メーカー。
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
                  alt="ATX 全社員集合写真"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                  <p className="text-white font-bold text-sm">ATX Co., Ltd. 全社員</p>
                  <p className="text-silver-300 text-xs">チタン特殊非鉄加工専門企業</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              <ScrollReveal delay={100}>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-silver-100 shadow-ti">
                  <Image
                    src="/images/about/factory-interior.jpg"
                    alt="ATX 工場内部 — 大型クレーン設備"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                    <p className="text-white font-bold text-sm">京畿道 安山 始華工団 本社工場</p>
                    <p className="text-silver-300 text-xs">大型クレーン・精密加工設備完備</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="bg-ti-950 rounded-2xl px-6 py-5 flex flex-col gap-3">
                  <p className="text-accent text-xs font-semibold uppercase tracking-widest">Since 1991</p>
                  <p className="text-silver-200 font-bold text-lg leading-snug">
                    30年以上チタン一筋、<br />国内唯一の総合チタン配管専門メーカー
                  </p>
                  <p className="text-silver-400 text-sm leading-relaxed">
                    設計・成形・溶接・検査まで全工程を自社生産。POSCO・韓国電力・PETRONASなど国内外の主要納入先に供給し、技術力を実証しています。
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
              { icon: Factory, value: 30, suffix: "+", label: "業歴（年）" },
              { icon: Globe, value: 500, suffix: "+", label: "納入プロジェクト" },
              { icon: Award, value: 6, suffix: "件", label: "保有認証" },
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
              label="沿革"
              title="30年の成長の歴史"
              subtitle="一歩一歩積み上げてきた技術と信頼。"
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
              label="生産設備"
              title="最新設備で仕上げる精密さ"
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
              title="工場全景"
              subtitle="京畿道 安山 始華工団 本社 — 精密加工からクリーンルーム、研究所まで。"
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-factory.jpg", name: "工場全景", desc: "Factory Overview" },
              { src: "/images/about/facilities/facility-machining-room.jpg", name: "機械加工室", desc: "Machining Room" },
              { src: "/images/about/facilities/facility-clean-room.jpg", name: "クリーンルーム", desc: "Clean Room" },
              { src: "/images/about/facilities/facility-meeting-room.jpg", name: "会議室", desc: "Meeting Room" },
              { src: "/images/about/facilities/facility-research-center.jpg", name: "技術研究所", desc: "Research Center" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg", name: "真空熱処理炉", desc: "Vacuum Heat Treatment Furnace" },
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
              title="主要生産設備"
              subtitle="チタン特殊加工に特化した専用設備。"
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/about/facilities/facility-vacuum-heat-1.jpg", name: "真空熱処理機 1", desc: "Vacuum Heat Treatment" },
              { src: "/images/about/facilities/facility-cnc-machine.jpg", name: "CNC加工機", desc: "CNC Machine (Mazak)" },
              { src: "/images/about/facilities/facility-pmi-tester.jpg", name: "PMI成分分析器", desc: "Positive Material Identification" },
              { src: "/images/about/facilities/facility-tig-welding.jpg", name: "TIG溶接機", desc: "TIG Welding Machines" },
              { src: "/images/about/facilities/facility-laser-welding.jpg", name: "レーザー溶接機", desc: "Laser Welding Machines" },
              { src: "/images/about/facilities/facility-vacuum-heat-2.jpg", name: "真空熱処理機 2", desc: "Vacuum Heat Treatment Facility" },
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
              title="加工能力"
              subtitle="チタン・タンタル・ジルコニウムの全工程を自社で実施します。"
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "特殊金属加工",
                items: ["チタン / タンタル / ジルコニウム TIG溶接", "板材およびパイプ成形", "波管成形"],
              },
              {
                num: "02",
                title: "圧力機器製作",
                items: ["圧力容器製作", "熱交換器組立", "ASME基準非破壊検査および品質管理"],
              },
              {
                num: "03",
                title: "精密機械加工",
                items: ["CNC加工", "切削 / ミーリング / ドリリング"],
              },
              {
                num: "04",
                title: "表面処理および仕上げ",
                items: ["酸洗い / 不動態化処理", "洗浄および最終検査"],
              },
              {
                num: "05",
                title: "検査および試験",
                items: ["KOLAS公認試験", "水圧およびヘリウムリーク試験", "寸法検査"],
              },
              {
                num: "06",
                title: "品質保証システム",
                items: ["ISO / ASME 品質システム", "工程文書化および履歴追跡", "規格適合性管理"],
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
              label="認証取得状況"
              title="国際基準が認めた品質"
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
                  <p className="text-silver-500 text-xs">発行機関: {cert.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
