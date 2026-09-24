import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contentFromStoredItem, evaluateRationaleSchema } from "./rationale-schema";
import {
  governingPrincipleWrite,
  parsePrincipleAllowlist,
  parseProposeGoverningPrincipleArgs,
  planGoverningPrincipleProposals,
  proposeGoverningPrinciple,
  type GoverningPrincipleBankRow,
} from "./governing-principle-proposal";

const OPTIONS = JSON.stringify([
  "Notify the provider and stay with the client",
  "Offer a warm blanket and revisit in an hour",
  "Ask the family to sit with the client",
  "Document the finding and finish the current task",
]);

function explanationWithReasoning(lead: string, hypotheses: string): string {
  return [
    lead,
    "",
    `Clinical reasoning: Recognize Cues: Review the stored findings. Analyze Cues: Compare the options. Prioritize Hypotheses: ${hypotheses}. Generate Solutions: Pick the matching action. Take Action: Carry out that action. Evaluate Outcomes: Reassess the client.`,
    "",
    "Why other options are incorrect:",
    "• Offer a warm blanket and revisit in an hour: Incorrect — comfort is not the priority while the client is unstable.",
  ].join("\n");
}

type Fixture = {
  id: string;
  explanation: string;
  clinicalReasoning?: string;
  keyTakeaways?: string[];
  expertPearl?: string;
  classification: "auto_extract" | "needs_human";
  proposedPrinciple: string;
  source?: string;
};

const LONG_PRIORITY = `The priority is to correct hypoxemia before routine comfort tasks ${"for this client ".repeat(11)}today.`;
const LONG_CORRECT = `Correct: The priority is to protect the airway and reassess oxygenation ${"before other tasks ".repeat(8)}today.`;

