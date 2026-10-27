import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

/**
 * About page — founder story. Public marketing page, no auth.
 */
test.describe("About page", () => {
  test("renders the founder hero, pull quote, and price", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /any exam easy\s+exam prep from the founder/i,
      })
    ).toBeVisible();
    await expect(page.getByText("This is my gift to my former self.").first()).toBeVisible();
    await expect(page.getByText("$27.99").first()).toBeVisible();
    await expect(page.getByText("883-6375")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /start free trial/i }).first()).toBeVisible();
  });

  test("trial CTA points at signup", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    const cta = page.getByRole("link", { name: /start free trial/i }).first();
    await expect(cta).toHaveAttribute("href", /\/signup/);
  });

  test("has a descriptive document title", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("Any Exam Easy Exam Prep from the Founder");
  });

  test("passes serious axe checks", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoA11yViolations(page, { seriousOnly: true });
  });
});
