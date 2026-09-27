import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { FounderNote } from "@/components/marketing/elevation/FounderNote";
import { LandingTestimonialsV2 } from "@/components/landing/LandingTestimonialsV2";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatPricingCheckoutTrialOffer, MARKETING_DISCLAIMER } from "@/lib/site";

const PATH = [
  {
    title: "A practice baseline",
    body: "See what you miss before you build a plan around it. The score is practice on this site, not a prediction of your license.",
  },
  {
    title: "A daily Today set",
    body: "One set for the day, so the bank does not turn into an endless list.",
  },
  {
    title: "Review what you got wrong",
    body: "Misses come back with the rationale, and a source when the item stores one.",
  },
  {
    title: "Practice exams on official weights",
    body: "Timed forms follow the published outline. A form that cannot fill those weights is not padded.",
  },
  {
    title: "NGN case studies",
    body: "Published Next Generation items are written to the 2026 NCSBN test plan, with cited sources.",
  },
  {
    title: "Study guides",
    body: "Board guides sit next to the Qbank, so the outline and the questions stay in one place.",
  },
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
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
          Most students are paying for more than one product, guessing which topics matter, and
          walking into the exam without a clear picture of what they miss. AnyExamEasy is the daily
          practice that closes that gap.
        </p>
      </div>
    </section>
  );
}

export function PathSection({ includeNgn = true }: { includeNgn?: boolean }) {
  const steps = includeNgn ? PATH : PATH.filter((step) => step.title !== "NGN case studies");
  return (
    <section className="bg-[var(--color-surface)] px-5 py-20 sm:px-6 sm:py-28" aria-labelledby="path-heading">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">How you study</p>
        <h2
          id="path-heading"
          className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
        >
          A path from the first set to test day.
        </h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-[var(--color-border)] pt-6">
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--color-accent)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--color-ink-muted)]">{step.body}</p>
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

export function PriceSection({ trialHref = LANDING_TRIAL_HREF }: { trialHref?: string }) {
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28" aria-labelledby="price-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">Price</p>
        <h2
          id="price-heading"
          className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]"
        >
          {formatMonthlyPrice("pro")}/mo for six boards.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
          NCLEX, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT are on
          one Pro plan.
        </p>
        <p className="mt-4 text-base font-medium text-[var(--color-ink)]">{formatPricingCheckoutTrialOffer()}</p>
        <div className="mt-8 flex justify-center">
          <LandingCta href={trialHref} ctaName="price_trial" location="price">
            Start your free trial
          </LandingCta>
        </div>
        <PurchaseTrustNotes className="mt-8" />
      </div>
    </section>
  );
}

export function FinalMarketingCta({
  title = "Start with the free trial.",
  trialHref = LANDING_TRIAL_HREF,
}: {
  title?: string;
  trialHref?: string;
}) {
  return (
    <section className="bg-[#1e3a5f] px-5 py-20 text-white sm:px-6 sm:py-28" aria-labelledby="final-cta-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="final-cta-heading" className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
          {title}
        </h2>
        <p className="mt-5 text-base text-white/80">{formatPricingCheckoutTrialOffer()}</p>
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
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white/70">{MARKETING_DISCLAIMER}</p>
      </div>
    </section>
  );
}
