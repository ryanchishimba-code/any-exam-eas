import { expect, test, type Page, type Response } from "@playwright/test";
import { loginViaApi } from "./helpers/api-auth";

/**
 * Signed-in load budget for every board's question bank and full exam.
 * CI's throwaway database cannot fill a full-length sitting, so the exam
 * start is required only when SMOKE_REQUIRE_FULL_EXAM=1 (production smoke).
 * A short bank is tolerated the same way unless SMOKE_REQUIRE_SESSIONS=1.
 */

const EMAIL = process.env.SMOKE_STUDENT_EMAIL ?? "smoke-student@anyexameasy.test";
const PASSWORD = process.env.SMOKE_STUDENT_PASSWORD ?? "";
const REQUIRE_SESSIONS = process.env.SMOKE_REQUIRE_SESSIONS === "1";
const REQUIRE_FULL_EXAM = process.env.SMOKE_REQUIRE_FULL_EXAM === "1";

const BANK_BUDGET_MS = 25_000;
const EXAM_BUDGET_MS = 35_000;
const NAV_BUDGET_MS = 8_000;

const ERROR_TEXT = [
  "Dashboard unavailable",
  "Something went wrong",
  "Question bank unavailable",
  "Exam simulator unavailable",
  "Application error",
];

type Board = {
  label: string;
  examSlug: "nclex" | "naplex" | "usmle" | "pance" | "aanp-fnp" | "npte-pt" | "mpje";
  fieldId: string;
  subjectId: string;
  marker: RegExp;
  usmleFieldId?: string;
  difficultyTier?: string;
  taskCategory?: string;
  fullQuestionCount: number;
};

const BOARDS: Board[] = [
  {
    label: "NCLEX",
    examSlug: "nclex",
    fieldId: "nursing",
    subjectId: process.env.SMOKE_SUBJECT_NCLEX ?? "pharmacology-nursing",
    marker: /NCLEX/i,
    difficultyTier: "foundation",
    fullQuestionCount: 85,
  },
  {
    label: "NAPLEX",
    examSlug: "naplex",
    fieldId: "pharmacy",
    subjectId: process.env.SMOKE_SUBJECT_NAPLEX ?? "patient-counseling",
    marker: /NAPLEX/i,
    fullQuestionCount: 225,
  },
  {
    label: "USMLE Step 1",
    examSlug: "usmle",
    fieldId: "usmle-step-1",
    usmleFieldId: "usmle-step-1",
    subjectId: "pathology",
    marker: /Step 1/i,
    fullQuestionCount: 280,
  },
  {
    label: "USMLE Step 2",
    examSlug: "usmle",
    fieldId: "usmle-step-2",
    usmleFieldId: "usmle-step-2",
    subjectId: "cardiology",
    marker: /Step 2/i,
    fullQuestionCount: 280,
  },
  {
    label: "USMLE Step 3",
    examSlug: "usmle",
    fieldId: "usmle-step-3",
    usmleFieldId: "usmle-step-3",
    subjectId: "internal-medicine",
    marker: /Step 3/i,
    fullQuestionCount: 200,
  },
  {
    label: "PANCE",
    examSlug: "pance",
    fieldId: "pance",
    subjectId: process.env.SMOKE_SUBJECT_PANCE ?? "cardiovascular",
    marker: /PANCE/i,
    taskCategory: "diagnosis",
    fullQuestionCount: 300,
  },
  {
    label: "FNP",
    examSlug: "aanp-fnp",
    fieldId: "aanp-fnp",
    subjectId: process.env.SMOKE_SUBJECT_FNP ?? "assess",
    marker: /FNP/i,
    fullQuestionCount: 135,
  },
  {
    label: "NPTE-PT",
    examSlug: "npte-pt",
    fieldId: "npte-pt",
    subjectId: "musculoskeletal",
    marker: /NPTE/i,
    fullQuestionCount: 250,
  },
  {
    label: "MPJE",
    examSlug: "mpje",
    fieldId: "mpje",
    subjectId: "controlled-substances",
    marker: /MPJE/i,
    fullQuestionCount: 120,
  },
];

