import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem } from "./nclex-bank-audit";
import {
  isNclexNgnItem,
  nclexNgnCorrectAnswerValid,
  splitNclexDuplicateVignette,
} from "./nclex-ngn-audit";

describe("nclexNgnCorrectAnswerValid", () => {
  it("accepts bow-tie answers stored against payload actions/monitors", () => {
    const item: BankItem = {
      subjectId: "physiological-adaptation",
      vignette: "ED: 71M HFrEF. BP 90/58, HR 110, lungs crackles bilat.",
      question: "Bow-tie: Select ONE action and TWO findings to monitor.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "Give cautious IV fluid bolus per protocol,Orthostatic vital signs,Urine output hourly",
      explanation:
        "Hypotension with volume overload may need cautious bolus while tracking perfusion and output. Why other options are incorrect: Incorrect — other actions ignore perfusion.",
      itemType: "ngn_bowtie",
      ngnPayload: {
        kind: "bow_tie",
        actions: ["Give cautious IV fluid bolus per protocol", "Stop all diuretics now"],
        monitors: ["Orthostatic vital signs", "Urine output hourly"],
        monitorPickCount: 2,
      },
      tags: ["test"],
    };

    expect(isNclexNgnItem(item)).toBe(true);
    expect(nclexNgnCorrectAnswerValid(item)).toBe(true);
    expect(auditNclexBankItem(item).ok).toBe(true);
  });

  it("accepts matrix row-column mappings", () => {
    const item: BankItem = {
      subjectId: "med-surg",
      vignette: "POD2 abdominal surgery.",
      question: "For each finding, select the best column.",
      options: ["A", "B", "C", "D"],
      correctAnswer: "SpO₂ 87% on RA|||Intervene now,Serosanguineous dressing drainage|||Expected",
      explanation:
        "Hypoxia needs immediate action while expected drainage may be normal. Why other options are incorrect: Incorrect — delaying hypoxia care is unsafe.",
      itemType: "ngn_matrix",
      ngnPayload: {
        kind: "matrix",
        rows: ["SpO₂ 87% on RA", "Serosanguineous dressing drainage"],
        columns: ["Intervene now", "Expected", "Needs more data"],
      },
      tags: ["test"],
    };

    expect(nclexNgnCorrectAnswerValid(item)).toBe(true);
    expect(auditNclexBankItem(item).ok).toBe(true);
  });

  it("splits duplicated vignette text out of the question column", () => {
    const vignette =
      "A 68-year-old with HFrEF returns after diuretic adjustment. BP 92/58, HR 112, bilateral crackles, 2+ edema.";
    const item: BankItem = {
      subjectId: "physiological-adaptation",
      scenario: vignette,
      question: `${vignette}\n\nComplete the bow-tie: select ONE action and TWO conditions to monitor.`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "Administer IV bolus per protocol,Orthostatic hypotension,Daily weights and I/O",
      explanation:
        "Hypotension with overload signs may need cautious fluid while monitoring orthostasis and fluid balance. Why other options are incorrect: Incorrect — ignoring perfusion is unsafe.",
      itemType: "ngn_bowtie",
      ngnPayload: {
        kind: "bow_tie",
        actions: ["Administer IV bolus per protocol"],
        monitors: ["Orthostatic hypotension", "Daily weights and I/O"],
      },
      tags: ["test"],
    };

    const fixed = splitNclexDuplicateVignette(item);
    expect(fixed?.question).toBe("Complete the bow-tie: select ONE action and TWO conditions to monitor.");
    expect(auditNclexBankItem(fixed!).issues.some((i) => i.code === "duplicate_vignette_in_stem")).toBe(
      false
    );
  });
});
