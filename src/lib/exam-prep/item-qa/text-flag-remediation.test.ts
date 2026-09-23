import { describe, expect, it } from "vitest";
import { readItemQaRecord } from "./flag";
import { contentFromStoredItem } from "./rationale-schema";
import { evaluateItemPublishGate } from "./publish-gate";
import { lintItemText } from "./text-lint";
import {
  classifyTextFlagItem,
  planTextFlagRemediation,
  textFlagClearWrite,
  textFlagRetireWrite,
  type TextFlagBankRow,
} from "./text-flag-remediation";

const CHECKED_AT = "2026-09-23T02:56:35.724Z";
const RETIRED_AT = "2026-09-23T04:00:00.000Z";

function row(input: {
  id?: string;
  codes?: string[];
  stem?: string;
  options?: string[];
  ngnPayload?: Record<string, unknown>;
  explanation?: string;
  correctAnswer?: string;
  scenario?: string;
  summary?: string;
  qaPassed?: boolean;
  active?: boolean;
  reviewFlag?: boolean | null;
  fieldId?: string;
  partnerId?: string;
  extraMeta?: Record<string, unknown>;
}): TextFlagBankRow {
  const options = input.options ?? [
    "Hold the medication and notify the provider",
    "Give the next scheduled dose",
    "Double the dose tonight",
    "Document and continue the current plan",
  ];
  return {
    id: input.id ?? "item-1",
    fieldId: input.fieldId ?? "nursing",
    subjectId: "pharmacology-nursing",
    itemType: input.ngnPayload ? "ngn_bowtie" : "vignette",
    active: input.active ?? true,
    qaPassed: input.qaPassed ?? false,
    reviewFlag: input.reviewFlag === undefined ? true : input.reviewFlag,
    reviewStatus: "pending",
    stem: input.stem ?? "Which action should the nurse take first for this client?",
    scenario: input.scenario ?? null,
    options,
    ngnPayload: input.ngnPayload,
    correctAnswer: input.correctAnswer ?? options[0]!,
    explanation:
      input.explanation ??
      "Hold the dose and notify the provider. The other actions leave the client unprotected.",
    curationMeta: {
      cluster: "keep-me",
      ...(input.extraMeta ?? {}),
      itemQa: {
        pipeline: "item-qa-v1",
        checkedAt: CHECKED_AT,
        codes: input.codes ?? ["truncated_option"],
        summary: input.summary ?? "Option 1 looks truncated.",
        ...(input.partnerId ? { partnerId: input.partnerId } : {}),
      },
    },
  };
}

