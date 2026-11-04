import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS, TERMS_EFFECTIVE_DATE } from "@/components/legal/terms-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  path: "/terms",
  title: "Terms of Use",
  description:
    "Terms of use for the ATX titanium corrugated tube website — quote requests, product information and copyright.",
});

export default function EnTermsPage() {
  return <LegalDocument locale="en" doc={TERMS.en} effectiveDate={TERMS_EFFECTIVE_DATE} />;
}
