import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { clinicalCaseKey } from "./clinical-case-dedupe";
import {
  dedupeItemsByClinicalCase,
  selectDiverseSessionBankItems,
} from "./diverse-session-selection";
import { selectSpreadRawInputs } from "@/lib/questions/spread-session-order";
import type { RawQuestionInput } from "@/lib/questions/types";

const AKI_CASE =
  "A 69-year-old man presents to the inpatient ward with decreased urine output and confusion. NSAID use for osteoarthritis; hypertension; baseline creatinine 1.0 mg/dL. Vital signs: BP 88/54 mmHg, HR 104, RR 18, temp 99.4°F (37.4°C). Physical examination: Dry mucous membranes, delayed capillary refill; no rash. Laboratory/imaging: Creatinine 3.8 mg/dL (from 1.0), BUN 62 mg/dL, urinalysis: muddy brown casts, FENa 2.1%.";

function akiItem(id: string, age: number, stem: string): BankItem {
  return {
    id,
    subjectId: "pathology",
    question: `${AKI_CASE.replace("69-year-old", `${age}-year-old`)} Encounter ${id.slice(-4)}.\nSelect the one best response for this scenario.\n${stem}`,
    options: [
      "Postrenal obstruction",
      "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
      "Acute interstitial nephritis",
      "Prerenal azotemia",
    ],
    correctAnswer: "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
    explanation:
      "Muddy brown casts and FENa >2% indicate acute tubular necrosis rather than prerenal azotemia alone.",
  };
}

describe("USMLE Step 1 duplicate AKI templates", () => {
  it("assigns the same clinical case key to near-duplicate embedded vignettes", () => {
    const keys = [
      clinicalCaseKey(akiItem("enc-1472", 69, "What is the most likely diagnosis?")),
      clinicalCaseKey(akiItem("enc-8663", 69, "Which diagnosis best explains this clinical presentation?")),
      clinicalCaseKey(akiItem("enc-7435", 69, "Which diagnosis best explains this clinical presentation?")),
      clinicalCaseKey(akiItem("enc-1624", 74, "What is the most likely diagnosis?")),
    ];
    expect(new Set(keys).size).toBe(1);
  });

  it("keeps only one AKI template in a session-sized slice", () => {
    const pool = [
      akiItem("enc-1472", 69, "What is the most likely diagnosis?"),
      akiItem("enc-8663", 69, "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-7435", 69, "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-1624", 74, "What is the most likely diagnosis?"),
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `other-${i}`,
        subjectId: "pharmacology",
        question: `Unique pharmacology vignette ${i} with enough detail for case separation.\nWhat is the mechanism?`,
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Unique explanation.",
      })),
    ];

    const deduped = dedupeItemsByClinicalCase(pool);
    const akiKey = clinicalCaseKey(pool[0]!);
    const akiRows = deduped.filter((row) => clinicalCaseKey(row) === akiKey);
    expect(akiRows).toHaveLength(1);

    const session = selectDiverseSessionBankItems(pool, 10, { seed: 99 });
    const akiInSession = session.filter((row) => /muddy brown casts/i.test(row.question));
    expect(akiInSession).toHaveLength(1);
  });

  it("finalize spread selection collapses duplicate bankItemIds with the same case", () => {
    const raw: RawQuestionInput[] = [
      akiItem("enc-1472", 69, "What is the most likely diagnosis?"),
      akiItem("enc-8663", 69, "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-7435", 69, "Which diagnosis best explains this clinical presentation?"),
      akiItem("enc-1624", 74, "What is the most likely diagnosis?"),
    ].map((item, index) => ({
      id: index + 1,
      type: "multiple_choice" as const,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      subjectId: item.subjectId,
      bankItemId: item.id,
    }));

    const selected = selectSpreadRawInputs(raw, 4);
    const akiSelected = selected.filter((row) => /muddy brown casts/i.test(row.question));
    expect(akiSelected).toHaveLength(1);
  });
});
