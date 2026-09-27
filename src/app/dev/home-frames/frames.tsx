"use client";

import { useMemo, useState } from "react";
import { BowTie, type BowTieValue } from "@/components/ngn/items/BowTie";
import { ReadinessBoard } from "@/components/readiness/ReadinessBoard";
import { ExplanationPanel, QuestionRenderer } from "@/components/study/questions/QuestionRenderer";
import { READINESS_PREVIEW_BOARD } from "@/app/dev/readiness-preview/fixture";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import { examQuestionToStudy } from "@/lib/questions/prepare";

/**
 * Capture surface for homepage product images.
 * Fixtures are the in-repo NGN demo question and the NGN pilot bow-tie (B01),
 * plus the readiness preview board. No database writes.
 */

const BOW_CONDITION = [
  { id: "c1", text: "Opioid-induced respiratory depression" },
  { id: "c2", text: "Pulmonary embolism after arthroplasty" },
  { id: "c3", text: "Hypovolemic shock from surgical bleeding" },
  { id: "c4", text: "Hypoglycemia from reduced oral intake" },
];

const BOW_ACTIONS = [
  { id: "a1", text: "Stop the PCA infusion" },
  { id: "a2", text: "Give naloxone IV per protocol, titrated to breathing" },
  { id: "a3", text: "Remind the client to press the PCA button less often" },
  { id: "a4", text: "Increase the IV fluid rate to 200 mL/h now" },
  { id: "a5", text: "Place the client in the Trendelenburg position" },
];

const BOW_MONITOR = [
  { id: "m1", text: "Respiratory rate and SpO2" },
  { id: "m2", text: "Level of sedation" },
  { id: "m3", text: "Surgical dressing drainage" },
  { id: "m4", text: "Pedal pulses in both feet" },
  { id: "m5", text: "Capillary blood glucose before meals" },
];

const FILLED_BOW: BowTieValue = {
  condition: "c1",
  actions: ["a1", "a2"],
  monitor: ["m1", "m2"],
};

function QuestionShot() {
  const question = useMemo(() => {
    const study = examQuestionToStudy(NGN_DEMO_QUESTIONS[2]!, 2, { shuffleOptions: false });
    return { ...study, field: "nursing", highYield: false, qualityScore: undefined };
  }, []);
  const selected = question.correctAnswers.slice(0, 1);

  return (
    <div className="bg-white px-4 py-4 text-[#0f172a] sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f766e]">
        NCLEX · Question
      </p>
      <div className="mt-3">
        <QuestionRenderer question={question} selected={selected} revealed onToggle={() => undefined} />
        <ExplanationPanel question={question} field="nursing" />
      </div>
    </div>
  );
}

function BowTieShot() {
  const [value, setValue] = useState<BowTieValue>(FILLED_BOW);
  return (
    <div className="bg-white px-4 py-4 text-[#0A2540] sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f766e]">
        NCLEX · NGN bow-tie
      </p>
      <p className="mt-3 text-sm font-semibold leading-relaxed">
        Complete the diagram: the condition the client is most likely experiencing, 2 actions to take,
        and 2 parameters to monitor.
      </p>
      <div className="mt-4">
        <BowTie
          condition={BOW_CONDITION}
          actions={BOW_ACTIONS}
          monitor={BOW_MONITOR}
          seed="home-frame-b01"
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
}

export function HomeFrames() {
  return (
    <main
      id="main-content"
      className="space-y-16 bg-white p-6 text-[#0f172a]"
      style={{ colorScheme: "light", ["--color-accent" as string]: "#0f766e", ["--study-accent" as string]: "#0f766e" }}
    >
      <section id="shot-question" className="h-[620px] w-[960px] overflow-hidden rounded-2xl border border-black/10 bg-white">
        <QuestionShot />
      </section>
      <section id="shot-question-phone" className="h-[760px] w-[390px] overflow-hidden rounded-[28px] border border-black/10 bg-white">
        <QuestionShot />
      </section>
      <section id="shot-bowtie" className="w-[1120px] overflow-hidden rounded-2xl border border-black/10 bg-white">
        <BowTieShot />
      </section>
      <section id="shot-readiness" className="h-[760px] w-[1120px] overflow-hidden rounded-2xl border border-black/10 bg-[#f8fafc] p-6">
        <ReadinessBoard data={READINESS_PREVIEW_BOARD} />
      </section>
    </main>
  );
}
