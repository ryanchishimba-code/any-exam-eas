import { describe, expect, it } from "vitest";
import {
  applyUsmleStemRepairs,
  dedupeVignetteStem,
  hasDuplicateVignette,
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

  it("re-polishes legacy diagnosis answers that embed management language", () => {
    const legacy: BankItem = {
      subjectId: "neurology",
      question:
        "Case 1: A 19-year-old man with fever and neck stiffness. Which diagnosis best explains this clinical presentation?",
      options: [
        "Encephalitis",
        "Acute bacterial meningitis pending culture (empiric therapy required)",
        "Subarachnoid hemorrhage",
        "Viral meningitis",
      ],
      correctAnswer: "Acute bacterial meningitis pending culture (empiric therapy required)",
      explanation: "Bacterial meningitis requires empiric antibiotics.",
    };

    expect(needsUsmlePolish(legacy, "usmle-step-2")).toBe(true);

    const { item, changed } = polishUsmleBankItem(
      legacy,
      "usmle-step-2",
      "neurology",
      "Neurology",
      1
    );

    expect(changed).toBe(true);
    expect(item.correctAnswer).toBe("Acute bacterial meningitis");
    expect(item.options.every((o) => !/empiric therapy|pending culture/i.test(o))).toBe(true);
    expect(item.question).toMatch(/neck stiffness|mening/i);
  });

  it("summarizes exact CSF counts in diagnosis vignettes", () => {
    const legacy: BankItem = {
      subjectId: "neurology",
      question: "Case 2: fever, headache, stiff neck. Which diagnosis best explains this presentation?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "short",
    };

    const { item } = polishUsmleBankItem(
      legacy,
      "usmle-step-2",
      "neurology",
      "Neurology",
      1
    );

    const vignette = item.question.split("\n\n")[0] ?? "";
    if (vignette.includes("CSF")) {
      expect(vignette).not.toMatch(/CSF WBC 1,200/);
    }
  });

  it("repairs duplicated vignette blocks without full rebuild", () => {
    const vignette =
      "A 58-year-old man presents to the emergency department with crushing substernal chest pain for 40 minutes. Vital signs: BP 150/90 mmHg, HR 100, RR 18, SpO₂ 98%. ECG: ST depressions in V4–V6; troponin 1.2 ng/mL.";
    const duped: BankItem = {
      subjectId: "cardiology",
      question: `${vignette}\n\n${vignette}\n\nWhat is the next best step in management?`,
      options: ["Aspirin", "Discharge", "Observe", "NSAIDs only"],
      correctAnswer: "Aspirin",
      explanation: "Long explanation with mechanism and next best step guidance for acute coronary syndrome management in the emergency setting.",
    };

    expect(hasDuplicateVignette(duped.question)).toBe(true);
    expect(needsUsmlePolish(duped, "usmle-step-2")).toBe(true);

    const { item, changed } = polishUsmleBankItem(
      duped,
      "usmle-step-2",
      "cardiology",
      "Cardiology",
      99
    );

    expect(changed).toBe(true);
    expect(hasDuplicateVignette(item.question)).toBe(false);
    expect(item.question).toMatch(/next best step/i);
  });

  it("dedupes vignette stems surgically", () => {
    const stem =
      "Vignette line one. Vitals: BP 120/80.\n\nVignette line one. Vitals: BP 120/80.\n\nWhich diagnosis is most likely?";
    expect(dedupeVignetteStem(stem).split("\n\n")).toHaveLength(2);
    const repaired = applyUsmleStemRepairs({
      subjectId: "neurology",
      question: stem,
      options: ["A", "B", "C", "D"],
      correctAnswer: "Acute bacterial meningitis pending culture (empiric therapy required)",
      explanation: "test",
    });
    expect(repaired.correctAnswer).toBe("Acute bacterial meningitis");
  });

  it("does not duplicate vignette on full polish", () => {
    const { item } = polishUsmleBankItem(
      weakStep2,
      "usmle-step-2",
      "cardiology",
      "Cardiology",
      42
    );
    expect(hasDuplicateVignette(item.question)).toBe(false);
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
