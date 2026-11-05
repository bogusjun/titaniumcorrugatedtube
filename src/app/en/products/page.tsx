import type { Metadata } from "next";
import { getLocalizedProducts } from "@/data/products-i18n";
import ProductListClient from "@/app/(ko)/products/ProductListClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  path: "/products",
  title: "Products",
  description:
    "Titanium corrugated tube 10A · 15A specification tables and coil-type heat exchanger detailed specifications.",
});

// 정적 페이지 — 분류(?category=)는 ProductListClient 가 브라우저에서 읽는다
export default function EnProductsPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-16">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Product Lineup
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            Products
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            Titanium corrugated tubes, standard products, corrugated-type, straight-tube, and shell &amp; tube heat exchangers, and socket fittings. Check specifications, dimensions, and application cases.
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProductListClient products={getLocalizedProducts("en")} locale="en" />
        </div>
      </div>
    </div>
  );
}
