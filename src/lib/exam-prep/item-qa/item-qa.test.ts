import { describe, expect, it } from "vitest";
import { findNearDuplicatePairs } from "./duplicates";
import {
  readItemQaRecord,
  schemaFailureCodesFromIssues,
  withItemQaRecord,
  withSchemaFailureFlag,
  withoutSchemaFailureFlag,
} from "./flag";
import { formatReviewMonth, resolveItemProvenance } from "./provenance";
import { principleFieldLabel } from "./principle-label";
import {
  editedItemNeedsSchemaGate,
  isExplicitAdminPublish,
  evaluateItemPublishGate,
  itemRequiresPublishSchema,
} from "./publish-gate";
import { contentFromStoredItem, evaluateRationaleSchema } from "./rationale-schema";
import { lintItemText } from "./text-lint";

const STEM =
  "Which intervention should the nurse perform first for this client with hypotension and fever?";
const OPTIONS = [
  "Administer the scheduled sliding-scale insulin",
  "Start a 30 mL/kg intravenous crystalloid bolus",
  "Recheck the complete blood count in six hours",
  "Reassure the client that the fever will pass",
];

describe("near-duplicate detection", () => {
  it("flags an exact stem and option copy and keeps the lower id", () => {
    const pairs = findNearDuplicatePairs([
      { id: "b", fieldId: "nursing", stem: STEM, options: OPTIONS },
      { id: "a", fieldId: "nursing", stem: `  ${STEM}  `, options: [...OPTIONS].reverse() },
    ]);
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ keepId: "a", flagId: "b", kind: "exact", stemSimilarity: 1 });
  });

  it("flags a near-copy stem when the options are also nearly the same", () => {
    const pairs = findNearDuplicatePairs([
      { id: "q1", fieldId: "pharmacy", stem: STEM, options: OPTIONS },
      {
        id: "q3",
        fieldId: "pharmacy",
        stem: STEM.replace("hypotension and fever", "hypotension plus fever"),
        options: [
          OPTIONS[0]!,
          OPTIONS[1]!.replace("intravenous", "IV"),
          OPTIONS[2]!,
          OPTIONS[3]!,
        ],
      },
    ]);
    expect(pairs.some((pair) => pair.kind !== "exact" && pair.stemSimilarity >= 0.84)).toBe(true);
  });

  it("does not flag the same wording on a different board", () => {
    const pairs = findNearDuplicatePairs([
      { id: "n1", fieldId: "nursing", stem: STEM, options: OPTIONS },
      { id: "p1", fieldId: "pharmacy", stem: STEM, options: OPTIONS },
    ]);
    expect(pairs).toHaveLength(0);
  });

  it("does not flag unrelated stems", () => {
    const pairs = findNearDuplicatePairs([
      { id: "1", fieldId: "usmle-step-2", stem: STEM, options: OPTIONS },
      {
        id: "2",
        fieldId: "usmle-step-2",
        stem: "A patient starting warfarin asks which over-the-counter analgesic is safest for an occasional headache.",
        options: [
          "Acetaminophen is generally preferred over NSAIDs",
          "Ibuprofen is preferred because it does not affect INR",
          "Aspirin 325 mg daily is recommended without an indication",
          "All OTC analgesics are equally safe with warfarin",
        ],
      },
    ]);
    expect(pairs).toHaveLength(0);
  });
});

