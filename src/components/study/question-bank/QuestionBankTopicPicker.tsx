"use client";

import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Layers, Loader2, Search } from "lucide-react";
import { MIXED_SUBJECT_ID, MIXED_SUBJECT_LABEL } from "@/lib/study/question-bank-setup";
import { subjectVisual } from "@/lib/library/subject-icon";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

type SubjectOption = { id: string; label: string };

const TOPIC_ROW_HEIGHT = 56;

export function QuestionBankTopicPicker({
  subjects,
  subjectId,
  subjectCounts,
  onSubjectChange,
  allowMixed = true,
  weakSubjectIds,
  countsLoading = false,
}: {
  subjects: SubjectOption[];
  subjectId: string;
  subjectCounts?: Record<string, number> | null;
  onSubjectChange: (subjectId: string) => void;
  allowMixed?: boolean;
  weakSubjectIds?: string[];
  countsLoading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.label.toLowerCase().includes(q));
  }, [query, subjects]);

  const totalCount = useMemo(() => {
    if (!subjectCounts) return null;
    return subjects.reduce((sum, s) => sum + (subjectCounts[s.id] ?? 0), 0);
  }, [subjects, subjectCounts]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => TOPIC_ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <div className="space-y-2.5">
      <label className="relative block">
        <span className="sr-only">Search topics</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-muted)]"
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

      {filtered.length === 0 && !(allowMixed && !query.trim()) ? (
        <div className={qbUi.emptyState}>No topics match &ldquo;{query}&rdquo;</div>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[min(52vh,420px)] overflow-y-auto rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Topics"
        >
          <div className={qbUi.listSurface}>
            {allowMixed && !query.trim() ? (
              <MixedTopicRow
                selected={subjectId === MIXED_SUBJECT_ID}
                totalCount={totalCount}
                onSelect={() => onSubjectChange(MIXED_SUBJECT_ID)}
              />
            ) : null}
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const subject = filtered[virtualRow.index];
                if (!subject) return null;
                const selected = subject.id === subjectId;
                const count = subjectCounts?.[subject.id];
                const isWeak = weakSubjectIds?.includes(subject.id);
                const disabled =
                  !countsLoading && typeof count === "number" && count <= 0;
                const { icon: Icon, tint } = subjectVisual(subject.label);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={disabled}
                    onClick={() => onSubjectChange(subject.id)}
                    className={cn(
                      qbUi.listRow,
                      "absolute left-0 top-0 w-full",
                      selected && qbUi.listRowSelected,
                      disabled && "cursor-not-allowed opacity-45"
                    )}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                        tint
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                        {subject.label}
                      </p>
                      {typeof count === "number" ? (
                        <p className={qbUi.sectionHint}>
                          {count.toLocaleString()} {count === 1 ? "question" : "questions"}
                        </p>
                      ) : countsLoading ? (
                        <p className={qbUi.sectionHint}>Loading count…</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {isWeak ? (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                          Weak
                        </span>
                      ) : null}
                      {selected ? (
                        <Check className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p className={qbUi.sectionHint}>
        {countsLoading ? (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Loading question counts…
          </span>
        ) : (
          <>
            {subjects.length} topics · {filtered.length} shown
            {totalCount !== null ? (
              <> · {totalCount.toLocaleString()} questions available</>
            ) : null}
          </>
        )}
      </p>
    </div>
  );
}

function MixedTopicRow({
  selected,
  totalCount,
  onSelect,
}: {
  selected: boolean;
  totalCount: number | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(qbUi.listRow, selected && qbUi.listRowSelected)}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
        <Layers className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">{MIXED_SUBJECT_LABEL}</p>
        <p className={qbUi.sectionHint}>
          Random across all topics
          {totalCount !== null ? <> · {totalCount.toLocaleString()} questions</> : null}
        </p>
      </div>
      {selected ? <Check className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden /> : null}
    </button>
  );
}
