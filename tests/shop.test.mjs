// 온라인 구매 전체 흐름: 구매 상자 → 장바구니 → 결제 → 재고 → 주문 조회 → 관리자 발송·환불,
// 결제창 닫기·금액 조작·모바일 리디렉트·웹훅·남용 제한·판매 품목 관리·권한
import { BASE, PORTONE, adminCookie, adminLogin, blockExternal, db, launch, ok, resetShopData, run, shot, stock } from "./lib.mjs";

// 가짜 포트원 브라우저 SDK. mode: 'pay' | 'fail' | 'tamper'
const sdkScript = (mode) => `
window.PortOne = {
  requestPayment: async (req) => {
    window.__lastPaymentRequest = req;
    if (${JSON.stringify(mode)} === 'fail') return { code: 'FAILURE_TYPE_PG', message: '사용자가 결제를 취소하였습니다', paymentId: req.paymentId };
    const amount = ${JSON.stringify(mode)} === 'tamper' ? 100 : req.totalAmount;
    await fetch('${PORTONE}/__mock/pay', { method: 'POST', body: JSON.stringify({ paymentId: req.paymentId, amount }) });
    return { transactionType: 'PAYMENT', txId: 'tx-' + req.paymentId, paymentId: req.paymentId };
  }
};`;

// 가짜 카카오 우편번호 검색
const postcodeScript = `
window.daum = { Postcode: function (opts) { this.embed = (el) => {
  const b = document.createElement('button'); b.textContent = '테스트주소선택'; b.id = 'fake-addr';
  b.onclick = () => opts.oncomplete({ zonecode: '15588', roadAddress: '경기 안산시 단원구 번영로 44번길 2', jibunAddress: '', userSelectedType: 'R', bname: '성곡동', buildingName: '', apartment: 'N' });
  el.appendChild(b);
}; } };`;

async function newPage(browser, sdkMode, viewport) {
  const ctx = await browser.newContext({ viewport: viewport ?? { width: 1280, height: 900 } });
  await ctx.route("https://cdn.portone.io/**", (r) => r.fulfill({ contentType: "application/javascript", body: sdkScript(sdkMode) }));
  await ctx.route("https://t1.daumcdn.net/**", (r) => r.fulfill({ contentType: "application/javascript", body: postcodeScript }));
  await blockExternal(ctx);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
  return { ctx, page };
}

async function fillCheckout(page, { phone = "010-1234-5678" } = {}) {
  await page.fill('input[name="buyerName"]', "김테스트");
  await page.fill('input[name="buyerPhone"]', phone);
  await page.fill('input[name="buyerEmail"]', "buyer@example.com");
  await page.fill('input[name="buyerCompany"]', "(주)테스트공업");
  await page.getByRole("button", { name: "주소 검색" }).click();
  await page.locator("#fake-addr").click();
  await page.locator("#address2").fill("10층 1001호");
  await page.getByText("모두 동의합니다").click();
}

