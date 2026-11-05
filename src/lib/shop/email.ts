import "server-only";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/lib/seo";
import { SHOP_CONTACT } from "@/lib/shop/config";
import { formatPhone, formatPrice } from "@/lib/shop/format";
import type { OrderRecord } from "@/lib/shop/orders";

/**
 * 주문 메일 — 견적 폼과 같은 Gmail SMTP(SMTP_USER·SMTP_PASS)로 보낸다
 * SMTP 정보가 없으면 보내지 않고 로그만 남긴다(주문 처리는 그대로 진행).
 * 관리자 알림 받는 곳: ADMIN_NOTIFY_EMAIL (없으면 777@atx.kr)
 * 제목은 「[ATX 주름관 주문…]」 — 견적 처리기(「[ATX 주름관 견적문의]」만 집음)가 노션에 올리지 않는다.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.info(`[email] SMTP 설정 없음 — 발송 생략: ${subject} → ${to}`);
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });
    await transporter.sendMail({ from: `"ATX 티타늄 주름관" <${user}>`, to, subject, html });
  } catch (err) {
    console.error("[email] 발송 실패:", subject, err);
  }
}

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="ko"><body style="margin:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#111827">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <div style="background:#16181d;padding:20px 24px;border-radius:8px 8px 0 0">
    <p style="color:#e63946;font-weight:700;margin:0;font-size:15px">ATX 티타늄 주름관</p>
  </div>
  <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px">
    <h1 style="font-size:19px;margin:0 0 18px">${title}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#6b7280;margin-top:20px;line-height:1.7">
    문의 ${SHOP_CONTACT.phone} · ${SHOP_CONTACT.email}<br>(주)에이티엑스 · 경기도 안산시 단원구 번영로 44번길 2 · 사업자등록번호 131-86-09143
  </p>
</div></body></html>`;
}

function itemsTable(order: OrderRecord): string {
  const rows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:9px 0;border-bottom:1px solid #eef0f3;font-size:14px">${escapeHtml(i.item_name)}<br><span style="color:#6b7280;font-size:12px">${escapeHtml(i.option_label)} × ${i.quantity}</span></td>
  <td style="padding:9px 0;border-bottom:1px solid #eef0f3;font-size:14px;text-align:right;white-space:nowrap">${formatPrice(i.unit_price * i.quantity)}</td>
</tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:14px">${rows}
<tr><td style="padding:7px 0;font-size:13px;color:#6b7280">배송비</td><td style="padding:7px 0;font-size:13px;text-align:right;color:#6b7280">${order.shipping_fee ? formatPrice(order.shipping_fee) : "무료"}</td></tr>
<tr><td style="padding:7px 0;font-size:15px;font-weight:700">결제금액 (부가세 포함)</td><td style="padding:7px 0;font-size:15px;font-weight:700;text-align:right">${formatPrice(order.total_amount)}</td></tr>
</table>`;
}

function addressBlock(order: OrderRecord): string {
  return `<p style="font-size:13px;line-height:1.8;color:#4b5563;margin:0 0 18px">
받는 분: ${escapeHtml(order.recipient_name)} (${escapeHtml(formatPhone(order.recipient_phone))})<br>
주소: [${escapeHtml(order.postcode)}] ${escapeHtml(order.address1)} ${escapeHtml(order.address2)}
${order.delivery_memo ? `<br>요청사항: ${escapeHtml(order.delivery_memo)}` : ""}
</p>`;
}

function lookupLink(): string {
  return `<p style="margin:20px 0"><a href="${SITE_URL}/orders" style="display:inline-block;background:#16181d;color:#fff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:6px">주문 조회하기</a></p>`;
}

function adminRecipient(): string {
  return process.env.ADMIN_NOTIFY_EMAIL || SHOP_CONTACT.email;
}

export async function sendOrderPaidEmails(order: OrderRecord): Promise<void> {
  const buyerHtml = layout(
    "주문이 접수되었습니다",
    `<p style="font-size:14px;line-height:1.8;margin:0 0 18px">${escapeHtml(order.buyer_name)}님, 주문해 주셔서 감사합니다.<br>
주문번호 <strong>${escapeHtml(order.order_no)}</strong> — 출고되면 송장번호를 메일로 알려 드립니다.</p>
${itemsTable(order)}${addressBlock(order)}${lookupLink()}
<p style="font-size:12px;color:#6b7280">주문 조회에는 주문번호와 주문자 휴대폰 번호가 필요합니다. 카드 매출전표는 카드사 앱·홈페이지에서 받을 수 있고, 비용 처리 증빙으로 쓸 수 있습니다.</p>`,
  );

  const adminHtml = layout(
    `새 주문 · ${formatPrice(order.total_amount)}`,
    `<p style="font-size:14px;line-height:1.8;margin:0 0 18px">주문번호 ${escapeHtml(order.order_no)}<br>
주문자: ${escapeHtml(order.buyer_name)}${order.buyer_company ? ` · ${escapeHtml(order.buyer_company)}` : ""} (${escapeHtml(formatPhone(order.buyer_phone))}, ${escapeHtml(order.buyer_email)})</p>
${itemsTable(order)}${addressBlock(order)}
<p><a href="${SITE_URL}/admin/orders">관리자 주문 목록 열기</a></p>`,
  );

  await Promise.all([
    send(order.buyer_email, `[ATX 티타늄 주름관] 주문이 접수되었습니다 (${order.order_no})`, buyerHtml),
    send(adminRecipient(), `[ATX 주름관 주문] ${order.buyer_company || order.buyer_name} · ${formatPrice(order.total_amount)}`, adminHtml),
  ]);
}

export async function sendShippedEmail(order: OrderRecord, courierName: string, trackingUrl: string | null): Promise<void> {
  const html = layout(
    "주문하신 제품이 출고되었습니다",
    `<p style="font-size:14px;line-height:1.8;margin:0 0 18px">${escapeHtml(order.buyer_name)}님, 주문번호 ${escapeHtml(order.order_no)} 제품이 출고되었습니다.<br>
${escapeHtml(courierName)} · 송장번호 <strong>${escapeHtml(order.tracking_number ?? "")}</strong></p>
${trackingUrl ? `<p style="margin:0 0 18px"><a href="${trackingUrl}" style="display:inline-block;background:#16181d;color:#fff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:6px">배송 조회</a></p>` : ""}
${itemsTable(order)}${addressBlock(order)}`,
  );
  await send(order.buyer_email, `[ATX 티타늄 주름관] 제품이 출고되었습니다 (${order.order_no})`, html);
}

export async function sendCancelledEmail(order: OrderRecord, refunded: boolean): Promise<void> {
  const html = layout(
    "주문이 취소되었습니다",
    `<p style="font-size:14px;line-height:1.8;margin:0 0 18px">${escapeHtml(order.buyer_name)}님, 주문번호 ${escapeHtml(order.order_no)} 주문이 취소되었습니다.
${refunded ? "<br>결제하신 금액은 카드사 사정에 따라 영업일 기준 3~5일 안에 환불됩니다." : ""}
${order.cancel_reason ? `<br>사유: ${escapeHtml(order.cancel_reason)}` : ""}</p>
${itemsTable(order)}`,
  );
  await send(order.buyer_email, `[ATX 티타늄 주름관] 주문이 취소되었습니다 (${order.order_no})`, html);
}
