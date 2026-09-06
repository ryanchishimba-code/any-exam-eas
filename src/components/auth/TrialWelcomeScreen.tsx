"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { TrialFeatureShortcuts } from "@/components/dashboard/TrialFeatureShortcuts";
import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";

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

function urgencyTone(daysRemaining: number): "calm" | "moderate" | "urgent" {
  if (daysRemaining <= 3) return "urgent";
  if (daysRemaining <= 7) return "moderate";
  return "calm";
}

function urgencyMessage(daysRemaining: number): string {
  if (daysRemaining <= 1) return "Last day — make it count!";
  if (daysRemaining <= 3) return "Trial ending soon — dive in today.";
  if (daysRemaining <= 7) return "You're halfway through — keep the momentum.";
  return "Full access unlocked — start whenever you're ready.";
}

export function TrialWelcomeScreen({
  daysRemaining,
  trialDays = 14,
  userName,
  userEmail,
  showVerifyPrompt = false,
  verifyRequired = false,
  onDismiss,
}: TrialWelcomeScreenProps) {
  const name = userName ? firstName(userName) : null;
  const tone = urgencyTone(daysRemaining);
  const elapsed = Math.max(0, Math.min(trialDays, trialDays - daysRemaining));
  const progressPct = Math.round((elapsed / trialDays) * 100);

  if (showVerifyPrompt && verifyRequired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto w-full max-w-lg"
      >
        <VerifyEmailPrompt email={userEmail} required />
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

      {showVerifyPrompt ? (
        <div className="relative mb-5">
          <VerifyEmailPrompt email={userEmail} />
        </div>
      ) : null}

      <div className="aee-trial-dashboard-header">
        <span className="aee-trial-dashboard-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Trial active
        </span>
        <h2 id="trial-welcome-heading" className="aee-trial-dashboard-title">
          {name ? `Welcome, ${name}` : "Welcome"}
        </h2>
        <p className="aee-trial-dashboard-lead">
          {showVerifyPrompt
            ? "After you verify, your trial is ready — practice exams, drug review, and analytics."
            : "Your trial is active — practice exams, drug review, and analytics are ready when you are."}
        </p>
      </div>

      <div className={`aee-trial-dashboard-countdown aee-trial-dashboard-countdown--${tone}`}>
        <div className="aee-trial-dashboard-countdown-main">
          <p className="aee-trial-dashboard-countdown-number">{daysRemaining}</p>
          <div>
            <p className="aee-trial-dashboard-countdown-label">
              day{daysRemaining === 1 ? "" : "s"} remaining
            </p>
            <p className="aee-trial-dashboard-countdown-hint">{urgencyMessage(daysRemaining)}</p>
          </div>
        </div>

        <div className="aee-trial-dashboard-progress" aria-hidden>
          <div
            className="aee-trial-dashboard-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="aee-trial-dashboard-progress-caption">
          Day {elapsed + 1} of {trialDays} · {progressPct}% of trial used
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
