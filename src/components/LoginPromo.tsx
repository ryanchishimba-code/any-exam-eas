import { Button } from "./ui/Button";
import { AppleLink } from "./ui/AppleLink";
import { LoginPromoGraphic } from "./LoginPromoGraphic";
import { formatTrialEntryPrice, formatTrialLabel } from "@/lib/site";

export function LoginPromo() {
  return (
    <section
      className="apple-section apple-section-alt border-y border-black/[0.04]"
      aria-labelledby="login-promo-heading"
    >
      <div className="mx-auto grid max-w-[980px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className="text-center md:text-left">
          <h2
            id="login-promo-heading"
            className="apple-headline"
          >
            Pick up where you left off.
          </h2>
          <p className="apple-subhead mt-4 max-w-md md:mx-0 mx-auto">
            Log in with the email you used at signup. Your exams and progress are
            waiting in your Study Hub.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
            <Button href="/login">Log in</Button>
            <AppleLink href="/forgot-password">Forgot Password?</AppleLink>
          </div>
          <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
            New here?{" "}
            <AppleLink href="/signup?plan=trial" className="!text-sm">
              Start {formatTrialLabel()} — {formatTrialEntryPrice()} today
            </AppleLink>
          </p>
        </div>

        <LoginPromoGraphic />
      </div>
    </section>
  );
}
