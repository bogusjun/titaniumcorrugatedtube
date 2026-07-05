import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT = "777@atx.kr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, name, email, phone, product, size, quantity, pressure, fluid, message } = body;

    if (!company || !name || !email) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0;">
    <h2 style="color: #e63946; margin: 0; font-size: 20px;">새 견적·문의 요청</h2>
    <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">ATX 티타늄 주름관 홈페이지 접수</p>
  </div>
  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e7eb;">
    <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; margin: 0 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">기업 정보</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="color: #6b7280; padding: 6px 0; width: 120px;">회사명</td><td style="color: #111827; font-weight: 600;">${company}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">담당자명</td><td style="color: #111827;">${name}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">이메일</td><td style="color: #111827;"><a href="mailto:${email}" style="color: #e63946;">${email}</a></td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">연락처</td><td style="color: #111827;">${phone || "-"}</td></tr>
    </table>

    <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; margin: 24px 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">희망 제품 사양</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="color: #6b7280; padding: 6px 0; width: 120px;">제품 종류</td><td style="color: #111827;">${product || "-"}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">희망 규격</td><td style="color: #111827;">${size || "-"}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">수량</td><td style="color: #111827;">${quantity || "-"}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">사용 압력</td><td style="color: #111827;">${pressure || "-"}</td></tr>
      <tr><td style="color: #6b7280; padding: 6px 0;">이송 유체</td><td style="color: #111827;">${fluid || "-"}</td></tr>
    </table>

    ${message ? `
    <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; margin: 24px 0 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">추가 요청사항</h3>
    <p style="color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${message}</p>
    ` : ""}
  </div>
  <div style="background: #e5e7eb; padding: 12px 24px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
    접수 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
  </div>
</div>`;

    await transporter.sendMail({
      from: `"ATX 홈페이지" <${process.env.SMTP_USER}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `[견적문의] ${company} - ${name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "메일 전송에 실패했습니다." }, { status: 500 });
  }
}
