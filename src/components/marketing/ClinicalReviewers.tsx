import { CLINICAL_REVIEWERS, BOARDS_REVIEWED_BY_PROCESS, type ClinicalReviewer } from "@/lib/marketing/company";

export function ClinicalReviewerAvatar({
  reviewer,
  size = "md",
}: {
  reviewer: ClinicalReviewer;
  size?: "sm" | "md";
}) {
  const dimension = size === "sm" ? "h-9 w-9 text-sm" : "h-14 w-14 text-xl";
  return (
    <span
      aria-hidden
      className={`inline-flex ${dimension} shrink-0 items-center justify-center rounded-full font-bold tracking-wide`}
      style={{ backgroundColor: reviewer.avatar.background, color: reviewer.avatar.color }}
    >
      {reviewer.initials}
    </span>
  );
}

export function ClinicalReviewers({
  headingId = "clinical-reviewers",
}: {
  headingId?: string;
}) {
  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-2xl font-bold tracking-tight text-[var(--color-ink)]"
      >
        Our clinical reviewers
      </h2>
      <ul className="mt-8 space-y-6" role="list">
        {CLINICAL_REVIEWERS.map((reviewer) => (
          <li key={reviewer.id} className="flex items-start gap-4">
            <ClinicalReviewerAvatar reviewer={reviewer} />
            <div>
              <p className="text-lg font-semibold text-[var(--color-ink)]">{reviewer.displayName}</p>
              <p className="mt-1 text-base leading-relaxed text-[var(--color-ink-muted)]">
                {reviewer.role}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {BOARDS_REVIEWED_BY_PROCESS}
      </p>
    </section>
  );
}
