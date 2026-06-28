import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { resolveExamComposeConfig } from "@/lib/exam-prep/compose/exam-compose-config";
import { composeValidatedExamFromPool, renderValidatedExamSql } from "./exam-qa-engine";

const AKI_CASE =
  "A 69-year-old man presents to the inpatient ward with decreased urine output and confusion. NSAID use for osteoarthritis; hypertension; baseline creatinine 1.0 mg/dL. Vital signs: BP 88/54 mmHg, HR 104, RR 18, temp 99.4°F (37.4°C). Physical examination: Dry mucous membranes, delayed capillary refill; no rash. Laboratory/imaging: Creatinine 3.8 mg/dL (from 1.0), BUN 62 mg/dL, urinalysis: muddy brown casts, FENa 2.1%.";

function akiItem(id: string, stem: string): BankItem {
  return {
    id,
    subjectId: "pathology",
    question: `${AKI_CASE}\nSelect the one best response for this scenario.\n${stem}`,
    options: [
      "Postrenal obstruction",
      "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
      "Acute interstitial nephritis",
      "Prerenal azotemia",
    ],
    correctAnswer: "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
    explanation:
      "Muddy brown casts and FENa >2% indicate acute tubular necrosis rather than prerenal azotemia alone.",
    difficulty: 3,
  };
}

function uniqueItem(id: string, subjectId: string, n: number): BankItem {
  const diseases = [
    "celiac sprue",
    "sarcoidosis",
    "hypertrophic cardiomyopathy",
    "Guillain-Barré syndrome",
    "polycythemia vera",
    "Addison disease",
    "myasthenia gravis",
    "Wilson disease",
    "pheochromocytoma",
    "systemic sclerosis",
  ];
  const disease = diseases[n % diseases.length]!;
  const vignette = `A ${22 + n}-year-old presents with ${disease}-specific findings including unique vitals, labs, and exam features for case ${n}.`;
  return {
    id,
    subjectId,
    blueprintDomain: subjectId,
    question: `${vignette}\nWhich diagnosis is most likely?`,
    options: [`${disease} flare`, `Alternative A ${n}`, `Alternative B ${n}`, `Alternative C ${n}`],
    correctAnswer: `${disease} flare`,
    explanation: "Board-style rationale explaining the correct clinical decision in detail.",
    difficulty: 3,
  };
}

describe("composeValidatedExamFromPool", () => {
  it("passes final check with at most one AKI template in a 6-item session", () => {
    const config = resolveExamComposeConfig("usmle-step-1")!;
    const pool: BankItem[] = [
      akiItem("aki-1", "What is the most likely diagnosis?"),
      akiItem("aki-2", "Which diagnosis best explains this presentation?"),
      akiItem("aki-3", "Which diagnosis best explains this clinical presentation?"),
      akiItem("aki-4", "What is the most likely diagnosis?"),
    ];
    for (let i = 0; i < 30; i++) {
      pool.push(uniqueItem(`u-${i}`, i % 2 === 0 ? "pharmacology" : "biochemistry", i));
    }

    const result = composeValidatedExamFromPool(config, pool, 6, 99);
    expect(result.returned).toBe(6);
    expect(result.finalCheck.similarityIssues).toHaveLength(0);
    expect(result.status).toBe("PASSED");
    const akiCount =
      result.exam?.questions.filter((q) => /muddy brown casts/i.test(q.question ?? "")).length ?? 0;
    expect(akiCount).toBeLessThanOrEqual(1);
  });
});

describe("renderValidatedExamSql", () => {
  it("includes status header and link inserts", () => {
    const sql = renderValidatedExamSql({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      examNumber: 1,
      questionCount: 3,
      questionIds: ["id-a", "id-b", "id-c"],
      status: "PASSED",
      fixes: [{ code: "backfill", message: "Added item.", action: "pool_backfill" }],
    });
    expect(sql).toContain("Status: PASSED Final Check");
    expect(sql).toContain("Issues Fixed: backfill");
    expect(sql).toContain("nclex_full_practice_exam_questions");
    expect(sql).toContain("'id-a'");
  });
});
