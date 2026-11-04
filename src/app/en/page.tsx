import type { Metadata } from "next";
import EnHeroSection from "@/components/home/en/HeroSection";
import EnStatsSection from "@/components/home/en/StatsSection";
import EnProductsPreview from "@/components/home/en/ProductsPreview";
import EnWhyTitanium from "@/components/home/en/WhyTitanium";
import EnIndustriesSection from "@/components/home/en/IndustriesSection";
import EnCTASection from "@/components/home/en/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  path: "",
  title: "ATX Titanium Corrugated Tube | Titanium Flexible Hose Manufacturer",
  description:
    "Professional manufacturer of high-quality titanium corrugated tubes and flexible hoses for semiconductor, chemical, aerospace, and marine industries. Grade 1/2/7 titanium, ISO 9001 certified.",
  absoluteTitle: true,
});

export default function EnHomePage() {
  return (
    <>
      <EnHeroSection />
      <EnStatsSection />
      <EnProductsPreview />
      <EnWhyTitanium />
      <EnIndustriesSection />
      <EnCTASection />
    </>
  );
}
