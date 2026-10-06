import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import { selectSittingItems } from "@/lib/exam-prep/sitting-selection";
import {
  countConsecutiveTopicRun,
  narrowTopicKey,
  narrowTopicShareCap,
  orderWithTopicGap,
} from "@/lib/exam-prep/narrow-topic";

function item(
  id: string,
  question: string,
  correct: string,
  scenario: string,
  extra: Partial<BankItem> = {}
): BankItem {
  return {
    id,
    question,
    options: [correct, "Reassure and recheck tomorrow", "Document and continue", "Discharge home"],
    correctAnswer: correct,
    explanation: "Because this is the keyed choice.",
    scenario,
    clusterId: `unique-${id}`,
    ...extra,
  };
}

describe("template groups", () => {
  it("keeps one warfarin INR follow-up when only the age changes", () => {
    const pool = [
      item(
        "w65",
        "Which finding requires immediate follow-up?",
        "INR of 4.5",
        "A 65-year-old takes warfarin. The INR is the finding to act on."
      ),
      item(
        "w72",
        "Which finding requires immediate follow-up?",
        "INR of 4.5",
        "A 72-year-old takes warfarin. The INR is the finding to act on."
      ),
      item(
        "other",
        "Which counseling point is best?",
        "Take with food",
        "A patient starts a new antibiotic and asks when to take it."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).toBe(clusters[1]);
    expect(clusters[2]).not.toBe(clusters[0]);
    const selected = selectSittingItems({ pool, limit: 3, seed: 1, relax: false });
    expect(selected.items.filter((row) => row.id === "w65" || row.id === "w72")).toHaveLength(1);
  });

  it("groups reworded atorvastatin myalgia cases", () => {
    const pool = [
      item(
        "s1",
        "Which finding requires immediate follow-up?",
        "Muscle pain",
        "A patient on atorvastatin reports new muscle pain."
      ),
      item(
        "s2",
        "Which symptom should the pharmacist address first?",
        "Myalgia",
        "Atorvastatin was started last month and the patient now has muscle aches."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).toBe(clusters[1]);
  });

  it("keeps distinct keyed numbers in separate groups", () => {
    const pool = [
      item(
        "n1",
        "Which monitoring step is required before agent 1 in case 3?",
        "Check level 1",
        "Unique history 1 with finding 17 and drug 13."
      ),
      item(
        "n2",
        "Which monitoring step is required before agent 2 in case 6?",
        "Check level 2",
        "Unique history 2 with finding 34 and drug 26."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).not.toBe(clusters[1]);
  });

  it("does not merge different follow-up concepts", () => {
    const pool = [
      item(
        "inr",
        "Which finding requires immediate follow-up?",
        "INR of 4.5",
        "A patient takes warfarin."
      ),
      item(
        "k",
        "Which lab value requires immediate follow-up?",
        "Potassium 3.0",
        "A patient receives insulin and has a potassium of 3.0."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).not.toBe(clusters[1]);
  });

  it("groups breastfeeding low-supply copies and GTT teaching copies", () => {
    const pool = [
      item(
        "bf1",
        "Which statement needs further teaching?",
        "Supplement every feed",
        "A parent who is breastfeeding reports a low milk supply."
      ),
      item(
        "bf2",
        "Which statement needs further teaching?",
        "Supplement every feed",
        "The client is breastfeeding and worries about low supply."
      ),
      item(
        "gtt1",
        "Which statement indicates a need for further teaching?",
        "Skip breakfast before the test",
        "A client at 28 weeks is scheduled for a glucose tolerance test."
      ),
      item(
        "gtt2",
        "Which statement indicates a need for further teaching?",
        "Skip breakfast before the test",
        "At 28 weeks the glucose tolerance test requires a fasting glucose."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    expect(clusters[0]).toBe(clusters[1]);
    expect(clusters[2]).toBe(clusters[3]);
    expect(clusters[0]).not.toBe(clusters[2]);
  });

  it("groups the same vignette asked two ways and keeps unrelated cases apart", () => {
    const atorva = (id: string, question: string) =>
      item(
        id,
        question,
        "High-intensity statin",
        "A 54-year-old takes atorvastatin 40 mg daily. LDL is 160 mg/dL. The rest of the panel is at goal."
      );
    const hygiene = (id: string, question: string) =>
      item(
        id,
        question,
        "Soap and water",
        "The client has C. diff colitis. Hand hygiene with soap and water is required after care."
      );
    const pancreas = (id: string, question: string) =>
      item(
        id,
        question,
        "Bowel rest",
        "Pancreatitis after an alcohol binge. The client has severe epigastric pain."
      );
    const fatigue = (id: string, question: string) =>
      item(
        id,
        question,
        "Draw a TSH",
        "The client reports fatigue and lost 10 lb over six weeks without trying."
      );
    const pool = [
      atorva("a1", "What is the most appropriate change?"),
      atorva("a2", "Which intensity of therapy is indicated?"),
      hygiene("h1", "Which hand hygiene is required?"),
      hygiene("h2", "What should the nurse use to clean hands?"),
      hygiene("h3", "Which infection-control action is correct?"),
      pancreas("p1", "What is the priority treatment?"),
      pancreas("p2", "Which diet order is expected?"),
      fatigue("f1", "Which test is the priority?"),
      fatigue("f2", "What is the best next assessment?"),
      item(
        "asthma-1",
        "What is the priority nursing action?",
        "Coach pursed-lip breathing",
        "Asthma with wheezing. The client uses an albuterol inhaler at home."
      ),
      item(
        "asthma-2",
        "Which teaching point is correct?",
        "Use a spacer",
        "The client has asthma and uses albuterol before exercise."
      ),
    ];
    const clusters = assignSittingClusters(pool);
    const idAt = (id: string) => clusters[pool.findIndex((row) => row.id === id)];
    expect(idAt("a1")).toBe(idAt("a2"));
    expect(idAt("h1")).toBe(idAt("h2"));
    expect(idAt("h2")).toBe(idAt("h3"));
    expect(idAt("p1")).toBe(idAt("p2"));
    expect(idAt("f1")).toBe(idAt("f2"));
    expect(idAt("a1")).not.toBe(idAt("h1"));
    expect(idAt("asthma-1")).not.toBe(idAt("asthma-2"));
    expect(idAt("p1")).not.toBe(idAt("f1"));
  });
});

describe("narrow topic spread", () => {
  it("breaks a run of three depression items and caps the share", () => {
    const made = (id: string, text: string) =>
      item(id, `What is the best next step for ${id}?`, `Choice ${id}`, text);
    const pool = [
      made("d1", "The client has depression and a suicide plan."),
      made("d2", "Depression with suicidal ideation."),
      made("d3", "Another depression and suicide assessment."),
      made("d4", "Hopelessness and depression."),
      made("c1", "COPD exacerbation with dyspnea."),
      made("c2", "COPD exacerbation, wheezing, and hypoxia."),
      made("c3", "Chronic obstructive pulmonary disease flare."),
      made("o1", "A postoperative client asks for pain medication."),
    ];
    const selected = selectSittingItems({ pool, limit: 8, seed: 4, relax: false });
    const keys = selected.items.map((row) =>
      narrowTopicKey({ text: `${row.scenario} ${row.question}` })
    );
    expect(countConsecutiveTopicRun(selected.items, (row) =>
      narrowTopicKey({ text: `${row.scenario} ${row.question}` })
    )).toBeLessThanOrEqual(2);
    const depression = keys.filter((key) => key === "depression-suicide").length;
    expect(depression).toBeLessThanOrEqual(2);
    expect(orderWithTopicGap(["a", "a", "a", "b"], (value) => value).join("")).not.toBe("aaab");
  });

  it("caps one condition at 2 of 50 and 4 of 91", () => {
    expect(narrowTopicShareCap(50)).toBe(2);
    expect(narrowTopicShareCap(91)).toBe(4);
    expect(narrowTopicShareCap(150)).toBe(4);
    const copd = (id: string, n: number) =>
      item(
        id,
        `What is the priority for ${id}?`,
        `Choice ${id}`,
        `COPD exacerbation with dyspnea. Oxygen saturation is ${n} percent on arrival.`
      );
    const other = (id: string) =>
      item(id, `What is the priority for ${id}?`, `Choice ${id}`, `A client needs teaching about wound care number ${id}.`);
    const pool = [
      ...Array.from({ length: 8 }, (_, i) => copd(`copd-${i}`, 80 + i)),
      ...Array.from({ length: 50 }, (_, i) => other(`other-${i}`)),
    ];
    const selected = selectSittingItems({ pool, limit: 50, seed: 11, relax: false });
    const copdCount = selected.items.filter((row) =>
      narrowTopicKey({ text: `${row.scenario} ${row.question}` }) === "copd"
    ).length;
    expect(copdCount).toBeLessThanOrEqual(2);
  });
});
