import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contentFromStoredItem, evaluateRationaleSchema } from "./rationale-schema";
import {
  bankOptionTexts,
  distractorReasonWrite,
  parseDistractorAllowlist,
  parseProposeDistractorReasonArgs,
  planDistractorReasonProposals,
  proposeDistractorReasons,
  type DistractorReasonBankRow,
} from "./distractor-reason-proposal";

const BLANKET = "Offer a warm blanket and revisit in an hour";
const FAMILY = "Ask the family to sit with the client";
const CHART = "Document the finding and finish the current task";
const STAY = "Notify the provider and stay with the client";
const PLAIN_OPTIONS = [STAY, BLANKET, FAMILY, CHART];

const GENERIC_EXPLANATION = [
  "Correct: Active hemorrhage with hypotension is a circulation emergency and takes priority over stable tasks.",
  "**Why other options are incorrect**",
  "- **Incorrect —** Plausible nursing action but not the FIRST priority for this presentation.",
  "- **Incorrect —** Correct eventually; unsafe to prioritize before ABC stabilization.",
  "- **Incorrect —** Teaching or screening task unrelated to acute findings in the stem.",
].join("\n");

const ADJACENT_EXPLANATION = [
  "Hypotension with fever is perfusion failure and needs a response before comfort measures are started.",
  "",
  "Why other options are incorrect:",
  BLANKET,
  "Incorrect — A warm blanket does not treat hypotension and leaves the client unmonitored.",
  FAMILY,
  "Incorrect — Family presence does not restore blood pressure or complete the assessment.",
  CHART,
  "Incorrect — Charting before reassessment delays care for an unstable blood pressure.",
].join("\n");

const BECAUSE_EXPLANATION = [
  "Hypotension with fever is perfusion failure and needs a response before comfort measures are started.",
  `• ${BLANKET} is incorrect because a blanket does not treat hypotension in this client.`,
  `• ${FAMILY} is incorrect because family presence does not restore circulating volume here.`,
  `• ${CHART} is incorrect because charting first delays care for an unstable blood pressure.`,
].join("\n");

const HYPHEN_OPTION = "Place the client in a negative-pressure room";
const HYPHEN_REASON = "Tuberculosis requires airborne isolation in a negative-pressure room.";
const HYPHEN_EXPLANATION = [
  "Suspected tuberculosis is spread by airborne particles and needs the matching isolation room.",
  `Place the client in a negative pressure room: Incorrect — ${HYPHEN_REASON}`,
].join("\n");

function curation(codes: string[], partnerId?: string): DistractorReasonBankRow["curationMeta"] {
  return {
    cluster: "keep-me",
    itemQa: {
      pipeline: "item-qa-v1",
      checkedAt: "2026-09-24T00:00:00.000Z",
      codes,
      summary: "Missing a distractor reason.",
      ...(partnerId ? { partnerId } : {}),
    },
  };
}

function row(input: {
  id: string;
  stem?: string;
  explanation: string;
  options: string[] | string;
  correctAnswer: string;
  itemType?: string;
  generationMeta?: unknown;
  codes?: string[];
  fieldId?: string;
  active?: boolean;
  qaPassed?: boolean;
  partnerId?: string;
}): DistractorReasonBankRow {
  const options =
    typeof input.options === "string" ? input.options : JSON.stringify(input.options);
  return {
    id: input.id,
    fieldId: input.fieldId ?? "nursing",
    subjectId: "management-of-care",
    active: input.active ?? true,
    qaPassed: input.qaPassed ?? true,
    stem: input.stem ?? "Which action should the nurse take first?",
    explanation: input.explanation,
    options,
    correctAnswer: input.correctAnswer,
    itemType: input.itemType ?? "vignette",
    references: [{ label: "NCSBN NCLEX-RN Test Plan" }],
    generationMeta: input.generationMeta ?? {
      model: "gpt-4o",
      batchId: "keep-me",
      governingPrinciple: "Treat the unstable client before routine comfort tasks.",
    },
    curationMeta: curation(input.codes ?? ["missing_distractor_reason", "fails_schema"], input.partnerId),
  };
}

function proposedFor(bank: DistractorReasonBankRow) {
  return proposeDistractorReasons({
    content: contentFromStoredItem({
      question: bank.stem,
      options: bank.options,
      correctAnswer: bank.correctAnswer,
      explanation: bank.explanation,
      itemType: bank.itemType,
      references: bank.references,
      generationMeta: bank.generationMeta,
    }),
    generationMeta: bank.generationMeta,
  });
}

function quotes(bank: DistractorReasonBankRow): Record<string, string | null> {
  return Object.fromEntries(proposedFor(bank).options.map((option) => [option.option, option.proposedReason]));
}

