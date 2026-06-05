import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Thermometer, Gauge, Ruler, Phone,
} from "lucide-react";
import productsData from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = productsData.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

const specLabels: [string, string][] = [
  ["nominalSize", "호칭 규격"],
  ["outerDiameter", "외경 (OD)"],
  ["innerDiameter", "내경 (ID)"],
  ["wallThickness", "두께"],
  ["bendRadius", "최소 굴곡 반경"],
  ["workingPressure", "사용 압력"],
  ["testPressure", "시험 압력"],
  ["temperatureRange", "온도 범위"],
  ["material", "재질 (Grade)"],
  ["standardLength", "공급 길이"],
  ["endFitting", "연결 방식"],
];

export default function ProductDetailPage({ params }: Props) {
  const product = productsData.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = productsData
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-silver-100">
        <div className="container-pad py-3">
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <Link href="/" className="hover:text-ink transition-colors">홈</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-ink transition-colors">제품 소개</Link>
            <span>/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-pad py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 제품 목록
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-silver-100 mb-4">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-silver-100 border-2 border-transparent hover:border-accent cursor-pointer transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.categoryLabel}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-ink mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="text-ink-subtle text-base mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { Icon: Gauge, label: "사용 압력", value: product.specs.workingPressure },
                { Icon: Thermometer, label: "온도 범위", value: product.specs.temperatureRange },
                { Icon: Ruler, label: "호칭 규격", value: product.specs.nominalSize },
                { Icon: Ruler, label: "연결 방식", value: product.specs.endFitting },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-silver-100 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-xs text-ink-subtle font-medium">{label}</span>
                  </div>
                  <p className="text-sm font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-silver-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                주요 특징
              </p>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/support" className="btn-primary flex-1 justify-center py-3.5">
                견적 요청
              </Link>
              <a
                href="tel:031-000-0000"
                className="btn-dark flex-1 justify-center py-3.5"
              >
                <Phone className="w-4 h-4" />
                전화 상담
              </a>
            </div>
          </div>
        </div>

        {/* Full Spec Table */}
        <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-12">
          <div className="bg-ti-950 px-6 py-4">
            <h2 className="text-silver-200 font-bold text-lg">상세 기술 사양</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full spec-table">
              <tbody>
                {specLabels.map(([key, label]) => (
                  <tr key={key}>
                    <td className="font-semibold text-ink bg-silver-50 w-44">
                      {label}
                    </td>
                    <td>{(product.specs as Record<string, string>)[key] || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl border border-silver-100 p-6 mb-12">
          <h2 className="text-xl font-bold text-ink mb-4">적용 분야</h2>
          <div className="flex flex-wrap gap-2">
            {product.applications.map((app) => (
              <span
                key={app}
                className="px-4 py-2 bg-silver-50 text-ink-muted rounded-lg text-sm font-medium"
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">관련 제품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
