import type { Metadata } from "next";
import { getLocalizedProducts } from "@/data/products-i18n";
import ProductListClient from "@/app/(ko)/products/ProductListClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ja",
  path: "/products",
  title: "製品紹介",
  description:
    "チタン波管 10A・15A 規格表およびコイル型熱交換器詳細仕様。",
});

// 정적 페이지 — 분류(?category=)는 ProductListClient 가 브라우저에서 읽는다
export default function JaProductsPage() {
  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <div className="bg-ti-950 py-16">
        <div className="container-pad">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            Product Lineup
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-silver-200 mb-4">
            製品紹介
          </h1>
          <p className="text-silver-500 text-lg max-w-2xl">
            チタン波管・標準品、波管型・直管型・シェル＆チューブ型熱交換器、ソケットフィッティングまで。規格・仕様・適用事例をご確認ください。
          </p>
        </div>
      </div>

      <div className="container-pad py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProductListClient products={getLocalizedProducts("ja")} locale="ja" />
        </div>
      </div>
    </div>
  );
}
