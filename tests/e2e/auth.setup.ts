import fs from "node:fs";
import path from "node:path";
import { test as setup, expect } from "@playwright/test";
import { AUTH_STORAGE_PATH, DEV_USER } from "./fixtures/auth";
import { loginViaApi } from "./helpers/api-auth";

setup("authenticate dev trial user", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for auth setup");
  }

  fs.mkdirSync(path.dirname(AUTH_STORAGE_PATH), { recursive: true });

  await expect
    .poll(
      async () => {
        try {
          const res = await page.request.get(`${baseURL}/api/auth/csrf`);
          return res.ok();
        } catch {
          return false;
        }
      },
      { timeout: 180_000 }
    )
    .toBe(true);

  try {
    await loginViaApi(page.request, baseURL, DEV_USER.email, DEV_USER.password);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/CSRF fetch failed: 5\d\d|Credentials login failed: 5\d\d/.test(message)) {
      console.warn("[e2e setup] Auth backend unavailable — skipping storage state.");
      return;
    }
    throw error;
  }

  await page.context().storageState({ path: AUTH_STORAGE_PATH });
});