const genericIds: Array<{ id: string; correct: string; wrong: string[] }> = [
  {
    id: "cmrcz3rag00001y720tsildn6",
    correct:
      "Room 222 — active bleeding with hypotension and tachycardia; assess and intervene for hemorrhagic shock first.",
    wrong: [
      "Room 214 — hypoxemia and diminished breath sounds; prioritize pulmonary assessment before the surgical patient with bleeding.",
      "Room 218 — hyperglycemia requires insulin and fluid protocol before other clients.",
      "Room 220 — daily weight and lung assessment for heart failure exacerbation.",
    ],
  },
  {
    id: "cmrcz3rvw00071y72vnnvrlyq",
    correct: "Honor the informed refusal, document the discussion, and notify the provider to discuss alternatives.",
    wrong: [
      "Transfuse without consent because the client will die without blood.",
      "Ask the family to override the client's decision.",
      "Delay surgery until the client changes their mind.",
    ],
  },
  {
    id: "cmto78puf00001yy4ptvahxzr",
    correct: "Casualty C — abnormal respirations and delayed perfusion are immediate, salvageable threats under START.",
    wrong: [
      "Casualty A — walking wounded should be treated first to clear the triage area.",
      "Casualty B — apnea after airway maneuver warrants prolonged CPR at the scene before tagging others.",
      "Casualty D — closed femur fracture always receives an immediate red tag.",
    ],
  },
  {
    id: "cmto78pyl00011yy4v5lg1l8i",
    correct: "Black (expectant/deceased) — do not consume scarce resources on prolonged resuscitation at the scene.",
    wrong: [
      "Red (immediate) — begin full ACLS and remain with the client until ROSC.",
      "Yellow (delayed) — reassess after all green tags are treated.",
      "Green (minimal) — instruct the casualty to walk to the minor treatment area.",
    ],
  },
  {
    id: "cmto78q1c00021yy43oigtwm7",
    correct: "Assign a green (minimal) tag and direct the client to the walking-wounded treatment area for delayed care.",
    wrong: [
      "Assign a red tag so the client is seen before critically injured casualties.",
      "Begin a full primary survey and stay with the client until diagnostics are complete.",
      "Refuse to tag the client because ambulatory status means they are not part of the MCI.",
    ],
  },
  {
    id: "cmto78q4000031yy49x3jo7e9",
    correct: "Ensure decontamination occurs before casualties enter the main treatment areas when feasible.",
    wrong: [
      "Bring all casualties directly into trauma bays to start IV fluids immediately.",
      "Send family members into the hot zone to identify victims faster.",
      "Delay triage tagging until laboratory results confirm toxin levels.",
    ],
  },
  {
    id: "cmto78q6p00041yy4ro2lqs1q",
    correct:
      "Red (immediate) — inability to follow commands indicates altered mental status requiring immediate care under START RPM.",
    wrong: [
      "Green (minimal) — normal respiratory rate means the casualty can wait indefinitely.",
      "Black (expectant) — any altered mentation is non-survivable in an MCI.",
      "Yellow (delayed) — only open fractures receive immediate tags.",
    ],
  },
  {
    id: "cmto78q9e00051yy4golp7cwj",
    correct:
      "Greatest good for the greatest number — prioritize salvageable clients most likely to benefit from scarce resources.",
    wrong: [
      "First-come, first-served regardless of injury severity or resource need.",
      "Provide prolonged one-to-one ICU care at the scene before tagging any casualties.",
      "Treat only pediatric clients until adult resources are exhausted.",
    ],
  },
  {
    id: "cmto78qc400061yy44bx8oc3o",
    correct: "Tag red (immediate) and move the casualty toward urgent life-saving interventions.",
    wrong: [
      "Tag green because the casualty is still breathing without assistance.",
      "Tag black because tachypnea alone is non-survivable.",
      "Withhold a tag until a full set of laboratory values is available.",
    ],
  },
  {
    id: "cmto78qey00071yy4r1r80ts3",
    correct:
      "Explain that during mass casualty, triage and care follow tag priority to save the most lives, and offer appropriate support resources for the family.",
    wrong: [
      "Abandon triage immediately to provide one-to-one comfort care as requested.",
      "Re-tag all yellow clients as red to satisfy family requests.",
      "Stop documenting triage tags because families find the colors upsetting.",
    ],
  },
  {
    id: "cmto78qhr00081yy4wma1wj2x",
    correct:
      "Move the most stable clients first so limited staff and equipment can support the critically ill during evacuation.",
    wrong: [
      "Evacuate only expectant/black-tagged clients and leave stable clients in place indefinitely.",
      "Ignore triage categories and evacuate rooms in numerical order only.",
      "Keep all ventilated clients last without a transfer plan because they cannot be moved.",
    ],
  },
  {
    id: "cmto78qkm00091yy4efmg69q3",
    correct: "Record the triage tag color and time on the casualty so reassessment and handoff remain accurate.",
    wrong: [
      "Omit the tag time to avoid legal liability if priorities change.",
      "Document only the mechanism of injury and skip vital observations.",
      "Wait to document until the client reaches the OR.",
    ],
  },
];

