import { expect, test, type Page, type Response } from "@playwright/test";
import { loginViaApi } from "./helpers/api-auth";

/**
 * Signed-in student path that production broke on 2026-11-12.
 * The dashboard error boundary still says "Dashboard unavailable" for any
 * server exception, so that text fails the check even when the HTTP status is 200.
 */

const EMAIL = process.env.SMOKE_STUDENT_EMAIL ?? "smoke-student@anyexameasy.test";
const PASSWORD = process.env.SMOKE_STUDENT_PASSWORD ?? "";

const ERROR_TEXT = [
  "Dashboard unavailable",
  "Something went wrong",
  "Question bank unavailable",
  "We could not load your study data",
  "Attempted to call",
  "Application error",
  "temporarily unavailable",
];

const BOARDS = [
  {
    slug: "nclex",
    fieldId: "nursing",
    subjectId: "pharmacology-nursing",
    marker: /NCLEX/i,
  },
  {
    slug: "naplex",
    fieldId: "pharmacy",
    subjectId: "patient-counseling",
    marker: /NAPLEX/i,
  },
  {
    slug: "pance",
    fieldId: "pance",
    subjectId: "cardiovascular",
    marker: /PANCE/i,
  },
  {
    slug: "aanp-fnp",
    fieldId: "aanp-fnp",
    subjectId: "cardiovascular",
    marker: /FNP/i,
  },
] as const;

function assertNoErrorCopy(body: string, where: string) {
  for (const needle of ERROR_TEXT) {
    if (body.includes(needle)) {
      throw new Error(`${where} showed the error state "${needle}"`);
    }
  }
}

async function withServerErrors(page: Page, origin: string, run: () => Promise<void>) {
  const serverErrors: string[] = [];
  const onResponse = (response: Response) => {
    if (response.status() < 500) return;
    let url: URL;
    try {
      url = new URL(response.url());
    } catch {
      return;
    }
    if (url.origin !== origin) return;
    serverErrors.push(`${response.status()} ${url.pathname}`);
  };
  page.on("response", onResponse);
  try {
    await run();
  } finally {
    page.off("response", onResponse);
  }
  if (serverErrors.length > 0) {
    throw new Error(`Server errors: ${[...new Set(serverErrors)].join(", ")}`);
  }
}

async function gotoApp(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  if (status >= 500) throw new Error(`${path} returned ${status}`);
  if (/\/(auth\/)?login/.test(new URL(page.url()).pathname)) {
    throw new Error(`${path} redirected to login (${page.url()})`);
  }
}

async function assertHealthy(page: Page, where: string) {
  const body = await page.locator("body").innerText();
  assertNoErrorCopy(body, where);
  return body;
}

test.describe("signed-in student", () => {
  test("dashboard, question bank, practice, exam, and stats for each board", async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(12 * 60 * 1000);
    if (!baseURL) throw new Error("PLAYWRIGHT_BASE_URL is required");
    if (!PASSWORD) throw new Error("SMOKE_STUDENT_PASSWORD is required");
    const origin = new URL(baseURL).origin;

    await loginViaApi(page.request, baseURL, EMAIL, PASSWORD);

    for (const board of BOARDS) {
      await test.step(board.slug, async () => {
        await withServerErrors(page, origin, async () => {
          const preference = await page.request.post(`${baseURL}/api/user/exam-preference`, {
            data: { examSlug: board.slug },
          });
          if (!preference.ok()) {
            throw new Error(
              `exam preference ${board.slug} returned ${preference.status()} ${(await preference.text()).slice(0, 180)}`
            );
          }

          await gotoApp(page, "/dashboard");
          await expect(page.getByRole("heading", { name: /today'?s set/i })).toBeVisible({
            timeout: 45_000,
          });
          const dashboard = await assertHealthy(page, `${board.slug} dashboard`);
          expect(dashboard).toMatch(board.marker);

          await gotoApp(page, "/question-bank");
          await expect(page.locator("#practice-launcher")).toBeVisible({ timeout: 60_000 });
          await assertHealthy(page, `${board.slug} question bank`);

          const sessionPath =
            `/question-bank?field=${encodeURIComponent(board.fieldId)}` +
            `&mode=bank&subjectId=${encodeURIComponent(board.subjectId)}` +
            `&count=5&style=standard&autostart=1`;
          await gotoApp(page, sessionPath);
          await expect(page.getByRole("button", { name: /end activity/i })).toBeVisible({
            timeout: 120_000,
          });
          await assertHealthy(page, `${board.slug} practice session`);

          await gotoApp(page, `/full-exam/${board.slug}`);
          await expect(
            page.getByRole("button", { name: /start/i }).or(page.getByText(/practice test|full-length exam/i)).first()
          ).toBeVisible({ timeout: 45_000 });
          await assertHealthy(page, `${board.slug} exam`);

          await gotoApp(page, "/analytics");
          await expect(page.getByText(/analytics|accuracy|readiness|progress/i).first()).toBeVisible({
            timeout: 45_000,
          });
          await assertHealthy(page, `${board.slug} stats`);
        });
      });
    }
  });
});
