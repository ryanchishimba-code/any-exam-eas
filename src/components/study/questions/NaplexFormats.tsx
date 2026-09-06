"use client";

import { useMemo, useState } from "react";
import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import { ArrowRight, Check, GripVertical, RotateCcw, X } from "lucide-react";

type Props = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
};

/** Scrollable EHR-style case block for long NAPLEX vignettes. */
export function NaplexCaseVignette({ text }: { text: string }) {
  return (
    <div className="mb-4 max-h-56 overflow-y-auto rounded-xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-inner sm:max-h-72">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Patient case
      </p>
      <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 sm:text-sm">
        {text}
      </p>
    </div>
  );
}

export function ExhibitTable({ question }: { question: StudyQuestion }) {
  const payload = question.ngnPayload ?? question.chartData;
  const table = payload?.table as
    | { title?: string; headers: string[]; rows: string[][]; abnormalRows?: boolean[] }
    | undefined;
  if (!table?.headers?.length) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700">
      {table.title ? (
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {table.title}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => {
              const abnormal = Boolean(table.abnormalRows?.[ri]);
              return (
                <tr
                  key={ri}
                  className={
                    abnormal
                      ? "border-t border-rose-100 bg-rose-50/80 dark:border-rose-900/40 dark:bg-rose-950/30"
                      : "border-t border-slate-100 even:bg-slate-50/50 dark:border-zinc-800 dark:even:bg-zinc-900/40"
                  }
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={
                        abnormal && ci === 1
                          ? "px-3 py-2 font-semibold tabular-nums text-rose-800 dark:text-rose-300"
                          : "px-3 py-2 text-slate-800 dark:text-zinc-200"
                      }
                    >
                      {cell}
                      {abnormal && ci === 1 ? (
                        <span className="ml-1.5 text-[10px] font-bold uppercase text-rose-600">
                          Abn
                        </span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ConstructedResponseInput({
  question,
  selected,
  revealed,
  onToggle,
}: Props) {
  const payload = question.ngnPayload as { unit?: string } | undefined;
  const unit = payload?.unit ?? "";
  const value =
    selected[0]?.replace(/\s*(mL\/hr|mcg\/mL|mcg|mg\/mL|mg|mEq|units|capsules|%|mL).*$/i, "").trim() ??
    "";
  const correct = question.correctAnswers[0] ?? "";
  const isCorrect =
    revealed &&
    normalizeNumeric(value) === normalizeNumeric(correct.replace(/[^\d.]/g, ""));

  return (
    <div className="mt-6 space-y-3">
      <p className="text-xs text-[var(--color-ink-muted)]">
        Enter your numeric answer{unit ? ` (${unit})` : ""}. Round per item instructions.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          disabled={revealed}
          value={value}
          onChange={(e) => {
            const raw = e.target.value.trim();
            onToggle(raw ? `${raw} ${unit}`.trim() : "__clear__");
          }}
          className="w-36 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm tabular-nums shadow-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          placeholder="0"
          aria-label="Numeric answer"
        />
        {unit && (
          <span className="text-sm font-medium text-[var(--color-ink-muted)]">{unit}</span>
        )}
      </div>
      {revealed && (
        <p
          className={`flex items-center gap-1.5 text-sm ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}
        >
          {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          Correct: {correct}
          {unit && !String(correct).includes(unit) ? ` ${unit}` : ""}
        </p>
      )}
      {question.solutionSteps && question.solutionSteps.length > 0 && revealed && (
        <ol className="list-decimal space-y-1 pl-5 text-xs text-[var(--color-ink-muted)]">
          {question.solutionSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function DragDropMatch({ question, selected, revealed, onToggle }: Props) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const payload = question.ngnPayload as
    | { prompts?: string[]; options?: string[] }
    | undefined;
  const prompts = payload?.prompts ?? [];
  const allOptions = payload?.options ?? question.options;

  const selectedMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of selected) {
      const [left, right] = s.split("|||");
      if (left && right) map.set(left, right);
    }
    return map;
  }, [selected]);

  const usedOptions = useMemo(() => new Set(selectedMap.values()), [selectedMap]);
  const matchedCount = selectedMap.size;
  const total = prompts.length;
  const progressPct = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  const assign = (prompt: string, option: string) => {
    if (revealed) return;
    const current = selectedMap.get(prompt);
    if (current === option) {
      onToggle(`__unmatch__|||${prompt}`);
      return;
    }
    onToggle(`${prompt}|||${option}`);
  };

  const clearPrompt = (prompt: string) => {
    if (!revealed && selectedMap.has(prompt)) {
      onToggle(`__unmatch__|||${prompt}`);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Tap an answer chip, then tap the matching prompt — or tap a filled slot to change.
        </p>
        <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--color-accent)]">
          {matchedCount}/{total} matched
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        {/* Prompts + drop slots */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Scenarios
          </p>
          {prompts.map((prompt, idx) => {
            const pick = selectedMap.get(prompt);
            const correctPair = question.correctAnswers.find((c) =>
              c.startsWith(`${prompt}|||`)
            );
            const correctMatch = correctPair?.split("|||")[1];
            const slotCorrect = revealed && pick && correctMatch === pick;
            const slotWrong = revealed && pick && correctMatch !== pick;

            return (
              <div
                key={prompt}
                role="presentation"
                onClick={() => !revealed && setActivePrompt(prompt)}
                className={`w-full cursor-pointer rounded-xl border p-3 text-left transition ${
                  activePrompt === prompt && !revealed
                    ? "ring-2 ring-[var(--color-accent)]/40"
                    : ""
                } ${
                  slotCorrect
                    ? "border-emerald-300 bg-emerald-50/80"
                    : slotWrong
                      ? "border-rose-300 bg-rose-50/80"
                      : pick
                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5"
                        : "border-dashed border-black/15 bg-white"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-[var(--color-ink)]">
                      {prompt}
                    </p>
                    <div className="mt-2 flex min-h-[2.25rem] items-center gap-2">
                      {pick ? (
                        <>
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                              slotCorrect
                                ? "border-emerald-400 bg-white text-emerald-800"
                                : slotWrong
                                  ? "border-rose-400 bg-white text-rose-800"
                                  : "border-[var(--color-accent)]/40 bg-white text-[var(--color-accent)]"
                            }`}
                          >
                            <GripVertical className="h-3 w-3 opacity-40" aria-hidden />
                            {cleanOptionText(pick)}
                          </span>
                          {!revealed && (
                            <button
                              type="button"
                              onClick={() => clearPrompt(prompt)}
                              className="rounded p-1 text-[var(--color-ink-muted)] hover:bg-black/5 hover:text-[var(--color-ink)]"
                              aria-label="Clear match"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {revealed && correctMatch && correctMatch !== pick && (
                            <span className="text-xs text-emerald-700">
                              → {cleanOptionText(correctMatch)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs italic text-[var(--color-ink-muted)]">
                          {revealed ? "—" : "Select from answer bank →"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <ArrowRight className="h-5 w-5 text-[var(--color-ink-muted)]" aria-hidden />
        </div>

        {/* Answer bank */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Answer bank
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl border border-black/[0.06] bg-slate-50/50 p-3">
            {allOptions.map((opt) => {
              const isUsed = usedOptions.has(opt);
              const isCorrectOption = revealed && question.correctAnswers.some(
                (c) => c.endsWith(`|||${opt}`) || c.split("|||")[1] === opt
              );
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={revealed || isUsed}
                  onClick={() => {
                    const target =
                      activePrompt ??
                      prompts.find((p) => !selectedMap.has(p)) ??
                      prompts[0];
                    if (target) {
                      assign(target, opt);
                      setActivePrompt(target);
                    }
                  }}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    revealed && isCorrectOption
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : isUsed
                        ? "cursor-not-allowed border-black/5 bg-black/[0.03] text-[var(--color-ink-muted)] opacity-40 line-through"
                        : "border-black/10 bg-white text-[var(--color-ink)] shadow-sm hover:border-[var(--color-accent)]/50 hover:shadow"
                  }`}
                  title={
                    isUsed
                      ? "Already assigned"
                      : "Assigns to next open scenario — tap scenario chip to target a specific row"
                  }
                >
                  <GripVertical className="h-3 w-3 shrink-0 opacity-35" aria-hidden />
                  {cleanOptionText(opt)}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--color-ink-muted)]">
            Tip: tap a scenario row first, then tap your answer — or use bank chips to fill open rows in order.
          </p>
          {/* Per-prompt quick assign (mobile-friendly) */}
          <div className="space-y-2 lg:hidden">
            {prompts.map((prompt) => (
              <div key={`m-${prompt}`} className="flex flex-wrap gap-1.5">
                {allOptions.map((opt) => {
                  const active = selectedMap.get(prompt) === opt;
                  const usedElsewhere = usedOptions.has(opt) && !active;
                  return (
                    <button
                      key={`${prompt}-${opt}`}
                      type="button"
                      disabled={revealed || usedElsewhere}
                      onClick={() => assign(prompt, opt)}
                      className={`rounded-full border px-2 py-0.5 text-[10px] ${
                        active
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                          : "border-black/10"
                      }`}
                    >
                      {cleanOptionText(opt)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeNumeric(s: string): number | null {
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}
