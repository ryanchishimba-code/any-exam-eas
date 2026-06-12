import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { AUTH_STORAGE_PATH, DEV_USER } from "./fixtures/auth";
import { loginViaApi } from "./helpers/api-auth";

setup("authenticate dev trial user", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for auth setup");
  }

  fs.mkdirSync(path.dirname(AUTH_STORAGE_PATH), { recursive: true });

  try {
    await loginViaApi(page.request, baseURL, DEV_USER.email, DEV_USER.password);
  } catch (error) {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const configWarning = page.getByText(/missing required settings|missing auth or database/i);
    if (await configWarning.isVisible().catch(() => false)) {
      console.warn("[e2e setup] Auth backend misconfigured — skipping storage state.");
      return;
    }
    throw error;
  }

  await page.context().storageState({ path: AUTH_STORAGE_PATH });
});
