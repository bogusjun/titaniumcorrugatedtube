import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 장바구니·결제·주문 조회는 사람마다 다른 화면이라 검색에서 뺀다
      disallow: ["/api/", "/admin", "/cart", "/checkout", "/orders"],
    },
    sitemap: "https://tube.atx.kr/sitemap.xml",
  };
}
