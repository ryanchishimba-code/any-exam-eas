import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers/axe";

test.describe("Landing page", () => {
  test("hero, navigation, and primary CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Six board exams. One plan/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /start 5-day free trial/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /try a free question/i })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
    await expect(page.getByText(/prisca m\.|gerard n\./i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "A practice estimate." })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Every question explained." })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "How to pass any board exam — in 3 minutes" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Content review." })).toHaveCount(0);
    await expect(page.locator(".home-hero__proof")).toContainText("Nathan C.");
    await expect(page.getByText("Priscilla J.")).toBeVisible();
    await expect(page.getByText("Quality exam prep shouldn't be out of reach")).toHaveCount(0);
    await expect(page.getByText(/24\/7|support hours/i)).toHaveCount(0);
    await expect(page.getByText(/no payment method required/i).first()).toBeVisible();
    await expect(
      page.getByText("5-day free trial · no payment method required · then $27.99/mo").first()
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "How to pass in 3 minutes", exact: true })).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
    await expect(page.getByRole("button", { name: /share your progress/i })).toHaveCount(0);
    await expect(
      page.getByRole("navigation", { name: /main navigation/i }).locator('a[href="/pricing"]')
    ).toHaveCount(1);
  });

  test("390px ATF does not overflow header or board chips", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".home-hero")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        pageOverflows: doc.scrollWidth > doc.clientWidth + 1,
        navOverflows: (() => {
          const nav = document.querySelector(".aee-nav-inner");
          return nav ? nav.scrollWidth > nav.clientWidth + 1 : true;
        })(),
      };
    });
    expect(overflow.pageOverflows, "homepage should not scroll horizontally at 390px").toBe(false);
    expect(overflow.navOverflows, "header row should not clip/overlap at 390px").toBe(false);
  });

  test("non-NCLEX board hubs use the premium dark hero", async ({ page }) => {
    await page.goto("/naplex", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-exam-hero="naplex"]')).toBeVisible();
    await expect(page.getByText(/active NAPLEX questions/i)).toBeVisible();
    await expect(
      page.getByText(/5-day free trial · no payment method required · then/i).first()
    ).toBeVisible();
    await expect(page.getByText(/\bno[- ]card\b/i)).toHaveCount(0);
  });

  test("signup CTA uses brand teal", async ({ page }) => {
    await page.goto("/signup?plan=trial&interval=monthly", { waitUntil: "domcontentloaded" });
    const submit = page.locator('button[type="submit"]').first();
    await expect(submit).toBeVisible();
    const bg = await submit.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg, `expected teal CTA, got ${bg}`).toMatch(
      /rgb\(\s*15,\s*118,\s*110\s*\)|rgb\(\s*13,\s*148,\s*136\s*\)|rgb\(\s*46,\s*231,\s*220\s*\)/
    );
  });

  test("trial CTA links to signup and signup page renders", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const trialCta = page.locator('a[href*="/signup?plan=trial"][href*="interval=monthly"]').first();
    await expect(trialCta).toBeVisible();
    await expect(trialCta).toHaveAttribute("href", /\/signup\?plan=trial.*interval=monthly/);

    const href = await trialCta.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /start your free trial/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(/trial|payment|free/i).first()).toBeVisible();
  });

  test("FAQ stays a real page and the share control stays off the hero", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(page.getByRole("button", { name: /share your progress/i })).toHaveCount(0);
    await page.goto("/faq", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("pass video waits for a click and the share page previews it", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("how-to-pass.mp4")) videoRequests.push(request.url());
    });

    await page.goto("/how-to-pass", { waitUntil: "domcontentloaded" });
    const play = page.getByRole("button", { name: /play video/i });
    await expect(play).toBeVisible();
    await expect(play).toHaveAttribute("data-ready", "true");
    expect(videoRequests).toEqual([]);
    await expect(page.locator("video")).toHaveCount(0);

    await play.click();
    await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
    await expect(page.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", /facebook\.com\/sharer/);
    await expect(page.getByRole("link", { name: "X", exact: true })).toHaveAttribute(
      "href",
      /twitter\.com\/intent/
    );
    await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", /^mailto:/);

    await page.goto("/how-to-pass#video", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#video")).toBeVisible();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /How to pass any board exam/
    );
    await expect(page.locator('meta[property="og:video"]')).toHaveAttribute("content", /how-to-pass\.mp4/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /how-to-pass-poster/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
    await expect(page.getByRole("link", { name: /start 5-day free trial/i }).first()).toBeVisible();
  });

  test("homepage type, tap targets, and overflow at key widths", async ({ page }) => {
    for (const width of [375, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.locator(".home-hero")).toBeVisible();

      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const bodySize = (selector: string) => {
          const el = document.querySelector(selector);
          return el ? parseFloat(getComputedStyle(el).fontSize) : 0;
        };
        const cta = document.querySelector(".home-hero__actions a");
        const box = cta?.getBoundingClientRect();
        const benefitEl = document.querySelector(".home-hero__benefit");
        return {
          overflows: doc.scrollWidth > doc.clientWidth + 1,
          sub: bodySize(".home-hero__sub"),
          benefit: benefitEl ? bodySize(".home-hero__benefit") : 16,
          hasBenefit: Boolean(benefitEl),
          ctaHeight: box?.height ?? 0,
          ctaWidth: box?.width ?? 0,
        };
      });

      expect(metrics.overflows, `overflow at ${width}`).toBe(false);
      expect(metrics.sub, `hero type at ${width}`).toBeGreaterThanOrEqual(16);
      if (metrics.hasBenefit) {
        expect(metrics.benefit, `hero benefit type at ${width}`).toBeGreaterThanOrEqual(16);
      }
      expect(metrics.ctaHeight, `cta height at ${width}`).toBeGreaterThanOrEqual(44);
      expect(metrics.ctaWidth, `cta width at ${width}`).toBeGreaterThanOrEqual(44);
    }

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-sticky")).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 900));
    const sticky = page.locator(".home-sticky a");
    await expect(sticky).toBeVisible();
    await expect(sticky).toContainText(/\$27\.99\/mo · start free trial/i);
    const stickyBox = await sticky.boundingBox();
    expect(stickyBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(page.locator(".home-sticky")).toBeHidden();
  });

  test("landing hero passes axe checks", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-hero")).toBeVisible();
    await expectNoA11yViolations(page, {
      selector: ".home-hero",
      seriousOnly: true,
    });
  });
});
