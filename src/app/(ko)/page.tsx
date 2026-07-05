import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProductsPreview from "@/components/home/ProductsPreview";
import WhyTitanium from "@/components/home/WhyTitanium";
import IndustriesSection from "@/components/home/IndustriesSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductsPreview />
      <WhyTitanium />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
