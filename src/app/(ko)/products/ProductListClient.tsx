"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
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
  locale?: UiLocale;
}

/**
 * 제품 목록 — 페이지는 정적으로 만들고, 주소의 ?category= 는 브라우저에서 읽는다
 *
 * useSearchParams 는 정적 페이지에서 Suspense 안쪽을 브라우저 렌더링으로 미루므로, fallback 으로 전체 목록을 그려
 * 서버 HTML 에도 제품 카드(링크)가 들어가게 한다. 브라우저에서는 쿼리를 읽어 분류를 맞추고,
 * 같은 페이지 안에서 메뉴로 분류를 바꿀 때도 따라간다.
 */
export default function ProductListClient(props: Props) {
  return (
    <Suspense fallback={<ProductList {...props} urlCategory="all" />}>
      <ProductListFromUrl {...props} />
    </Suspense>
  );
}

function ProductListFromUrl(props: Props) {
  const searchParams = useSearchParams();
  return <ProductList {...props} urlCategory={searchParams.get("category") || "all"} />;
}

function ProductList({ products, locale = "ko", urlCategory }: Props & { urlCategory: string }) {
  const ui = productUi[locale];
  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

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
