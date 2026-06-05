import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Thermometer, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  slug: string;
  name: string;
  categoryLabel: string;
  description: string;
  image: string;
  specs: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-silver-100 rounded-xl shadow-ti-sm overflow-hidden group hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-silver-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ti-950/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-ti-950/80 backdrop-blur-sm text-silver-300 text-xs font-medium px-2.5 py-1 rounded">
          {product.categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-ink text-base mb-2 leading-snug group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-ink-muted text-sm mb-4 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Key Specs */}
        <div className="flex gap-3 mb-4 text-xs text-ink-subtle">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-accent" />
            {product.specs.workingPressure}
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-silver-400" />
            {product.specs.temperatureRange}
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="flex items-center gap-1 text-accent text-sm font-semibold hover:gap-2 transition-all"
        >
          사양 보기 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
