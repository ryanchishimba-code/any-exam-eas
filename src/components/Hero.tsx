"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingTrialTrust } from "@/components/home/LandingTrialTrust";
import { TrustBar } from "@/components/home/TrustBar";
import {
  firstName,
  loadReturningUserHint,
  touchReturningVisit,
  type ReturningUserHint,
} from "@/lib/client/returning-user";
import {
  formatLandingHeroSubline,
  formatTrialCtaLabel,
  formatTrialHeroOffer,
  formatTrialLabel,
  MARKETING_DISCLAIMER,
} from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { LandingHeroExamStrip } from "@/components/home/LandingHeroExamStrip";
import { LandingHeroPriceValue } from "@/components/home/LandingHeroPriceValue";
import {
  LANDING_HERO_HEADLINE_QUOTED,
  LANDING_TRIAL_HREF,
} from "@/lib/landing/content";

const LandingAppMockup = dynamic(
  () => import("@/components/home/LandingAppMockup").then((m) => m.LandingAppMockup),
  { ssr: false, loading: () => <div className="aee-landing-app-mockup min-h-[220px] sm:min-h-[260px]" aria-hidden /> }
);

export function Hero({ compareLayout = false }: { compareLayout?: boolean }) {
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
      <span className="aee-display-accent-vibrant">{LANDING_HERO_HEADLINE_QUOTED}</span>
    );
    subline = formatLandingHeroSubline();
    urgency = formatTrialHeroOffer();
  }

  return (
    <section
      className={`aee-hero aee-hero-vibrant aee-hero-compact relative overflow-hidden ${
        compareLayout ? "aee-hero--band" : ""
      }`}
      aria-labelledby="hero-heading"
    >
      {!compareLayout && (
        <>
          <div className="aee-hero-vibrant-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--1 pointer-events-none absolute" aria-hidden />
          <div className="aee-hero-vibrant-orb aee-hero-vibrant-orb--2 pointer-events-none absolute" aria-hidden />
          <div className="aee-hero-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="aee-hero-compare-fade pointer-events-none absolute inset-x-0 bottom-0 z-[3]" aria-hidden />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-0">
        <div
          className={
            compareLayout
              ? "grid items-center gap-6"
              : "grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-8"
          }
        >
          <header className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            {!isAuthed && !isReturning ? (
              <LandingHeroExamStrip className="mx-auto justify-center lg:mx-0 lg:justify-start" />
            ) : null}

            <h1
              id="hero-heading"
              className="aee-display-mega aee-display-impact aee-reveal aee-reveal-delay-1 mt-3"
            >
              {headline}
            </h1>

            <p className="aee-hero-tagline aee-reveal aee-reveal-delay-2 mx-auto mt-3 max-w-lg lg:mx-0">
              {subline}
            </p>

            {!isAuthed && !isReturning && !compareLayout && (
              <LandingHeroPriceValue className="aee-reveal aee-reveal-delay-2 mx-auto mt-4 lg:mx-0" />
            )}

            <div className="aee-reveal aee-reveal-delay-3 mt-4 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
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
                      href={LANDING_TRIAL_HREF}
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center sm:w-auto"
                    >
                      New here? Start {formatTrialLabel()}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={LANDING_TRIAL_HREF}
                      className="aee-btn-hero-xl group inline-flex w-full items-center justify-center gap-2.5 sm:w-auto"
                      data-promo-entry
                    >
                      {formatTrialCtaLabel()}
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                    <Link
                      href="#ngn-demo"
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center sm:w-auto"
                    >
                      Try free NCLEX demo
                    </Link>
                    <LoginModalTrigger
                      callbackUrl={ROUTES.dashboard}
                      className="aee-btn-hero-ghost inline-flex w-full items-center justify-center gap-2 sm:w-auto sm:border-0 sm:bg-transparent sm:px-2 sm:py-1 sm:text-sm sm:text-slate-500"
                    >
                      <LogIn className="h-4 w-4" aria-hidden />
                      Log in
                    </LoginModalTrigger>
                  </>
                )}
            </div>

            {urgency && (
              <p className={`aee-hero-urgency aee-reveal aee-reveal-delay-4 ${compareLayout ? "mt-3" : "mt-4"}`}>
                {urgency}
              </p>
            )}

            {!isAuthed && !isReturning && !compareLayout && (
              <TrustBar className="aee-reveal aee-reveal-delay-4 mt-3 lg:justify-start" />
            )}

            {!isAuthed && !isReturning && (
              <LandingTrialTrust compact={compareLayout} className="aee-reveal aee-reveal-delay-4 mt-2.5" />
            )}

            {!isAuthed && !compareLayout && (
              <p className="aee-reveal aee-reveal-delay-4 mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-slate-400 lg:mx-0">
                {MARKETING_DISCLAIMER}
              </p>
            )}
          </header>

          {!compareLayout && (
            <div className="aee-reveal aee-reveal-delay-2 mx-auto w-full max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              <LandingAppMockup />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
