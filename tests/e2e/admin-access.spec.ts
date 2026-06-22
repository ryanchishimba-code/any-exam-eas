import { test, expect } from "@playwright/test";

/**
 * Admin dashboard access control + (optionally) the testimonial CRUD journey.
 *
 * The negative cases below are always runnable — they only need the dev server
 * and the auth middleware (no DB / admin account). They verify that the admin
 * portal is sealed from the public.
 *
 * The positive CRUD flow is gated behind admin credentials so CI without an
 * admin seed simply skips it. To run it locally:
 *   E2E_ADMIN_EMAIL=admin@anyexameasy.test \
 *   E2E_ADMIN_PASSWORD='YourPass1!' \
 *   npm run test:e2e:chromium -- admin-access
 */

test.describe("Admin access control (unauthenticated)", () => {
  test("redirects /admin to the admin login", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirects /admin/testimonials to the admin login", async ({ page }) => {
    await page.goto("/admin/testimonials", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("redirects /admin/questions to the admin login", async ({ page }) => {
    await page.goto("/admin/questions", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin login page renders a sign-in form", async ({ page }) => {
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /sign in|log in/i }).first()).toBeVisible();
  });
});

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
const hasAdminCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe("Admin testimonial management (admin session)", () => {
  test.skip(!hasAdminCreds, "Set E2E_ADMIN_EMAIL + E2E_ADMIN_PASSWORD to run admin CRUD e2e.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL as string);
    await page.getByLabel(/password/i).fill(ADMIN_PASSWORD as string);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/\/admin(\/|$)/, { timeout: 30_000 });
  });

  test("creates, approves, and deletes a testimonial", async ({ page }) => {
    await page.goto("/admin/testimonials", { waitUntil: "domcontentloaded" });

    const unique = `E2E Tester ${Date.now()}`;
    await page.getByRole("button", { name: /add testimonial/i }).click();
    await page.getByPlaceholder("Prisca M.").fill(unique);
    await page.getByPlaceholder("NCLEX-RN").fill("USMLE Step 1");
    await page
      .getByPlaceholder(/I passed on my first try/i)
      .fill("End-to-end test quote — long enough to pass validation.");

    await page
      .getByRole("button", { name: /add testimonial/i })
      .last()
      .click();

    // Row appears + approve makes it public.
    await expect(page.getByText(unique)).toBeVisible();
    const card = page.locator("div", { hasText: unique }).last();
    await card.getByRole("button", { name: /approve/i }).click();
    await expect(page.getByText("approved").first()).toBeVisible();

    // Clean up.
    await card.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByRole("button", { name: /undo/i })).toBeVisible();
  });
});
