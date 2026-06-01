"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AppleLink } from "@/components/ui/AppleLink";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LoginPromoGraphic } from "@/components/LoginPromoGraphic";
import { formatTrialIntroPrice, formatTrialLabel, PRACTICE_PROGRESS_LABEL } from "@/lib/site";
import {
  firstName,
  loadReturningUserHint,
  maskEmail,
  saveReturningUserHint,
  touchReturningVisit,
} from "@/lib/client/returning-user";

type WelcomeData = {
  user: { id: string; name?: string | null; email?: string | null };
  hasAccess: boolean;
  headline?: {
    readinessScore: number;
    studyStreakDays: number;
    overallAccuracy: number | null;
    totalAttempts: number;
  } | null;
};

export function WelcomeBackSection() {
  const { data: session, status } = useSession();
  const [hint, setHint] = useState<ReturnType<typeof loadReturningUserHint>>(null);
  const [welcome, setWelcome] = useState<WelcomeData | null>(null);
  const [loadingWelcome, setLoadingWelcome] = useState(false);

  useEffect(() => {
    setHint(loadReturningUserHint());
    touchReturningVisit();
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      setWelcome(null);
      return;
    }

    setLoadingWelcome(true);
    fetch("/api/auth/welcome-back")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: WelcomeData | null) => {
        setWelcome(data);
        if (data?.user.email) {
          saveReturningUserHint({
            email: data.user.email,
            name: data.user.name ?? undefined,
            readinessScore: data.headline?.readinessScore,
            studyStreakDays: data.headline?.studyStreakDays,
          });
        }
      })
      .catch(() => setWelcome(null))
      .finally(() => setLoadingWelcome(false));
  }, [session?.user, status]);

  const displayName = welcome?.user.name
    ? firstName(welcome.user.name)
    : hint
      ? firstName(hint.name, hint.email)
      : null;

  const preferredMethod = hint?.lastMethod;

  return (
    <section
      className="apple-section aee-landing-section border-y border-teal-100/60 bg-white"
      aria-labelledby="welcome-back-heading"
    >
      <div className="mx-auto grid max-w-[980px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center lg:text-left"
        >
          <div className="aee-badge mx-auto lg:mx-0">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Returning students
          </div>

          <h2 id="welcome-back-heading" className="apple-headline mt-4">
            {displayName ? (
              <>
                Good to see you, {displayName}.
              </>
            ) : (
              <>Pick up where you left off.</>
            )}
          </h2>

          <p className="apple-subhead mx-auto mt-4 max-w-md lg:mx-0">
            {session?.user && welcome?.hasAccess && welcome.headline ? (
              <>
                {PRACTICE_PROGRESS_LABEL} {welcome.headline.readinessScore}% (in-app only) ·{" "}
                {welcome.headline.studyStreakDays > 0
                  ? `${welcome.headline.studyStreakDays}-day streak`
                  : `${welcome.headline.totalAttempts} questions answered`}
                {welcome.headline.overallAccuracy != null &&
                  ` · ${Math.round(welcome.headline.overallAccuracy)}% accuracy`}
              </>
            ) : session?.user && !welcome?.hasAccess ? (
              <>Your account is ready — subscribe to unlock your study hub and progress.</>
            ) : hint ? (
              <>
                Sign in as <span className="font-medium text-[var(--color-ink)]">{maskEmail(hint.email)}</span>
                {hint.readinessScore != null && (
                  <> · last {PRACTICE_PROGRESS_LABEL.toLowerCase()} {hint.readinessScore}%</>
                )}
              </>
            ) : (
              <>Secure sign-in. Your exams, streaks, and analytics sync across devices.</>
            )}
          </p>

          {session?.user ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button href={welcome?.hasAccess ? "/study" : "/pricing?paywall=1"}>
                {welcome?.hasAccess ? "Continue studying" : "Complete subscription"}
              </Button>
              <Button href="/dashboard" variant="secondary">
                Open dashboard
              </Button>
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-md space-y-4 text-left lg:mx-0 lg:max-w-none">
              {preferredMethod && (
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Last signed in with{" "}
                  <span className="font-medium capitalize text-[var(--color-ink)]">
                    {preferredMethod === "magic" || preferredMethod === "email"
                      ? "email & password"
                      : preferredMethod === "apple"
                        ? "Google"
                        : preferredMethod}
                  </span>
                </p>
              )}

              <LoginModalTrigger className="login-modal-btn-primary w-full sm:w-auto sm:min-w-[14rem]">
                {displayName ? `Welcome back, ${displayName}` : "Log in"}
              </LoginModalTrigger>

              <p className="text-xs text-[var(--color-ink-muted)]">
                Google · Email & password
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[var(--color-ink-muted)] lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
              Encrypted · Security-first infrastructure
            </span>
            {!session?.user && (
              <>
                <span aria-hidden>·</span>
                <AppleLink href="/forgot-password" className="!text-xs">
                  Forgot Password?
                </AppleLink>
              </>
            )}
          </div>

          {!session?.user && (
            <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
              New here?{" "}
              <AppleLink href="/signup?plan=trial" className="!text-sm">
                Start {formatTrialLabel()} — {formatTrialIntroPrice()}
              </AppleLink>
            </p>
          )}

          {loadingWelcome && session?.user && (
            <p className="mt-4 text-xs text-[var(--color-ink-muted)]">Loading your progress…</p>
          )}
        </motion.div>

        <LoginPromoGraphic />
      </div>
    </section>
  );
}
