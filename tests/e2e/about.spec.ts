import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

/**
 * About Us page — public marketing page (no auth required).
 * Validates the key positioning content + the value "showdown" charts render,
 * and that the page is free of serious accessibility violations.
 */
test.describe("About page", () => {
  test("renders hero, mission, showdown charts, and verdict", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });

    // Hero
    await expect(page.getByRole("heading", { level: 1, name: /premium board prep/i })).toBeVisible();
    await expect(page.getByText(/built in the heart of texas/i)).toBeVisible();

    // Showdown charts (Recharts renders in a real browser)
    await expect(page.getByText(/one plan vs\. six subscriptions/i)).toBeVisible();
    await expect(page.getByText(/value coverage, side by side/i)).toBeVisible();

    // Verdict
    await expect(page.getByText(/anyexameasy is the obvious clear winner/i)).toBeVisible();

    // Trust + CTA
    await expect(page.getByText(/12\+ years/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /free trial/i }).first()).toBeVisible();
  });

  test("trial CTA points at signup", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    const cta = page.getByRole("link", { name: /free trial/i }).first();
    await expect(cta).toHaveAttribute("href", /\/signup/);
  });

  test("has a descriptive document title", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/about/i);
  });

  test("passes serious axe checks", async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoA11yViolations(page, { seriousOnly: true });
  });
});
