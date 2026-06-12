import fs from "node:fs";
import path from "node:path";
import { test as base, expect, type Page } from "@playwright/test";
import { loginViaApi } from "../helpers/api-auth";
import { fillControlledInput } from "../helpers/forms";

const DEFAULT_BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? "3100"}`;

export const DEV_USER = {
  email: process.env.E2E_USER_EMAIL ?? "dev@anyexameasy.test",
  password: process.env.E2E_USER_PASSWORD ?? "DevPassword1!",
  name: process.env.E2E_USER_NAME ?? "Dev User",
};

export const AUTH_STORAGE_PATH = path.join(__dirname, "..", ".auth", "dev-user.json");

export function hasAuthStorage(): boolean {
  return fs.existsSync(AUTH_STORAGE_PATH);
}

export async function loginWithCredentials(
  page: Page,
  email = DEV_USER.email,
  password = DEV_USER.password
) {
  if (hasAuthStorage()) {
    const context = page.context();
    await context.clearCookies();
    await context.addCookies(
      JSON.parse(fs.readFileSync(AUTH_STORAGE_PATH, "utf8")).cookies ?? []
    );
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    if (!/\/(auth\/)?login/.test(page.url())) return;
  }

  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_BASE_URL;

  try {
    await loginViaApi(page.request, baseURL, email, password);
    await page.goto("/dashboard", { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (!/\/(auth\/)?login/.test(page.url())) return;
  } catch {
    // Fall back to UI login when API auth is unavailable.
  }

  await page.goto("/login", { waitUntil: "domcontentloaded" });

  const emailInput = page.getByPlaceholder("Email");
  const passwordInput = page.getByPlaceholder("Password");

  await fillControlledInput(emailInput, email);
  await fillControlledInput(passwordInput, password);

  await page.getByRole("button", { name: /log in|sign in/i }).click();

  await expect
    .poll(
      async () => {
        const url = page.url();
        if (/\/(dashboard|select-exam|study-hub|onboarding|checkout)/.test(url)) return true;
        return page.getByText(/opening your study hub|welcome back|redirecting/i).isVisible();
      },
      { timeout: 60_000 }
    )
    .toBe(true);
}

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use, testInfo) => {
    if (!hasAuthStorage()) {
      testInfo.skip(true, "Auth storage missing — run global-setup with DATABASE_URL");
      return;
    }

    const context = await browser.newContext({
      storageState: AUTH_STORAGE_PATH,
    });
    const page = await context.newPage();
    try {
      await use(page);
    } finally {
      await context.close();
    }
  },
});

export { expect };
