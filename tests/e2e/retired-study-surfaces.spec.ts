import { expect, test, type Page } from "@playwright/test";
import { loginViaApi } from "./helpers/api-auth";

const BOARDS = ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"] as const;
const RETIRED_SOURCES = ["/library", "/dashboard/topics", "/study-hub/topics"] as const;
const FEED = "/study-tools/pance/feed";

const PAID_EMAIL = process.env.RETIRED_STUDY_PAID_EMAIL ?? "pance-feed-paid-c526@anyexameasy.test";
const UNPAID_EMAIL = process.env.RETIRED_STUDY_UNPAID_EMAIL ?? "pance-feed-unpaid-c526@anyexameasy.test";
const PASSWORD = process.env.PANCE_FEED_QA_PASSWORD ?? "PreviewFeed1!";

function studyHubPath(exam: string) {
  return `/dashboard?exam=${exam}`;
}

function locationPath(location: string) {
  const url = new URL(location, "http://127.0.0.1");
  return `${url.pathname}${url.search}`;
}

async function signIn(page: Page, email: string) {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
  await loginViaApi(page.request, base, email, PASSWORD);
}

test.describe("retired High-Yield and Library redirects", () => {
  for (const exam of BOARDS) {
    for (const source of RETIRED_SOURCES) {
      test(`${source}?exam=${exam} returns 308 to that board's study hub`, async ({ request }) => {
        const response = await request.get(`${source}?exam=${exam}`, { maxRedirects: 0 });
        expect(response.status(), `${source}?exam=${exam}`).toBe(308);
        expect(locationPath(response.headers().location ?? "")).toBe(studyHubPath(exam));
      });
    }
  }

  for (const source of RETIRED_SOURCES) {
    test(`${source} with no exam returns 308 to /dashboard`, async ({ request }) => {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(locationPath(response.headers().location ?? "")).toBe("/dashboard");
    });
  }

  test("sitemap does not list library or high-yield topics", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).not.toContain("/library");
    expect(xml).not.toContain("/dashboard/topics");
    expect(xml).not.toContain("/study-hub/topics");
  });
});

test.describe("study nav after removal", () => {
  test.skip(!process.env.RETIRED_STUDY_QA, "Needs a signed-in preview user (RETIRED_STUDY_QA=1).");

  for (const exam of BOARDS) {
    test(`${exam} hides High-Yield Topics and Library`, async ({ page }) => {
      await signIn(page, PAID_EMAIL);
      const saved = await page.request.post("/api/user/exam-preference", {
        data: { examSlug: exam },
      });
      expect(saved.ok()).toBeTruthy();

      await page.goto("/dashboard");
      await expect(page.getByRole("link", { name: "High-Yield Topics" })).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Library", exact: true })).toHaveCount(0);

      const bank = page.getByRole("navigation", { name: "Study navigation" }).getByRole("link", {
        name: "Question Bank",
      });
      await expect(bank).toBeVisible();
      await bank.click();
      await expect(page).toHaveURL(/\/question-bank/);

      if (exam === "pance") {
        await page.goto("/dashboard");
        const feed = page.getByRole("link", { name: "PANCE Feed" }).first();
        await expect(feed).toBeVisible();
        await feed.click();
        await expect(page).toHaveURL(new RegExp(FEED.replace(/\//g, "\\/")));
        await expect(page.getByTestId("pance-feed-card").first()).toBeVisible();
      } else {
        await expect(page.getByRole("link", { name: "PANCE Feed" })).toHaveCount(0);
      }
    });

    test(`${exam} mobile nav has no Topics link`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await signIn(page, PAID_EMAIL);
      const saved = await page.request.post("/api/user/exam-preference", {
        data: { examSlug: exam },
      });
      expect(saved.ok()).toBeTruthy();
      await page.goto("/dashboard");
      const mobile = page.getByRole("navigation", { name: "Mobile study navigation" });
      await expect(mobile.getByRole("link", { name: "High-Yield Topics" })).toHaveCount(0);
      await expect(mobile.getByRole("link", { name: "Question Bank" })).toBeVisible();
      if (exam === "pance") {
        await expect(mobile.getByRole("link", { name: "PANCE Feed" })).toBeVisible();
        await mobile.getByRole("link", { name: "PANCE Feed" }).click();
        await expect(page).toHaveURL(new RegExp(FEED.replace(/\//g, "\\/")));
      } else {
        await expect(mobile.getByRole("link", { name: "PANCE Feed" })).toHaveCount(0);
      }
    });
  }
});

test.describe("PANCE feed access", () => {
  test("signed-out visitors go to sign-in and return to the feed", async ({ page }) => {
    await page.goto(FEED);
    await expect(page).toHaveURL(/\/(auth\/)?login/);
    expect(decodeURIComponent(page.url())).toContain(FEED);
    await expect(page.getByTestId("pance-feed-card")).toHaveCount(0);
  });

  test("a free signed-in user sees the upgrade prompt", async ({ page }) => {
    test.skip(!process.env.RETIRED_STUDY_QA, "Needs the unpaid preview user (RETIRED_STUDY_QA=1).");
    await signIn(page, UNPAID_EMAIL);
    await page.goto(FEED);
    await expect(page.getByTestId("pance-feed-upgrade")).toBeVisible();
    await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
    await expect(page.getByTestId("pance-feed-card")).toHaveCount(0);
  });

  test("a paid signed-in user sees the feed", async ({ page }) => {
    test.skip(!process.env.RETIRED_STUDY_QA, "Needs the paid preview user (RETIRED_STUDY_QA=1).");
    await signIn(page, PAID_EMAIL);
    await page.goto(FEED);
    await expect(page.getByTestId("pance-feed-card").first()).toBeVisible();
    await expect(page.getByTestId("pance-feed-upgrade")).toHaveCount(0);
  });
});
