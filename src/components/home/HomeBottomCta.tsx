"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import {
  firstName,
  loadReturningUserHint,
  type ReturningUserHint,
} from "@/lib/client/returning-user";
import { useUserAccess } from "@/lib/client/use-user-access";
import {
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";

export function HomeBottomCta() {
  const { data: session, status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const [hint, setHint] = useState<ReturningUserHint | null>(null);

  useEffect(() => {
    setHint(loadReturningUserHint());
  }, []);

  const isAuthed = status === "authenticated" && Boolean(session?.user);
  const isReturning = !isAuthed && Boolean(hint?.email);
  const displayName = hint ? firstName(hint.name, hint.email) : null;

  if (accessLoading) return null;

  if (isAuthed && hasPremiumAccess) {
    return (
      <section
        className="aee-bottom-cta relative overflow-hidden text-center"
        aria-labelledby="home-cta-heading"
      >
        <div className="aee-bottom-cta-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[640px] px-5 py-16 sm:px-6 sm:py-20">
          <h2 id="home-cta-heading" className="aee-headline text-white">
            Keep the momentum going.
          </h2>
          <p className="mt-3 text-base text-teal-100/90">
            Every session builds familiarity with the formats you&apos;ll see on exam day.
          </p>
          <Link
            href="/study/practice?mode=adaptive"
            className="aee-btn-hero-xl aee-btn-hero-light group mt-8 inline-flex items-center justify-center gap-2"
          >
            Start adaptive practice
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </section>
    );
  }

  if (isReturning) {
    return (
      <section
        className="aee-bottom-cta relative overflow-hidden text-center"
        aria-labelledby="home-cta-heading"
      >
        <div className="aee-bottom-cta-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-[640px] px-5 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-200">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </p>
          <h2 id="home-cta-heading" className="aee-headline mt-2 text-white">
            Your Study Hub is ready.
          </h2>
          <p className="mt-3 text-base text-teal-100/90">
            Log in to pick up practice exams, drug review, and your progress stats.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <LoginModalTrigger
              callbackUrl="/study-hub"
              className="aee-btn-hero-xl aee-btn-hero-light group inline-flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" aria-hidden />
              Log in to Study Hub
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </LoginModalTrigger>
            <Link
              href="/signup?plan=trial"
              className="aee-btn-hero-ghost aee-btn-hero-ghost-on-dark inline-flex items-center justify-center gap-2"
            >
              New here? Start {formatTrialLabel()}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="aee-bottom-cta relative overflow-hidden text-center"
      aria-labelledby="home-cta-heading"
    >
      <div className="aee-bottom-cta-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[640px] px-5 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-200">
          Start before test day catches up
        </p>
        <h2 id="home-cta-heading" className="aee-headline mt-2 text-white">
          Invest {formatTrialIntroPrice()} in passing the first time.
        </h2>
        <p className="mt-3 text-base text-teal-100/90">
          {formatTrialLabel()} of full access — adaptive practice, progress tracking,
          and 130K+ questions for {formatMonthlyPrice()}/mo after.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/signup?plan=trial"
            className="aee-btn-hero-xl aee-btn-hero-light group inline-flex items-center justify-center gap-2"
          >
            Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <LoginModalTrigger
            callbackUrl="/study-hub"
            className="aee-btn-hero-ghost aee-btn-hero-ghost-on-dark inline-flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Already subscribed? Log in
          </LoginModalTrigger>
        </div>
        <p className="mx-auto mt-6 max-w-sm text-xs text-teal-200/70">
          Join students across NCLEX, USMLE, and NAPLEX who prep smarter — not longer.
        </p>
      </div>
    </section>
  );
}
