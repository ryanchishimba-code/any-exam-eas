"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LandingTrialTrust } from "@/components/home/LandingTrialTrust";
import {
  firstName,
  loadReturningUserHint,
  touchReturningVisit,
  type ReturningUserHint,
} from "@/lib/client/returning-user";
import {
  formatTrialCtaLabel,
  formatTrialHeroOffer,
  formatTrialLabel,
  MARKETING_DISCLAIMER,
} from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const LandingAppMockup = dynamic(
  () => import("@/components/home/LandingAppMockup").then((m) => m.LandingAppMockup),
  { ssr: false, loading: () => <div className="aee-landing-app-mockup min-h-[280px] sm:min-h-[320px]" aria-hidden /> }
);

export function Hero() {
  const { data: session, status } = useSession();
  const [hint, setHint] = useState<ReturningUserHint | null>(null);

  useEffect(() => {
    setHint(loadReturningUserHint());
    touchReturningVisit();
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
      "Your dashboard, question bank, full-exam simulator, and weak-area analytics are ready.";
    urgency = "Pick up where you left off — every session builds familiarity with board-style items.";
  } else if (isReturning && displayName) {
    headline = (
      <>
        Welcome back,{" "}
        <span className="aee-display-accent-vibrant">{displayName}.</span>
      </>
    );
    subline = "Your progress is saved. Log in to resume adaptive practice across your exams.";
    urgency = "Your study path and recent sessions are waiting in the Study Hub.";
  } else {
    headline = (
      <>
        One subscription.{" "}
        <span className="aee-display-accent-vibrant">Four licensing exams.</span>
      </>
    );
    subline =
      "NCLEX, USMLE Step 2 CK, NAPLEX, and MPJE — adaptive question banks, OER-backed rationales, Top 500 drug flashcards, and timed full-exam practice in one affordable plan.";
    urgency = formatTrialHeroOffer();
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
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
          <header className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            {!isAuthed && !isReturning ? (
              <BrandLogo variant="hero" className="aee-reveal mx-auto mb-2 lg:mx-0" priority />
            ) : null}
            <p className="aee-hero-exam-pill aee-reveal lg:mx-0 mx-auto">
              <Sparkles className="h-3 w-3" aria-hidden />
              NCLEX · USMLE · NAPLEX · MPJE
            </p>

            <h1
              id="hero-heading"
              className="aee-display-mega aee-display-impact aee-reveal aee-reveal-delay-1 mt-4"
            >
              {headline}
            </h1>

            <p className="aee-hero-tagline aee-reveal aee-reveal-delay-2 mx-auto mt-3 max-w-lg lg:mx-0">
              {subline}
            </p>

            <div className="aee-reveal aee-reveal-delay-3 mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
                {isAuthed ? (
                  <>
                    <Link
                      href={ROUTES.dashboard}
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
                      callbackUrl={ROUTES.dashboard}
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
                      {formatTrialCtaLabel()}
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                    <LoginModalTrigger
                      callbackUrl={ROUTES.dashboard}
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                    >
                      <LogIn className="h-4 w-4" aria-hidden />
                      Log in
                    </LoginModalTrigger>
                  </>
                )}
            </div>

            {urgency && (
              <p className="aee-hero-urgency aee-reveal aee-reveal-delay-4 mt-4">{urgency}</p>
            )}

            {!isAuthed && !isReturning && (
              <LandingTrialTrust className="aee-reveal aee-reveal-delay-4 mt-4" />
            )}

            {!isAuthed && (
              <p className="aee-reveal aee-reveal-delay-4 mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-slate-400 lg:mx-0">
                {MARKETING_DISCLAIMER}
              </p>
            )}
          </header>

          <div className="aee-reveal aee-reveal-delay-2 mx-auto hidden w-full max-w-[380px] md:block lg:max-w-none">
            <LandingAppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
