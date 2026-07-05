import JaHeroSection from "@/components/home/ja/HeroSection";
import JaStatsSection from "@/components/home/ja/StatsSection";
import JaProductsPreview from "@/components/home/ja/ProductsPreview";
import JaWhyTitanium from "@/components/home/ja/WhyTitanium";
import JaIndustriesSection from "@/components/home/ja/IndustriesSection";
import JaCTASection from "@/components/home/ja/CTASection";

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
