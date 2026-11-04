import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS, TERMS_EFFECTIVE_DATE } from "@/components/legal/terms-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ja",
  path: "/terms",
  title: "利用規約",
  description:
    "ATX チタン波管ウェブサイトの利用条件 — お見積り依頼、製品情報、著作権について。",
});

export default function JaTermsPage() {
  return <LegalDocument locale="ja" doc={TERMS.ja} effectiveDate={TERMS_EFFECTIVE_DATE} />;
}
