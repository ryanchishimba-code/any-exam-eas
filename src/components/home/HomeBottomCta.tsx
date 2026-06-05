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
        <div className="relative mx-auto max-w-[640px] px-5 py-10 sm:px-6 sm:py-12">
          <h2 id="home-cta-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Keep the momentum going.
          </h2>
          <p className="mt-2 text-sm text-teal-100/90">
            Every session builds exam-day confidence.
          </p>
          <Link
            href="/study/practice?mode=timed"
            className="aee-btn-hero-xl aee-btn-hero-light group mt-6 inline-flex items-center justify-center gap-2"
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
        <div className="relative mx-auto max-w-[640px] px-5 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-200">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </p>
          <h2 id="home-cta-heading" className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your Study Hub is ready.
          </h2>
          <p className="mt-2 text-sm text-teal-100/90">
            Log in to resume practice, drug review, and progress.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
      <div className="relative mx-auto max-w-[640px] px-5 py-10 sm:px-6 sm:py-12">
        <h2 id="home-cta-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pass the first time — start for {formatTrialIntroPrice()}.
        </h2>
        <p className="mt-2 text-sm text-teal-100/90">
          {formatTrialLabel()} · All four exams · Adaptive AI · Top 500 Drugs · then{" "}
          {formatMonthlyPrice()}/mo
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
      </div>
    </section>
  );
}
