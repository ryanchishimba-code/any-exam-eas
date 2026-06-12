import { test, expect } from "@playwright/test";
import { test as authTest } from "./fixtures/auth";

const PUBLIC_PRACTICE_HUBS = [
  { path: "/practice/usmle", label: /usmle|step/i },
  { path: "/practice/nclex", label: /nclex/i },
  { path: "/practice/naplex", label: /naplex/i },
  { path: "/mpje/practice-exam", label: /mpje/i },
] as const;

test.describe("Question bank", () => {
  authTest("question bank hub loads for authenticated user", async ({ authenticatedPage: page }) => {
    await page.goto("/question-bank", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /browse & practice questions/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/^question bank$/i)).toBeVisible();
  });

  for (const hub of PUBLIC_PRACTICE_HUBS) {
    test(`${hub.path} responds without server error`, async ({ page }) => {
      const response = await page.goto(hub.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(500);
      await expect(page.getByText(hub.label).first()).toBeVisible({ timeout: 20_000 });
    });
  }

  authTest("authenticated user sees practice launcher on question bank", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/question-bank", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#practice-launcher")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Exam", { exact: true })).toBeVisible();
    await expect(page.getByText("Practice mode", { exact: true })).toBeVisible();
  });
});
