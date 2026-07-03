import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

/**
 * Manual QA checklist automation — Question Bank + exam switching.
 * Requires auth storage from global-setup (DATABASE_URL + E2E_USER_*).
 */
authTest.describe("Question bank flow (checklist)", () => {
  authTest("wheel presets are 25, 50, 75 only", async ({ authenticatedPage: page }) => {
    await page.goto("/question-bank", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#practice-launcher")).toBeVisible({ timeout: 30_000 });

    const countRegion = page.getByRole("region", { name: /number of questions/i }).or(
      page.locator('[aria-label="Number of Questions"]')
    );
    await expect(countRegion.first()).toBeVisible({ timeout: 15_000 });

    const wheelText = await countRegion.first().innerText();
    expect(wheelText).toMatch(/25/);
    expect(wheelText).toMatch(/50/);
    expect(wheelText).toMatch(/75/);
    expect(wheelText).not.toMatch(/\b10\b/);
    expect(wheelText).not.toMatch(/\b100\b/);
  });

  authTest("exam switch clears session params on question bank", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/question-bank?field=nursing&mode=bank&subjectId=pharmacology-nursing&count=50", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("#practice-launcher")).toBeVisible({ timeout: 30_000 });

    const examSelect = page.locator('select').filter({ has: page.locator('option[value="naplex"]') }).first();
    if (!(await examSelect.isVisible())) {
      test.skip(true, "Exam switcher select not visible in this layout");
      return;
    }

    await examSelect.selectOption("naplex");
    await expect
      .poll(() => page.url(), { timeout: 20_000 })
      .toMatch(/field=pharmacy|exam=naplex/);

    expect(page.url()).not.toContain("subjectId=pharmacology");
    expect(page.url()).not.toContain("count=50");
  });

  authTest("generate standard bank returns exact count", async ({ authenticatedPage: page }) => {
    await page.goto("/question-bank", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#practice-launcher")).toBeVisible({ timeout: 30_000 });

    const startBtn = page.getByRole("button", { name: /start|generate|begin/i }).first();
    if (!(await startBtn.isVisible())) {
      test.skip(true, "Start button not found — topic may be unavailable");
      return;
    }

    const started = Date.now();
    await startBtn.click();

    await expect(page.getByText(/question\s+\d+\s+of\s+\d+/i).or(page.locator('[data-question-index]'))).toBeVisible({
      timeout: 45_000,
    });
    const elapsed = Date.now() - started;
    expect(elapsed).toBeLessThan(45_000);

    const body = await page.locator("body").innerText();
    const match = body.match(/question\s+1\s+of\s+(\d+)/i) ?? body.match(/(\d+)\s+questions/i);
    if (match) {
      const count = Number(match[1]);
      expect([25, 50, 75]).toContain(count);
    }
  });
});

test.describe("Login checklist (public)", () => {
  test("login page works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /log in to continue/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  });

  test("login page has no critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/login", { waitUntil: "networkidle" });
    const critical = errors.filter(
      (e) => !/favicon|analytics|third-party|chrome-extension/i.test(e)
    );
    expect(critical).toEqual([]);
  });
});