const OXYGEN = "Administer oxygen via nasal cannula at 2 L/min.";
const NEBULIZER = "Prepare to administer a nebulized bronchodilator.";
const PURSED = "Encourage the client to use pursed-lip breathing.";
const SUPINE = "Place the client in a supine position.";
const PURSED_EXPLANATION = [
  "The client is experiencing an asthma exacerbation with inadequate relief from a rescue inhaler. Administering a nebulized bronchodilator can provide more effective medication delivery. Pursed-lip breathing helps improve ventilation and oxygenation. Oxygen administration is appropriate but should be at a higher flow rate given the SpO2 of 88%. Supine positioning can worsen respiratory distress.",
  "",
  "Why other options are incorrect:",
  `• ${OXYGEN}: Incorrect — A higher flow rate is needed to improve SpO2 of 88%.`,
  `• ${SUPINE}: Incorrect — Supine positioning can worsen respiratory distress; sitting upright is preferred.`,
].join("\n");

const NEGATIVE = "Place the client in a negative-pressure room";
const SURGICAL = "Use a surgical mask when entering the room";
const N95_CARE = "Wear an N95 respirator when providing care";
const CONTACT = "Implement contact precautions";
const TB_EXPLANATION = [
  "Clients with suspected tuberculosis should be placed in a negative-pressure room to prevent the spread of airborne particles. Healthcare personnel should wear an N95 respirator to protect against inhaling these particles.",
  "",
  "Why other options are incorrect:",
  `• ${SURGICAL}: Incorrect — A surgical mask does not provide adequate protection against airborne particles.`,
  `• ${CONTACT}: Incorrect — Tuberculosis requires airborne, not contact precautions.`,
].join("\n");

const VITALS = "Measure and record vital signs for stable clients";
const INSULIN = "Administer subcutaneous insulin to a diabetic client";
const FEEDING = "Assist with feeding a client who has difficulty swallowing";
const TRANSPORT = "Transport a client to radiology for a scheduled X-ray";
const DELEGATION_EXPLANATION = [
  "UAPs can measure and record vital signs and transport clients, which are within their scope. Administering insulin and assisting with feeding a client with swallowing difficulties require a licensed nurse.",
  "",
  "Why other options are incorrect:",
  `• ${INSULIN}: Incorrect — Medication administration requires a licensed nurse.`,
  `• ${FEEDING}: Incorrect — Feeding clients with swallowing issues requires assessment skills.`,
].join("\n");

const REASSESS = "Reassess respiratory status after intervention";
const ALBUTEROL = "Administer albuterol nebulizer treatment";
const SPUTUM = "Obtain a sputum culture";
const IV_ACCESS = "Initiate IV access for antibiotic administration";
const OXYGEN_ACTION = "Apply oxygen via nasal cannula";
const FIRST_EXPLANATION = [
  "The priority is to address the client's hypoxemia by applying oxygen to improve saturation. While administering albuterol and obtaining a sputum culture are important, they do not immediately address the low oxygen saturation.",
  "",
  "Clinical reasoning: Recognize Cues: Fever and low oxygen saturation. Analyze Cues: Respiratory distress with hypoxemia. Prioritize Hypotheses: Impaired gas exchange is the immediate threat. Generate Solutions: Apply oxygen to improve saturation. Take Action: Oxygen via nasal cannula. Evaluate Outcomes: Monitor respiratory status.",
  "",
  "Why other options are incorrect:",
  `• ${ALBUTEROL}: Incorrect — Albuterol addresses bronchospasm but not immediate hypoxemia.`,
  `• ${SPUTUM}: Incorrect — Important for infection diagnosis but not a priority in respiratory distress.`,
  `• ${IV_ACCESS}: Incorrect — Necessary for treatment but not the first step in hypoxemia.`,
].join("\n");

function genericRow(entry: (typeof genericIds)[number]): DistractorReasonBankRow {
  return row({
    id: entry.id,
    stem: "Which client should the nurse see first?",
    explanation: GENERIC_EXPLANATION,
    options: [entry.correct, ...entry.wrong],
    correctAnswer: entry.correct,
  });
}

const adjacentRow = row({
  id: "shape-adjacent-incorrect",
  explanation: ADJACENT_EXPLANATION,
  options: PLAIN_OPTIONS,
  correctAnswer: STAY,
});

const becauseRow = row({
  id: "shape-because-clause",
  explanation: BECAUSE_EXPLANATION,
  options: PLAIN_OPTIONS,
  correctAnswer: STAY,
});

const hyphenRow = row({
  id: "shape-hyphen-normalized",
  explanation: HYPHEN_EXPLANATION,
  options: ["Keep the client in a shared room", HYPHEN_OPTION],
  correctAnswer: "Keep the client in a shared room",
});

const expertRow = row({
  id: "shape-expert-incomplete",
  explanation:
    "Hypotension with fever is perfusion failure and needs a response before comfort measures are started for this client.",
  options: PLAIN_OPTIONS,
  correctAnswer: STAY,
  generationMeta: {
    model: "gpt-4o",
    batchId: "keep-me",
    governingPrinciple: "Treat the unstable client before routine comfort tasks.",
    expertRationale: {
      whyIncorrect: [
        {
          option: BLANKET,
          correction: "A warm blanket does not treat hypotension and leaves the client unmonitored.",
        },
        {
          option: FAMILY,
          correction: "Family presence does not restore blood pressure or complete the assessment.",
        },
        {
          option: CHART,
          correction: "Charting before reassessment delays care for an unstable blood pressure.",
        },
      ],
    },
  },
});

