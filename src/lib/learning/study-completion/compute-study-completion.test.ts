import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  buildStudyCompletionResult,
  computeOverallPercent,
  coverageTargetQuestionCount,
  computeStudyCompletion,
  pillarProgressPercent,
} from "./compute-study-completion";
import { COMPLETION_RULES_V1 } from "./completion-rules-v1";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    questionBankItem: { count: vi.fn() },
    examSession: { count: vi.fn() },
    readinessCheck: { count: vi.fn() },
    $queryRaw: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

describe("buildStudyCompletionResult", () => {
  it("derives coverage target from live bank size and 85% rule", () => {
    const result = buildStudyCompletionResult("nclex", {
      liveBankCount: 1000,
      distinctBankItemsAttempted: 800,
      fastAttemptsExcluded: 12,
      fullLengthExamsCompleted: 1,
      readinessChecksCompleted: 0,
    });
    expect(result.pillars[0]).toMatchObject({
      done: 800,
      target: 850,
      met: false,
    });
    expect(result.coveragePercent).toBe(80);
    expect(result.ruleVersion).toBe("completion-rules-v1");
  });

  it("uses two full-length exams for AANP FNP", () => {
    const result = buildStudyCompletionResult("aanp-fnp", {
      liveBankCount: 500,
      distinctBankItemsAttempted: 500,
      fastAttemptsExcluded: 0,
      fullLengthExamsCompleted: 2,
      readinessChecksCompleted: 1,
    });
    const exams = result.pillars.find((p) => p.id === "full_length_exams");
    expect(exams).toMatchObject({ done: 2, target: 2, met: true });
    expect(result.pillars.every((p) => p.met)).toBe(true);
    expect(result.overallPercent).toBe(100);
  });

  it("averages pillar progress for overall percent", () => {
    const result = buildStudyCompletionResult("naplex", {
      liveBankCount: 100,
      distinctBankItemsAttempted: 85,
      fastAttemptsExcluded: 0,
      fullLengthExamsCompleted: 1,
      readinessChecksCompleted: 0,
    });
    expect(coverageTargetQuestionCount(100, 85)).toBe(85);
    expect(result.pillars[0].met).toBe(true);
    expect(computeOverallPercent(result.pillars)).toBe(result.overallPercent);
    expect(result.overallPercent).toBeGreaterThan(0);
    expect(result.overallPercent).toBeLessThan(100);
  });
});

describe("pillarProgressPercent", () => {
  it("caps at 100 and handles zero targets", () => {
    expect(pillarProgressPercent(5, 10)).toBe(50);
    expect(pillarProgressPercent(20, 10)).toBe(100);
    expect(pillarProgressPercent(0, 0)).toBe(0);
  });
});

describe("computeStudyCompletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads metrics from the database for a supported board", async () => {
    prismaMock.questionBankItem.count.mockResolvedValue(200);
    prismaMock.$queryRaw
      .mockResolvedValueOnce([{ count: BigInt(40) }])
      .mockResolvedValueOnce([{ count: BigInt(3) }]);
    prismaMock.examSession.count.mockResolvedValue(2);
    prismaMock.readinessCheck.count.mockResolvedValue(1);

    const result = await computeStudyCompletion("user_1", "pance");

    expect(result.examSlug).toBe("pance");
    expect(result.fieldId).toBe("pance");
    expect(result.fastAttemptsExcluded).toBe(3);
    expect(prismaMock.examSession.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user_1",
          examType: "pance",
          status: "completed",
          questionCount: 300,
        }),
      })
    );
  });

  it("rejects unsupported exam slugs", async () => {
    await expect(computeStudyCompletion("user_1", "usmle")).rejects.toThrow(
      /not configured/
    );
  });
});

describe("COMPLETION_RULES_V1", () => {
  it("exposes the expected defaults", () => {
    expect(COMPLETION_RULES_V1.version).toBe("completion-rules-v1");
    expect(COMPLETION_RULES_V1.coveragePercentTarget).toBe(85);
    expect(COMPLETION_RULES_V1.perExam["aanp-fnp"]?.fullLengthExamsTarget).toBe(2);
  });
});
