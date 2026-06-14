import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem, normalizeNclexBankItemFields } from "@/lib/exam-prep/nclex-bank-audit";
import { assessNclexItemQuality } from "@/lib/exam-prep/nclex-quality-gate";
import {
  ensureNclexCuratedMetadata,
  ensureNclexExplanation,
  elevateNclexBankItem,
} from "@/lib/engine/polish/nclex-elevate";

describe("nclex-elevate", () => {
  it("normalizes duplicate vignette in stem when scenario is stored separately", () => {
    const vignette =
      "Medical-surgical unit. 68-year-old woman with heart failure. BP 88/54, HR 112, crackles bilaterally.";
    const item: BankItem = {
      subjectId: "med-surg",
      scenario: vignette,
      question: `${vignette}\n\nWhich action should the nurse take first?`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Short.",
      source: "generated",
    };

    const normalized = normalizeNclexBankItemFields(item);
    expect(normalized.question).toBe("Which action should the nurse take first?");
    const audit = auditNclexBankItem(normalized);
    expect(audit.issues.some((i) => i.code === "duplicate_vignette_in_stem")).toBe(false);
  });

  it("adds curated metadata and distractor rationales for legacy rows", () => {
    const legacy: BankItem = {
      subjectId: "safety-infection",
      vignette:
        "Skilled nursing facility. 83-year-old woman with C. diff. BP 118/72, HR 88, temp 100.8°F, watery diarrhea.",
      question: "Which infection control measure should the nurse implement first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "C",
      explanation: "Contact precautions are required.",
      tags: ["generated"],
      source: "generated",
    };

    const withMeta = ensureNclexCuratedMetadata(ensureNclexExplanation(legacy));
    expect(withMeta.source).toBe("polished");
    expect(withMeta.tags).toContain("cjmm-polished");
    expect(withMeta.explanation).toMatch(/Why other options are incorrect/i);
    expect(withMeta.explanation).toMatch(/Incorrect —/i);
  });

  it("elevates toward best tier without cartoon distractors", () => {
    const item: BankItem = {
      subjectId: "safety-infection",
      scenario:
        "Skilled nursing facility, Room 330. An 83-year-old woman is admitted with Clostridioides difficile infection. BP 118/72 mmHg, HR 88, temp 100.8°F (38.2°C). Watery diarrhea 6 times in 8 hours.",
      question: "Which infection control measure should the nurse implement first?",
      options: [
        "Use alcohol-based hand rub alone without soap and water after caring for this client",
        "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
        "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
      ],
      correctAnswer:
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
      explanation: "C. diff requires contact precautions.",
      tags: ["generated"],
      source: "generated",
    };

    const { item: elevated } = elevateNclexBankItem(item, "safety-infection", "Safety", 99, {
      forcePolish: true,
    });
    const verdict = assessNclexItemQuality(elevated, { source: "polished" });
    expect(verdict.tier).not.toBe("reject");
    expect(elevated.explanation).toMatch(/Why other options are incorrect/i);
  });
});
