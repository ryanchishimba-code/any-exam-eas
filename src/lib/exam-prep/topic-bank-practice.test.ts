import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  bankItemToSessionRaw,
  prepareBankItemsForSession,
  prepareTopicBankItemsForSession,
} from "@/lib/exam-prep/prepare-bank-session";
import { finalizeExamSessionQuestions } from "@/lib/questions/finalize-exam-session";
import {
  resolveTopicBankSampleCount,
  supportsTopicBankPractice,
} from "@/lib/exam-prep/topic-bank-practice";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";

function mocItem(id: string, room: number): BankItem {
  const wrong = [
    "Complete discharge teaching",
    "Administer scheduled stool softener",
    "Document intake and output",
  ];
  return {
    id,
    subjectId: "management-of-care",
    question: "Which client should the nurse see first?",
    vignette: `Room ${room}. A 68-year-old post-op day 1 client reports new shortness of breath, RR 28, and SpO₂ 88% on room air.`,
    options: ["Assess airway and notify the provider", wrong[0]!, wrong[1]!, wrong[2]!],
    correctAnswer: "Assess airway and notify the provider",
    explanation:
      "Airway and breathing threats take priority over routine care or teaching. Per ABC prioritization, assess respiratory status and escalate immediately when SpO₂ falls below 92%.",
    distractorRationale: Object.fromEntries(
      wrong.map((o) => [o, "Incorrect — stable or lower-priority tasks defer to ABC threats."])
    ),
    tags: ["prioritization", "curated"],
    source: "curated",
  };
}

function naplexItem(id: string, i: number): BankItem {
  return {
    id,
    subjectId: "pharmacology",
    vignette: `A 64-year-old man with hypertension (BP 158/92 mmHg) receives lisinopril case ${i}.`,
    question: "Which monitoring parameter is most appropriate after initiation?",
    options: [
      "Serum potassium and creatinine within 1–2 weeks",
      "Daily fasting glucose only",
      "INR every 3 days",
      "No laboratory monitoring",
    ],
    correctAnswer: "Serum potassium and creatinine within 1–2 weeks",
    explanation:
      "Correct: serum potassium and creatinine — lisinopril is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation.",
    tags: ["physician-educator", "high-yield"],
    source: "curated",
  };
}

function usmleItem(id: string, i: number): BankItem {
  return {
    id,
    subjectId: "cardiology",
    question: `A 58-year-old man presents with chest pain for 45 minutes (case ${i}). He is diaphoretic with ST elevation in II, III, aVF.

Which of the following is the most appropriate next step in management?`,
    options: ["Activate cath lab", "Oral beta blocker only", "Discharge with follow-up", "Observe 24h"],
    correctAnswer: "Activate cath lab",
    explanation:
      "STEMI inferior wall — activate cath lab and reperfusion. Option B is wrong because nitrates without reperfusion delay definitive care.",
    tags: ["physician-educator", "clinical-vignette", "cardiology"],
    source: "curated",
  };
}

function panceItem(id: string, i: number): BankItem {
  return {
    id,
    subjectId: "cardiovascular",
    question: `A 52-year-old woman presents to clinic with palpitations for 3 days (case ${i}). She denies chest pain but reports mild dyspnea on exertion. BP 128/78 mmHg, HR irregularly irregular at 118/min, lungs clear, no peripheral edema.

What is the most likely diagnosis?`,
    options: ["Atrial fibrillation", "Panic disorder", "Hyperthyroidism alone", "Benign PVCs"],
    correctAnswer: "Atrial fibrillation",
    explanation:
      "Irregularly irregular rhythm with palpitations is classic atrial fibrillation until proven otherwise; rate control and stroke risk assessment follow. Panic disorder lacks objective irregular rhythm.",
    tags: ["physician-educator", "clinical-vignette"],
    source: "curated",
  };
}

function npteItem(id: string, i: number): BankItem {
  return {
    id,
    subjectId: "musculoskeletal",
    question: `A physical therapist evaluates a 45-year-old construction worker (case ${i}) with acute low back pain after lifting. Pain radiates to the left leg with positive straight leg raise. No bowel or bladder changes. Strength 5/5 in lower extremities.

What is the priority intervention?`,
    options: [
      "Educate on movement and gradual activity within tolerance",
      "Strict bed rest for 2 weeks",
      "Immediate surgical referral",
      "No assessment needed",
    ],
    correctAnswer: "Educate on movement and gradual activity within tolerance",
    explanation:
      "Acute radicular low back pain without red flags is managed with activity modification, education, and progressive mobility — not prolonged bed rest or urgent surgery.",
    tags: ["physician-educator", "clinical-vignette"],
    source: "curated",
  };
}

const FIELD_FACTORIES: Record<string, (id: string, i: number) => BankItem> = {
  nursing: mocItem,
  pharmacy: naplexItem,
  pance: panceItem,
  "aanp-fnp": panceItem,
  "npte-pt": npteItem,
  "usmle-step-2": usmleItem,
  "usmle-step-1": usmleItem,
  "usmle-step-3": usmleItem,
};

describe("topic bank practice helpers", () => {
  it("covers all board exam field ids", () => {
    for (const fieldId of EXAM_FIELD_IDS) {
      expect(supportsTopicBankPractice(fieldId)).toBe(true);
    }
    for (const fieldId of USMLE_FIELD_IDS) {
      expect(supportsTopicBankPractice(fieldId)).toBe(true);
    }
  });

  it("requests a large enough sample pool for 25Q sessions", () => {
    expect(resolveTopicBankSampleCount(25)).toBeGreaterThanOrEqual(150);
  });

  it("requests a large enough sample pool for 100Q sessions", () => {
    expect(resolveTopicBankSampleCount(100)).toBeGreaterThanOrEqual(500);
  });
});

describe("topic bank practice — all exams", () => {
  for (const fieldId of [...EXAM_FIELD_IDS, ...USMLE_FIELD_IDS]) {
    it(`${fieldId}: fills 25 questions from a large template-stem pool`, () => {
      const factory = FIELD_FACTORIES[fieldId] ?? panceItem;
      const pool = Array.from({ length: 80 }, (_, i) => factory(`${fieldId}-${i}`, i));

      const sessionItems = prepareTopicBankItemsForSession({
        fieldId,
        items: pool,
        limit: 25,
      });

      expect(sessionItems.length).toBeGreaterThanOrEqual(25);

      const raw = sessionItems.slice(0, 25).map((item, i) =>
        bankItemToSessionRaw(fieldId, fieldId, item.subjectId ?? fieldId, item, i)
      );

      const { prepared, quality } = finalizeExamSessionQuestions(raw, 25, {
        fieldId,
        topicPractice: true,
      });

      expect(prepared).toHaveLength(25);
      expect(quality.returned).toBe(25);
    });
  }

  it("prepareBankItemsForSession topicPractice matches prepareTopicBankItemsForSession", () => {
    const pool = Array.from({ length: 40 }, (_, i) => mocItem(`moc-${i}`, 400 + i));
    const direct = prepareTopicBankItemsForSession({ fieldId: "nursing", items: pool, limit: 25 });
    const wrapped = prepareBankItemsForSession({
      fieldId: "nursing",
      field: "nursing",
      items: pool,
      limit: 25,
      topicPractice: true,
    });
    expect(wrapped).toHaveLength(direct.length);
  });
});
