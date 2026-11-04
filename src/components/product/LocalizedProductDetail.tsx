/**
 * 영문·일문 제품 상세 — products.json + products-i18n.ts 로 그린다
 *
 * 국문 상세(`src/app/(ko)/products/[slug]/page.tsx`)는 제품마다 손으로 짠 섹션이 많고, 여기는 데이터에 있는
 * 내용(사진·설명·사양·용도·특징)만 보여 준다. 국문에만 있는 섹션을 옮길 때는 문구를 i18n 데이터로 빼서 추가한다.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Gauge, MapPin, Package, Phone, Ruler, Thermometer } from "lucide-react";
import productsData from "@/data/products.json";
import { localizeProduct, type ProductLocale } from "@/data/products-i18n";
import ProductCard from "./ProductCard";
import ProductImageGallery from "./ProductImageGallery";
import { alternatesFor } from "@/lib/seo";

const SITE = "https://tube.atx.kr";

const ui = {
  en: {
    siteName: "ATX Titanium",
    ogLocale: "en_US",
    ogImage: "/images/og-image-en.jpg",
    home: "Home",
    products: "Products",
    allProducts: "All products",
    keySpecs: { workingPressure: "Working pressure", temperatureRange: "Temperature range", nominalSize: "Nominal size", endFitting: "Connection" },
    features: "Key features",
    quote: "Request a Quote",
    call: "Call Us",
    specTitle: "Technical Specifications",
    variantTitle: "Specifications by Size",
    item: "Item",
    variantNote: "* Specifications are based on standard manufacturing. OD, wall thickness and fittings can be changed for custom orders.",
    stockTitle: "Ready-Stock Lineup",
    stockBadge: "Immediate delivery",
    stockHead: ["Length", "Coil turns", "Fitting"],
    stockNote: "* Lead time may vary with stock levels. Please contact us to confirm availability.",
    applications: "Applications",
    related: "Related Products",
    casesTitle: "Installation cases",
    casesBody: "See where ATX titanium heat exchangers and waste heat recovery units are installed, including our export case in Japan.",
    specLabels: {
      nominalSize: "Nominal size",
      outerDiameter: "Outer diameter (OD)",
      innerDiameter: "Inner diameter (ID)",
      wallThickness: "Wall thickness",
      weight: "Weight (kg/m)",
      bendRadius: "Tolerance",
      workingPressure: "Working pressure",
      testPressure: "Test pressure",
      temperatureRange: "Temperature range",
      material: "Material (Grade)",
      standardLength: "Supply length",
      endFitting: "Connection",
    },
  },
  ja: {
    siteName: "ATX チタン波管",
    ogLocale: "ja_JP",
    ogImage: "/images/og-image-ja.jpg",
    home: "ホーム",
    products: "製品紹介",
    allProducts: "製品一覧へ",
    keySpecs: { workingPressure: "使用圧力", temperatureRange: "温度範囲", nominalSize: "呼び径", endFitting: "接続方式" },
    features: "主な特長",
    quote: "お見積もり依頼",
    call: "お電話でのご相談",
    specTitle: "詳細技術仕様",
    variantTitle: "規格別技術仕様",
    item: "項目",
    variantNote: "* 上記は標準製造時の仕様です。オーダーメイドでは外径・肉厚・継手仕様を変更できます。",
    stockTitle: "在庫標準品ラインナップ",
    stockBadge: "即納",
    stockHead: ["長さ", "巻数", "継手仕様"],
    stockNote: "* 在庫状況により納期が異なる場合があります。正確な在庫はお問い合わせください。",
    applications: "適用分野",
    related: "関連製品",
    casesTitle: "納入・設置事例",
    casesBody: "日本への輸出事例を含め、ATXのチタン熱交換器・廃熱回収装置の設置現場をご覧いただけます。",
    specLabels: {
      nominalSize: "呼び径",
      outerDiameter: "外径 (OD)",
      innerDiameter: "内径 (ID)",
      wallThickness: "肉厚",
      weight: "重量 (kg/m)",
      bendRadius: "公差",
      workingPressure: "使用圧力",
      testPressure: "試験圧力",
      temperatureRange: "温度範囲",
      material: "材質 (Grade)",
      standardLength: "供給長さ",
      endFitting: "接続方式",
    },
  },
} as const;

/** 표준품 재고 라인업 — 국문 상세의 standardItems 와 같은 내용 */
const stockItems: Record<ProductLocale, string[][]> = {
  en: [
    ["300mm", "approx. 5 turns", '3/8" NPT male'],
    ["500mm", "approx. 9 turns", '3/8" NPT male'],
    ["1,000mm", "approx. 18 turns", '3/8" NPT male'],
  ],
  ja: [
    ["300mm", "約5巻", '3/8" NPT おねじ'],
    ["500mm", "約9巻", '3/8" NPT おねじ'],
    ["1,000mm", "約18巻", '3/8" NPT おねじ'],
  ],
};

