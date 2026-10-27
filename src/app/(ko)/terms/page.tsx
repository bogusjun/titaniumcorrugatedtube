import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS, TERMS_EFFECTIVE_DATE } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "이용약관",
  description: "ATX 티타늄 주름관 홈페이지 이용 조건 — 견적 문의의 효력, 제품 정보의 성격, 저작권 안내.",
  alternates: {
    canonical: "https://tube.atx.kr/terms",
    languages: {
      ko: "https://tube.atx.kr/terms",
      en: "https://tube.atx.kr/en/terms",
      ja: "https://tube.atx.kr/ja/terms",
    },
  },
};

export default function TermsPage() {
  return <LegalDocument locale="ko" doc={TERMS.ko} effectiveDate={TERMS_EFFECTIVE_DATE} />;
}
