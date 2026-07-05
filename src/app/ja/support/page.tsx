import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Download, FileText, ChevronDown } from "lucide-react";
import JaContactForm from "./ContactForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "お問い合わせ・サポート",
  description: "チタン波管のお見積もり依頼、技術資料ダウンロード、FAQ。",
};

const faqs = [
  {
    q: "最小注文数量（MOQ）はありますか？",
    a: "標準規格品はMOQなし、1本からご注文いただけます。カスタム製品は別途ご相談の上決定いたします。",
  },
  {
    q: "納期はどのくらいかかりますか？",
    a: "標準規格在庫品は即日出荷、製作品は一般的に2〜4週間かかります。緊急案件は別途ご相談ください。",
  },
  {
    q: "どのグレードを選べばよいですか？",
    a: "一般化学・海洋配管はGrade 2、半導体・医療はGrade 1、塩酸・硫酸環境はGrade 7（Pd合金）を推奨します。技術相談を通じて最適なグレードを決定いたします。",
  },
  {
    q: "カスタム規格の製作は可能ですか？",
    a: "はい、お客様の図面に基づいて6A〜100Aの全規格をカスタム製作いたします。特殊接続方式、非標準長さ、顧客認証要件にも対応いたします。",
  },
  {
    q: "試験成績書（Mill Certificate）を受け取れますか？",
    a: "全製品にEN 10204 3.1基準のミルシートと製品試験成績書を提供いたします。ご要望の場合は第三者機関試験も対応可能です。",
  },
  {
    q: "日本への輸出は可能ですか？",
    a: "日本を含む20カ国以上への輸出実績があります。輸出書類（C/O、Packing List等）一式をサポートいたします。",
  },
];

const downloads = [
  { name: "製品カタログ（日本語）", size: "8.2 MB", type: "PDF" },
  { name: "Product Catalog (English)", size: "7.8 MB", type: "PDF" },
  { name: "規格表（全製品）", size: "1.2 MB", type: "PDF" },
  { name: "ISO 9001 認証書", size: "0.3 MB", type: "PDF" },
  { name: "チタングレード別物性表", size: "0.5 MB", type: "PDF" },
  { name: "設置・保守ガイド", size: "2.1 MB", type: "PDF" },
];

export default function JaSupportPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Customer Support
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            お問い合わせ・サポート
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            お見積もり依頼、技術相談、資料ダウンロード — 何でもお気軽にご相談ください。
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-ink mb-2">お見積もり・お問い合わせ</h2>
                <p className="text-ink-subtle text-sm mb-8">
                  詳細な仕様をご記入いただくほど、より正確なお見積もりをご提供できます。
                </p>
                <JaContactForm />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <ScrollReveal delay={100}>
              <div className="bg-ti-950 rounded-2xl p-6">
                <h3 className="font-bold text-silver-200 text-lg mb-5">連絡先</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">電話</p>
                      <a href="tel:+82-1544-1909" className="text-silver-200 hover:text-accent transition-colors font-medium">
                        +82-1544-1909
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">メールアドレス</p>
                      <a href="mailto:777@atx.kr" className="text-silver-200 hover:text-accent transition-colors font-medium text-xs">
                        777@atx.kr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">所在地</p>
                      <p className="text-silver-200 leading-relaxed">
                        韓国 京畿道 安山市 団元区<br />
                        番栄路44番街2
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">営業時間</p>
                      <p className="text-silver-200">平日 09:00 〜 18:00（韓国時間）</p>
                      <p className="text-silver-500 text-xs">土・日・祝日休業</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Downloads */}
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-6">
                <h3 className="font-bold text-ink text-lg mb-4">技術資料ダウンロード</h3>
                <div className="space-y-2">
                  {downloads.map((doc) => (
                    <a
                      key={doc.name}
                      href="#"
                      download
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-silver-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-muted group-hover:text-accent transition-colors truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-ink-subtle">{doc.type} · {doc.size}</p>
                      </div>
                      <Download className="w-4 h-4 text-ink-subtle group-hover:text-accent transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* FAQ */}
        <ScrollReveal delay={100}>
          <div className="mt-16 bg-white rounded-2xl border border-silver-100 shadow-sm overflow-hidden">
            <div className="bg-ti-950 px-8 py-5">
              <h2 className="text-silver-200 font-bold text-xl">よくある質問（FAQ）</h2>
            </div>
            <div className="divide-y divide-silver-100">
              {faqs.map((faq, i) => (
                <details key={i} className="group px-8 py-5 cursor-pointer">
                  <summary className="flex items-center justify-between list-none font-semibold text-ink text-sm">
                    <span className="pr-4">Q. {faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-ink-subtle flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-ink-muted text-sm leading-relaxed pl-4 border-l-2 border-accent">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
