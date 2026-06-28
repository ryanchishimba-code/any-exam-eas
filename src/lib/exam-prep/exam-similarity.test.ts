import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  auditExamSimilarity,
  candidateViolatesExamRules,
  filterBatchByExamSimilarity,
  primaryTestedConceptKey,
} from "./exam-similarity";
import { selectDiverseSessionBankItems } from "./diverse-session-selection";

const AKI_CASE =
  "A 69-year-old man presents to the inpatient ward with decreased urine output and confusion. NSAID use for osteoarthritis; hypertension; baseline creatinine 1.0 mg/dL. Vital signs: BP 88/54 mmHg, HR 104, RR 18, temp 99.4°F (37.4°C). Physical examination: Dry mucous membranes, delayed capillary refill; no rash. Laboratory/imaging: Creatinine 3.8 mg/dL (from 1.0), BUN 62 mg/dL, urinalysis: muddy brown casts, FENa 2.1%.";

function akiItem(id: string, stem: string): BankItem {
  return {
    id,
    subjectId: "pathology",
    question: `${AKI_CASE} Encounter ${id.slice(-4)}.\nSelect the one best response for this scenario.\n${stem}`,
    options: [
      "Postrenal obstruction",
      "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
      "Acute interstitial nephritis",
      "Prerenal azotemia",
    ],
    correctAnswer: "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
    explanation: "Muddy brown casts and FENa >2% indicate ATN.",
  };
}

describe("primaryTestedConceptKey", () => {
  it("collapses AKI template variants to one answer concept", () => {
    const keys = [
      primaryTestedConceptKey(akiItem("a", "What is the most likely diagnosis?")),
      primaryTestedConceptKey(akiItem("b", "Which diagnosis best explains this presentation?")),
    ];
    expect(keys[0]).toBe(keys[1]);
  });
});

describe("candidateViolatesExamRules", () => {
  it("rejects a second AKI template after the first is selected", () => {
    const first = akiItem("enc-1", "What is the most likely diagnosis?");
    const second = akiItem("enc-2", "Which diagnosis best explains this presentation?");
    expect(candidateViolatesExamRules(second, [first])).toBe(true);
  });
});

describe("filterBatchByExamSimilarity", () => {
  it("keeps one AKI item in a generated batch", () => {
    const batch = [
      akiItem("enc-1", "What is the most likely diagnosis?"),
      akiItem("enc-2", "Which diagnosis best explains this presentation?"),
      {
        id: "other",
        subjectId: "pharmacology",
        question: "Unique pharmacology vignette with enough detail.\nWhat is the mechanism?",
        options: ["Alpha blocker", "Beta blocker", "Calcium channel blocker", "ACE inhibitor"],
        correctAnswer: "Alpha blocker",
        explanation: "Unique teaching point.",
      },
    ];
    const { kept, dropped } = filterBatchByExamSimilarity(batch);
    expect(kept).toHaveLength(2);
    expect(dropped).toBe(1);
    expect(kept.filter((row) => /muddy brown casts/i.test(row.question))).toHaveLength(1);
  });
});

describe("selectDiverseSessionBankItems with exam-engine rules", () => {
  it("includes at most one AKI template in a 10-item session", () => {
    const pool = [
      akiItem("enc-1472", "What is the most likely diagnosis?"),
      akiItem("enc-8663", "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-7435", "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-1624", "What is the most likely diagnosis?"),
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `other-${i}`,
        subjectId: "pharmacology",
        question: `Unique pharmacology vignette ${i} with enough detail for case separation.\nWhat is the mechanism?`,
        options: [`Mechanism A ${i}`, `Mechanism B ${i}`, `Mechanism C ${i}`, `Mechanism D ${i}`],
        correctAnswer: `Mechanism A ${i}`,
        explanation: "Unique explanation.",
      })),
    ];

    const session = selectDiverseSessionBankItems(pool, 10, { seed: 99 });
    const akiInSession = session.filter((row) => /muddy brown casts/i.test(row.question));
    expect(akiInSession).toHaveLength(1);
    expect(auditExamSimilarity(session).some((i) => i.code === "duplicate_tested_concept")).toBe(
      false
    );
  });
});
