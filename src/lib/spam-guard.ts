/**
 * 견적 폼 스팸 검사 — 폼(ContactForm 국·영·일)과 서버(/api/contact)가 같은 값을 쓴다
 *
 * 1) 숨긴 입력칸(honeypot): 사람에게는 안 보이고 봇만 채운다. 채워져 있으면 메일을 보내지 않고 성공처럼 답한다.
 * 2) 작성 시간: 폼을 연 지 MIN_FILL_MS 안에 보냈거나 값이 없으면(폼을 거치지 않은 요청) 메일은 보내되
 *    제목을 SUSPECT_SUBJECT_PREFIX 로 바꾼다. ATX Work 처리기는 「[ATX 주름관 견적문의]」 제목만 노션에 올리므로
 *    스팸 의심 메일은 메일함에만 남고, 진짜 문의를 잘못 걸러도 사라지지 않는다.
 */

/** 자동완성이 채우지 않도록 뜻 없는 이름을 쓴다 (url·website·company 같은 이름 금지) */
export const HONEYPOT_NAME = "hp_note";

export const MIN_FILL_MS = 3000;

/** 「[ATX 주름관 견적문의]」 글자를 포함하면 안 된다 — 처리기가 견적으로 집어 간다 */
export const SUSPECT_SUBJECT_PREFIX = "[ATX 주름관 스팸의심]";

export type SpamFields = { hp?: unknown; elapsedMs?: unknown };

export type SpamVerdict =
  | { kind: "bot" }
  | { kind: "suspect"; reason: string }
  | { kind: "ok" };

export function judgeSpam({ hp, elapsedMs }: SpamFields): SpamVerdict {
  if (typeof hp === "string" && hp.trim() !== "") return { kind: "bot" };
  if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs)) {
    return { kind: "suspect", reason: "폼 작성 시간 없음 (폼을 거치지 않은 요청)" };
  }
  if (elapsedMs < MIN_FILL_MS) {
    return { kind: "suspect", reason: `폼 작성 ${(Math.max(elapsedMs, 0) / 1000).toFixed(1)}초` };
  }
  return { kind: "ok" };
}
