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
      className={cn(feUi.panel, "p-5 sm:p-6")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-800">
        Practice band
      </p>
      <h2 id="exam-pass-path-heading" className={`${feUi.sectionTitle} mt-1`}>
        {copy.title}
      </h2>
      <p className={cn(feUi.sectionHint, "mt-1")}>{copy.detail}</p>
      <p className="mt-3 text-[13px] font-medium leading-relaxed text-[var(--color-ink)]">
        {copy.disclaimer}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {copy.reviewCta && reviewHref ? (
          <Link href={reviewHref} className={cn(feUi.footerBtnPrimary, "justify-center px-5 py-2.5")}>
            {copy.reviewCta}
          </Link>
        ) : null}
        <Link href={proofHref} className={cn(feUi.footerBtn, "justify-center px-5 py-2.5")}>
          {copy.proofCta}
        </Link>
      </div>
    </section>
  );
}