const FIXTURES: Fixture[] = [
  {
    id: "cmr0tijbt007t1yfn7cczbm8m",
    explanation: explanationWithReasoning(
      "Encouraging the client to express feelings is a key component of therapeutic communication. It allows the client to explore emotions and the nurse to gather more information. The other responses either minimize the client's feelings or are not open-ended.",
      "Facilitate expression of feelings"
    ),
    classification: "auto_extract",
    proposedPrinciple:
      "Encouraging the client to express feelings is a key component of therapeutic communication.",
    source: "lead_sentence",
  },
  {
    id: "cmr11ksog00bn1y8as6my6tym",
    explanation: explanationWithReasoning(
      "The correct answer is to reassess the client with a blood pressure of 88/54 mm Hg. This low blood pressure reading indicates potential hypovolemia or bleeding, which is a priority concern following surgery. Administering pain medication, assisting with ambulation, and providing education are important but can be addressed after ensuring the client's hemodynamic stability.",
      "Hemodynamic instability is the most urgent issue"
    ),
    classification: "auto_extract",
    proposedPrinciple:
      "This low blood pressure reading indicates potential hypovolemia or bleeding, which is a priority concern following surgery.",
    source: "lead_sentence",
  },
  {
    id: "cmr143vam00a31ygqy7y0c6o1",
    explanation: explanationWithReasoning(
      "Hyperkalemia is a potentially life-threatening condition that requires immediate attention. The nurse should notify the healthcare provider to initiate treatment. While administering sodium polystyrene sulfonate and holding spironolactone are appropriate, they should follow provider notification.",
      "Address life-threatening electrolyte imbalance"
    ),
    classification: "auto_extract",
    proposedPrinciple:
      "Hyperkalemia is a potentially life-threatening condition that requires immediate attention.",
    source: "lead_sentence",
  },
  {
    id: "cmr7g0twu007j1y59e1khmgo0",
    explanation: explanationWithReasoning(
      "Immediate safety is the priority for a client with suicidal ideation. One-to-one observation ensures the client is monitored closely to prevent self-harm.",
      "Immediate safety risk"
    ),
    classification: "auto_extract",
    proposedPrinciple: "Immediate safety is the priority for a client with suicidal ideation.",
    source: "lead_sentence",
  },
  {
    id: "cmr7gb7d1008r1y593qcgspe3",
    explanation: explanationWithReasoning(
      "The client is experiencing hypoxemia, as indicated by an oxygen saturation of 88% on 2 L/min of oxygen. The priority intervention is to increase the oxygen flow rate to improve oxygenation. Administering antibiotics and using an incentive spirometer are important but do not address the immediate need to correct hypoxemia.",
      "Immediate need to improve oxygenation"
    ),
    classification: "auto_extract",
    proposedPrinciple:
      "The priority intervention is to increase the oxygen flow rate to improve oxygenation.",
    source: "lead_sentence",
  },
  {
    id: "shape-notify-surgeon-first",
    explanation:
      "The nurse should first notify the surgeon about the client's concerns and questions before proceeding with the consent process. It is the surgeon's responsibility to make sure the client understands the procedure.",
    classification: "auto_extract",
    proposedPrinciple:
      "The nurse should first notify the surgeon about the client's concerns and questions before proceeding with the consent process.",
  },
  {
    id: "shape-cultures-before-antibiotics",
    explanation:
      "Obtaining blood cultures before starting antibiotics is critical to identify the causative organism and guide targeted therapy. Administering antibiotics is important but should follow culture collection.",
    classification: "auto_extract",
    proposedPrinciple:
      "Obtaining blood cultures before starting antibiotics is critical to identify the causative organism and guide targeted therapy.",
  },
  {
    id: "shape-pain-priority-line",
    explanation: explanationWithReasoning(
      "Administering morphine addresses the client's severe breakthrough pain, which is not adequately controlled by acetaminophen alone. Timely pain management supports recovery and prevents complications such as immobility.",
      "Effective pain control is the priority"
    ),
    classification: "auto_extract",
    proposedPrinciple: "Effective pain control is the priority",
    source: "prioritize_hypotheses",
  },
  {
    id: "shape-fluid-priority-line",
    explanation: explanationWithReasoning(
      "The client is experiencing fluid overload due to heart failure, evidenced by dyspnea, orthopnea, edema, and jugular venous distention. Administering a diuretic will help reduce fluid volume.",
      "Fluid reduction is critical"
    ),
    classification: "auto_extract",
    proposedPrinciple: "Fluid reduction is critical",
    source: "prioritize_hypotheses",
  },
  {
    id: "shape-correct-hemorrhage",
    explanation:
      "Correct: Active hemorrhage with hypotension is a circulation emergency and takes priority over stable tasks.\n**Why other options are incorrect**\n- Incorrect — Plausible nursing action but not the FIRST priority for this presentation.",
    classification: "auto_extract",
    proposedPrinciple:
      "Active hemorrhage with hypotension is a circulation emergency and takes priority over stable tasks.",
    source: "correct_label",
  },
  {
    id: "shape-correct-decontaminate",
    explanation:
      "Correct: For chemical exposures, decontaminate before definitive care when feasible to protect staff and other clients (NCSBN NCLEX-RN Test Plan).\n**Why other options are incorrect**\n- Incorrect — Teaching or screening task unrelated to acute findings in the stem.",
    classification: "auto_extract",
    proposedPrinciple:
      "For chemical exposures, decontaminate before definitive care when feasible to protect staff and other clients",
    source: "correct_label",
  },
  {
    id: "shape-informed-consent",
    explanation:
      "The nurse's role in informed consent is to verify that the client understands the procedure, risks, benefits, and alternatives. Providing a signature line alone does not meet that duty.",
    classification: "auto_extract",
    proposedPrinciple:
      "The nurse's role in informed consent is to verify that the client understands the procedure, risks, benefits, and alternatives.",
  },
  {
    id: "shape-expert-pearl",
    explanation:
      "A weight-based crystalloid bolus is the action described in the rationale. Delayed labs and reassurance do not restore circulating volume.",
    expertPearl: "Restore perfusion before routine tasks when shock is present.",
    classification: "auto_extract",
    proposedPrinciple: "Restore perfusion before routine tasks when shock is present.",
    source: "expert_pearl",
  },
  {
    id: "shape-delegation",
    explanation:
      "The nurse retains accountability and delegates only stable clients within the assistive personnel's scope of practice. Unstable findings stay with the nurse.",
    classification: "auto_extract",
    proposedPrinciple:
      "The nurse retains accountability and delegates only stable clients within the assistive personnel's scope of practice.",
  },
  {
    id: "shape-key-takeaway",
    explanation: "Document the refusal in the record and tell the charge nurse.",
    keyTakeaways: ["A competent adult may refuse treatment, and the team documents that decision."],
    classification: "auto_extract",
    proposedPrinciple: "A competent adult may refuse treatment, and the team documents that decision.",
    source: "key_takeaway",
  },
  {
    id: "shape-airway-most-important",
    explanation:
      "Airway protection is the most important action before any comfort measure in this overdose. Positioning and reassurance come afterward.",
    classification: "auto_extract",
    proposedPrinciple:
      "Airway protection is the most important action before any comfort measure in this overdose.",
  },
  {
    id: "shape-two-rules",
    explanation:
      "The client is short of breath on a nasal cannula. The priority is to correct hypoxemia before comfort measures. Notify the provider before leaving the bedside.",
    classification: "needs_human",
    proposedPrinciple: "The priority is to correct hypoxemia before comfort measures.",
  },
  {
    id: "shape-answer-restatement",
    explanation: explanationWithReasoning(
      "The correct answer is to reassess the client with a blood pressure of 88/54 mm Hg.",
      "Immediate safety risk"
    ),
    classification: "needs_human",
    proposedPrinciple: "The correct answer is to reassess the client with a blood pressure of 88/54 mm Hg.",
  },
  {
    id: "shape-distractor-only",
    explanation:
      "Give fluids now.\n\nWhy other options are incorrect:\n• Blanket: Incorrect — comfort is not the priority while the client is hypotensive.",
    classification: "needs_human",
    proposedPrinciple: "",
  },
  {
    id: "shape-rule-out",
    explanation: "The team should rule out infection with a focused exam.",
    classification: "needs_human",
    proposedPrinciple: "The team should rule out infection with a focused exam.",
  },
  {
    id: "shape-long-opening",
    explanation: LONG_PRIORITY,
    classification: "needs_human",
    proposedPrinciple: LONG_PRIORITY.replace(/\s+/g, " ").trim(),
  },
  {
    id: "shape-several-takeaways",
    explanation: "See the stored note.",
    keyTakeaways: [
      "Document the refusal and stay available to answer questions about alternatives.",
      "Call the charge nurse after the refusal is documented in the record.",
    ],
    classification: "needs_human",
    proposedPrinciple: "Document the refusal and stay available to answer questions about alternatives.",
    source: "key_takeaway",
  },
  {
    id: "shape-too-short",
    explanation: "Give fluids.",
    classification: "needs_human",
    proposedPrinciple: "",
    source: "none",
  },
  {
    id: "shape-long-correct-line",
    explanation: LONG_CORRECT,
    classification: "needs_human",
    source: "correct_label",
    proposedPrinciple: LONG_CORRECT.replace(/^\s*correct:\s+/i, "").replace(/\s+/g, " ").trim(),
  },
  {
    id: "shape-temporal-before",
    explanation:
      "The client walked before admission yesterday and then requested discharge teaching about diet.",
    classification: "needs_human",
    proposedPrinciple:
      "The client walked before admission yesterday and then requested discharge teaching about diet.",
  },
];

