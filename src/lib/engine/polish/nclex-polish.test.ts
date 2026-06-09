import { describe, expect, it } from "vitest";
import {
  isWeakPrioritizationBankItem,
  needsNclexPolish,
  polishNclexBankItem,
  scoreNclexBankItem,
} from "@/lib/engine/polish/nclex-polish";
import type { BankItem } from "@/lib/question-bank";

const weakTemplate: BankItem = {
  subjectId: "management-of-care",
  question:
    "NCLEX 12: Four clients are assigned to you. Which client should be assessed first based on prioritization?",
  options: [
    "Unstable airway, breathing, or circulation related to prioritization",
    "Stable client requesting discharge teaching only",
    "Client with scheduled routine screening in 2 weeks",
    "Client with chronic stable pain rated 2/10",
  ],
  correctAnswer: "Unstable airway, breathing, or circulation related to prioritization",
  explanation: "NCLEX prioritization: address life-threatening problems first (Management of Care).",
};

describe("nclex-polish", () => {
  it("scores weak template items low", () => {
    expect(scoreNclexBankItem(weakTemplate)).toBeLessThan(0.55);
    expect(needsNclexPolish(weakTemplate)).toBe(true);
  });

  it("polishes weak items with vignette, vitals, and CJMM rationale", () => {
    const { item, changed, qualityAfter } = polishNclexBankItem(
      weakTemplate,
      "management-of-care",
      "Management of Care",
      42
    );

    expect(changed).toBe(true);
    expect(qualityAfter).toBeGreaterThan(0.62);
    expect(item.question).not.toMatch(/^NCLEX\s+\d+:/i);
    const blob = `${item.vignette ?? ""}\n${item.question}`;
    expect(blob).toMatch(/BP|HR|SpO₂|SpO2|mmHg/i);
    expect(item.vignette || item.question).toBeTruthy();
    expect(item.explanation).toMatch(/Recognize cues|Clinical Judgment \(CJMM\)/i);
    expect(item.explanation).toMatch(/Why other options are incorrect/i);
    expect(item.options).toHaveLength(4);
    expect(item.options).toContain(item.correctAnswer);
  });

  it("preserves strong items when already high quality", () => {
    const strong: BankItem = {
      subjectId: "physiological-adaptation",
      question:
        "0845 — Medical-surgical unit. A 68-year-old woman with acute decompensated heart failure. Admitted 24 hours ago for fluid overload; receiving IV furosemide. BP 88/54 mmHg, HR 112, RR 24, SpO₂ 91% on 2 L NC. Crackles bilaterally, 2+ pitting edema.\n\nWhich nursing action should the nurse take first?",
      options: [
        "Assess perfusion and respiratory status; notify provider and prepare for fluid/hemodynamic support per protocol",
        "Complete routine comfort measures for all other assigned clients before addressing abnormal findings",
        "Wait until the next scheduled assessment round to recheck vital signs despite acute changes",
        "Restrict all oral intake for 24 hours without provider order or further assessment",
      ],
      correctAnswer:
        "Assess perfusion and respiratory status; notify provider and prepare for fluid/hemodynamic support per protocol",
      explanation:
        "Clinical Judgment (CJMM):\n1. Recognize cues: hypotension, tachycardia, crackles, edema.\n2. Analyze cues: reduced cardiac output with pulmonary congestion.\n3. Prioritize hypotheses: ABCs and perfusion take priority.\n4. Take action: notify provider and support hemodynamics.\nWhy other options are incorrect:\n• Delaying reassessment ignores unstable vital signs.",
    };
    const before = scoreNclexBankItem(strong);
    const { changed } = polishNclexBankItem(
      strong,
      "physiological-adaptation",
      "Physiological Adaptation",
      1
    );
    expect(before).toBeGreaterThan(0.62);
    expect(changed).toBe(false);
  });

  it("replaces weak four-client prioritization templates", () => {
    const badPrioritization: BankItem = {
      subjectId: "management-of-care",
      question:
        "1052 — Report on four assigned clients (emergency department, Room 262):\n• Client 1: 57-year-old man with type 2 diabetes with hyperglycemia. Glucose 412 mg/dL.\n• Client 2: Stable postoperative day 3 — pain 2/10.\n• Client 3: Chronic osteoarthritis — PRN acetaminophen for pain 3/10.\n• Client 4: Type 2 diabetes — pre-lunch glucose 142 mg/dL, asymptomatic.\n\nWhich client is the highest priority for the nurse to see first?",
      options: [
        "57-year-old man with type 2 diabetes with hyperglycemia: BP 138/84 mmHg; Glucose 412 mg/dL",
        "Stable postoperative client on day 3 requesting discharge teaching only; pain 2/10",
        "Client with chronic osteoarthritis requesting scheduled PRN acetaminophen; pain rated 3/10",
        "Client with well-controlled type 2 diabetes before lunch; glucose 142 mg/dL",
      ],
      correctAnswer:
        "57-year-old man with type 2 diabetes with hyperglycemia: BP 138/84 mmHg; Glucose 412 mg/dL",
      explanation: "Prioritization rationale.",
    };

    expect(isWeakPrioritizationBankItem(badPrioritization)).toBe(true);

    const { item, changed } = polishNclexBankItem(
      badPrioritization,
      "management-of-care",
      "Management of Care",
      99
    );

    expect(changed).toBe(true);
    expect(item.question).not.toMatch(
      /Stable postoperative day 3|Chronic osteoarthritis — PRN|142 mg\/dL, asymptomatic/
    );
    expect(item.vignette ?? item.question).toMatch(/Handoff report/);
    expect(item.options.every((o) => o.startsWith("Room "))).toBe(true);
    expect(item.explanation).toMatch(/Why other options are incorrect/i);
  });

  it("delegation polish uses stable scenarios that match the stem", () => {
    const delegationSeed: BankItem = {
      subjectId: "management-of-care",
      question: "Which task is appropriate to delegate to UAP?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Short",
    };
    const { item } = polishNclexBankItem(
      delegationSeed,
      "management-of-care",
      "Management of Care",
      99
    );

    const vignette = item.vignette ?? item.question;
    expect(vignette).toMatch(/stable after initial assessment/i);
    expect(vignette).not.toMatch(/SpO₂ 90%|peak flow 45%|intercostal retractions/i);
    expect(vignette).not.toMatch(/18-year-old (?:man|woman).*moderate asthma exacerbation/i);
    expect(item.question).not.toMatch(/Pediatric emergency department/i);
    expect(item.vignette).toBeTruthy();
    expect(item.question).toMatch(/delegate|UAP/i);
  });
});
