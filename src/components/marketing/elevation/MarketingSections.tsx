import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { FounderNote } from "@/components/marketing/elevation/FounderNote";
import { LandingTestimonialsV2 } from "@/components/landing/LandingTestimonialsV2";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatNclexPrepPriceComparison } from "@/lib/marketing/price-comparison";
import { formatMonthlyPrice } from "@/lib/site";

const PATH = [
  "A practice baseline",
  "A daily Today set",
  "Review what you got wrong",
  "Practice exams on official weights",
  "NGN case studies",
  "Study guides",
] as const;

export function ProblemSection({ board }: { board?: string }) {
  const headline = board
    ? `${board} prep is expensive, the bank is huge, and you still do not know if you are ready.`
    : "Prep is expensive, the bank is huge, and you still do not know if you are ready.";
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28" aria-labelledby="problem-heading">
      <div className="mx-auto max-w-3xl">
        <p className="aee-rise text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">The problem</p>
        <h2
          id="problem-heading"
          className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
        >
          {headline}
        </h2>
      </div>
    </section>
  );
}

export function PathSection({
  includeNgn = true,
  compact = false,
}: {
  includeNgn?: boolean;
  compact?: boolean;
}) {
  const steps = includeNgn ? PATH : PATH.filter((step) => step !== "NGN case studies");
  return (
    <section
      className={
        compact
          ? "bg-[var(--color-surface)] px-5 py-12 sm:px-6"
          : "bg-[var(--color-surface)] px-5 py-20 sm:px-6 sm:py-28"
      }
      aria-labelledby="path-heading"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          {compact ? "How it works" : "How you study"}
        </p>
        <h2
          id="path-heading"
          className={
            compact
              ? "mt-3 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-[var(--color-ink)] sm:text-3xl"
              : "mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
          }
        >
          {compact ? "From the first set to test day." : "A path from the first set to test day."}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Scores on this site are practice, not a prediction of your license.
        </p>
        <ol className={compact ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "mt-12 grid gap-8 sm:grid-cols-2"}>
          {steps.map((step, index) => (
            <li key={step} className={compact ? "border-t border-[var(--color-border)] pt-4" : "border-t border-[var(--color-border)] pt-6"}>
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--color-accent)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={compact ? "mt-2 text-lg font-semibold tracking-tight text-[var(--color-ink)]" : "mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]"}>
                {step}
              </h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProofIntro({ children }: { children?: React.ReactNode }) {
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28" aria-labelledby="proof-heading">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">Proof</p>
        <h2
          id="proof-heading"
          className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
        >
          Look at the work before you pay.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
          Questions reach a student only after the quality gate. Clinical reviewers are named by
          credential. You can try a real item with its rationale, and report an issue if something
          is wrong.
        </p>
        <p className="mt-4">
          <Link href={ROUTES.howQuestionsAreReviewed} className="font-semibold text-[var(--color-accent)] hover:underline">
            How our questions are built and reviewed
          </Link>
        </p>
        {children}
      </div>
    </section>
  );
}

export function SocialProof({ testimonials }: { testimonials?: LandingSuccessStory[] }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-5 pb-8 sm:px-6">
      <LandingTestimonialsV2 stories={testimonials} />
      <FounderNote />
    </div>
  );
}

export function PriceSection({
  trialHref = LANDING_TRIAL_HREF,
  showNclexComparison = false,
}: {
  trialHref?: string;
  showNclexComparison?: boolean;
}) {
  return (
    <section
      className={showNclexComparison ? "px-5 py-12 sm:px-6 sm:py-16" : "px-5 py-20 sm:px-6 sm:py-28"}
      aria-labelledby="price-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">Price</p>
        <h2
          id="price-heading"
          className={
            showNclexComparison
              ? "mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
              : "mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
          }
        >
          {formatMonthlyPrice("pro")}/mo for six boards.
        </h2>
        <p
          className={
            showNclexComparison
              ? "mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg"
              : "mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]"
          }
        >
          NCLEX, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT are on
          one Pro plan.
        </p>
        {showNclexComparison ? (
          <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)]" data-price-comparison>
            {formatNclexPrepPriceComparison()}
          </p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <LandingCta href={trialHref} ctaName="price_trial" location="price">
            Start your free trial
          </LandingCta>
        </div>
        <PurchaseTrustNotes className="mt-8" showTrialOffer={false} />
      </div>
    </section>
  );
}

export function FinalMarketingCta({
  title = "Start with the free trial.",
  trialHref = LANDING_TRIAL_HREF,
  compact = false,
}: {
  title?: string;
  trialHref?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "bg-[#1e3a5f] px-5 py-12 text-white sm:px-6"
          : "bg-[#1e3a5f] px-5 py-20 text-white sm:px-6 sm:py-28"
      }
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="final-cta-heading"
          className={
            compact
              ? "text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
              : "text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          }
        >
          {title}
        </h2>
        <div className="mt-8 flex justify-center">
          <LandingCta
            href={trialHref}
            ctaName="final_trial"
            location="final_cta"
            className="bg-white text-[#1e3a5f]"
            icon={<ArrowRight className="h-4 w-4" aria-hidden />}
          >
            Start your free trial
          </LandingCta>
        </div>
      </div>
    </section>
  );
}
