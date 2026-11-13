import { test, expect } from "@playwright/test";
import { DEV_USER, loginWithCredentials } from "./fixtures/auth";
import { isAuthBackendReady } from "./helpers/auth-health";
import { fillControlledInput } from "./helpers/forms";

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
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
    const email = page.getByLabel(/email address/i);
    // Typing before hydration leaves the controlled value empty and the submit
    // reports "Enter your email address" without calling the API.
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="email"]');
      if (!(input instanceof HTMLInputElement)) return false;
      return Object.keys(input).some(
        (key) => key.startsWith("__reactProps") || key.startsWith("__reactFiber")
      );
    });
    await fillControlledInput(email, "recover@example.com");
    const send = page.getByRole("button", { name: /send reset link/i });
    await expect(send).toBeEnabled();
    await expect(email).toHaveValue("recover@example.com");
    const submitted = page.waitForResponse(
      (res) => res.url().includes("/api/auth/forgot-password") && res.request().method() === "POST",
      { timeout: 30_000 }
    );
    await send.click();
    expect((await submitted).ok()).toBeTruthy();
    await expect(
      page.getByText(/if an account exists, a password reset link has been sent/i)
    ).toBeVisible({ timeout: 30_000 });
  });

  test("signup form blocks submit until terms are accepted", async ({ page }) => {
    await page.goto("/signup?plan=trial&exam=nclex");
    await page.getByLabel("Email").fill(`qa-${Date.now()}@example.com`);
    await page.getByRole("textbox", { name: "Password", exact: true }).fill("TestPassword1!");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("First name").fill("QA");
    await page.getByLabel("Last name").fill("Tester");

    const submit = page.getByRole("button", { name: /start.*trial|create account/i });
    await submit.click();
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible();

    await page.getByRole("checkbox").check();
    await expect(page.getByRole("checkbox")).toBeChecked();
    await expect(page.getByText("Accept the terms to continue.")).toHaveCount(0);
  });
});
