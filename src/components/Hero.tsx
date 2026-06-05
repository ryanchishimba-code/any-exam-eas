"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import {
  firstName,
  loadReturningUserHint,
  touchReturningVisit,
  type ReturningUserHint,
} from "@/lib/client/returning-user";
import { formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

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
      "Adaptive AI, OER-backed rationales, and 130K+ questions across NCLEX, USMLE, NAPLEX, and MPJE.";
    urgency = `${formatTrialIntroPrice()} ${formatTrialLabel()} · Cancel anytime`;
  }

  return (
    <section
      className="aee-hero aee-hero-vibrant aee-hero-compact relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="aee-hero-vibrant-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--1 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--2 pointer-events-none absolute" aria-hidden />
      <div className="aee-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <header>
            <p className="aee-hero-exam-pill aee-reveal mx-auto">
              <Sparkles className="h-3 w-3" aria-hidden />
              NCLEX · USMLE · NAPLEX · MPJE
            </p>

            <h1
              id="hero-heading"
              className="aee-display-mega aee-display-impact aee-reveal aee-reveal-delay-1 mt-4"
            >
              {headline}
            </h1>

            <p className="aee-hero-tagline aee-reveal aee-reveal-delay-2 mx-auto mt-3 max-w-md">
              {subline}
            </p>

            {ready && (
              <div className="aee-reveal aee-reveal-delay-3 mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                {isAuthed ? (
                  <>
                    <Link
                      href="/study-hub"
                      className="aee-btn-hero-xl group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                    >
                      Open Study Hub
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                    <Link
                      href="/study/drugs300"
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center sm:w-auto"
                    >
                      Top 500 Drugs
                    </Link>
                  </>
                ) : isReturning ? (
                  <>
                    <LoginModalTrigger
                      callbackUrl="/study-hub"
                      className="aee-btn-hero-xl aee-btn-hero-returning group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                    >
                      <LogIn className="h-5 w-5" aria-hidden />
                      Log in to Study Hub
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
                      callbackUrl="/study-hub"
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

          </header>
        </div>
      </div>
    </section>
  );
}
