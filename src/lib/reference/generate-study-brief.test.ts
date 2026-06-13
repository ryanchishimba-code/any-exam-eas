import { describe, expect, it } from "vitest";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getPinnedMemoryCardIds } from "./pinned-essentials";

describe("generate-study-brief helpers", () => {
  it("pins exam-specific essentials for brief memoryCardIds", () => {
    for (const slug of Object.keys(EXAM_CATALOG) as Array<keyof typeof EXAM_CATALOG>) {
      expect(getPinnedMemoryCardIds(slug).length).toBeGreaterThan(0);
    }
  });
});
