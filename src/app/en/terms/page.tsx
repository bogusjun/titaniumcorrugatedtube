import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS, TERMS_EFFECTIVE_DATE } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the ATX titanium corrugated tube website — quote requests, product information and copyright.",
  alternates: {
    canonical: "https://tube.atx.kr/en/terms",
    languages: {
      ko: "https://tube.atx.kr/terms",
      en: "https://tube.atx.kr/en/terms",
      ja: "https://tube.atx.kr/ja/terms",
    },
  },
};

export default function EnTermsPage() {
  return <LegalDocument locale="en" doc={TERMS.en} effectiveDate={TERMS_EFFECTIVE_DATE} />;
}
