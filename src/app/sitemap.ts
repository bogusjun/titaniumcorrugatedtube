import { MetadataRoute } from "next";
import productsData from "@/data/products.json";

const baseUrl = "https://tube.atx.kr";

// lastModified 는 넣지 않는다 — 배포 시각을 찍으면 모든 주소가 매번 「수정됨」이 되어 검색엔진이 이 값을 믿지 않는다.
// 페이지별 실제 수정일을 관리하게 되면 그때 넣는다.

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/technology", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/support", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/news", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/cases", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
];

const locales = ["", "/en", "/ja"];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = productsData.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}${locale}/products/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: locale === "" ? 0.8 : 0.7,
    }))
  );

  const staticEntries = staticRoutes.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${baseUrl}${locale}${path}`,
      changeFrequency,
      priority: locale === "" ? priority : Math.max(priority - 0.1, 0.4),
    }))
  );

  return [...staticEntries, ...productRoutes];
}
