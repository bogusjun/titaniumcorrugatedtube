import EnHeroSection from "@/components/home/en/HeroSection";
import EnStatsSection from "@/components/home/en/StatsSection";
import EnProductsPreview from "@/components/home/en/ProductsPreview";
import EnWhyTitanium from "@/components/home/en/WhyTitanium";
import EnIndustriesSection from "@/components/home/en/IndustriesSection";
import EnCTASection from "@/components/home/en/CTASection";

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
