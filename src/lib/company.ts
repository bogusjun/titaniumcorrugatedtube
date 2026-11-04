/**
 * 회사 연혁 기준값 — 업력·창립 연도는 모두 여기서 가져다 쓴다
 *
 * tube.atx.kr 에서는 (주)에이티엑스 설립 연도(2008)를 창립 연도로 쓴다 (2026-11-04 결정).
 * 업력은 올해 − 2008 로 계산한다. 정적 페이지는 빌드 시각 기준이라 해가 바뀐 뒤 배포하면 따라 바뀐다.
 */
export const FOUNDED_YEAR = 2008;

export const YEARS_IN_BUSINESS = new Date().getFullYear() - FOUNDED_YEAR;