describe("distractor reason extraction", () => {
  it("quotes an incorrect line stored under the option when the schema cannot see it", () => {
    const before = evaluateRationaleSchema(
      contentFromStoredItem({
        question: adjacentRow.stem,
        options: adjacentRow.options,
        correctAnswer: adjacentRow.correctAnswer,
        explanation: adjacentRow.explanation,
        itemType: adjacentRow.itemType,
        generationMeta: adjacentRow.generationMeta,
        references: adjacentRow.references,
      })
    );
    expect(before.filter((issue) => issue.code === "missing_distractor_reason")).toHaveLength(3);
    const proposal = proposedFor(adjacentRow);
    expect(proposal.classification).toBe("auto_extract");
    expect(quotes(adjacentRow)).toEqual({
      [BLANKET]: "A warm blanket does not treat hypotension and leaves the client unmonitored.",
      [FAMILY]: "Family presence does not restore blood pressure or complete the assessment.",
      [CHART]: "Charting before reassessment delays care for an unstable blood pressure.",
    });
    expect(proposal.options.every((option) => option.proposedReason && ADJACENT_EXPLANATION.includes(option.proposedReason))).toBe(
      true
    );
  });

  it("quotes a because clause and a hyphen-insensitive label the schema split misses", () => {
    expect(proposedFor(becauseRow).classification).toBe("auto_extract");
    expect(quotes(becauseRow)[BLANKET]).toBe("a blanket does not treat hypotension in this client.");
    expect(proposedFor(hyphenRow).classification).toBe("auto_extract");
    expect(quotes(hyphenRow)[HYPHEN_OPTION]).toBe(HYPHEN_REASON);
    const issues = evaluateRationaleSchema(
      contentFromStoredItem({
        question: hyphenRow.stem,
        options: hyphenRow.options,
        correctAnswer: hyphenRow.correctAnswer,
        explanation: hyphenRow.explanation,
        generationMeta: hyphenRow.generationMeta,
        references: hyphenRow.references,
      })
    );
    expect(issues.some((issue) => issue.code === "missing_distractor_reason")).toBe(true);
  });

  it("quotes expert whyIncorrect when the expert record is too incomplete for the schema", () => {
    const proposal = proposedFor(expertRow);
    expect(proposal.classification).toBe("auto_extract");
    expect(proposal.options.map((option) => option.note)).toEqual([
      "Quoted expert whyIncorrect for this option.",
      "Quoted expert whyIncorrect for this option.",
      "Quoted expert whyIncorrect for this option.",
    ]);
    expect(expertRow.explanation).not.toContain("warm blanket does not treat");
  });

  it("does not assign generic triage placeholders to options", () => {
    for (const entry of genericIds) {
      const proposal = proposedFor(genericRow(entry));
      expect(proposal.classification).toBe("needs_human");
      expect(proposal.options.every((option) => option.proposedReason === null)).toBe(true);
      expect(proposal.reason).toMatch(/Generic placeholder/i);
    }
  });

  it("leaves a select-all option the teaching summary treats as correct for a person", () => {
    const pursed = row({
      id: "cmr8lvs91000h1yayp3vttz0n",
      stem: "Which interventions should the nurse implement? Select all that apply.?",
      explanation: PURSED_EXPLANATION,
      options: [OXYGEN, NEBULIZER, PURSED, SUPINE],
      correctAnswer: NEBULIZER,
      itemType: "vignette",
    });
    const proposal = proposedFor(pursed);
    expect(proposal.classification).toBe("needs_human");
    expect(quotes(pursed)[PURSED]).toBeNull();
    expect(proposal.options.find((option) => option.option === PURSED)?.note).toMatch(/correct-answer mismatch/i);
    expect(proposal.options.find((option) => option.option === OXYGEN)?.proposedReason).toBeNull();
    expect(proposal.options.find((option) => option.option === OXYGEN)?.existingReason).toBeTruthy();

    const airborne = row({
      id: "cmr8p5bza009o1y5nob3doqc1",
      explanation: TB_EXPLANATION,
      options: [NEGATIVE, SURGICAL, N95_CARE, CONTACT],
      correctAnswer: NEGATIVE,
    });
    expect(proposedFor(airborne).classification).toBe("needs_human");
    expect(quotes(airborne)[N95_CARE]).toBeNull();
    expect(proposedFor(airborne).options.find((option) => option.option === N95_CARE)?.note).toMatch(
      /correct-answer mismatch/i
    );

    const delegation = row({
      id: "cmra6zr1300551ylwu4a9fyet",
      stem: "Which action should the nurse delegate to the UAP? Select all that apply.?",
      explanation: DELEGATION_EXPLANATION,
      options: JSON.stringify({
        kind: "select_all",
        options: [VITALS, INSULIN, FEEDING, TRANSPORT],
        blueprintTopic: "delegation-assignment",
      }),
      correctAnswer: TRANSPORT,
      itemType: "select_all",
    });
    expect(proposedFor(delegation).classification).toBe("needs_human");
    expect(quotes(delegation)[VITALS]).toBeNull();
    expect(proposedFor(delegation).options.find((option) => option.option === VITALS)?.note).toMatch(
      /correct-answer mismatch/i
    );

    const first = row({
      id: "cmrmtcvkt002b1y3jki2940ey",
      stem: "Which action should the nurse take first?",
      explanation: FIRST_EXPLANATION,
      options: JSON.stringify({
        kind: "select_all",
        options: [ALBUTEROL, SPUTUM, IV_ACCESS, OXYGEN_ACTION, REASSESS],
      }),
      correctAnswer: OXYGEN_ACTION,
      itemType: "select_all",
    });
    expect(proposedFor(first).classification).toBe("needs_human");
    expect(quotes(first)[REASSESS]).toBeNull();
    expect(quotes(first)[ALBUTEROL]).toBeNull();
    expect(proposedFor(first).options.find((option) => option.option === ALBUTEROL)?.existingReason).toBeTruthy();
  });

  it("does not use an answer-key restatement as a distractor reason", () => {
    const bank = row({
      id: "shape-answer-restatement",
      explanation: [
        "Hypotension with fever is perfusion failure and needs a response before comfort measures are started.",
        "",
        "Why other options are incorrect:",
        BLANKET,
        "Incorrect — The correct answer is to notify the provider and stay with the client now.",
        FAMILY,
        "Incorrect — Family presence does not restore blood pressure or complete the assessment.",
        CHART,
        "Incorrect — Charting before reassessment delays care for an unstable blood pressure.",
      ].join("\n"),
      options: PLAIN_OPTIONS,
      correctAnswer: STAY,
    });
    const proposal = proposedFor(bank);
    expect(proposal.classification).toBe("needs_human");
    expect(quotes(bank)[BLANKET]).toBeNull();
    expect(proposal.options.find((option) => option.option === BLANKET)?.note).toMatch(/answer key/i);
  });
});

