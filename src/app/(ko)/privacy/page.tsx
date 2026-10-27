import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_POLICY } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "ATX 티타늄 주름관 홈페이지의 개인정보 수집·이용, 위탁·국외 이전, 쿠키 운영 안내.",
  alternates: {
    canonical: "https://tube.atx.kr/privacy",
    languages: {
      ko: "https://tube.atx.kr/privacy",
      en: "https://tube.atx.kr/en/privacy",
      ja: "https://tube.atx.kr/ja/privacy",
    },
  },
};

export default function PrivacyPage() {
  return <LegalDocument locale="ko" doc={PRIVACY_POLICY.ko} effectiveDate={PRIVACY_EFFECTIVE_DATE} />;
}
