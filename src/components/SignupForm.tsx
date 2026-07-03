"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { LegalCheckbox } from "./LegalCheckbox";
import { Button } from "./ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SocialLoginButton } from "@/components/social/SocialLoginButton";
import { InlineError } from "@/components/ui/StatusMessage";
import { AuthLoadingOverlay } from "@/components/ui/AuthLoadingOverlay";
import { MARKETING_DISCLAIMER, SIGNUP_PAYMENT_REQUIRED_NOTE } from "@/lib/site";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import type { BillingInterval } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import {
  checkPassword,
  isPasswordValid,
  passwordError,
  passwordRequirements,
} from "@/lib/validators/password-policy";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import {
  defaultBirthDatePreview,
  defaultExamDatePreview,
  eighteenYearsAgoIso,
  oldestBirthDateIso,
  todayIso,
} from "@/lib/edtech/exam-date-utils";
import { ExamDatePicker } from "@/components/edtech/ExamDatePicker";
import {
  fetchAuthHealthWarning,
  messageFromUnknownAuthError,
  resolveSignInFailure,
} from "@/lib/auth-client";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";
import { markTrialWelcomePending } from "@/lib/client/trial-welcome";
import { analytics } from "@/lib/analytics";

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function SignupForm({
  initialPlan = "",
  initialPromo = "",
  initialInterval = "yearly",
  initialTier = "pro",
  initialExam = "",
}: {
  initialPlan?: SignupPlan | "";
  initialPromo?: string;
  initialInterval?: BillingInterval;
  initialTier?: SubscriptionTier;
  initialExam?: ExamSlug | "";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState(() => defaultBirthDatePreview());
  const [examSlug, setExamSlug] = useState<ExamSlug | "">(initialExam);
  const [testDate, setTestDate] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Plan, tier, and billing interval are chosen at checkout (after the account
  // exists). Registration always starts the free trial unless the visitor
  // explicitly arrived from a "subscribe now" link.
  const plan: SignupPlan = initialPlan === "subscribe" ? "subscribe" : "trial";

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const linkedinEnabled = process.env.NEXT_PUBLIC_LINKEDIN_AUTH_ENABLED === "true";

  // Mirror the shared password policy so users get instant feedback instead of
  // a rejected round-trip.
  const passwordChecks = checkPassword(password);
  const passwordValid = isPasswordValid(password);

  // Step 1 collects the account; step 2 collects the exam + consent. Final
  // submit still enforces everything server-side, so this only gates perceived
  // length — it never relaxes validation.
  const step1Valid =
    name.trim().length > 0 && email.trim().length > 0 && passwordValid && dob.length > 0;

  function goToExamStep() {
    if (!step1Valid) {
      setError("Add your name, email, a valid password, and date of birth to continue.");
      return;
    }
    setError("");
    setStep(2);
  }

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
    const hint = loadReturningUserHint();
    if (hint?.email) setEmail(hint.email);
    if (hint?.name) setName(hint.name);
  }, []);

  useEffect(() => {
    if (initialExam) setExamSlug(initialExam);
  }, [initialExam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Enter key on a step-1 field should advance, not submit.
    if (step === 1) {
      goToExamStep();
      return;
    }

    if (!examSlug) {
      setError("Choose the exam you're preparing for to continue.");
      return;
    }

    const pwError = passwordError(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          password,
          dateOfBirth: dob,
          acceptedTerms: accepted,
          plan,
          tier: initialTier,
          interval: initialInterval,
          examSlug,
          testDate: testDate || undefined,
          promoCode: initialPromo.trim() || undefined,
        }),
      });
      const text = await res.text();
      let data: { error?: string; plan?: SignupPlan } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Registration returned an unexpected response (server may be missing DATABASE_URL on Vercel)."
        );
      }
      if (!res.ok) throw new Error(data.error ?? "Registration failed");

      const signInRes = await signIn("credentials", {
        email: trimmedEmail,
        password: password.trim(),
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(resolveSignInFailure(signInRes));
      }

      saveReturningUserHint({
        email: trimmedEmail,
        name: name.trim(),
        lastMethod: "email",
      });

      analytics.signupCompleted(
        {
          plan,
          tier: initialTier,
          interval: initialInterval,
          exam_slug: examSlug,
        },
        { persist: false }
      );

      const promoQs = initialPromo.trim()
        ? `&promo=${encodeURIComponent(initialPromo.trim())}`
        : "";

      if (plan === "subscribe") {
        window.location.href = `/checkout?plan=subscribe&interval=${initialInterval}&tier=${initialTier}${promoQs}`;
      } else {
        markTrialWelcomePending(TRIAL_DAYS);
        const examQs = examSlug ? `exam=${examSlug}&` : "";
        window.location.href = `/select-exam?${examQs}welcome=trial`;
      }
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  const trialHighlights = [
    `${TRIAL_LIFETIME_QUESTIONS} practice questions across every exam bank during your trial`,
    "No payment method required — your trial starts instantly",
    "Upgrade anytime for unlimited questions and rich explanations",
  ];

  const today = useMemo(() => todayIso(), []);
  const examDatePreview = useMemo(() => defaultExamDatePreview(today), [today]);
  const birthMin = useMemo(() => oldestBirthDateIso(today), [today]);
  const birthMax = useMemo(() => eighteenYearsAgoIso(today), [today]);

  return (
    <form onSubmit={handleSubmit} noValidate className="relative w-full space-y-6">
      <AuthLoadingOverlay
        show={loading}
        message="Creating your account…"
        className="rounded-2xl"
      />
      {plan === "trial" && (
        <div className="rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] p-5">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Start your {TRIAL_DAYS}-day free trial
          </p>
          <ul className="mt-3 space-y-2">
            {trialHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}

      <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Sign up progress">
        <li
          className={`rounded-full px-2.5 py-1 transition-colors ${
            step === 1
              ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
              : "text-[var(--color-ink-muted)]"
          }`}
        >
          1. Your account
        </li>
        <li aria-hidden className="text-[var(--color-ink-muted)]">›</li>
        <li
          className={`rounded-full px-2.5 py-1 transition-colors ${
            step === 2
              ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
              : "text-[var(--color-ink-muted)]"
          }`}
        >
          2. Your exam
        </li>
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div key="signup-step-1" {...stepMotion} className="space-y-6">
          {(googleEnabled || linkedinEnabled) && !configWarning && (
            <div className="space-y-4">
              {googleEnabled && (
                <GoogleSignInButton
                  large
                  onClick={() => {
                    const trimmedEmail = email.trim();
                    if (trimmedEmail) {
                      saveReturningUserHint({
                        email: trimmedEmail,
                        name: name.trim() || undefined,
                        lastMethod: "google",
                      });
                    }
                  }}
                />
              )}
              <SocialLoginButton
                provider="linkedin"
                large
                onClick={() => {
                  const trimmedEmail = email.trim();
                  if (trimmedEmail) {
                    saveReturningUserHint({
                      email: trimmedEmail,
                      name: name.trim() || undefined,
                      lastMethod: "linkedin",
                    });
                  }
                }}
              />
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/[0.06]" />
                </div>
                <p className="relative mx-auto w-fit bg-[var(--color-surface-elevated)] px-3 text-xs font-medium text-[var(--color-ink-muted)]">
                  or sign up with email
                </p>
              </div>
            </div>
          )}

          <fieldset className="space-y-4" disabled={loading}>
            <input
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="apple-input"
            />
            <input
              required
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => rememberEmail(e.target.value, { name: name.trim() || undefined })}
              className="apple-input"
            />
            <div>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={10}
                  autoComplete="new-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apple-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {passwordRequirements.map((req) => {
                    const ok = passwordChecks[req.id];
                    return (
                      <li
                        key={req.id}
                        className={`flex items-center gap-1 text-[0.6875rem] ${
                          ok
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 shrink-0 ${ok ? "opacity-100" : "opacity-30"}`}
                          aria-hidden
                        />
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div>
              <label id="signup-dob-label" className="apple-label">
                Date of birth (18+ required)
              </label>
              <div className="mt-2" aria-labelledby="signup-dob-label">
                <ExamDatePicker
                  id="signup-dob"
                  value={dob}
                  minDate={birthMin}
                  maxDate={birthMax}
                  ariaLabel="Date of birth"
                  variant="compact"
                  onChange={setDob}
                />
              </div>
            </div>
          </fieldset>

          {error && <InlineError>{error}</InlineError>}

          <Button
            type="button"
            onClick={goToExamStep}
            disabled={loading || !step1Valid || !!configWarning}
            className="w-full"
          >
            Continue
          </Button>

          <MemberLoginLink className="text-center" showEmailHint />
          </motion.div>
        ) : (
          <motion.div key="signup-step-2" {...stepMotion} className="space-y-6">
          <fieldset className="space-y-3" disabled={loading}>
            <legend className="apple-label">Which exam are you preparing for?</legend>
            <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
              We&apos;ll open your dashboard to this exam. You can switch anytime later.
            </p>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {EXAM_SLUGS.map((slug) => {
                const exam = EXAM_CATALOG[slug];
                const selected = examSlug === slug;
                return (
                  <button
                    key={slug}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setExamSlug(slug)}
                    className={`flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                      selected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] ring-2 ring-[var(--color-accent)]/15"
                        : "border-black/[0.08] bg-[var(--color-surface-elevated)] hover:border-black/[0.12]"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">
                        {exam.shortName}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.6875rem] text-[var(--color-ink-muted)]">
                        {exam.name}
                      </span>
                    </span>
                    {selected && (
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {examSlug && (
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label id="signup-test-date-label" className="apple-label">
                    When&apos;s your test?{" "}
                    <span className="font-normal text-[var(--color-ink-muted)]">(optional)</span>
                  </label>
                  {testDate ? (
                    <button
                      type="button"
                      onClick={() => setTestDate("")}
                      className="text-[0.6875rem] font-semibold text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                    >
                      Skip for now
                    </button>
                  ) : null}
                </div>
                <div className="mt-2" aria-labelledby="signup-test-date-label">
                  <ExamDatePicker
                    id="signup-test-date"
                    value={testDate || examDatePreview}
                    minDate={today}
                    variant="compact"
                    onChange={setTestDate}
                  />
                </div>
              </div>
            )}
          </fieldset>

          <LegalCheckbox checked={accepted} onChange={setAccepted} />

          {error && <InlineError>{error}</InlineError>}

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={loading || !accepted || !examSlug || !passwordValid || !!configWarning}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Creating your account…
                </>
              ) : plan === "trial" ? (
                `Start my ${TRIAL_DAYS}-day free trial`
              ) : (
                "Create my account"
              )}
            </Button>
            <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
              {plan === "trial"
                ? SIGNUP_PAYMENT_REQUIRED_NOTE
                : "Next: choose your plan and enter payment securely."}
            </p>
            {!examSlug ? (
              <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
                Pick the exam you&apos;re preparing for above to continue.
              </p>
            ) : !accepted ? (
              <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
                Accept the terms above to continue.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setStep(1);
            }}
            className="mx-auto block text-xs font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            ← Back to account details
          </button>

          <p className="text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
            {LEGAL_DISCLAIMERS.ageRequirement} {MARKETING_DISCLAIMER}
          </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
