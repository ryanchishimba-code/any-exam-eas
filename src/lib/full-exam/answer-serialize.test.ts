import { describe, expect, it } from "vitest";
import { deserializeExamSelection, serializeExamSelection } from "./answer-serialize";
import type { StudyQuestion } from "@/lib/questions/types";

function question(type: StudyQuestion["type"]): StudyQuestion {
  return { type, options: [], correctAnswers: [], stem: "", id: "q", sourceIndex: 0, explanation: "" } as StudyQuestion;
}

describe("matrix exam selections", () => {
  it("round-trips every row and column pair", () => {
    const selected = ["Fever|||Yes", "Cough|||No"];
    const stored = serializeExamSelection(question("matrix"), selected);
    expect(stored).toBe(JSON.stringify(selected));
    expect(deserializeExamSelection(stored)).toEqual(selected);
  });

  it("keeps a single matrix cell intact", () => {
    const stored = serializeExamSelection(question("matrix"), ["Fever|||Yes"]);
    expect(deserializeExamSelection(stored)).toEqual(["Fever|||Yes"]);
  });

  it("still splits select-all choices on |||", () => {
    const stored = serializeExamSelection(question("select_all"), ["Draw cultures", "Start oxygen"]);
    expect(stored).toBe("Draw cultures|||Start oxygen");
    expect(deserializeExamSelection(stored)).toEqual(["Draw cultures", "Start oxygen"]);
  });
});
