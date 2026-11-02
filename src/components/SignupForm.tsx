"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Check, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";
import { LegalCheckbox } from "./LegalCheckbox";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SocialLoginButton } from "@/components/social/SocialLoginButton";
import { AuthLoadingOverlay } from "@/components/ui/AuthLoadingOverlay";
import {
  signupStepStatus,
  signupSubscribeCheckoutPath,
  signupTrialDestination,
} from "@/lib/auth/signup-intent";
import { TRIAL_CTA_LABEL } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
import type { BillingInterval } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import {
  checkPassword,
  isPasswordValid,
  PASSWORD_MIN_LENGTH,
  passwordError,
  passwordRequirements,
} from "@/lib/validators/password-policy";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { defaultExamDatePreview, todayIso } from "@/lib/edtech/exam-date-utils";
import { ExamDatePicker } from "@/components/edtech/ExamDatePicker";
import {
  fetchAuthHealthWarning,
  messageFromUnknownAuthError,
  resolveSignInFailure,
} from "@/lib/auth-client";
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";
import { markTrialWelcomePending } from "@/lib/client/trial-welcome";
import { analytics } from "@/lib/analytics";
import {
  VERCEL_FUNNEL_EVENTS,
  funnelPropsFromAttribution,
  trackVercelFunnel,
} from "@/lib/analytics/vercel-funnel";
import { isAppleAuthButtonEnabled, isGoogleAuthButtonEnabled } from "@/lib/auth/oauth-buttons";
import { readClientFirstTouch } from "@/lib/marketing/first-touch-client";
import { mergeFirstTouch } from "@/lib/marketing/first-touch";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm({
  plan,
  onPlanChange,
  initialPromo = "",
  initialPassCode = "",
  initialInterval = "monthly",
  initialTier = "pro",
  initialExam = "",
  attribution,
}: {
  plan: SignupPlan;
  onPlanChange: (plan: SignupPlan) => void;
  initialPromo?: string;
  initialPassCode?: string;
  initialInterval?: BillingInterval;
  initialTier?: SubscriptionTier;
  initialExam?: ExamSlug | "";
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}) {
  const examLocked = Boolean(initialExam);
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [examSlug, setExamSlug] = useState<ExamSlug | "">(initialExam);
  const [testDate, setTestDate] = useState("");
  const [showTestDate, setShowTestDate] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [passOpen, setPassOpen] = useState(Boolean(initialPassCode.trim()));
  const [passCode, setPassCode] = useState(initialPassCode.trim());
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [examMessage, setExamMessage] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const googleEnabled = isGoogleAuthButtonEnabled();
  const appleEnabled = isAppleAuthButtonEnabled();
  const linkedinEnabled = process.env.NEXT_PUBLIC_LINKEDIN_AUTH_ENABLED === "true";
  const socialEnabled = googleEnabled || appleEnabled || linkedinEnabled;

  const subscribeCheckoutPath = signupSubscribeCheckoutPath({
    interval: initialInterval,
    tier: initialTier,
    promo: initialPromo.trim(),
  });
  const oauthCallbackUrl = plan === "subscribe" ? subscribeCheckoutPath : "/dashboard";

  const passwordChecks = checkPassword(password);
  const passwordValid = isPasswordValid(password);

  useEffect(() => {
    setReady(true);
    fetchAuthHealthWarning().then(setConfigWarning);
    const hint = loadReturningUserHint();
    if (hint?.email) setEmail(hint.email);
    if (hint?.name) {
      const parts = hint.name.trim().split(/\s+/);
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
  }, []);

  useEffect(() => {
    if (initialExam) setExamSlug(initialExam);
  }, [initialExam]);

  const today = useMemo(() => todayIso(), []);
  const examDatePreview = useMemo(() => defaultExamDatePreview(today), [today]);
  const lockedExam = examLocked && examSlug ? EXAM_CATALOG[examSlug] : null;

  function emailProblem(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "Enter your email.";
    if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address.";
    return "";
  }

  function validateAccount(): boolean {
    const nextEmail = emailProblem(email);
    const nextPassword = passwordError(password) ?? "";
    setEmailMessage(nextEmail);
    setPasswordMessage(nextPassword);
    return !nextEmail && !nextPassword;
  }

  function validateProfile(): boolean {
    const missingName = !firstName.trim() || !lastName.trim();
    setNameMessage(missingName ? "Enter your first and last name." : "");
    setExamMessage(examSlug ? "" : "Choose the exam you're preparing for.");
    if (!accepted) setError("Accept the terms to continue.");
    else setError("");
    return Boolean(firstName.trim() && lastName.trim() && examSlug && accepted);
  }

  function focusExam(slug: ExamSlug) {
    setExamSlug(slug);
    setExamMessage("");
    window.requestAnimationFrame(() => {
      document.getElementById(`signup-exam-${slug}`)?.focus();
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!validateAccount()) return;
      setStep(2);
      window.requestAnimationFrame(() => {
        document.getElementById("signup-first-name")?.focus();
      });
      return;
    }

    if (!validateAccount() || !validateProfile()) {
      if (!passwordValid || emailProblem(email)) setStep(1);
      return;
    }

    setLoading(true);

    try {
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const trimmedEmail = email.trim();
      const fullName = `${trimmedFirst} ${trimmedLast}`;
      const touch = mergeFirstTouch(readClientFirstTouch(), {
        utmSource: attribution?.utmSource,
        utmMedium: attribution?.utmMedium,
        utmCampaign: attribution?.utmCampaign,
      });
      const funnelProps = funnelPropsFromAttribution(touch);
      trackVercelFunnel(VERCEL_FUNNEL_EVENTS.SIGNUP_SUBMIT, { plan, ...funnelProps });
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedFirst,
          lastName: trimmedLast,
          email: trimmedEmail,
          password,
          acceptedTerms: accepted,
          plan,
          tier: initialTier,
          interval: initialInterval,
          examSlug,
          testDate: testDate || undefined,
          promoCode: initialPromo.trim() || undefined,
          passCode: passCode.trim() || undefined,
          utm_source: touch.utmSource,
          utm_medium: touch.utmMedium,
          utm_campaign: touch.utmCampaign,
          referrer: touch.referrer,
        }),
      });
      const text = await res.text();
      let data: { error?: string; plan?: SignupPlan | "pass"; passRedeemed?: boolean } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Registration returned an unexpected response (server may be missing DATABASE_URL on Vercel)."
        );
      }
      if (!res.ok) {
        const message = data.error ?? "Registration failed";
        if (/pass code|free pass/i.test(message)) {
          setPassOpen(true);
          setStep(1);
        }
        throw new Error(message);
      }

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
        name: fullName,
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
      trackVercelFunnel(VERCEL_FUNNEL_EVENTS.SIGNUP_SUCCESS, { plan, ...funnelProps });
      if (plan === "trial" && !data.passRedeemed) {
        trackVercelFunnel(VERCEL_FUNNEL_EVENTS.TRIAL_START, { plan: "trial", ...funnelProps });
      }

      if (data.passRedeemed) {
        window.location.href = examSlug ? `/dashboard?verify=1` : `/select-exam?verify=1`;
      } else if (plan === "subscribe") {
        window.location.href = subscribeCheckoutPath;
      } else {
        markTrialWelcomePending(TRIAL_DAYS);
        window.location.href = signupTrialDestination(examSlug);
      }
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  const existingAccountError = /already exists|already used a free trial/i.test(error);
  const stepStatus = signupStepStatus(step);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative"
      data-signup-plan={plan}
      data-signup-step={step}
      data-checkout-path={subscribeCheckoutPath}
    >
      <AuthLoadingOverlay show={loading} message="Creating your account…" className="rounded-2xl" />

      <div className="aee-auth-progress" aria-hidden="true">
        <span data-on="true" />
        <span data-on={step === 2 ? "true" : "false"} />
      </div>
      <p className="aee-auth-step-status" aria-live="polite">
        <span className="aee-auth-step-count">{stepStatus.count}</span>
        <span className="aee-auth-step-sep"> · </span>
        <span className="aee-auth-step-name">{stepStatus.name}</span>
      </p>

      {configWarning ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {configWarning}
        </p>
      ) : null}

      {step === 1 ? (
        <div className="aee-auth-step" data-testid="signup-step-account">
          {socialEnabled && !configWarning ? (
            <div className="mb-4 space-y-3">
              {googleEnabled ? (
                <GoogleSignInButton
                  large
                  board={examSlug || undefined}
                  callbackUrl={oauthCallbackUrl}
                  onClick={() => {
                    const trimmedEmail = email.trim();
                    if (trimmedEmail) {
                      saveReturningUserHint({
                        email: trimmedEmail,
                        name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined,
                        lastMethod: "google",
                      });
                    }
                  }}
                />
              ) : null}
              {appleEnabled ? (
                <AppleSignInButton
                  large
                  board={examSlug || undefined}
                  callbackUrl={oauthCallbackUrl}
                  onClick={() => {
                    const trimmedEmail = email.trim();
                    if (trimmedEmail) {
                      saveReturningUserHint({
                        email: trimmedEmail,
                        name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined,
                        lastMethod: "apple",
                      });
                    }
                  }}
                />
              ) : null}
              <SocialLoginButton
                provider="linkedin"
                large
                board={examSlug || undefined}
                callbackUrl={oauthCallbackUrl}
                onClick={() => {
                  const trimmedEmail = email.trim();
                  if (trimmedEmail) {
                    saveReturningUserHint({
                      email: trimmedEmail,
                      name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined,
                      lastMethod: "linkedin",
                    });
                  }
                }}
              />
              <p className="text-center text-sm text-[#334155]">or use email</p>
            </div>
          ) : null}

          <div className="aee-auth-fields">
            <div>
              <label htmlFor="signup-email" className="aee-auth-label">
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                required
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="name@email.com"
                value={email}
                aria-invalid={emailMessage ? true : undefined}
                aria-describedby={emailMessage ? emailErrorId : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailMessage) setEmailMessage("");
                }}
                onBlur={(e) => {
                  const problem = emailProblem(e.target.value);
                  if (e.target.value.trim()) setEmailMessage(problem);
                  rememberEmail(e.target.value, {
                    name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined,
                  });
                }}
                className="apple-input"
              />
              {emailMessage ? (
                <p id={emailErrorId} className="aee-auth-error" role="alert">
                  {emailMessage}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="signup-password" className="aee-auth-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={PASSWORD_MIN_LENGTH}
                  autoComplete="new-password"
                  placeholder={passwordRequirements[0]!.label}
                  value={password}
                  aria-invalid={passwordMessage ? true : undefined}
                  aria-describedby={
                    passwordMessage ? `${passwordErrorId} signup-password-reqs` : "signup-password-reqs"
                  }
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordMessage) setPasswordMessage("");
                  }}
                  className="apple-input pr-14"
                />
                <button
                  type="button"
                  data-overlay="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#334155]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
              {passwordMessage ? (
                <p id={passwordErrorId} className="aee-auth-error" role="alert">
                  {passwordMessage}
                </p>
              ) : null}
              <ul id="signup-password-reqs" className="mt-2 flex flex-wrap gap-x-4 gap-y-1" aria-live="polite">
                {passwordRequirements.map((req) => {
                  const ok = password.length > 0 && passwordChecks[req.id];
                  return (
                    <li
                      key={req.id}
                      className={`flex items-center gap-1 text-xs ${ok ? "text-[#0f766e]" : "text-[#334155]"}`}
                    >
                      <Check className={`h-3 w-3 shrink-0 ${ok ? "opacity-100" : "opacity-40"}`} aria-hidden />
                      {req.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            {passOpen ? (
              <div>
                <label htmlFor="signup-pass-code" className="aee-auth-label">
                  Pass code
                </label>
                <input
                  id="signup-pass-code"
                  name="passCode"
                  data-testid="signup-pass-code"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={40}
                  placeholder="RN-7K4Q-2M"
                  value={passCode}
                  onChange={(e) => setPassCode(e.target.value.toUpperCase())}
                  className="apple-input uppercase tracking-wide"
                />
                <p className="mt-1 text-sm text-[#334155]">
                  30 days of Pro. No card. Each code works once.
                </p>
              </div>
            ) : (
              <button type="button" className="aee-auth-text-btn" onClick={() => setPassOpen(true)}>
                Have a pass code?
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="aee-auth-step" data-testid="signup-step-profile">
          <div className="aee-auth-fields">
            <div className="aee-auth-names">
              <div>
                <label htmlFor="signup-first-name" className="aee-auth-label">
                  First name
                </label>
                <input
                  id="signup-first-name"
                  name="given-name"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  aria-invalid={nameMessage && !firstName.trim() ? true : undefined}
                  aria-describedby={nameMessage ? "signup-name-error" : undefined}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (nameMessage) setNameMessage("");
                  }}
                  className="apple-input"
                />
              </div>
              <div>
                <label htmlFor="signup-last-name" className="aee-auth-label">
                  Last name
                </label>
                <input
                  id="signup-last-name"
                  name="family-name"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  aria-invalid={nameMessage && !lastName.trim() ? true : undefined}
                  aria-describedby={nameMessage ? "signup-name-error" : undefined}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (nameMessage) setNameMessage("");
                  }}
                  className="apple-input"
                />
              </div>
            </div>
            {nameMessage ? (
              <p id="signup-name-error" className="aee-auth-error -mt-2" role="alert">
                {nameMessage}
              </p>
            ) : null}

            <fieldset className="space-y-2" disabled={loading}>
              <legend className="aee-auth-label">
                {lockedExam ? "Your exam" : "Exam"}
              </legend>
              {lockedExam ? (
                <div
                  className="aee-auth-exam"
                  role="status"
                  aria-live="polite"
                  data-selected="true"
                >
                  <span className="min-w-0">
                    <span className="aee-auth-exam-name">Preparing for {lockedExam.shortName}</span>
                    {lockedExam.name !== lockedExam.shortName ? (
                      <span className="aee-auth-exam-full">{lockedExam.name}</span>
                    ) : null}
                  </span>
                  <Check className="h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden />
                </div>
              ) : (
                <div
                  className="aee-exam-grid aee-auth-exam-grid"
                  role="radiogroup"
                  aria-label="Exam you are preparing for"
                  aria-invalid={examMessage ? true : undefined}
                  aria-describedby={examMessage ? "signup-exam-error" : undefined}
                >
                  {EXAM_SLUGS.map((slug, index) => {
                    const exam = EXAM_CATALOG[slug];
                    const selected = examSlug === slug;
                    return (
                      <button
                        key={slug}
                        id={`signup-exam-${slug}`}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected || (!examSlug && index === 0) ? 0 : -1}
                        onClick={() => {
                          setExamSlug(slug);
                          setExamMessage("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                            return;
                          }
                          event.preventDefault();
                          const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                          const next = EXAM_SLUGS[(index + delta + EXAM_SLUGS.length) % EXAM_SLUGS.length]!;
                          focusExam(next);
                        }}
                        className="aee-auth-exam"
                      >
                        <span className="min-w-0">
                          <span className="aee-auth-exam-name">{exam.shortName}</span>
                          {exam.name !== exam.shortName ? (
                            <span className="aee-auth-exam-full">{exam.name}</span>
                          ) : null}
                        </span>
                        {selected ? <Check className="h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden /> : null}
                      </button>
                    );
                  })}
                </div>
              )}
              {examMessage ? (
                <p id="signup-exam-error" className="aee-auth-error" role="alert">
                  {examMessage}
                </p>
              ) : null}
            </fieldset>

            {examSlug ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowTestDate((v) => !v)}
                  className="aee-auth-text-btn"
                  aria-expanded={showTestDate}
                >
                  <ChevronDown
                    className={`mr-1 h-3.5 w-3.5 transition-transform ${showTestDate ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                  {showTestDate || testDate ? "Test date" : "Add test date (optional)"}
                </button>
                {showTestDate || testDate ? (
                  <div className="mt-2">
                    <ExamDatePicker
                      id="signup-test-date"
                      value={testDate || examDatePreview}
                      minDate={today}
                      variant="compact"
                      ariaLabel="Test date"
                      onChange={(value) => {
                        setTestDate(value);
                        setShowTestDate(true);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            <p className="text-sm text-[#334155]">You must be 18 or older.</p>
            <LegalCheckbox
              checked={accepted}
              onChange={(value) => {
                setAccepted(value);
                if (value) setError("");
              }}
            />
          </div>
        </div>
      )}

      {error ? (
        <p className="aee-auth-error mt-3" role="alert">
          {error}
        </p>
      ) : null}
      {existingAccountError ? (
        <p className="mt-3 text-sm text-[#334155]">
          You already have an account.{" "}
          <Link href="/login" className="font-semibold text-[#0f766e] underline">
            Log in
          </Link>
        </p>
      ) : null}

      <button type="submit" className="aee-auth-submit" disabled={loading || !ready}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Creating your account…
          </>
        ) : step === 1 ? (
          "Continue"
        ) : passCode.trim() ? (
          "Create account"
        ) : plan === "trial" ? (
          TRIAL_CTA_LABEL
        ) : (
          "Create account & subscribe"
        )}
      </button>

      <p className="mt-3 text-center text-sm text-[#334155]">
        {step === 2 ? (
          <button type="button" className="aee-auth-text-btn" onClick={() => setStep(1)}>
            Back
          </button>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#0f766e] underline">
              Log in
            </Link>
          </>
        )}
      </p>
      <p className="mt-1 text-center">
        <button
          type="button"
          className="aee-auth-text-btn"
          onClick={() => onPlanChange(plan === "trial" ? "subscribe" : "trial")}
        >
          {plan === "trial" ? "Skip trial — subscribe to Pro" : "Start with the free trial instead"}
        </button>
      </p>
    </form>
  );
}
