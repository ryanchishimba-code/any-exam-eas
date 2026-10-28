import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  buildStudyCompletionResult,
  computeOverallPercent,
  computeWeightedOverallPercent,
  computeStudyCompletion,
  pillarProgressPercent
} from "./compute-study-completion";
import { COMPLETION_RULES_V1 } from "./completion-rules-v1";
import { COMPLETION_RULES_V2 } from "./completion-rules-v2";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    questionBankItem: { count: vi.fn() },
    examSession: { count: vi.fn(), findFirst: vi.fn() },
    readinessCheck: { count: vi.fn(), findFirst: vi.fn() },
    quickBiteProgress: { count: vi.fn() },
    sgChapter: { count: vi.fn() },
    sgChapterProgress: { count: vi.fn() },
    $queryRaw: vi.fn()
}
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock
}));

vi.mock("@/lib/nclex-study-guide/queries", () => ({
  getPublishedGuide: vi.fn(async () => ({ id: "guide_nclex" }))
}));

describe("buildStudyCompletionResult", () => {
  it("derives coverage target from live bank size and 85% rule", () => {
    const result = buildStudyCompletionResult("nclex", {
      liveBankCount: 1000,
      distinctBankItemsAttempted: 800,
      fastAttemptsExcluded: 12,
      fullLengthExamsCompleted: 1,
      readinessChecksCompleted: 0,
      quickBitesCompleted: 0,
      quickBitesTotal: 0,
      studyGuideChaptersCompleted: 0,
      studyGuideChaptersTotal: 0
});
    expect(result.pillars[0]).toMatchObject({
      done: 800,
      target: 850,
      met: false
});
    expect(result.coveragePercent).toBe(80);
    expect(result.ruleVersion).toBe("completion-rules-v2");
  });

  it("uses ten full-length exams for every board including AANP FNP (v2)", () => {
    const result = buildStudyCompletionResult("aanp-fnp", {
      liveBankCount: 500,
      distinctBankItemsAttempted: 500,
      fastAttemptsExcluded: 0,
      fullLengthExamsCompleted: 10,
      readinessChecksCompleted: 1,
      quickBitesCompleted: 0,
      quickBitesTotal: 0,
      studyGuideChaptersCompleted: 10,
      studyGuideChaptersTotal: 10
});
    const exams = result.pillars.find((p) => p.id === "full_length_exams");
    expect(exams).toMatchObject({ done: 10, target: 10, met: true });
  });

  it("weights pillar progress for overall percent (v2)", () => {
    const result = buildStudyCompletionResult(
      "nclex",
      {
        liveBankCount: 1000,
        distinctBankItemsAttempted: 50,
        fastAttemptsExcluded: 0,
        fullLengthExamsCompleted: 3,
        readinessChecksCompleted: 0,
        quickBitesCompleted: 0,
        quickBitesTotal: 10,
        studyGuideChaptersCompleted: 0,
        studyGuideChaptersTotal: 20
},
      COMPLETION_RULES_V2
    );
    const manual = computeWeightedOverallPercent(
      result.pillars,
      COMPLETION_RULES_V2.pillarWeights
    );
    expect(result.overallPercent).toBe(manual);
    expect(result.overallPercent).toBeLessThan(35);
  });

  it("caps pillar percent for over-target completion", () => {
    expect(pillarProgressPercent(6, 3)).toBe(100);
  });
});

describe("pillarProgressPercent", () => {
  it("caps at 100 and handles zero targets", () => {
    expect(pillarProgressPercent(5, 10)).toBe(50);
    expect(pillarProgressPercent(20, 10)).toBe(100);
    expect(pillarProgressPercent(0, 0)).toBe(0);
  });
});

describe("computeOverallPercent (v1)", () => {
  it("averages pillar progress for legacy rules", () => {
    const pillars = buildStudyCompletionResult(
      "naplex",
      {
        liveBankCount: 100,
        distinctBankItemsAttempted: 85,
        fastAttemptsExcluded: 0,
        fullLengthExamsCompleted: 1,
        readinessChecksCompleted: 0,
        quickBitesCompleted: 0,
        quickBitesTotal: 0,
        studyGuideChaptersCompleted: 0,
        studyGuideChaptersTotal: 0
},
      COMPLETION_RULES_V1
    ).pillars;
    expect(computeOverallPercent(pillars)).toBeGreaterThan(0);
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
      .mockResolvedValueOnce([{ count: BigInt(3) }])
      .mockResolvedValueOnce([{ count: BigInt(40) }])
      .mockResolvedValueOnce([]);
    prismaMock.examSession.count.mockResolvedValue(2);
    prismaMock.examSession.findFirst.mockResolvedValue(null);
    prismaMock.readinessCheck.count.mockResolvedValue(1);
    prismaMock.readinessCheck.findFirst.mockResolvedValue(null);
    prismaMock.quickBiteProgress.count.mockResolvedValue(4);
    prismaMock.sgChapter.count.mockResolvedValue(30);
    prismaMock.sgChapterProgress.count.mockResolvedValue(2);

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
          questionCount: 300
})
})
    );
  });

  it("rejects unsupported exam slugs", async () => {
    await expect(computeStudyCompletion("user_1", "usmle")).rejects.toThrow(/not configured/);
  });
});

describe("COMPLETION_RULES_V1", () => {
  it("exposes the expected defaults", () => {
    expect(COMPLETION_RULES_V1.version).toBe("completion-rules-v1");
    expect(COMPLETION_RULES_V1.coveragePercentTarget).toBe(85);
    expect(COMPLETION_RULES_V1.perExam["aanp-fnp"]?.fullLengthExamsTarget).toBe(2);
  });
});

describe("COMPLETION_RULES_V2", () => {
  it("requires ten full-length exams on every board", () => {
    expect(COMPLETION_RULES_V2.fullLengthExamsTarget).toBe(10);
    expect(COMPLETION_RULES_V2.perExam["aanp-fnp"]?.fullLengthExamsTarget).toBeUndefined();
  });
});
