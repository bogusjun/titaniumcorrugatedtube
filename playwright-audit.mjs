import { chromium } from "playwright";

const BASE = "http://localhost:3052";

const ROUTES = [
  { name: "홈", path: "/" },
  { name: "제품 목록", path: "/products" },
  { name: "주름관(tube)", path: "/products/tube" },
  { name: "열교환기(corrugated)", path: "/products/heat-exchanger-corrugated" },
  { name: "폐열회수기", path: "/products/waste-heat-recovery" },
  { name: "적용 산업", path: "/industries" },
  { name: "설치 사례", path: "/cases" },
  { name: "회사 소개", path: "/about" },
  { name: "지원 / 문의", path: "/support" },
  { name: "기술 정보", path: "/technology" },
  { name: "뉴스", path: "/news" },
];

const VIEWPORTS = [
  { name: "데스크톱", width: 1440, height: 900 },
  { name: "태블릿", width: 768, height: 1024 },
  { name: "모바일", width: 390, height: 844 },
];

async function auditPage(page, route, viewport) {
  const issues = [];
  const url = BASE + route.path;

  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => null);

  // 1. HTTP 상태
  const status = response?.status() ?? 0;
  if (status === 404) {
    issues.push(`[404] 페이지 없음`);
    return issues;
  }
  if (status >= 400) {
    issues.push(`[HTTP ${status}] 오류 응답`);
  }

  // 2. 콘솔 오류 수집 (이미 page.on 으로 등록됨)

  // 3. 깨진 이미지
  const brokenImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("img"))
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src || img.getAttribute("src") || "(no src)");
  });
  brokenImgs.forEach((src) => issues.push(`[이미지 없음] ${src}`));

  // 4. 깨진 링크 (내부 href만, 빈 href 제외)
  const brokenLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href"))
      .filter((href) => href && href.startsWith("/") && href !== "#")
      .filter((href, i, arr) => arr.indexOf(href) === i);
  });
  // href 존재 여부만 리스트업 (실제 fetch 없이)

  // 5. 텍스트 overflow – scrollWidth > clientWidth인 요소
  const overflows = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll("p, h1, h2, h3, span, li, a").forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 2) {
        const text = el.textContent?.trim().slice(0, 60) || "";
        if (text) results.push(text);
      }
    });
    return [...new Set(results)].slice(0, 5);
  });
  overflows.forEach((t) => issues.push(`[텍스트 overflow] "${t}"`));

  // 6. 빈 섹션 (텍스트 콘텐츠가 거의 없는 section/main/article)
  const emptySections = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("section, main"))
      .filter((el) => el.textContent.trim().length < 20)
      .map((el) => el.className?.slice(0, 60) || el.tagName)
      .slice(0, 3);
  });
  emptySections.forEach((cls) => issues.push(`[빈 섹션] .${cls}`));

  // 7. 모바일: 수평 스크롤 발생 여부
  if (viewport.width <= 768) {
    const hasHScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    if (hasHScroll) {
      const excess = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      issues.push(`[모바일 수평스크롤] ${excess}px 초과`);
    }
  }

  // 8. CTA 버튼 존재 여부 (홈·제품 페이지)
  if (["홈", "제품 목록", "주름관(tube)", "열교환기(corrugated)"].includes(route.name)) {
    const ctaExists = await page.evaluate(() =>
      !!document.querySelector('a[href="/support"], button')
    );
    if (!ctaExists) issues.push(`[CTA 없음] 견적/문의 버튼을 찾을 수 없음`);
  }

  // 9. meta description 없음
  const metaDesc = await page.evaluate(
    () => document.querySelector('meta[name="description"]')?.getAttribute("content") || ""
  );
  if (!metaDesc) issues.push(`[SEO] meta description 없음`);

  // 10. h1 개수
  const h1Count = await page.evaluate(() => document.querySelectorAll("h1").length);
  if (h1Count === 0) issues.push(`[접근성] h1 없음`);
  if (h1Count > 1) issues.push(`[SEO] h1 ${h1Count}개 (1개 권장)`);

  return issues;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 120));
    });

    for (const route of ROUTES) {
      consoleErrors.length = 0;
      const issues = await auditPage(page, route, viewport).catch((e) => [
        `[감사 오류] ${e.message.slice(0, 80)}`,
      ]);
      if (consoleErrors.length) {
        consoleErrors.slice(0, 3).forEach((e) => issues.push(`[콘솔 오류] ${e}`));
      }
      report.push({ viewport: viewport.name, page: route.name, path: route.path, issues });
    }

    await context.close();
  }

  await browser.close();

  // 출력
  let prevViewport = "";
  for (const item of report) {
    if (item.viewport !== prevViewport) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`  ${item.viewport} (${VIEWPORTS.find(v=>v.name===item.viewport).width}px)`);
      console.log("=".repeat(60));
      prevViewport = item.viewport;
    }
    const status = item.issues.length === 0 ? "✓" : "✗";
    console.log(`\n${status} [${item.page}] ${item.path}`);
    item.issues.forEach((issue) => console.log(`    - ${issue}`));
  }

  const total = report.reduce((s, r) => s + r.issues.length, 0);
  console.log(`\n${"=".repeat(60)}`);
  console.log(`총 이슈: ${total}건 (${report.filter(r=>r.issues.length===0).length}/${report.length} 페이지 클린)`);
}

main().catch(console.error);