function row(input: {
  id?: string;
  fieldId?: string;
  active?: boolean;
  qaPassed?: boolean;
  stem?: string;
  explanation?: string;
  options?: string;
  generationMeta?: unknown;
  codes?: string[];
  partnerId?: string;
}): GoverningPrincipleBankRow {
  return {
    id: input.id ?? "item-1",
    fieldId: input.fieldId ?? "nursing",
    subjectId: "management-of-care",
    active: input.active ?? true,
    qaPassed: input.qaPassed ?? true,
    stem: input.stem ?? "Which action should the nurse take first?",
    explanation:
      input.explanation ??
      "Immediate safety is the priority for a client with suicidal ideation. One-to-one observation prevents self-harm.",
    options: input.options ?? OPTIONS,
    correctAnswer: "Notify the provider and stay with the client",
    itemType: "vignette",
    generationMeta: input.generationMeta ?? { model: "gpt-4o", batchId: "keep-me" },
    curationMeta: input.codes
      ? {
          cluster: "keep-me",
          itemQa: {
            pipeline: "item-qa-v1",
            checkedAt: "2026-09-24T00:00:00.000Z",
            codes: input.codes,
            summary: "Missing a governing principle.",
            ...(input.partnerId ? { partnerId: input.partnerId } : {}),
          },
        }
      : { cluster: "keep-me" },
  };
}

