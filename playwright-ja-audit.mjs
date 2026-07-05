import { chromium } from "playwright";

const BASE = "http://localhost:3005";

// 검증할 일어 페이지와 반드시 포함돼야 할 일어 키워드
const PAGES = [
  {
    name: "홈 (ja)",
    path: "/ja",
    mustContain: [
      "チタン波管",
      "ISO 9001",
      "無料見積もり依頼",
      "製品カタログを見る",
      "なぜチタンなのか",
      "ステンレスを超える性能",
      "水産養殖",
      "半導体",
      "今すぐ始めましょう",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "회사 소개 (ja)",
    path: "/ja/about",
    mustContain: [
      "会社概要",
      "ISO 9001:2015",
      "沿革",
      "生産設備",
      "ハイドロフォーミングプレス",
      "加工能力",
      "認証取得状況",
      "POSCO",
      "PETRONAS",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "제품 목록 (ja)",
    path: "/ja/products",
    mustContain: [
      "製品紹介",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "적용 산업 (ja)",
    path: "/ja/industries",
    mustContain: [
      "適用産業分野",
      "水産養殖・食品",
      "半導体・ディスプレイ",
      "石油化学・プラント",
      "航空宇宙・防衛",
      "医療機器・製薬",
      "海洋・船舶",
      "見積依頼",
      "無料見積もり依頼",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "사례 (ja)",
    path: "/ja/cases",
    mustContain: [
      "ATXは腐食環境でのチタン",
      "水産・養殖",
      "無交換現場多数",
      "技術相談のお問い合わせ",
      "陸上養殖場",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "기술 특장점 (ja)",
    path: "/ja/technology",
    mustContain: [
      "技術特長",
      "素材選択ガイド",
      "Grade 1",
      "Grade 2",
      "Grade 7",
      "Grade 9",
      "製造工程",
      "ハイドロフォーミング成形",
      "品質管理",
      "水圧試験",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "뉴스 (ja)",
    path: "/ja/news",
    mustContain: [
      "お知らせ・ニュース",
      "INCHEM KOREA",
      "Grade 9",
      "WEFTEC",
      "ISO 9001:2015",
      "詳細を見る",
      "すべて",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
  {
    name: "문의 (ja)",
    path: "/ja/support",
    mustContain: [
      "お問い合わせ",
      "お見積もり・お問い合わせ",
      "会社名",
      "ご担当者名",
      "メールアドレス",
      "よくある質問（FAQ）",
      "最小注文数量",
      "技術資料ダウンロード",
      "+82-1544-1909",
    ],
    mustNotContain: ["준비중", "TODO"],
  },
];

const VIEWPORTS = [
  { name: "데스크톱", width: 1440, height: 900 },
  { name: "모바일",   width: 390,  height: 844 },
];

// ─────────────────────────────────────────
// 메인 검증 로직
// ─────────────────────────────────────────

async function auditPage(page, route, viewport) {
  const issues = [];
  const url = BASE + route.path;

  // 콘솔 에러 수집
  const consoleErrors = [];
  const handler = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  };
  page.on("console", handler);

  const response = await page
    .goto(url, { waitUntil: "networkidle", timeout: 30000 })
    .catch(() => null);

  // HTTP 상태
  const status = response?.status() ?? 0;
  if (status === 404) {
    issues.push(`[404] 페이지 없음`);
    page.off("console", handler);
    return issues;
  }
  if (status >= 400) {
    issues.push(`[HTTP ${status}] 오류 응답`);
  }

  // Next.js Image 최적화 로딩 대기 (뷰포트 내 이미지만)
  await page.waitForTimeout(1500);

  // 깨진 이미지 — viewport 내에 있는 것만 검사 (lazy load 제외)
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

  // 본문 텍스트 추출
  const bodyText = await page.evaluate(() => document.body?.innerText ?? "");

  // 필수 일어 키워드 검증
  for (const keyword of route.mustContain ?? []) {
    if (!bodyText.includes(keyword)) {
      issues.push(`[번역 누락] "${keyword}"`);
    }
  }

  // 있으면 안 되는 텍스트
  for (const keyword of route.mustNotContain ?? []) {
    if (bodyText.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push(`[미번역 잔존] "${keyword}"`);
    }
  }

  // 내비게이션 일어 링크 확인 (헤더)
  const headerLinks = await page.$$eval("header a", (els) =>
    els.map((el) => ({ text: el.textContent?.trim(), href: el.getAttribute("href") }))
  );
  const nonJaLinks = headerLinks.filter(
    (l) => l.href && l.href.startsWith("/") && !l.href.startsWith("/ja") && l.href !== "/"
  );
  if (nonJaLinks.length > 0) {
    nonJaLinks.forEach((l) =>
      issues.push(`[헤더 링크 오류] "${l.text}" → ${l.href} (/ja 경로 아님)`)
    );
  }

  // 콘솔 에러 (React hydration warning은 별도 분류)
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
  };

  page.off("console", handler);
  return issues;
}

// ─────────────────────────────────────────
// 실행
// ──────────────────────���──────────────────

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

  // ── 최종 요약 ──
  console.log(`\n${"=".repeat(60)}`);
  console.log("최종 요약");
  console.log("=".repeat(60));
  const totalChecks = PAGES.length * VIEWPORTS.length;
  console.log(`검사 페이지: ${totalChecks}건`);
  console.log(`통과: ${totalPassed}건`);
  console.log(`문제 있음: ${totalChecks - totalPassed}건 (총 이슈 ${totalIssues}개)`);

  if (totalIssues === 0) {
    console.log("\n🎉 모든 일어 페이지 검증 통과!");
  } else {
    console.log("\n⚠️  위 이슈를 확인하세요.");
  }

  process.exit(totalIssues > 0 ? 1 : 0);
})();
