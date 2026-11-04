import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_POLICY } from "@/components/legal/privacy-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ja",
  path: "/privacy",
  title: "プライバシーポリシー",
  description:
    "ATX チタン波管ウェブサイトにおける個人情報の取得・利用、委託・国外移転、Cookie の利用について。",
});

export default function JaPrivacyPage() {
  return <LegalDocument locale="ja" doc={PRIVACY_POLICY.ja} effectiveDate={PRIVACY_EFFECTIVE_DATE} />;
}
