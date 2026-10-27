import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRIVACY_EFFECTIVE_DATE } from "@/components/legal/privacy-content";
import {
  ATTACH_MAX_FILES,
  ATTACH_MAX_TOTAL_BYTES,
  formatBytes,
  isAllowedAttachment,
} from "@/lib/attachments";

/**
 * 견적·문의 폼 → 메일
 *
 * 받는 곳은 ATX 영업 메일함(atx.lsj@gmail.com) — ATX Work 메일 처리기가 제목 「[ATX 주름관 견적문의]」로 알아보고
 * 노션 영업 ToDo 에 등록하며, 꼬리말 아래 「유입정보: ATXSRC1|…」 줄로 문의 출처를 기록한다.
 * 본문(text)은 「라벨: 값」 형식이라 처리기가 그대로 읽는다 — 라벨·제목을 바꾸면 atx-worklog
 * scripts/gmail/gmail-en-inquiry-processor.js 의 TUBE_FORM 도 같이 바꿔야 한다.
 * 업체명을 「[테스트]」로 시작하면 처리기가 출처만 남기고 노션에 올리지 않는다(시험 제출).
 * 도면·사진 첨부는 메일 첨부로 붙이고, 파일 이름 목록은 「문의내용」 끝 문단에 적는다(규칙: @/lib/attachments).
 */

const RECIPIENT = "atx.lsj@gmail.com";
const CC = "777@atx.kr";
const SUBJECT_PREFIX = "[ATX 주름관 견적문의]";
const AUTO_PREFIX = "ATXSRC1|";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 한 줄 값 — 줄바꿈을 지워 「라벨: 값」 줄이 깨지지 않게 한다 */
function line(v: unknown): string {
  return String(v ?? "").replace(/[\r\n]+/g, " ").trim();
}

/** SourceCapture 가 남긴 쿠키 → ATXSRC1|f_…|l_… (첫 유입과 같으면 마지막 유입은 뺀다) */
function sourceValue(req: NextRequest): string {
  const f = req.cookies.get("atx_src_f")?.value || "";
  const l = req.cookies.get("atx_src_l")?.value || "";
  const safe = (v: string) => (/^[fl]_[a-z]+=/.test(v) ? v.replace(/\s+/g, "_").slice(0, 600) : "");
  const first = safe(f);
  const last = safe(l);
  const same = first && last && last.replace(/(^|\|)l_/g, "$1") === first.replace(/(^|\|)f_/g, "$1");
  const parts = [first, same ? "" : last].filter(Boolean);
  return parts.length ? AUTO_PREFIX + parts.join("|") : "";
}

function siteLang(req: NextRequest): string {
  const ref = req.headers.get("referer") || "";
  try {
    const p = new URL(ref).pathname;
    if (p.startsWith("/en")) return "영문";
    if (p.startsWith("/ja")) return "일문";
  } catch { /* 없음 */ }
  return "국문";
}

type ContactBody = {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  product?: string;
  size?: string;
  quantity?: string;
  pressure?: string;
  fluid?: string;
  message?: string;
  privacyConsent?: boolean;
};

/** 국문 폼은 첨부가 있어 multipart(payload JSON + files), 영문·일문 폼은 JSON 으로 보낸다 */
async function readRequest(req: NextRequest): Promise<{ body: ContactBody; files: File[] }> {
  if ((req.headers.get("content-type") || "").startsWith("multipart/form-data")) {
    const fd = await req.formData();
    const body = JSON.parse(String(fd.get("payload") || "{}"));
    const files = fd.getAll("files").filter((v): v is File => typeof v !== "string" && v.size > 0);
    return { body, files };
  }
  return { body: await req.json(), files: [] };
}

/** 첨부 파일 이름 — 경로·제어 문자를 빼고 길이를 줄인다 */
function attachmentName(raw: string): string {
  const cleaned = raw.replace(/[\\/\x00-\x1f]/g, "_").trim() || "attachment";
  return cleaned.length > 120 ? cleaned.slice(-120) : cleaned;
}