function assertNoErrorCopy(body: string, where: string) {
  for (const needle of ERROR_TEXT) {
    if (body.includes(needle)) {
      throw new Error(`${where} showed the error state "${needle}"`);
    }
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

function bankPath(board: Board): string {
  const params = new URLSearchParams({
    field: board.fieldId,
    mode: "bank",
    subjectId: board.subjectId,
    count: "5",
    style: "standard",
    autostart: "1",
  });
  if (board.difficultyTier) params.set("difficultyTier", board.difficultyTier);
  if (board.taskCategory) params.set("taskCategory", board.taskCategory);
  return `/question-bank?${params.toString()}`;
}

test.describe("board exam and question bank load", () => {
  test("every board starts a bank and a full exam inside the time budget", async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(18 * 60 * 1000);
    if (!baseURL) throw new Error("PLAYWRIGHT_BASE_URL is required");
    if (!PASSWORD) throw new Error("SMOKE_STUDENT_PASSWORD is required");
    const origin = new URL(baseURL).origin;
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text().slice(0, 180));
    });
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message.slice(0, 180));
    });
    const serverErrors: string[] = [];
    const onResponse = (response: Response) => {
      if (response.status() < 500) return;
      try {
        const url = new URL(response.url());
        if (url.origin !== origin) return;
        serverErrors.push(`${response.status()} ${url.pathname}`);
      } catch {
        // ignore non-URL responses
      }
    };
    page.on("response", onResponse);

    await loginViaApi(page.request, baseURL, EMAIL, PASSWORD);

    const timings: string[] = [];

    for (const board of BOARDS) {
      await test.step(board.label, async () => {
        const preference = await page.request.post(`${baseURL}/api/user/exam-preference`, {
          data: {
            examSlug: board.examSlug,
            ...(board.usmleFieldId ? { usmleFieldId: board.usmleFieldId } : {}),
          },
        });
        expect(preference.ok(), await preference.text()).toBeTruthy();
        const saved = (await preference.json()) as { examSlug?: string };
        expect(saved.examSlug).toBe(board.examSlug);

        const bankStarted = Date.now();
        await gotoApp(page, bankPath(board));
        const endActivity = page.getByRole("button", { name: /end activity/i }).first();
        const bankReady = await endActivity
          .waitFor({ state: "visible", timeout: BANK_BUDGET_MS })
          .then(() => true)
          .catch(() => false);
        const bankMs = Date.now() - bankStarted;
        timings.push(`${board.label} bank ${bankReady ? bankMs : "unavailable"}ms`);

        if (!bankReady) {
          const body = await page.locator("body").innerText();
          assertNoErrorCopy(body, `${board.label} question bank`);
          if (REQUIRE_SESSIONS) {
            throw new Error(`${board.label} bank did not show a question within ${BANK_BUDGET_MS}ms`);
          }
        } else {
          expect(bankMs, `${board.label} bank start`).toBeLessThan(BANK_BUDGET_MS);
          const body = await page.locator("body").innerText();
          assertNoErrorCopy(body, `${board.label} practice`);

          const navStarted = Date.now();
          const check = page.getByRole("button", { name: /^Check$/ }).first();
          if (await check.isVisible().catch(() => false)) {
            await check.click();
            await expect(page.getByText(/rationale|correct|incorrect|why/i).first()).toBeVisible({
              timeout: NAV_BUDGET_MS,
            });
          }
          const flag = page.getByRole("button", { name: /flag/i }).first();
          if (await flag.isVisible().catch(() => false)) await flag.click();
          const next = page.getByRole("button", { name: /^Next$/ }).first();
          if (await next.isVisible().catch(() => false)) await next.click();
          const back = page.getByRole("button", { name: /^Back$/ }).first();
          if (await back.isEnabled().catch(() => false)) await back.click();
          timings.push(`${board.label} bank nav ${Date.now() - navStarted}ms`);
        }

        if (board.examSlug === "mpje") {
          const examStarted = Date.now();
          await gotoApp(page, "/mpje/practice-exam");
          const begin = page.getByRole("button", { name: /begin practice exam/i });
          const intro = await begin
            .waitFor({ state: "visible", timeout: EXAM_BUDGET_MS })
            .then(() => true)
            .catch(() => false);
          const examMs = Date.now() - examStarted;
          timings.push(`${board.label} exam intro ${intro ? examMs : "unavailable"}ms`);
          if (!intro) {
            if (REQUIRE_FULL_EXAM) {
              throw new Error(`MPJE exam did not reach the intro within ${EXAM_BUDGET_MS}ms`);
            }
          } else {
            expect(examMs).toBeLessThan(EXAM_BUDGET_MS);
            const introText = await page.locator("body").innerText();
            expect(introText).toMatch(/120/);
            expect(introText).toMatch(/MPJE/i);
            if (REQUIRE_FULL_EXAM) {
              await begin.click();
              await expect(page.getByRole("button", { name: /next/i }).first()).toBeVisible({
                timeout: NAV_BUDGET_MS,
              });
              await expect(page.getByText(/\d+:\d{2}/).first()).toBeVisible();
              const flag = page.getByRole("button", { name: /^Flag$/ }).first();
              if (await flag.isVisible().catch(() => false)) await flag.click();
              await page.getByRole("button", { name: /end exam/i }).click();
              await expect(page.getByText(/score|result|correct/i).first()).toBeVisible({
                timeout: EXAM_BUDGET_MS,
              });
            }
          }
          return;
        }

        const examStarted = Date.now();
        const examQuery = new URLSearchParams({ mode: "full", autostart: REQUIRE_FULL_EXAM ? "1" : "0" });
        if (board.examSlug === "nclex") examQuery.set("nclexCat", "0");
        await gotoApp(page, `/full-exam/${board.examSlug}?${examQuery.toString()}`);
        if (!REQUIRE_FULL_EXAM) {
          await expect(page.getByRole("button", { name: /start/i }).first()).toBeVisible({
            timeout: EXAM_BUDGET_MS,
          });
          const launcher = await page.locator("body").innerText();
          assertNoErrorCopy(launcher, `${board.label} full exam`);
          expect(launcher).toMatch(board.marker);
          expect(launcher).toContain(String(board.fullQuestionCount));
          timings.push(`${board.label} exam launcher ${Date.now() - examStarted}ms`);
          return;
        }

        const firstQuestion = page.getByRole("button", { name: /^Next$/ }).first();
        const ready = await firstQuestion
          .waitFor({ state: "visible", timeout: EXAM_BUDGET_MS })
          .then(() => true)
          .catch(() => false);
        const examMs = Date.now() - examStarted;
        timings.push(`${board.label} exam ${ready ? examMs : "unavailable"}ms`);
        if (!ready) {
          const body = await page.locator("body").innerText();
          throw new Error(
            `${board.label} full exam did not show the first question within ${EXAM_BUDGET_MS}ms. ${body.slice(0, 240)}`
          );
        }
        expect(examMs).toBeLessThan(EXAM_BUDGET_MS);
        const sitting = await page.locator("body").innerText();
        assertNoErrorCopy(sitting, `${board.label} sitting`);
        await expect(page.getByText(/\d+:\d{2}/).first()).toBeVisible();
        const flag = page.getByRole("button", { name: /^Flag$/ }).first();
        if (await flag.isVisible().catch(() => false)) await flag.click();
        await page.getByRole("button", { name: /end exam/i }).click();
        await expect(page.getByText(/score|result|correct/i).first()).toBeVisible({
          timeout: EXAM_BUDGET_MS,
        });
      });
    }

    console.log(timings.join("\n"));
    const appConsoleErrors = consoleErrors.filter(
      (line) => !/favicon|failed to load resource/i.test(line)
    );
    expect(appConsoleErrors, appConsoleErrors.join(" | ")).toEqual([]);
    expect(serverErrors, serverErrors.join(", ")).toEqual([]);
  });
});
