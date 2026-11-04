import type { Metadata } from "next";
import JaHeroSection from "@/components/home/ja/HeroSection";
import JaStatsSection from "@/components/home/ja/StatsSection";
import JaProductsPreview from "@/components/home/ja/ProductsPreview";
import JaWhyTitanium from "@/components/home/ja/WhyTitanium";
import JaIndustriesSection from "@/components/home/ja/IndustriesSection";
import JaCTASection from "@/components/home/ja/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ja",
  path: "",
  title: "ATX チタン波管 | チタン製フレキシブルホース専門メーカー",
  description:
    "半導体・化学・航空・海洋産業向け高品質チタン波管（Corrugated Tube）およびフレキシブルホース専門メーカー。Grade 1/2/7 チタン、ISO 9001認証取得。",
  absoluteTitle: true,
});

export default function JaHomePage() {
  return (
    <>
      <JaHeroSection />
      <JaStatsSection />
      <JaProductsPreview />
      <JaWhyTitanium />
      <JaIndustriesSection />
      <JaCTASection />
    </>
  );
}
