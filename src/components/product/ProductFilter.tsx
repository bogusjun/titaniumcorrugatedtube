"use client";

import { cn } from "@/lib/utils";
import { productUi, type UiLocale } from "./product-ui";

interface ProductFilterProps {
  category: string;
  search: string;
  onCategoryChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  locale?: UiLocale;
}

export default function ProductFilter({
  category,
  search,
  onCategoryChange,
  onSearchChange,
  locale = "ko",
}: ProductFilterProps) {
  const ui = productUi[locale];
  return (
    <div className="bg-white rounded-xl border border-silver-100 shadow-sm p-5">
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder={ui.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder-silver-400"
        />
      </div>

      {/* Category Filter */}
      <div>
        <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2.5">
          {ui.categoryHeading}
        </p>
        <div className="flex flex-col gap-1.5">
          {ui.categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                category === cat.value
                  ? "bg-ti-950 text-silver-200"
                  : "text-ink-muted hover:bg-silver-50"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
