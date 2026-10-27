/**
 * 견적 폼 첨부 규칙 — 폼(ContactForm)과 서버(/api/contact)가 같은 값을 쓴다
 *
 * 파일은 견적 메일에 첨부로 붙는다. Vercel 함수 요청 본문 한도가 4.5MB 라서 합계 4MB 로 막고,
 * 더 큰 파일은 메일(777@atx.kr)로 받는다. 사진은 폼에서 미리 줄인다(shrinkImage).
 */

export const ATTACH_MAX_FILES = 3;
export const ATTACH_MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const ATTACH_EXTENSIONS = [".pdf", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"];

export function isAllowedAttachment(name: string): boolean {
  const lower = name.toLowerCase();
  return ATTACH_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "")}MB`;
}
