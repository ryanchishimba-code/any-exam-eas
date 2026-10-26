import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = "/opt/cursor/artifacts/hero-screenshots";
const BASE = process.env.HERO_SCREENSHOT_BASE ?? "http://localhost:3000";

const PAGES = [
  { slug: "home", path: "/" },
  { slug: "nclex", path: "/nclex" },
  { slug: "naplex", path: "/naplex" },
  { slug: "usmle", path: "/usmle" },
  { slug: "pance", path: "/pance" },
  { slug: "aanp-fnp", path: "/aanp-fnp" },
  { slug: "npte-pt", path: "/npte-pt" },
];

const VIEWPORTS = [
  { name: "desktop_1280", width: 1280, height: 800 },
  { name: "mobile_390", width: 390, height: 844 },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const route of PAGES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator(".mkt-photo-hero").first().waitFor({ state: "visible", timeout: 60_000 });
    const file = path.join(OUT, `hero_${route.slug}_${vp.name}.png`);
    await page.locator(".mkt-photo-hero").first().screenshot({ path: file });
    console.log("saved", file);
  }
}

await browser.close();
