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

  test("skeletal layer toggle and bone structure selection", async ({ authenticatedPage: page }) => {
    await page.goto("/anatomy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /3d anatomy study model/i })).toBeVisible({
      timeout: 30_000,
    });

    const skeletalSwitch = page.getByLabel("Skeletal", { exact: true });
    await expect(skeletalSwitch).toBeVisible({ timeout: 30_000 });
    await expect(skeletalSwitch).toBeChecked();

    await skeletalSwitch.click();
    await expect(skeletalSwitch).not.toBeChecked();
    await skeletalSwitch.click();
    await expect(skeletalSwitch).toBeChecked();

    const search = page.getByRole("searchbox", { name: /search structures/i }).first();
    await search.fill("sternum");
    await page.getByRole("button", { name: /^Sternum$/i }).first().click();

    await expect(page.getByText(/^Sternum$/).first()).toBeVisible({ timeout: 15_000 });
  });
});
