import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { rewriteChoiceLetters, shuffleDeliveryChoices } from "@/lib/questions/shuffle-delivery";

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

describe("rewriteChoiceLetters", () => {
  const moved = new Map([
    ["A", "C"],
    ["B", "A"],
    ["C", "D"],
    ["D", "B"],
  ]);

  it("leaves drug names and articles alone and still moves real option labels", () => {
    const input = [
      "Option D-dimer level is incorrect because while it can help rule out DVT. Option D is the keyed finding.",
      "Option Rho(D) immune globulin is incorrect because it does not treat ectopic pregnancy.",
      "Students may think this option a dangerous choice.",
      "Maintain airway patency (A) and assess respiratory status. (A)lert is the first AVPU step.",
    ].join("\n");

    const rewritten = rewriteChoiceLetters(input, moved);

    expect(rewritten).toContain("Option D-dimer level is incorrect");
    expect(rewritten).toContain("Option B is the keyed finding.");
    expect(rewritten).not.toContain("B-dimer");
    expect(rewritten).toContain("Rho(D) immune globulin");
    expect(rewritten).not.toContain("Rho(B)");
    expect(rewritten).toContain("this option a dangerous choice");
    expect(rewritten).toContain("patency (A)");
    expect(rewritten).toContain("(A)lert");
  });

  it("rewrites line-start labels, bold bullets, option numbers, and ordinals", () => {
    const input = [
      "(A) Give fluids now",
      "**A. Defect in DNA repair mechanisms**",
      "**C. Deficiency of glucose-6-phosphate dehydrogenase**",
      "Scheduling surgery without stabilizing the patient (option 2) could lead to further complications.",
      "Option 2 suggests using the inhaler only as needed.",
      "The first option is incorrect because atorvastatin is generally effective.",
    ].join("\n");

    expect(rewriteChoiceLetters(input, moved)).toBe(
      [
        "(C) Give fluids now",
        "**C. Defect in DNA repair mechanisms**",
        "**D. Deficiency of glucose-6-phosphate dehydrogenase**",
        "Scheduling surgery without stabilizing the patient (option 1) could lead to further complications.",
        "Option 1 suggests using the inhaler only as needed.",
        "The third option is incorrect because atorvastatin is generally effective.",
      ].join("\n")
    );
  });
});

describe("shuffle locks when a reference cannot be rewritten", () => {
  it("keeps order when a rationale uses bare letters (B is incorrect; C is…)", () => {
    const explanation =
      "The other options do not accurately describe the findings: B is incorrect as the tracing is not normal; C is incorrect as the heart rate is not tachycardic; D does not relate to the fetal heart rate pattern.";
    const shuffled = shuffleDeliveryChoices({
      options: OPTIONS,
      correctAnswer: OPTIONS[0]!,
      explanation,
      seed: 3,
    });
    expect(shuffled.shuffled).toBe(false);
    expect(shuffled.options).toEqual(OPTIONS);
    expect(shuffled.explanation).toBe(explanation);
  });

  it("keeps order when the stem names an option by letter", () => {
    const question = "Under the state pharmacy practice act, which statement describes option B?";
    const explanation = "Option B matches the statute. Option A does not.";
    const shuffled = shuffleDeliveryChoices({
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      question,
      explanation,
      seed: 7,
    });
    expect(shuffled.shuffled).toBe(false);
    expect(shuffled.options).toEqual(OPTIONS);
    expect(shuffled.explanation).toBe(explanation);

    const study = examQuestionToStudy(
      {
        id: 9,
        bankItemId: "mpje-stem-letter",
        type: "multiple_choice",
        question,
        options: OPTIONS,
        correctAnswer: OPTIONS[1]!,
        explanation,
      },
      0,
      { shuffleSeed: 7 }
    );
    expect(study.options).toEqual(OPTIONS);
    expect(study.explanation).toBe(explanation);
  });

  it("keeps order when the stem itself lists lettered choices", () => {
    const question = [
      "A) New STEMI with chest pain",
      "B) Stable appendectomy POD1 teaching",
      "C) Chronic pain requesting PRN acetaminophen",
      "D) Discharge teaching on warfarin",
    ].join("\n");
    const shuffled = shuffleDeliveryChoices({
      options: [
        "New STEMI with chest pain",
        "Stable appendectomy POD1 teaching",
        "Chronic pain requesting PRN acetaminophen",
        "Discharge teaching on warfarin",
      ],
      correctAnswer: "New STEMI with chest pain",
      question,
      seed: 2,
    });
    expect(shuffled.shuffled).toBe(false);
    expect(shuffled.options[0]).toBe("New STEMI with chest pain");
  });

  it("still shuffles, and keeps drug names, when the rationale only uses safe labels", () => {
    const explanation =
      "Option D-dimer level is incorrect. Option Rho(D) immune globulin is not indicated. Students may think this option a dangerous choice. Maintain airway patency (A) and assess respiratory status. Option B is correct.";
    let shuffled = shuffleDeliveryChoices({
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      explanation,
      seed: 1,
    });
    for (let seed = 2; seed < 40 && shuffled.options.indexOf(OPTIONS[1]!) === 1; seed++) {
      shuffled = shuffleDeliveryChoices({
        options: OPTIONS,
        correctAnswer: OPTIONS[1]!,
        explanation,
        seed,
      });
    }
    expect(shuffled.shuffled).toBe(true);
    expect(shuffled.explanation).toContain("Option D-dimer level is incorrect");
    expect(shuffled.explanation).toContain("Rho(D) immune globulin");
    expect(shuffled.explanation).toContain("this option a dangerous choice");
    expect(shuffled.explanation).toContain("patency (A)");
    expect(shuffled.explanation).not.toMatch(/Option B is correct/);
  });
});
