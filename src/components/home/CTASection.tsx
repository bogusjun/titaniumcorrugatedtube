import Link from "next/link";
import { ArrowRight, Phone, Mail, Download } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="metal-line absolute top-0 left-0 right-0" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="container-pad relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-label">
              <span className="w-6 h-px bg-accent" />
              지금 바로 시작하세요
              <span className="w-6 h-px bg-accent" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-silver-200 mb-5 leading-tight tracking-tight">
              배관 문제,<br />
              <span className="text-accent">전문가와 상담</span>하세요
            </h2>
            <p className="text-silver-500 text-lg leading-relaxed">
              규격 선택부터 설치까지 — 20년 경험의 티타늄 배관 전문가가<br className="hidden md:block" />
              최적의 솔루션을 제안해 드립니다. 도면 검토 및 기술 상담 무료.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Quotation CTA */}
            <Link
              href="/support"
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-accent hover:bg-accent-dark border border-accent/50 transition-all duration-300 hover:-translate-y-1"
            >
              <ArrowRight className="w-9 h-9 text-white" />
              <h3 className="text-white font-bold text-xl">견적 문의</h3>
              <p className="text-white/70 text-sm text-center leading-relaxed">
                규격·수량·연결방식을 알려주시면<br />24시간 내 회신드립니다
              </p>
            </Link>

            {/* Phone */}
            <a
              href="tel:031-000-0000"
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-ti-900 hover:bg-ti-800 border border-ti-800 hover:border-ti-700 transition-all duration-300 hover:-translate-y-1"
            >
              <Phone className="w-9 h-9 text-accent" />
              <h3 className="text-silver-200 font-bold text-xl">전화 상담</h3>
              <p className="text-silver-500 text-sm text-center leading-relaxed">
                031-000-0000<br />평일 09:00 ~ 18:00
              </p>
            </a>

            {/* Catalog */}
            <a
              href="/catalog.pdf"
              download
              className="group flex flex-col items-center gap-3 p-8 rounded-2xl bg-ti-900 hover:bg-ti-800 border border-ti-800 hover:border-ti-700 transition-all duration-300 hover:-translate-y-1"
            >
              <Download className="w-9 h-9 text-accent" />
              <h3 className="text-silver-200 font-bold text-xl">카탈로그 다운로드</h3>
              <p className="text-silver-500 text-sm text-center leading-relaxed">
                전 제품 사양·규격표 포함<br />PDF 무료 제공
              </p>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="text-center mt-10">
            <a
              href="mailto:info@atx-titanium.co.kr"
              className="inline-flex items-center gap-2 text-silver-600 hover:text-silver-300 text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@atx-titanium.co.kr
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className="metal-line absolute bottom-0 left-0 right-0" />
    </section>
  );
}
