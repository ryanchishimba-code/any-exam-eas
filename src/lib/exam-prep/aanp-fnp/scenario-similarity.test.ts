import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assembleAanpFnpSitting, aanpFnpDomainTargets, countAanpFnpDomains } from "./domain-mix";
import { scenariosAreNearDuplicate } from "./scenario-similarity";

function item(id: string, vignette: string, domain: string): BankItem {
  return {
    id,
    question: "What is the most appropriate next step?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because.",
    vignette,
    blueprintDomain: domain,
    subjectId: domain,
  };
}

const adhd =
  "An 8-year-old boy with ADHD has taken methylphenidate for 6 weeks with no improvement in school reports. Appetite is stable and sleep is unchanged. The parent asks what to do next.";

describe("AANP FNP scenario similarity", () => {
  it("treats the same vignette with a changed age as one scenario", () => {
    const younger = item("q14", adhd, "plan");
    const older = item("q48", adhd.replace("8-year-old", "9-year-old"), "plan");
    expect(scenariosAreNearDuplicate(younger, older)).toBe(true);
  });

  it("keeps a different patient", () => {
    const other = item(
      "q2",
      "A 67-year-old man with COPD presents with increased sputum, fever, and wheezing for two days. He uses tiotropium daily and has no chest pain.",
      "assess"
    );
    expect(scenariosAreNearDuplicate(item("q14", adhd, "plan"), other)).toBe(false);
  });

  it("drops the repeated scenario and fills from the pool", () => {
    const chosen = [
      item("q14", adhd, "plan"),
      item("q48", adhd.replace("8-year-old", "9-year-old"), "plan"),
    ];
    const fresh = item(
      "q3",
      "A 54-year-old woman has a blood pressure of 152/94 on two visits and no chest pain. She takes no daily medication. The exam is otherwise normal.",
      "diagnose"
    );
    const next = assembleAanpFnpSitting(chosen, [fresh, ...chosen], 2);
    expect(next.map((row) => row.id).sort()).toEqual(["q14", "q3"].sort());
  });
});

describe("AANP FNP domain mix", () => {
  it("uses the NPCB 135-question counts", () => {
    expect(aanpFnpDomainTargets(135)).toEqual({
      assess: 43,
      diagnose: 36,
      plan: 36,
      evaluate: 20,
    });
  });

  it("moves a sitting toward those counts without repeating a scenario", () => {
    const pool = [
      ...Array.from({ length: 4 }, (_, index) =>
        item(
          `a${index}`,
          `Assess visit ${index}. A ${30 + index}-year-old adult needs a screening history and physical for a new primary care visit. No acute complaint is present. Record ${index}.`,
          "assess"
        )
      ),
      ...Array.from({ length: 3 }, (_, index) =>
        item(
          `d${index}`,
          `Diagnose visit ${index}. A ${40 + index}-year-old adult has a new murmur and exertional dyspnea for one month. The lungs are clear. Record ${index}.`,
          "diagnose"
        )
      ),
      ...Array.from({ length: 3 }, (_, index) =>
        item(
          `p${index}`,
          `Plan visit ${index}. A ${50 + index}-year-old adult with type 2 diabetes has an A1C of 8.4 and needs a medication change. No hypoglycemia. Record ${index}.`,
          "plan"
        )
      ),
      item(
        "e0",
        "Evaluate visit. A 60-year-old adult returns after starting lisinopril. Blood pressure is at goal and the cough is new. Potassium is normal.",
        "evaluate"
      ),
    ];
    const chosen = pool.filter((row) => row.blueprintDomain === "assess").slice(0, 4);
    const seated = assembleAanpFnpSitting(chosen, pool, 4);
    const counts = countAanpFnpDomains(seated);
    expect(seated).toHaveLength(4);
    expect(counts.assess).toBeLessThan(4);
    expect(new Set(seated.map((row) => row.id)).size).toBe(4);
  });
});
