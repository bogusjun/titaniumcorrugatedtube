import { Suspense } from "react";
import Header, { HeaderBase } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";

// 요청 정보(headers 등)를 읽지 않아야 국문 페이지가 영·일처럼 미리 만들어진다(정적). /admin 은 이 그룹 밖이라 따로 가를 필요가 없다
export default function KoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CartProvider: 온라인 구매(국문만) — 헤더의 장바구니 수와 구매 상자·장바구니·결제 화면이 같은 상태를 쓴다
  return (
    <CartProvider>
      <Suspense fallback={<HeaderBase query={null} />}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
