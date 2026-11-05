export type LegalLocale = "ko" | "en" | "ja";

export type PolicyBlock =
  | { p: string }
  | { ul: string[] }
  | { table: { head: string[]; rows: string[][] } };

/** id: 다른 페이지에서 #id 로 바로 가는 앵커 (예: 이용약관 #purchase) */
export type PolicySection = { title: string; id?: string; blocks: PolicyBlock[] };

export type PolicyDoc = {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string;
  effectiveLabel: string;
  translationNote?: string;
  /** 조항 제목 형식 — {n} 번호, {title} 제목. 기본 "{n}. {title}" */
  headingFormat?: string;
  sections: PolicySection[];
  /** 본문 뒤 부칙 등 */
  closing?: string;
};
