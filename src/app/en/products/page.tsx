import type { Metadata } from "next";
import productsData from "@/data/products.json";
import ProductListClient from "@/app/(ko)/products/ProductListClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Titanium corrugated tube 10A · 15A · 20A specification tables and coil-type heat exchanger detailed specifications.",
};

interface SearchParams {
  category?: string;
}

export default function EnProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
          <ProductListClient
            products={productsData}
            initialCategory={searchParams.category || "all"}
          />
        </div>
      </div>
    </div>
  );
}
