import { describe, expect, it } from "vitest";
import { buildPracticeMeasure, type PracticeAnswer } from "@/lib/learning/practice-measure";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import {
  PRACTICE_BANK_STATS_REVALIDATE_SECONDS,
} from "@/lib/learning/served-bank-stats-cache";
import {
  buildServedBankStats,
  isCurrentlyServed,
  type ServedBankCategory,
  type ServedBankQuestion,
} from "@/lib/learning/served-bank-stats";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const categories: ServedBankCategory[] = [
  { id: "safety", label: "Safety", blueprintWeightPct: 40 },
  { id: "pharm", label: "Pharm", blueprintWeightPct: 60 },
];

function served(partial: Partial<ServedBankQuestion> & Pick<ServedBankQuestion, "id" | "domainId">): ServedBankQuestion {
  return {
    active: true,
    qaPassed: true,
    studentEligible: true,
    difficulty: 2,
    format: "mcq",
    ...partial,
  };
}

const NOW = "2026-11-07T12:00:00.000Z";

describe("served bank stats", () => {
  it("grows and shrinks a domain denominator when questions are added or hidden", () => {
    const questions = [
      served({ id: "a1", domainId: "safety" }),
      served({ id: "a2", domainId: "safety" }),
      served({ id: "a3", domainId: "safety", format: "select_all" }),
      served({ id: "a4", domainId: "safety", format: "ngn_bowtie" }),
    ];
    expect(buildServedBankStats({ categories, questions }).domains[0]).toMatchObject({
      servedCount: 4,
      depthMinimum: 4,
    });

    questions.push(
      served({ id: "a5", domainId: "safety" }),
      served({ id: "a6", domainId: "safety", difficulty: null })
    );
    expect(buildServedBankStats({ categories, questions }).domains[0]?.servedCount).toBe(6);

    questions[0] = { ...questions[0]!, active: false };
    questions[1] = { ...questions[1]!, qaPassed: false };
    questions[2] = { ...questions[2]!, studentEligible: false };
    questions[3] = { ...questions[3]!, codeHidden: true };
    const afterHide = buildServedBankStats({ categories, questions });
    expect(afterHide.domains.find((domain) => domain.id === "safety")).toMatchObject({
      servedCount: 2,
      depthMinimum: 2,
    });
    expect(isCurrentlyServed(questions[0]!)).toBe(false);
    expect(isCurrentlyServed(questions[5]!)).toBe(true);
  });

  it("adds a new blueprint domain without a written domain list", () => {
    const before = buildServedBankStats({
      categories,
      questions: [served({ id: "s1", domainId: "safety" })],
    });
    expect(before.domains.map((domain) => domain.id)).toEqual(["safety", "pharm"]);

    const withNewArea = buildServedBankStats({
      categories: [
        ...categories,
        { id: "renal", label: "Renal", blueprintWeightPct: 15 },
      ],
      questions: [
        served({ id: "s1", domainId: "safety" }),
        served({ id: "r1", domainId: "renal", format: "sata", difficulty: 4 }),
        served({ id: "r2", domainId: "renal", difficulty: null }),
      ],
    });
    expect(withNewArea.domains.map((domain) => domain.id)).toEqual(["safety", "pharm", "renal"]);
    expect(withNewArea.domains.find((domain) => domain.id === "renal")).toMatchObject({
      servedCount: 2,
      depthMinimum: 2,
      blueprintWeightPct: 15,
    });
    expect(withNewArea.domains.find((domain) => domain.id === "pharm")?.servedCount).toBe(0);
  });

  it("uses the served mean as the neutral difficulty and follows a re-rate", () => {
    const questions = [
      served({ id: "d1", domainId: "safety", difficulty: 2 }),
      served({ id: "d2", domainId: "safety", difficulty: 4 }),
      served({ id: "d3", domainId: "pharm", difficulty: null }),
    ];
    expect(buildServedBankStats({ categories, questions }).neutralDifficultyWeight).toBe(3);

    questions[1] = { ...questions[1]!, difficulty: 8 };
    expect(buildServedBankStats({ categories, questions }).neutralDifficultyWeight).toBe(5);
  });

  it("changes practice coverage when the served denominator changes", () => {
    const answers: PracticeAnswer[] = [
      {
        questionId: "seen-1",
        boardId: "nursing",
        domainId: "safety",
        correct: true,
        createdAt: NOW,
        difficulty: null,
      },
      {
        questionId: "seen-2",
        boardId: "nursing",
        domainId: "safety",
        correct: true,
        createdAt: NOW,
        difficulty: "4",
      },
    ];
    const bank = (servedCount: number, neutral: number) =>
      buildServedBankStats({
        categories: [{ id: "safety", label: "Safety", blueprintWeightPct: 100 }],
        questions: Array.from({ length: servedCount }, (_, index) =>
          served({
            id: `q${index}`,
            domainId: "safety",
            difficulty: index === 0 ? null : neutral,
          })
        ),
      });

    const tight = buildPracticeMeasure({
      boardId: "nursing",
      now: NOW,
      domains: [],
      answers,
      openIncorrect: 0,
      servedBank: bank(2, 2),
    });
    const wider = buildPracticeMeasure({
      boardId: "nursing",
      now: NOW,
      domains: [],
      answers,
      openIncorrect: 0,
      servedBank: bank(4, 2),
    });
    expect(tight.domains[0]?.denominator).toBe(2);
    expect(tight.domains[0]?.depthPct).toBe(100);
    expect(wider.domains[0]?.denominator).toBe(4);
    expect(wider.domains[0]?.depthPct).toBe(50);
    expect(wider.coveragePct).toBeLessThan(tight.coveragePct);

    const rerate = buildPracticeMeasure({
      boardId: "nursing",
      now: NOW,
      domains: [],
      answers: [
        { ...answers[0]!, difficulty: null },
        { ...answers[1]!, correct: false, difficulty: 2 },
      ],
      openIncorrect: 1,
      servedBank: bank(2, 2),
    });
    const rerated = buildPracticeMeasure({
      boardId: "nursing",
      now: NOW,
      domains: [],
      answers: [
        { ...answers[0]!, difficulty: null },
        { ...answers[1]!, correct: false, difficulty: 8 },
      ],
      openIncorrect: 1,
      servedBank: bank(2, 2),
    });
    expect(rerated.accuracyPct).toBeLessThan(rerate.accuracyPct);
  });

  it("reads the live serve gate and a one-minute cache", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/learning/served-bank-stats-cache.ts"),
      "utf8"
    );
    expect(PRACTICE_BANK_STATS_REVALIDATE_SECONDS).toBe(60);
    expect(source).toContain("revalidate: PRACTICE_BANK_STATS_REVALIDATE_SECONDS");
    expect(source).toContain("active = true");
    expect(source).toContain('"qaPassed" = true');
    expect(source).toContain("studentEligibleAndSql()");
    expect(studentEligibleAndSql()).toContain("studentEligibility,status");
    expect(source).not.toMatch(/DOMAIN_DEPTH_MIN|servedCount\s*=\s*\d{2,}/);
  });
});
