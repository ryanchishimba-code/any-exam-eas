import { describe, expect, it } from "vitest";
import { cappedPillarProgressPercent, pillarCountLabel } from "./pillar-display";
import type { StudyCompletionPillar } from "./compute-study-completion";

function pillar(overrides: Partial<StudyCompletionPillar>): StudyCompletionPillar {
  return {
    id: "full_length_exams",
    label: "Full-length practice exams",
    done: 6,
    target: 3,
    met: true,
    ...overrides,
  };
}

describe("pillar display helpers", () => {
  it("caps progress percent at the target", () => {
    expect(cappedPillarProgressPercent(pillar({ done: 6, target: 3 }))).toBe(100);
    expect(cappedPillarProgressPercent(pillar({ done: 1, target: 3, met: false }))).toBe(33);
  });

  it("shows capped counts with a check when met", () => {
    const label = pillarCountLabel(pillar({ done: 6, target: 3, met: true }));
    expect(label.primary).toBe("3 / 3 ✓");
    expect(label.extraDone).toBe(6);
  });
});
