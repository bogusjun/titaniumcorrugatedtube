import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.atx-titanium.co.kr"),
  title: {
    default: "ATX 티타늄 주름관 | 티타늄 플렉시블 호스 전문 제조",
    template: "%s | ATX 티타늄 주름관",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/favicon-512.png",
  },
  description:
    "반도체·화학·항공·해양 산업을 위한 고품질 티타늄 주름관(Corrugated Tube) 및 플렉시블 호스 전문 제조사. Grade 1/2/7 티타늄, ISO 9001 인증.",
  keywords: [
    "티타늄 주름관",
    "titanium corrugated tube",
    "티타늄 플렉시블 호스",
    "flexible hose",
    "반도체 배관",
    "화학 배관",
    "내식성 배관",
    "ATX",
  ],
  authors: [{ name: "ATX Co., Ltd." }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.atx-titanium.co.kr",
    siteName: "ATX 티타늄 주름관",
    title: "ATX 티타늄 주름관 | 전문 제조사",
    description: "반도체·화학·항공·해양 산업용 고품질 티타늄 주름관 전문 제조",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "ATX 티타늄 주름관 — 고부식 환경 열교환 전문 제조사" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATX 티타늄 주름관",
    description: "티타늄 주름관 전문 제조사",
  },
  alternates: {
    canonical: "https://www.atx-titanium.co.kr",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ATX Co., Ltd.",
  alternateName: "ATX 티타늄 주름관",
  url: "https://www.atx-titanium.co.kr",
  logo: "https://www.atx-titanium.co.kr/images/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+82-31-000-0000",
    contactType: "sales",
    areaServed: ["KR", "JP", "US"],
    availableLanguage: ["Korean", "Japanese", "English"],
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
