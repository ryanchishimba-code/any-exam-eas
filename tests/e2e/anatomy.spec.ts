import { test, expect } from "./fixtures/auth";

test.describe("Anatomy Explorer", () => {
  test("catalog and explorer pages load", async ({ authenticatedPage: page }) => {
    await page.goto("/anatomy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /3d anatomy study model/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("searchbox", { name: /search structures/i }).first()).toBeVisible({
      timeout: 30_000,
    });

    await page.goto("/anatomy/catalog", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /anatomy catalog/i })).toBeVisible();
  });

  test("authenticated user can search structures", async ({ authenticatedPage: page }) => {
    await page.goto("/anatomy", { waitUntil: "domcontentloaded" });
    const search = page.getByRole("searchbox", { name: /search structures/i }).first();
    await expect(search).toBeVisible({ timeout: 30_000 });
    await search.fill("heart");
    await expect(page.getByText(/^heart$/i).or(page.getByText(/heart/i)).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
