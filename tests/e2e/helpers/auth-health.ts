import type { Page } from "@playwright/test";

/** True when login/register APIs are wired (DATABASE_URL + NextAuth present). */
export async function isAuthBackendReady(page: Page): Promise<boolean> {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  const configWarning = page.getByText(/missing required settings|missing auth or database/i);
  if (await configWarning.isVisible().catch(() => false)) return false;

  const loginButton = page.getByRole("button", { name: /log in|sign in/i });
  if (await loginButton.isDisabled().catch(() => false)) return false;
  return true;
}
