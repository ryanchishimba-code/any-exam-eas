#!/usr/bin/env node
/**
 * Live production smoke: 25-question bank session across every board exam.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=https://www.anyexameasy.com node scripts/qa-prod-all-boards-25.mjs
 *
 * Optional:
 *   BOARDS=nclex,naplex  — subset
 *   HEADED=1             — show browser
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { neon } from "@neondatabase/serverless";

const BASE = (process.env.PLAYWRIGHT_BASE_URL ?? "https://www.anyexameasy.com").replace(/\/$/, "");
const EMAIL = process.env.E2E_USER_EMAIL ?? "dev@anyexameasy.test";
const PASSWORD = process.env.E2E_USER_PASSWORD ?? "DevPassword1!";
const TARGET = 25;
const HEADLESS = process.env.HEADED !== "1";

/** All primary boards (+ each USMLE step). MPJE is not a selectable exam slug. */
const ALL_BOARDS = [
  {
    id: "nclex",
    examSlug: "nclex",
    fieldId: "nursing",
    subjectId: "pharmacology-nursing",
  },
  {
    id: "naplex",
    examSlug: "naplex",
    fieldId: "pharmacy",
    subjectId: "patient-counseling",
  },
  {
    id: "usmle-step-1",
    examSlug: "usmle",
    fieldId: "usmle-step-1",
    subjectId: "biochemistry",
    usmleFieldId: "usmle-step-1",
  },
  {
    id: "usmle-step-2",
    examSlug: "usmle",
    fieldId: "usmle-step-2",
    subjectId: "pediatrics",
    usmleFieldId: "usmle-step-2",
  },
  {
    id: "usmle-step-3",
    examSlug: "usmle",
    fieldId: "usmle-step-3",
    subjectId: "internal-medicine",
    usmleFieldId: "usmle-step-3",
  },
  {
    id: "pance",
    examSlug: "pance",
    fieldId: "pance",
    subjectId: "cardiovascular",
  },
  {
    id: "aanp-fnp",
    examSlug: "aanp-fnp",
    fieldId: "aanp-fnp",
    subjectId: "cardiovascular",
  },
  {
    id: "npte-pt",
    examSlug: "npte-pt",
    fieldId: "npte-pt",
    subjectId: "cardiovascular-pulmonary",
  },
];

function log(...args) {
  console.log(`[qa-prod-all-boards-25]`, ...args);
}

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  for (const file of [".env.local", ".env"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^DATABASE_URL=(.+)$/);
      if (!m) continue;
      let v = m[1].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return v;
    }
  }
  return null;
}

function selectedBoards() {
  const filter = process.env.BOARDS?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!filter?.length) return ALL_BOARDS;
  return ALL_BOARDS.filter((b) => filter.includes(b.id));
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
  if (!session?.user?.id) throw new Error("No session after login");
  log("logged in as", session.user.email, session.user.id);

  const storage = await page.request.storageState();
  await context.addCookies(storage.cookies);
  return session.user.id;
}

async function setExamPreference(page, examSlug) {
  const res = await page.request.post(`${BASE}/api/user/exam-preference`, {
    data: { examSlug },
  });
  if (!res.ok()) {
    throw new Error(`exam-preference ${examSlug}: ${res.status()} ${(await res.text()).slice(0, 200)}`);
  }
}

