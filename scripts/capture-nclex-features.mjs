import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:3000";
const outDir = "/opt/cursor/artifacts";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

async function shot(name, width, height, isMobile) {
  const context = await browser.newContext(
    isMobile
      ? { ...devices["iPhone 12"], viewport: { width, height: 844 } }
      : { viewport: { width, height } }
  );
  const page = await context.newPage();
  await page.goto(`${base}/nclex`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("#features", { timeout: 60000 });
  await page.locator("#features").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => ({
    inner: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  console.log(JSON.stringify({ width, overflow }));
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: false });
  await context.close();
}

await shot("nclex-features-desktop.png", 1280, 900, false);
await shot("nclex-features-390.png", 390, 844, true);
await browser.close();
