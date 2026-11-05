import type { Metadata } from "next";
import Link from "next/link";

/**
 * 마지막 대비용 404 — 보통은 언어별 [...missing] 경로가 먼저 받아 헤더·푸터가 있는 언어별 not-found.tsx 를 보여 준다
 */
export const metadata: Metadata = {
  title: { absolute: "페이지를 찾을 수 없습니다 · Page not found | ATX" },
  robots: { index: false, follow: true },
};

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ti-950 px-4">
      <div className="text-center">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">404</p>
        <h1 className="text-3xl font-black text-silver-200 mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-silver-500 mb-8">Page not found · ページが見つかりません</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">홈</Link>
          <Link href="/en" className="btn-outline">English</Link>
          <Link href="/ja" className="btn-outline">日本語</Link>
        </div>
      </div>
    </div>
  );
}
