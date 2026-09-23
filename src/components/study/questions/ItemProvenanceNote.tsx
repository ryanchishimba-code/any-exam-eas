import { ShieldCheck } from "lucide-react";
import { formatReviewMonth } from "@/lib/exam-prep/item-qa/provenance";

/**
 * Source and review date for a Qbank item, shown only when the bank has them.
 * Visual parity with Library cards, using the study teal surface.
 */
export function ItemProvenanceNote({
  sourceLabel,
  sourceUrl,
  reviewedAt,
}: {
  sourceLabel?: string;
  sourceUrl?: string;
  reviewedAt?: string;
}) {
  const reviewedLabel = formatReviewMonth(reviewedAt);
  if (!sourceLabel && !reviewedLabel) return null;

  return (
    <div
      data-testid="item-provenance"
      className="mt-3 rounded-xl border border-[var(--study-accent)]/25 bg-[var(--color-surface)] px-3 py-2.5 text-xs text-[var(--color-ink)]"
    >
      <div className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
        <div className="min-w-0">
          <p className="font-semibold">{sourceLabel ? "Source" : "Reviewed"}</p>
          {sourceLabel ? (
            sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex text-[var(--study-accent)] hover:underline"
              >
                {sourceLabel}
              </a>
            ) : (
              <p className="mt-0.5">{sourceLabel}</p>
            )
          ) : null}
          {reviewedLabel ? (
            <p className="mt-1 text-[var(--color-ink-muted)]">Reviewed {reviewedLabel}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
