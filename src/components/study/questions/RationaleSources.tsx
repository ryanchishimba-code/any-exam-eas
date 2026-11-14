import { ExternalLink } from "lucide-react";
import type { StudyCitation } from "@/lib/questions/study-citations";

/** Title and link under a rationale. Hidden when the item has no citations. */
export function RationaleSources({ citations }: { citations: StudyCitation[] }) {
  if (citations.length === 0) return null;
  return (
    <section aria-label="Sources" className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Sources
      </p>
      <ul className="space-y-1.5">
        {citations.map((citation) => (
          <li key={`${citation.title}|${citation.url ?? ""}`} className="text-[13px] leading-relaxed text-[var(--color-ink)]">
            {citation.url ? (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[var(--study-accent)] underline-offset-2 hover:underline"
              >
                {citation.title}
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="font-medium">{citation.title}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
