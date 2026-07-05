import Link from "next/link";
import Image from "next/image";
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
            <div className="mb-5">
              <Image
                src="/images/logo.png"
                alt="ATX 티타늄 주름관"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-silver-600 mb-6">
              티타늄, 특수비철 전문 기업.<br />
              양식장 열교환 설비 관련 대응 경험 다수.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">1544-1909</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">777@atx.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-silver-400 leading-relaxed">경기도 안산시 단원구 번영로 44번길 2</span>
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
