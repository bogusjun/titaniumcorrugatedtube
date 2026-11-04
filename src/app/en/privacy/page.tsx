import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_POLICY } from "@/components/legal/privacy-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How ATX collects, uses, transfers and protects personal information on the titanium corrugated tube website.",
});

export default function EnPrivacyPage() {
  return <LegalDocument locale="en" doc={PRIVACY_POLICY.en} effectiveDate={PRIVACY_EFFECTIVE_DATE} />;
}
