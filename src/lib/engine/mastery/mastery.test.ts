import { describe, expect, it } from "vitest";
import {
  applyAttemptToCellState,
  deriveCellState,
  emptyCellState,
} from "@/lib/engine/mastery/transitions";
import { buildTodaySession, resolveTodaySize } from "@/lib/engine/mastery/session-builder";
import { computeMasteryRollup } from "@/lib/engine/mastery/rollup";
import type { SessionCandidate, SkillCellDef, UserCellStateSnapshot } from "@/lib/engine/mastery/types";

describe("mastery transitions", () => {
  it("starts unseen and moves to primed then learning", () => {
    let s = emptyCellState("nclex:safety:infection-control");
    expect(s.state).toBe("unseen");
    for (let i = 0; i < 4; i++) {
      s = applyAttemptToCellState(s, { correct: true, mode: "tutor" });
    }
    expect(s.state).toBe("primed");
    s = applyAttemptToCellState(s, { correct: false, mode: "tutor" });
    expect(s.state).toBe("learning");
  });

  it("marks shaky when last 8 accuracy < 65%", () => {
    const recentTutor = Array.from({ length: 8 }, (_, i) => ({
      correct: i < 2,
      mode: "tutor" as const,
      at: 1_000 + i,
    }));
    expect(
      deriveCellState({ itemsAnswered: 10, recentTutor, recentTimed: [] })
    ).toBe("shaky");
  });

  it("reaches stable then exam_ready with tutor + timed windows", () => {
    const day = 86_400_000;
    const recentTutor = Array.from({ length: 12 }, (_, i) => ({
      correct: true,
      mode: "tutor" as const,
      at: i < 6 ? 1 : 1 + day,
    }));
    expect(
      deriveCellState({ itemsAnswered: 20, recentTutor, recentTimed: [] })
    ).toBe("stable");

    const recentTimed = Array.from({ length: 8 }, (_, i) => ({
      correct: i !== 0,
      mode: "timed" as const,
      at: 2 + day * 2 + i,
    }));
    expect(
      deriveCellState({ itemsAnswered: 30, recentTutor, recentTimed })
    ).toBe("exam_ready");
  });
});