describe("governing principle extraction fixtures", () => {
  it("locks the 25-shape sample at 16 auto_extract and 9 needs_human", () => {
    expect(FIXTURES).toHaveLength(25);
    const counts = { auto_extract: 0, needs_human: 0 };
    for (const fixture of FIXTURES) counts[fixture.classification] += 1;
    expect(counts).toEqual({ auto_extract: 16, needs_human: 9 });
    expect(LONG_PRIORITY.replace(/\s+/g, " ").trim().length).toBeGreaterThan(200);
    expect(LONG_PRIORITY.replace(/\s+/g, " ").trim().length).toBeLessThanOrEqual(280);
    expect(LONG_CORRECT.replace(/^\s*correct:\s+/i, "").replace(/\s+/g, " ").trim().length).toBeGreaterThan(200);
    expect(LONG_CORRECT.replace(/^\s*correct:\s+/i, "").replace(/\s+/g, " ").trim().length).toBeLessThanOrEqual(280);
  });

  it.each(FIXTURES)("$id is $classification from stored text", (fixture) => {
    const proposal = proposeGoverningPrinciple(fixture);
    expect(proposal.classification).toBe(fixture.classification);
    expect(proposal.proposedPrinciple).toBe(fixture.proposedPrinciple);
    if (fixture.source) expect(proposal.source).toBe(fixture.source);
    if (fixture.proposedPrinciple) {
      const collapsedSources = [fixture.explanation, fixture.expertPearl ?? "", ...(fixture.keyTakeaways ?? [])]
        .join(" ")
        .replace(/\s+/g, " ")
        .toLowerCase();
      expect(collapsedSources).toContain(fixture.proposedPrinciple.toLowerCase());
    }
  });

  it("does not quote a distractor line as the principle", () => {
    const proposal = proposeGoverningPrinciple({
      explanation: FIXTURES.find((fixture) => fixture.id === "shape-distractor-only")!.explanation,
    });
    expect(proposal.proposedPrinciple).not.toMatch(/not the priority/i);
    expect(proposal.proposedPrinciple).not.toMatch(/why other options/i);
  });

  it("treats ABC prioritization as a principle cue and ignores the numbered CJMM steps", () => {
    const proposal = proposeGoverningPrinciple({
      explanation: [
        "Clinical Judgment (CJMM):",
        "1. Recognize cues: Review the client presentation and clinical data in the scenario.",
        "2. Analyze cues: Prioritize ABCs, acute versus stable findings, and scope of nursing practice.",
        "3. Take action: Client in room 512 with chest pain is the best nursing response for this situation.",
        "4. Evaluate outcomes: Reassess the client after intervention and document findings per facility policy.",
        "",
        "Correct answer: Client in room 512 with chest pain. Client in room 512 with chest pain represents an acute change requiring immediate assessment using ABC prioritization.",
      ].join("\n"),
    });
    expect(proposal).toMatchObject({
      classification: "auto_extract",
      proposedPrinciple:
        "Client in room 512 with chest pain represents an acute change requiring immediate assessment using ABC prioritization.",
    });
    expect(proposal.proposedPrinciple).not.toMatch(/Review the client presentation/i);
  });

  it("uses a separate clinical-reasoning field when the explanation has no rule", () => {
    const proposal = proposeGoverningPrinciple({
      explanation: "The note describes the finding and the chosen action.",
      clinicalReasoning:
        "The priority is to correct hypoxemia before collecting a routine sputum sample.",
    });
    expect(proposal).toMatchObject({
      classification: "auto_extract",
      source: "clinical_reasoning",
      proposedPrinciple: "The priority is to correct hypoxemia before collecting a routine sputum sample.",
    });
  });
});

