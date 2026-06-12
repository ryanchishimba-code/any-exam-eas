import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

test.describe("Landing page", () => {
  test("hero, navigation, and primary CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        name: /board prep with clinical-grade questions/i,
      })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /start.*trial/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /pricing/i }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
  });

  test("trial CTA links to signup and signup page renders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trialCta = page.locator('a[href="/signup?plan=trial"]').first();
    await expect(trialCta).toBeVisible();

    // Dev-mode client navigations can be slow/flaky; verify href + destination render.
    await expect(trialCta).toHaveAttribute("href", "/signup?plan=trial");
    await page.goto("/signup?plan=trial", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/trial|payment|free/i).first()).toBeVisible();
  });

  test("landing hero passes axe checks", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".aee-flagship-hero")).toBeVisible();
    await expectNoA11yViolations(page, {
      selector: ".aee-flagship-hero",
      seriousOnly: true,
    });
  });
});
