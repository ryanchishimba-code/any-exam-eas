"use client";

import "@/styles/auth-focus.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { TrialFeatureShortcuts } from "@/components/dashboard/TrialFeatureShortcuts";
import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatSignupTrialScope } from "@/lib/site";
import {
  approvedTrialOfferLine,
  trialDayCaption,
  trialProgressPct,
  trialUrgencyMessage,
  trialUrgencyTone,
} from "@/lib/auth/trial-welcome-math";

type TrialWelcomeScreenProps = {
  daysRemaining: number;
  trialDays?: number;
  userName?: string | null;
  userEmail?: string | null;
  /** Show the verify-to-start-trial direction (post-signup). */
  showVerifyPrompt?: boolean;
  /** When true, verify is required before study access. */
  verifyRequired?: boolean;
  onDismiss: () => void;
};

export function TrialWelcomeScreen({
  daysRemaining,
  trialDays = TRIAL_DAYS,
  userName,
  userEmail,
  showVerifyPrompt = false,
  verifyRequired = false,
  onDismiss,
}: TrialWelcomeScreenProps) {
  const name = userName ? firstName(userName) : null;
  const tone = trialUrgencyTone(daysRemaining, trialDays);
  const progressPct = trialProgressPct(daysRemaining, trialDays);
  const offer = approvedTrialOfferLine();

  if (showVerifyPrompt) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        className="aee-youre-in-overlay"
        data-tour-block="true"
      >
        <div className="aee-youre-in-panel">
          <p className="text-sm font-semibold tracking-[-0.01em] text-[#0f766e]">Trial active</p>
          <h2 id="youre-in-heading" className="aee-youre-in-title">
            You&apos;re in.
          </h2>
          <p className="mt-4 text-[0.9375rem] font-semibold text-[#0f172a]" data-testid="trial-offer">
            {offer}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#334155]">
            {formatSignupTrialScope()}
          </p>
          <div className="mt-8">
            <VerifyEmailPrompt email={userEmail} required={verifyRequired} compact />
          </div>
          <button type="button" className="aee-auth-submit" onClick={onDismiss}>
            Show me around
          </button>
          <p className="mt-3 text-sm leading-relaxed text-[#334155]">
            A short tour of Today, the question bank, and readiness. You can leave it anytime.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="aee-trial-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      aria-labelledby="trial-welcome-heading"
    >
      <div className="aee-trial-dashboard-glow" aria-hidden />

      <div className="aee-trial-dashboard-header">
        <span className="aee-trial-dashboard-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Trial active
        </span>
        <h2 id="trial-welcome-heading" className="aee-trial-dashboard-title">
          {name ? `Welcome, ${name}` : "Welcome"}
        </h2>
        <p className="aee-trial-dashboard-lead">
          Your study tools are ready — practice exams, drug review, and analytics when you are.
        </p>
        <p className="aee-trial-dashboard-offer" data-testid="trial-offer">
          {offer}
        </p>
      </div>

      <div className={`aee-trial-dashboard-countdown aee-trial-dashboard-countdown--${tone}`}>
        <div className="aee-trial-dashboard-countdown-main">
          <p className="aee-trial-dashboard-countdown-number">{daysRemaining}</p>
          <div>
            <p className="aee-trial-dashboard-countdown-label">
              day{daysRemaining === 1 ? "" : "s"} remaining
            </p>
            <p className="aee-trial-dashboard-countdown-hint" data-testid="trial-urgency">
              {trialUrgencyMessage(daysRemaining, trialDays)}
            </p>
          </div>
        </div>

        <div className="aee-trial-dashboard-progress" aria-hidden>
          <div
            className="aee-trial-dashboard-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="aee-trial-dashboard-progress-caption" data-testid="trial-day-caption">
          {trialDayCaption(daysRemaining, trialDays)}
        </p>
      </div>

      <p className="aee-trial-dashboard-quick-label">Jump in</p>
      <TrialFeatureShortcuts variant="cards" onNavigate={onDismiss} />

      <div className="aee-trial-dashboard-footer">
        <Link href="/study-hub" className="aee-trial-dashboard-secondary" onClick={onDismiss}>
          Browse study hub
        </Link>
        <button type="button" className="aee-trial-dashboard-skip" onClick={onDismiss}>
          Continue to Study Hub
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </motion.section>
  );
}
