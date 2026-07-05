import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "製品紹介",   href: "/ja/products" },
  { label: "技術特長",   href: "/ja/technology" },
  { label: "適用産業",   href: "/ja/industries" },
  { label: "会社概要",   href: "/ja/about" },
  { label: "お見積もり", href: "/ja/support" },
  { label: "お知らせ",   href: "/ja/news" },
];

const productLinks = [
  { label: "単層波管 (Single Ply)",  href: "/ja/products?category=single-ply" },
  { label: "多層波管 (Multi Ply)",   href: "/ja/products?category=multi-ply" },
  { label: "ブレード型波管",          href: "/ja/products?category=braided" },
  { label: "熱交換器用波管",          href: "/ja/products?category=custom" },
  { label: "カスタム規格製作",        href: "/ja/support" },
];

export default function JaFooter() {
  return (
    <footer className="bg-ti-950 text-silver-500">
      <div className="metal-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/images/logo.png"
                alt="ATX チタン波管"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-silver-600 mb-6">
              チタン・特殊非鉄金属の専門メーカー。<br />
              養殖場熱交換設備の対応実績多数。
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">+82-1544-1909</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-silver-400">777@atx.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-silver-400 leading-relaxed">
                  韓国 京畿道 安山市 団元区<br />
                  番栄路44番街2
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-silver-300 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              クイックリンク
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
              製品ラインナップ
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
              認証取得状況
            </h4>
            <div className="space-y-2 mb-6">
              {["ISO 9001:2015", "ISO 14001", "KS 認証", "ASME 対応"].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-sm text-silver-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
            <Link
              href="/ja/support"
              className="inline-flex items-center gap-2 bg-accent text-ti-950 text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-colors shadow-accent"
            >
              <ExternalLink className="w-4 h-4" />
              無料見積もり依頼
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ti-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-silver-700">
          <p>© 2024 ATX Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/ja/privacy" className="hover:text-silver-400 transition-colors">プライバシーポリシー</Link>
            <Link href="/ja/terms"   className="hover:text-silver-400 transition-colors">利用規約</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
