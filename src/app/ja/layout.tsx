import type { Metadata } from "next";
import { Suspense } from "react";
import JaHeader from "@/components/layout/ja/Header";
import JaFooter from "@/components/layout/ja/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.atx-titanium.co.kr"),
  title: {
    default: "ATX チタン波管 | チタン製フレキシブルホース専門メーカー",
    template: "%s | ATX チタン波管",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/favicon-512.png",
  },
  description:
    "半導体・化学・航空・海洋産業向け高品質チタン波管（Corrugated Tube）およびフレキシブルホース専門メーカー。Grade 1/2/7 チタン、ISO 9001認証取得。",
  keywords: [
    "チタン波管",
    "titanium corrugated tube",
    "チタンフレキシブルホース",
    "flexible hose",
    "半導体配管",
    "化学配管",
    "耐食性配管",
    "ATX",
  ],
  authors: [{ name: "ATX Co., Ltd." }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.atx-titanium.co.kr/ja",
    siteName: "ATX チタン波管",
    title: "ATX チタン波管 | 専門メーカー",
    description: "半導体・化学・航空・海洋産業向け高品質チタン波管専門メーカー",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "ATX チタン波管 — 耐食性熱交換専門メーカー" }],
  },
  alternates: {
    canonical: "https://www.atx-titanium.co.kr/ja",
    languages: {
      ko: "https://www.atx-titanium.co.kr",
      en: "https://www.atx-titanium.co.kr/en",
      ja: "https://www.atx-titanium.co.kr/ja",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function JaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <JaHeader />
      </Suspense>
      <main>{children}</main>
      <JaFooter />
    </>
  );
}
