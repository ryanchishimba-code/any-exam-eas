import { test, expect } from "./fixtures/auth";

test.describe("Dashboard and progress", () => {
  test("trial user sees study hub with progress signals", async ({ authenticatedPage: page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: /study hub|dashboard|welcome|keep going/i }).first()
    ).toBeVisible({ timeout: 20_000 });

    await expect(
      page
        .getByRole("link", { name: /question bank|practice|full exam|analytics|weak/i })
        .or(page.getByText(/practice progress|sessions|streak|accuracy/i))
        .first()
    ).toBeVisible();
  });

  test("analytics page loads for authenticated user", async ({ authenticatedPage: page }) => {
    await page.goto("/analytics");
    await expect(page.getByRole("heading", { name: /analytics|performance|progress/i }).first()).toBeVisible({
      timeout: 20_000,
    });
  });
});
