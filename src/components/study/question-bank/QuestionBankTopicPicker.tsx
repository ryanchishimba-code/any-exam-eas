"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type SubjectOption = { id: string; label: string };

export function QuestionBankTopicPicker({
  subjects,
  subjectId,
  onSubjectChange,
}: {
  subjects: SubjectOption[];
  subjectId: string;
  onSubjectChange: (subjectId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.label.toLowerCase().includes(q));
  }, [query, subjects]);

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
              return (
                <li key={subject.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSubjectChange(subject.id)}
                    className={cn(
                      qbUi.listItem,
                      "rounded-[12px]",
                      selected ? qbUi.listItemSelected : qbUi.listItemIdle
                    )}
                  >
                    <span className="font-medium">{subject.label}</span>
                    {selected ? <Check className="h-4 w-4 shrink-0 opacity-90" aria-hidden /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <p className="text-[12px] text-[var(--color-ink-muted)]">
        {subjects.length} topics · {filtered.length} shown
      </p>
    </div>
  );
}
