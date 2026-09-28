import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  applyScoredClinicalCatalog,
  boardQuestionUnits,
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  formatRoundedDownQuestionCount,
  scoredQuestionCount,
  publishedSiteQuestionCounts,
  PUBLISHED_BOARD_UNITS,
  type BoardQuestionUnits,
  type CountBoardSlug,
  COUNT_BOARD_SLUGS,
} from "@/lib/counts";
import {
  buildLandingBankCountsDisplay,
  displayQuestionCountForField,
  displayTotalQuestionCount,
  type QuestionBankCountsSnapshot,
} from "@/lib/marketing/question-bank-counts";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import type { PublishedCatalog } from "@/lib/assessment/serve";

const NCLEX_UNITS = boardQuestionUnits({
  slug: "nclex",
  bankItems: 5425,
  formats: { mcq: 5425, ngn: 0, case: 0 },
  clinical: { standaloneNgn: 10, caseStudies: 10, caseItems: 60 },
});

describe("scored question counts", () => {
  it("counts case-study items and does not count the case shell", () => {
    expect(scoredQuestionCount(NCLEX_UNITS)).toBe(5495);
    expect(formatBoardQuestionSentence(NCLEX_UNITS)).toBe(
      "5,495 questions, including 60 items in 10 case studies and 10 standalone NGN items"
    );
    expect(formatRoundedDownQuestionCount(5495)).toBe("5,400+");
    expect(formatRoundedDownQuestionCount(99)).toBe("99");
    expect(formatRoundedDownQuestionCount(100)).toBe("100+");
  });

  it("keeps bank-item case rows inside the bank total", () => {
    const usmle = boardQuestionUnits({
      slug: "usmle",
      bankItems: 17276,
      formats: { mcq: 17101, ngn: 0, case: 175 },
    });
    expect(scoredQuestionCount(usmle)).toBe(17276);
    expect(formatBoardQuestionSentence(usmle)).toBe("17,276 questions");
    expect(usmle.bankCaseStyle).toBe(175);
  });

  it("adds standalone items and case items onto topic and area totals", () => {
    const catalog = {
      standalones: [{ subjectId: "management-of-care", item: { clientNeeds: {} } }],
      cases: [
        {
          subjectId: "management-of-care",
          items: [{}, {}, {}],
          caseDoc: { primaryClientNeed: "Management of Care" },
        },
      ],
    } as unknown as PublishedCatalog;
    const applied = applyScoredClinicalCatalog({
      fieldId: "nursing",
      bankTotal: 10,
      topicCounts: { "management-of-care": 10 },
      formats: { mcq: 10, ngn: 0, case: 0 },
      topicFormats: { "management-of-care": { mcq: 10, ngn: 0, case: 0 } },
      categories: [{ id: "management-of-care", label: "Management of Care", count: 10 }],
      catalog,
    });
    expect(applied.total).toBe(14);
    expect(applied.topicCounts["management-of-care"]).toBe(14);
    expect(applied.sessionCounts["management-of-care"]).toBe(10);
    expect(applied.formats).toEqual({ mcq: 10, ngn: 1, case: 1 });
    expect(applied.categories[0]?.count).toBe(14);
    expect(applied.unmappedTopics).toBe(0);
  });
});

const FIELD_FOR_SLUG = {
  nclex: "nursing",
  usmle: "usmle-step-2",
  naplex: "pharmacy",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
} as const;

function snapshotFor(boards: Record<CountBoardSlug, BoardQuestionUnits>): QuestionBankCountsSnapshot {
  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => {
      const slug = (Object.entries(FIELD_FOR_SLUG).find(([, id]) => id === fieldId)?.[0] ??
        null) as CountBoardSlug | null;
      const served = slug ? scoredQuestionCount(boards[slug]) : 0;
      return [fieldId, { fieldId, total: served, active: served, served }];
    })
  ) as QuestionBankCountsSnapshot["fields"];
  const served = COUNT_BOARD_SLUGS.reduce((sum, slug) => sum + scoredQuestionCount(boards[slug]), 0);
  return {
    fields,
    boards,
    totals: { total: served, active: served, served },
    updatedAt: "2026-09-27T00:00:00.000Z",
    degraded: false,
  };
}

describe("public count labels match the source", () => {
  it("renders each board's exact total and the NCLEX sentence", () => {
    const boards = PUBLISHED_BOARD_UNITS;
    const site = publishedSiteQuestionCounts();
    const display = buildLandingBankCountsDisplay(snapshotFor(boards));

    expect(site.totalQuestions).toBe(45207);
    expect(display.totalLabel).toBe(formatExactQuestionCount(site.totalQuestions));
    expect(display.totalServed).toBe(site.totalQuestions);
    expect(display.sentence).toBe(site.sentence);
    expect(display.roundedDown).toBe("45,200+");
    expect(display.sentence).toContain("60 items in 10 case studies");
    expect(display.sentence).toContain("10 standalone NGN items");

    for (const exam of display.exams) {
      const unitsForExam = boards[exam.slug as CountBoardSlug];
      const questions = scoredQuestionCount(unitsForExam);
      expect(exam.countLabel).toBe(formatExactQuestionCount(questions));
      expect(exam.served).toBe(questions);
      expect(exam.sentence).toBe(formatBoardQuestionSentence(unitsForExam));
      expect(displayQuestionCountForField(FIELD_FOR_SLUG[exam.slug as CountBoardSlug], snapshotFor(boards))).toBe(
        exam.countLabel
      );
      if (exam.roundedDown.endsWith("+")) {
        const rounded = Number(exam.roundedDown.replace(/[^0-9]/g, ""));
        expect(rounded).toBeLessThanOrEqual(questions);
      }
    }
    expect(displayTotalQuestionCount(snapshotFor(boards))).toBe("45,207");
  });
});

const FORBIDDEN_COUNT = /47,969|8,327|10,332|17,488|\b43,000\+|\b40,000\+|\b50,000\+/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const full = path.join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx)$/.test(name)) out.push(full);
  }
  return out;
}

describe("public pages do not embed a stale bank total", () => {
  it("fails when a rendered component hard-codes an old question total", () => {
    const root = path.resolve(process.cwd(), "src");
    const hits: string[] = [];
    for (const file of walk(root)) {
      const text = readFileSync(file, "utf8");
      if (FORBIDDEN_COUNT.test(text)) hits.push(path.relative(root, file));
    }
    expect(hits).toEqual([]);
  });
});
