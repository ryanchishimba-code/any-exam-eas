"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { LiveBankStats } from "@/components/home/LiveBankStats";
import {
  firstName,
  loadReturningUserHint,
  touchReturningVisit,
  type ReturningUserHint,
} from "@/lib/client/returning-user";
import {
  formatTrialIntroPrice,
  formatTrialLabel,
  MARKETING_DISCLAIMER,
} from "@/lib/site";

export function Hero() {
  const { data: session, status } = useSession();
  const [hint, setHint] = useState<ReturningUserHint | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHint(loadReturningUserHint());
    touchReturningVisit();
    setReady(true);
  }, []);

  const isAuthed = status === "authenticated" && Boolean(session?.user);
  const isReturning = !isAuthed && Boolean(hint?.email);
  const displayName = session?.user?.name
    ? firstName(session.user.name)
    : hint
      ? firstName(hint.name, hint.email)
      : null;

  let headline: ReactNode;
  let subline: string;
  let urgency: string | null = null;

  if (isAuthed && displayName) {
    headline = (
      <>
        Keep going,{" "}
        <span className="aee-display-accent-vibrant">{displayName}.</span>
      </>
    );
    subline =
      "Your adaptive study path, streaks, and weak-area insights are waiting.";
    urgency = "Pick up where you left off — every session counts.";
  } else if (isReturning && displayName) {
    headline = (
      <>
        Welcome back,{" "}
        <span className="aee-display-accent-vibrant">{displayName}.</span>
      </>
    );
    subline = "Your progress is saved. Log in to keep building exam-day confidence.";
    urgency = "Your study streak and weak areas are ready when you are.";
  } else {
    headline = (
      <>
        Pass the{" "}
        <span className="aee-display-accent-vibrant">First Time.</span>
      </>
    );
    subline =
      "Adaptive practice that targets what you miss — so you walk in prepared, not guessing.";
    urgency = `${formatTrialIntroPrice()} ${formatTrialLabel()} · Full access · Cancel anytime`;
  }

  return (
    <section
      className="aee-hero aee-hero-vibrant aee-hero-impact relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="aee-hero-vibrant-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--1 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--2 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-16">
          <header className="text-center lg:text-left">
            <p className="aee-hero-exam-pill aee-reveal mx-auto lg:mx-0">
              <Sparkles className="h-3 w-3" aria-hidden />
              NCLEX · USMLE · NAPLEX
            </p>

            <h1
              id="hero-heading"
              className="aee-display-mega aee-display-impact aee-reveal aee-reveal-delay-1 mt-5"
            >
              {headline}
            </h1>

            <p className="aee-hero-tagline aee-reveal aee-reveal-delay-2 mx-auto mt-4 max-w-lg lg:mx-0">
              {subline}
            </p>

            {ready && (
              <div className="aee-reveal aee-reveal-delay-3 mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
                {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="aee-btn-hero-xl group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                    >
                      Go to dashboard
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                    <Link
                      href="/study/practice"
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center sm:w-auto"
                    >
                      Practice exams
                    </Link>
                  </>
                ) : isReturning ? (
                  <>
                    <LoginModalTrigger
                      callbackUrl="/dashboard"
                      className="aee-btn-hero-xl aee-btn-hero-returning group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                    >
                      <LogIn className="h-5 w-5" aria-hidden />
                      Log in to dashboard
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </LoginModalTrigger>
                    <Link
                      href="/signup?plan=trial"
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center sm:w-auto"
                    >
                      New here? Start {formatTrialLabel()}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup?plan=trial"
                      className="aee-btn-hero-xl group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                      data-promo-entry
                    >
                      Start {formatTrialLabel()} — {formatTrialIntroPrice()}
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                    <LoginModalTrigger
                      callbackUrl="/dashboard"
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                    >
                      <LogIn className="h-4 w-4" aria-hidden />
                      Log in
                    </LoginModalTrigger>
                  </>
                )}
              </div>
            )}

            {urgency && (
              <p className="aee-hero-urgency aee-reveal aee-reveal-delay-4 mt-4">
                {urgency}
              </p>
            )}

            {!isAuthed && (
              <LiveBankStats className="aee-reveal aee-reveal-delay-5 mt-8 max-w-md mx-auto lg:mx-0" />
            )}

            {!isAuthed && (
              <p className="aee-reveal aee-reveal-delay-5 mt-4 text-[0.6875rem] leading-relaxed text-slate-400">
                {MARKETING_DISCLAIMER}
              </p>
            )}
          </header>

          <div className="aee-reveal aee-reveal-delay-2 mx-auto w-full max-w-[460px] lg:mx-0 lg:max-w-none">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
