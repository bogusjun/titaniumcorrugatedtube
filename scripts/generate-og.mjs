/**
 * 공유 미리보기(OG) 이미지 생성 — 1200×630 JPEG
 *
 *   node scripts/generate-og.mjs
 *
 * 만드는 파일
 *   public/images/og-image.jpg, og-image-en.jpg, og-image-ja.jpg   사이트 공통 (국문·영문·일문)
 *   public/images/og/products/<slug>.jpg                          제품 상세 (products.json 의 images[0])
 *
 * 제품을 추가하거나 사진·이름을 바꾸면 다시 돌린다. 글꼴은 Google Fonts 에서 받는다(네트워크 필요).
 */

import { chromium } from "playwright";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const fileUrl = (webPath) => pathToFileURL(join(PUBLIC, webPath)).href;

const COLORS = {
  base: "#16181E",
  panel: "#1F2530",
  silver50: "#F2F4F6",
  silver200: "#C8D0DC",
  silver400: "#8090A0",
  accent: "#5B8DB8",
  accentLight: "#7AADD4",
};

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&family=Noto+Sans+JP:wght@500;700;900&display=block";

const SITE = [
  {
    out: "images/og-image.jpg",
    lang: "ko",
    eyebrow: "TITANIUM CORRUGATED TUBE",
    title: "티타늄 주름관",
    subtitle: "고부식 환경 열교환 전문 제조사",
    chips: ["Ti Gr.2", "10A · 15A", "소량 1개부터"],
  },
  {
    out: "images/og-image-en.jpg",
    lang: "en",
    eyebrow: "ATX CO., LTD. · KOREA",
    title: "Titanium Corrugated Tube",
    subtitle: "Heat exchange for corrosive environments",
    chips: ["Ti Gr.2", "10A · 15A", "From 1 piece"],
  },
  {
    out: "images/og-image-ja.jpg",
    lang: "ja",
    eyebrow: "TITANIUM CORRUGATED TUBE",
    title: "チタン波管",
    subtitle: "高腐食環境の熱交換 専門メーカー",
    chips: ["Ti Gr.2", "10A · 15A", "1本から対応"],
  },
];

const SITE_PHOTO = "/images/products/ts-coil-top-angled.jpg";

function fontFamily(lang) {
  return lang === "ja"
    ? "'Noto Sans JP', 'Noto Sans KR', sans-serif"
    : "'Noto Sans KR', 'Noto Sans JP', sans-serif";
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function shell(lang, body) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONT_CSS}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: ${COLORS.base}; }
  body { font-family: ${fontFamily(lang)}; color: ${COLORS.silver50}; position: relative; -webkit-font-smoothing: antialiased; word-break: keep-all; overflow-wrap: anywhere; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .brand img { height: 46px; }
  .brand span { font-size: 18px; font-weight: 700; color: ${COLORS.silver400}; letter-spacing: .06em; }
  .eyebrow { font-size: 18px; font-weight: 700; letter-spacing: .22em; color: ${COLORS.accentLight}; }
  .bar { width: 72px; height: 5px; background: ${COLORS.accent}; border-radius: 3px; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .chips span { font-size: 19px; font-weight: 500; color: ${COLORS.silver200}; border: 1.5px solid #3D4455; background: rgba(31,37,48,.8); padding: 7px 16px; border-radius: 999px; }
  .foot { font-size: 20px; font-weight: 500; color: ${COLORS.silver400}; letter-spacing: .02em; }
  .foot b { color: ${COLORS.silver200}; font-weight: 700; }
</style></head><body>${body}</body></html>`;
}

function siteCard(c) {
  const long = c.title.length > 12;
  return shell(
    c.lang,
    `
<div style="position:absolute;inset:0 0 0 auto;width:700px;background:url('${fileUrl(SITE_PHOTO)}') center 40%/cover;"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg, ${COLORS.base} 0%, ${COLORS.base} 44%, rgba(22,24,30,.82) 58%, rgba(22,24,30,.15) 82%, rgba(22,24,30,0) 100%);"></div>
<div style="position:absolute;left:72px;top:60px;bottom:58px;width:640px;display:flex;flex-direction:column;">
  <div class="brand"><img src="${fileUrl("/images/logo.png")}" alt=""></div>
  <div style="margin-top:auto;display:flex;flex-direction:column;gap:22px;">
    <div class="eyebrow">${esc(c.eyebrow)}</div>
    <h1 style="font-size:${long ? 64 : 84}px;font-weight:900;line-height:1.08;letter-spacing:-.01em;">${esc(c.title)}</h1>
    <div class="bar"></div>
    <p style="font-size:32px;font-weight:700;color:${COLORS.silver200};line-height:1.3;">${esc(c.subtitle)}</p>
    <div class="chips">${c.chips.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
  </div>
  <div class="foot" style="margin-top:34px;"><b>tube.atx.kr</b>&nbsp;&nbsp;·&nbsp;&nbsp;1544-1909</div>
</div>`
  );
}

function productCard(p) {
  const title = p.name;
  const desc = String(p.description || "").split(/(?<=[.。])\s/)[0];
  return shell(
    "ko",
    `
<div style="position:absolute;inset:0 0 0 auto;width:540px;background:linear-gradient(160deg, ${COLORS.silver50} 0%, #E4E8ED 100%);display:flex;align-items:center;justify-content:center;padding:44px;">
  <img src="${fileUrl(p.images[0])}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 14px 24px rgba(22,24,30,.18));">
</div>
<div style="position:absolute;left:0;top:0;bottom:0;width:660px;background:${COLORS.base};"></div>
<div style="position:absolute;left:660px;top:0;bottom:0;width:6px;background:${COLORS.accent};"></div>
<div style="position:absolute;left:64px;top:56px;bottom:54px;width:552px;display:flex;flex-direction:column;">
  <div class="brand"><img src="${fileUrl("/images/logo.png")}" alt=""><span>티타늄 주름관</span></div>
  <div style="margin-top:auto;display:flex;flex-direction:column;gap:20px;">
    <div class="eyebrow" style="font-size:15px;letter-spacing:.14em;">${esc((p.nameEn || "").toUpperCase())}</div>
    <h1 style="font-size:${title.length > 12 ? 52 : 64}px;font-weight:900;line-height:1.15;letter-spacing:-.01em;">${esc(title)}</h1>
    <div class="bar"></div>
    <p style="font-size:23px;font-weight:500;color:${COLORS.silver200};line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${esc(desc)}</p>
  </div>
  <div class="foot" style="margin-top:30px;"><b>tube.atx.kr</b>&nbsp;&nbsp;·&nbsp;&nbsp;1544-1909</div>
</div>`
  );
}

async function render(page, tmp, html, out) {
  const htmlPath = join(tmp, "card.html");
  writeFileSync(htmlPath, html);
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  const target = join(PUBLIC, out);
  mkdirSync(dirname(target), { recursive: true });
  await page.screenshot({ path: target, type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log("✓", out);
}

const products = JSON.parse(readFileSync(join(ROOT, "src/data/products.json"), "utf8"));
const tmp = mkdtempSync(join(tmpdir(), "atx-og-"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const c of SITE) await render(page, tmp, siteCard(c), c.out);
  for (const p of products) {
    if (!p.images?.[0]) continue;
    await render(page, tmp, productCard(p), `images/og/products/${p.slug}.jpg`);
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
