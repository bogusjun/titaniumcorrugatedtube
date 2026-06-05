import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Download, FileText, ChevronDown } from "lucide-react";
import ContactForm from "./ContactForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "고객 지원",
  description: "티타늄 주름관 견적 요청, 기술 자료 다운로드, FAQ.",
};

const faqs = [
  {
    q: "최소 주문 수량(MOQ)이 있나요?",
    a: "표준 규격 제품은 MOQ 없이 1본부터 주문 가능합니다. 커스텀 제품은 별도 협의 후 결정됩니다.",
  },
  {
    q: "납기는 얼마나 걸리나요?",
    a: "표준 규격 재고품은 즉시 출고, 제작품은 일반적으로 2~4주 소요됩니다. 긴급 건은 별도 협의 가능합니다.",
  },
  {
    q: "어떤 Grade를 선택해야 하나요?",
    a: "일반 화학·해양 배관은 Grade 2, 반도체·의료는 Grade 1, 염산·황산 환경은 Grade 7(Pd 합금)을 권장합니다. 기술 상담을 통해 최적 Grade를 결정해 드립니다.",
  },
  {
    q: "커스텀 규격 제작이 가능한가요?",
    a: "네, 고객 도면을 기반으로 6A~100A 전 규격을 맞춤 제작합니다. 특수 연결 방식, 비표준 길이, 고객사 인증 요건까지 대응합니다.",
  },
  {
    q: "시험 성적서(Mill Certificate)를 받을 수 있나요?",
    a: "모든 제품에 EN 10204 3.1 기준의 밀 시트와 제품 시험 성적서를 제공합니다. 요청 시 제3자 기관 시험도 가능합니다.",
  },
  {
    q: "해외 수출도 가능한가요?",
    a: "일본, 미국, 중국, 동남아 등 20개국 이상에 수출 실적이 있습니다. 수출 서류 (C/O, Packing List 등) 일체 지원합니다.",
  },
];

const downloads = [
  { name: "제품 카탈로그 (한국어)", size: "8.2 MB", type: "PDF" },
  { name: "Product Catalog (English)", size: "7.8 MB", type: "PDF" },
  { name: "규격표 (전 제품)", size: "1.2 MB", type: "PDF" },
  { name: "ISO 9001 인증서", size: "0.3 MB", type: "PDF" },
  { name: "티타늄 Grade별 물성표", size: "0.5 MB", type: "PDF" },
  { name: "설치·유지보수 가이드", size: "2.1 MB", type: "PDF" },
];

export default function SupportPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Header */}
      <div className="bg-ti-950 py-20">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Customer Support
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            고객 지원
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            견적 요청, 기술 상담, 자료 다운로드 — 무엇이든 도와드립니다.
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-ink mb-2">견적·문의 요청</h2>
                <p className="text-ink-subtle text-sm mb-8">
                  상세 사양을 입력하실수록 더 정확한 견적을 드릴 수 있습니다.
                </p>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <ScrollReveal delay={100}>
              <div className="bg-ti-950 rounded-2xl p-6">
                <h3 className="font-bold text-silver-200 text-lg mb-5">연락처</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">전화</p>
                      <a href="tel:031-000-0000" className="text-silver-200 hover:text-accent transition-colors font-medium">
                        031-000-0000
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">이메일</p>
                      <a href="mailto:info@atx-titanium.co.kr" className="text-silver-200 hover:text-accent transition-colors font-medium text-xs">
                        info@atx-titanium.co.kr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">주소</p>
                      <p className="text-silver-200 leading-relaxed">경기도 OO시 OO구 OO로 000<br />OO산업단지 O-O</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-silver-500 text-xs mb-0.5">영업시간</p>
                      <p className="text-silver-200">평일 09:00 ~ 18:00</p>
                      <p className="text-silver-500 text-xs">토·일·공휴일 휴무</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Downloads */}
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-2xl border border-silver-100 shadow-sm p-6">
                <h3 className="font-bold text-ink text-lg mb-4">기술 자료 다운로드</h3>
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
              <h2 className="text-silver-200 font-bold text-xl">자주 묻는 질문 (FAQ)</h2>
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
