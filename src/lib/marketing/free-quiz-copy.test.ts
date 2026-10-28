import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { BOARD_LANDING_HERO_QUIZ_LABEL } from "@/lib/marketing/board-landing/board-hero-marketing";

describe("public free quiz copy", () => {
  it("does not advertise a fixed question count in user-facing strings", () => {
    expect(BOARD_LANDING_HERO_QUIZ_LABEL).toBe("Try the free quiz");
    expect(BOARD_LANDING_HERO_QUIZ_LABEL).not.toMatch(/\b10\b/);

    const boardSection = readFileSync(
      path.join(process.cwd(), "src/components/marketing/free-quiz/BoardFreeQuizSection.tsx"),
      "utf8"
    );
    expect(boardSection).toContain(">Free quiz</h2>");
    expect(boardSection).not.toMatch(/10-question quiz/i);

    const homeSection = readFileSync(
      path.join(process.cwd(), "src/components/marketing/free-quiz/HomeFreeQuizSection.tsx"),
      "utf8"
    );
    expect(homeSection).toContain("Try a free quiz");
    expect(homeSection).not.toMatch(/ten live sample/i);
    expect(homeSection).not.toMatch(/10-question quiz/i);
  });
});