describe("text lint", () => {
  it("detects truncated options, broken markdown, and encoding glitches", () => {
    const issues = lintItemText({
      stem: "Which action should the nurse take **first for this client?",
      options: [
        "Start IV fluids and ...",
        "cafÃ© monitoring only",
        "Obtain blood cultures before antibiotics",
        "Document and continue the current plan",
      ],
      explanation: "Fluids restore perfusion. The other options delay care.",
    });
    const codes = issues.map((issue) => issue.code);
    expect(codes).toContain("broken_markdown");
    expect(codes).toContain("truncated_option");
    expect(codes).toContain("encoding_glitch");
    expect(codes).not.toContain("letter_only_option");
  });

  it("flags letter-only A–D choices separately from truncated text", () => {
    const issues = lintItemText({
      stem: STEM,
      options: ["A", "b.", "(C)", "D)", "Start IV fluids and ...", "1"],
      explanation: "A crystalloid bolus treats hypoperfusion before routine tasks.",
    });
    const byOption = Object.fromEntries(issues.map((issue) => [issue.option, issue.code]));
    expect(byOption).toMatchObject({
      A: "letter_only_option",
      "b.": "letter_only_option",
      "(C)": "letter_only_option",
      "D)": "letter_only_option",
      "Start IV fluids and ...": "truncated_option",
    });
    expect(issues.some((issue) => issue.option === "1")).toBe(false);
    expect(issues.filter((issue) => issue.code === "letter_only_option")).toHaveLength(4);
    expect(issues.filter((issue) => issue.code === "truncated_option")).toHaveLength(1);
  });

  it("keeps a single non-letter character on truncated_option", () => {
    const issues = lintItemText({
      stem: STEM,
      options: ["E", "?", "Administer the scheduled dose"],
      explanation: "Give the scheduled dose. The other choices are not real options.",
    });
    expect(issues.map((issue) => issue.code)).toEqual(["truncated_option", "truncated_option"]);
  });

  it("still flags a bare watch for as truncated", () => {
    const issues = lintItemText({
      stem: STEM,
      options: ["watch for", "Notify the provider about the subtherapeutic INR"],
      explanation: "The INR is below the range used for atrial fibrillation, so the provider adjusts the dose.",
    });
    expect(issues.map((issue) => issue.code)).toContain("truncated_option");
  });

  it("accepts a complete choice that ends in to watch for", () => {
    const issues = lintItemText({
      stem: STEM,
      options: [
        "Educate the client about signs of bleeding to watch for",
        "Notify the provider about the subtherapeutic INR",
      ],
      explanation: "The INR is below the range used for atrial fibrillation, so the provider adjusts the dose.",
    });
    expect(issues.filter((issue) => issue.code === "truncated_option")).toEqual([]);
  });

  it("accepts a clean stem and four complete options", () => {
    const issues = lintItemText({
      stem: STEM,
      options: OPTIONS,
      explanation: "A crystalloid bolus treats hypoperfusion before routine tasks.",
    });
    expect(issues.filter((issue) => issue.severity === "error")).toHaveLength(0);
  });
});

describe("rationale schema", () => {
  it("requires a correct explanation, each distractor reason, and a principle", () => {
    const issues = evaluateRationaleSchema({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation: "Give fluids.",
    });
    const codes = new Set(issues.filter((issue) => issue.severity === "error").map((issue) => issue.code));
    expect(codes.has("missing_correct_explanation")).toBe(true);
    expect(codes.has("missing_distractor_reason")).toBe(true);
    expect(codes.has("missing_governing_principle")).toBe(true);
    expect(issues.some((issue) => issue.code === "missing_citation" && issue.severity === "warn")).toBe(
      true
    );
  });

  it("passes a structured item and only warns when the citation is absent", () => {
    const issues = evaluateRationaleSchema({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation:
        "Hypotension with fever is perfusion failure. A weight-based crystalloid bolus is the priority action in the first hour. Insulin, delayed labs, and reassurance do not restore circulating volume.",
      governingPrinciple: "Treat life-threatening perfusion problems before routine medications or delayed labs.",
      distractorRationale: {
        [OPTIONS[0]!]: "Sliding-scale insulin does not restore blood pressure in this first hour.",
        [OPTIONS[2]!]: "A delayed blood count misses the immediate resuscitation window.",
        [OPTIONS[3]!]: "Reassurance leaves hypotension untreated.",
      },
    });
    expect(issues.filter((issue) => issue.severity === "error")).toHaveLength(0);
    expect(issues.map((issue) => issue.code)).toEqual(["missing_citation"]);
  });

  it("reads principle, distractors, and citation from a stored row", () => {
    const content = contentFromStoredItem({
      question: STEM,
      options: JSON.stringify({
        options: OPTIONS,
        distractorRationale: {
          [OPTIONS[0]!]: "Sliding-scale insulin does not restore blood pressure in this first hour.",
          [OPTIONS[2]!]: "A delayed blood count misses the immediate resuscitation window.",
          [OPTIONS[3]!]: "Reassurance leaves hypotension untreated.",
        },
      }),
      correctAnswer: OPTIONS[1]!,
      explanation:
        "Hypotension with fever is perfusion failure. A weight-based crystalloid bolus is the priority action in the first hour.",
      itemType: "mcq",
      references: [{ label: "Surviving Sepsis Campaign", citation: "2021 update" }],
      generationMeta: {
        itemQaSchema: "v1",
        governingPrinciple: "Restore perfusion before routine tasks when shock is present.",
      },
    });
    const issues = evaluateRationaleSchema(content);
    expect(issues.filter((issue) => issue.severity === "error")).toHaveLength(0);
    expect(issues.some((issue) => issue.code === "missing_citation")).toBe(false);
  });

  it("accepts an expert clinical pearl as the governing principle", () => {
    const issues = evaluateRationaleSchema({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation:
        "Hypotension with fever is perfusion failure. A weight-based crystalloid bolus is the priority action in the first hour.",
      distractorRationale: {
        [OPTIONS[0]!]: "Sliding-scale insulin does not restore blood pressure in this first hour.",
        [OPTIONS[2]!]: "A delayed blood count misses the immediate resuscitation window.",
        [OPTIONS[3]!]: "Reassurance leaves hypotension untreated.",
      },
      expertRationale: {
        whyCorrect: { headline: "Restore circulating volume before routine medications." },
        clinicalPearl: "When shock cues are present, perfusion comes before scheduled medications.",
      },
    });
    expect(issues.some((issue) => issue.code === "missing_governing_principle")).toBe(false);
  });
});

