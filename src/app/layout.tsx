import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ATX 티타늄 주름관 | 티타늄 플렉시블 호스 전문 제조",
    template: "%s | ATX 티타늄 주름관",
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
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATX 티타늄 주름관",
    description: "티타늄 주름관 전문 제조사",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="antialiased font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
