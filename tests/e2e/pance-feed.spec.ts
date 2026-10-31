import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { loginViaApi } from "./helpers/api-auth";

const PAID_EMAIL = "pance-feed-paid-c526@anyexameasy.test";
const UNPAID_EMAIL = "pance-feed-unpaid-c526@anyexameasy.test";
const PASSWORD = process.env.PANCE_FEED_QA_PASSWORD ?? "PreviewFeed1!";
const FEED = "/study-tools/pance/feed";
const SHOTS = process.env.PANCE_FEED_SHOTS ?? "/opt/cursor/artifacts/pance-feed";

const sampleFront = (
  JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/pance-feed/cards/cards-cardio.json"), "utf8")
  ) as { front: string }[]
)[0]!.front;

test.skip(!process.env.PANCE_FEED_QA, "Runs against the Neon preview branch only.");

async function signIn(page: Page, email: string) {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
  await loginViaApi(page.request, base, email, PASSWORD);
}

async function contrastOf(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    const paint = (value: string) => {
      if (!ctx) return { rgb: [0, 0, 0] as [number, number, number], alpha: 1 };
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { rgb: [r, g, b] as [number, number, number], alpha: a / 255 };
    };
    const channel = (value: number) => {
      const scaled = value / 255;
      return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
    };
    const lum = (rgb: [number, number, number]) =>
      0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
    const solidBackground = (node: Element | null) => {
      let current: Element | null = node;
      while (current) {
        const painted = paint(getComputedStyle(current).backgroundColor);
        if (painted.alpha >= 0.9) return painted.rgb;
        current = current.parentElement;
      }
      return [255, 255, 255] as [number, number, number];
    };
    const style = getComputedStyle(el);
    const fg = paint(style.color).rgb;
    const bg = solidBackground(el);
    const lighter = Math.max(lum(fg), lum(bg));
    const darker = Math.min(lum(fg), lum(bg));
    return {
      ratio: (lighter + 0.05) / (darker + 0.05),
      fontSize: Number.parseFloat(style.fontSize),
    };
  });
}

async function hideDevIndicator(page: Page) {
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
}

test("logged-out visitors go to sign-in and card JSON stays private", async ({ page }) => {
  const response = await page.goto(FEED);
  expect(response?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/(auth\/)?login/);
  expect(decodeURIComponent(page.url())).toContain(FEED);
  await expect(page.getByText(sampleFront)).toHaveCount(0);

  const cards = await page.request.get("/api/pance-feed/cards");
  expect(cards.status()).toBe(401);
  expect(await cards.text()).not.toContain(sampleFront);

  const detail = await page.request.get("/api/pance-feed/cards/pance-021");
  expect(detail.status()).toBe(401);

  for (const path of ["/cards-cardio.json", "/content/pance-feed/cards/cards-cardio.json", "/pance-feed/cards-cardio.json"]) {
    const missing = await page.request.get(path);
    expect(missing.status()).toBe(404);
  }

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain("/study-tools/pance/feed");
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("/study-tools/");
});

test("an unpaid signed-in user sees the upgrade prompt", async ({ page }) => {
  await signIn(page, UNPAID_EMAIL);
  await page.goto(FEED);
  await expect(page.getByTestId("pance-feed-upgrade")).toBeVisible();
  await hideDevIndicator(page);
  await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
  await expect(page.getByText(sampleFront)).toHaveCount(0);
  const cards = await page.request.get("/api/pance-feed/cards");
  expect(cards.status()).toBe(403);
  expect(await cards.text()).not.toContain(sampleFront);
  await page.screenshot({ path: path.join(SHOTS, "unpaid-gate.png"), fullPage: true });
});