describe("publish gate", () => {
  it("blocks a new manual publish that fails the schema and ignores citation warnings", () => {
    const gate = evaluateItemPublishGate({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation: "Too short.",
    });
    expect(gate.ok).toBe(false);
    expect(itemRequiresPublishSchema("manual", null)).toBe(true);
    expect(itemRequiresPublishSchema("seed", null)).toBe(false);
    expect(itemRequiresPublishSchema("seed", { itemQaSchema: "v1" })).toBe(true);
  });

  it("gates a served legacy edit and a first publish, and leaves an untouched served row alone", () => {
    expect(
      editedItemNeedsSchemaGate({
        source: "seed",
        generationMeta: null,
        wasServed: true,
        willBeServed: true,
        contentEdited: true,
        publishingAction: false,
      })
    ).toBe(true);
    expect(
      editedItemNeedsSchemaGate({
        source: "seed",
        generationMeta: null,
        wasServed: false,
        willBeServed: true,
        contentEdited: false,
        publishingAction: true,
      })
    ).toBe(true);
    expect(
      editedItemNeedsSchemaGate({
        source: "seed",
        generationMeta: null,
        wasServed: true,
        willBeServed: true,
        contentEdited: false,
        publishingAction: false,
      })
    ).toBe(false);
    expect(
      editedItemNeedsSchemaGate({
        source: "manual",
        generationMeta: null,
        wasServed: false,
        willBeServed: false,
        contentEdited: true,
        publishingAction: false,
      })
    ).toBe(false);
  });

  it("rejects an incomplete Approve and still allows an archived draft save", () => {
    const legacy = { source: "seed" as const, generationMeta: null };
    const incomplete = evaluateItemPublishGate({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation:
        "Hypotension with fever is perfusion failure. A weight-based crystalloid bolus is the priority action in the first hour.",
      distractorRationale: {
        [OPTIONS[0]!]: "",
        [OPTIONS[2]!]: "",
        [OPTIONS[3]!]: "",
      },
    });
    expect(incomplete.ok).toBe(false);
    expect(schemaFailureCodesFromIssues(incomplete.issues)).toContain("fails_schema");

    const approve = isExplicitAdminPublish({
      ...legacy,
      reviewStatus: "approved",
      active: true,
    });
    expect(approve).toBe(true);
    expect(
      editedItemNeedsSchemaGate({
        ...legacy,
        wasServed: false,
        willBeServed: false,
        contentEdited: false,
        publishingAction: approve,
      })
    ).toBe(true);

    const archivedSave = isExplicitAdminPublish(legacy);
    expect(archivedSave).toBe(false);
    expect(
      editedItemNeedsSchemaGate({
        ...legacy,
        wasServed: false,
        willBeServed: false,
        contentEdited: true,
        publishingAction: archivedSave,
      })
    ).toBe(false);

    expect(
      editedItemNeedsSchemaGate({
        ...legacy,
        wasServed: false,
        willBeServed: true,
        contentEdited: false,
        publishingAction: isExplicitAdminPublish({ ...legacy, qaPassed: true }),
      })
    ).toBe(true);
    expect(
      editedItemNeedsSchemaGate({
        ...legacy,
        wasServed: false,
        willBeServed: false,
        contentEdited: false,
        publishingAction: isExplicitAdminPublish({ ...legacy, active: true }),
      })
    ).toBe(false);

    const manualRestore = isExplicitAdminPublish({
      source: "manual",
      generationMeta: null,
      active: true,
    });
    expect(manualRestore).toBe(true);
    expect(
      editedItemNeedsSchemaGate({
        source: "manual",
        generationMeta: null,
        wasServed: false,
        willBeServed: false,
        contentEdited: false,
        publishingAction: manualRestore,
      })
    ).toBe(true);
  });

  it("allows a complete manual item to publish", () => {
    const gate = evaluateItemPublishGate({
      question: STEM,
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation:
        "Hypotension with fever is perfusion failure. A weight-based crystalloid bolus is the priority action in the first hour. The other choices delay that resuscitation.",
      governingPrinciple: "Restore perfusion before routine tasks when shock is present.",
      distractorRationale: {
        [OPTIONS[0]!]: "Sliding-scale insulin does not restore blood pressure in this first hour.",
        [OPTIONS[2]!]: "A delayed blood count misses the immediate resuscitation window.",
        [OPTIONS[3]!]: "Reassurance leaves hypotension untreated.",
      },
      references: [{ label: "Surviving Sepsis Campaign", citation: "2021 update" }],
    });
    expect(gate.ok).toBe(true);
  });
});

