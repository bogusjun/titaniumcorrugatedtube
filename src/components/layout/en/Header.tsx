"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const productItems = [
  { label: "Titanium Corrugated Tube", href: "/en/products?category=tube" },
  { label: "Titanium Heat Exchanger",  href: "/en/products?category=heat-exchanger" },
  { label: "Waste Heat Recovery",      href: "/en/products/waste-heat-recovery" },
];

const navItems = [
  { label: "Industries", href: "/en/industries" },
  { label: "Cases",      href: "/en/cases" },
  { label: "About",      href: "/en/about" },
];

export default function EnHeader() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const isHome       = pathname === "/en";

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (!hrefQuery) return true;
    const [key, val] = hrefQuery.split("=");
    return searchParams.get(key) === val;
  };

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
          <Link href="/en" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="ATX Titanium Corrugated Tube"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-ti-800/40 rounded-lg px-1 py-1 mr-2">
              {productItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-ti-700 text-white"
                      : "text-silver-300 hover:text-white hover:bg-ti-700/60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "text-accent"
                    : "text-silver-200 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+82-1544-1909"
              className="flex items-center gap-1.5 text-silver-200 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              +82-1544-1909
            </a>
            <Link href="/en/support" className="btn-primary text-sm py-2 px-5">
              Get a Quote
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
            <div className="pb-2 mb-1 border-b border-ti-800">
              <p className="px-4 py-1 text-xs text-silver-600 uppercase tracking-wider">Products</p>
              {productItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm font-medium text-silver-300 hover:text-silver-100 hover:bg-ti-800/50 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium text-silver-300 hover:text-silver-100 hover:bg-ti-800/50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-ti-800">
              <Link href="/en/support" className="btn-primary w-full justify-center">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
