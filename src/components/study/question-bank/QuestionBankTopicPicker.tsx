"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type SubjectOption = { id: string; label: string };

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

      <div className={qbUi.insetGroup}>
        <ul className="max-h-[min(52vh,320px)] overflow-y-auto p-1.5" role="listbox" aria-label="Topics">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-[var(--color-ink-muted)]">
              No topics match &ldquo;{query}&rdquo;
            </li>
          ) : (
            filtered.map((subject) => {
              const selected = subject.id === subjectId;
              const count = subjectCounts?.[subject.id];
              return (
                <li key={subject.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSubjectChange(subject.id)}
                    className={cn(
                      qbUi.listItem,
                      "flex w-full items-center justify-between gap-3 rounded-[12px]",
                      selected ? qbUi.listItemSelected : qbUi.listItemIdle
                    )}
                  >
                    <span className="font-medium">{subject.label}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {typeof count === "number" ? (
                        <span
                          className={cn(
                            "tabular-nums text-[12px]",
                            selected ? "opacity-90" : "text-[var(--color-ink-muted)]"
                          )}
                        >
                          {count.toLocaleString()}
                        </span>
                      ) : null}
                      {selected ? <Check className="h-4 w-4 opacity-90" aria-hidden /> : null}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <p className="text-[12px] text-[var(--color-ink-muted)]">
        {subjects.length} topics · {filtered.length} shown
        {totalCount !== null ? (
          <> · {totalCount.toLocaleString()} questions available</>
        ) : null}
      </p>
    </div>
  );
}