describe("provenance", () => {
  it("shows a citation and review month, not a pipeline source label", () => {
    const provenance = resolveItemProvenance({
      source: "seed",
      lastReviewedAt: "2026-06-01",
      references: [{ label: "Surviving Sepsis Campaign", citation: "2021 update" }],
    });
    expect(provenance.sourceLabel).toBe("Surviving Sepsis Campaign · 2021 update");
    expect(formatReviewMonth(provenance.reviewedAt)).toBe("Jun 2026");
    expect(resolveItemProvenance({ source: "curated" }).sourceLabel).toBeUndefined();
  });

  it("keeps a human source string that is not a pipeline tag", () => {
    expect(
      resolveItemProvenance({ source: "CDC isolation precautions" }).sourceLabel
    ).toBe("CDC isolation precautions");
  });

  it("reads a citation stored only on generationMeta and stays quiet without one", () => {
    const provenance = resolveItemProvenance({
      source: "curated",
      generationMeta: { citation: { label: "NCSBN delegation model" } },
      lastReviewedAt: "2026-09-01",
    });
    expect(provenance.sourceLabel).toBe("NCSBN delegation model");
    expect(formatReviewMonth(provenance.reviewedAt)).toBe("Sep 2026");
    expect(resolveItemProvenance({ source: "seed", references: [] }).sourceLabel).toBeUndefined();
    expect(resolveItemProvenance({ source: "seed" }).reviewedAt).toBeUndefined();
  });
});

describe("principle label", () => {
  it("localizes the shared principle field per board", () => {
    expect(principleFieldLabel("nursing")).toBe("Nursing priority");
    expect(principleFieldLabel("pharmacy")).toBe("Monitoring rule");
    expect(principleFieldLabel("usmle-step-2")).toBe("Clinical pearl");
    expect(principleFieldLabel("aanp-fnp")).toBe("Clinical pearl");
    expect(principleFieldLabel("npte-pt")).toBe("Intervention principle");
    expect(principleFieldLabel("anatomy")).toBe("Governing principle");
  });
});

describe("item QA flag record", () => {
  it("round-trips the queue payload and ignores other curation metadata", () => {
    const next = withItemQaRecord(
      { cluster: "abc" },
      {
        pipeline: "item-qa-v1",
        checkedAt: "2026-09-23T00:00:00.000Z",
        codes: ["truncated_option"],
        summary: "Option 2 looks truncated.",
        partnerId: "item-b",
      }
    );
    expect(readItemQaRecord(next)?.codes).toEqual(["truncated_option"]);
    expect(next.cluster).toBe("abc");
    expect(readItemQaRecord({ itemQa: { pipeline: "other" } })).toBeNull();
  });

  it("queues fails_schema beside other codes and clears only the schema codes", () => {
    const flagged = withSchemaFailureFlag(
      {
        itemQa: {
          pipeline: "item-qa-v1",
          checkedAt: "2026-09-01T00:00:00.000Z",
          codes: ["near_duplicate"],
          summary: "Near-duplicate of item-a.",
          partnerId: "item-a",
        },
      },
      [
        {
          area: "rationale",
          code: "missing_governing_principle",
          severity: "error",
          message: "Add the governing principle or priority rule.",
        },
        {
          area: "rationale",
          code: "missing_citation",
          severity: "warn",
          message: "Optional citation.",
        },
      ],
      "2026-09-23T00:00:00.000Z"
    );
    expect(flagged?.reviewFlag).toBe(true);
    expect(readItemQaRecord(flagged?.curationMeta)?.codes).toEqual([
      "near_duplicate",
      "fails_schema",
      "missing_governing_principle",
    ]);

    const cleared = withoutSchemaFailureFlag(flagged?.curationMeta, "2026-09-23T01:00:00.000Z");
    expect(cleared?.reviewFlag).toBe(true);
    expect(readItemQaRecord(cleared?.curationMeta)?.codes).toEqual(["near_duplicate"]);
  });
});