describe("distractor reason plan", () => {
  const liveRows = [
    ...genericIds.map(genericRow),
    row({
      id: "cmr8lvs91000h1yayp3vttz0n",
      explanation: PURSED_EXPLANATION,
      options: [OXYGEN, NEBULIZER, PURSED, SUPINE],
      correctAnswer: NEBULIZER,
    }),
    row({
      id: "cmr8p5bza009o1y5nob3doqc1",
      explanation: TB_EXPLANATION,
      options: [NEGATIVE, SURGICAL, N95_CARE, CONTACT],
      correctAnswer: NEGATIVE,
    }),
    row({
      id: "cmra6zr1300551ylwu4a9fyet",
      explanation: DELEGATION_EXPLANATION,
      options: JSON.stringify({ kind: "select_all", options: [VITALS, INSULIN, FEEDING, TRANSPORT] }),
      correctAnswer: TRANSPORT,
      itemType: "select_all",
    }),
    row({
      id: "cmrlz5b8b00121yf1tez6nh6n",
      explanation: [
        "For suspected tuberculosis, an N95 respirator is required. The client should be in a private room with the door closed. Hand hygiene is essential. A surgical mask is inadequate, and gloves are not required for handling belongings unless contamination is suspected.",
        "",
        "Why other options are incorrect:",
        "• Use a surgical mask when providing care: Incorrect — A surgical mask is inadequate for airborne precautions.",
      ].join("\n"),
      options: JSON.stringify({
        kind: "select_all",
        options: [
          "Wear an N95 respirator when entering the room",
          "Use a surgical mask when providing care",
          "Place the client in a private room with the door closed",
          "Practice hand hygiene before and after client contact",
          "Wear gloves when handling the client's belongings",
        ],
      }),
      correctAnswer: "Wear an N95 respirator when entering the room",
      itemType: "select_all",
    }),
    row({
      id: "cmrlzjrpc002z1yf1aagt2654",
      explanation: [
        "Tuberculosis requires airborne precautions, including wearing an N95 respirator and keeping the door closed. A surgical mask should be placed on the client during transport. Gown and gloves are part of standard precautions.",
        "",
        "Why other options are incorrect:",
        "• Use alcohol-based hand sanitizer before entering the room.: Incorrect — Hand washing with soap and water is preferred for TB, as alcohol does not kill spores.",
      ].join("\n"),
      options: JSON.stringify({
        kind: "select_all",
        options: [
          "Wear an N95 respirator when entering the room.",
          "Place a surgical mask on the client when transporting.",
          "Use alcohol-based hand sanitizer before entering the room.",
          "Wear a gown and gloves when providing care.",
          "Ensure the door to the client's room remains closed.",
        ],
      }),
      correctAnswer: "Wear an N95 respirator when entering the room.",
      itemType: "select_all",
    }),
    row({
      id: "cmrmtcvkt002b1y3jki2940ey",
      explanation: FIRST_EXPLANATION,
      options: JSON.stringify({
        kind: "select_all",
        options: [ALBUTEROL, SPUTUM, IV_ACCESS, OXYGEN_ACTION, REASSESS],
      }),
      correctAnswer: OXYGEN_ACTION,
      itemType: "select_all",
    }),
    row({
      id: "cmrm08rnm006u1yf1nbt3cahm",
      explanation: GENERIC_EXPLANATION,
      options: ["Wear gloves when entering the room.", "Use a surgical mask.", "Wear an N95 respirator."],
      correctAnswer: "Wear gloves when entering the room.",
      codes: ["missing_distractor_reason", "fails_schema", "near_duplicate"],
      partnerId: "keeper-lower-id",
    }),
  ];

  it("classifies the Management of Care shapes as needs_human and skips the near-duplicate", () => {
    expect(liveRows).toHaveLength(19);
    const plan = planDistractorReasonProposals({ fieldId: "nursing", rows: liveRows });
    expect(plan.autoExtract).toEqual([]);
    expect(plan.needsHuman).toHaveLength(18);
    expect(plan.wouldWrite).toBe(0);
    expect(plan.failingDistractorBefore).toBe(18);
    expect(plan.failingDistractorAfter).toBe(18);
    expect(plan.skipped).toEqual([{ id: "cmrm08rnm006u1yf1nbt3cahm", reason: "near_duplicate" }]);
    expect(plan.needsHuman.every((item) => item.options.some((option) => option.proposedReason === null))).toBe(true);
  });

  it("writes auto_extract rows and leaves needs_human rows until they are allowlisted", () => {
    const needsHuman = genericRow(genericIds[0]!);
    const duplicate = liveRows.find((entry) => entry.id === "cmrm08rnm006u1yf1nbt3cahm")!;
    const plan = planDistractorReasonProposals({
      fieldId: "nursing",
      rows: [adjacentRow, needsHuman, duplicate, becauseRow],
    });
    expect(plan.autoExtract.map((item) => item.id).sort()).toEqual([
      "shape-adjacent-incorrect",
      "shape-because-clause",
    ]);
    expect(plan.autoExtract.every((item) => item.wouldWrite && item.wouldResolve)).toBe(true);
    expect(plan.needsHuman.map((item) => item.id)).toEqual(["cmrcz3rag00001y720tsildn6"]);
    expect(plan.needsHuman[0]?.wouldWrite).toBe(false);
    expect(plan.skipped.map((skip) => skip.reason)).toContain("near_duplicate");

    const reviewed = planDistractorReasonProposals({
      fieldId: "nursing",
      rows: [adjacentRow, needsHuman, duplicate],
      allowlist: new Set(["cmrcz3rag00001y720tsildn6", "cmrm08rnm006u1yf1nbt3cahm", "shape-adjacent-incorrect"]),
    });
    expect(reviewed.autoExtract.find((item) => item.id === "shape-adjacent-incorrect")?.wouldWrite).toBe(true);
    expect(reviewed.needsHuman[0]?.wouldWrite).toBe(false);
    expect(reviewed.autoExtract.some((item) => item.id === "cmrm08rnm006u1yf1nbt3cahm")).toBe(false);
  });

  it("allowlists a partial quote without treating the distractor check as cleared", () => {
    const partial = row({
      id: "shape-partial-human",
      explanation: [
        "Hypotension with fever is perfusion failure and needs a response before comfort measures are started.",
        "",
        "Why other options are incorrect:",
        BLANKET,
        "Incorrect — A warm blanket does not treat hypotension and leaves the client unmonitored.",
        FAMILY,
        "Incorrect — The correct answer is to notify the provider and stay with the client now.",
        CHART,
        "Incorrect — Charting before reassessment delays care for an unstable blood pressure.",
      ].join("\n"),
      options: PLAIN_OPTIONS,
      correctAnswer: STAY,
    });
    const blocked = planDistractorReasonProposals({ fieldId: "nursing", rows: [partial] });
    expect(blocked.needsHuman[0]?.wouldWrite).toBe(false);
    expect(blocked.failingDistractorAfter).toBe(1);
    const allowed = planDistractorReasonProposals({
      fieldId: "nursing",
      rows: [partial],
      allowlist: new Set(["shape-partial-human"]),
    });
    expect(allowed.needsHuman[0]?.wouldWrite).toBe(true);
    expect(allowed.needsHuman[0]?.wouldResolve).toBe(false);
    expect(allowed.failingDistractorAfter).toBe(1);
    const write = distractorReasonWrite({
      apply: true,
      generationMeta: partial.generationMeta,
      optionsRaw: partial.options,
      proposals: proposedFor(partial).options,
      classification: "needs_human",
      allowlistActive: true,
      idAllowlisted: true,
      nearDuplicate: false,
    });
    const reasons = write?.generationMeta.distractorRationale as Record<string, string>;
    expect(reasons[BLANKET]).toMatch(/warm blanket/);
    expect(reasons[CHART]).toMatch(/Charting before/);
    expect(reasons[FAMILY]).toBeUndefined();
    const content = contentFromStoredItem({
      question: partial.stem,
      options: partial.options,
      correctAnswer: partial.correctAnswer,
      explanation: partial.explanation,
      references: partial.references,
      generationMeta: write?.generationMeta,
    });
    expect(content.explanation).toBe(partial.explanation);
    expect(evaluateRationaleSchema(content).some((issue) => issue.code === "missing_distractor_reason" && issue.option === FAMILY)).toBe(
      true
    );
  });

  it("keeps other fields out and includes an unflagged distractor gap", () => {
    const plan = planDistractorReasonProposals({
      fieldId: "nursing",
      rows: [
        row({
          id: "pharmacy-gap",
          fieldId: "pharmacy",
          explanation: ADJACENT_EXPLANATION,
          options: PLAIN_OPTIONS,
          correctAnswer: STAY,
        }),
        row({
          id: "unflagged-gap",
          codes: [],
          explanation: ADJACENT_EXPLANATION,
          options: PLAIN_OPTIONS,
          correctAnswer: STAY,
        }),
        row({
          id: "already-ok",
          explanation: ADJACENT_EXPLANATION,
          options: JSON.stringify({
            options: PLAIN_OPTIONS,
            distractorRationale: {
              [BLANKET]: "A warm blanket does not treat hypotension and leaves the client unmonitored.",
              [FAMILY]: "Family presence does not restore blood pressure or complete the assessment.",
              [CHART]: "Charting before reassessment delays care for an unstable blood pressure.",
            },
          }),
          correctAnswer: STAY,
        }),
        row({
          id: "inactive-gap",
          active: false,
          explanation: ADJACENT_EXPLANATION,
          options: PLAIN_OPTIONS,
          correctAnswer: STAY,
        }),
      ],
    });
    expect(plan.skipped.map((skip) => [skip.id, skip.reason])).toEqual([
      ["already-ok", "already_resolved"],
      ["inactive-gap", "inactive"],
      ["pharmacy-gap", "other_field"],
    ]);
    expect(plan.autoExtract.map((item) => item.id)).toEqual(["unflagged-gap"]);
    expect(plan.failingDistractorAfter).toBe(0);
  });

  it("stops after the limit in id order", () => {
    const plan = planDistractorReasonProposals({
      fieldId: "nursing",
      limit: 1,
      rows: [becauseRow, adjacentRow],
    });
    expect(plan.truncated).toBe(true);
    expect(plan.autoExtract.map((item) => item.id)).toEqual(["shape-adjacent-incorrect"]);
    expect(plan.failingDistractorBefore).toBe(1);
  });
});

