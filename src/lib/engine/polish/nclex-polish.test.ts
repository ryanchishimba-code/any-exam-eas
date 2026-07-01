import { describe, expect, it } from "vitest";
import {
  isWeakPrioritizationBankItem,
  needsNclexPolish,
  polishNclexBankItem,
  scoreNclexBankItem,
} from "@/lib/engine/polish/nclex-polish";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";

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
      vignette:
        "Medical-surgical unit. A 68-year-old woman with acute decompensated heart failure. Admitted 24 hours ago for fluid overload; receiving IV furosemide. BP 88/54 mmHg, HR 112, RR 24, SpO₂ 91% on 2 L NC. Crackles bilaterally, 2+ pitting edema.",
      question: "Which nursing action should the nurse take first?",
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
    expect(item.vignette ?? item.question).toMatch(/assigned four clients/i);
    expect(item.options.every((o) => o.startsWith("Room "))).toBe(true);
    expect(item.explanation).toMatch(/Why other options are incorrect/i);
  });

  it("polished output passes the QA gate audit for every template and seed", () => {
    const stems = [
      "Which task is appropriate for the nurse to delegate to UAP?",
      "Which infection control precaution should the nurse implement?",
      "Which response demonstrates therapeutic communication?",
      "Which action should the nurse take before administering the medication?",
      "Which method best evaluates discharge teaching?",
      "Which finding requires immediate nursing follow-up?",
      "Which client should the nurse see first?",
      "Which action should the nurse take?",
    ];
    for (const stem of stems) {
      for (let seed = 0; seed < 16; seed++) {
        const base: BankItem = {
          subjectId: "med-surg",
          question: stem,
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          explanation: "Short",
        };
        const { item, changed } = polishNclexBankItem(base, "med-surg", "Medical-Surgical", seed);
        expect(changed).toBe(true);
        const report = auditBankItem(item, "nursing");
        expect(
          report.issues.filter((i) => i.severity === "error"),
          `stem="${stem}" seed=${seed} issues=${JSON.stringify(report.issues)}`
        ).toEqual([]);
        expect(needsNclexPolish(item), `stem="${stem}" seed=${seed} re-flagged`).toBe(false);
      }
    }
  });

  it("flags and fixes legacy finding-stem items with action options", () => {
    const legacy: BankItem = {
      subjectId: "reduction-risk",
      vignette:
        "Medical-surgical unit, Room 318. A 72-year-old man with COPD exacerbation. 50-pack-year smoking history; on home oxygen. BP 148/86 mmHg, HR 104, RR 32, SpO₂ 86% on 2 L nasal cannula. Use of accessory muscles, speaking in short phrases.",
      question: "Which finding requires immediate nursing follow-up?",
      options: [
        "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
        "Document the finding and recheck at the next routine vital sign round in 4 hours",
        "Reassure the client that the finding is expected and requires no further action",
        "Delegate reassessment to UAP without RN follow-up on abnormal data",
      ],
      correctAnswer:
        "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
      explanation:
        "Long enough explanation about hypoxemia and work of breathing priorities for this client.",
    };
    expect(needsNclexPolish(legacy)).toBe(true);
    const { item, changed } = polishNclexBankItem(
      legacy,
      "reduction-risk",
      "Reduction of Risk Potential",
      7
    );
    expect(changed).toBe(true);
    expect(auditBankItem(item, "nursing").ok).toBe(true);
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
    expect(item.options.some((o) => /insulin self-administration/i.test(o))).toBe(false);
    expect(item.correctAnswer).toMatch(/intake and output/i);
  });

  it("risk polish varies distractors by seed for the same scenario template", () => {
    const genericRisk: BankItem = {
      subjectId: "reduction-risk",
      question: "Which finding requires immediate nursing follow-up?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Short",
    };

    const a = polishNclexBankItem(genericRisk, "reduction-risk", "Reduction of Risk Potential", 12).item;
    const b = polishNclexBankItem(genericRisk, "reduction-risk", "Reduction of Risk Potential", 97).item;

    expect(a.options.sort().join("|")).not.toBe(b.options.sort().join("|"));
  });

  it("risk polish avoids templated urine/pain/temperature distractors", () => {
    const genericRisk: BankItem = {
      subjectId: "reduction-risk",
      vignette:
        "Medical-surgical unit, Room 412. A 77-year-old man with upper GI bleed. History of peptic ulcer disease and aspirin use; melena reported overnight. BP 90/56 mmHg, HR 118, RR 20, Hgb 7.2 g/dL. Pale, cool extremities, active melena, lightheaded when repositioning, capillary refill 3 seconds.",
      question: "Which assessment finding should the nurse address first?",
      options: [
        "Pale, cool extremities, active melena, lightheaded when repositioning",
        "Pain rated 2/10 after scheduled analgesia, consistent with routine recovery",
        "Urine output 60 mL/hr of clear yellow urine over the past two hours",
        "Temperature 98.4°F (36.9°C) with skin warm, dry, and intact",
      ],
      correctAnswer: "Pale, cool extremities, active melena, lightheaded when repositioning",
      explanation: "Address perfusion first.",
    };

    const { item, changed } = polishNclexBankItem(
      genericRisk,
      "reduction-risk",
      "Reduction of Risk Potential",
      412
    );
    expect(changed).toBe(true);
    expect(item.options.join(" ")).not.toMatch(/Urine output 60 mL\/hr|Pain rated 2\/10|Temperature 98\.4°F/);
    expect(item.correctAnswer).toMatch(/pale|cool|capillary refill/i);
    expect(auditBankItem(item, "nursing").ok).toBe(true);
  });

  it("repairs delegation vignette grafted onto infection stem", () => {
    const broken: BankItem = {
      subjectId: "safety-infection",
      vignette:
        "Skilled nursing facility. Room 443. A 76-year-old woman with chronic heart failure with stable volume status is stable after initial assessment. The RN must assign tasks to unlicensed assistive personnel (UAP) while maintaining accountability.",
      question: "Which infection control measure should the nurse implement first?",
      options: [
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
        "Use alcohol-based hand rub alone without soap and water after caring for this client",
        "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
        "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
      ],
      correctAnswer:
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
      explanation: "Short",
    };

    expect(auditBankItem(broken, "nursing").ok).toBe(false);
    const { item, changed } = polishNclexBankItem(
      broken,
      "safety-infection",
      "Safety and Infection Control",
      443
    );
    expect(changed).toBe(true);
    expect(item.question).toMatch(/infection control|precautions/i);
    expect(item.question).not.toMatch(/delegate|UAP/i);
    expect(item.vignette).not.toMatch(/assign tasks to unlicensed assistive personnel/i);
    expect(auditBankItem(item, "nursing").ok).toBe(true);
  });
});
