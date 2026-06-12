import { test, expect } from "@playwright/test";
import { DEV_USER, loginWithCredentials } from "./fixtures/auth";
import { isAuthBackendReady } from "./helpers/auth-health";

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /log in to continue/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  });

  test("dev user can log in and reach dashboard", async ({ page }) => {
    test.skip(!(await isAuthBackendReady(page)), "Auth backend not configured (DATABASE_URL)");
    await loginWithCredentials(page, DEV_USER.email, DEV_USER.password);
    await expect(page).toHaveURL(/\/(dashboard|select-exam|study-hub|onboarding)/);
  });

  test("login page exposes forgot-password entry point", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /forgot password/i })).toBeVisible();
  });

  test("forgot password page submits reset request", async ({ page }) => {
    await page.goto("/auth/forgot-password", { waitUntil: "domcontentloaded" });
    await page.getByLabel(/email address/i).fill("recover@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(
      page.getByText(/if an account exists, a password reset link has been sent/i)
    ).toBeVisible({ timeout: 30_000 });
  });

  test("signup form blocks submit until terms are accepted", async ({ page }) => {
    await page.goto("/signup?plan=trial");
    await page.getByPlaceholder("Full name").fill("QA Tester");
    await page.getByPlaceholder("Email").fill(`qa-${Date.now()}@example.com`);
    await page.getByPlaceholder(/password/i).fill("TestPassword1!");
    await page.locator('input[type="date"]').fill("1995-06-15");

    const submit = page.getByRole("button", { name: /start.*trial|create account/i });
    await expect(submit).toBeDisabled();

    await page.getByRole("checkbox").check();
    await expect(submit).toBeEnabled();
  });
});
