import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "제품 소개",   href: "/products" },
  { label: "기술 특장점", href: "/technology" },
  { label: "적용 산업",   href: "/industries" },
  { label: "회사 소개",   href: "/about" },
  { label: "견적 문의",   href: "/support" },
  { label: "공지사항",    href: "/news" },
];

const productLinks = [
  { label: "단층 주름관 (Single Ply)",  href: "/products?category=single-ply" },
  { label: "다층 주름관 (Multi Ply)",   href: "/products?category=multi-ply" },
  { label: "브레이드형 주름관",          href: "/products?category=braided" },
  { label: "열교환기 주름관",            href: "/products?category=custom" },
  { label: "커스텀 규격 제작",           href: "/support" },
];

export default function Footer() {
  return (
    <footer className="bg-ti-950 text-silver-500">
      {/* Metal line */}
      <div className="metal-line" />

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-accent">
                <span className="text-ti-950 font-black text-lg">T</span>
              </div>
              <div>
                <div className="text-silver-200 font-black tracking-wider">ATX</div>
                <div className="text-[10px] text-silver-600 tracking-[0.18em] uppercase">Titanium Tube</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-silver-600 mb-6">
              티타늄 주름관·플렉시블 호스 전문 제조사.<br />
              반도체·화학·항공·해양 산업에 최고 품질의 티타늄 배관 솔루션을 공급합니다.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">031-000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">info@atx-titanium.co.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-silver-400 leading-relaxed">경기도 OO시 OO구 OO로 000<br />OO산업단지 O-O</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-silver-300 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              바로가기
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-600 hover:text-silver-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-silver-300 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              제품 라인업
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-600 hover:text-silver-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certs & CTA */}
          <div>
            <h4 className="text-silver-300 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              인증 현황
            </h4>
            <div className="space-y-2 mb-6">
              {["ISO 9001:2015", "ISO 14001", "KS 인증", "ASME 적용 대응"].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-sm text-silver-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-accent text-ti-950 text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-colors shadow-accent"
            >
              <ExternalLink className="w-4 h-4" />
              무료 견적 요청
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ti-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-silver-700">
          <p>© 2024 ATX Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-silver-400 transition-colors">개인정보처리방침</Link>
            <Link href="/terms"   className="hover:text-silver-400 transition-colors">이용약관</Link>
            <span>사업자등록번호: 000-00-00000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
