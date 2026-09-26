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
  buildDeliberateFormatQuestionQuery,
  emptyFormatPracticeStats,
  formatPracticeStatsFromRows,
  isDeliberateFormatTopic,
  ngnStyleLabel,
  parsePracticeFormat,
  practiceFormatCountOptions,
  practiceFormatEmptyGuidance,
  practiceFormatPoolCount,
  practiceFormatScopeCounts,
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

describe("deliberate format subject wiring", () => {
  it("sends the selected topic and never mixed scope", () => {
    const qs = buildDeliberateFormatQuestionQuery({
      fieldId: "nursing",
      subjectId: "management-of-care",
      format: "ngn",
      limit: 5,
    });
    expect(qs).not.toBeNull();
    expect(qs!.get("field")).toBe("nursing");
    expect(qs!.get("subjectId")).toBe("management-of-care");
    expect(qs!.get("format")).toBe("ngn");
    expect(qs!.get("limit")).toBe("5");
    expect(qs!.get("mode")).toBe("bank");
    expect(qs!.get("meta")).toBe("0");
    expect(qs!.has("scope")).toBe(false);
    expect(qs!.has("mixed")).toBe(false);
    expect(qs!.get("subjectId")).not.toBe("__mixed__");
  });

  it("lets mixed topics sample the field and still refuses a blank topic", () => {
    expect(isDeliberateFormatTopic("__mixed__")).toBe(false);
    expect(isDeliberateFormatTopic("")).toBe(false);
    expect(isDeliberateFormatTopic("  ")).toBe(false);
    expect(isDeliberateFormatTopic(null)).toBe(false);
    expect(isDeliberateFormatTopic("management-of-care")).toBe(true);

    const mixed = buildDeliberateFormatQuestionQuery({
      fieldId: "nursing",
      subjectId: "__mixed__",
      format: "ngn",
      limit: 5,
    });
    expect(mixed).not.toBeNull();
    expect(mixed!.get("subjectId")).toBe("__mixed__");
    expect(mixed!.get("format")).toBe("ngn");
    expect(mixed!.get("field")).toBe("nursing");
    expect(mixed!.get("mode")).toBe("bank");
    expect(mixed!.has("scope")).toBe(false);
    expect(mixed!.has("mixed")).toBe(false);

    const pharmacyCases = buildDeliberateFormatQuestionQuery({
      fieldId: "pharmacy",
      subjectId: "__mixed__",
      format: "case",
      limit: 10,
    });
    expect(pharmacyCases!.get("subjectId")).toBe("__mixed__");
    expect(pharmacyCases!.get("format")).toBe("case");
    expect(pharmacyCases!.has("scope")).toBe(false);

    expect(
      buildDeliberateFormatQuestionQuery({
        fieldId: "nursing",
        subjectId: "",
        format: "case",
        limit: 5,
      })
    ).toBeNull();

    const cases = buildDeliberateFormatQuestionQuery({
      fieldId: "nursing",
      subjectId: "safety-and-infection-control",
      format: "case",
      limit: 10,
    });
    expect(cases?.get("subjectId")).toBe("safety-and-infection-control");
    expect(cases?.get("format")).toBe("case");
    expect(cases?.has("scope")).toBe(false);
    expect(cases?.has("mixed")).toBe(false);
  });

  it("starts mixed NGN and case sets from the field pool and blocks a blank topic", () => {
    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 5,
        formats,
        subjectId: "__mixed__",
        ngnLabel: "NGN",
      })
    ).toEqual({ ok: true, maxAvailable: 842 });

    expect(
      validatePracticeFormatSession({
        format: "case",
        questionCount: 5,
        formats,
        subjectId: "__mixed__",
      })
    ).toEqual({ ok: true, maxAvailable: 12 });

    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 5,
        formats: { mcq: 100, ngn: 0, case: 4 },
        subjectId: "__mixed__",
        ngnLabel: "NGN-style",
      })
    ).toMatchObject({ ok: false, emptyPool: true, maxAvailable: 0 });

    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 5,
        formats,
        subjectId: "",
        ngnLabel: "NGN-style",
      }).message
    ).toBe("Pick one topic for this NGN-style set.");

    expect(
      validatePracticeFormatSession({
        format: "ngn",
        questionCount: 5,
        formats,
        subjectId: "management-of-care",
      })
    ).toEqual({ ok: true, maxAvailable: 842 });

    expect(
      validatePracticeFormatSession({
        format: "all",
        questionCount: 25,
        formats,
        subjectId: "__mixed__",
      })
    ).toEqual({ ok: true });
  });

  it("scopes the displayed pool to the topic the session will serve", () => {
    const field = { mcq: 5000, ngn: 20, case: 24 };
    const topicFormats = {
      "management-of-care": { mcq: 40, ngn: 2, case: 0 },
      cardiology: { mcq: 10, ngn: 0, case: 6 },
    };
    expect(
      practiceFormatScopeCounts({
        subjectId: "__mixed__",
        formats: field,
        topicFormats,
      })
    ).toEqual(field);
    expect(
      practiceFormatPoolCount(
        "ngn",
        practiceFormatScopeCounts({
          subjectId: "management-of-care",
          formats: field,
          topicFormats,
        })
      )
    ).toBe(2);
    expect(
      practiceFormatPoolCount(
        "case",
        practiceFormatScopeCounts({
          subjectId: "cardiology",
          formats: field,
          topicFormats,
        })
      )
    ).toBe(6);
    expect(
      practiceFormatScopeCounts({
        subjectId: "empty-topic",
        formats: field,
        topicFormats,
      })
    ).toEqual({ mcq: 0, ngn: 0, case: 0 });
  });

  it("points an empty format at mixed topics or standard practice", () => {
    expect(
      practiceFormatEmptyGuidance({
        format: "case",
        subjectId: "__mixed__",
        scopeCount: 0,
        boardCount: 0,
        ngnLabel: "NGN",
      })
    ).toMatchObject({
      title: "Coming soon",
      detail: "Unfolding case studies are being rebuilt with RN review. Coming soon.",
      action: "all",
      actionLabel: "Practice standard questions",
    });

    expect(
      practiceFormatEmptyGuidance({
        format: "ngn",
        subjectId: "management-of-care",
        scopeCount: 0,
        boardCount: 20,
        ngnLabel: "NGN-style",
      })
    ).toMatchObject({
      title: "No NGN-style items in this topic",
      action: "mixed",
      actionLabel: "Practice mixed topics",
    });

    expect(
      practiceFormatEmptyGuidance({
        format: "ngn",
        subjectId: "__mixed__",
        scopeCount: 0,
        boardCount: 0,
        ngnLabel: "NGN",
        fieldId: "nursing",
      })?.detail
    ).toBe("Next Gen (NGN) case studies are being rebuilt with RN review. Coming soon.");

    expect(
      practiceFormatEmptyGuidance({
        format: "case",
        subjectId: "__mixed__",
        scopeCount: 0,
        boardCount: 0,
        ngnLabel: "NGN-style",
        fieldId: "pharmacy",
      })
    ).toMatchObject({
      title: "Coming soon",
      detail: "Case studies are being rebuilt with clinician review. Coming soon.",
      actionLabel: "Practice standard questions",
    });

    expect(
      practiceFormatEmptyGuidance({
        format: "ngn",
        subjectId: "__mixed__",
        scopeCount: 20,
        boardCount: 20,
      })
    ).toBeNull();
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
