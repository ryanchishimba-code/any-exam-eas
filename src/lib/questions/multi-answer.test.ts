import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect, studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import { parseBowTieLayout } from "@/lib/questions/ngn-structures";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import type { BankItem } from "@/lib/question-bank";
import {
  joinStoredCorrectAnswer,
  reviewQueueKind,
  splitStoredCorrectAnswers,
} from "./multi-answer";

const NALOXONE = "Give naloxone IV per protocol, titrated to breathing";
const GCS = "GCS score by eye, verbal and motor components";
const AIRWAY = "Airway and breathing: stridor, wheeze, SpO2";
const HEPARIN = "Stop all heparin, including heparin flushes";
const IDEATION = "Suicidal ideation, plan and intent";

const CASES = [
  { id: "B01", keyed: [NALOXONE, "Stop the PCA infusion", "Respiratory rate and SpO2", "Level of sedation"] },
  { id: "B02", keyed: [GCS, "Notify the provider", "Neurologic checks", "Blood pressure"] },
  { id: "B03", keyed: [AIRWAY, "Give epinephrine", "Oxygen saturation", "Work of breathing"] },
  { id: "B05", keyed: [HEPARIN, "Apply pressure", "aPTT", "Bleeding at the site"] },
  { id: "B06", keyed: [IDEATION, "One-to-one observation", "Mood and affect", "Safety contract"] },
] as const;

function bowtie(id: string, keyed: readonly string[]) {
  const distractors = ["Unrelated action", "Another monitor"];
  const actions = [keyed[0]!, keyed[1]!, distractors[0]!];
  const monitors = [keyed[2]!, keyed[3]!, distractors[1]!];
  return {
    id: 1,
    type: "bow_tie" as const,
    ngnFormat: "bow_tie" as const,
    question: `Bow-tie ${id}. Which actions and parameters?`,
    options: [...actions, ...monitors],
    correctAnswer: joinStoredCorrectAnswer("bow_tie", [...keyed]),
    explanation: "The keyed choices match the chart for this bow-tie item in the bank.",
    ngnPayload: {
      kind: "bow_tie",
      condition: "The keyed condition",
      conditionOptions: ["The keyed condition", "A different condition"],
      actions,
      monitors,
      actionPickCount: 2,
      monitorPickCount: 2,
    },
    bankItemId: `ngn:${id}:v1`,
  };
}