test("paid feed at 390x844 and 375x812, contrast, and cross-session sync", async ({ browser }) => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const contextA = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageA = await contextA.newPage();
  await signIn(pageA, PAID_EMAIL);
  await pageA.request.put("/api/pance-feed/progress", {
    data: { mastered: [], reviewQueue: [], lastSeenCardId: null },
  });

  await pageA.goto(FEED);
  const card = pageA.getByTestId("pance-feed-card").first();
  await expect(card).toBeVisible({ timeout: 60_000 });
  const hint = pageA.locator(".pf-hint-overlay");
  if (await hint.isVisible()) await hint.click();
  await hideDevIndicator(pageA);
  const firstId = await card.getAttribute("data-id");
  expect(firstId).toBeTruthy();

  await expect(pageA.getByRole("button", { name: "Got it" }).first()).toBeVisible();
  await expect(pageA.getByRole("button", { name: /Review/ }).first()).toBeVisible();
  await expect(pageA.getByRole("button", { name: "Labels" }).first()).toBeVisible();
  await expect(pageA.getByRole("button", { name: "Enlarge" }).first()).toBeVisible();
  await pageA.screenshot({ path: path.join(SHOTS, "feed-390x844-front.png") });

  for (const selector of [".pf-q", ".pf-hint", ".pf-chip", ".pf-ttl small", ".pf-rb.got span", ".pf-rb.again span"]) {
    const sample = await contrastOf(pageA, selector);
    expect(sample.fontSize, selector).toBeGreaterThanOrEqual(12);
    expect(sample.ratio, selector).toBeGreaterThanOrEqual(4.5);
  }

  await card.locator(".pf-q").click();
  await expect(card).toHaveClass(/flipped/);
  await expect(card.locator(".pf-dia svg")).toBeVisible({ timeout: 20_000 });
  await pageA.waitForTimeout(700);
  for (const selector of [".pf-bl", ".pf-src", ".pf-bul li"]) {
    const sample = await contrastOf(pageA, selector);
    expect(sample.fontSize, selector).toBeGreaterThanOrEqual(12);
    expect(sample.ratio, selector).toBeGreaterThanOrEqual(4.5);
  }
  await pageA.screenshot({ path: path.join(SHOTS, "feed-390x844-back.png") });

  await pageA.setViewportSize({ width: 375, height: 812 });
  await pageA.screenshot({ path: path.join(SHOTS, "feed-375x812-back.png") });
  const narrow = await contrastOf(pageA, ".pf-q");
  expect(narrow.fontSize).toBeGreaterThanOrEqual(12);
  expect(narrow.ratio).toBeGreaterThanOrEqual(4.5);

  const tiny = await pageA.evaluate(() => {
    const offenders: string[] = [];
    document.querySelectorAll(".pance-feed *").forEach((el) => {
      const text = [...el.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 0
      );
      if (!text) return;
      const size = Number.parseFloat(getComputedStyle(el).fontSize);
      if (size < 12) offenders.push(`${el.tagName}.${el.className}:${size}`);
    });
    return offenders.slice(0, 8);
  });
  expect(tiny).toEqual([]);

  await card.getByRole("button", { name: "Got it" }).click();
  await expect
    .poll(async () => {
      const res = await pageA.request.get("/api/pance-feed/progress");
      const body = (await res.json()) as { mastered?: string[] };
      return body.mastered ?? [];
    })
    .toContain(firstId);

  const contextB = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageB = await contextB.newPage();
  await signIn(pageB, PAID_EMAIL);
  await pageB.goto(FEED);
  await expect(pageB.locator(".pf-ttl small")).toHaveText("1 of 148 mastered", { timeout: 60_000 });
  await hideDevIndicator(pageB);
  await expect(pageB.locator(`[data-id="${firstId}"]`).first()).toHaveClass(/done/);
  await pageB.locator(".pf-feed").evaluate((el) => {
    el.scrollTop = 0;
  });
  await pageB.screenshot({ path: path.join(SHOTS, "sync-session-b.png") });

  const reviewCard = pageB.locator(".pf-slide[data-id]:not(.done)").first();
  const reviewId = await reviewCard.getAttribute("data-id");
  expect(reviewId).toBeTruthy();
  await reviewCard.getByRole("button", { name: /Review/ }).click();
  await expect
    .poll(async () => {
      const res = await pageB.request.get("/api/pance-feed/progress");
      const body = (await res.json()) as { reviewQueue?: string[] };
      return body.reviewQueue ?? [];
    })
    .toContain(reviewId);

  await pageA.reload();
  await expect(pageA.getByTestId("pance-feed-card").first()).toBeVisible({ timeout: 60_000 });
  const head = await pageA.locator(".pf-slide[data-id]").evaluateAll((nodes) =>
    nodes.slice(0, 3).map((node) => node.getAttribute("data-id"))
  );
  expect(head).not.toContain(reviewId);
  await expect(pageA.locator(`[data-id="${reviewId}"] .pf-chip-again`).first()).toBeVisible();

  await contextA.close();
  await contextB.close();
});
