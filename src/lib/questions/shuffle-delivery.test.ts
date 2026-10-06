import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { shuffleDeliveryChoices } from "@/lib/questions/shuffle-delivery";

const OPTIONS = [
  "Give intravenous fluids",
  "Obtain cultures, then antibiotics",
  "Apply oxygen and reassess",
  "Document and continue to monitor",
];

describe("shuffleDeliveryChoices", () => {
  it("keeps the keyed choice correct after the options move", () => {
    let shuffled = shuffleDeliveryChoices({
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation: "Option B is correct because cultures come before antibiotics. Option D delays care.",
      clinicalReasoning: "Choice B matches the sepsis bundle.",
      distractorRationale: {
        A: "Fluids alone miss the source.",
        D: "Documentation is not the first action.",
      },
      seed: 1,
    });
    for (let seed = 2; seed < 40 && shuffled.options.indexOf(OPTIONS[1]!) === 1; seed++) {
      shuffled = shuffleDeliveryChoices({
        options: OPTIONS,
        correctAnswer: OPTIONS[1]!,
        explanation: "Option B is correct because cultures come before antibiotics. Option D delays care.",
        clinicalReasoning: "Choice B matches the sepsis bundle.",
        distractorRationale: {
          A: "Fluids alone miss the source.",
          D: "Documentation is not the first action.",
        },
        seed,
      });
    }

    expect(shuffled.shuffled).toBe(true);
    expect(shuffled.options).toHaveLength(4);
    expect(shuffled.correctAnswer).toBe(OPTIONS[1]);
    const index = shuffled.options.indexOf(OPTIONS[1]!);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).not.toBe(1);

    const letter = String.fromCharCode(65 + index);
    expect(shuffled.explanation).toContain(`Option ${letter}`);
    expect(shuffled.explanation).not.toMatch(/Option B is correct/);
    expect(shuffled.clinicalReasoning).toContain(`Choice ${letter}`);
    expect(Object.keys(shuffled.distractorRationale ?? {})).toHaveLength(2);

    const study = examQuestionToStudy(
      {
        id: 1,
        bankItemId: "sepsis",
        type: "multiple_choice",
        question: "Which action should the nurse take first?",
        options: shuffled.options,
        correctAnswer: shuffled.correctAnswer,
        explanation: shuffled.explanation ?? "",
      },
      0,
      { shuffleOptions: false }
    );
    expect(isAnswerCorrect(study, [OPTIONS[1]!])).toBe(true);
    expect(isAnswerCorrect(study, [OPTIONS[0]!])).toBe(false);
  });

  it("does not scramble choices that name other letters", () => {
    const options = ["Statement I only", "Statements I and III", "Statements II and III", "I, II, and III"];
    const shuffled = shuffleDeliveryChoices({
      options,
      correctAnswer: "Statements I and III",
      explanation: "Option B matches both true statements.",
      seed: 4,
    });
    expect(shuffled.shuffled).toBe(false);
    expect(shuffled.options).toEqual(options);
    expect(shuffled.explanation).toContain("Option B");
  });

  it("pins all-of-the-above and still moves the keyed choice", () => {
    const options = ["Check the INR", "Hold today's warfarin", "Give vitamin K now", "All of the above"];
    const shuffled = shuffleDeliveryChoices({
      options,
      correctAnswer: "Hold today's warfarin",
      explanation: "Option B is correct. Option D overtreats a mildly high INR.",
      seed: 99,
    });
    expect(shuffled.options[shuffled.options.length - 1]).toBe("All of the above");
    expect(shuffled.correctAnswer).toBe("Hold today's warfarin");
    const index = shuffled.options.indexOf("Hold today's warfarin");
    expect(shuffled.explanation).toContain(`Option ${String.fromCharCode(65 + index)}`);
  });

  it("is stable for the same item seed", () => {
    const first = shuffleDeliveryChoices({ options: OPTIONS, correctAnswer: OPTIONS[0]!, seed: 5 });
    const second = shuffleDeliveryChoices({ options: OPTIONS, correctAnswer: OPTIONS[0]!, seed: 5 });
    expect(second.options).toEqual(first.options);
  });
});
