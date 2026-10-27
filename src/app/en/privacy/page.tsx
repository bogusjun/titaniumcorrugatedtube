import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_POLICY } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ATX collects, uses, transfers and protects personal information on the titanium corrugated tube website.",
  alternates: {
    canonical: "https://tube.atx.kr/en/privacy",
    languages: {
      ko: "https://tube.atx.kr/privacy",
      en: "https://tube.atx.kr/en/privacy",
      ja: "https://tube.atx.kr/ja/privacy",
    },
  },
};

export default function EnPrivacyPage() {
  return <LegalDocument locale="en" doc={PRIVACY_POLICY.en} effectiveDate={PRIVACY_EFFECTIVE_DATE} />;
}
