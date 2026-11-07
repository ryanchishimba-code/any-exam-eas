import { describe, expect, it } from "vitest";
import {
  buildPracticeMeasure,
  decayWeight,
  difficultyWeight,
  needMoreAnswers,
  outlineCoveragePct,
  PRACTICE_MEASURE_DISCLAIMER,
  PRACTICE_MIN_ANSWERS,
  practiceGoalsHeadline,
  practiceScoreFromParts,
  readinessCheckPoints,
  type PracticeAnswer,
  type PracticeMeasureInput,
} from "./practice-measure";

const NOW = "2026-11-07T12:00:00.000Z";

function answer(partial: Partial<PracticeAnswer> & Pick<PracticeAnswer, "questionId">): PracticeAnswer {
  return {
    boardId: "nursing",
    domainId: "safety",
    correct: true,
    createdAt: NOW,
    difficulty: null,
    format: "multiple_choice",
    ...partial,
  };
}

function measure(partial: Partial<PracticeMeasureInput> & Pick<PracticeMeasureInput, "answers">) {
  return buildPracticeMeasure({
    boardId: "nursing",
    now: NOW,
    domains: [
      { id: "safety", label: "Safety", blueprintWeightPct: 40, href: "/q?safety" },
      { id: "pharm", label: "Pharm", blueprintWeightPct: 60, href: "/q?pharm" },
    ],
    openIncorrect: 0,
    ...partial,
  });
}

describe("practice measure", () => {
  it("starts at zero goals and asks for more answers", () => {
    const result = measure({ answers: [] });
    expect(result.score).toBe(0);
    expect(result.headline).toBe("0 of 3 practice goals met");
    expect(result.sampleNote).toBe(needMoreAnswers(0));
    expect(result.disclaimer).toBe(PRACTICE_MEASURE_DISCLAIMER);
    expect(result.criteria.every((goal) => goal.nextStep.includes("Need"))).toBe(true);
    expect(result.headline).not.toMatch(/Ready|Almost|Not yet|On track|Exam ready|pass/i);
  });

  it("counts outline weight in proportion to the per-domain minimum", () => {
    const coverage = outlineCoveragePct([
      { blueprintWeightPct: 75, answerCredit: 0 },
      { blueprintWeightPct: 25, answerCredit: 4 },
    ]);
    expect(coverage).toBe(13);
    expect(coverage).not.toBe(25);
  });

  it("keeps one board and ignores another board's answers", () => {
    const result = measure({
      answers: [
        answer({ questionId: "other", boardId: "pharmacy", correct: true }),
        answer({ questionId: "here", correct: true }),
      ],
    });
    expect(result.sampleCount).toBe(1);
    expect(result.domains.find((domain) => domain.id === "safety")?.answerCredit).toBe(1);
  });

  it("keeps the latest retake and drops the earlier attempt", () => {
    const result = measure({
      answers: [
        answer({
          questionId: "same",
          correct: false,
          createdAt: "2026-11-01T12:00:00.000Z",
        }),
        answer({ questionId: "same", correct: true, createdAt: NOW }),
      ],
    });
    expect(result.accuracyPct).toBe(100);
    expect(result.domains.find((domain) => domain.id === "safety")?.answerCredit).toBe(1);
  });

  it("drops deleted and hidden questions", () => {
    const result = measure({
      answers: [
        answer({ questionId: null, correct: true }),
        answer({ questionId: "gone", deleted: true, correct: true }),
        answer({ questionId: "hidden", hidden: true, correct: true }),
        answer({ questionId: "retired", active: false, correct: true }),
        answer({ questionId: "kept", correct: true }),
      ],
    });
    expect(result.sampleCount).toBe(1);
    expect(result.accuracyPct).toBe(100);
  });

  it("lets a very old answer decay below a fresh one", () => {
    const fresh = measure({ answers: [answer({ questionId: "now" })] });
    const ancient = measure({
      answers: [answer({ questionId: "old", createdAt: "2010-01-01T00:00:00.000Z" })],
    });
    expect(decayWeight("2010-01-01T00:00:00.000Z", NOW)).toBeLessThan(0.01);
    expect(ancient.score).toBeLessThan(fresh.score);
    expect(ancient.sampleCount).toBe(0);
    expect(ancient.sampleNote).toBe(`Need ${PRACTICE_MIN_ANSWERS} more answers.`);
  });

  it("weights difficulty only when the field is present and counts NGN and SATA", () => {
    expect(difficultyWeight(null)).toBe(1);
    expect(difficultyWeight("not-a-level")).toBe(1);
    expect(difficultyWeight(null, 2.5)).toBe(2.5);
    expect(difficultyWeight(5)).toBeGreaterThan(difficultyWeight(1));
    const easy = measure({
      answers: [
        answer({ questionId: "miss", correct: false, difficulty: "easy" }),
        answer({ questionId: "hit", correct: true, difficulty: "easy", domainId: "pharm" }),
      ],
    });
    const hard = measure({
      answers: [
        answer({ questionId: "miss", correct: false, difficulty: "easy" }),
        answer({ questionId: "hit", correct: true, difficulty: 5, format: "select_all", domainId: "pharm" }),
      ],
    });
    const sata = measure({
      answers: [answer({ questionId: "sata", format: "sata", correct: true })],
    });
    expect(hard.accuracyPct).toBeGreaterThan(easy.accuracyPct);
    expect(sata.score).toBeGreaterThan(0);
    expect(sata.sampleCount).toBe(1);
  });

  it("does not map an unscored check to 50", () => {
    const plain = measure({ answers: [answer({ questionId: "a" })] });
    const unscored = measure({
      answers: [answer({ questionId: "a" })],
      readinessCheck: { scored: false, level: "insufficient" },
    });
    expect(unscored.score).toBe(plain.score);
    expect(readinessCheckPoints("insufficient", true)).toBeNull();
    expect(readinessCheckPoints("insufficient", false)).toBeNull();
    expect(readinessCheckPoints("on_track", false)).toBeNull();
    expect(unscored.score).not.toBe(50);
  });

  it("refuses a high goal count from a tiny sample and names the next answer", () => {
    const answers = Array.from({ length: 8 }, (_, index) =>
      answer({ questionId: `q${index}`, domainId: "safety", correct: true })
    );
    const result = measure({ answers, openIncorrect: 0 });
    expect(result.goalsMet).toBe(0);
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.sampleNote).toMatch(/Need \d+ more answers/);
    expect(result.criteria.find((goal) => goal.id === "coverage")?.nextStep).toMatch(/Need/);
  });

  it("names the outline area to answer next once the sample is large enough", () => {
    const answers = [
      ...Array.from({ length: 40 }, (_, index) =>
        answer({ questionId: `s${index}`, domainId: "safety", correct: true })
      ),
    ];
    const result = measure({ answers, openIncorrect: 0 });
    const coverage = result.criteria.find((goal) => goal.id === "coverage");
    expect(coverage?.met).toBe(false);
    expect(coverage?.nextStep).toMatch(/Pharm/);
    expect(coverage?.nextStep).toMatch(/Answer/);
  });
});

