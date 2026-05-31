import type { RawQuestionInput } from "@/lib/questions/types";

/** Curated NGN showcase items — public demo, no auth required. */
export const NGN_DEMO_QUESTIONS: RawQuestionInput[] = [
  {
    id: 1,
    type: "bow_tie",
    ngnFormat: "bow_tie",
    vignette:
      "A 68-year-old with heart failure returns to the med-surg unit after diuretic adjustment. BP 92/58 mmHg, HR 112, lung crackles bilaterally, 2+ pitting edema, weight up 2 kg since yesterday, and reported dizziness when standing.",
    question:
      "Complete the bow-tie diagram: select one action to take and two conditions to monitor.",
    options: [],
    correctAnswer:
      "Administer IV bolus per protocol,Orthostatic hypotension,Daily weights and I/O",
    explanation:
      "Hypotension with crackles and edema suggests overload with poor perfusion — a bolus may be indicated per protocol while closely monitoring orthostatic BP and fluid balance (daily weights, I/O).",
    clinicalReasoning:
      "Recognize cues (hypotension, edema, weight gain) → prioritize perfusion vs overload → select action aligned with protocol → monitor high-risk sequelae.",
    references: ["Open RN Nursing Pharmacology — diuretics & fluid balance"],
    chartData: {
      kind: "bow_tie",
      condition: "Acute decompensated heart failure with hypotension",
      actions: [
        "Administer IV bolus per protocol",
        "Increase oral fluid restriction only",
        "Discontinue all diuretics immediately",
        "Place in high-Fowler's without further assessment",
      ],
      monitors: [
        "Orthostatic hypotension",
        "Daily weights and I/O",
        "Blood glucose every 6 hours",
        "Deep tendon reflexes",
      ],
      monitorPickCount: 2,
    },
    tags: ["prioritization", "heart failure", "NGN"],
    highYield: true,
  },
  {
    id: 2,
    type: "matrix",
    ngnFormat: "matrix",
    vignette:
      "A nurse is reviewing findings for a post-operative client on the second day after abdominal surgery.",
    question: "For each finding, indicate whether the nurse should intervene immediately.",
    options: [],
    correctAnswer:
      "Hypoxia SpO₂ 88% on room air|||Intervene immediately,Serosanguineous drainage on dressing|||Expected finding,New onset chest pain|||Intervene immediately,Absence of bowel sounds|||Requires further data",
    explanation:
      "Hypoxia and new chest pain require immediate intervention. Serosanguineous drainage can be expected early post-op. Absent bowel sounds may need further assessment before urgent action.",
    references: ["Open RN Nursing Skills — post-operative monitoring"],
    chartData: {
      kind: "matrix",
      rows: [
        "Hypoxia SpO₂ 88% on room air",
        "Serosanguineous drainage on dressing",
        "New onset chest pain",
        "Absence of bowel sounds",
      ],
      columns: ["Intervene immediately", "Expected finding", "Requires further data"],
    },
    tags: ["med-surg", "post-op", "NGN"],
    highYield: true,
  },
  {
    id: 3,
    type: "unfolding_case",
    ngnFormat: "unfolding_case",
    caseStep: 1,
    vignette:
      "0900: A 54-year-old with type 2 diabetes is admitted for hyperglycemia. Alert, oriented, BP 138/84, HR 92, glucose 412 mg/dL, skin warm and dry.",
    question: "What is the nurse's priority action?",
    options: [
      "Administer rapid-acting insulin per sliding scale",
      "Encourage oral fluid intake only",
      "Place in Trendelenburg position",
      "Restrict all carbohydrates for 24 hours without insulin",
    ],
    correctAnswer: "Administer rapid-acting insulin per sliding scale",
    explanation:
      "Severe hyperglycemia with dry skin suggests hyperosmolar state risk — insulin per protocol is priority alongside fluids and monitoring.",
    clinicalReasoning: "ABC and glucose stabilization take priority over dietary counseling alone.",
    references: ["Open RN Nursing Pharmacology — diabetes management"],
    tags: ["endocrine", "prioritization", "NGN"],
    highYield: true,
  },
];