export async function POST(req: NextRequest) {
  try {
    let parsed: Awaited<ReturnType<typeof readRequest>>;
    try {
      parsed = await readRequest(req);
    } catch {
      return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
    }
    const { body, files } = parsed;
    const { company, name, email, phone, product, size, quantity, pressure, fluid, message, privacyConsent } = body;

    if (!company || !name || !email) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    if (privacyConsent !== true) {
      return NextResponse.json({ error: "개인정보 수집·이용에 동의해 주세요." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }

    if (files.length > ATTACH_MAX_FILES) {
      return NextResponse.json({ error: `첨부 파일은 ${ATTACH_MAX_FILES}개까지 보낼 수 있습니다.` }, { status: 400 });
    }
    const rejected = files.filter((f) => !isAllowedAttachment(f.name));
    if (rejected.length) {
      return NextResponse.json({ error: `첨부할 수 없는 형식입니다: ${rejected.map((f) => f.name).join(", ")}` }, { status: 400 });
    }
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > ATTACH_MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { error: `첨부 파일 합계가 ${formatBytes(ATTACH_MAX_TOTAL_BYTES)}를 넘습니다. 큰 파일은 777@atx.kr로 보내 주세요.` },
        { status: 400 }
      );
    }
    const attachments = await Promise.all(
      files.map(async (f) => ({ filename: attachmentName(f.name), content: Buffer.from(await f.arrayBuffer()) }))
    );
    const attachmentSummary = attachments.map((a) => `${a.filename} (${formatBytes(a.content.length)})`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const lang = siteLang(req);
    const src = sourceValue(req);
    const receivedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const spec = [
      product && `제품 종류 ${line(product)}`,
      size && `희망 규격 ${line(size)}`,
      quantity && `수량 ${line(quantity)}`,
      pressure && `사용 압력 ${line(pressure)}`,
      fluid && `이송 유체 ${line(fluid)}`,
    ].filter(Boolean).join(" / ");

    // 처리기가 읽는 본문 — 라벨은 www.atx.kr CF7 메일과 같다
    const text = [
      `업체명: ${line(company)}`,
      `담당자: ${line(name)}`,
      `이메일: ${line(email)}`,
      `전화번호: ${line(phone) || "-"}`,
      `문의유형: 티타늄 주름관 견적 (${lang})`,
      `문의내용: ${[
        spec,
        String(message || "").trim(),
        attachmentSummary.length ? `첨부 파일 ${attachmentSummary.length}개 (메일 첨부): ${attachmentSummary.join(", ")}` : "",
      ].filter(Boolean).join("\n\n") || "-"}`,
      "",
      "-- ",
      `주름관 홈페이지(tube.atx.kr) ${lang} 견적 폼 · 접수 ${receivedAt}`,
      src ? `유입정보: ${src}` : "",
    ].filter((x, i, arr) => x !== "" || i < arr.length - 1).join("\n");

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0;">
    <h2 style="color: #e63946; margin: 0; font-size: 20px;">새 견적·문의 요청</h2>
    <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">ATX 티타늄 주름관 홈페이지 (${esc(lang)}) 접수</p>
  </div>
  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e7eb;">
    <h3 style="color: #374151; font-size: 14px; margin: 0 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">기업 정보</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="color: #6b7280; padding: 6px 0; width: 120px;">회사명</td><td style="color: #111827; font-weight: 600;">${esc(company)}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">담당자명</td><td style="color: #111827;">${esc(name)}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">이메일</td><td style="color: #111827;">${esc(email)}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">연락처</td><td style="color: #111827;">${esc(phone || "-")}</td></tr>
    </table>

    <h3 style="color: #374151; font-size: 14px; margin: 24px 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">희망 제품 사양</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="color: #6b7280; padding: 6px 0; width: 120px;">제품 종류</td><td style="color: #111827;">${esc(product || "-")}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">희망 규격</td><td style="color: #111827;">${esc(size || "-")}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">수량</td><td style="color: #111827;">${esc(quantity || "-")}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">사용 압력</td><td style="color: #111827;">${esc(pressure || "-")}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">이송 유체</td><td style="color: #111827;">${esc(fluid || "-")}</td></tr>
    </table>

    ${message ? `
    <h3 style="color: #374151; font-size: 14px; margin: 24px 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">추가 요청사항</h3>
    <p style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${esc(message)}</p>
    ` : ""}

    ${attachmentSummary.length ? `
    <h3 style="color: #374151; font-size: 14px; margin: 24px 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">첨부 파일 (이 메일에 첨부됨)</h3>
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
      ${attachmentSummary.map((s) => `<li>${esc(s)}</li>`).join("")}
    </ul>
    ` : ""}
  </div>
  <div style="background: #e5e7eb; padding: 12px 24px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
    접수 시각: ${esc(receivedAt)} · 개인정보 수집·이용 동의함 (처리방침 ${PRIVACY_EFFECTIVE_DATE}판)
  </div>
</div>`;

    await transporter.sendMail({
      from: `"ATX 주름관 홈페이지" <${process.env.SMTP_USER}>`,
      to: RECIPIENT,
      cc: CC,
      replyTo: line(email),
      subject: `${SUBJECT_PREFIX} ${line(company)} - ${line(name)}`,
      text,
      html,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "메일 전송에 실패했습니다." }, { status: 500 });
  }
}
