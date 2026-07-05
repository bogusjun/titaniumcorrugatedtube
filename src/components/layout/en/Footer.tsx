import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "Products",      href: "/en/products" },
  { label: "Technology",    href: "/en/technology" },
  { label: "Industries",    href: "/en/industries" },
  { label: "About",         href: "/en/about" },
  { label: "Get a Quote",   href: "/en/support" },
  { label: "News",          href: "/en/news" },
];

const productLinks = [
  { label: "Single Ply Corrugated Tube", href: "/en/products?category=single-ply" },
  { label: "Multi Ply Corrugated Tube",  href: "/en/products?category=multi-ply" },
  { label: "Braided Corrugated Tube",    href: "/en/products?category=braided" },
  { label: "Heat Exchanger Tube",        href: "/en/products?category=custom" },
  { label: "Custom Specifications",      href: "/en/support" },
];

export default function EnFooter() {
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
                alt="ATX Titanium Corrugated Tube"
                width={100}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-silver-600 mb-6">
              Specialist manufacturer of titanium &amp; special non-ferrous metals.<br />
              Proven track record in aquaculture heat exchange systems.
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
                  44-gil 2, Beonyeong-ro, Danwon-gu<br />
                  Ansan-si, Gyeonggi-do, Korea
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-silver-300 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">
              Quick Links
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
              Product Lineup
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
              Certifications
            </h4>
            <div className="space-y-2 mb-6">
              {["ISO 9001:2015", "ISO 14001", "KS Certification", "ASME Compliant"].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-sm text-silver-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
            <Link
              href="/en/support"
              className="inline-flex items-center gap-2 bg-accent text-ti-950 text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-colors shadow-accent"
            >
              <ExternalLink className="w-4 h-4" />
              Free Quote Request
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ti-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-silver-700">
          <p>© 2024 ATX Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/en/privacy" className="hover:text-silver-400 transition-colors">Privacy Policy</Link>
            <Link href="/en/terms"   className="hover:text-silver-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
