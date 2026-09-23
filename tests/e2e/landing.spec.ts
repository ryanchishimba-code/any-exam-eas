import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

test.describe("Landing page", () => {
  test("hero, navigation, and primary CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-landing-hero]")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /nclex prep that feels like the real exam/i,
      })
    ).toBeVisible();
    await expect(page.locator("[data-hero-practice]")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /try a free question/i }).or(
        page.getByRole("link", { name: /start.*trial|try.*free|continue/i })
      ).first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /pricing/i }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
    await expect(page.getByText(/prisca m\.|gerard n\./i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /roadmap\. deep dive\. sample ngn/i })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /main navigation/i }).locator('a[href="/pricing"]')
    ).toHaveCount(1);
  });

  test("390px ATF does not overflow header or board chips", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-landing-hero]")).toBeVisible();
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
    await expect(page.getByText(/5-day free trial · no card · then/i).first()).toBeVisible();
  });

  test("signup CTA uses brand teal", async ({ page }) => {
    await page.goto("/signup?plan=trial&interval=monthly", { waitUntil: "domcontentloaded" });
    const submit = page.locator('button[type="submit"]').first();
    await expect(submit).toBeVisible();
    const bg = await submit.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg, `expected teal CTA, got ${bg}`).toMatch(/rgb\(\s*13,\s*148,\s*136\s*\)|rgb\(\s*46,\s*231,\s*220\s*\)/);
  });

  test("trial CTA links to signup and signup page renders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trialCta = page.locator('a[href*="/signup?plan=trial"][href*="interval=monthly"]').first();
    await expect(trialCta).toBeVisible();
    await expect(trialCta).toHaveAttribute("href", /\/signup\?plan=trial.*interval=monthly/);

    const href = await trialCta.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/trial|payment|free/i).first()).toBeVisible();
  });

  test("sticky CTA appears after scrolling past the hero", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-landing-hero]")).toBeVisible();
    await expect(page.locator(".aee-landing-sticky-cta")).toHaveCount(0);

    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await expect(page.locator(".aee-landing-sticky-cta")).toBeVisible({ timeout: 10_000 });
  });

  test("landing hero passes axe checks", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-landing-hero], .aee-hero-beat").first()).toBeVisible();
    await expectNoA11yViolations(page, {
      selector: "[data-landing-hero], .aee-hero-beat",
      seriousOnly: true,
    });
  });
});
