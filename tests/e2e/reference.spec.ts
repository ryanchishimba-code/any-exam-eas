import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

test.describe("Memory Cards / Reference", () => {
  test("guests are redirected to login", async ({ page }) => {
    await page.goto("/library", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/(auth\/)?login/);
  });

  authTest("reference hub lists memory cards", async ({ authenticatedPage: page }) => {
    await page.goto("/library", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /study hub/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("searchbox", { name: /search memory cards/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  authTest("user can filter and open a memory card", async ({ authenticatedPage: page }) => {
    await page.goto("/library", { waitUntil: "domcontentloaded" });

    const search = page.getByRole("searchbox", { name: /search memory cards/i });
    await expect(search).toBeVisible({ timeout: 20_000 });
    await search.fill("a");

    const cardButton = page.getByRole("region", { name: "Search results" }).getByRole("button").first();
    await expect(cardButton).toBeVisible({ timeout: 15_000 });
    await cardButton.click();

    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible({
      timeout: 15_000,
    });
  });
});
