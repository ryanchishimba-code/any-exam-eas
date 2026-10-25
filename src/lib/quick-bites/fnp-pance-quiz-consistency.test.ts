import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FNP_QUICK_BITE_EPISODES } from "@/lib/quick-bites/fnp-catalog";
import { getFnpQuickBiteQuiz } from "@/lib/quick-bites/fnp-quiz-data";
import { getPanceQuickBiteQuiz } from "@/lib/quick-bites/pance-quiz-data";
import { PANCE_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pance-catalog";
import { gradeQuickBiteAnswer } from "@/lib/quick-bites/quiz-data";

type RawQuiz = {
  questions: {
    id: string;
    type: string;
    stem: string;
    options: { id: string; text: string }[];
    keys: string[];
    explanation: string;
  }[];
};

function readRawQuizzes(dir: string): RawQuiz[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(path.join(dir, name), "utf8")) as RawQuiz);
}

describe("FNP and PANCE Quick Bites quiz consistency", () => {
  it("ships 10 questions per episode with gradable keys", () => {
    for (const episode of FNP_QUICK_BITE_EPISODES) {
      const quiz = getFnpQuickBiteQuiz(episode.slug);
      expect(quiz?.questions).toHaveLength(10);
      for (const question of quiz!.questions) {
        expect(gradeQuickBiteAnswer(question, question.keys)).toMatchObject({ correct: true });
        const wrong = question.options.find((option) => !question.keys.includes(option.id))!.id;
        expect(gradeQuickBiteAnswer(question, [wrong])).toMatchObject({ correct: false });
      }
    }
    for (const episode of PANCE_QUICK_BITE_EPISODES) {
      const quiz = getPanceQuickBiteQuiz(episode.slug);
      expect(quiz?.questions).toHaveLength(10);
      for (const question of quiz!.questions) {
        expect(gradeQuickBiteAnswer(question, question.keys)).toMatchObject({ correct: true });
      }
    }
  });

  it("does not shuffle USPSTF grade letters in served explanations", () => {
    const quiz = getFnpQuickBiteQuiz("quick-bites-fnp-ep01-screening")!;
    const served = quiz.questions.find((question) => question.id === "ep01-screening-q01")!;
    expect(served.explanation).toMatch(/Grades A and B mean offer or provide/i);
    expect(served.explanation).toMatch(/Grade C means offer selectively/i);
    expect(served.explanation).not.toMatch(/Grades C and D mean offer/i);
  });

  it("keeps USPSTF grade explanations aligned with keyed answers", () => {
    const raw = readRawQuizzes(path.join(process.cwd(), "src/lib/quick-bites/quizzes-fnp"));
    const screening = raw.find((file) =>
      file.questions.some((question) => question.id === "ep01-screening-q01")
    );
    const q1 = screening?.questions.find((question) => question.id === "ep01-screening-q01");
    expect(q1?.keys).toEqual(["A"]);
    expect(q1?.explanation).toMatch(/Grades A and B mean offer or provide/i);
    expect(q1?.explanation).toMatch(/Grade C means offer selectively/i);
    expect(q1?.explanation).not.toMatch(/\bC and D mean offer/i);
  });

  it("does not label a wrong option as the keyed answer in explanations", () => {
    const dirs = [
      path.join(process.cwd(), "src/lib/quick-bites/quizzes-fnp"),
      path.join(process.cwd(), "src/lib/quick-bites/quizzes-pance"),
    ];
    const violations: string[] = [];
    for (const dir of dirs) {
      for (const quiz of readRawQuizzes(dir)) {
        for (const question of quiz.questions) {
          if (question.type !== "single_best_answer") continue;
          const explanation = question.explanation.toLowerCase();
          for (const option of question.options) {
            if (question.keys.includes(option.id)) continue;
            const text = option.text.toLowerCase();
            if (text.length < 8) continue;
            if (explanation.includes(`answer is ${option.id.toLowerCase()}`)) {
              violations.push(`${question.id}: cites wrong letter ${option.id}`);
            }
            if (explanation.includes(`choose ${option.id.toLowerCase()}`)) {
              violations.push(`${question.id}: choose wrong ${option.id}`);
            }
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
