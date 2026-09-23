import { describe, expect, it } from "vitest";
import {
  CASE_ITEM_TYPES,
  NGN_ITEM_TYPES,
  classifyQuestionFormat,
  formatBucketItemTypeWhere,
  itemTypesForFormatBucket,
} from "@/lib/inventory/active-questions";
import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";
import {
  emptyFormatPracticeStats,
  formatPracticeStatsFromRows,
  ngnStyleLabel,
  parsePracticeFormat,
  practiceFormatCountOptions,
  practiceFormatPoolCount,
  practiceFormatTag,
  retainItemsForPracticeFormat,
  tagsForStoredAttempt,
  validatePracticeFormatSession,
} from "./practice-format";

const formats = { mcq: 5000, ngn: 842, case: 12 };

describe("practice format counts", () => {
  it("reads the inventory split without inventing a second total", () => {
    expect(practiceFormatPoolCount("ngn", formats)).toBe(842);
    expect(practiceFormatPoolCount("case", formats)).toBe(12);
    expect(practiceFormatPoolCount("all", formats)).toBeNull();
    expect(practiceFormatPoolCount("ngn", null)).toBeNull();
  });

  it("offers a small set when the published pool can fill one", () => {
    expect(practiceFormatCountOptions(842).map((option) => option.value)).toEqual([5, 10, 25]);
    expect(practiceFormatCountOptions(12).map((option) => option.value)).toEqual([5, 10]);
    expect(practiceFormatCountOptions(3)).toEqual([
      expect.objectContaining({ value: 3, description: "Entire published pool" }),
    ]);
    expect(practiceFormatCountOptions(0)).toEqual([]);
  });

  it("blocks an empty or unknown pool and accepts an honest size", () => {
    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 5,
        formats: { mcq: 10, ngn: 0, case: 4 },
      })
    ).toMatchObject({ ok: false, maxAvailable: 0 });

    expect(
      validatePracticeFormatSession({
        format: "case",
        questionCount: 5,
        formats: null,
      }).ok
    ).toBe(false);

    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 10,
        formats,
        ngnLabel: "NGN-style",
      })
    ).toEqual({ ok: true, maxAvailable: 842 });

    expect(
      validatePracticeFormatSession({
        format: "case",
        questionCount: 25,
        formats,
      }).ok
    ).toBe(false);
  });

  it("labels nursing NGN and other boards NGN-style", () => {
    expect(ngnStyleLabel("Client Needs", "nursing")).toBe("NGN");
    expect(ngnStyleLabel("Blueprint topics", "pharmacy")).toBe("NGN-style");
    expect(ngnStyleLabel(null, "nursing")).toBe("NGN");
    expect(parsePracticeFormat("NGN")).toBe("ngn");
    expect(parsePracticeFormat("mcq")).toBe("all");
  });
});

describe("practice format inventory match", () => {
  it("filters with the same item types inventory classifies", () => {
    for (const itemType of itemTypesForFormatBucket("ngn")) {
      expect(classifyQuestionFormat(itemType, false)).toBe("ngn");
      expect(NGN_ITEM_TYPES.has(itemType)).toBe(true);
    }
    for (const itemType of itemTypesForFormatBucket("case")) {
      expect(classifyQuestionFormat(itemType, false)).toBe("case");
      expect(CASE_ITEM_TYPES.has(itemType)).toBe(true);
    }
    expect(classifyQuestionFormat("vignette", false)).toBe("mcq");
    expect(classifyQuestionFormat("select_all", true)).toBe("case");

    const where = formatBucketItemTypeWhere("ngn");
    const listed = where.OR.map((clause) => clause.itemType.equals);
    expect(listed).toEqual([...NGN_ITEM_TYPES]);
  });

  it("drops items outside the requested bucket", () => {
    const kept = retainItemsForPracticeFormat(
      [
        { id: "a", itemType: "select_all" },
        { id: "b", itemType: "mcq" },
        { id: "c", itemType: "case_study" },
        { id: "d", itemType: "  NGN_Matrix " },
      ],
      "ngn"
    );
    expect(kept.map((item) => item.id)).toEqual(["a", "d"]);
  });
});

describe("practice format analytics tag", () => {
  it("stamps the session format without turning it into a study topic", () => {
    const tags = tagsForStoredAttempt(["management-of-care", "practice-format:case"], "ngn");
    expect(tags).toEqual(["management-of-care", practiceFormatTag("ngn")]);
    expect(isInternalMasteryConceptKey("tag:practice-format:ngn")).toBe(true);
    expect(isInternalMasteryConceptKey("subject:management-of-care")).toBe(false);
  });

  it("summarizes tagged attempts and stays at zero when none exist", () => {
    expect(emptyFormatPracticeStats()).toEqual({
      ngn: { attempts: 0, accuracy: null },
      case: { attempts: 0, accuracy: null },
    });
    expect(
      formatPracticeStatsFromRows([
        { bucket: "ngn", attempts: 4, correct: 3 },
        { bucket: "case", attempts: 1, correct: 0 },
        { bucket: "mcq", attempts: 9, correct: 9 },
      ])
    ).toEqual({
      ngn: { attempts: 4, accuracy: 75 },
      case: { attempts: 1, accuracy: 0 },
    });
  });
});
