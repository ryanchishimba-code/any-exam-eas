import { formatMonthlyPrice, formatPricingHeadline, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";
import { Button } from "./ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="apple-section relative overflow-hidden pt-8 text-center md:pt-12">
      <div className="pointer-events-none absolute inset-0 apple-hero-premium" />

      <div className="relative mx-auto max-w-[980px] px-6">
        <p className="apple-eyebrow apple-animate-in">Any Exam Easy</p>

        <h1 className="apple-display apple-animate-in apple-animate-in-delay-1 mt-2">
          Pass your board exam.
          <br className="hidden sm:block" />
          {" "}Faster.
        </h1>

        <p className="apple-subhead apple-animate-in apple-animate-in-delay-2 mx-auto mt-5 max-w-[28rem]">
          NCLEX NGN, NAPLEX, USMLE, INBDE, and SAT — adaptive AI questions from
          Open RN, OpenStax, and board-style sources.
        </p>

        <p className="apple-animate-in apple-animate-in-delay-2 mt-4 text-sm font-medium text-[var(--color-ink)]">
          {formatPricingHeadline()}
        </p>

        <div className="apple-animate-in apple-animate-in-delay-3 mx-auto mt-10 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button
            href="/signup?plan=trial"
            className="!px-10 !py-4 !text-base shadow-[0_8px_30px_rgba(0,113,227,0.35)]"
          >
            Start {formatTrialLabel()} — {formatTrialIntroPrice()}
          </Button>
          <Button
            href="/signup?plan=subscribe"
            variant="secondary"
            className="!px-10 !py-4 !text-base"
          >
            Subscribe Now — {formatMonthlyPrice()}/mo
          </Button>
        </div>

        <p className="apple-animate-in apple-animate-in-delay-4 mt-5 text-xs text-[var(--color-ink-muted)]">
          Free account · Payment required for all exam features · Cancel anytime · 18+ only
        </p>

        <div className="apple-animate-in apple-animate-in-delay-4 mx-auto mt-14 max-w-3xl">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
