import Link from "next/link";
import { fullExamPassPathCopy } from "@/lib/learning/full-exam-pass-path";
import { feUi } from "@/lib/study/full-exam-ui";
import { cn } from "@/lib/utils";

type Props = {
  missCount: number;
  persisted: boolean;
  reviewHref: string | null;
  proofHref: string;
};

/**
 * Post-sim pass-path panel. Misses already written as QuestionAttempt rows
 * open Review incorrect. The score stays a practice band.
 */
export function FullExamPassPathPanel({
  missCount,
  persisted,
  reviewHref,
  proofHref,
}: Props) {
  const copy = fullExamPassPathCopy({ missCount, persisted });

  return (
    <section
      aria-labelledby="exam-pass-path-heading"
      className={cn(feUi.panel, "flex flex-col p-4 sm:block sm:p-6")}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-800">
          Practice band
        </p>
        <h2
          id="exam-pass-path-heading"
          className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[15px] sm:tracking-tight"
        >
          {copy.title}
        </h2>
      </div>
      <p className={cn(feUi.sectionHint, "order-2 mt-2 sm:order-none sm:mt-1")}>{copy.detail}</p>
      <p className="order-3 mt-2 text-[13px] font-medium leading-relaxed tracking-[-0.01em] text-[var(--color-ink)] sm:order-none sm:mt-3">
        {copy.disclaimer}
      </p>
      <div className="order-1 mt-3 flex flex-col gap-2 sm:order-none sm:mt-4 sm:flex-row">
        {copy.reviewCta && reviewHref ? (
          <Link
            href={reviewHref}
            data-session-primary="true"
            className={cn(feUi.footerBtnPrimary, "min-h-11 w-full justify-center px-5 py-2.5 sm:w-auto")}
          >
            {copy.reviewCta}
          </Link>
        ) : null}
        <Link
          href={proofHref}
          data-session-primary={copy.reviewCta && reviewHref ? undefined : "true"}
          className={cn(feUi.footerBtn, "min-h-11 w-full justify-center px-5 py-2.5 sm:w-auto")}
        >
          {copy.proofCta}
        </Link>
      </div>
    </section>
  );
}
