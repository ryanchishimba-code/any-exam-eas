import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { clinicalCaseKey, sessionDedupeKey } from "./clinical-case-dedupe";
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

  it("keeps one row per session dedupe key and collapses an exact clone", () => {
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

    // Session keys include the lead-in, so different diagnosis prompts stay distinct.
    const akiSessionKeys = pool.slice(0, 4).map((row) => sessionDedupeKey(row));
    expect(new Set(akiSessionKeys).size).toBeGreaterThan(1);

    const collapsed = dedupeItemsByClinicalCase([pool[0]!, { ...pool[0]!, id: "enc-clone" }]);
    expect(collapsed).toHaveLength(1);

    const session = selectDiverseSessionBankItems(pool, 10, { seed: 99 });
    const sessionKeys = session.map((row) => sessionDedupeKey(row));
    expect(new Set(sessionKeys).size).toBe(session.length);
  });

  it("clinical spread collapses duplicate AKI templates", () => {
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

    const selected = selectSpreadRawInputs(raw, 4, { dedupeMode: "clinical" });
    const akiSelected = selected.filter((row) => /muddy brown casts/i.test(row.question));
    expect(akiSelected).toHaveLength(1);
  });
});
