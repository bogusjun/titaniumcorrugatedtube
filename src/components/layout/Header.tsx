"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "제품 소개",
    href: "/products",
    children: [
      { label: "티타늄 주름관",   href: "/products" },
      { label: "코일형 열교환기", href: "/products#heat-exchanger" },
    ],
  },
  { label: "기술 특장점", href: "/technology" },
  {
    label: "적용 산업",
    href: "/industries",
    children: [
      { label: "반도체·디스플레이", href: "/industries#semiconductor" },
      { label: "석유화학·플랜트",   href: "/industries#chemical" },
      { label: "항공우주·방산",     href: "/industries#aerospace" },
      { label: "의료기기",          href: "/industries#medical" },
      { label: "해양·선박",         href: "/industries#marine" },
    ],
  },
  { label: "회사 소개",  href: "/about" },
  { label: "공지사항",   href: "/news" },
];

export default function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome   = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const headerBg = scrolled || !isHome
    ? "bg-ti-950/95 backdrop-blur-md shadow-ti-md border-b border-ti-800"
    : "bg-transparent";

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", headerBg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex flex-col leading-tight">
              <span className="text-silver-200 font-black text-base tracking-wider">ATX</span>
              <span className="text-silver-500 text-[10px] tracking-[0.18em] uppercase">Titanium Tube</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-accent"
                      : "text-silver-400 hover:text-silver-200"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-ti-950 border border-ti-800 rounded-xl shadow-ti-lg overflow-hidden animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-silver-400 hover:text-silver-200 hover:bg-ti-800/60 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:031-000-0000"
              className="flex items-center gap-1.5 text-silver-500 hover:text-silver-200 text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              031-000-0000
            </a>
            <Link href="/support" className="btn-primary text-sm py-2 px-5">
              견적 문의
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-silver-300 p-2 rounded-md hover:bg-ti-800 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ti-950 border-t border-ti-800 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-silver-300 hover:text-silver-100 hover:bg-ti-800/50 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-xs text-silver-500 hover:text-silver-300 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-ti-800">
              <Link href="/support" className="btn-primary w-full justify-center">
                견적 문의
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