const specOrder = [
  "nominalSize", "outerDiameter", "innerDiameter", "wallThickness", "bendRadius", "workingPressure",
  "testPressure", "temperatureRange", "material", "standardLength", "endFitting",
] as const;
const variantOrder = ["outerDiameter", "innerDiameter", "wallThickness", "weight", "bendRadius", "standardLength", "material", "endFitting"] as const;
const CASE_SLUGS = ["tube-standard", "heat-exchanger-corrugated", "waste-heat-recovery"];

const shown = (v?: string) => !!v && v !== "-";

function findProduct(slug: string, locale: ProductLocale) {
  const base = productsData.find((p) => p.slug === slug);
  return base ? localizeProduct(base, locale) : undefined;
}

export function localizedProductParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

export function localizedProductMetadata(slug: string, locale: ProductLocale): Metadata {
  const product = findProduct(slug, locale);
  if (!product) return {};
  const t = ui[locale];
  const url = `${SITE}/${locale}/products/${slug}`;
  return {
    title: product.name,
    description: product.description,
    alternates: alternatesFor(`/products/${slug}`, locale),
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: t.siteName,
      title: `${product.name} | ${t.siteName}`,
      description: product.description,
      url,
      images: [{ url: t.ogImage, width: 1200, height: 630, alt: product.name }],
    },
  };
}

