import { test, expect } from "./fixtures/auth";
import { fillControlledInput } from "./helpers/forms";

test.describe("Anatomy Explorer", () => {
  test("catalog and explorer pages load", async ({ authenticatedPage: page }) => {
    await page.goto("/anatomy", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^anatomy$/i })).toBeVisible({
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
    await expect(page.getByRole("heading", { name: /^anatomy$/i })).toBeVisible({
      timeout: 30_000,
    });
    const skeletal = page
      .getByRole("region", { name: "Layer visibility" })
      .getByRole("button", { name: "Skeletal", exact: true });
    await expect(skeletal).toBeVisible({ timeout: 30_000 });
    await expect(skeletal).toHaveAttribute("aria-pressed", "true");

    await expect(async () => {
      if ((await skeletal.getAttribute("aria-pressed")) !== "false") {
        await skeletal.click();
      }
      await expect(skeletal).toHaveAttribute("aria-pressed", "false", { timeout: 1_500 });
    }).toPass({ timeout: 15_000 });
    await skeletal.click();
    await expect(skeletal).toHaveAttribute("aria-pressed", "true");

    const search = page.getByRole("searchbox", { name: /search structures/i }).first();
    await search.scrollIntoViewIfNeeded();
    await fillControlledInput(search, "femur");
    const femur = page.getByRole("button", { name: /^Femur\b/i }).first();
    await expect(femur).toBeVisible({ timeout: 15_000 });
    await femur.click();
  });
});
