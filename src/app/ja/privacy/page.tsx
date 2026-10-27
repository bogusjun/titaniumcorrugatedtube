import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_POLICY } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "ATX チタン波管ウェブサイトにおける個人情報の取得・利用、委託・国外移転、Cookie の利用について。",
  alternates: {
    canonical: "https://tube.atx.kr/ja/privacy",
    languages: {
      ko: "https://tube.atx.kr/privacy",
      en: "https://tube.atx.kr/en/privacy",
      ja: "https://tube.atx.kr/ja/privacy",
    },
  },
};

export default function JaPrivacyPage() {
  return <LegalDocument locale="ja" doc={PRIVACY_POLICY.ja} effectiveDate={PRIVACY_EFFECTIVE_DATE} />;
}
