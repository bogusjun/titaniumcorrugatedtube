"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Locale = "ko" | "en" | "ja";

const locales: { code: Locale; label: string; short: string }[] = [
  { code: "ko", label: "한국어",   short: "KO" },
  { code: "en", label: "English",  short: "EN" },
  { code: "ja", label: "日本語",   short: "JA" },
];

function detectLocale(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  return "ko";
}

function localizedPath(pathname: string, target: Locale): string {
  const current = detectLocale(pathname);
  let base = pathname;

  if (current === "en") base = pathname.replace(/^\/en/, "") || "/";
  else if (current === "ja") base = pathname.replace(/^\/ja/, "") || "/";

  if (target === "ko") return base || "/";
  if (target === "en") return base === "/" ? "/en" : `/en${base}`;
  return base === "/" ? "/ja" : `/ja${base}`;
}

export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const current  = detectLocale(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const currentLocale = locales.find((l) => l.code === current)!;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language selector"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-silver-200 hover:text-white rounded-md border border-ti-700/60 hover:border-ti-600 hover:bg-ti-800/60 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLocale.short}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-ti-900 border border-ti-700 shadow-lg overflow-hidden animate-fade-in z-50">
          {locales.map((loc) => {
            const active = loc.code === current;
            return (
              <Link
                key={loc.code}
                href={localizedPath(pathname, loc.code)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-ti-800 text-white"
                    : "text-silver-200 hover:text-white hover:bg-ti-800/70"
                )}
              >
                <span>{loc.label}</span>
                {active && <Check className="w-4 h-4 text-accent" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
