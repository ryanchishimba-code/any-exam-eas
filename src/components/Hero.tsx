import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import { Button } from "./ui/Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="apple-hero-glow relative overflow-hidden pb-20 pt-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center px-6 text-center">
        <p className="apple-eyebrow apple-animate-in">Any field. Any exam. Easier.</p>

        <h1 className="apple-animate-in apple-animate-in-delay-1 mt-5 max-w-[14ch] text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)] md:max-w-none">
          Any Exam Easy.
        </h1>

        <p className="apple-animate-in apple-animate-in-delay-2 mx-auto mt-6 max-w-2xl text-[clamp(1.0625rem,2.5vw,1.375rem)] leading-[1.45] text-[var(--color-ink-muted)]">
          Generate practice exams grounded in live research. Learn with an adaptive quilt
          of flashcards and quizzes — calm, focused, and built for how you study.
        </p>

        <div className="apple-animate-in apple-animate-in-delay-3 mt-11 flex flex-wrap items-center justify-center gap-4">
          <Button href="/signup?plan=trial">{formatTrialLabel()}</Button>
          <Button href="/signup?plan=subscribe" variant="secondary">
            Subscribe — {formatMonthlyPrice()}/mo
          </Button>
          <Button href="/login" variant="ghost">
            Log in
          </Button>
        </div>

        <p className="apple-animate-in apple-animate-in-delay-4 mt-7 text-xs tracking-wide text-[var(--color-ink-muted)]">
          Beta · {formatTrialLabel()} or {formatMonthlyPrice()}/month · Cancel anytime · 18+ only
        </p>

        <div className="apple-animate-in apple-animate-in-delay-4 w-full">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