describe("distractor reason writes", () => {
  it("refuses a write when --apply was not passed", () => {
    expect(
      distractorReasonWrite({
        apply: false,
        generationMeta: adjacentRow.generationMeta,
        optionsRaw: adjacentRow.options,
        itemType: adjacentRow.itemType,
        proposals: proposedFor(adjacentRow).options,
        classification: "auto_extract",
        allowlistActive: false,
        idAllowlisted: false,
        nearDuplicate: false,
      })
    ).toBeNull();
    expect(
      parseProposeDistractorReasonArgs(["--field", "nursing", "--subject", "management-of-care"]).apply
    ).toBe(false);
    expect(() => parseProposeDistractorReasonArgs(["--field", "nursing", "--apply", "--dry-run"])).toThrow(
      /No rows were changed/
    );
    expect(() => parseProposeDistractorReasonArgs(["--apply"])).toThrow(/--field/);
  });

  it("writes generationMeta.distractorRationale and leaves the explanation and option text alone", () => {
    const proposal = proposedFor(adjacentRow);
    const write = distractorReasonWrite({
      apply: true,
      generationMeta: adjacentRow.generationMeta,
      optionsRaw: adjacentRow.options,
      itemType: "vignette",
      proposals: proposal.options,
      classification: "auto_extract",
      allowlistActive: false,
      idAllowlisted: false,
      nearDuplicate: false,
    });
    expect(write && Object.keys(write)).toEqual(["generationMeta"]);
    expect(write?.generationMeta).toMatchObject({
      model: "gpt-4o",
      batchId: "keep-me",
      governingPrinciple: "Treat the unstable client before routine comfort tasks.",
    });
    expect(write?.generationMeta.distractorRationale).toEqual({
      [BLANKET]: "A warm blanket does not treat hypotension and leaves the client unmonitored.",
      [FAMILY]: "Family presence does not restore blood pressure or complete the assessment.",
      [CHART]: "Charting before reassessment delays care for an unstable blood pressure.",
    });
    for (const key of ["question", "options", "explanation", "correctAnswer", "qaPassed", "active", "reviewFlag", "curationMeta"]) {
      expect(write).not.toHaveProperty(key);
    }
    const content = contentFromStoredItem({
      question: adjacentRow.stem,
      options: adjacentRow.options,
      correctAnswer: adjacentRow.correctAnswer,
      explanation: adjacentRow.explanation,
      itemType: adjacentRow.itemType,
      references: adjacentRow.references,
      generationMeta: write?.generationMeta,
    });
    expect(content.explanation).toBe(adjacentRow.explanation);
    expect(content.options).toEqual(PLAIN_OPTIONS);
    expect(evaluateRationaleSchema(content).some((issue) => issue.code === "missing_distractor_reason")).toBe(false);
    expect(bankOptionTexts(adjacentRow.options)).toEqual(PLAIN_OPTIONS);
  });

  it("merges select-all reasons into the options envelope without changing the option list", () => {
    const optionsRaw = JSON.stringify({
      kind: "select_all",
      blueprintTopic: "delegation-assignment",
      options: PLAIN_OPTIONS,
      distractorRationale: {
        [BLANKET]: "A warm blanket does not treat hypotension and leaves the client unmonitored.",
      },
    });
    const bank = row({
      id: "shape-select-all-envelope",
      explanation: ADJACENT_EXPLANATION,
      options: optionsRaw,
      correctAnswer: STAY,
      itemType: "select_all",
    });
    const proposal = proposedFor(bank);
    expect(proposal.classification).toBe("auto_extract");
    expect(proposal.options.find((option) => option.option === BLANKET)?.proposedReason).toBeNull();
    const write = distractorReasonWrite({
      apply: true,
      generationMeta: bank.generationMeta,
      optionsRaw,
      itemType: "select_all",
      proposals: proposal.options,
      classification: "auto_extract",
      allowlistActive: false,
      idAllowlisted: false,
      nearDuplicate: false,
    });
    expect(write?.options).toBeTruthy();
    const parsed = JSON.parse(write!.options!) as {
      kind: string;
      blueprintTopic: string;
      options: string[];
      distractorRationale: Record<string, string>;
    };
    expect(parsed.kind).toBe("select_all");
    expect(parsed.blueprintTopic).toBe("delegation-assignment");
    expect(parsed.options).toEqual(PLAIN_OPTIONS);
    expect(parsed.distractorRationale[BLANKET]).toMatch(/warm blanket/);
    expect(parsed.distractorRationale[FAMILY]).toMatch(/Family presence/);
    expect(parsed.distractorRationale[CHART]).toMatch(/Charting before/);
    const content = contentFromStoredItem({
      question: bank.stem,
      options: write!.options!,
      correctAnswer: bank.correctAnswer,
      explanation: bank.explanation,
      itemType: "select_all",
      references: bank.references,
      generationMeta: write?.generationMeta,
    });
    expect(content.explanation).toBe(bank.explanation);
    expect(evaluateRationaleSchema(content).some((issue) => issue.code === "missing_distractor_reason")).toBe(false);
  });

  it("does not write needs_human, near-duplicates, or a non-object generationMeta", () => {
    const generic = genericRow(genericIds[0]!);
    expect(
      distractorReasonWrite({
        apply: true,
        generationMeta: generic.generationMeta,
        optionsRaw: generic.options,
        proposals: proposedFor(generic).options,
        classification: "needs_human",
        allowlistActive: false,
        idAllowlisted: false,
        nearDuplicate: false,
      })
    ).toBeNull();
    expect(
      distractorReasonWrite({
        apply: true,
        generationMeta: adjacentRow.generationMeta,
        optionsRaw: adjacentRow.options,
        proposals: proposedFor(adjacentRow).options,
        classification: "auto_extract",
        allowlistActive: true,
        idAllowlisted: true,
        nearDuplicate: true,
      })
    ).toBeNull();
    expect(
      distractorReasonWrite({
        apply: true,
        generationMeta: ["not-an-object"],
        optionsRaw: adjacentRow.options,
        proposals: proposedFor(adjacentRow).options,
        classification: "auto_extract",
        allowlistActive: false,
        idAllowlisted: false,
        nearDuplicate: false,
      })
    ).toBeNull();
  });

  it("parses an allowlist of one id per line", () => {
    expect(parseDistractorAllowlist("# review\n\nshape-adjacent-incorrect\ncmr8lvs91000h1yayp3vttz0n\n")).toEqual([
      "shape-adjacent-incorrect",
      "cmr8lvs91000h1yayp3vttz0n",
    ]);
    expect(() => parseDistractorAllowlist("one two")).toThrow(/No rows were changed/);
  });
});

