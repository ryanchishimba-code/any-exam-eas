#!/usr/bin/env node
/**
 * Full exam E2E: launcher → session → review → results.
 * Usage: node scripts/qa-full-exam-flow.mjs
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.QA_USER_EMAIL ?? "test-premium@anyexameasy.test";
const PASSWORD = process.env.QA_USER_PASSWORD ?? "TestLogin1!";
const EXAM = process.env.QA_EXAM_SLUG ?? "nclex";
const OUT = "scripts/qa-screenshots";
const MAX_ANSWER = Number(process.env.QA_MAX_QUESTIONS ?? "50");

async function waitForServer(request, attempts = 30) {
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
      callbackUrl: `${BASE}/dashboard`,
      json: "true",
    },
  });
  if (res.status() >= 400) throw new Error(`Login failed: ${res.status()}`);
  const session = await request.get(`${BASE}/api/auth/session`).then((r) => r.json());
  if (!session?.user?.email) throw new Error("No session after login");
}

async function answerCurrentQuestion(page) {
  const option = page.locator("article li button").first();
  if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
    await option.click();
    return true;
  }
  const anyOption = page.locator("article button.rounded-xl").first();
  if (await anyOption.isVisible({ timeout: 2000 }).catch(() => false)) {
    await anyOption.click();
    return true;
  }
  return false;
}

async function endExamEarly(page) {
  const endBtn = page.getByRole("button", { name: /^End exam$/i });
  if (!(await endBtn.isVisible({ timeout: 3000 }).catch(() => false))) return false;
  await endBtn.click();
  const confirm = page.getByRole("button", { name: /^End exam$/i }).last();
  await confirm.click({ timeout: 5000 });
  return true;
}

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const log = (msg) => console.log(msg);

  try {
    await login(page.request);
    log("→ Logged in");

    const launchUrl = `${BASE}/full-exam/${EXAM}?preset=50&autostart=1&timed=0`;
    await page.goto(launchUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });

    await page.waitForURL(
      (url) => /\/full-exam\/[^/]+\/[^/?#]+/.test(url.pathname) && !url.pathname.endsWith("/results"),
      { timeout: 120_000 }
    );
    const sessionUrl = page.url();
    log(`→ Session started: ${sessionUrl}`);

    await page.waitForSelector("article li button, article button.rounded-xl", {
      timeout: 120_000,
    });
    await page.waitForFunction(
      () => !document.body.innerText.includes("Loading questions"),
      { timeout: 120_000 }
    ).catch(() => {});

    const totalMatch = await page.locator("body").innerText().then((t) => t.match(/(\d+)\s*\/\s*(\d+)/));
    const totalQuestions = totalMatch ? Number(totalMatch[2]) : MAX_ANSWER;
    const cap = Math.min(totalQuestions, MAX_ANSWER);
    log(`→ ${cap} questions in session (${totalQuestions} loaded)`);

    let answered = 0;

    for (let i = 0; i < cap; i++) {
      await answerCurrentQuestion(page);
      answered++;

      const reviewBtn = page.locator("footer").getByRole("button", { name: /Review & submit/i });
      if (await reviewBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await reviewBtn.click();
        log(`→ Reached final question after ${answered} answers`);
        break;
      }

      const nextBtn = page.locator("footer").getByRole("button", { name: /Next/i });
      await nextBtn.waitFor({ state: "visible", timeout: 10_000 });
      await nextBtn.click();
      await page.waitForTimeout(100);

      if ((i + 1) % 10 === 0) log(`  … answered ${i + 1}/${cap}`);
    }

    if (!(await page.getByText(/Review before submit/i).isVisible().catch(() => false))) {
      const lastNav = page.locator("aside").getByRole("button", { name: String(totalQuestions) }).first();
      if (await lastNav.isVisible({ timeout: 3000 }).catch(() => false)) {
        await lastNav.click();
        await answerCurrentQuestion(page);
        log(`→ Jumped to question ${totalQuestions}`);
      }
      const reviewBtn = page.locator("footer").getByRole("button", { name: /Review & submit/i });
      if (await reviewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await reviewBtn.click();
        log("→ Opened review screen from final question");
      }
    }

    if (!(await page.getByText(/Review before submit/i).isVisible().catch(() => false))) {
      log("→ Falling back to end exam early");
      await endExamEarly(page);
    }

    const onReview = await page.getByText(/Review before submit/i).isVisible({ timeout: 15_000 }).catch(() => false);
    if (onReview) {
      log("→ Review screen");
      await page.screenshot({ path: `${OUT}/full-exam-review.png`, fullPage: false });
      const submitBtn = page.getByRole("button", { name: /^Submit exam$/i });
      await submitBtn.click();
      log("→ Submitted exam");
    } else {
      log("→ Ended exam early (skipped review screen)");
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await page.waitForURL(/\/results/, { timeout: 60_000 });
        break;
      } catch {
        await waitForServer(page.request, 15);
        if (/\/full-exam\/[^/]+\/[^/]+\/results/.test(page.url())) break;
        if (attempt === 4) throw new Error("Timed out waiting for results after submit");
        await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
      }
    }
    log(`→ Results page: ${page.url()}`);

    await page.waitForTimeout(1500);
    const body = await page.locator("body").innerText();
    const hasScore = /\d{1,3}%|score|correct/i.test(body);
    const hasInsights = /insight|weak|topic|review/i.test(body);
    const hasDashboardLink = /dashboard|study hub|retake|try again/i.test(body);

    await page.screenshot({ path: `${OUT}/full-exam-results.png`, fullPage: true });

    if (!hasScore) throw new Error("Results page missing score");
    log(`✓ Full exam flow complete — score visible, insights:${hasInsights}, nav:${hasDashboardLink}`);
    process.exit(0);
  } catch (error) {
    await page.screenshot({ path: `${OUT}/full-exam-error.png`, fullPage: true }).catch(() => {});
    console.error("✗ Full exam flow failed:", error instanceof Error ? error.message : error);
    console.error("  Last URL:", page.url());
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
