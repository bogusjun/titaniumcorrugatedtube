import { chromium } from "playwright";

const BASE = "http://localhost:3005";

const PAGES = [
  {
    name: "홈 (en)",
    path: "/en",
    mustContain: [
      "Titanium Corrugated Tube",
      "ISO 9001",
      "Request a Free Quote",
      "View Product Catalog",
      "Performance Beyond Stainless Steel",
      "Aquaculture",
      "Semiconductor",
      "High-Corrosion Heat Exchange",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "회사 소개 (en)",
    path: "/en/about",
    mustContain: [
      "Company Overview",
      "ISO 9001:2015",
      "30 Years of Growth",
      "Hydroforming Press",
      "Processing Capabilities",
      "Quality Recognized by International Standards",
      "POSCO",
      "PETRONAS",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "제품 목록 (en)",
    path: "/en/products",
    mustContain: [
      "Products",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "적용 산업 (en)",
    path: "/en/industries",
    mustContain: [
      "Industries Served",
      "Aquaculture & Food",
      "Semiconductor & Display",
      "Petrochemical & Plant",
      "Aerospace & Defense",
      "Medical Device & Pharma",
      "Marine & Offshore",
      "Request Quote",
      "Request a Free Quote",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "사례 (en)",
    path: "/en/cases",
    mustContain: [
      "ATX specialises exclusively in titanium",
      "Aquaculture",
      "Multiple No-Replacement Sites",
      "Technical Consultation Inquiry",
      "Land-Based Aquaculture",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "기술 특장점 (en)",
    path: "/en/technology",
    mustContain: [
      "Technology & Features",
      "Titanium Grade Comparison",
      "Grade 1",
      "Grade 2",
      "Grade 7",
      "Grade 9",
      "Rigorous Process, Perfect Quality",
      "Hydroforming",
      "Quality Testing Beyond International Standards",
      "Hydrostatic Test",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "뉴스 (en)",
    path: "/en/news",
    mustContain: [
      "News & Updates",
      "INCHEM KOREA",
      "Grade 9",
      "WEFTEC",
      "ISO 9001:2015",
      "Read More",
      "All",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "문의 (en)",
    path: "/en/support",
    mustContain: [
      "Contact & Support",
      "Quote & Inquiry Form",
      "Company Name",
      "Contact Person",
      "Email Address",
      "Frequently Asked Questions",
      "minimum order quantity",
      "Technical Document Downloads",
      "+82-1544-1909",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
];

const VIEWPORTS = [
  { name: "데스크톱", width: 1440, height: 900 },
  { name: "모바일",   width: 390,  height: 844 },
];

async function auditPage(page, route, viewport) {
  const issues = [];
  const url = BASE + route.path;

  const consoleErrors = [];
  const handler = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  page.on("console", handler);

  const response = await page
    .goto(url, { waitUntil: "networkidle", timeout: 30000 })
    .catch(() => null);

  const status = response?.status() ?? 0;
  if (status === 404) {
    issues.push(`[404] 페이지 없음`);
    page.off("console", handler);
    return issues;
  }
  if (status >= 400) {
    issues.push(`[HTTP ${status}] 오류 응답`);
  }

  await page.waitForTimeout(1500);

  const brokenImgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img"))
      .filter((img) => {
        const rect = img.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        return inViewport && (!img.complete || img.naturalWidth === 0);
      })
      .map((img) => img.src || img.getAttribute("src") || "(no src)")
      .filter((src) => !src.includes("data:"))
  );
  brokenImgs.forEach((src) => issues.push(`[이미지 없음] ${src}`));

  const bodyText = await page.evaluate(() => document.body?.innerText ?? "");

  for (const keyword of route.mustContain ?? []) {
    if (!bodyText.includes(keyword)) {
      issues.push(`[번역 누락] "${keyword}"`);
    }
  }

  for (const keyword of route.mustNotContain ?? []) {
    if (bodyText.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push(`[미번역 잔존] "${keyword}"`);
    }
  }

  const headerLinks = await page.$$eval("header a", (els) =>
    els.map((el) => ({ text: el.textContent?.trim(), href: el.getAttribute("href") }))
  );
  const nonEnLinks = headerLinks.filter(
    (l) => l.href && l.href.startsWith("/") && !l.href.startsWith("/en") && l.href !== "/"
  );
  if (nonEnLinks.length > 0) {
    nonEnLinks.forEach((l) =>
      issues.push(`[헤더 링크 오류] "${l.text}" → ${l.href} (/en 경로 아님)`)
    );
  }

  const realErrors = consoleErrors.filter(
    (e) =>
      !e.includes("favicon") &&
      !e.includes("net::ERR_ABORTED") &&
      !e.includes("Warning:") &&
      !e.includes("hydration")
  );
  const hydrationWarnings = consoleErrors.filter(
    (e) => e.includes("hydration") || (e.includes("Warning:") && e.includes("did not match"))
  );

  realErrors.forEach((e) => issues.push(`[콘솔 오류] ${e.slice(0, 120)}`));
  if (hydrationWarnings.length > 0) {
    issues.push(`[Hydration 경고] ${hydrationWarnings.length}건 — alt/텍스트 불일치 (서버·클라이언트 diff)`);
  }

  page.off("console", handler);
  return issues;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  let totalIssues = 0;
  let totalPassed = 0;

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    console.log(`\n${"=".repeat(60)}`);
    console.log(`뷰포트: ${viewport.name} (${viewport.width}×${viewport.height})`);
    console.log("=".repeat(60));

    for (const route of PAGES) {
      const issues = await auditPage(page, route, viewport);
      const label = `[${viewport.name}] ${route.name}`;

      if (issues.length === 0) {
        console.log(`  ✅ ${label}`);
        totalPassed++;
      } else {
        console.log(`  ❌ ${label}`);
        issues.forEach((i) => console.log(`       ${i}`));
        totalIssues += issues.length;
      }

      allResults.push({ label, issues });
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n${"=".repeat(60)}`);
  console.log("최종 요약");
  console.log("=".repeat(60));
  const totalChecks = PAGES.length * VIEWPORTS.length;
  console.log(`검사 페이지: ${totalChecks}건`);
  console.log(`통과: ${totalPassed}건`);
  console.log(`문제 있음: ${totalChecks - totalPassed}건 (총 이슈 ${totalIssues}개)`);

  if (totalIssues === 0) {
    console.log("\n🎉 모든 영어 페이지 검증 통과!");
  } else {
    console.log("\n⚠️  위 이슈를 확인하세요.");
  }

  process.exit(totalIssues > 0 ? 1 : 0);
})();