async function setUsmleFieldId(sql, userId, usmleFieldId) {
  const rows = await sql`
    SELECT metadata FROM "UserPreference" WHERE "userId" = ${userId} LIMIT 1
  `;
  let meta = {};
  if (rows[0]?.metadata) {
    try {
      meta = typeof rows[0].metadata === "string" ? JSON.parse(rows[0].metadata) : rows[0].metadata;
    } catch {
      meta = {};
    }
  }
  meta.usmleFieldId = usmleFieldId;
  const json = JSON.stringify(meta);
  await sql`
    INSERT INTO "UserPreference" ("userId", metadata, "updatedAt")
    VALUES (${userId}, ${json}, NOW())
    ON CONFLICT ("userId") DO UPDATE
    SET metadata = ${json}, "updatedAt" = NOW()
  `;
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

async function startSession(page, board) {
  const url =
    `${BASE}/question-bank?mode=bank&field=${encodeURIComponent(board.fieldId)}` +
    `&subjectId=${encodeURIComponent(board.subjectId)}&count=${TARGET}&pace=untimed&style=standard`;
  log(board.id, "opening", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });

  if (/select-exam|login/i.test(page.url()) && !/question-bank/.test(page.url())) {
    throw new Error(`${board.id}: redirected to ${page.url()}`);
  }

  if (
    await page
      .getByRole("button", { name: /end activity/i })
      .isVisible({ timeout: 8_000 })
      .catch(() => false)
  ) {
    await waitForSession(page);
    return;
  }

  if (await page.getByRole("heading", { name: /question bank unavailable/i }).isVisible({ timeout: 2_000 }).catch(() => false)) {
    await page.getByRole("button", { name: /try again/i }).click();
    await page.waitForTimeout(1500);
  }

  await page.locator("#practice-launcher").waitFor({ state: "visible", timeout: 60_000 });

  const standard = page.getByRole("button", { name: /^standard$/i });
  if (await standard.isVisible().catch(() => false)) await standard.click();

  // Ensure a topic with a pool is selected (counts can lag after exam switch).
  const start = page.getByRole("button", { name: /start (standard|adaptive|practice|session)|start .*25/i });
  const btn = (await start.count()) > 0 ? start.first() : page.getByRole("button", { name: /start/i }).first();
  await btn.waitFor({ state: "visible", timeout: 30_000 });

  if (await btn.isDisabled()) {
    const topic = page
      .getByRole("option")
      .filter({ hasText: new RegExp(board.subjectId.replace(/-/g, "[- ]"), "i") })
      .first();
    if (await topic.isVisible().catch(() => false)) await topic.click();
    else {
      const mixed = page.getByRole("option", { name: /mixed topics/i });
      if (await mixed.isVisible().catch(() => false)) await mixed.click();
      else {
        const any = page.getByRole("option").nth(1);
        if (await any.isVisible().catch(() => false)) await any.click();
      }
    }
    await page.waitForTimeout(800);
  }

  if (await btn.isDisabled()) {
    throw new Error(`${board.id}: Start disabled — subject pool may be empty`);
  }
  await btn.click();
  await waitForSession(page);
  log(board.id, "session started — progress%", await progressValue(page));
}

async function pickOption(page) {
  const shortAnswer = page.locator("article textarea, article input[type='text']").first();
  if (await shortAnswer.isVisible().catch(() => false)) {
    await shortAnswer.fill("therapeutic levels");
    return;
  }

  // NGN matrix / bowtie: option chips often live outside plain ul/ol lists.
  const listOptions = page.locator("article ul button, article ol button");
  const chipOptions = page.locator("article button").filter({
    hasNotText:
      /^(check|next|back|flag|report|show|view|upgrade|share|end activity|esc|study this topic|explore|why this question|\d+)$/i,
  });

  if ((await listOptions.count()) > 0) {
    await listOptions.first().click();
    const body = (await page.locator("article").innerText()).toLowerCase();
    if (/select all|all that apply|priority order|ordered|select one action|conditions to monitor/.test(body)) {
      const n = await listOptions.count();
      for (let i = 1; i < Math.min(n, 3); i++) {
        await listOptions.nth(i).click().catch(() => {});
      }
    }
    return;
  }

  if ((await chipOptions.count()) > 0) {
    const body = (await page.locator("article").innerText()).toLowerCase();
    const need = /select all|all that apply|conditions to monitor|select one action|bowtie|matrix/.test(body)
      ? Math.min(await chipOptions.count(), 3)
      : 1;
    for (let i = 0; i < need; i++) {
      await chipOptions.nth(i).click().catch(() => {});
    }
    return;
  }

  await page.keyboard.press("1");
}

async function clickCheck(page) {
  const check = page.getByRole("button", { name: /^check$/i });
  await check.waitFor({ state: "visible", timeout: 15_000 });
  await page
    .waitForFunction(
      () => {
        const buttons = [...document.querySelectorAll("button")];
        const checkBtn = buttons.find((b) => /^check$/i.test(b.textContent?.trim() ?? ""));
        return checkBtn && !checkBtn.disabled;
      },
      null,
      { timeout: 10_000 }
    )
    .catch(() => {});
  if (!(await check.isDisabled())) await check.click();
}

async function waitReveal(page, boardId, label) {
  await page
    .getByText(/correct|incorrect|rationale|why this answer|explanation|key takeaway/i)
    .first()
    .waitFor({ timeout: 45_000 })
    .catch(() => {});

  if (await page.getByRole("heading", { name: /question bank unavailable/i }).isVisible().catch(() => false)) {
    throw new Error(`${boardId} ${label}: crashed into Question bank unavailable`);
  }

  const conf = page.locator("button").filter({ hasText: /^[1-5]$/ });
  if (await conf.first().isVisible({ timeout: 600 }).catch(() => false)) {
    await conf.nth(2).click().catch(() => {});
  }
}

