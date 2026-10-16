import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import {
  getQuickBiteQuiz,
  gradeQuickBiteAnswer,
  publicQuickBiteQuiz,
} from "@/lib/quick-bites/quiz-data";
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
    expect(QUICK_BITE_EPISODES).toHaveLength(16);
    for (const episode of QUICK_BITE_EPISODES) {
      const quiz = getQuickBiteQuiz(episode.slug);
      expect(quiz?.questions).toHaveLength(10);
      const published = JSON.stringify(publicQuickBiteQuiz(quiz!));
      expect(published).not.toContain("explanation");
      expect(published).not.toContain('"keys"');
      for (const question of quiz!.questions) {
        expect(question.stem.length).toBeGreaterThan(0);
        expect(["single", "sata"]).toContain(question.type);
      }
    }
    const first = getQuickBiteQuiz("quick-bites-ep02-nclex-works")!.questions[0]!;
    expect(publicQuickBiteQuiz(getQuickBiteQuiz("quick-bites-ep02-nclex-works")!).questions[0]).toMatchObject({
      id: first.id,
      type: "single",
      videoTimestamp: "1:09",
    });
    expect(JSON.stringify(publicQuickBiteQuiz(getQuickBiteQuiz("quick-bites-ep02-nclex-works")!))).not.toContain(
      "the computer was confident"
    );
  });

  it("scores an exact set match and rejects a partial select-all answer", () => {
    const quiz = getQuickBiteQuiz("quick-bites-ep02-nclex-works")!;
    const single = quiz.questions[0]!;
    const sata = quiz.questions.find((question) => question.type === "sata")!;

    expect(gradeQuickBiteAnswer(single, ["C"])).toMatchObject({ correct: true });
    expect(gradeQuickBiteAnswer(single, ["A"])).toMatchObject({ correct: false });
    expect(gradeQuickBiteAnswer(single, ["C", "A"])).toBeNull();
    expect(gradeQuickBiteAnswer(single, [])).toBeNull();
    expect(gradeQuickBiteAnswer(sata, sata.keys)).toMatchObject({ correct: true });
    expect(gradeQuickBiteAnswer(sata, sata.keys.slice(0, 1))).toMatchObject({ correct: false });
    expect(gradeQuickBiteAnswer(sata, [...sata.keys, "Z"])).toBeNull();
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
