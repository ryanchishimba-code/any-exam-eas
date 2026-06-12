import { test } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

const PUBLIC_ROUTES: Array<{ path: string; selector?: string }> = [
  { path: "/", selector: "main" },
  { path: "/pricing", selector: "main" },
  { path: "/login", selector: "main" },
  { path: "/signup", selector: "main" },
  { path: "/legal/privacy", selector: "main" },
  { path: "/legal/terms", selector: "main" },
];

test.describe("Accessibility (axe)", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.path} has no serious/critical axe violations`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expectNoA11yViolations(page, {
        selector: route.selector,
        seriousOnly: true,
      });
    });
  }
});
