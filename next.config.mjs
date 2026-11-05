/**
 * 보안 헤더 — 모든 응답에 붙는다
 *
 * CSP(Content-Security-Policy)는 아직 넣지 않았다. GA·네이버 애널리틱스, Vimeo 영상, Next 인라인 스크립트가 얽혀
 * 잘못 넣으면 분석·영상이 조용히 멈춘다. 넣을 때는 Content-Security-Policy-Report-Only 로 먼저 시험한다.
 * Permissions-Policy 는 이 사이트가 쓰지 않는 기능만 끈다 — 폐열회수기 페이지의 Vimeo iframe 이 쓰는
 * autoplay·fullscreen·picture-in-picture·encrypted-media 는 건드리지 않는다.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 응답의 X-Powered-By: Next.js 헤더를 끈다
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
