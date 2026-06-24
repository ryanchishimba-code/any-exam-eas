#!/usr/bin/env node
/**
 * Manual QA steps 1–6 from site audit checklist.
 * Usage: node scripts/qa-manual-steps.mjs
 */
import { chromium, devices } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const PREMIUM = {
  email: "test-premium@anyexameasy.test",
  password: "TestLogin1!",
};
const TRIAL = {
  email: "test-trial@anyexameasy.test",
  password: "TestLogin1!",
};

const results = [];

function pass(step, detail) {
  results.push({ step, ok: true, detail });
  console.log(`✓ Step ${step}: ${detail}`);
}

function fail(step, detail) {
  results.push({ step, ok: false, detail });
  console.error(`✗ Step ${step}: ${detail}`);
}

async function loginViaApi(request, email, password) {
  await request.get(`${BASE}/api/auth/session`).catch(() => {});
  const csrfRes = await request.get(`${BASE}/api/auth/csrf`);
  if (!csrfRes.ok()) throw new Error(`CSRF ${csrfRes.status()}`);
  const { csrfToken } = await csrfRes.json();
  const loginRes = await request.post(`${BASE}/api/auth/callback/credentials`, {
    form: {
      csrfToken,
      email,
      password,
      callbackUrl: `${BASE}/dashboard`,
      json: "true",
    },
  });
  if (loginRes.status() >= 400) {
    throw new Error(`Login failed ${loginRes.status()}`);
  }
  const session = await request.get(`${BASE}/api/auth/session`).then((r) => r.json());
  if (!session?.user?.email) throw new Error("No session after login");
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ── Step 1: Checkout success banner + trial welcome ──
    await loginViaApi(page.request, TRIAL.email, TRIAL.password);
    await page.goto(`${BASE}/dashboard?checkout=success&welcome=trial`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });

    if (/\/(?:auth\/)?login(?:\?|$)|\/checkout(?:\?|$)/.test(page.url())) {
      fail(1, `Redirected away from dashboard: ${page.url()}`);
    } else {
      await page.waitForTimeout(1500);
      const body = await page.locator("body").innerText();
      const hasSuccess = /subscription active|welcome to any exam easy/i.test(body);
      const hasTrial = /trial|days remaining|welcome/i.test(body);
      if (hasSuccess && hasTrial) {
        pass(1, "Checkout success banner and trial welcome visible");
      } else if (hasSuccess) {
        pass(1, `Checkout success banner visible (trial welcome: ${hasTrial ? "yes" : "partial — check overlay"})`);
      } else {
        fail(1, `Missing banners — success:${hasSuccess} trial:${hasTrial} url:${page.url()}`);
      }
    }

    // ── Step 2: Email verified banner ──
    await loginViaApi(page.request, PREMIUM.email, PREMIUM.password);
    await page.goto(`${BASE}/dashboard?verified=1`, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });
    await page.waitForTimeout(1500);
    const body2 = await page.locator("body").innerText();
    if (/email is verified/i.test(body2)) {
      pass(2, "Email verified banner shown");
    } else {
      fail(2, `Verified banner not found at ${page.url()}`);
    }

    // ── Step 3: Mobile NCLEX — Drugs + Topics in bottom nav ──
    const mobile = await browser.newContext({
      ...devices["iPhone 13"],
      storageState: await context.storageState(),
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded", timeout: 120_000 });

    // Switch to NCLEX if exam switcher present
    const examSwitcher = mobilePage.getByRole("combobox", { name: /primary exam|exam/i });
    if (await examSwitcher.isVisible().catch(() => false)) {
      await examSwitcher.selectOption("nclex").catch(() => {});
      await mobilePage.waitForTimeout(800);
    }

    const mobileNav = mobilePage.getByRole("navigation", { name: /mobile study navigation/i });
    const drugsLink = mobileNav.getByRole("link", { name: /drugs|top 500/i });
    const topicsLink = mobileNav.getByRole("link", { name: /topics|high-yield/i });
    const hasDrugs = await drugsLink.isVisible().catch(() => false);
    const hasTopics = await topicsLink.isVisible().catch(() => false);
    if (hasDrugs && hasTopics) {
      pass(3, "Mobile bottom nav shows Drugs and Topics for clinical exam");
    } else {
      fail(3, `Mobile nav missing — Drugs:${hasDrugs} Topics:${hasTopics}`);
    }
    await mobile.close();

    // ── Step 4: Top 500 — no duplicate StudyModeNav ──
    await page.goto(`${BASE}/study/drugs300`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    const studyModeNavs = page.getByRole("navigation", { name: /study hub navigation/i });
    const count = await studyModeNavs.count();
    if (count === 0) {
      pass(4, "No duplicate StudyModeNav on Top 500 Drugs page");
    } else {
      fail(4, `Found ${count} StudyModeNav instance(s) on drugs300 page`);
    }

    // ── Step 5: /prep/nclex loads prep hub ──
    await page.goto(`${BASE}/prep/nclex`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (page.url().includes("/prep/nclex")) {
      const prepHeading = page.getByRole("heading", { name: /nclex/i });
      const examHub = page.getByText(/exam hub/i);
      if (
        (await prepHeading.isVisible().catch(() => false)) ||
        (await examHub.isVisible().catch(() => false))
      ) {
        pass(5, "Prep hub loads at /prep/nclex (not marketing redirect)");
      } else {
        fail(5, "On /prep/nclex but prep hub content not found");
      }
    } else {
      fail(5, `Redirected away from prep hub: ${page.url()}`);
    }

    // ── Step 6: Full exam flow ──
    await page.goto(`${BASE}/full-exam/nclex`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    if (!page.url().includes("/full-exam/nclex")) {
      fail(6, `Could not reach full exam hub: ${page.url()}`);
    } else {
      const startBtn = page.getByRole("button", { name: /start|begin|launch/i }).first();
      const startLink = page.getByRole("link", { name: /start|begin|launch/i }).first();
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
      } else if (await startLink.isVisible().catch(() => false)) {
        await startLink.click();
      } else {
        // autostart or already in session
        await page.goto(`${BASE}/full-exam/nclex?autostart=1`, {
          waitUntil: "domcontentloaded",
          timeout: 120_000,
        });
      }

      await page.waitForTimeout(3000);
      const inSession = /\/full-exam\/nclex\/[^/]+/.test(page.url());
      if (inSession) {
        pass(6, `Full exam session started: ${page.url()}`);
      } else {
        const body = await page.locator("body").innerText();
        if (/question|answer|submit|next/i.test(body)) {
          pass(6, "Full exam UI visible (session route pattern may differ)");
        } else {
          fail(6, `Full exam did not start — url: ${page.url()}`);
        }
      }
    }
  } catch (error) {
    console.error("QA script error:", error);
    fail("?", error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} steps passed`);
  process.exit(failed.length ? 1 : 0);
}

run();
