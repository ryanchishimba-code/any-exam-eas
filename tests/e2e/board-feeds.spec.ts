import { expect, test, type Page } from "@playwright/test";
import { loginViaApi } from "./helpers/api-auth";

const PAID_EMAIL = "pance-feed-paid-c526@anyexameasy.test";
const UNPAID_EMAIL = "pance-feed-unpaid-c526@anyexameasy.test";
const PASSWORD = process.env.PANCE_FEED_QA_PASSWORD ?? "PreviewFeed1!";

const FEEDS = [
  { exam: "nclex", path: "/study-tools/nclex/feed", label: "NCLEX Feed", testId: "nclex-feed" },
  { exam: "naplex", path: "/study-tools/naplex/feed", label: "NAPLEX Feed", testId: "naplex-feed" },
  { exam: "aanp-fnp", path: "/study-tools/aanp-fnp/feed", label: "FNP Feed", testId: "fnp-feed" },
  { exam: "pance", path: "/study-tools/pance/feed", label: "PANCE Feed", testId: "pance-feed" },
] as const;

test.skip(!process.env.BOARD_FEEDS_QA, "Runs against the Neon preview branch only.");

async function signIn(page: Page, email: string) {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
  await loginViaApi(page.request, base, email, PASSWORD);
}

test.describe("board flashcard feeds", () => {
  for (const feed of FEEDS) {
    test(`${feed.label} sends signed-out learners to sign-in`, async ({ page }) => {
      await page.goto(feed.path);
      await expect(page).toHaveURL(/\/auth\/login|\/login/);
      expect(page.url()).toContain(encodeURIComponent(feed.path));
    });

    test(`${feed.label} shows the upgrade wall to a free user`, async ({ page }) => {
      await signIn(page, UNPAID_EMAIL);
      await page.goto(feed.path);
      await expect(page.getByTestId(`${feed.testId}-upgrade`)).toBeVisible();
      await expect(page.getByTestId(`${feed.testId}-card`)).toHaveCount(0);
    });

    test(`${feed.label} shows 200 cards to a paid user`, async ({ page }) => {
      await signIn(page, PAID_EMAIL);
      const cards = await page.request.get(
        feed.exam === "pance" ? "/api/pance-feed/cards" : `/api/study-feed/${feed.exam}/cards`
      );
      expect(cards.ok()).toBeTruthy();
      const body = (await cards.json()) as { total: number };
      expect(body.total).toBe(200);
      await page.goto(feed.path);
      await expect(page.getByTestId(`${feed.testId}-card`).first()).toBeVisible();
      await expect(page.getByTestId("feed-gesture-hint")).toBeVisible();
      await page.getByRole("button", { name: "Dismiss" }).click();
      await expect(page.getByTestId("feed-gesture-hint")).toHaveCount(0);
    });
  }

  test("mobile side swipe marks Got it on the NCLEX feed", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, PAID_EMAIL);
    await page.addInitScript(() => localStorage.setItem("aee-feed-gesture-hint:nclex", "1"));
    await page.goto("/study-tools/nclex/feed");
    const card = page.getByTestId("nclex-feed-card").first();
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    if (!box) throw new Error("card box missing");
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + 40, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 220, y, { steps: 8 });
    await page.mouse.up();
    await expect(page.getByText(/of 200 mastered/)).toContainText("1 of 200");
  });
});
