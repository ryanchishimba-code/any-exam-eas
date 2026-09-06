import { describe, expect, it } from "vitest";
import { usmlePresetPracticeHref, getUsmleStudyPreset } from "./study-presets";
import {
  questionBankCountOptions,
  questionBankWheelPresetsForField,
} from "@/lib/study/question-bank-setup";
import { questionBankHref } from "@/lib/edtech/practice-links-core";
import { buildSessionDomainBreakdown } from "@/lib/study/session-domain-breakdown";
import {
  fullExamModeTitle,
  getLengthOptions,
  usmleSelfAssessmentHref,
} from "@/lib/full-exam/config";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import type { StudyQuestion } from "@/lib/questions/types";

describe("USMLE exam-path phase", () => {
  it("defaults bank href to timed 40-Q block", () => {
    const href = questionBankHref("usmle", "usmle-step-2");
    expect(href).toContain("count=40");
    expect(href).toContain("pace=timed");
    expect(href).toContain("field=usmle-step-2");
  });

  it("uses 40/50/80 wheel for USMLE fields", () => {
    expect(questionBankWheelPresetsForField("usmle-step-1")).toEqual([40, 50, 80]);
    expect(questionBankCountOptions("usmle-step-2").map((o) => o.value)).toEqual([40, 50, 80]);
  });

  it("builds CCS drill deep link on question-bank with pace", () => {
    const preset = getUsmleStudyPreset("step3-ccs-drill")!;
    const href = usmlePresetPracticeHref("usmle", preset);
    expect(href.startsWith("/question-bank?")).toBe(true);
    expect(href).toContain("field=usmle-step-3");
    expect(href).toContain("pace=timed");
    expect(href).toContain("autostart=1");
  });

  it("builds organ-system session breakdown", () => {
    const questions = [
      {
        id: "1",
        sourceIndex: 0,
        type: "multiple_choice",
        stem: "q1",
        options: ["a"],
        correctAnswers: ["a"],
        explanation: "e",
        subjectId: "cardiology",
      },
      {
        id: "2",
        sourceIndex: 1,
        type: "multiple_choice",
        stem: "q2",
        options: ["a"],
        correctAnswers: ["a"],
        explanation: "e",
        subjectId: "pulmonology",
      },
    ] as StudyQuestion[];
    const rows = buildSessionDomainBreakdown(questions, [{ correct: true }, { correct: false }]);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows.some((r) => r.id === "cardiovascular" || r.label.length > 0)).toBe(true);
  });
});

describe("USMLE self-assessment form", () => {
  it("labels 100-Q as self-assessment and deep-links to timed form", () => {
    const opts = getLengthOptions("usmle", "usmle-step-2");
    const sa = opts.find((o) => o.preset === "100");
    expect(sa?.label).toMatch(/self-assessment/i);
    expect(sa?.questionCount).toBe(100);
    expect(fullExamModeTitle("usmle", "100", "usmle-step-2")).toBe("Step 2 CK Self-Assessment");

    const href = usmleSelfAssessmentHref({ fieldId: "usmle-step-2" });
    expect(href).toContain("/full-exam/usmle");
    expect(href).toContain("mode=100");
    expect(href).not.toContain("timed=0");
  });

  it("maps subject ids to organ-system labels in full-exam breakdown", () => {
    const rows = buildTopicBreakdown(
      [{ subjectId: "cardiology" }, { subjectId: "pulmonology" }],
      [
        { questionIndex: 0, correct: true, answeredAt: "2026-01-01T00:00:00.000Z" },
        { questionIndex: 1, correct: false, answeredAt: "2026-01-01T00:00:00.000Z" },
      ]
    );
    expect(rows.length).toBe(2);
    expect(rows.some((r) => /cardio|cv|resp|renal/i.test(r.topic))).toBe(true);
  });
});
