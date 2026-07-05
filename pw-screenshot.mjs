import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:3052/products/waste-heat-recovery', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);

const pageHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('page height:', pageHeight);

const shots = [0, 700, 1500, 2400, 3300, 4200, 5100, 6000, 7000, 8000];
for (const y of shots) {
  if (y > pageHeight) break;
  await page.evaluate(yy => window.scrollTo(0, yy), y);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `C:/Users/pc/Downloads/1x/pw_y${y}.png` });
}

await browser.close();
console.log('done');
