import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import WhyTitanium from "@/components/home/WhyTitanium";
import IndustriesSection from "@/components/home/IndustriesSection";
import CTASection from "@/components/home/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  path: "",
  title: "ATX 티타늄 주름관 | 고부식 환경 열교환 전문 제조사",
  description:
    "반도체·화학·해양·항공우주 산업의 고부식 환경 열교환기용 티타늄 주름관 전문 제조사. Grade 1/2/7 티타늄, 소량 1개부터 대량까지 맞춤 공급.",
  absoluteTitle: true,
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ATX 티타늄 주름관",
  url: "https://tube.atx.kr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://tube.atx.kr/products?category={search_term_string}",
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
