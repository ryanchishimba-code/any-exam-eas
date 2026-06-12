import { test, expect } from "@playwright/test";
import { test as authTest, hasAuthStorage } from "./fixtures/auth";
import { acceptSignupTerms, fillDateOfBirth } from "./helpers/forms";

/**
 * Critical revenue path: signup intent → checkout → authenticated study hub.
 * Full Stripe wallet flows (Apple Pay / Google Pay) require live Stripe keys and
 * are covered in scripts/test-payments.mjs; here we validate UI gates and redirects.
 */
test.describe("Signup → trial → dashboard", () => {
  test("trial signup surfaces plan disclosure and routes toward checkout", async ({ page }) => {
    const uniqueEmail = `e2e-trial-${Date.now()}@example.com`;

    await page.goto("/signup?plan=trial", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/add payment|free trial|\$0/i).first()).toBeVisible();
    await page.getByPlaceholder("Full name").fill("E2E Trial User");
    await page.getByPlaceholder("Email").fill(uniqueEmail);
    await page.getByPlaceholder(/password/i).fill("E2eTrialPass1!");
    await fillDateOfBirth(page, "1992-03-20");
    await acceptSignupTerms(page);

    const submit = page.getByRole("button", { name: /start.*trial|create account|continue/i });
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect
      .poll(
        async () => /\/(checkout|dashboard|select-exam)/.test(page.url()),
        { timeout: 120_000 }
      )
      .toBe(true);
  });

  test("checkout page exposes Stripe payment element when configured", async ({ page }) => {
    test.skip(!process.env.STRIPE_SECRET_KEY, "Stripe not configured in this environment");

    await page.goto("/checkout?plan=trial", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/payment|checkout|subscribe|trial/i).first()).toBeVisible();
    await expect(
      page.locator('[data-testid="embedded-checkout"], iframe[name*="stripe"], .StripeElement').first()
    ).toBeVisible({ timeout: 30_000 });
  });

  authTest("authenticated trial user lands on dashboard with study navigation", async ({
    authenticatedPage: page,
  }) => {
    test.skip(!hasAuthStorage(), "Auth storage missing");

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: /question bank|practice|study/i }).first()
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/progress|practice|weak/i).first()).toBeVisible();
  });
});