describe("practice measure properties", () => {
  it("keeps every score inside 0–100", () => {
    const random = mulberry32(0x5b9e);
    for (let trial = 0; trial < 80; trial += 1) {
      const count = Math.floor(random() * 24);
      const answers = Array.from({ length: count }, (_, index) =>
        answer({
          questionId: random() < 0.1 ? null : `q${trial}-${index}`,
          boardId: random() < 0.2 ? "pharmacy" : "nursing",
          domainId: random() < 0.5 ? "safety" : "pharm",
          correct: random() > 0.4,
          createdAt: new Date(Date.parse(NOW) - random() * 400 * 86_400_000).toISOString(),
          difficulty: random() < 0.3 ? null : Math.ceil(random() * 5),
          format: random() < 0.5 ? "sata" : "multiple_choice",
          hidden: random() < 0.05,
          deleted: random() < 0.05,
        })
      );
      const result = measure({
        answers,
        openIncorrect: random() < 0.2 ? null : Math.floor(random() * 6),
      });
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.coveragePct).toBeGreaterThanOrEqual(0);
      expect(result.coveragePct).toBeLessThanOrEqual(100);
      expect(result.accuracyPct).toBeGreaterThanOrEqual(0);
      expect(result.accuracyPct).toBeLessThanOrEqual(100);
      expect(result.goalsMet).toBeGreaterThanOrEqual(0);
      expect(result.goalsMet).toBeLessThanOrEqual(3);
      expect(result.headline).toBe(practiceGoalsHeadline(result.goalsMet));
    }
  });

  it("does not decrease the score when a new correct answer is added", () => {
    let answers: PracticeAnswer[] = [];
    let previous = 0;
    for (let index = 0; index < 45; index += 1) {
      answers = [
        ...answers,
        answer({
          questionId: `grow-${index}`,
          domainId: index % 2 === 0 ? "safety" : "pharm",
          correct: true,
          difficulty: index % 3 === 0 ? "hard" : "medium",
          format: index % 4 === 0 ? "ngn" : "multiple_choice",
        }),
      ];
      const result = measure({ answers, openIncorrect: 0 });
      expect(result.score).toBeGreaterThanOrEqual(previous);
      expect(result.score).toBeLessThanOrEqual(100);
      previous = result.score;
    }
    expect(previous).toBeGreaterThan(0);
  });

  it("caps the parts score and stays monotonic as the sample grows", () => {
    let previous = 0;
    for (let sample = 0; sample <= PRACTICE_MIN_ANSWERS; sample += 1) {
      const score = practiceScoreFromParts({
        coveragePct: 100,
        accuracyPct: 100,
        remediationPct: 100,
        sampleCount: sample,
      });
      expect(score).toBeGreaterThanOrEqual(previous);
      expect(score).toBeLessThanOrEqual(100);
      if (sample === 0) expect(score).toBe(0);
      if (sample > 0 && sample < PRACTICE_MIN_ANSWERS) expect(score).toBeLessThanOrEqual(74);
      previous = score;
    }
    expect(previous).toBe(100);
  });
});

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