describe("distractor reason sample doc", () => {
  it("matches the MoC queue and the synthetic auto_extract shapes", () => {
    const doc = readFileSync("docs/item-qa/distractor-reason-proposal-sample.md", "utf8");
    expect(doc).toContain("0 auto_extract");
    expect(doc).toContain("18 needs_human");
    expect(doc).toContain("1 skipped near-duplicate");
    expect(doc).toContain("cmrm08rnm006u1yf1nbt3cahm");
    expect(doc).toContain("not a production allowlist");
    for (const entry of genericIds) expect(doc).toContain(entry.id);
    for (const id of [
      "cmr8lvs91000h1yayp3vttz0n",
      "cmr8p5bza009o1y5nob3doqc1",
      "cmra6zr1300551ylwu4a9fyet",
      "cmrlz5b8b00121yf1tez6nh6n",
      "cmrlzjrpc002z1yf1aagt2654",
      "cmrmtcvkt002b1y3jki2940ey",
      "shape-adjacent-incorrect",
      "shape-because-clause",
      "shape-hyphen-normalized",
      "shape-expert-incomplete",
    ]) {
      expect(doc).toContain(id);
    }
    expect(doc).toContain("A warm blanket does not treat hypotension and leaves the client unmonitored.");
    expect(doc).toContain(HYPHEN_REASON);
  });
});
