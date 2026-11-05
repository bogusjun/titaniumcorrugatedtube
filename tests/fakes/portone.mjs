// 테스트 전용: 포트원 V2 결제 API 흉내 + 테스트 제어용 엔드포인트(/__mock/*). 운영 코드가 아닙니다.
import http from "node:http";

const PORT = Number(process.env.FAKE_PORTONE_PORT ?? 54400);
const payments = new Map(); // paymentId -> payment
const log = [];

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body));
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
    if (req.method === "OPTIONS") return send(res, 204, {});
    log.push(`${req.method} ${url.pathname} auth=${req.headers.authorization ?? "-"}`);

    // --- control (called by the fake browser SDK / tests) ---
    if (url.pathname === "/__mock/pay") {
      // body: { paymentId, amount, status? }
      payments.set(body.paymentId, {
        id: body.paymentId,
        status: body.status ?? "PAID",
        amount: { total: body.amount },
        currency: "KRW",
        paidAt: new Date().toISOString(),
        method: { type: "PaymentMethodCard", card: { name: "테스트카드" } },
      });
      return send(res, 200, { ok: true });
    }
    if (url.pathname === "/__mock/state") return send(res, 200, { payments: [...payments.values()], log });

    // --- PortOne API ---
    if (req.headers.authorization !== "PortOne test-secret") return send(res, 401, { type: "UNAUTHORIZED", message: "bad secret" });
    const m = url.pathname.match(/^\/payments\/([^/]+)(\/cancel)?$/);
    if (!m) return send(res, 404, { type: "NOT_FOUND" });
    const id = decodeURIComponent(m[1]);
    const p = payments.get(id);
    if (!m[2] && req.method === "GET") {
      return p ? send(res, 200, p) : send(res, 404, { type: "PAYMENT_NOT_FOUND", message: "not found" });
    }
    if (m[2] && req.method === "POST") {
      if (!p) return send(res, 404, { type: "PAYMENT_NOT_FOUND", message: "not found" });
      if (p.status === "CANCELLED") return send(res, 409, { type: "PAYMENT_ALREADY_CANCELLED", message: "already" });
      p.status = "CANCELLED";
      p.cancelReason = body.reason;
      return send(res, 200, { cancellation: { status: "SUCCEEDED", totalAmount: p.amount.total } });
    }
    send(res, 405, {});
  })
  .listen(PORT, () => console.log(`fake portone on :${PORT}`));
