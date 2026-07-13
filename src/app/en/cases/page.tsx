import type { Metadata } from "next";
import CasesCarousel from "@/app/(ko)/cases/CasesCarousel";

export const metadata: Metadata = {
  title: "Application Cases",
  description: "ATX titanium tube delivery cases: chemical plants, semiconductor, electroplating, marine aquaculture, and nuclear.",
};

const cases = [
  {
    id: 1,
    title: "Titanium Coil Heat Exchanger for NEX-REVO",
    location: "Japan · NEX-REVO Co., Ltd.",
    description: "Spiral titanium corrugated coils built for a highly corrosive process fluid environment. Delivered as a four-unit set with multi-turn, multi-column geometry per customer drawing and deployed on a Japanese production line.",
    image: "/images/products/case-nexrevo-japan-4.jpg",
    tag: "Export · Japan",
  },
  {
    id: 2,
    title: "Land-Based Aquaculture Seawater Piping System",
    location: "Yeosu, South Jeolla Province, Korea",
    description: "Frequent cracks and seawater corrosion issues with PVC piping resolved using titanium corrugated tubes. Operating for 3+ years without replacement since installation.",
    image: "/images/products/case-fish-farm-yeosu.jpg",
    tag: "Aquaculture",
  },
  {
    id: 3,
    title: "Live Fish Transport Tank Piping",
    location: "Live Fish Transport Specialist",
    description: "Harsh environment where vibration during transit and seawater corrosion act simultaneously. Problem resolved with corrugated tube flexibility and titanium's corrosion resistance.",
    image: "/images/products/case-fish-tank-truck.jpg",
    tag: "Aquaculture & Logistics",
  },
  {
    id: 4,
    title: "Seawater Sauna Hot Water Piping",
    location: "Seawater Thermal Bath Facility",
    description: "General stainless steel required replacement every 6 months in piping circulating high-temperature seawater. Corrosion issues completely eliminated after switching to titanium.",
    image: "/images/products/case-seawater-sauna.jpg",
    tag: "Spa & Thermal Bath",
  },
];

export default function EnCasesPage() {
  return (
    <div className="pt-20 min-h-screen bg-ti-950">
      {/* Hero */}
      <div className="py-20 container-pad text-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Application Cases
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-6">
          ATX specialises exclusively in titanium<br className="hidden sm:block" />
          and special non-ferrous metals for corrosive environments.
        </h1>
        <p className="text-silver-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          Chemical plants, semiconductor, electroplating, marine aquaculture, nuclear —<br className="hidden sm:block" />
          ATX&apos;s technical capability has already been proven in environments where corrosion damages equipment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-20">
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">Export to Japan</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              NEX-REVO Coil Heat Exchanger
              <br />
              <span className="text-silver-500 text-xs">Direct delivery to overseas production line</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">3+ Years</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              Multiple No-Replacement Sites
              <br />
              <span className="text-silver-500 text-xs">Repeat orders after delivery prove it</span>
            </p>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-black text-accent mb-1">100%</span>
            <p className="text-silver-400 text-sm leading-relaxed">
              Titanium Material
              <br />
              <span className="text-silver-500 text-xs">Optimal for seawater, high-temp &amp; corrosive environments</span>
            </p>
          </div>
        </div>
      </div>

      <CasesCarousel cases={cases} />

      <div className="py-20 container-pad text-center">
        <p className="text-silver-400 mb-2 text-lg font-semibold text-silver-200">
          Let us identify your corrosion problem together.
        </p>
        <p className="text-silver-500 text-sm mb-8">
          From material selection to processing specifications, we find the right answer for your environment.
        </p>
        <a href="/en/support" className="btn-primary text-base px-8 py-3">
          Technical Consultation Inquiry
        </a>
      </div>
    </div>
  );
}
