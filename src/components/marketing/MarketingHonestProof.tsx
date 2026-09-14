import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import {
  formatExactServeReadyQuestions,
  getPublishedQuestionStats,
} from "@/lib/marketing/bank-stats";

const PROOF_ITEMS = [
  {
    title: "Live published bank",
    body: (countLabel: string) =>
      `${countLabel} across six boards — counted from serve-ready items, not a rounded marketing figure.`,
  },
  {
    title: "No-card trial",
    body: () =>
      `${formatTrialLabel()} · 500 practice questions · then ${formatMonthlyPrice("pro")}/mo. Cancel anytime.`,
  },
  {
    title: "Still overpaying per exam?",
    body: () =>
      "One Pro plan vs stacking separate NCLEX, USMLE, or NAPLEX banks. Advertised competitor prices live on Compare.",
  },
] as const;

/** Honest, non-testimonial proof — product facts only. */
export function MarketingHonestProof({
  heading = "What you can verify",
}: {
  heading?: string;
}) {
  const countLabel = formatExactServeReadyQuestions(
    getPublishedQuestionStats().totalPublished
  );

  return (
    <div className="aee-honest-proof">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
        {heading}
      </p>
      <ul className="mt-5 grid gap-4 md:grid-cols-3" role="list">
        {PROOF_ITEMS.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)]"
          >
            <h3 className="text-sm font-bold tracking-tight text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {item.body(countLabel)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-[var(--color-ink-muted)]">
        <Link href={ROUTES.compare} className="font-semibold text-[var(--color-accent)] hover:underline">
          Transparent compare
        </Link>
        {" · "}
        we do not guarantee exam results or licensure.
      </p>
    </div>
  );
}