async function clickNextEnabled(page) {
  const next = page.getByRole("button", { name: /^next$/i });
  await next.waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForFunction(
    () => {
      const buttons = [...document.querySelectorAll("button")];
      const n = buttons.find((b) => /^next$/i.test(b.textContent?.trim() ?? ""));
      return n && !n.disabled;
    },
    null,
    { timeout: 15_000 }
  );
  await next.click();
}

/**
 * After Next: either session progress advances (next bank item) or Check returns
 * (NGN case-study sub-screen at the same progress %).
 */
async function waitAdvanced(page, beforeProgress) {
  await page.waitForFunction(
    (prev) => {
      const el = document.querySelector('[role="progressbar"][aria-label="Session progress"]');
      const now = el ? Number(el.getAttribute("aria-valuenow") || "0") : 0;
      if (now > prev) return true;

      const buttons = [...document.querySelectorAll("button")];
      const check = buttons.find((b) => /^check$/i.test(b.textContent?.trim() ?? ""));
      if (!check || check.disabled) return false;

      // Unanswered screen: result labels from the prior reveal should be gone.
      const body = document.body?.innerText ?? "";
      return !/\bIncorrect\b/.test(body) && !/\bCorrect\b/.test(body);
    },
    beforeProgress,
    { timeout: 30_000 }
  );
}

async function answerScreen(page, boardId, label) {
  await pickOption(page);
  await clickCheck(page);
  await waitReveal(page, boardId, label);
}

async function runBoard(page, board) {
  const errors = [];
  const onError = (err) => errors.push(err.message);
  page.on("pageerror", onError);

  try {
    await startSession(page, board);

    // Walk TARGET bank items. Case studies may take multiple Check/Next screens
    // at the same progress value before the bar advances.
    for (let q = 1; q <= TARGET; q++) {
      let screen = 0;
      while (true) {
        screen += 1;
        if (screen > 12) throw new Error(`${board.id} Q${q}: too many case screens without progress`);
        log(board.id, `answering ${q}/${TARGET}` + (screen > 1 ? ` (case screen ${screen})` : ""));
        await answerScreen(page, board.id, `Q${q}s${screen}`);

        if (q === TARGET) {
          const next = page.getByRole("button", { name: /^next$/i });
          if (await next.isVisible().catch(() => false) && !(await next.isDisabled())) {
            await next.click().catch(() => {});
          }
          break;
        }

        const before = await progressValue(page);
        await clickNextEnabled(page);
        await waitAdvanced(page, before);
        const after = await progressValue(page);
        if (after > before) break; // next bank question
        // else continue this case study at the same progress
      }
    }

    await page.waitForTimeout(800);
    const crash = errors.find((e) => /length|cannot read properties of undefined/i.test(e));
    if (crash) throw new Error(crash);
    return { id: board.id, ok: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const shot = `tmp/qa-prod-${board.id}-fail.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    return { id: board.id, ok: false, error: msg, screenshot: shot };
  } finally {
    page.off("pageerror", onError);
    const end = page.getByRole("button", { name: /end activity/i });
    if (await end.isVisible().catch(() => false)) {
      await end.click().catch(() => {});
      const confirm = page.getByRole("button", { name: /end|confirm|yes/i });
      if (await confirm.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
        await confirm.first().click().catch(() => {});
      }
    }
  }
}

async function main() {
  const boards = selectedBoards();
  log("base", BASE);
  log("boards", boards.map((b) => b.id).join(", "));

  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) throw new Error("DATABASE_URL required to set USMLE step metadata");
  const sql = neon(databaseUrl);

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45_000);

  const results = [];
  try {
    const userId = await login(page, context);

    for (const board of boards) {
      log("========", board.id, "========");
      await setExamPreference(page, board.examSlug);
      if (board.usmleFieldId) {
        await setUsmleFieldId(sql, userId, board.usmleFieldId);
        log(board.id, "usmleFieldId", board.usmleFieldId);
      }
      // Preference cache is short; small pause helps multi-instance L1 expire.
      await page.waitForTimeout(1200);
      const result = await runBoard(page, board);
      results.push(result);
      log(board.id, result.ok ? "PASS" : `FAIL: ${result.error}`);
    }
  } finally {
    await browser.close();
  }

  console.log("\n=== RESULTS ===");
  for (const r of results) {
    console.log(r.ok ? `PASS  ${r.id}` : `FAIL  ${r.id} — ${r.error}`);
  }
  const failed = results.filter((r) => !r.ok);
  log(`done: ${results.length - failed.length}/${results.length} passed`);
  process.exitCode = failed.length ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
