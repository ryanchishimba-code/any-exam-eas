#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.QA_USER_EMAIL ?? "test-premium@anyexameasy.test";
const PASSWORD = process.env.QA_USER_PASSWORD ?? "TestLogin1!";

async function login(request) {
  const csrf = await request.get(`${BASE}/api/auth/csrf`).then((r) => r.json());
  const res = await request.post(`${BASE}/api/auth/callback/credentials`, {
    form: {
      csrfToken: csrf.csrfToken,
      email: EMAIL,
      password: PASSWORD,
      callbackUrl: `${BASE}/dashboard`,
      json: "true",
    },
    maxRedirects: 0,
  });
  if (res.status() >= 400) throw new Error(`Login failed: ${res.status()}`);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();
await login(page.request);

const url = `${BASE}/question-bank?field=nursing&mode=bank&subjectId=pharmacology-nursing&count=10&style=standard`;
console.log("Navigating:", url);
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2000);

const selectedOnLoad = page.locator('[role="option"][aria-selected="true"]');
console.log("URL on load:", page.url());
console.log("Selected on load:", await selectedOnLoad.first().textContent().catch(() => "none"));

const topicButtons = page.locator('[role="listbox"] button[role="option"]');
const count = await topicButtons.count();
console.log("Topic buttons:", count);

const selected = page.locator('[role="option"][aria-selected="true"]');
console.log("Selected topic text:", await selected.first().textContent().catch(() => "none"));

// Click a different topic
const psych = page.getByRole("option", { name: /Psychosocial/i });
if (await psych.count()) {
  await psych.first().click();
  await page.waitForURL(/subjectId=psychosocial/, { timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(1000);
  console.log("After click URL:", page.url());
  console.log("Selected after click:", await selected.first().textContent().catch(() => "none"));
}

const startBtn = page.getByRole("button", { name: /Start/i });
console.log("Start disabled:", await startBtn.isDisabled().catch(() => "missing"));

if (!(await startBtn.isDisabled())) {
  await startBtn.click();
  await page.waitForTimeout(3000);
  console.log("After start URL:", page.url());
  const sessionText = await page.locator("body").innerText();
  console.log("Has question stem:", /question|client|nurse|priority/i.test(sessionText.slice(0, 2000)));
  console.log("Error visible:", /Could not|No questions|Choose a topic/i.test(sessionText));
}

await browser.close();
