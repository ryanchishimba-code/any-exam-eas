import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect, studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import { revealStudyAnswer } from "@/lib/questions/reveal-study-answer";
import { findPreSubmitAnswerLeaks } from "@/lib/questions/student-payload";
import { bowTieSelectionValid, parseBowTieLayout, toggleBowTieSelection } from "@/lib/questions/ngn-structures";
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
    const graded = [...keyed, "The keyed condition"];
    const study = examQuestionToStudy(bowtie(id, keyed), 0, { shuffleOptions: false });
    expect(study.correctAnswers).toEqual(graded);
    expect(isAnswerCorrect(study, graded)).toBe(true);
    expect(isAnswerCorrect(study, [...keyed])).toBe(false);

    const [api] = studyQuestionsToExamQuestions([study]);
    expect(api?.correctAnswer).toBe("");
    expect(findPreSubmitAnswerLeaks(api)).toEqual([]);
    expect(api?.ngnPayload).not.toHaveProperty("condition");
    const revealed = revealStudyAnswer(study, { options: api?.options, selected: graded });
    expect(revealed.correctAnswer.split("|||")).toEqual(graded);
    expect(revealed.correct).toBe(true);

    const again = examQuestionToStudy(
      {
        ...bowtie(id, keyed),
        correctAnswer: keyed.join(","),
      },
      0,
      { shuffleOptions: false }
    );
    expect(again.correctAnswers).toEqual(graded);
    expect(isAnswerCorrect(again, graded)).toBe(true);
  });

  it("credits a comma-free bow-tie the same way", () => {
    const keyed = ["Give fluids", "Raise the legs", "Urine output", "Blood pressure"];
    const study = examQuestionToStudy(bowtie("B04", keyed), 0, { shuffleOptions: false });
    expect(isAnswerCorrect(study, [...keyed, "The keyed condition"])).toBe(true);
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
    expect(isAnswerCorrect(first, [...keyed, "The keyed condition"])).toBe(true);
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
    expect(payload.questions[0]?.correctAnswer).toBe("");
    expect(findPreSubmitAnswerLeaks(payload.questions[0])).toEqual([]);
    expect(isAnswerCorrect(payload.prepared[0]!, [...keyed])).toBe(true);
    const revealed = revealStudyAnswer(payload.prepared[0]!, {
      selected: [...keyed],
      options: payload.questions[0]?.options,
    });
    expect(revealed.correct).toBe(true);
  });

  it("offers shuffled condition choices with nothing preselected and one condition at a time", () => {
    const keyed = [NALOXONE, "Stop the PCA infusion", "Respiratory rate and SpO2", "Level of sedation"];
    const study = examQuestionToStudy(bowtie("B01", keyed), 0, { shuffleOptions: false });
    const layout = parseBowTieLayout(study);
    expect(layout.conditionOptions).toEqual(["The keyed condition", "A different condition"]);
    expect(bowTieSelectionValid([...keyed], layout)).toBe(false);
    const withCondition = toggleBowTieSelection([...keyed], "The keyed condition", layout);
    expect(bowTieSelectionValid(withCondition, layout)).toBe(true);
    const replaced = toggleBowTieSelection(withCondition, "A different condition", layout);
    expect(replaced.filter((choice) => layout.conditionOptions.includes(choice))).toEqual([
      "A different condition",
    ]);
    expect(isAnswerCorrect(study, replaced)).toBe(false);
  });

  it("spreads keyed bow-tie actions and select-all choices across positions", () => {
    const actions = ["Key action A", "Key action B", "Decoy action 1", "Decoy action 2", "Decoy action 3"];
    const monitors = ["Monitor A", "Monitor B", "Monitor C"];
    const trials = 400;
    let adjacent = 0;
    let unchanged = 0;
    const indexHits = [0, 0, 0, 0, 0];
    for (let seed = 1; seed <= trials; seed += 1) {
      const row = examQuestionToStudy(
        {
          ...bowtie("B01", ["Key action A", "Key action B", "Monitor A", "Monitor B"]),
          options: [...actions, ...monitors],
          ngnPayload: {
            kind: "bow_tie",
            condition: "The keyed condition",
            conditionOptions: ["The keyed condition", "A different condition", "A third condition"],
            actions,
            monitors,
            actionPickCount: 2,
            monitorPickCount: 2,
          },
        },
        0,
        { shuffleOptions: true, shuffleSeed: seed }
      );
      const shown = parseBowTieLayout(row).actions;
      const first = shown.indexOf("Key action A");
      const second = shown.indexOf("Key action B");
      if (first >= 0) indexHits[first] += 1;
      if (second >= 0) indexHits[second] += 1;
      if (Math.abs(first - second) === 1) adjacent += 1;
      if (shown.join("|") === actions.join("|")) unchanged += 1;
    }
    const adjacency = adjacent / trials;
    expect(adjacency).toBeGreaterThan(0.15);
    expect(adjacency).toBeLessThan(0.65);
    expect(indexHits.every((count) => count > 0)).toBe(true);
    expect(unchanged).toBeLessThan(trials * 0.2);

    const choices = ["Correct 1", "Correct 2", "Correct 3", "Wrong 1", "Wrong 2", "Wrong 3"];
    let stuckAtFront = 0;
    for (let seed = 1; seed <= trials; seed += 1) {
      const study = examQuestionToStudy(
        {
          id: 9,
          type: "select_all",
          ngnFormat: "select_all",
          question: "Select all actions that apply to this client right now.",
          options: choices,
          correctAnswer: "Correct 1|||Correct 2|||Correct 3",
          explanation: "Three actions apply to this client.",
          bankItemId: "select-all-spread",
        },
        0,
        { shuffleOptions: true, shuffleSeed: seed }
      );
      const positions = ["Correct 1", "Correct 2", "Correct 3"]
        .map((choice) => study.options.indexOf(choice))
        .sort((left, right) => left - right);
      if (positions[0] === 0 && positions[1] === 1 && positions[2] === 2) stuckAtFront += 1;
    }
    expect(stuckAtFront / trials).toBeLessThan(0.15);
  });
});

describe("reviewQueueKind", () => {
  it("keeps a CAT miss list mixed when bow-ties and multiple choice are both present", () => {
    expect(reviewQueueKind(["ngn:B01:v1", "bank-q23"])).toBe("mixed");
    expect(reviewQueueKind(["ngn:B01:v1", "ngn:B02:v1"])).toBe("clinical");
    expect(reviewQueueKind(["bank-q23"])).toBe("bank");
  });
});
