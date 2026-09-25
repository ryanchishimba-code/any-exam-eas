import Link from "next/link";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { studyGuideTrialLine } from "@/lib/marketing/study-guide-offer";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice } from "@/lib/site";

/**
 * Premium reference book gate. Anonymous visitors see the trial offer.
 * Signed-in visitors who already used a trial see Pro, not another trial CTA.
 */
export function StudyGuideUpsell({
  exam,
  signedIn,
}: {
  exam: StudyGuideExam;
  signedIn: boolean;
}) {
  const config = STUDY_GUIDES[exam];
  const offer = studyGuideTrialLine();
  const trialHref = landingTrialHrefForExam(exam);
  const signInHref = `/login?callbackUrl=${encodeURIComponent(config.routeBase)}`;

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Reference book
      </p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
        {config.title}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-ink)]">
        {signedIn
          ? `This ${config.legal.examName} reference book is included with Pro. Bookmarks and highlights stay with your account.`
          : `The ${config.legal.examName} study guide is included with the 5-day free trial. Bookmarks and highlights save when you start.`}
      </p>
      <p className="mt-6 text-base font-semibold tracking-tight text-[var(--color-ink)]">
        {signedIn ? `Pro is ${formatMonthlyPrice("pro")}/mo.` : offer}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {signedIn ? (
          <Link
            href={ROUTES.pricing}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-base font-semibold text-white transition hover:opacity-95"
          >
            Continue with Pro · {formatMonthlyPrice("pro")}/mo
          </Link>
        ) : (
          <Link
            href={trialHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-base font-semibold text-white transition hover:opacity-95"
          >
            Start 5-day free trial
          </Link>
        )}
        {signedIn ? null : (
          <Link
            href={signInHref}
            className="text-base font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
          >
            Sign in
          </Link>
        )}
      </div>
    </section>
  );
}
