import { describe, expect, it } from "vitest";
import { studentFacingExamName } from "@/lib/edtech/exams";
import {
  listedWeakTopics,
  trendAxisDay,
  weakTopicMissLabel,
} from "@/lib/learning/student-dashboard";
import { weakTopicSessionHref } from "@/lib/learning/weak-area-practice-href";
import { studyCitationsFromList, visibleStudyCitations } from "@/lib/questions/study-citations";

describe("study citations", () => {
  it("keeps a title and an https link, and drops a second copy of the title", () => {
    const citations = studyCitationsFromList([
      "ADA Standards of Care https://diabetesjournals.org/care",
      { label: "ADA Standards of Care", url: "https://diabetesjournals.org/care" },
      { label: "FDA labeling", citation: "metformin", url: "http://example.com/fda" },
    ]);
    expect(citations).toEqual([
      { title: "ADA Standards of Care", url: "https://diabetesjournals.org/care" },
      { title: "FDA labeling · metformin", url: "http://example.com/fda" },
    ]);
  });

  it("adds the provenance line when the reference list does not already include it", () => {
    const citations = visibleStudyCitations({
      references: ["Open RN"],
      sourceLabel: "Surviving Sepsis Campaign",
      sourceUrl: "https://www.sccm.org/sepsis",
    });
    expect(citations.map((row) => row.title)).toEqual(["Open RN", "Surviving Sepsis Campaign"]);
    expect(citations[1]?.url).toBe("https://www.sccm.org/sepsis");
  });
});

describe("selected USMLE step name", () => {
  it("names the saved step and leaves other boards on their catalog name", () => {
    expect(studentFacingExamName("usmle", "usmle-step-1")).toBe("USMLE Step 1");
    expect(studentFacingExamName("usmle", "usmle-step-2")).toBe("USMLE Step 2 CK");
    expect(studentFacingExamName("usmle", "usmle-step-3")).toBe("USMLE Step 3");
    expect(studentFacingExamName("usmle", "usmle-step-1")).not.toMatch(/Step 2/);
    expect(studentFacingExamName("nclex")).toBe("NCLEX-RN");
    expect(studentFacingExamName("naplex")).toBe("NAPLEX");
    expect(studentFacingExamName("pance")).toBe("PANCE");
    expect(studentFacingExamName("aanp-fnp")).toBe("AANP FNP-C");
  });
});

describe("weak area list", () => {
  it("waits for two attempts and says how many of those were missed", () => {
    expect(weakTopicMissLabel({ attempts: 1, misses: 1, masteryScore: 0 })).toBeNull();
    expect(weakTopicMissLabel({ attempts: 2, misses: 2, masteryScore: 0 })).toBe("2 of 2 missed");
    expect(weakTopicMissLabel({ attempts: 5, misses: 3, masteryScore: 40 })).toBe("3 of 5 missed");
    expect(
      listedWeakTopics([
        { id: "one", attempts: 1, misses: 1, masteryScore: 0 },
        { id: "two", attempts: 4, misses: 1, masteryScore: 75 },
      ]).map((row) => row.id)
    ).toEqual(["two"]);
  });

  it("sends every USMLE weak-area link to the same practice session for that topic", () => {
    const input = {
      examSlug: "usmle" as const,
      topicId: "subject:confidentiality-reporting",
      fieldId: "usmle-step-3",
    };
    const name = weakTopicSessionHref(input);
    const fix = weakTopicSessionHref({ ...input, fallbackHref: "/question-bank?subjectId=internal-medicine" });
    expect(name).toBe(fix);
    const url = new URL(name!, "https://anyexameasy.local");
    expect(url.searchParams.get("field")).toBe("usmle-step-3");
    expect(url.searchParams.get("subjectId")).toBe("confidentiality-reporting");
    expect(url.searchParams.get("count")).toBe("10");
    expect(url.searchParams.get("weakArea")).toBe("1");
    expect(name).not.toContain("internal-medicine");
    expect(name).not.toContain("usmle-step-2");
  });
});

describe("14-day trend axis", () => {
  it("uses the day number so the month label is not clipped", () => {
    expect(trendAxisDay("2026-11-08")).toBe("8");
    expect(trendAxisDay("2026-11-14")).toBe("14");
  });
});
