import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Memory Cards / Reference", () => {
  test("guests are redirected to login", async ({ page }) => {
    await page.goto("/library", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/(auth\/)?login/);
  });

  authTest("signed-in library URL opens the study hub", async ({ authenticatedPage: page }) => {
    await page.goto("/library", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /^hi,|^dashboard$/i })).toBeVisible({
      timeout: 30_000,
    });
  });
});
