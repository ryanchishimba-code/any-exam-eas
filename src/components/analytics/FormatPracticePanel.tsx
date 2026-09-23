import Link from "next/link";
import { emptyFormatPracticeStats, type FormatPracticeStats } from "@/lib/study/practice-format";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type Props = {
  stats?: FormatPracticeStats | null;
  ngnLabel: string;
  fieldId?: string;
};

function launchHref(fieldId: string, format: "ngn" | "case"): string {
  const qs = new URLSearchParams({
    mode: "bank",
    field: fieldId,
    subjectId: "__mixed__",
    format,
    count: "5",
    pace: "untimed",
    style: "standard",
  });
  return `/question-bank?${qs.toString()}`;
}

export function FormatPracticePanel({ stats, ngnLabel, fieldId }: Props) {
  const practice = stats ?? emptyFormatPracticeStats();
  const cards = [
    { id: "ngn" as const, title: ngnLabel },
    { id: "case" as const, title: "Cases" },
  ];

  return (
    <section className="space-y-4" aria-labelledby="format-practice-heading">
      <div className="space-y-1">
        <h2
          id="format-practice-heading"
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
        >
          Format practice
        </h2>
        <p className={cn(studyUi.sectionHint, "max-w-xl text-[15px]")}>
          Attempts saved from {ngnLabel} and case sets. Practice progress only.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const bucket = practice[card.id];
          const empty = bucket.attempts <= 0;
          return (
            <article
              key={card.id}
              data-format-practice={card.id}
              data-format-attempts={bucket.attempts}
              className="flex min-h-[11rem] flex-col justify-between rounded-[22px] border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-6 py-6"
            >
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink-muted)]">
                  {card.title}
                </p>
                <p className="mt-4 text-[34px] font-semibold leading-none tracking-[-0.045em] text-[var(--color-ink)] tabular-nums">
                  {bucket.attempts.toLocaleString("en-US")}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
                  {empty
                    ? "No sets saved yet."
                    : `${bucket.accuracy ?? 0}% accuracy on saved attempts`}
                </p>
              </div>
              {fieldId ? (
                <Link
                  href={launchHref(fieldId, card.id)}
                  className="mt-5 inline-flex w-fit items-center text-[14px] font-semibold tracking-[-0.01em] text-[var(--color-accent)]"
                >
                  {empty ? "Launch a small set" : "Practice another set"}
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
