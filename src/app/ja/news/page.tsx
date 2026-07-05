import type { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "お知らせ・ニュース",
  description: "ATX チタン波管 展示会参加、新製品発売、お知らせ。",
};

const news = [
  {
    id: 1,
    category: "展示会",
    title: "2025 仁川 INCHEM KOREA 展示会参加のご案内",
    date: "2025-11-05",
    excerpt:
      "ATXが仁川 松島コンベンシアで開催されるINCHEM KOREA 2025に参加します。最新のチタン波管ラインナップと熱交換器ソリューションを直接ご確認ください。",
    tag: "展示会",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/tube-coil.jpg",
  },
  {
    id: 2,
    category: "新製品",
    title: "Grade 9 (Ti-3Al-2.5V) ブレード波管 発売",
    date: "2025-09-15",
    excerpt:
      "航空宇宙・防衛分野のお客様のご要望にお応えし、Ti-3Al-2.5V（Grade 9）ブレード型波管を発売しました。純チタン比30%高い強度を提供します。",
    tag: "新製品",
    tagColor: "bg-green-100 text-green-700",
    image: "/images/products/tube-3.jpg",
  },
  {
    id: 3,
    category: "お知らせ",
    title: "2025年 WEFTEC（米国シカゴ）参加レポート",
    date: "2025-10-20",
    excerpt:
      "世界最大の水処理・環境産業展示会であるWEFTEC 2025に参加し、北米市場のお客様にチタン波管ソリューションをご紹介しました。",
    tag: "展示会",
    tagColor: "bg-accent/10 text-accent",
    image: "/images/products/heat-exchanger.jpg",
  },
  {
    id: 4,
    category: "認証",
    title: "ISO 9001:2015 認証更新完了",
    date: "2025-08-01",
    excerpt:
      "ATXはISO 9001:2015品質マネジメントシステム認証を無事更新しました。継続的な品質向上とお客様満足のために努力してまいります。",
    tag: "認証",
    tagColor: "bg-amber-100 text-amber-700",
    image: "/images/products/tube-drawing.png",
  },
  {
    id: 5,
    category: "納入事例",
    title: "国内半導体FAB フッ化水素酸移送配管500m供給完了",
    date: "2025-06-30",
    excerpt:
      "国内主要半導体メーカーの洗浄工程フッ化水素酸移送配管交換プロジェクトを無事完了しました。Grade 1チタン波管500mを納入しました。",
    tag: "納入事例",
    tagColor: "bg-purple-100 text-purple-700",
    image: "/images/products/tube-1.jpg",
  },
  {
    id: 6,
    category: "お知らせ",
    title: "夏季休業期間中の生産・出荷スケジュールのご案内",
    date: "2025-09-01",
    excerpt:
      "夏季休業期間中の生産および出荷スケジュールをご案内します。緊急のご依頼は事前にご相談ください。",
    tag: "お知らせ",
    tagColor: "bg-silver-100 text-ink-muted",
    image: null,
  },
];

export default function JaNewsPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            News & Notice
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            お知らせ・ニュース
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            展示会参加、新製品発売、納入事例などATXの最新情報をお届けします。
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {["すべて", "展示会", "新製品", "納入事例", "認証", "お知らせ"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat === "すべて"
                  ? "bg-ti-950 text-silver-200"
                  : "bg-white text-ink-muted border border-silver-100 hover:bg-silver-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <article className="bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                {item.image && (
                  <div className="relative h-44 overflow-hidden bg-silver-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ti-950/30 to-transparent" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1 text-ink-subtle text-xs">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>

                  <h2 className="font-bold text-ink text-base mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-ink-muted text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center text-accent text-sm font-semibold hover:gap-2 gap-1 transition-all">
                    詳細を見る <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="btn-dark">
            もっと見る
          </button>
        </div>
      </div>
    </div>
  );
}
