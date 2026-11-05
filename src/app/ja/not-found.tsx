import type { Metadata } from "next";
import NotFoundContent, { notFoundTitle } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = {
  title: notFoundTitle("ja"),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent locale="ja" />;
}
