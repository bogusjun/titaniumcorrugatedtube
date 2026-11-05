// 사이트 전체 점검 — 사이트맵의 모든 주소(국·영·일)와 그 안의 내부 링크를 실제 브라우저로 연다.
//
//   npm run build && npm start            # 다른 터미널에서 (기본 포트 3000; dev 서버 3005 도 가능)
//   npm run check:site                    # 또는 CHECK_BASE_URL=http://localhost:3005 npm run check:site
//
// 확인 항목: 응답 코드, 콘솔 오류, 깨진 이미지, h1 개수, 404 링크,
//            canonical·og:url 이 자기 주소인지, hreflang(ko·en·ja·x-default), 영·일 제목의 한글,
//            모바일(390px) 가로 넘침
// 문제가 하나라도 있으면 종료 코드 1. 결과 JSON 은 CHECK_REPORT 경로(기본: 저장 안 함)에 저장한다.
//
// 환경변수: CHECK_BASE_URL(기본 http://localhost:3000), CHECK_SITE_URL(사이트맵 안의 주소, 기본 https://tube.atx.kr),
//          CHECK_CHROMIUM_PATH(브라우저 실행 파일 — Claude Code 클라우드는 /opt/pw-browsers/chromium), CHECK_REPORT
import fs from "node:fs";
import { chromium } from "playwright";

const BASE = (process.env.CHECK_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const SITE = (process.env.CHECK_SITE_URL ?? "https://tube.atx.kr").replace(/\/+$/, "");

const problems = [];
const problem = (path, msg) => problems.push(`${path}  ${msg}`);

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const seeds = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
if (seeds.length === 0) {
  console.error(`사이트맵을 읽지 못했습니다: ${BASE}/sitemap.xml`);
  process.exit(1);
}

const browser = await chromium.launch(process.env.CHECK_CHROMIUM_PATH ? { executablePath: process.env.CHECK_CHROMIUM_PATH } : {});
const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });

const visited = new Set();
const queue = [...seeds];
const assets = new Set();
const report = [];

while (queue.length) {
  const path = queue.shift();
  if (visited.has(path)) continue;
  visited.add(path);

  const page = await desktop.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
  page.on("pageerror", (e) => errors.push(`pageerror ${e.message.slice(0, 160)}`));
  let status = 0;
  try {
    status = (await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 })).status();
  } catch (err) {
    errors.push(`goto ${err.message.slice(0, 100)}`);
  }
  // 지연 로딩 이미지까지 불러오도록 끝까지 내린다
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
  });
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll("h1").length,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "",
    hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.getAttribute("hreflang")),
    brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
  }));
  await page.close();

  const isSeed = seeds.includes(path);
  if (status !== 200) problem(path, `응답 ${status}`);
  for (const e of errors) problem(path, `콘솔 오류: ${e}`);
  for (const src of info.brokenImages) problem(path, `깨진 이미지: ${src}`);
  if (status === 200 && info.h1 !== 1) problem(path, `h1 ${info.h1}개`);
  if (isSeed) {
    const self = SITE + (path === "/" ? "" : path);
    if (info.canonical !== self) problem(path, `canonical ${info.canonical || "(없음)"}`);
    if (info.ogUrl !== self) problem(path, `og:url ${info.ogUrl || "(없음)"}`);
    for (const lang of ["ko", "en", "ja", "x-default"]) if (!info.hreflang.includes(lang)) problem(path, `hreflang ${lang} 없음`);
    if (/^\/(en|ja)(\/|$)/.test(path) && /[가-힣]/.test(info.title)) problem(path, `영·일 제목에 한글: ${info.title}`);
  }

  // 모바일 가로 넘침
  const m = await mobile.newPage();
  await m.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  if (await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1).catch(() => false)) problem(path, "모바일 가로 넘침");
  await m.close();

  report.push({ path, status, ...info, links: undefined, consoleErrors: errors });

  for (const href of info.links) {
    if (!href || href.startsWith("#") || /^(mailto|tel):/.test(href)) continue;
    let url;
    try {
      url = new URL(href, BASE + path);
    } catch {
      continue;
    }
    if (url.origin !== new URL(BASE).origin) continue;
    if (/^\/(api|admin)(\/|$)/.test(url.pathname)) continue;
    if (/\.(pdf|jpe?g|png|webp|mp4|svg)$/i.test(url.pathname)) assets.add(url.pathname);
    else queue.push(url.pathname);
  }
}

for (const a of assets) {
  const res = await fetch(BASE + a, { method: "HEAD" });
  if (res.status !== 200) problem(a, `파일 응답 ${res.status}`);
}

await browser.close();

if (process.env.CHECK_REPORT) fs.writeFileSync(process.env.CHECK_REPORT, JSON.stringify({ report, problems }, null, 1));
console.log(`점검한 페이지 ${report.length}개 · 파일 ${assets.size}개`);
if (problems.length) {
  console.log(`\n문제 ${problems.length}건`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exitCode = 1;
} else {
  console.log("✓ 문제 없음");
}
