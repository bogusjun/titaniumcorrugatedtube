import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import WhyTitanium from "@/components/home/WhyTitanium";
import IndustriesSection from "@/components/home/IndustriesSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "ATX 티타늄 주름관 | 고부식 환경 열교환 전문 제조사",
  description:
    "반도체·화학·해양·항공우주 산업의 고부식 환경 열교환기용 티타늄 주름관 전문 제조사. Grade 1/2/7 티타늄, 소량 1개부터 대량까지 맞춤 공급.",
  alternates: {
    canonical: "https://www.atx-titanium.co.kr",
    languages: {
      ko: "https://www.atx-titanium.co.kr",
      en: "https://www.atx-titanium.co.kr/en",
      ja: "https://www.atx-titanium.co.kr/ja",
    },
  },
  openGraph: {
    title: "ATX 티타늄 주름관 | 고부식 환경 열교환 전문 제조사",
    description:
      "반도체·화학·해양·항공우주 산업의 고부식 환경 열교환기용 티타늄 주름관 전문 제조사.",
    url: "https://www.atx-titanium.co.kr",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "ATX 티타늄 주름관 — 고부식 환경 열교환 전문 제조사" }],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ATX 티타늄 주름관",
  url: "https://www.atx-titanium.co.kr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.atx-titanium.co.kr/products?category={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <StatsSection />
      <ProductsPreview />
      <WhyTitanium />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
