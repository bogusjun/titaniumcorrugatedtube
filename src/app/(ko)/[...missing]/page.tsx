import { notFound } from "next/navigation";

// 다른 경로에 걸리지 않은 주소를 받아 이 언어의 not-found.tsx(헤더·푸터 포함)로 보낸다 — 응답 코드는 404
export default function MissingPage() {
  notFound();
}
