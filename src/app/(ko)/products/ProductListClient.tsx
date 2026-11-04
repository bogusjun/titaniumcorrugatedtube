"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import { productUi, type UiLocale } from "@/components/product/product-ui";

interface Product {
  slug: string;
  category: string;
  categoryLabel: string;
  name: string;
  description: string;
  image: string;
  specs: Record<string, string>;
}

interface Props {
  products: Product[];
  initialCategory?: string;
  locale?: UiLocale;
}

export default function ProductListClient({ products, initialCategory = "all", locale = "ko" }: Props) {
  const ui = productUi[locale];
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
          locale={locale}
        />
      </div>

      <div className="lg:col-span-3">
        <p className="text-ink-muted text-sm mb-6">
          <span className="font-bold text-ink">{ui.count(filtered.length).strong}</span>
          {ui.count(filtered.length).rest}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-silver-400">
            <p className="font-medium">{ui.emptyTitle}</p>
            <p className="text-sm mt-1">{ui.emptyHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