describe("governing principle plan", () => {
  it("keeps other fields out and includes an unflagged principle gap", () => {
    const plan = planGoverningPrincipleProposals({
      fieldId: "nursing",
      rows: [
        row({
          id: "pharmacy-gap",
          fieldId: "pharmacy",
          explanation:
            "Check the level before the next dose when the trough is still above the target range.",
        }),
        row({
          id: "unflagged-gap",
          codes: undefined,
          explanation:
            "Immediate safety is the priority for a client with suicidal ideation. Stay with the client.",
        }),
        row({
          id: "flagged-gap",
          codes: ["missing_governing_principle", "fails_schema"],
          explanation:
            "Hyperkalemia is a potentially life-threatening condition that requires immediate attention.",
        }),
        row({
          id: "already-ok",
          codes: ["missing_governing_principle", "fails_schema"],
          generationMeta: {
            model: "gpt-4o",
            governingPrinciple: "Restore perfusion before routine tasks when shock is present.",
          },
          explanation:
            "A weight-based crystalloid bolus is the action described in the rationale for this shock vignette.",
        }),
        row({ id: "inactive-gap", active: false }),
        row({
          id: "near-dup",
          codes: ["near_duplicate", "missing_governing_principle", "fails_schema"],
          partnerId: "keeper",
        }),
      ],
    });

    expect(plan.skipped.map((skip) => [skip.id, skip.reason])).toEqual([
      ["already-ok", "already_resolved"],
      ["inactive-gap", "inactive"],
      ["near-dup", "near_duplicate"],
      ["pharmacy-gap", "other_field"],
    ]);
    expect(plan.autoExtract.map((item) => item.id)).toEqual(["flagged-gap", "unflagged-gap"]);
    expect(plan.needsHuman).toEqual([]);
    expect(plan.failingPrincipleBefore).toBe(2);
    expect(plan.wouldWrite).toBe(2);
    expect(plan.failingPrincipleAfter).toBe(0);
    expect(plan.autoExtract.every((item) => item.wouldWrite)).toBe(true);
  });

  it("does not write a near-duplicate row or a needs_human row unless that id is allowlisted", () => {
    const needsHuman = row({
      id: "needs-human",
      codes: ["missing_governing_principle", "fails_schema"],
      explanation:
        "The client is short of breath on a nasal cannula. The priority is to correct hypoxemia before comfort measures. Notify the provider before leaving the bedside.",
    });
    const duplicate = row({
      id: "near-dup",
      codes: ["near_duplicate"],
      explanation:
        "Immediate safety is the priority for a client with suicidal ideation. Stay with the client.",
    });
    const blocked = planGoverningPrincipleProposals({
      fieldId: "nursing",
      rows: [needsHuman, duplicate],
    });
    expect(blocked.needsHuman.map((item) => item.id)).toEqual(["needs-human"]);
    expect(blocked.needsHuman[0]?.wouldWrite).toBe(false);
    expect(blocked.wouldWrite).toBe(0);
    expect(blocked.failingPrincipleAfter).toBe(1);
    expect(blocked.skipped.map((skip) => skip.id)).toContain("near-dup");

    const reviewed = planGoverningPrincipleProposals({
      fieldId: "nursing",
      rows: [needsHuman, duplicate],
      allowlist: new Set(["needs-human", "near-dup"]),
    });
    expect(reviewed.needsHuman[0]?.wouldWrite).toBe(true);
    expect(reviewed.wouldWrite).toBe(1);
    expect(reviewed.autoExtract.some((item) => item.id === "near-dup")).toBe(false);
  });

  it("stops after the limit and leaves a stored short principle for review", () => {
    const plan = planGoverningPrincipleProposals({
      fieldId: "nursing",
      limit: 1,
      rows: [
        row({ id: "b-second" }),
        row({
          id: "a-short-stored",
          generationMeta: { model: "gpt-4o", governingPrinciple: "Safety first" },
        }),
        row({ id: "c-third" }),
      ],
    });
    expect(plan.truncated).toBe(true);
    expect(plan.needsHuman.map((item) => item.id)).toEqual(["a-short-stored"]);
    expect(plan.autoExtract).toEqual([]);
    expect(plan.needsHuman[0]?.wouldWrite).toBe(false);
    expect(plan.needsHuman[0]?.reason).toMatch(/shorter governingPrinciple/i);
    expect(plan.failingPrincipleBefore).toBe(1);
    expect(plan.failingPrincipleAfter).toBe(1);
  });
});

