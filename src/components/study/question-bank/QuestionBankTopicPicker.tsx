"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { subjectVisual } from "@/lib/library/subject-icon";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type SubjectOption = { id: string; label: string };

/**
 * Subject/organ-system picker — an Apple-style icon-card grid that mirrors the
 * Library's Subjects view (shared `subjectVisual` glyphs/tints) for a consistent
 * platform feel. Each card shows the live, serve-accurate question count; the
 * selected card is clearly highlighted.
 */
export function QuestionBankTopicPicker({
  subjects,
  subjectId,
  subjectCounts,
  onSubjectChange,
}: {
  subjects: SubjectOption[];
  subjectId: string;
  subjectCounts?: Record<string, number> | null;
  onSubjectChange: (subjectId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.label.toLowerCase().includes(q));
  }, [query, subjects]);

  // Sum only the subjects we can show counts for, so the total never claims more
  // than the per-topic numbers add up to.
  const totalCount = useMemo(() => {
    if (!subjectCounts) return null;
    return subjects.reduce((sum, s) => sum + (subjectCounts[s.id] ?? 0), 0);
  }, [subjects, subjectCounts]);

  return (
    <div className="space-y-3">
      <label className="relative block">
        <span className="sr-only">Search topics</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          className={qbUi.searchInput}
        />
      </label>

      {filtered.length === 0 ? (
        <div className={cn(qbUi.insetGroup, "px-4 py-10 text-center text-sm text-[var(--color-ink-muted)]")}>
          No topics match &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div
          className="max-h-[min(56vh,460px)] overflow-y-auto rounded-[16px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Topics"
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((subject) => {
              const selected = subject.id === subjectId;
              const count = subjectCounts?.[subject.id];
              const { icon: Icon, tint } = subjectVisual(subject.label);
              return (
                <button
                  key={subject.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSubjectChange(subject.id)}
                  className={cn(
                    "group relative flex flex-col rounded-[18px] border p-4 text-left transition active:scale-[0.99]",
                    selected
                      ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06] ring-1 ring-[var(--color-accent)]/25"
                      : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)] hover:-translate-y-0.5 hover:border-[var(--color-accent)]/25 hover:shadow-[var(--shadow-apple-md)]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-2xl", tint)}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    {selected ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
                    {subject.label}
                  </p>
                  {typeof count === "number" ? (
                    <p className="mt-0.5 text-[12px] tabular-nums text-[var(--color-ink-muted)]">
                      {count.toLocaleString()} {count === 1 ? "question" : "questions"}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[12px] text-[var(--color-ink-muted)]">
        {subjects.length} topics · {filtered.length} shown
        {totalCount !== null ? (
          <> · {totalCount.toLocaleString()} questions available</>
        ) : null}
      </p>
    </div>
  );
}
