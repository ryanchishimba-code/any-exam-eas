import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

test.describe("Landing page", () => {
  test("hero, navigation, and primary CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-landing-hero]")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /one study system\.?\s*six boards/i,
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
  });

  test("trial CTA links to signup and signup page renders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trialCta = page.locator('a[href*="/signup?plan=trial"][href*="interval=yearly"]').first();
    await expect(trialCta).toBeVisible();
    await expect(trialCta).toHaveAttribute("href", /\/signup\?plan=trial.*interval=yearly/);

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
