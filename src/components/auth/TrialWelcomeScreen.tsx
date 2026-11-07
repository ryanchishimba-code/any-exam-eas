"use client";

import "@/styles/auth-focus.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { firstName, maskEmail } from "@/lib/client/returning-user";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatSignupTrialScope } from "@/lib/site";
import { firstTenQuestionsHref } from "@/lib/study/first-ten-href";
import { ROUTES } from "@/lib/routes";
import {
  approvedTrialOfferLine,
  trialDayCaption,
  trialUrgencyMessage,
} from "@/lib/auth/trial-welcome-math";
import { VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE } from "@/lib/auth/verify-email-copy";

type TrialWelcomeScreenProps = {
  daysRemaining: number;
  trialDays?: number;
  userName?: string | null;
  userEmail?: string | null;
  /** Show the confirmation-email note. Does not replace the start action. */
  showVerifyPrompt?: boolean;
  /** When true, verify is required before study access. */
  verifyRequired?: boolean;
  /** Overrides the saved exam. Null means the exam is not chosen yet. */
  examSlug?: string | null;
  onDismiss: () => void;
};

export function TrialWelcomeScreen({
  daysRemaining,
  trialDays = TRIAL_DAYS,
  userName,
  userEmail,
  showVerifyPrompt = false,
  verifyRequired = false,
  examSlug: examSlugProp,
  onDismiss,
}: TrialWelcomeScreenProps) {
  const prefs = useAppPreferences();
  const examSlug = examSlugProp === undefined ? prefs.examSlug : examSlugProp;
  const startHref = firstTenQuestionsHref(examSlug);
  const hasExam = Boolean(startHref);
  const name = userName ? firstName(userName) : null;
  const offer = approvedTrialOfferLine();
  const emailLabel = userEmail?.trim() ? maskEmail(userEmail.trim()) : "your email";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      className="aee-youre-in-overlay"
      data-tour-block="true"
      data-verify-required={verifyRequired ? "true" : "false"}
      aria-labelledby="youre-in-heading"
    >
      <div className="aee-youre-in-panel">
        <p className="text-sm font-semibold tracking-[-0.01em] text-[#0f766e]">Trial active</p>
        <h2 id="youre-in-heading" className="aee-youre-in-title">
          {name ? `You're in, ${name}.` : "You're in."}
        </h2>
        <p className="mt-4 text-[0.9375rem] font-semibold text-[#0f172a]" data-testid="trial-offer">
          {offer}
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#334155]">
          {formatSignupTrialScope()} Start with {Math.min(10, TRIAL_LIFETIME_QUESTIONS)}.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#334155]" data-testid="trial-urgency">
          {trialUrgencyMessage(daysRemaining, trialDays)}
        </p>
        <p className="text-sm text-[#64748b]" data-testid="trial-day-caption">
          {trialDayCaption(daysRemaining, trialDays)}
        </p>
        {showVerifyPrompt ? (
          <p className="mt-4 text-sm leading-relaxed text-[#334155]">
            We sent a confirmation link to {emailLabel}. {VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          {hasExam && startHref ? (
            <Link href={startHref} className="aee-auth-submit text-center" onClick={onDismiss}>
              Start 10 questions
            </Link>
          ) : (
            <Link href={ROUTES.selectExam} className="aee-auth-submit text-center" onClick={onDismiss}>
              Choose your exam
            </Link>
          )}
          {hasExam ? (
            <button type="button" className="aee-trial-dashboard-skip" onClick={onDismiss}>
              Show me around
            </button>
          ) : null}
        </div>
        {hasExam ? (
          <p className="mt-3 text-sm leading-relaxed text-[#334155]">
            A short tour of Today, the question bank, and readiness. You can leave it anytime.
          </p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-[#334155]">
            The tour starts after you choose an exam.
          </p>
        )}
      </div>
    </motion.div>
  );
}
