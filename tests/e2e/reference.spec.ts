import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Memory Cards / Reference", () => {
  test("guests are redirected to login", async ({ page }) => {
    await page.goto("/reference", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/(auth\/)?login/);
  });

  authTest("reference hub lists memory cards", async ({ authenticatedPage: page }) => {
    await page.goto("/reference", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /memory cards/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/open card/i).first()).toBeVisible({ timeout: 20_000 });
  });

  authTest("user can filter and open a memory card", async ({ authenticatedPage: page }) => {
    await page.goto("/reference", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("searchbox", { name: /search memory cards/i })).toBeVisible({
      timeout: 20_000,
    });

    const cardButton = page.getByRole("button", { name: /open card/i }).first();
    await expect(cardButton).toBeVisible({ timeout: 15_000 });
    await cardButton.click();

    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible({
      timeout: 15_000,
    });
  });
});
