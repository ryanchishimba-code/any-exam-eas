import { describe, expect, it } from "vitest";
import {
  sanitizeBoardUpdates,
  sanitizeFocusAreas,
  validateLibraryBrief,
} from "./brief-validation";
import type { LibraryStudyBrief } from "./study-brief-types";

describe("brief-validation", () => {
  it("sanitizes focus areas and drops empty pearls", () => {
    const areas = sanitizeFocusAreas(
      [
        {
          topicKey: "cardiology",
          topicName: "Cardiology",
          pearls: ["", "  ", "ACE inhibitors are first-line for HFrEF with reduced mortality."],
          studyAction: "Practice 10 cardiology questions.",
        },
        { topicKey: "", topicName: "Bad" },
      ],
      [{ id: "subject:cardiology", name: "Cardiology", masteryScore: 42 }]
    );
    expect(areas).toHaveLength(1);
    expect(areas[0]?.topicKey).toBe("cardiology");
    expect(areas[0]?.masteryScore).toBe(42);
    expect(areas[0]?.pearls.length).toBeGreaterThan(0);
  });

  it("dedupes board updates and caps length", () => {
    const updates = sanitizeBoardUpdates([
      "First high-yield pearl for boards.",
      "First high-yield pearl for boards.",
      "x",
      "Second clinically relevant update for students.",
    ]);
    expect(updates).toHaveLength(2);
  });

  it("validateLibraryBrief strips invalid sources", () => {
    const brief: LibraryStudyBrief = {
      generatedAt: new Date().toISOString(),
      examSlug: "nclex",
      headline: "  Focus review  ",
      summary: "Summary text.",
      focusAreas: [],
      boardUpdates: ["Valid update for boards."],
      sourceCount: 1,
      sources: [
        { title: "Open RN", url: "https://openrn.org", sourceType: "oer" },
        { title: "", url: "", sourceType: "web" },
      ],
      aiPowered: true,
      memoryCardIds: [],
    };
    const out = validateLibraryBrief(brief);
    expect(out.headline).toBe("Focus review");
    expect(out.sources).toHaveLength(1);
  });
});