describe("today session builder", () => {
  it("prefers shaky/learning and caps consecutive same cell", () => {
    const candidates: SessionCandidate[] = [];
    for (let i = 0; i < 10; i++) {
      candidates.push({
        questionId: `shaky-${i}`,
        cellKey: "cell-a",
        systemKey: "a",
        weight: 18,
        distanceBelowBar: 0.9,
        cellState: "shaky",
        highYield: false,
        dueForSpacing: false,
      });
    }
    for (let i = 0; i < 10; i++) {
      candidates.push({
        questionId: `learn-${i}`,
        cellKey: "cell-b",
        systemKey: "b",
        weight: 16,
        distanceBelowBar: 0.5,
        cellState: "learning",
        highYield: false,
        dueForSpacing: false,
      });
    }
    for (let i = 0; i < 10; i++) {
      candidates.push({
        questionId: `unseen-${i}`,
        cellKey: "cell-c",
        systemKey: "c",
        weight: 14,
        distanceBelowBar: 1,
        cellState: "unseen",
        highYield: true,
        dueForSpacing: false,
        tags: { primerCardId: "primer-c" },
      });
    }

    const built = buildTodaySession(candidates, { size: 20 });
    expect(built.size).toBe(20);
    expect(resolveTodaySize(40)).toBe(40);

    // While ≥2 cells remain in the queue ahead, never exceed 3 consecutive.
    let maxStreak = 1;
    let streak = 1;
    for (let i = 1; i < built.questionIds.length; i++) {
      const prev = candidates.find((c) => c.questionId === built.questionIds[i - 1])!;
      const cur = candidates.find((c) => c.questionId === built.questionIds[i])!;
      const remainingCells = new Set(
        built.questionIds.slice(i).map((id) => candidates.find((c) => c.questionId === id)!.cellKey)
      );
      if (prev.cellKey === cur.cellKey) {
        streak += 1;
        if (remainingCells.size > 1) {
          maxStreak = Math.max(maxStreak, streak);
        }
      } else streak = 1;
    }
    expect(maxStreak).toBeLessThanOrEqual(3);
    expect(built.primers.length).toBeGreaterThanOrEqual(1);
  });

  it("with NAPLEX weights, Domain 3 is the largest share and calc share is kept", () => {
    const candidates: SessionCandidate[] = [];
    const domains = [
      { n: 1, weight: 25, key: "naplex-area1-foundations" },
      { n: 2, weight: 25, key: "naplex-area2-therapeutics" },
      { n: 3, weight: 40, key: "naplex-area3-treatment-planning" },
      { n: 4, weight: 5, key: "naplex-area4-safety" },
      { n: 5, weight: 5, key: "naplex-area5-management" },
    ] as const;

    for (const d of domains) {
      for (let i = 0; i < 30; i++) {
        candidates.push({
          questionId: `d${d.n}-${i}`,
          cellKey: `naplex:${d.key}:topic-${i % 5}`,
          systemKey: d.key,
          weight: d.weight,
          distanceBelowBar: d.n === 3 ? 0.95 : 0.5,
          cellState: i < 8 ? "shaky" : i < 16 ? "learning" : "unseen",
          highYield: false,
          dueForSpacing: false,
          tags: {
            naplexDomain: d.n,
            calcFlags: d.n === 1 && i % 2 === 0 ? ["mg-kg"] : [],
          },
        });
      }
    }

    const built = buildTodaySession(candidates, { size: 40, calcShareMin: 0.175 });
    expect(built.size).toBe(40);

    const share: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let calcCount = 0;
    for (const id of built.questionIds) {
      const c = candidates.find((x) => x.questionId === id)!;
      const d = c.tags?.naplexDomain ?? 3;
      share[d] = (share[d] ?? 0) + 1;
      if (c.tags?.calcFlags?.length) calcCount += 1;
    }

    expect(share[3]).toBeGreaterThanOrEqual(share[1]!);
    expect(share[3]).toBeGreaterThanOrEqual(share[2]!);
    expect(share[3]).toBeGreaterThanOrEqual(share[4]!);
    expect(share[3]).toBeGreaterThanOrEqual(share[5]!);
    expect(calcCount / built.size).toBeGreaterThanOrEqual(0.15);
  });
});

describe("mastery rollup", () => {
  it("computes coverage, competence, and top leaks", () => {
    const cells: SkillCellDef[] = [
      {
        cellKey: "c1",
        examSlug: "nclex",
        systemKey: "s1",
        systemLabel: "Safety",
        topicKey: "t1",
        topicLabel: "Infection",
        blueprintWeight: 50,
      },
      {
        cellKey: "c2",
        examSlug: "nclex",
        systemKey: "s2",
        systemLabel: "Pharm",
        topicKey: "t2",
        topicLabel: "Insulin",
        blueprintWeight: 50,
      },
    ];
    const states = new Map<string, UserCellStateSnapshot>([
      [
        "c1",
        {
          cellKey: "c1",
          state: "shaky",
          itemsAnswered: 10,
          recentTutor: [],
          recentTimed: [],
          lastSessionAt: null,
        },
      ],
      [
        "c2",
        {
          cellKey: "c2",
          state: "exam_ready",
          itemsAnswered: 40,
          recentTutor: [],
          recentTimed: [],
          lastSessionAt: null,
        },
      ],
    ]);

    const rollup = computeMasteryRollup({ cells, states });
    expect(rollup.coveragePct).toBe(100);
    expect(rollup.competencePct).toBe(50);
    expect(rollup.topLeaks[0]?.cellKey).toBe("c1");
  });
});