const visibleCart = (page) => page.locator('[data-testid="cart-button"]:visible');
const json = (body, headers = {}) => ({ method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

await run("shop", async () => {
  await resetShopData();
  const browser = await launch();
  try {
    // ---------- 1. 구매 상자 + 장바구니 ----------
    {
      const { ctx, page } = await newPage(browser, "pay");
      await page.goto(`${BASE}/products/tube-standard`);
      const box = page.getByTestId("purchase-box");
      ok(await box.isVisible(), "standard product page shows purchase box");
      ok(await box.getByRole("radio", { name: /1,000mm.*품절/ }).isVisible(), "sold-out SKU (TS-1000) marked 품절");
      ok((await visibleCart(page).count()) === 0, "header cart hidden while cart is empty");
      await box.getByRole("radio", { name: /500mm/ }).click();
      ok(await box.getByText("1개 남음").isVisible(), "low stock hint for TS-500");
      ok(await box.getByRole("button", { name: "수량 늘리기" }).isDisabled(), "cannot exceed stock of 1");
      await box.getByRole("radio", { name: /300mm/ }).click();
      await box.getByRole("button", { name: "수량 늘리기" }).click();
      ok((await box.getByTestId("purchase-total").innerText()).includes("66,000"), "purchase total 33,000 × 2");
      await box.getByRole("button", { name: "장바구니" }).click();
      ok(await box.getByText("장바구니에 담았습니다.").isVisible(), "added to cart message");
      ok((await page.getByRole("link", { name: "장바구니 2개" }).filter({ visible: true }).count()) === 1, "header cart badge shows 2");
      await shot(page, "1-standard", false);

      await page.goto(`${BASE}/products/socket`);
      const sbox = page.getByTestId("purchase-box");
      ok(await sbox.getByText("20%").isVisible(), "socket shows 20% off (12,000 vs 15,000)");
      ok((await sbox.getByRole("radio", { name: /황동/ }).count()) === 0, "inactive / 0-won SKUs are not listed");
      await sbox.getByRole("button", { name: "수량 늘리기" }).click();
      await sbox.getByRole("button", { name: "수량 늘리기" }).click();
      await sbox.getByRole("button", { name: "장바구니" }).click();

      await page.goto(`${BASE}/cart`);
      await page.getByTestId("cart-line").first().waitFor();
      await page.waitForTimeout(400);
      const total = await page.getByTestId("summary-total").innerText();
      ok(total.includes("102,000"), `cart total 33,000×2 + 12,000×3 = 102,000 (got ${total})`);
      ok(await page.getByText("무료").first().isVisible(), "free shipping over 100,000");
      await shot(page, "2-cart", true);

      // ---------- 2. 결제 ----------
      await page.getByTestId("go-checkout").click();
      await page.waitForURL(`${BASE}/checkout`);
      await page.getByText("주문자 정보").waitFor();
      await page.getByTestId("pay").click();
      ok(await page.getByText("주문자 이름을 입력해 주세요.").isVisible(), "checkout validates required fields");
      await fillCheckout(page);
      await shot(page, "3-checkout", true);
      await page.getByRole("button", { name: /102,000원 결제하기/ }).click();
      await page.waitForURL(/\/checkout\/complete\?paymentId=/);
      await page.getByText("주문이 접수되었습니다").waitFor({ timeout: 15000 });
      const orderNo = new URL(page.url()).searchParams.get("paymentId");
      ok(/^A\d{6}-[A-Z0-9]{6}$/.test(orderNo), `order number format ${orderNo}`);
      const req = await page.evaluate(() => window.__lastPaymentRequest);
      ok(req.totalAmount === 102000 && req.currency === "KRW" && req.payMethod === "CARD" && req.redirectUrl.endsWith("/checkout/complete"), "SDK got server amount, KRW, card, redirectUrl");
      ok(req.orderName === "티타늄 주름관 표준품 300mm 외 1건", `orderName "${req.orderName}"`);
      ok(await page.getByText("김**트 · 010-****-5678").isVisible(), "receipt masks recipient name + phone");
      ok(!(await page.getByText("1001호").count()), "receipt hides detailed address");
      ok((await visibleCart(page).count()) === 0, "cart emptied after payment");
      await shot(page, "4-complete", true);

      const [order] = await db("select status, total_amount, pay_method, buyer_company from orders where order_no=$1", [orderNo]);
      ok(order.status === "paid" && order.total_amount === 102000, `DB order paid 102000 (${order.status})`);
      ok(order.pay_method === "카드 (테스트카드)" && order.buyer_company === "(주)테스트공업", "pay method + company recorded");
      ok((await stock("TS-300")) === 3 && (await stock("SK-TI-10A")) === 47, "stock decremented (TS-300 5→3, SK-TI-10A 50→47)");

      // 재생성(ISR) 확인: 다시 열면 남은 수량이 바뀌어 있다
      await page.goto(`${BASE}/products/tube-standard`);
      await page.waitForTimeout(1500);
      await page.goto(`${BASE}/products/tube-standard`);
      ok(await page.getByTestId("purchase-box").getByRole("radio", { name: /300mm.*3개 남음/ }).isVisible(), "product page shows updated stock after purchase (revalidated)");

      // ---------- 3. 주문 조회 ----------
      await page.goto(`${BASE}/orders`);
      await page.fill('input[name="orderNo"]', orderNo);
      await page.fill('input[name="phone"]', "01099999999");
      await page.getByRole("button", { name: "조회" }).click();
      ok(await page.getByText("일치하는 주문이 없습니다").waitFor({ timeout: 5000 }).then(() => true, () => false), "lookup rejects wrong phone");
      await page.fill('input[name="phone"]', "010-1234-5678");
      await page.getByRole("button", { name: "조회" }).click();
      await page.getByText("10층 1001호").waitFor();
      ok(true, "lookup with correct phone shows full address");

      // ---------- 4. 관리자: 발송 + 취소·환불 ----------
      await adminLogin(page);
      await page.getByTestId("admin-order-row").filter({ hasText: orderNo }).click();
      const panel = page.getByTestId("admin-order-panel");
      await panel.waitFor();
      ok(await panel.getByText("결제완료").isVisible() && (await panel.getByText("(주)테스트공업").count()) > 0, "admin sees paid order with company");
      await shot(page, "5-admin-orders", true);
      await panel.locator('input[name="tracking"]').fill("123456789012");
      await panel.getByTestId("admin-ship").click();
      await panel.getByText("발송 처리했습니다").waitFor();
      const [shipped] = await db("select status, courier, tracking_number, shipped_at from orders where order_no=$1", [orderNo]);
      ok(shipped.status === "shipped" && shipped.courier === "cj" && shipped.tracking_number === "123456789012" && shipped.shipped_at, "admin marks shipped with tracking");

      page.on("dialog", (d) => d.accept());
      await panel.getByRole("button", { name: "주문 취소·환불" }).click();
      await panel.locator('input[name="cancelReason"]').fill("고객 요청 (테스트)");
      await panel.getByTestId("admin-cancel").click();
      await panel.getByText("전액 환불했습니다").waitFor();
      const [cancelled] = await db("select status, cancel_reason from orders where order_no=$1", [orderNo]);
      ok(cancelled.status === "cancelled" && cancelled.cancel_reason === "고객 요청 (테스트)", "admin cancel marks order cancelled");
      const mock = await (await fetch(`${PORTONE}/__mock/state`)).json();
      ok(mock.payments.find((p) => p.id === orderNo)?.status === "CANCELLED", "PortOne payment refunded (cancel API called)");
      ok((await stock("TS-300")) === 5 && (await stock("SK-TI-10A")) === 50, "stock restored after cancel");
      await ctx.close();
    }

    // ---------- 5. 바로 구매 + 결제창 닫기 ----------
    {
      const { ctx, page } = await newPage(browser, "fail");
      await page.goto(`${BASE}/products/socket`);
      const box = page.getByTestId("purchase-box");
      await box.getByRole("radio", { name: /티타늄 · 15A/ }).click();
      await box.getByRole("button", { name: "바로 구매" }).click();
      await page.waitForURL(`${BASE}/checkout?mode=buynow`);
      await page.getByText("주문자 정보").waitFor();
      await fillCheckout(page);
      await page.getByTestId("pay").click();
      await page.getByText("사용자가 결제를 취소하였습니다").waitFor();
      ok(true, "payment cancel message shown on checkout");
      const [o] = await db("select status, stock_reserved from orders order by created_at desc limit 1");
      ok(o.status === "failed" && !o.stock_reserved, "aborted order released (failed)");
      ok((await stock("SK-TI-15A")) === 3, "stock returned after abort");
      await page.reload();
      await page.getByText("주문자 정보").waitFor();
      ok((await page.inputValue('input[name="buyerPhone"]')) === "010-1234-5678", "checkout form restored after failure");
      await ctx.close();
    }

    // ---------- 6. 금액 조작 → 자동 환불 (배송비 포함 주문) ----------
    {
      const { ctx, page } = await newPage(browser, "tamper");
      await page.goto(`${BASE}/products/tube-standard`);
      const box = page.getByTestId("purchase-box");
      await box.getByRole("radio", { name: /500mm/ }).click();
      await box.getByRole("button", { name: "바로 구매" }).click();
      await page.getByText("주문자 정보").waitFor();
      await fillCheckout(page);
      await page.getByRole("button", { name: /45,000원 결제하기/ }).click();
      await page.getByText("결제 금액이 주문 금액과 일치하지 않아").waitFor({ timeout: 15000 });
      ok(true, "tampered amount rejected with message (41,000 + shipping 4,000)");
      const no = new URL(page.url()).searchParams.get("paymentId");
      const mock = await (await fetch(`${PORTONE}/__mock/state`)).json();
      ok(mock.payments.find((p) => p.id === no)?.status === "CANCELLED", "tampered payment auto-cancelled at PortOne");
      const [o] = await db("select status, total_amount from orders where order_no=$1", [no]);
      ok(o.status === "failed" && o.total_amount === 45000, "tampered order marked failed (total 45,000 incl. shipping)");
      ok((await stock("TS-500")) === 1, "stock restored after tamper");
      await ctx.close();
    }

    // ---------- 7. API · 모바일 리디렉트 · 웹훅 ----------
    {
      const { ctx, page } = await newPage(browser, "pay", { width: 390, height: 844 });
      const customer = { buyerName: "모바일", buyerEmail: "m@example.com", buyerPhone: "01011112222", buyerCompany: "", recipientName: "모바일", recipientPhone: "01011112222", postcode: "06236", address1: "서울", address2: "", deliveryMemo: "" };
      const items = [{ sku: "SK-TI-15A", quantity: 3 }];
      let res = await fetch(`${BASE}/api/orders`, json({ customer, items, agreed: true }));
      const created = await res.json();
      ok(res.status === 200 && created.totalAmount === 46000, `API order create returns server amount 14,000×3 + 4,000 (${created.totalAmount})`);
      ok((await stock("SK-TI-15A")) === 0, "stock reserved while pending");
      res = await fetch(`${BASE}/api/orders`, json({ customer, items, agreed: true }));
      ok(res.status === 409, "second buyer for the same stock is refused (409)");
      await page.goto(`${BASE}/checkout/complete?paymentId=${created.orderNo}&code=FAILURE_TYPE_PG&message=${encodeURIComponent("결제를 취소했습니다")}`);
      await page.getByText("결제를 취소했습니다").waitFor();
      ok((await stock("SK-TI-15A")) === 3, "mobile redirect failure releases stock");

      res = await fetch(`${BASE}/api/orders`, json({ customer, items, agreed: true }));
      const o2 = await res.json();
      await fetch(`${PORTONE}/__mock/pay`, { method: "POST", body: JSON.stringify({ paymentId: o2.orderNo, amount: o2.totalAmount }) });
      res = await fetch(`${BASE}/api/payment/webhook`, json({ type: "Transaction.Paid", data: { paymentId: o2.orderNo, storeId: "store-test", transactionId: "t" } }));
      ok((await res.json()).result === "paid", "webhook marks order paid");
      res = await fetch(`${BASE}/api/payment/webhook`, json({ type: "Transaction.Paid", data: { paymentId: o2.orderNo } }));
      ok((await res.json()).result === "paid", "duplicate webhook is idempotent");
      ok((await stock("SK-TI-15A")) === 0, "stock stays decremented once");
      await page.goto(`${BASE}/checkout/complete?paymentId=${o2.orderNo}`);
      await page.getByText("주문이 접수되었습니다").waitFor();
      ok(true, "late redirect after webhook still shows success");
      res = await fetch(`${BASE}/api/payment/webhook`, json({ type: "Transaction.Paid", data: { paymentId: "T261105-OTHER1" } }));
      ok((await res.json()).ignored === true, "webhook ignores payments of other shops");

      res = await fetch(`${BASE}/api/cart/quote`, json({ items: [{ sku: "bad sku", quantity: 1 }] }));
      ok(res.status === 400, "quote rejects invalid SKU");
      res = await fetch(`${BASE}/api/orders`, json({ customer, items }));
      ok(res.status === 400, "order requires agreement");
      res = await fetch(`${BASE}/api/orders`, json({ customer, items: [{ sku: "SK-BR-15A", quantity: 1 }], agreed: true }));
      ok(res.status === 409, "inactive SKU cannot be ordered via API");
      res = await fetch(`${BASE}/api/orders`, json({ customer: { ...customer, buyerPhone: "123" }, items: [{ sku: "SK-TI-10A", quantity: 1 }], agreed: true }));
      ok(res.status === 400, "invalid phone rejected by server");

      // 모바일 결제 화면 가로 넘침 없음
      await page.goto(`${BASE}/products/socket`);
      await page.getByTestId("purchase-box").getByRole("button", { name: "바로 구매" }).click();
      await page.getByText("주문자 정보").waitFor();
      ok(!(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)), "no horizontal scroll on mobile checkout");
      await shot(page, "6-mobile-checkout", true);
      await ctx.close();
    }

    // ---------- 8. 남용 제한 (접속자 IP 별) ----------
    {
      await db("update shop_items set stock = 500 where sku in ('SK-TI-10A')");
      const customer = { buyerName: "제한", buyerEmail: "r@example.com", buyerPhone: "01033334444", recipientName: "제한", recipientPhone: "01033334444", postcode: "06236", address1: "서울" };
      const order = (ip, items) => fetch(`${BASE}/api/orders`, json({ customer, items, agreed: true }, { "x-real-ip": ip }));
      const one = [{ sku: "SK-TI-10A", quantity: 1 }];
      const r1 = await order("203.0.113.7", one);
      const r2 = await order("203.0.113.7", one);
      const r3 = await order("203.0.113.7", one);
      const r3body = await r3.json();
      ok(r1.status === 200 && r2.status === 200, "two open payments from one IP allowed");
      ok(r3.status === 429 && r3body.code === "TOO_MANY_PENDING", `3rd open payment from same IP refused (${r3.status} ${r3body.code})`);
      ok((await order("198.51.100.9", one)).status === 200, "a different IP is not affected");
      const keys = await db("select distinct client_key from orders where client_key is not null");
      ok(keys.length >= 2 && keys.every((k) => /^[0-9a-f]{32}$/.test(k.client_key)), "client key stored as hash, not raw IP");
      await db("delete from orders where buyer_name = '제한'");
      await db("update shop_items set stock = 50 where sku = 'SK-TI-10A'");
    }

    // ---------- 9. 관리자: 판매 품목 ----------
    {
      const { ctx, page } = await newPage(browser, "pay");
      await adminLogin(page);
      await page.goto(`${BASE}/admin/items`);
      const zeroRow = page.getByTestId("item-row-SK-BR-10A");
      await zeroRow.waitFor();
      await zeroRow.locator('input[name="isActive"]').check();
      await page.getByTestId("save-SK-BR-10A").click();
      ok(await page.getByText("판매가를 넣어야 판매 중으로 켤 수 있습니다.").waitFor({ timeout: 5000 }).then(() => true, () => false), "0-won item cannot be switched on");
      const row = page.getByTestId("item-row-SK-BR-15A");
      await row.locator('input[name="price"]').fill("6500");
      await row.locator('input[name="isActive"]').check();
      await page.getByTestId("save-SK-BR-15A").click();
      await page.getByText("SK-BR-15A 저장했습니다").waitFor();
      const [saved] = await db("select price, is_active from shop_items where sku = 'SK-BR-15A'");
      ok(saved.price === 6500 && saved.is_active, "admin saves price + on/off");
      await shot(page, "7-admin-items", true);
      await page.goto(`${BASE}/products/socket`);
      ok(await page.getByTestId("purchase-box").getByRole("radio", { name: /황동 · 15A.*6,500/ }).isVisible(), "newly activated SKU appears on product page right away");
      await ctx.close();
    }

    // ---------- 10. 국문만 · 권한 ----------
    {
      const { ctx, page } = await newPage(browser, "pay");
      await page.goto(`${BASE}/en/products/tube-standard`);
      ok((await page.getByTestId("purchase-box").count()) === 0, "English product page has no purchase box (Korean only)");
      await page.goto(`${BASE}/products/heat-exchanger-corrugated`);
      ok((await page.getByTestId("purchase-box").count()) === 0, "custom heat exchanger stays quote-only");
      await ctx.close();

      let res = await fetch(`${BASE}/api/admin/orders`);
      ok(res.status === 401, "admin API requires session");
      res = await fetch(`${BASE}/api/admin/items`, { headers: { cookie: "admin_session=0123456789abcdef0123" } });
      ok(res.status === 401, "raw secret as cookie no longer works (signed session only)");
      res = await fetch(`${BASE}/api/admin/login`, json({ password: "wrong" }));
      ok(res.status === 401, "wrong admin password rejected");
      res = await fetch(`${BASE}/api/admin/items`, { headers: { cookie: await adminCookie() } });
      ok(res.status === 200 && (await res.json()).data.length === 7, "signed session reads items");
      res = await fetch(`${BASE}/admin/orders`, { redirect: "manual" });
      ok(res.status === 307 && (res.headers.get("location") ?? "").endsWith("/admin/login"), "admin page redirects to login without session");
    }
  } finally {
    await browser.close();
  }
});
