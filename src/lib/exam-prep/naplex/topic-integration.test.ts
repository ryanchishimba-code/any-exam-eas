import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { highYieldTopicPracticeHref } from "@/lib/edtech/practice-links";
import {
  assessNaplexCalcTopicItem,
  isNaplexCalculationItem,
  matchesNaplexCalcSubtopic,
} from "./calc-topic-qa";
import { matchesNaplexBlueprintTopic } from "./topic-blueprint-match";
import {
  filterItemsForNaplexTopicPractice,
  matchesNaplexTopicPracticeItem,
  passesNaplexCalcTopicQa,
} from "./topic-practice-filter";
import { resolveNaplexTopicPracticeParams } from "./topic-practice";
import { auditNaplexTopicIntegration, runNaplexTopicQaGate } from "./topic-qa-gate";

describe("NAPLEX calc topic QA", () => {
  const dripItem: BankItem = {
    subjectId: "compounding-calculations",
    itemType: "constructed_response",
    vignette:
      "A 70 kg patient receives dopamine 5 mcg/kg/min. The bag contains 400 mg in 250 mL D5W (1.6 mg/mL).",
    question: "At what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.",
    options: [],
    correctAnswer: "21",
    explanation: "Convert mcg/kg/min to mL/hr using concentration.",
    tags: ["calculation"],
  };

  const crclItem: BankItem = {
    subjectId: "compounding-calculations",
    itemType: "constructed_response",
    vignette: "A 68-year-old woman weighs 60 kg. Serum creatinine is 1.8 mg/dL.",
    question: "Calculate creatinine clearance using Cockcroft-Gault. Round to the nearest whole number.",
    options: [],
    correctAnswer: "28",
    explanation: "Apply CG with 0.85 female factor.",
    tags: ["case-calculation"],
  };

  const mcqItem: BankItem = {
    subjectId: "pharmacology",
    vignette: "A patient with heart failure on lisinopril reports dizziness.",
    question: "Which monitoring parameter is most appropriate?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Monitor BP and renal function with ACE inhibitors.",
  };

  it("detects calculation items", () => {
    expect(isNaplexCalculationItem(dripItem)).toBe(true);
    expect(isNaplexCalculationItem(mcqItem)).toBe(false);
  });

  it("matches drip-rate subtopic", () => {
    expect(matchesNaplexCalcSubtopic(dripItem, "calculations-drip-rates")).toBe(true);
    expect(matchesNaplexCalcSubtopic(dripItem, "calculations-creatinine-clearance")).toBe(false);
  });

  it("matches CrCl subtopic", () => {
    expect(matchesNaplexCalcSubtopic(crclItem, "calculations-creatinine-clearance")).toBe(true);
    expect(matchesNaplexCalcSubtopic(crclItem, "calculations-drip-rates")).toBe(false);
  });

  it("assesses solvable calc items", () => {
    const dripQa = assessNaplexCalcTopicItem(dripItem, "calculations-drip-rates");
    expect(dripQa.subtopicMatch).toBe(true);
    expect(dripQa.solvable).toBe(true);
  });
});

describe("NAPLEX blueprint content matching", () => {
  const hfItem: BankItem = {
    subjectId: "cardiovascular-rx",
    vignette: "A patient with HFrEF is not on GDMT. EF 30%, on lisinopril only.",
    question: "Which medication should be added next per GDMT?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Add beta-blocker and MRA per GDMT.",
  };

  it("matches heart failure GDMT blueprint by content", () => {
    expect(matchesNaplexBlueprintTopic(hfItem, "heart failure GDMT")).toBe(true);
    expect(matchesNaplexBlueprintTopic(hfItem, "calculations")).toBe(false);
  });
});

describe("NAPLEX topic practice alignment", () => {
  it("calculations-workshop pulls compounding-calculations with calculations blueprint", () => {
    const topic = getHighYieldTopic("naplex", "calculations-workshop")!;
    const params = resolveNaplexTopicPracticeParams(topic);
    expect(params.subjectId).toBe("compounding-calculations");
    expect(params.blueprintTopics).toContain("calculations");
    expect(params.topicSlug).toBe("calculations-workshop");
  });

  it("renal CKD routes to pharmacology not compounding-calculations", () => {
    const topic = getHighYieldTopic("naplex", "renal-ckd-pharmacotherapy")!;
    const params = resolveNaplexTopicPracticeParams(topic);
    expect(params.subjectId).toBe("pharmacology");
    expect(params.blueprintTopics).toContain("renal dose adjustment");
  });

  it("highYieldTopicPracticeHref encodes blueprintTopics for drip rates", () => {
    const topic = getHighYieldTopic("naplex", "calculations-drip-rates")!;
    const href = highYieldTopicPracticeHref("naplex", topic, 10);
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("subjectId")).toBe("compounding-calculations");
    expect(url.searchParams.get("blueprintTopics")).toContain("calculations");
    expect(url.searchParams.get("naplexTopic")).toBe("calculations-drip-rates");
  });

  it("filterItemsForNaplexTopicPractice excludes non-calc MCQs from calc workshop", () => {
    const calcItem: BankItem = {
      subjectId: "compounding-calculations",
      itemType: "constructed_response",
      vignette: "Order: amoxicillin 500 mg PO every 8 hours for 10 days. Supply 500 mg capsules.",
      question: "How many capsules should be dispensed?",
      options: [],
      correctAnswer: "30",
      explanation: "3 caps/day × 10 days.",
      tags: ["calculation"],
    };
    const filtered = filterItemsForNaplexTopicPractice([calcItem, mcqFromAbove()], {
      blueprintTopics: ["calculations"],
      topicSlug: "calculations-workshop",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.question).toContain("capsules");
  });
});

function mcqFromAbove(): BankItem {
  return {
    subjectId: "pharmacology",
    vignette: "A patient with heart failure on lisinopril reports dizziness.",
    question: "Which monitoring parameter is most appropriate?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Monitor BP and renal function with ACE inhibitors.",
  };
}

describe("NAPLEX topic integration QA gate", () => {
  it("passes the consolidated static audit", () => {
    const { passed, issues } = runNaplexTopicQaGate();
    if (!passed) {
      const summary = issues.map((i) => `[${i.code}] ${i.message}`).join("\n");
      expect.fail(`NAPLEX topic QA failed:\n${summary}`);
    }
    expect(passed).toBe(true);
  });

  it("auditNaplexTopicIntegration returns no issues", () => {
    expect(auditNaplexTopicIntegration()).toEqual([]);
  });
});

describe("passesNaplexCalcTopicQa", () => {
  it("returns true for aligned solvable drip calc", () => {
    const item: BankItem = {
      subjectId: "compounding-calculations",
      itemType: "constructed_response",
      vignette: "70 kg patient. Order: dopamine 5 mcg/kg/min. Bag: 400 mg in 250 mL (1.6 mg/mL).",
      question: "At what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.",
      options: [],
      correctAnswer: "21",
      explanation: "Standard infusion rate calculation.",
      tags: ["calculation"],
    };
    expect(
      matchesNaplexTopicPracticeItem(item, {
        blueprintTopics: ["calculations", "IV rates"],
        topicSlug: "calculations-drip-rates",
      })
    ).toBe(true);
    expect(passesNaplexCalcTopicQa(item, "calculations-drip-rates")).toBe(true);
  });
});
