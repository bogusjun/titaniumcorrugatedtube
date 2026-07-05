import type { Metadata } from "next";
import EnHeader from "@/components/layout/en/Header";
import EnFooter from "@/components/layout/en/Footer";

export const metadata: Metadata = {
  title: {
    default: "ATX Titanium Corrugated Tube | Titanium Flexible Hose Manufacturer",
    template: "%s | ATX Titanium",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/images/favicon-512.png",
  },
  description:
    "Professional manufacturer of high-quality titanium corrugated tubes and flexible hoses for semiconductor, chemical, aerospace, and marine industries. Grade 1/2/7 titanium, ISO 9001 certified.",
  keywords: [
    "titanium corrugated tube",
    "titanium flexible hose",
    "flexible hose",
    "semiconductor piping",
    "chemical piping",
    "corrosion resistant piping",
    "ATX",
    "heat exchanger",
  ],
  authors: [{ name: "ATX Co., Ltd." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.atx-titanium.co.kr/en",
    siteName: "ATX Titanium",
    title: "ATX Titanium Corrugated Tube | Manufacturer",
    description: "High-quality titanium corrugated tubes for semiconductor, chemical, aerospace & marine industries",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EnHeader />
      <main>{children}</main>
      <EnFooter />
    </>
  );
}
