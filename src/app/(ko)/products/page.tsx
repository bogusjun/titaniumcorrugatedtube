import type { Metadata } from "next";
import { Suspense } from "react";
import productsData from "@/data/products.json";
import ProductListClient from "./ProductListClient";

export const metadata: Metadata = {
  title: "제품 소개",
  description: "티타늄 주름관 10A·15A 규격표 및 코일형 열교환기 상세 사양.",
};

interface SearchParams {
  category?: string;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Page Header */}
      <div className="bg-ti-950 py-16">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Product Lineup
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            제품 소개
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            티타늄 주름관·표준품, 주름관형·직관형·쉘앤튜브형 열교환기, 소켓 피팅까지. 규격·사양·적용 사례를 확인하세요.
          </p>
        </div>
      </div>

      {/* Content */}
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
