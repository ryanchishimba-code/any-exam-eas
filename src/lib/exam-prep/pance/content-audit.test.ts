import { describe, expect, it } from "vitest";
import {
  jokeDistractors,
  nearDuplicateStemGroups,
  tautologicalOneLineRationale,
  type PanceAuditItem,
} from "./content-audit";

function item(partial: Partial<PanceAuditItem> & Pick<PanceAuditItem, "id" | "question">): PanceAuditItem {
  return {
    scenario: null,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "A is chosen because the other options miss the diagnosis, the contraindication, or the next step.",
    ...partial,
  };
}

describe("PANCE content audit", () => {
  it("groups near-duplicate stems and leaves a different case alone", () => {
    const shared =
      "A 44-year-old woman has a first episode of nonsevere watery diarrhea after antibiotics. She is drinking fluids and has no fever or abdominal rigidity.";
    const groups = nearDuplicateStemGroups([
      item({ id: "a", question: `${shared}\n\nWhich treatment is indicated?`, scenario: shared }),
      item({ id: "b", question: `${shared}\n\nWhat is the best next step?`, scenario: shared }),
      item({
        id: "c",
        question: "A 70-year-old man has crushing chest pain and ST elevation.",
        scenario:
          "A 70-year-old man has crushing chest pain for 30 minutes, diaphoresis, and ST elevation in the anterior leads. Blood pressure is 150/90 mm Hg.",
      }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.map((row) => row.id).sort()).toEqual(["a", "b"]);
  });

  it("flags a joke distractor and a one-line tautology", () => {
    const joke = item({
      id: "joke",
      question: "Refractory hyperkalemia. Which treatment is next?",
      options: ["Insulin with glucose", "Another dose of ibuprofen", "Calcium", "Dialysis"],
    });
    expect(jokeDistractors(joke)).toEqual(["Another dose of ibuprofen"]);
    expect(
      tautologicalOneLineRationale(
        item({
          id: "thin",
          question: "Catheter drainage.",
          correctAnswer: "Urethral catheter drainage",
          explanation: "Urethral catheter drainage is correct.",
        })
      )
    ).toBe(true);
    expect(
      tautologicalOneLineRationale(
        item({
          id: "full",
          question: "Catheter drainage.",
          correctAnswer: "Urethral catheter drainage",
          explanation:
            "Urethral catheter drainage is correct because the patient is in retention. Observation misses the obstruction. Antibiotics do not empty the bladder.",
        })
      )
    ).toBe(false);
  });
});
