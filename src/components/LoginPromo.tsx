import Link from "next/link";
import { Button } from "./ui/Button";
import { LoginPromoGraphic } from "./LoginPromoGraphic";

export function LoginPromo() {
  return (
    <section
      className="login-promo-section relative overflow-hidden border-y border-black/[0.04] py-[clamp(3.5rem,9vw,5.5rem)]"
      aria-labelledby="login-promo-heading"
    >
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 lg:gap-20">
        <div className="text-center md:text-left">
          <p className="apple-eyebrow">Returning students</p>
          <h2
            id="login-promo-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]"
          >
            Pick up where you left off.
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)] md:mx-0 mx-auto">
            Log in with the email you used at signup. Your exams, learning quilts,
            and progress are waiting on your dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Button href="/login">Log in</Button>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
            New here?{" "}
            <Link href="/signup?plan=trial" className="font-medium text-[var(--color-accent)] hover:underline">
              Start free trial
            </Link>
            {" · "}
            <Link href="/signup?plan=subscribe" className="font-medium text-[var(--color-accent)] hover:underline">
              Subscribe
            </Link>
          </p>
        </div>

        <LoginPromoGraphic />
      </div>
    </section>
  );
}
