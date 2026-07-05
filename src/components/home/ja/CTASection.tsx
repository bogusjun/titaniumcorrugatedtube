import Link from "next/link";
import { ArrowRight, Phone, Mail, Download } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function JaCTASection() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="metal-line absolute top-0 left-0 right-0" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="container-pad relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-label">
              <span className="w-6 h-px bg-accent" />
              今すぐ始めましょう
              <span className="w-6 h-px bg-accent" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-silver-200 mb-5 leading-tight tracking-tight">
              高腐食環境の熱交換、<br />
              <span className="text-accent">専門家にご相談</span>ください
            </h2>
            <p className="text-silver-500 text-lg leading-relaxed">
              規格選定から設置まで — 20年の経験を持つチタン熱交換器の専門家が<br className="hidden md:block" />
              最適なソリューションをご提案します。図面確認・技術相談は無料。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/ja/support"
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-accent hover:bg-accent-dark border border-accent/50 transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowRight className="w-9 h-9 text-white" />
              <h3 className="text-white font-bold text-xl">お見積もり依頼</h3>
              <p className="text-white/70 text-sm text-center leading-relaxed">
                規格・数量・接続方式をお知らせいただければ<br />24時間以内にご回答します
              </p>
            </Link>

            <a
              href="tel:+82-1544-1909"
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-ti-900 hover:bg-ti-800 border border-ti-800 hover:border-ti-700 transition-all duration-300 hover:-translate-y-1"
            >
              <Phone className="w-9 h-9 text-accent" />
              <h3 className="text-silver-200 font-bold text-xl">お電話でのご相談</h3>
              <p className="text-silver-500 text-sm text-center leading-relaxed">
                +82-1544-1909<br />平日 09:00 〜 18:00（韓国時間）
              </p>
            </a>

            <a
              href="/catalog.pdf"
              download
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-ti-900 hover:bg-ti-800 border border-ti-800 hover:border-ti-700 transition-all duration-300 hover:-translate-y-1"
            >
              <Download className="w-9 h-9 text-accent" />
              <h3 className="text-silver-200 font-bold text-xl">カタログダウンロード</h3>
              <p className="text-silver-500 text-sm text-center leading-relaxed">
                全製品仕様・規格表収録<br />PDF 無料提供
              </p>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="text-center mt-10">
            <a
              href="mailto:777@atx.kr"
              className="inline-flex items-center gap-2 text-silver-600 hover:text-silver-300 text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              777@atx.kr
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className="metal-line absolute bottom-0 left-0 right-0" />
    </section>
  );
}
