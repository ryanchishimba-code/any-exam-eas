import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  PANCE_FULL_DIFFICULTY_FLOOR,
  assemblePanceSitting,
  panceContentTargets,
  panceDifficultyPoolReport,
} from "./sitting";

function item(
  id: string,
  content: string,
  difficulty: number,
  vignette: string
): BankItem {
  return {
    id,
    subjectId: content,
    blueprintDomain: content,
    difficulty,
    question: "Which management is most appropriate?",
    vignette,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because the vignette supports A.",
  };
}

describe("pance sitting", () => {
  it("splits a 300-question form by the NCCPA content weights", () => {
    const targets = panceContentTargets(300);
    expect(targets.cardiovascular).toBe(33);
    expect(targets.pulmonary).toBe(27);
    expect(Object.values(targets).reduce((sum, count) => sum + count, 0)).toBe(300);
  });

  it("drops a repeated scenario and keeps the content mix", () => {
    const shared =
      "A 54-year-old man has watery diarrhea after a recent antibiotic course. He is not severely ill. Leukocytosis is absent. This is the first episode.";
    const pool = [
      item("dup-a", "infectious-diseases", 3, shared),
      item("dup-b", "infectious-diseases", 3, shared),
      item(
        "cv",
        "cardiovascular",
        4,
        "A 68-year-old man has crushing chest pain for 40 minutes with ST elevation in the anterior leads. He is diaphoretic. Blood pressure is 150/90 mm Hg."
      ),
      item(
        "pulm",
        "pulmonary",
        4,
        "A 62-year-old woman has sudden dyspnea and pleuritic pain one week after a hip replacement. Heart rate is 118/min and oxygen saturation is 88 percent."
      ),
    ];
    const sitting = assemblePanceSitting(pool, pool, 3);
    expect(sitting).toHaveLength(3);
    expect(new Set(sitting.map((row) => row.id)).size).toBe(3);
    expect(sitting.filter((row) => row.id === "dup-a" || row.id === "dup-b")).toHaveLength(1);
  });

  it("keeps difficulty 1 and 2 out of a full simulation when harder rows can fill it", () => {
    const pool: BankItem[] = [];
    const areas = ["cardiovascular", "pulmonary", "gastrointestinal", "musculoskeletal", "infectious-diseases"];
    for (let i = 0; i < 320; i += 1) {
      const area = areas[i % areas.length]!;
      pool.push(
        item(
          `hard-${i}`,
          area,
          3 + (i % 3),
          `Record ${i} only. ${area} marker ${i}a exposure ${i}b lab ${10000 + i}. Narrative ${i} does not repeat another record.`
        )
      );
    }
    pool.push(
      item(
        "easy-ankle",
        "musculoskeletal",
        2,
        "A 20-year-old twists an ankle playing basketball. The Ottawa ankle rules are negative. Swelling is mild and the patient can walk."
      )
    );
    const report = panceDifficultyPoolReport(pool);
    expect(report.floor).toBe(PANCE_FULL_DIFFICULTY_FLOOR);
    expect(report.floorCanFillFullExam).toBe(true);
    expect(report.belowFloor).toBe(1);
    const sitting = assemblePanceSitting(pool, pool, 300);
    expect(sitting).toHaveLength(300);
    expect(sitting.some((row) => row.id === "easy-ankle")).toBe(false);
    expect(sitting.every((row) => (row.difficulty ?? 0) >= 3)).toBe(true);
  });

  it("does not apply the floor when harder rows cannot fill the simulation", () => {
    const pool = [
      item(
        "easy",
        "cardiovascular",
        2,
        "A 70-year-old man has stable angina on walking uphill. Rest relieves the pain. The exam is otherwise normal and the electrocardiogram is unchanged."
      ),
    ];
    const report = panceDifficultyPoolReport(pool);
    expect(report.floorCanFillFullExam).toBe(false);
    expect(report.atOrAboveFloor).toBe(0);
    expect(assemblePanceSitting(pool, pool, 300).map((row) => row.id)).toEqual(["easy"]);
  });
});
