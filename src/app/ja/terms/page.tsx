import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS, TERMS_EFFECTIVE_DATE } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "利用規約",
  description: "ATX チタン波管ウェブサイトの利用条件 — お見積り依頼、製品情報、著作権について。",
  alternates: {
    canonical: "https://tube.atx.kr/ja/terms",
    languages: {
      ko: "https://tube.atx.kr/terms",
      en: "https://tube.atx.kr/en/terms",
      ja: "https://tube.atx.kr/ja/terms",
    },
  },
};

export default function JaTermsPage() {
  return <LegalDocument locale="ja" doc={TERMS.ja} effectiveDate={TERMS_EFFECTIVE_DATE} />;
}