describe("bow-tie comma keys", () => {
  it.each(CASES)("keeps the comma inside $id when the payload is joined and parsed again", ({ id, keyed }) => {
    const study = examQuestionToStudy(bowtie(id, keyed), 0, { shuffleOptions: false });
    expect(study.correctAnswers).toEqual([...keyed]);
    expect(isAnswerCorrect(study, [...keyed])).toBe(true);

    const [api] = studyQuestionsToExamQuestions([study]);
    expect(api?.correctAnswer?.includes("|||")).toBe(true);
    expect(api?.correctAnswer?.split("|||")).toEqual([...keyed]);

    const again = examQuestionToStudy(
      {
        ...bowtie(id, keyed),
        correctAnswer: keyed.join(","),
      },
      0,
      { shuffleOptions: false }
    );
    expect(again.correctAnswers).toEqual([...keyed]);
    expect(isAnswerCorrect(again, [...keyed])).toBe(true);
  });

  it("credits a comma-free bow-tie the same way", () => {
    const keyed = ["Give fluids", "Raise the legs", "Urine output", "Blood pressure"];
    const study = examQuestionToStudy(bowtie("B04", keyed), 0, { shuffleOptions: false });
    expect(isAnswerCorrect(study, [...keyed])).toBe(true);
    expect(splitStoredCorrectAnswers(keyed.join(","), study.options)).toEqual(keyed);
  });

  it("shuffles action and condition banks without dropping the key", () => {
    const keyed = [NALOXONE, "Stop the PCA infusion", "Respiratory rate and SpO2", "Level of sedation"];
    const storedActions = [NALOXONE, "Stop the PCA infusion", "Unrelated action"];
    const withChart = {
      ...bowtie("B01", keyed),
      chartData: {
        kind: "bow_tie",
        condition: "The keyed condition",
        conditionOptions: ["The keyed condition", "A different condition"],
        actions: storedActions,
        monitors: [keyed[2], keyed[3], "Another monitor"],
        actionPickCount: 2,
        monitorPickCount: 2,
      },
    };
    const first = examQuestionToStudy(withChart, 0, { shuffleOptions: true, shuffleSeed: 3 });
    const second = examQuestionToStudy(withChart, 0, { shuffleOptions: true, shuffleSeed: 3 });
    const shown = parseBowTieLayout(first).actions;
    expect(shown).toEqual(parseBowTieLayout(second).actions);
    expect(shown).toEqual(first.chartData?.actions);
    expect(new Set(shown)).toEqual(new Set(storedActions));
    expect(isAnswerCorrect(first, [...keyed])).toBe(true);
    const original = storedActions.join("|");
    const moved = [3, 9, 21, 44, 99].some((seed) => {
      const row = examQuestionToStudy(withChart, 0, { shuffleOptions: true, shuffleSeed: seed });
      return parseBowTieLayout(row).actions.join("|") !== original;
    });
    expect(moved).toBe(true);

    const seed = [3, 9, 21, 44, 99].find((candidate) => {
      const row = examQuestionToStudy(withChart, 0, { shuffleOptions: true, shuffleSeed: candidate });
      return parseBowTieLayout(row).actions.join("|") !== original;
    })!;
    const server = examQuestionToStudy(withChart, 0, { shuffleOptions: true, shuffleSeed: seed });
    const [api] = studyQuestionsToExamQuestions([server]);
    const client = examQuestionToStudy(
      { ...api, id: 1, bankItemId: "ngn:B01:v1" },
      0,
      { shuffleOptions: false }
    );
    expect(parseBowTieLayout(client).actions).toEqual(parseBowTieLayout(server).actions);
    expect(parseBowTieLayout(client).actions.join("|")).not.toBe(original);
  });

  it("round-trips a comma key through the timed exam client payload", () => {
    const keyed = [NALOXONE, "Stop the PCA infusion", "Respiratory rate and SpO2", "Level of sedation"];
    const item: BankItem = {
      id: "ngn:B01:v1",
      question: "Bow-tie B01. Which actions and parameters?",
      options: [NALOXONE, "Stop the PCA infusion", "Unrelated action", "Respiratory rate and SpO2", "Level of sedation", "Another monitor"],
      correctAnswer: keyed.join("|||"),
      explanation: "The keyed choices match the chart for this bow-tie item in the bank.",
      itemType: "ngn_bowtie",
      subjectId: "physiological-adaptation",
      ngnPayload: {
        kind: "bow_tie",
        condition: "Opioid-induced respiratory depression",
        actions: [NALOXONE, "Stop the PCA infusion", "Unrelated action"],
        monitors: ["Respiratory rate and SpO2", "Level of sedation", "Another monitor"],
        actionPickCount: 2,
        monitorPickCount: 2,
      },
      qaPassed: true,
      active: true,
    };
    const payload = preparedTimedExamItemsForClient("nursing", "nursing", [item], 1, { shuffleSeed: 4 });
    expect(payload.questions[0]?.correctAnswer?.split("|||")).toEqual(keyed);
    expect(isAnswerCorrect(payload.prepared[0]!, [...keyed])).toBe(true);
  });
});

describe("reviewQueueKind", () => {
  it("keeps a CAT miss list mixed when bow-ties and multiple choice are both present", () => {
    expect(reviewQueueKind(["ngn:B01:v1", "bank-q23"])).toBe("mixed");
    expect(reviewQueueKind(["ngn:B01:v1", "ngn:B02:v1"])).toBe("clinical");
    expect(reviewQueueKind(["bank-q23"])).toBe("bank");
  });
});
