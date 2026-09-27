"use client";

import { READINESS_PREVIEW_BOARD } from "@/app/dev/readiness-preview/fixture";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";

/**
 * Capture surface for homepage product images.
 * Fixtures are the in-repo NGN demo question and the NGN pilot bow-tie (B01),
 * plus the readiness preview board. No database writes.
 */

function QuestionShot() {
  const item = NGN_DEMO_QUESTIONS[2]!;
  return (
    <div className="bg-white px-7 py-7 text-[#0a2540]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#0f766e]">NCLEX</p>
      <p className="mt-4 text-[22px] font-semibold leading-tight tracking-[-0.03em]">Glucose 412 mg/dL</p>
      <p className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.03em]">{item.question}</p>
      <ul className="mt-5 space-y-3">
        {item.options.map((option) => {
          const correct = option === item.correctAnswer;
          return (
            <li
              key={option}
              className={
                correct
                  ? "rounded-2xl bg-[#f4fbfa] px-4 py-3.5 text-[18px] font-semibold leading-snug ring-2 ring-[#0f766e]"
                  : "rounded-2xl bg-[#f5f5f7] px-4 py-3.5 text-[18px] leading-snug"
              }
            >
              {option}
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0f766e]">Rationale</p>
      <p className="mt-2 text-[20px] font-semibold leading-tight tracking-[-0.02em]">Insulin per protocol comes first.</p>
    </div>
  );
}

const LEVEL_BAR: Record<string, string> = {
  on_track: "88%",
  getting_close: "62%",
  not_yet: "38%",
};

function ReadinessShot() {
  const areas = READINESS_PREVIEW_BOARD.areas
    .filter((area) => area.level === "on_track" || area.level === "getting_close" || area.level === "not_yet")
    .slice(0, 4);

  return (
    <div className="bg-white px-10 py-8 text-[#0a2540]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#0f766e]">NCLEX</p>
      <p className="mt-3 text-[52px] font-semibold leading-none tracking-[-0.045em]">
        {READINESS_PREVIEW_BOARD.result?.overallLabel}
      </p>
      <ul className="mt-8 space-y-5">
        {areas.map((area) => (
          <li key={area.areaId}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[18px] font-semibold tracking-[-0.02em]">{area.label}</p>
              <p className="shrink-0 text-[15px] font-semibold text-[#0f766e]">{area.labelText}</p>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e7e7ec]">
              <div
                className="h-full rounded-full bg-[#0f766e]"
                style={{ width: LEVEL_BAR[area.level] ?? "40%" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BowChip({ text, on }: { text: string; on?: boolean }) {
  return (
    <p
      className={
        on
          ? "rounded-2xl bg-[#0a2540] px-4 py-3.5 text-[18px] font-semibold leading-snug text-white"
          : "rounded-2xl bg-white px-4 py-3.5 text-[18px] font-medium leading-snug text-[#0a2540]"
      }
    >
      {text}
    </p>
  );
}

function BowTieShot() {
  return (
    <div className="bg-white px-8 py-8 text-[#0a2540]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#0f766e]">NCLEX · Bow-tie</p>
      <div className="mt-6 grid grid-cols-[1fr_28px_1.05fr_28px_1fr] items-stretch gap-3">
        <div>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#3d4f63]">Actions</p>
          <div className="space-y-3 rounded-3xl bg-[#f4f6f8] p-3">
            <BowChip text="Stop the PCA" on />
            <BowChip text="Give naloxone" on />
            <BowChip text="Remind less often" />
          </div>
        </div>
        <div className="flex items-center justify-center text-[28px] font-light text-[#0f766e]" aria-hidden>
          ›
        </div>
        <div className="flex flex-col">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#3d4f63]">Condition</p>
          <div className="flex flex-1 items-center rounded-3xl bg-[#f4fbfa] px-5 py-6 ring-2 ring-[#0f766e]">
            <p className="text-[26px] font-semibold leading-tight tracking-[-0.03em]">Opioid respiratory depression</p>
          </div>
        </div>
        <div className="flex items-center justify-center text-[28px] font-light text-[#0f766e]" aria-hidden>
          ›
        </div>
        <div>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#3d4f63]">Monitor</p>
          <div className="space-y-3 rounded-3xl bg-[#f4f6f8] p-3">
            <BowChip text="Respiratory rate" on />
            <BowChip text="Sedation level" on />
            <BowChip text="Dressing drainage" />
          </div>
        </div>
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
      <section id="shot-question" className="w-[880px] overflow-hidden bg-white">
        <QuestionShot />
      </section>
      <section id="shot-question-phone" className="w-[390px] overflow-hidden bg-white">
        <QuestionShot />
      </section>
      <section id="shot-bowtie" className="w-[1120px] overflow-hidden rounded-2xl border border-black/10 bg-white">
        <BowTieShot />
      </section>
      <section id="shot-readiness" className="w-[960px] overflow-hidden rounded-2xl border border-black/10 bg-white">
        <ReadinessShot />
      </section>
    </main>
  );
}
