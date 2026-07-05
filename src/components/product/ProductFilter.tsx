"use client";

import { cn } from "@/lib/utils";

const categories = [
  { value: "all",                  label: "전체" },
  { value: "tube",                 label: "티타늄 주름관" },
  { value: "heat-exchanger",       label: "열교환기 맞춤제작" },
  { value: "waste-heat-recovery",  label: "폐열회수기" },
  { value: "socket",               label: "주름관 소켓" },
];

interface ProductFilterProps {
  category: string;
  search: string;
  onCategoryChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export default function ProductFilter({
  category,
  search,
  onCategoryChange,
  onSearchChange,
}: ProductFilterProps) {
  return (
    <div className="bg-white rounded-xl border border-silver-100 shadow-sm p-5">
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="제품명, 용도로 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-silver-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder-silver-400"
        />
      </div>

      {/* Category Filter */}
      <div>
        <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2.5">
          제품 종류
        </p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
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
