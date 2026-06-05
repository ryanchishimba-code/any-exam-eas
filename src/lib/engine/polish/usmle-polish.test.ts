import { describe, expect, it } from "vitest";
import {
  needsUsmlePolish,
  polishUsmleBankItem,
  scoreUsmleBankItem,
} from "@/lib/engine/polish/usmle-polish";
import type { BankItem } from "@/lib/question-bank";

const weakStep2: BankItem = {
  subjectId: "cardiology",
  question:
    "Case 12: A 58-year-old male in the emergency department reports chest pain. Which initial approach is most appropriate for suspected cardiology assessment?",
  options: [
    "Focused cardiology assessment evaluation with targeted history and exam",
    "Defer all assessment until imaging is completed",
    "Treat unrelated symptoms without evaluation",
    "Discharge without vital signs or documentation",
  ],
  correctAnswer: "Focused cardiology assessment evaluation with targeted history and exam",
  explanation: "Cardiology: cardiology assessment requires structured assessment.",
};

const weakStep1: BankItem = {
  subjectId: "pharmacology",
  question:
    "Case 5: A student reviewing Pharmacology asks why chest pain may occur in pharmacology MOA. Which explanation is best?",
  options: [
    "Pathophysiology of pharmacology MOA explains the dominant finding",
    "Random symptom association without mechanism",
    "Only psychological causes in all patients",
    "Exclusive nutritional deficiency in every case",
  ],
  correctAnswer: "Pathophysiology of pharmacology MOA explains the dominant finding",
  explanation: "Mechanism-based teaching for pharmacology MOA.",
};

describe("usmle-polish", () => {
  it("scores weak template items low", () => {
    expect(scoreUsmleBankItem(weakStep2, "usmle-step-2")).toBeLessThan(0.55);
    expect(needsUsmlePolish(weakStep2, "usmle-step-2")).toBe(true);
  });

  it("polishes Step 2 items with vignette, next step logic, and distractor rationales", () => {
    const { item, changed, qualityAfter } = polishUsmleBankItem(
      weakStep2,
      "usmle-step-2",
      "cardiology",
      "Cardiology",
      42
    );

    expect(changed).toBe(true);
    expect(qualityAfter).toBeGreaterThan(0.62);
    expect(item.question).not.toMatch(/^Case\s+\d+:/i);
    expect(item.question).toMatch(/BP|troponin|ECG|mmHg/i);
    expect(item.question).toMatch(/\n\n/);
    expect(item.explanation).toMatch(/Step 2|next best|Why other options are incorrect/i);
    expect(item.options).toHaveLength(4);
    expect(item.options).toContain(item.correctAnswer);
  });

  it("polishes Step 1 items with mechanism-focused reasoning", () => {
    const { item, changed, qualityAfter } = polishUsmleBankItem(
      weakStep1,
      "usmle-step-1",
      "pharmacology",
      "Pharmacology",
      7
    );

    expect(changed).toBe(true);
    expect(qualityAfter).toBeGreaterThan(0.62);
    expect(item.explanation).toMatch(/Step 1|mechanism|pathophys/i);
    expect(item.explanation.length).toBeGreaterThan(200);
  });

  it("preserves strong items when already high quality", () => {
    const strong: BankItem = {
      subjectId: "cardiology",
      question:
        "A 58-year-old man presents to the emergency department with crushing substernal chest pain radiating to the left arm for 45 minutes. Hypertension and hyperlipidemia. Vital signs: BP 156/92 mmHg, HR 98. ECG: ST elevation in II, III, aVF; troponin 2.8 ng/mL.\n\nWhat is the next best step in management?",
      options: [
        "Activate PCI-capable cath lab and administer aspirin, P2Y12 inhibitor, anticoagulation per ACS protocol",
        "Discharge with outpatient stress test in 2 weeks",
        "Obtain CT pulmonary angiography as the first test",
        "Start high-dose NSAIDs alone and observe",
      ],
      correctAnswer:
        "Activate PCI-capable cath lab and administer aspirin, P2Y12 inhibitor, anticoagulation per ACS protocol",
      explanation:
        "USMLE Step 2 CK reasoning: inferior STEMI with ST elevation and elevated troponin requires emergent reperfusion. Why other options are incorrect: discharge delays life-saving therapy; CTPA addresses PE not STEMI; NSAIDs alone do not treat coronary occlusion.",
    };
    const before = scoreUsmleBankItem(strong, "usmle-step-2");
    const { changed } = polishUsmleBankItem(
      strong,
      "usmle-step-2",
      "cardiology",
      "Cardiology",
      1
    );
    expect(before).toBeGreaterThan(0.62);
    expect(changed).toBe(false);
  });
});
