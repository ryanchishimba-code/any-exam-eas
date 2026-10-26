import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PATHS = [
  "/",
  "/nclex",
  "/naplex",
  "/usmle",
  "/pance",
  "/aanp-fnp",
  "/npte-pt",
  "/pricing",
  "/login",
  "/pance-study-guide",
] as const;

async function expectReadable(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const lock = await page.evaluate(() => {
    const root = document.documentElement;
    const body = getComputedStyle(document.body);
    const meta = document.querySelector('meta[name="color-scheme"]')?.getAttribute("content");
    return {
      theme: root.dataset.theme ?? "",
      colorScheme: getComputedStyle(root).colorScheme,
      meta,
      bodyColor: body.color,
      bodyBg: body.backgroundColor,
    };
  });
  expect(lock.theme, path).toBe("light");
  expect(lock.colorScheme, path).toBe("light");
  expect(lock.meta, path).toBe("light");
  expect(lock.bodyColor, path).not.toBe("rgba(0, 0, 0, 0)");
  expect(lock.bodyBg, path).not.toBe("rgba(0, 0, 0, 0)");

  const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  const violations = results.violations.flatMap((violation) =>
    violation.nodes.map((node) => `${path} ${node.target.join(" ")} ${node.failureSummary ?? ""}`)
  );
  expect(violations, violations.join("\n")).toEqual([]);
}

test.describe("public contrast, light baseline", () => {
  test.use({ viewport: { width: 390, height: 844 }, colorScheme: "light" });

  for (const path of PATHS) {
    test(`light ${path}`, async ({ page }) => {
      await expectReadable(page, path);
    });
  }

  test("light menu, footer, and results line", async ({ page }) => {
    await page.goto("/nclex", { waitUntil: "domcontentloaded" });
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
    // The header hydrates after first paint. Click once that handler is live.
    await page.waitForTimeout(800);
    await menuButton.click();
    await expect(page.locator("#site-menu")).toBeVisible();
    const menuContrast = await new AxeBuilder({ page }).include("#site-menu").withRules(["color-contrast"]).analyze();
    expect(menuContrast.violations).toEqual([]);
    await expect(page.locator(".mkt-hero-foot__note")).toHaveText("Individual experiences. Results vary.");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
  });
});

test.describe("public contrast, emulated night mode stays light", () => {
  test.use({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });

  for (const path of PATHS) {
    test(`dark ${path}`, async ({ page }) => {
      await expectReadable(page, path);
    });
  }
});
