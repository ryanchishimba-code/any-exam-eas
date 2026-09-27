import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

test.describe("Landing page", () => {
  test("hero, navigation, and primary CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(page.getByRole("heading", { name: "From doubtful to ready." })).toBeVisible();
    await expect(page.getByRole("link", { name: /start free trial/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /try a free question/i }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
    await expect(page.getByText(/prisca m\.|gerard n\./i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "A practice estimate." })).toBeAttached();
    await expect(page.getByText("NCLEX content review led by Ileen Chishimba, RN")).toBeAttached();
    await expect(
      page.getByText("5-day free trial · no payment method required · then $27.99/mo").first()
    ).toBeVisible();
    await expect(page.getByText(/\bno[- ]card\b/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /share your progress/i })).toHaveCount(0);
    await expect(
      page.getByRole("navigation", { name: /main navigation/i }).locator('a[href="/pricing"]')
    ).toHaveCount(1);
  });

  test("390px ATF does not overflow header or board chips", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".home-hero")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        pageOverflows: doc.scrollWidth > doc.clientWidth + 1,
        navOverflows: (() => {
          const nav = document.querySelector(".aee-nav-inner");
          return nav ? nav.scrollWidth > nav.clientWidth + 1 : true;
        })(),
      };
    });
    expect(overflow.pageOverflows, "homepage should not scroll horizontally at 390px").toBe(false);
    expect(overflow.navOverflows, "header row should not clip/overlap at 390px").toBe(false);
  });

  test("non-NCLEX board hubs use the premium dark hero", async ({ page }) => {
    await page.goto("/naplex", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-exam-hero="naplex"]')).toBeVisible();
    await expect(page.getByText(/active NAPLEX questions/i)).toBeVisible();
    await expect(
      page.getByText(/5-day free trial · no payment method required · then/i).first()
    ).toBeVisible();
    await expect(page.getByText(/\bno[- ]card\b/i)).toHaveCount(0);
  });

  test("signup CTA uses brand teal", async ({ page }) => {
    await page.goto("/signup?plan=trial&interval=monthly", { waitUntil: "domcontentloaded" });
    const submit = page.locator('button[type="submit"]').first();
    await expect(submit).toBeVisible();
    const bg = await submit.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg, `expected teal CTA, got ${bg}`).toMatch(
      /rgb\(\s*15,\s*118,\s*110\s*\)|rgb\(\s*13,\s*148,\s*136\s*\)|rgb\(\s*46,\s*231,\s*220\s*\)/
    );
  });

  test("trial CTA links to signup and signup page renders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trialCta = page.locator('a[href*="/signup?plan=trial"][href*="interval=monthly"]').first();
    await expect(trialCta).toBeVisible();
    await expect(trialCta).toHaveAttribute("href", /\/signup\?plan=trial.*interval=monthly/);

    const href = await trialCta.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /start your free trial/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/trial|payment|free/i).first()).toBeVisible();
  });

  test("FAQ stays a real page and the share control stays off the hero", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(page.getByRole("button", { name: /share your progress/i })).toHaveCount(0);
    await page.goto("/faq", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("landing hero passes axe checks", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-hero")).toBeVisible();
    await expectNoA11yViolations(page, {
      selector: ".home-hero",
      seriousOnly: true,
    });
  });
});
