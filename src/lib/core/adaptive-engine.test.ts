import { describe, expect, it } from "vitest";
import {
  buildCandidateFromQuestion,
  scoreQuestion,
  selectQuestions,
  srsDueScore,
  updateMasteryAfterAttempt,
} from "./adaptive-engine";
import type { MasteryRecord, QuestionCandidate } from "./types";

function candidate(overrides: Partial<QuestionCandidate> & { questionKey: string }): QuestionCandidate {
  return {
    fieldId: "nursing",
    tags: ["cardiology"],
    difficulty: "medium",
    highYield: true,
    daysSinceLastAttempt: null,
    weaknessScore: 0.7,
    srsDueScore: 0.8,
    abilityEstimate: 0.4,
    ...overrides,
  };
}

describe("scoreQuestion", () => {
  it("ranks weak overdue high-yield items highest", () => {
    const weak = scoreQuestion(candidate({ questionKey: "a", weaknessScore: 0.9, srsDueScore: 0.9 }), {
      mode: "ADAPTIVE_QUIZ",
      targetDifficulty: "medium",
      count: 10,
    });
    const strong = scoreQuestion(candidate({ questionKey: "b", weaknessScore: 0.1, srsDueScore: 0.1, highYield: false }), {
      mode: "ADAPTIVE_QUIZ",
      targetDifficulty: "medium",
      count: 10,
    });
    expect(weak.totalScore).toBeGreaterThan(strong.totalScore);
    expect(weak.reasoning.length).toBeGreaterThan(0);
  });
});

describe("selectQuestions", () => {
  const pool = [
    candidate({ questionKey: "w1", weaknessScore: 0.85, tags: ["cardio"] }),
    candidate({ questionKey: "w2", weaknessScore: 0.8, tags: ["cardio"] }),
    candidate({ questionKey: "s1", weaknessScore: 0.2, tags: ["renal"] }),
    candidate({ questionKey: "s2", weaknessScore: 0.15, tags: ["renal"] }),
    candidate({ questionKey: "n1", weaknessScore: 0.3, daysSinceLastAttempt: null, tags: ["pulm"] }),
  ];

  it("prioritizes weak areas in WEAK_AREAS mode", () => {
    const result = selectQuestions(pool, {
      mode: "WEAK_AREAS",
      targetDifficulty: "medium",
      count: 3,
    });
    const keys = result.selections.map((s) => s.questionKey);
    expect(keys.filter((k) => k.startsWith("w"))).toHaveLength(2);
    expect(result.sessionRationale).toContain("weak-area");
  });

  it("returns reasoning per selection", () => {
    const result = selectQuestions(pool, {
      mode: "ADAPTIVE_QUIZ",
      targetDifficulty: "medium",
      count: 2,
    });
    expect(result.selections.every((s) => s.reasoning.length > 0)).toBe(true);
  });
});

describe("updateMasteryAfterAttempt", () => {
  it("extends interval on correct response", () => {
    const base: MasteryRecord = {
      questionKey: "q1",
      fieldId: "nursing",
      easeFactor: 2.5,
      intervalDays: 3,
      repetitions: 2,
      nextDue: new Date(),
      abilityEstimate: 0.5,
      lastAttemptAt: new Date(),
      correctStreak: 1,
    };
    const next = updateMasteryAfterAttempt(base, { correct: true, confidence: 4 });
    expect(next.repetitions).toBe(3);
    expect(next.intervalDays).toBeGreaterThan(3);
    expect(next.abilityEstimate).toBeGreaterThan(0.5);
  });

  it("resets interval on incorrect response", () => {
    const base: MasteryRecord = {
      questionKey: "q1",
      fieldId: "nursing",
      easeFactor: 2.5,
      intervalDays: 10,
      repetitions: 4,
      nextDue: new Date(),
      abilityEstimate: 0.7,
      lastAttemptAt: new Date(),
      correctStreak: 3,
    };
    const next = updateMasteryAfterAttempt(base, { correct: false });
    expect(next.repetitions).toBe(0);
    expect(next.intervalDays).toBe(1);
    expect(next.abilityEstimate).toBeLessThan(0.7);
  });
});

describe("srsDueScore", () => {
  it("returns high score when overdue", () => {
    const record: MasteryRecord = {
      questionKey: "q",
      fieldId: "nursing",
      easeFactor: 2.5,
      intervalDays: 3,
      repetitions: 2,
      nextDue: new Date(Date.now() - 48 * 60 * 60 * 1000),
      abilityEstimate: 0.5,
      lastAttemptAt: new Date(),
      correctStreak: 1,
    };
    expect(srsDueScore(record)).toBeGreaterThan(0.9);
  });
});

describe("buildCandidateFromQuestion", () => {
  it("maps mastery into candidate fields", () => {
    const c = buildCandidateFromQuestion({
      questionKey: "abc",
      fieldId: "nursing",
      tags: ["diabetes"],
      difficulty: "hard",
      highYield: true,
      mastery: null,
      weaknessScore: 0.6,
    });
    expect(c.difficulty).toBe("hard");
    expect(c.daysSinceLastAttempt).toBeNull();
  });
});
