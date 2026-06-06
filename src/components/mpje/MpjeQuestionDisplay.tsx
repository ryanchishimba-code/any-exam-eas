"use client";

import { cn } from "@/lib/utils";

export type MpjeDisplayQuestion = {
  question: string;
  options: string[];
  itemType?: string;
  scenario?: string | null;
  statements?: string[];
};

type Props = {
  question: MpjeDisplayQuestion;
  selected: string | string[];
  onSelect: (value: string) => void;
  onToggleMulti?: (option: string) => void;
  disabled?: boolean;
  variant?: "exam" | "study";
};

function parseStatements(
  question: MpjeDisplayQuestion
): string[] | null {
  if (question.statements?.length) return question.statements;
  if (question.itemType !== "k_type") return null;
  const lines = question.question.split("\n").map((l) => l.trim());
  const stmts = lines.filter((l) => /^I{1,3}\./.test(l));
  return stmts.length >= 2 ? stmts : null;
}

export function MpjeQuestionDisplay({
  question,
  selected,
  onSelect,
  onToggleMulti,
  disabled = false,
  variant = "exam",
}: Props) {
  const isKType = question.itemType === "k_type";
  const isSelectAll = question.itemType === "select_all";
  const statements = isKType ? parseStatements(question) : null;
  const stem = isKType && statements?.length
    ? question.question.split(/\n(?=I\.)/)[0]?.trim() || question.question
    : question.question;

  const selectedArr = Array.isArray(selected)
    ? selected
    : selected
      ? [selected]
      : [];

  const isExam = variant === "exam";
  const scenarioClass = isExam
    ? "rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90"
    : "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950";
  const stemClass = isExam
    ? "mt-4 whitespace-pre-wrap text-lg leading-relaxed text-slate-100"
    : "text-xl font-medium leading-snug text-[var(--color-ink)]";
  const stmtClass = isExam
    ? "rounded-lg border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm leading-relaxed text-sky-100"
    : "rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950";
  const optionClass = (active: boolean) =>
    cn(
      "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
      isExam
        ? active
          ? "border-sky-500 bg-sky-500/15"
          : "border-white/15 hover:border-sky-400/40 hover:bg-white/5"
        : active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
          : "border-black/10 hover:border-black/20 hover:bg-black/[0.02]"
    );
  const labelClass = isExam ? "text-slate-200" : "text-[var(--color-ink)]";

  return (
    <div className="space-y-4">
      {question.scenario?.trim() && (
        <div className={scenarioClass}>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider opacity-70">
            Scenario
          </p>
          <p className="whitespace-pre-wrap">{question.scenario}</p>
        </div>
      )}

      {isKType && (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
            isExam ? "bg-violet-500/20 text-violet-200" : "bg-violet-100 text-violet-800"
          )}
        >
          K-type · Combination response
        </span>
      )}

      {isSelectAll && (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
            isExam ? "bg-emerald-500/20 text-emerald-200" : "bg-emerald-100 text-emerald-800"
          )}
        >
          Select all that apply
        </span>
      )}

      <p className={stemClass}>{stem}</p>

      {statements && statements.length > 0 && (
        <ol className="mt-4 space-y-2 list-none">
          {statements.map((stmt) => (
            <li key={stmt} className={stmtClass}>
              {stmt}
            </li>
          ))}
        </ol>
      )}

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Answer choices</legend>
        {question.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const display = isKType ? `${letter}. ${opt}` : opt;
          const active = isSelectAll
            ? selectedArr.includes(opt)
            : selected === opt;

          return (
            <label key={opt} className={optionClass(active)}>
              <input
                type={isSelectAll ? "checkbox" : "radio"}
                name="mpje-answer"
                value={opt}
                checked={active}
                disabled={disabled}
                onChange={() => {
                  if (isSelectAll) {
                    onToggleMulti?.(opt);
                  } else {
                    onSelect(opt);
                  }
                }}
                className="mt-0.5 shrink-0 accent-sky-500"
              />
              <span className={labelClass}>{display}</span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
