import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import {
  getQuickBiteQuiz,
  gradeQuickBiteAnswer,
  mapQuickBiteAnswerType,
  publicQuickBiteQuiz,
  remapExplanationOptionLetters,
} from "@/lib/quick-bites/quiz-data";
import { getFnpQuickBiteQuiz } from "@/lib/quick-bites/fnp-quiz-data";
import { parseVideoTimestamp } from "@/lib/quick-bites/timestamp";

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

describe("Video Quick Bites quizzes", () => {
  it("has a 10-question quiz for every episode and keeps answers off the public copy", () => {
    expect(QUICK_BITE_EPISODES).toHaveLength(25);
    for (const episode of QUICK_BITE_EPISODES) {
      const quiz = getQuickBiteQuiz(episode.slug);
      expect(quiz?.questions).toHaveLength(10);
      const published = JSON.stringify(publicQuickBiteQuiz(quiz!));
      expect(published).not.toContain("explanation");
      expect(published).not.toContain('"keys"');
      for (const question of quiz!.questions) {
        expect(question.stem.length).toBeGreaterThan(0);
        expect(["single-answer", "sata"]).toContain(question.type);
      }
    }
    const first = getQuickBiteQuiz("quick-bites-ep02-nclex-works")!.questions[0]!;
    expect(publicQuickBiteQuiz(getQuickBiteQuiz("quick-bites-ep02-nclex-works")!).questions[0]).toMatchObject({
      id: first.id,
      type: "single-answer",
      videoTimestamp: "1:09",
    });
    expect(JSON.stringify(publicQuickBiteQuiz(getQuickBiteQuiz("quick-bites-ep02-nclex-works")!))).not.toContain(
      "the computer was confident"
    );
  });

  it("keeps the acute kidney injury keys and states the 1.5-times rule as or more", () => {
    const raw = JSON.parse(
      readFileSync(path.join(process.cwd(), "src/lib/quick-bites/quizzes/ep19-kidneys-dialysis.json"), "utf8")
    ) as {
      questions: { id: string; keys: string[]; options: { id: string; text: string }[] }[];
    };
    const question = raw.questions.find((item) => item.id === "ep19-kidneys-dialysis-q04");
    expect(question?.keys).toEqual(["A", "B", "C"]);
    expect(question?.options.find((option) => option.id === "B")?.text).toBe(
      "Creatinine rising to 1.5 times baseline or more within 7 days"
    );
  });

  it("scores an exact set match and rejects a partial select-all answer", () => {
    const quiz = getQuickBiteQuiz("quick-bites-ep02-nclex-works")!;
    const single = quiz.questions[0]!;
    const sata = quiz.questions.find((question) => question.type === "sata")!;
    const wrong = single.options.find((option) => !single.keys.includes(option.id))!.id;

    expect(gradeQuickBiteAnswer(single, single.keys)).toMatchObject({ correct: true });
    expect(gradeQuickBiteAnswer(single, [wrong])).toMatchObject({ correct: false });
    expect(gradeQuickBiteAnswer(single, [single.keys[0]!, wrong])).toBeNull();
    expect(gradeQuickBiteAnswer(single, [])).toBeNull();
    expect(gradeQuickBiteAnswer(sata, sata.keys)).toMatchObject({ correct: true });
    expect(gradeQuickBiteAnswer(sata, sata.keys.slice(0, 1))).toMatchObject({ correct: false });
    expect(gradeQuickBiteAnswer(sata, [...sata.keys, "Z"])).toBeNull();
  });

  it("maps file types and keeps shuffled keys on the same option text", () => {
    expect(mapQuickBiteAnswerType("single_best_answer")).toBe("single-answer");
    expect(mapQuickBiteAnswerType("select_all_that_apply")).toBe("sata");
    expect(mapQuickBiteAnswerType("single")).toBeNull();

    const dir = path.join(process.cwd(), "src/lib/quick-bites/quizzes");
    const singleKeys: string[] = [];
    const sataStillPrefixed: boolean[] = [];
    for (const name of readdirSync(dir).filter((entry) => entry.endsWith(".json"))) {
      const raw = JSON.parse(readFileSync(path.join(dir, name), "utf8")) as {
        episode: string;
        questions: Array<{
          id: string;
          type: string;
          options: { id: string; text: string }[];
          keys: string[];
          explanation: string;
        }>;
      };
      const quiz = getQuickBiteQuiz(`quick-bites-${raw.episode}`);
      expect(quiz?.questions).toHaveLength(raw.questions.length);
      for (const original of raw.questions) {
        const served = quiz!.questions.find((question) => question.id === original.id)!;
        const originalText = original.keys
          .map((key) => original.options.find((option) => option.id === key)!.text)
          .sort();
        const servedText = served.keys
          .map((key) => served.options.find((option) => option.id === key)!.text)
          .sort();
        expect(servedText).toEqual(originalText);
        expect(served.type).toBe(mapQuickBiteAnswerType(original.type));
        if (served.type === "single-answer") {
          singleKeys.push(served.keys[0]!);
          const lead = served.explanation.match(/^([A-Z]) is correct/);
          if (lead) expect(lead[1]).toBe(served.keys[0]);
        } else {
          const prefix = served.options
            .slice(0, served.keys.length)
            .map((option) => option.id)
            .sort()
            .join("");
          sataStillPrefixed.push(prefix === [...served.keys].sort().join(""));
        }
      }
    }

    expect(new Set(singleKeys)).toEqual(new Set(["A", "B", "C", "D"]));
    expect(sataStillPrefixed.some((prefixed) => !prefixed)).toBe(true);
    expect(readFileSync(path.join(process.cwd(), "src/lib/quick-bites/quiz-data.ts"), "utf8")).not.toMatch(
      /quizzes\/.+\.json/
    );
  });

  it("remaps answer citations but not USPSTF grade letters in FNP explanations", () => {
    const remapped = remapExplanationOptionLetters(
      "B is correct: example. A and C are wrong.",
      new Set(["A", "B", "C", "D"]),
      new Map([
        ["A", "D"],
        ["B", "A"],
        ["C", "B"],
        ["D", "C"],
      ])
    );
    expect(remapped).toBe("A is correct: example. D and B are wrong.");

    const quiz = getFnpQuickBiteQuiz("quick-bites-fnp-ep01-screening")!;
    const q1 = quiz.questions.find((question) => question.id === "ep01-screening-q01")!;
    expect(q1.explanation).toContain("Grades A and B mean offer or provide");
    expect(q1.explanation).not.toMatch(/Grades C and D mean offer/i);
  });

  it("parses m:ss timestamps", () => {
    expect(parseVideoTimestamp("1:09")).toBe(69);
    expect(parseVideoTimestamp("0:09")).toBe(9);
    expect(parseVideoTimestamp("10:00")).toBe(600);
    expect(parseVideoTimestamp("1:60")).toBeNull();
    expect(parseVideoTimestamp("90")).toBeNull();
  });

  it("does not import quiz content into client modules", () => {
    const files = walk(path.join(process.cwd(), "src")).filter(
      (file) => file.endsWith(".ts") || file.endsWith(".tsx")
    );
    const clients = files.filter((file) =>
      /^["']use client["'];/m.test(readFileSync(file, "utf8"))
    );
    expect(clients.length).toBeGreaterThan(0);
    for (const file of clients) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toContain("quiz-data");
      expect(source).not.toContain("quick-bites/quizzes");
      expect(source).not.toContain("the computer was confident");
      expect(source).not.toContain("ep02-nclex-works-q01");
    }
  });
});
