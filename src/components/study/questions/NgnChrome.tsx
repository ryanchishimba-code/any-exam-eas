"use client";

import { formatNgnLabel } from "@/lib/questions/ngn-map";
import { stripShiftNotes } from "@/lib/questions/shift-notes";
import type { StudyQuestion } from "@/lib/questions/types";
import { Info } from "lucide-react";

const TYPE_INSTRUCTIONS: Record<string, string> = {
  bow_tie:
    "Select exactly one action to take and the required number of conditions to monitor. This mirrors NCLEX-NGN bow-tie items.",
  matrix:
    "For each clinical finding, choose the best column. One answer per row.",
  highlight:
    "Tap the text segment(s) that best answer the question — like highlighting an EHR note.",
  select_all:
    "Select all choices that apply. Partial credit may apply when enabled.",
  ordered_response:
    "Drag or tap to order steps from first priority to last.",
  unfolding_case:
    "Unfolding case — new information may appear as you progress through steps.",
  multiple_choice: "Choose the single best answer based on clinical judgment.",
  k_type: "Evaluate each statement, then select the correct combination.",
  short_answer: "Enter a numeric answer with correct units and rounding per the stem.",
  drag_drop:
    "Select a scenario, then tap an answer from the bank. Used answers are removed from the pool.",
  case_based: "Read the full patient case, then choose the single best action.",
  exhibit: "Review the exhibit table, then select the best answer.",
  sequential: "Questions 1–N share the same patient scenario; answer each in order.",
  abstract: "Read the journal abstract carefully, then apply study-design reasoning.",
  drug_ad: "Interpret the pharmaceutical advertisement — indications, warnings, and counseling.",
  ethics: "Apply ethical principles and communication standards to the scenario.",
  biostats: "Calculate or interpret epidemiologic/statistical findings.",
  ccs_prompt: "Step 3 CCS-style: choose the highest-priority management step.",
};

export function NgnFormatBadge({ question }: { question: StudyQuestion }) {
  const label = formatNgnLabel(question.type, question.ngnFormat);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
      {label}
      {question.caseStep != null && (
        <span className="text-[var(--color-ink-muted)]">· Step {question.caseStep}</span>
      )}
    </span>
  );
}

export function NgnTypeInstructions({ question }: { question: StudyQuestion }) {
  const key = question.type === "clinical_reasoning" ? "multiple_choice" : question.type;
  const text = TYPE_INSTRUCTIONS[key] ?? TYPE_INSTRUCTIONS[question.ngnFormat ?? ""] ?? null;
  if (!text) return null;
  return (
    <p className="mb-3 flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs leading-relaxed text-sky-900">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{text}</span>
    </p>
  );
}

export function NgnCjmmNote({ question }: { question: StudyQuestion }) {
  const payload = question.ngnPayload as { cjmmStep?: string } | undefined;
  if (!payload?.cjmmStep) return null;
  return (
    <div className="mb-4 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-xs text-violet-900">
      <p>
        <span className="font-semibold">NCJMM focus:</span> {payload.cjmmStep}
      </p>
    </div>
  );
}

export function inferVignetteLabel(text: string, stem = ""): string {
  const blob = `${text}\n${stem}`;
  if (/UAP|unlicensed assistive personnel|assign tasks to/i.test(blob)) return "Assignment context";
  if (/four (assigned )?clients|Which client.*first/i.test(blob)) return "Assignment context";
  return "Patient scenario";
}

export function VignetteBlock({ text, stem = "" }: { text: string; stem?: string }) {
  const cleaned = stripShiftNotes(text);
  const label = inferVignetteLabel(cleaned, stem);
  return (
    <div className="mb-4 rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3 sm:px-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
        {cleaned}
      </p>
    </div>
  );
}
