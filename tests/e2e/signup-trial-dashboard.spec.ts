import { test, expect } from "@playwright/test";
import { test as authTest, hasAuthStorage } from "./fixtures/auth";
import { acceptSignupTerms } from "./helpers/forms";

/**
 * Card-free trial: signup form → account → dashboard. No Checkout charge.
 * Full Stripe wallet flows stay in scripts/test-payments.mjs.
 */
test.describe("Signup → trial → dashboard", () => {
  test("trial signup surfaces plan disclosure and lands in the app", async ({ page }) => {
    const uniqueEmail = `e2e-trial-${Date.now()}@example.com`;

    await page.goto("/signup?plan=trial&exam=nclex", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/free trial|\$0|no payment method required/i).first()).toBeVisible();
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByRole("textbox", { name: "Password", exact: true }).fill("E2eTrialPass1!");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/preparing for nclex/i)).toBeVisible();
    await page.getByLabel("First name").fill("E2E");
    await page.getByLabel("Last name").fill("Trial");
    await acceptSignupTerms(page);

    const submit = page.getByRole("button", { name: /start.*trial|create account/i });
    await expect(submit).toBeEnabled();
    await submit.click();

    await expect
      .poll(
        async () => /\/(dashboard|select-exam)/.test(page.url()),
        { timeout: 120_000 }
      )
      .toBe(true);
    expect(page.url()).not.toContain("/checkout");
  });

  test("a signed-out trial checkout opens the signup form, not a charge due today", async ({ page }) => {
    await page.goto("/checkout?plan=trial&interval=monthly&tier=pro", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/signup\?/);
    await expect(page.getByRole("heading", { name: "Start your free trial." })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByText("Due today")).toHaveCount(0);
    await expect(page.locator("form")).toHaveAttribute("data-signup-plan", "trial");
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
