#!/usr/bin/env node
/**
 * Live production smoke: log in as dev user, run a 25-question NCLEX bank session.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=https://www.anyexameasy.com node scripts/qa-prod-nclex-25.mjs
 */
import { chromium } from "playwright";

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? "https://www.anyexameasy.com").replace(/\/$/, "");
const EMAIL = process.env.E2E_USER_EMAIL ?? "dev@anyexameasy.test";
const PASSWORD = process.env.E2E_USER_PASSWORD ?? "DevPassword1!";
const TARGET = 25;
const HEADLESS = process.env.HEADED !== "1";

function log(...args) {
  console.log(`[qa-prod-nclex-25]`, ...args);
}

async function login(page, context) {
  const csrfRes = await page.request.get(`${BASE}/api/auth/csrf`);
  if (!csrfRes.ok()) throw new Error(`CSRF failed: ${csrfRes.status()}`);
  const { csrfToken } = await csrfRes.json();
  if (!csrfToken) throw new Error("Missing CSRF token");

  const loginRes = await page.request.post(`${BASE}/api/auth/callback/credentials`, {
    form: {
      csrfToken,
      email: EMAIL,
      password: PASSWORD,
      callbackUrl: `${BASE}/dashboard`,
      json: "true",
    },
  });
  if (loginRes.status() >= 400) {
    throw new Error(`Login failed: ${loginRes.status()} ${(await loginRes.text()).slice(0, 200)}`);
  }

  const sessionRes = await page.request.get(`${BASE}/api/auth/session`);
  const session = await sessionRes.json();
  if (!session?.user?.email) throw new Error("No session after login");
  log("logged in as", session.user.email);

  const storage = await page.request.storageState();
  await context.addCookies(storage.cookies);
}

async function waitForSession(page) {
  await page.getByRole("button", { name: /end activity/i }).waitFor({ timeout: 90_000 });
  await page.getByRole("progressbar", { name: /session progress/i }).waitFor({ timeout: 15_000 });
  await page.getByRole("button", { name: /^check$/i }).waitFor({ timeout: 30_000 });
}

async function progressValue(page) {
  const bar = page.getByRole("progressbar", { name: /session progress/i });
  return Number((await bar.getAttribute("aria-valuenow")) ?? "0");
}

async function startSession(page) {
  const url =
    `${BASE}/question-bank?mode=bank&field=nursing` +
    `&subjectId=management-of-care&count=${TARGET}&pace=untimed&style=standard`;
  log("opening", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });

  if (
    await page
      .getByRole("button", { name: /end activity/i })
      .isVisible({ timeout: 8_000 })
      .catch(() => false)
  ) {
    log("session already active after navigation");
    await waitForSession(page);
    log("progress%", await progressValue(page));
    return;
  }

  const unavailable = page.getByRole("heading", { name: /question bank unavailable/i });
  if (await unavailable.isVisible({ timeout: 2_000 }).catch(() => false)) {
    log("unavailable UI — try again");
    await page.getByRole("button", { name: /try again/i }).click();
    await page.waitForTimeout(1500);
  }

  const launcher = page.locator("#practice-launcher");
  await launcher.waitFor({ state: "visible", timeout: 60_000 });

  const standard = page.getByRole("button", { name: /^standard$/i });
  if (await standard.isVisible().catch(() => false)) await standard.click();

  const start = page.getByRole("button", { name: /start (standard|adaptive|practice|session)|start .*25/i });
  const btn = (await start.count()) > 0 ? start.first() : page.getByRole("button", { name: /start/i }).first();
  await btn.waitFor({ state: "visible", timeout: 30_000 });
  log("clicking start");
  await btn.click();
  await waitForSession(page);
  log("session started — progress%", await progressValue(page));
}

async function pickOption(page) {
  const options = page.locator("article button").filter({
    hasNotText: /^(check|next|back|flag|report|show|view|upgrade|share|end activity|esc|\d)$/i,
  });
  const count = await options.count();
  if (count > 0) {
    await options.nth(Math.min(1, count - 1)).click();
    return;
  }
  const fallback = page.locator("article ul button, article li button");
  if ((await fallback.count()) === 0) throw new Error("no options found");
  await fallback.first().click();
}

async function answerCurrent(page, index) {
  await pickOption(page);

  const check = page.getByRole("button", { name: /^check$/i });
  await check.waitFor({ state: "visible", timeout: 15_000 });
  if (!(await check.isDisabled())) await check.click();

  // Rationale render — prior crash site.
  await page
    .getByText(/correct|incorrect|rationale|why this answer|explanation/i)
    .first()
    .waitFor({ timeout: 45_000 })
    .catch(() => {});

  if (await page.getByRole("heading", { name: /question bank unavailable/i }).isVisible().catch(() => false)) {
    throw new Error(`Q${index}: crashed into Question bank unavailable after Check`);
  }

  const conf = page.locator("button").filter({ hasText: /^[1-5]$/ });
  if (await conf.first().isVisible({ timeout: 800 }).catch(() => false)) {
    await conf.nth(2).click().catch(() => {});
  }

  if (index < TARGET) {
    const before = await progressValue(page);
    await page.getByRole("button", { name: /^next$/i }).click();
    await page.waitForFunction(
      (prev) => {
        const el = document.querySelector('[role="progressbar"][aria-label="Session progress"]');
        return el ? Number(el.getAttribute("aria-valuenow") || "0") > prev : false;
      },
      before,
      { timeout: 30_000 }
    );
  } else {
    const next = page.getByRole("button", { name: /^next$/i });
    if (await next.isVisible().catch(() => false)) await next.click().catch(() => {});
  }
}

async function main() {
  log("base", BASE);
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);

  const errors = [];
  page.on("pageerror", (err) => {
    errors.push(err.message);
    log("pageerror", err.message);
  });

  try {
    await login(page, context);
    await startSession(page);

    for (let i = 1; i <= TARGET; i++) {
      log(`answering ${i}/${TARGET} (progress ${await progressValue(page)}%)`);
      await answerCurrent(page, i);
    }

    await page.waitForTimeout(1200);
    const body = await page.locator("body").innerText();
    const completed = /session complete|great work|accuracy|review answers|completed|score/i.test(body);
    log("completion UI?", completed, "final progress%", await progressValue(page).catch(() => -1));

    const crash = errors.find((e) => /length|cannot read properties of undefined/i.test(e));
    if (crash) throw new Error(`Runtime error: ${crash}`);

    log(`PASS — walked ${TARGET} NCLEX bank questions on production`);
    process.exitCode = 0;
  } catch (error) {
    log("FAIL", error instanceof Error ? error.message : error);
    await page.screenshot({ path: "tmp/qa-prod-nclex-25-fail.png", fullPage: true }).catch(() => {});
    log("screenshot tmp/qa-prod-nclex-25-fail.png");
    if (errors.length) log("pageerrors", errors.slice(0, 5));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