describe("text lint false positives the remediation relies on", () => {
  it("accepts a complete choice that ends in watch for", () => {
    const issues = lintItemText({
      stem: "Which action should the nurse take first for this client?",
      options: [
        "Educate the client about signs of bleeding to watch for",
        "Reassure the client that her INR is within therapeutic range",
        "Administer the next dose of warfarin as prescribed",
        "Notify the provider about the INR level",
      ],
      explanation: "An INR of 1.8 is below the therapeutic range, so the provider must adjust the dose.",
    });
    expect(issues.filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("still flags a choice that actually stops on and", () => {
    const issues = lintItemText({
      stem: "Which action should the nurse take first for this client?",
      options: ["Start IV fluids and", "Obtain blood cultures before antibiotics"],
      explanation: "Fluids restore perfusion before delayed tasks.",
    });
    expect(issues.map((issue) => issue.code)).toContain("truncated_option");
  });

  it("does not lint letter placeholders when the bow-tie choices are complete", () => {
    const content = contentFromStoredItem({
      question: "Bow-tie: Select ONE action and TWO findings to monitor.",
      options: JSON.stringify({
        kind: "bow_tie",
        condition: "Supratherapeutic INR",
        actions: ["Hold warfarin and notify the provider", "Give the next warfarin dose"],
        monitors: ["Signs of bleeding", "INR recheck"],
        options: ["A", "B", "C", "D"],
      }),
      correctAnswer: "Hold warfarin and notify the provider,Signs of bleeding,INR recheck",
      explanation: "A supratherapeutic INR with bleeding requires holding the anticoagulant and watching the trend.",
      itemType: "ngn_bowtie",
    });
    const text = evaluateItemPublishGate(content).issues.filter((issue) => issue.area === "text");
    expect(text).toEqual([]);
  });
});

describe("classifyTextFlagItem", () => {
  it("clears letter placeholders on a structured NGN item", () => {
    const classified = classifyTextFlagItem(
      row({
        codes: ["truncated_option"],
        summary: "Option 1 looks truncated (A).",
        stem: "Bow-tie: ONE priority action and TWO monitoring priorities.",
        options: ["A", "B", "C", "D"],
        ngnPayload: {
          kind: "bow_tie",
          actions: ["Hold warfarin and notify provider", "Give next warfarin dose"],
          monitors: ["Signs of bleeding", "INR recheck"],
        },
      })
    );
    expect(classified?.action).toBe("clear_false_positive");
    expect(classified?.triggeringOptions).toEqual(["A", "B", "C", "D"]);
    expect(classified?.studentFacingChoices).toEqual([
      "Hold warfarin and notify provider",
      "Give next warfarin dose",
      "Signs of bleeding",
      "INR recheck",
    ]);
  });

  it("clears a published choice that only ends in watch for", () => {
    const classified = classifyTextFlagItem(
      row({
        qaPassed: true,
        options: [
          "Educate the client about signs of bleeding to watch for",
          "Reassure the client that her INR is within therapeutic range",
          "Administer the next dose of warfarin as prescribed",
          "Notify the provider about the INR level",
        ],
      })
    );
    expect(classified?.action).toBe("clear_false_positive");
    expect(classified?.reason).toContain("watch for");
  });

  it("retires a one-word stem and does not invent a replacement", () => {
    const classified = classifyTextFlagItem(
      row({
        codes: ["empty_stem"],
        stem: "Priority?",
        scenario: "Peds unit: 18mo dehydration, cap refill 4 sec, tears absent, lethargic.",
        summary: "Question stem is missing or too short.",
      })
    );
    expect(classified).toMatchObject({ action: "retire", retireReason: "empty_stem" });
    expect(classified?.reason).toContain("Priority?");
    expect(classified?.proposedFixes).toEqual([]);
  });

  it("retires a letter-only MCQ that has no structured choices", () => {
    const classified = classifyTextFlagItem(
      row({
        codes: ["letter_only_option"],
        options: ["A", "B", "C", "D"],
      })
    );
    expect(classified).toMatchObject({ action: "retire", retireReason: "letter_only_option" });
  });

  it("reports a high-confidence completion and does not call it a retire", () => {
    const classified = classifyTextFlagItem(
      row({
        options: [
          "Start IV fluids and",
          "Obtain blood cultures before antibiotics",
          "Document and continue the current plan",
          "Reassure the client that the fever will pass",
        ],
        explanation:
          "Start IV fluids and draw cultures before antibiotics. The other actions delay resuscitation.",
      })
    );
    expect(classified?.action).toBe("fix_content");
    expect(classified?.proposedFixes).toEqual([
      {
        option: "Start IV fluids and",
        completion: "Start IV fluids and draw cultures before antibiotics",
      },
    ]);
  });

  it("leaves an ambiguous cut-off for a person", () => {
    const classified = classifyTextFlagItem(
      row({
        options: ["Start IV fluids and", "Obtain blood cultures before antibiotics"],
        explanation: "Resuscitation comes before delayed tasks.",
      })
    );
    expect(classified?.action).toBe("needs_human");
    expect(classified?.proposedFixes).toEqual([]);
  });

  it("does not classify a near-duplicate row as something this tool can write", () => {
    const classified = classifyTextFlagItem(
      row({
        codes: ["near_duplicate", "truncated_option"],
        partnerId: "item-a",
        options: ["Start IV fluids and"],
      })
    );
    expect(classified?.action).toBe("needs_human");
    expect(classified?.reason).toContain("near-duplicate");
  });
});

describe("planTextFlagRemediation", () => {
  it("splits retire, clear, fix, and human rows and leaves near-duplicates queued", () => {
    const plan = planTextFlagRemediation({
      fieldId: "nursing",
      rows: [
        row({ id: "clear-ngn", options: ["A", "B", "C", "D"], ngnPayload: {
          kind: "matrix",
          rows: ["Soap and water hand wash", "Alcohol gel only"],
          columns: ["Required", "Not sufficient"],
        }, stem: "Match each action to the correct category." }),
        row({ id: "retire-stem", codes: ["empty_stem"], stem: "Action?" }),
        row({
          id: "fix-me",
          options: ["Start IV fluids and", "Obtain blood cultures before antibiotics"],
          explanation: "Start IV fluids and draw cultures before antibiotics.",
        }),
        row({
          id: "ask-human",
          options: ["Start IV fluids and", "Obtain blood cultures before antibiotics"],
          explanation: "Resuscitation comes first.",
        }),
        row({ id: "dup-only", codes: ["near_duplicate"], partnerId: "keeper" }),
        row({ id: "other-board", fieldId: "pharmacy", codes: ["empty_stem"], stem: "Action?" }),
        row({ id: "quiet", reviewFlag: false, codes: ["empty_stem"], stem: "Action?" }),
      ],
    });

    expect(plan.clear.map((item) => item.id)).toEqual(["clear-ngn"]);
    expect(plan.retire.map((item) => item.id)).toEqual(["retire-stem"]);
    expect(plan.fixContent.map((item) => item.id)).toEqual(["fix-me"]);
    expect(plan.needsHuman.map((item) => item.id)).toEqual(["ask-human"]);
    expect(plan.leftInQueue).toBe(1);
    expect(plan.skipped.map((skip) => skip.reason).sort()).toEqual(["not_flagged", "other_field"]);
    expect(plan.publishedInventoryDrop).toBe(0);
    expect(plan.retire.some((item) => item.id === "dup-only")).toBe(false);
    expect(plan.clear.some((item) => item.id === "dup-only")).toBe(false);
  });

  it("counts a published retire toward the inventory drop and ignores an unpublished one", () => {
    const plan = planTextFlagRemediation({
      fieldId: "nursing",
      rows: [
        row({ id: "live", codes: ["empty_stem"], stem: "Priority?", qaPassed: true }),
        row({ id: "draft", codes: ["empty_stem"], stem: "Action?", qaPassed: false }),
      ],
    });
    expect(plan.publishedInventoryDrop).toBe(1);
    expect(plan.retire).toHaveLength(2);
  });
});

describe("text flag writes", () => {
  it("soft-retires an empty stem without touching qaPassed or other curation keys", () => {
    const source = row({ codes: ["empty_stem"], stem: "Priority?" });
    const write = textFlagRetireWrite({
      curationMeta: source.curationMeta,
      retiredAt: RETIRED_AT,
      retiredReason: "empty_stem",
    });
    expect(write).toMatchObject({ active: false, reviewFlag: false });
    expect(write && "qaPassed" in write).toBe(false);
    const saved = readItemQaRecord(write?.curationMeta);
    expect(saved).toMatchObject({
      codes: [],
      retiredAt: RETIRED_AT,
      retiredReason: "empty_stem",
    });
    expect(saved?.summary).toContain("empty_stem");
    expect((write?.curationMeta as { cluster?: string }).cluster).toBe("keep-me");
  });

  it("keeps a near-duplicate code if a text retire is ever applied to a mixed row", () => {
    const source = row({
      codes: ["near_duplicate", "empty_stem"],
      partnerId: "item-a",
      stem: "Priority?",
    });
    const write = textFlagRetireWrite({
      curationMeta: source.curationMeta,
      retiredAt: RETIRED_AT,
      retiredReason: "empty_stem",
    });
    expect(write?.reviewFlag).toBe(true);
    expect(readItemQaRecord(write?.curationMeta)).toMatchObject({
      codes: ["near_duplicate"],
      partnerId: "item-a",
      retiredReason: "empty_stem",
    });
  });

  it("clears a false-positive text flag and leaves active out of the write", () => {
    const source = row({ options: ["A", "B", "C", "D"] });
    const write = textFlagClearWrite({ curationMeta: source.curationMeta });
    expect(write).toEqual({
      reviewFlag: false,
      curationMeta: { cluster: "keep-me" },
    });
    expect(write && "active" in write).toBe(false);
    expect(write && "qaPassed" in write).toBe(false);
    expect(readItemQaRecord(write?.curationMeta)).toBeNull();
  });

  it("refuses a clear or retire when the row has no text code", () => {
    const source = row({ codes: ["near_duplicate"], partnerId: "item-a" });
    expect(textFlagClearWrite({ curationMeta: source.curationMeta })).toBeNull();
    expect(
      textFlagRetireWrite({
        curationMeta: source.curationMeta,
        retiredAt: RETIRED_AT,
        retiredReason: "empty_stem",
      })
    ).toBeNull();
  });
});