export default function LocalizedProductDetail({ slug, locale }: { slug: string; locale: ProductLocale }) {
  const product = findProduct(slug, locale);
  if (!product) notFound();
  const t = ui[locale];
  const base = `/${locale}`;

  const variants = product.category === "tube" ? product.variants ?? [] : [];
  const relatedSlugs: Record<string, string[]> = {
    tube: ["socket", "heat-exchanger-corrugated"],
    "tube-standard": ["tube", "socket"],
  };
  const related = (
    relatedSlugs[slug]
      ? productsData.filter((p) => relatedSlugs[slug].includes(p.slug))
      : productsData.filter((p) => p.slug !== slug && p.category === product.category).slice(0, 3)
  ).map((p) => localizeProduct(p, locale));

  const url = `${SITE}${base}/products/${slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE}${product.images?.[0] ?? product.image}`,
    url,
    brand: { "@type": "Brand", name: "ATX" },
    manufacturer: { "@type": "Organization", name: "ATX Co., Ltd.", url: SITE },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: `${SITE}${base}` },
      { "@type": "ListItem", position: 2, name: t.products, item: `${SITE}${base}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  const keySpecs = [
    { Icon: Gauge, key: "workingPressure" },
    { Icon: Thermometer, key: "temperatureRange" },
    { Icon: Ruler, key: "nominalSize" },
    { Icon: Ruler, key: "endFitting" },
  ] as const;

  return (
    <div className="pt-20 min-h-screen bg-silver-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-silver-100">
        <div className="container-pad py-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
            <Link href={base} className="hover:text-ink transition-colors">{t.home}</Link>
            <span>/</span>
            <Link href={`${base}/products`} className="hover:text-ink transition-colors">{t.products}</Link>
            <span>/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-pad py-12">
        <Link
          href={`${base}/products`}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.allProducts}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <ProductImageGallery images={product.images} name={product.name} />

          <div>
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {product.categoryLabel}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-ink mb-3 leading-tight">{product.name}</h1>
            <p className="text-ink-subtle text-base mb-6 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {keySpecs
                .filter(({ key }) => shown(product.specs[key]))
                .map(({ Icon, key }) => (
                  <div key={key} className="bg-white rounded-xl border border-silver-100 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="text-xs text-ink-subtle font-medium">{t.keySpecs[key]}</span>
                    </div>
                    <p className="text-sm font-bold text-ink">{product.specs[key]}</p>
                  </div>
                ))}
            </div>

            <div className="bg-silver-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">{t.features}</p>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`${base}/support`} className="btn-primary flex-1 justify-center py-3.5">
                {t.quote}
              </Link>
              <a href="tel:+82-1544-1909" className="btn-dark flex-1 justify-center py-3.5">
                <Phone className="w-4 h-4" />
                {t.call}
              </a>
            </div>
          </div>
        </div>

        {/* 표준품 재고 라인업 */}
        {slug === "tube-standard" && (
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
            <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-silver-200 font-bold text-lg">{t.stockTitle}</h2>
              <span className="ml-auto text-xs bg-accent/20 text-accent px-2.5 py-1 rounded-full font-semibold">{t.stockBadge}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-silver-100 bg-silver-50">
                    {t.stockHead.map((h) => (
                      <th key={h} className="py-3 px-5 text-left font-semibold text-ink-subtle whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stockItems[locale].map((row, i) => (
                    <tr key={row[0]} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                      <td className="py-3 px-5 font-semibold text-ink">{row[0]}</td>
                      <td className="py-3 px-5 text-ink-muted">{row[1]}</td>
                      <td className="py-3 px-5 text-ink-muted">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-silver-50 border-t border-silver-100">
              <p className="text-xs text-ink-subtle">{t.stockNote}</p>
            </div>
          </div>
        )}

        {/* 사양 — 주름관은 규격별 표, 나머지는 항목 표 */}
        {variants.length > 0 ? (
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
            <div className="bg-ti-950 px-6 py-4 flex items-center gap-3">
              <Ruler className="w-5 h-5 text-accent" />
              <h2 className="text-silver-200 font-bold text-lg">{t.variantTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-silver-100 bg-silver-50">
                    <th className="py-3 px-5 text-left font-semibold text-ink-subtle w-52">{t.item}</th>
                    {variants.map((v) => (
                      <th key={v.size} className="py-3 px-5 text-center font-black text-ink text-base">{v.size}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variantOrder
                    .filter((key) => variants.some((v) => shown(v[key])))
                    .map((key, i) => (
                      <tr key={key} className={`border-t border-silver-100 ${i % 2 === 0 ? "bg-white" : "bg-silver-50"}`}>
                        <td className="py-3 px-5 font-semibold text-ink-subtle">{t.specLabels[key]}</td>
                        {variants.map((v) => (
                          <td key={v.size} className="py-3 px-5 text-center text-ink font-medium">{v[key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-silver-50 border-t border-silver-100">
              <p className="text-xs text-ink-subtle">{t.variantNote}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-silver-100 overflow-hidden mb-8">
            <div className="bg-ti-950 px-6 py-4">
              <h2 className="text-silver-200 font-bold text-lg">{t.specTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full spec-table">
                <tbody>
                  {specOrder
                    .filter((key) => shown(product.specs[key]))
                    .map((key) => (
                      <tr key={key}>
                        <td className="font-semibold text-ink bg-silver-50 w-44">{t.specLabels[key]}</td>
                        <td>{product.specs[key]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-silver-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-ink mb-4">{t.applications}</h2>
          <div className="flex flex-wrap gap-2">
            {product.applications.map((app) => (
              <span key={app} className="px-4 py-2 bg-silver-50 text-ink-muted rounded-lg text-sm font-medium">{app}</span>
            ))}
          </div>
        </div>

        {CASE_SLUGS.includes(slug) && (
          <Link
            href={`${base}/cases`}
            className="group flex items-center gap-4 bg-ti-950 rounded-2xl p-6 mb-12 hover:bg-ti-900 transition-colors"
          >
            <MapPin className="w-8 h-8 text-accent flex-shrink-0" />
            <div className="flex-1">
              <p className="text-silver-200 font-bold text-lg mb-1">{t.casesTitle}</p>
              <p className="text-silver-500 text-sm leading-relaxed">{t.casesBody}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">{t.related}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
