#!/usr/bin/env node
/**
 * Capture Anatomy Explorer screenshots for QA / docs.
 * Usage: node scripts/qa-anatomy-screenshots.mjs
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.QA_USER_EMAIL ?? "test-premium@anyexameasy.test";
const PASSWORD = process.env.QA_USER_PASSWORD ?? "TestLogin1!";
const OUT = "scripts/qa-screenshots";

async function waitForServer(request, attempts = 45) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await request.get(`${BASE}/api/auth/session`);
      if (res.ok() || res.status() === 401) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Dev server not reachable");
}

async function login(request) {
  await waitForServer(request);
  const csrf = await request.get(`${BASE}/api/auth/csrf`).then((r) => r.json());
  const res = await request.post(`${BASE}/api/auth/callback/credentials`, {
    form: {
      csrfToken: csrf.csrfToken,
      email: EMAIL,
      password: PASSWORD,
      callbackUrl: `${BASE}/anatomy`,
      json: "true",
    },
  });
  if (res.status() >= 400) throw new Error(`Login failed: ${res.status()}`);
  const session = await request.get(`${BASE}/api/auth/session`).then((r) => r.json());
  if (!session?.user?.email) throw new Error("No session after login");
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--enable-webgl"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  try {
    await login(page.request);
    console.log("→ Logged in");

    await page.goto(`${BASE}/anatomy?structure=heart`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.waitForSelector("canvas", { timeout: 90_000 }).catch(() => {});
    await page.getByText("Loading 3D anatomy viewer").waitFor({ state: "hidden", timeout: 60_000 }).catch(() => {});
    await page.waitForTimeout(8000);
    await page.screenshot({ path: `${OUT}/anatomy-overview.png`, fullPage: false });
    console.log(`→ ${OUT}/anatomy-overview.png`);

    const detailsToggle = page.getByRole("button", { name: /details/i }).first();
    const toggleLabel = (await detailsToggle.getAttribute("aria-label").catch(() => "")) ?? "";
    if (toggleLabel.match(/show/i) && (await detailsToggle.isVisible().catch(() => false))) {
      await detailsToggle.click({ force: true });
      await page.waitForTimeout(1500);
    }

    await page.screenshot({ path: `${OUT}/anatomy-heart-detail.png`, fullPage: false });
    console.log(`→ ${OUT}/anatomy-heart-detail.png`);

    const aiTutor = page.getByText("AI Anatomy Tutor");
    if (await aiTutor.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiTutor.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.locator("aside").last().screenshot({ path: `${OUT}/anatomy-ai-tutor-panel.png` });
      console.log(`→ ${OUT}/anatomy-ai-tutor-panel.png`);
    }

    const canvas = page.locator("canvas").first();
    if (await canvas.isVisible({ timeout: 5000 }).catch(() => false)) {
      await canvas.screenshot({ path: `${OUT}/anatomy-3d-viewport.png` });
      console.log(`→ ${OUT}/anatomy-3d-viewport.png`);
    }

    await page.screenshot({ path: `${OUT}/anatomy-full-page.png`, fullPage: true });
    console.log(`→ ${OUT}/anatomy-full-page.png`);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
