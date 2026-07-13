import { MetadataRoute } from "next";
import productsData from "@/data/products.json";

const baseUrl = "https://www.atx-titanium.co.kr";

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/technology", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/support", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/news", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/cases", priority: 0.6, changeFrequency: "monthly" as const },
];

const locales = ["", "/en", "/ja"];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = productsData.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}${locale}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "" ? 0.8 : 0.7,
    }))
  );

  const staticEntries = staticRoutes.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${baseUrl}${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority: locale === "" ? priority : Math.max(priority - 0.1, 0.4),
    }))
  );

  return [...staticEntries, ...productRoutes];
}
