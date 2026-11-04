/** 제품 목록·카드·필터·상세의 화면 문구 (국·영·일) */
export type UiLocale = "ko" | "en" | "ja";

/** 언어별 주소 앞부분 — 국문은 루트 */
export const localePrefix = (locale: UiLocale) => (locale === "ko" ? "" : `/${locale}`);

export const productUi = {
  ko: {
    categories: [
      { value: "all", label: "전체" },
      { value: "tube", label: "티타늄 주름관" },
      { value: "heat-exchanger", label: "열교환기 맞춤제작" },
      { value: "waste-heat-recovery", label: "폐열회수기" },
      { value: "socket", label: "주름관 소켓" },
    ],
    searchPlaceholder: "제품명, 용도로 검색...",
    categoryHeading: "제품 종류",
    count: (n: number) => ({ strong: `${n}개`, rest: " 제품" }),
    emptyTitle: "검색 결과가 없습니다.",
    emptyHint: "다른 조건으로 검색해보세요.",
    viewSpecs: "사양 보기",
  },
  en: {
    categories: [
      { value: "all", label: "All" },
      { value: "tube", label: "Titanium Corrugated Tube" },
      { value: "heat-exchanger", label: "Custom Heat Exchangers" },
      { value: "waste-heat-recovery", label: "Waste Heat Recovery" },
      { value: "socket", label: "Tube Sockets" },
    ],
    searchPlaceholder: "Search by product or application...",
    categoryHeading: "Product type",
    count: (n: number) => ({ strong: `${n}`, rest: n === 1 ? " product" : " products" }),
    emptyTitle: "No products found.",
    emptyHint: "Try a different search or category.",
    viewSpecs: "View specs",
  },
  ja: {
    categories: [
      { value: "all", label: "すべて" },
      { value: "tube", label: "チタン波管" },
      { value: "heat-exchanger", label: "オーダーメイド熱交換器" },
      { value: "waste-heat-recovery", label: "廃熱回収装置" },
      { value: "socket", label: "波管ソケット" },
    ],
    searchPlaceholder: "製品名・用途で検索...",
    categoryHeading: "製品の種類",
    count: (n: number) => ({ strong: `${n}件`, rest: "の製品" }),
    emptyTitle: "該当する製品がありません。",
    emptyHint: "別の条件で検索してください。",
    viewSpecs: "仕様を見る",
  },
} as const;