describe("governing principle writes", () => {
  const auto = proposeGoverningPrinciple({
    explanation: "Immediate safety is the priority for a client with suicidal ideation.",
  });

  it("refuses a write when --apply was not passed", () => {
    expect(
      governingPrincipleWrite({
        apply: false,
        generationMeta: { model: "gpt-4o", batchId: "keep-me" },
        proposedPrinciple: auto.proposedPrinciple,
        classification: "auto_extract",
        allowlistActive: false,
        idAllowlisted: false,
        nearDuplicate: false,
      })
    ).toBeNull();
    expect(parseProposeGoverningPrincipleArgs(["--field", "nursing", "--subject", "management-of-care"]).apply).toBe(
      false
    );
    expect(() =>
      parseProposeGoverningPrincipleArgs(["--field", "nursing", "--apply", "--dry-run"])
    ).toThrow(/No rows were changed/);
    expect(() => parseProposeGoverningPrincipleArgs(["--apply"])).toThrow(/--field/);
  });

  it("writes governingPrinciple only and leaves the rest of generationMeta in place", () => {
    const write = governingPrincipleWrite({
      apply: true,
      generationMeta: { model: "gpt-4o", batchId: "keep-me" },
      proposedPrinciple: auto.proposedPrinciple,
      classification: "auto_extract",
      allowlistActive: false,
      idAllowlisted: false,
      nearDuplicate: false,
    });
    expect(write && Object.keys(write)).toEqual(["generationMeta"]);
    expect(write?.generationMeta).toEqual({
      model: "gpt-4o",
      batchId: "keep-me",
      governingPrinciple: "Immediate safety is the priority for a client with suicidal ideation.",
    });
    for (const key of ["question", "options", "explanation", "correctAnswer", "qaPassed", "active", "reviewFlag", "curationMeta"]) {
      expect(write).not.toHaveProperty(key);
      expect(write?.generationMeta).not.toHaveProperty(key);
    }

    const content = contentFromStoredItem({
      question: "Which action should the nurse take first?",
      options: OPTIONS,
      correctAnswer: "Notify the provider and stay with the client",
      explanation: "Immediate safety is the priority for a client with suicidal ideation.",
      generationMeta: write?.generationMeta,
    });
    expect(content.explanation).toBe(
      "Immediate safety is the priority for a client with suicidal ideation."
    );
    expect(
      evaluateRationaleSchema(content).some((issue) => issue.code === "missing_governing_principle")
    ).toBe(false);
  });

  it("does not write needs_human, near-duplicates, or a non-object generationMeta", () => {
    const base = {
      proposedPrinciple: "The priority is to correct hypoxemia before comfort measures.",
      classification: "needs_human" as const,
      nearDuplicate: false,
      idAllowlisted: false,
      allowlistActive: false,
      generationMeta: { model: "gpt-4o" },
    };
    expect(governingPrincipleWrite({ ...base, apply: true })).toBeNull();
    expect(
      governingPrincipleWrite({
        ...base,
        apply: true,
        classification: "auto_extract",
        nearDuplicate: true,
        allowlistActive: true,
        idAllowlisted: true,
      })
    ).toBeNull();
    expect(
      governingPrincipleWrite({
        apply: true,
        classification: "auto_extract",
        proposedPrinciple: auto.proposedPrinciple,
        generationMeta: ["not-an-object"],
        allowlistActive: false,
        idAllowlisted: false,
        nearDuplicate: false,
      })
    ).toBeNull();
    const reviewed = governingPrincipleWrite({
      ...base,
      apply: true,
      allowlistActive: true,
      idAllowlisted: true,
    });
    expect(reviewed?.generationMeta.governingPrinciple).toBe(base.proposedPrinciple);
    expect(reviewed?.generationMeta.model).toBe("gpt-4o");
  });

  it("parses an allowlist of one id per line", () => {
    expect(parsePrincipleAllowlist("# review batch\n\ncmr0tijbt007t1yfn7cczbm8m\ncmr7g0twu007j1y59e1khmgo0\n")).toEqual([
      "cmr0tijbt007t1yfn7cczbm8m",
      "cmr7g0twu007j1y59e1khmgo0",
    ]);
    expect(() => parsePrincipleAllowlist("one two")).toThrow(/No rows were changed/);
  });
});

describe("governing principle sample doc", () => {
  it("matches the fixture counts and quoted principles", () => {
    const doc = readFileSync("docs/item-qa/governing-principle-proposal-sample.md", "utf8");
    expect(doc).toContain("16 auto_extract");
    expect(doc).toContain("9 needs_human");
    for (const fixture of FIXTURES) {
      expect(doc).toContain(fixture.id);
      if (fixture.proposedPrinciple) expect(doc).toContain(fixture.proposedPrinciple);
    }
  });
});
