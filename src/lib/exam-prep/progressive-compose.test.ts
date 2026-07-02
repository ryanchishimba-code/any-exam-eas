import { describe, expect, it } from "vitest";
import {
  LIVE_TIMED_EXAM_COMPOSE_TIERS,
  userFacingComposeTiers,
} from "@/lib/exam-prep/progressive-compose";

describe("live timed exam compose tiers", () => {
  it("uses a short ladder for user-facing timed exams", () => {
    expect(userFacingComposeTiers("pharmacy")).toHaveLength(3);
    expect(LIVE_TIMED_EXAM_COMPOSE_TIERS.map((t) => t.id)).toEqual([
      "strict",
      "balanced",
      "exact-fill",
    ]);
  });
});
