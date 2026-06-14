import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem } from "./nclex-bank-audit";
import { NCLEX_BOARD_QUALITY_CONTROLS } from "./nclex-board-quality";
import { assessNclexItemQuality } from "./nclex-quality-gate";

describe("NCLEX board-quality controls", () => {
  it("documents control thresholds", () => {
    expect(NCLEX_BOARD_QUALITY_CONTROLS.minBestScore).toBeGreaterThanOrEqual(0.68);
    expect(NCLEX_BOARD_QUALITY_CONTROLS.runtimeServeAudit).toBe(true);
    expect(NCLEX_BOARD_QUALITY_CONTROLS.curatedOnlySampling).toBe(true);
  });

  it("rejects cartoon pharmacology distractors (metoprolol shock example)", () => {
    const item: BankItem = {
      subjectId: "pharmacology-nursing",
      vignette:
        "Post-anesthesia care unit. 44-year-old woman with postoperative hypovolemic shock. BP 82/48 mmHg, HR 128, cool clammy skin, urine output 10 mL/hr. New order for metoprolol.",
      question: "Which nursing action is the priority before administering the prescribed medication?",
      options: [
        "Use another client's medication if the MAR is unavailable",
        "Administer metoprolol without verifying the client's identity or allergy history",
        "Document administration before giving the medication to save time",
        "Verify the six rights, check allergies and relevant labs, and assess BP 82/48 mmHg before administering metoprolol",
      ],
      correctAnswer:
        "Verify the six rights, check allergies and relevant labs, and assess BP 82/48 mmHg before administering metoprolol",
      explanation: "Short explanation without distractor rationales.",
      tags: ["generated"],
      source: "generated",
    };

    const audit = auditNclexBankItem(item);
    expect(audit.issues.some((i) => i.code === "generic_pharmacology_distractors")).toBe(true);
    expect(audit.issues.some((i) => i.code === "clinical_medication_vignette_mismatch")).toBe(true);

    const verdict = assessNclexItemQuality(item, { source: "generated" });
    expect(verdict.tier).toBe("reject");
    expect(verdict.ok).toBe(false);
  });

  it("rejects generic intervention priority wrongs (warfarin example distractors)", () => {
    const item: BankItem = {
      subjectId: "physiological-adaptation",
      vignette:
        "Medical-surgical unit. DVT on warfarin. INR 4.8, nosebleed, tarry stools.",
      question: "What is the nurse's priority action?",
      options: [
        "Restrict all oral intake for 24 hours without provider order or further assessment",
        "Wait until the next scheduled assessment round to recheck vital signs despite acute changes",
        "Complete routine comfort measures for all other assigned clients before addressing abnormal findings",
        "Hold warfarin, notify provider, assess bleeding, prepare for vitamin K per protocol",
      ],
      correctAnswer:
        "Hold warfarin, notify provider, assess bleeding, prepare for vitamin K per protocol",
      explanation:
        "Clinical Judgment (CJMM): supratherapeutic INR with bleeding.\nWhy other options are incorrect:\n• Restrict oral intake: Incorrect — does not treat bleeding.\n• Wait: Incorrect — delays urgent care.\n• Comfort measures first: Incorrect — wrong priority.",
      tags: ["cjmm-polished"],
      source: "polished",
    };

    const audit = auditNclexBankItem(item);
    expect(audit.issues.some((i) => i.code === "generic_intervention_distractors")).toBe(true);
  });
});
