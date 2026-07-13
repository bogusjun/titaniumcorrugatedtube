"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";

interface Product {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  images: string[];
  grade: string;
  specs: Record<string, string>;
  variants?: Record<string, string>[];
  applications: string[];
  features: string[];
}

interface Props {
  products: Product[];
  initialCategory?: string;
}

export default function ProductListClient({ products, initialCategory = "all" }: Props) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  return (
    <>
      <div className="lg:sticky lg:top-24 mb-6 lg:mb-0">
        <ProductFilter
          category={category}
          search={search}
          onCategoryChange={setCategory}
          onSearchChange={setSearch}
        />
      </div>

      <div className="lg:col-span-3">
        <p className="text-ink-muted text-sm mb-6">
          <span className="font-bold text-ink">{filtered.length}개</span> 제품
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-silver-400">
            <p className="font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm mt-1">다른 조건으로 검색해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
