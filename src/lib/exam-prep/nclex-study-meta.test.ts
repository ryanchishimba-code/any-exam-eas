import { describe, expect, it } from "vitest";
import {
  buildNclexStudyMetaPatch,
  extractTop500DrugsFromText,
  resolveNclexSubjectId,
} from "./nclex-study-meta";

describe("nclex-study-meta", () => {
  it("remaps orphan pharmacology subject id", () => {
    expect(resolveNclexSubjectId("pharmacology")).toBe("pharmacology-nursing");
  });

  it("extracts Top 500 drugs from vignette text", () => {
    const drugs = extractTop500DrugsFromText(
      "The nurse prepares norepinephrine (Levophed) and piperacillin-tazobactam for septic shock."
    );
    expect(drugs.length).toBeGreaterThan(0);
    expect(drugs.some((d) => /norepinephrine/i.test(d))).toBe(true);
  });

  it("adds review module and drug links for pharmacology items", () => {
    const patch = buildNclexStudyMetaPatch({
      subjectId: "pharmacology-nursing",
      vignette: "A client in septic shock receives norepinephrine via central line.",
      question: "Which action should the nurse take first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation:
        "Why other options are incorrect: Norepinephrine requires arterial line monitoring per guidelines. Incorrect — delaying pressor risks organ hypoperfusion.",
    });
    expect(patch.subjectId).toBe("pharmacology-nursing");
    expect(patch.topicCategory).toBe("Pharmacological Therapies");
    expect(Array.isArray(patch.ngnPayload.top500Drugs)).toBe(true);
    expect((patch.ngnPayload.top500Drugs as string[]).some((d) => /norepinephrine/i.test(d))).toBe(
      true
    );
  });
});
