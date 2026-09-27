"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Check, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";
import { LegalCheckbox } from "./LegalCheckbox";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SocialLoginButton } from "@/components/social/SocialLoginButton";
import { AuthLoadingOverlay } from "@/components/ui/AuthLoadingOverlay";
import { TRIAL_CTA_LABEL } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
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
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";
import { markTrialWelcomePending } from "@/lib/client/trial-welcome";
import { analytics } from "@/lib/analytics";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm({
  plan,
  onPlanChange,
  initialPromo = "",
  initialInterval = "monthly",
  initialTier = "pro",
  initialExam = "",
}: {
  plan: SignupPlan;
  onPlanChange: (plan: SignupPlan) => void;
  initialPromo?: string;
  initialInterval?: BillingInterval;
  initialTier?: SubscriptionTier;
  initialExam?: ExamSlug | "";
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
  const [dob, setDob] = useState("");
  const [examSlug, setExamSlug] = useState<ExamSlug | "">(initialExam);
  const [testDate, setTestDate] = useState("");
  const [showTestDate, setShowTestDate] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [examMessage, setExamMessage] = useState("");
  const [dobMessage, setDobMessage] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const linkedinEnabled = process.env.NEXT_PUBLIC_LINKEDIN_AUTH_ENABLED === "true";

  const promoQs = initialPromo.trim()
    ? `&promo=${encodeURIComponent(initialPromo.trim())}`
    : "";
  const subscribeCheckoutPath = `/checkout?plan=subscribe&interval=${initialInterval}&tier=${initialTier}${promoQs}`;
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
  const birthMin = useMemo(() => oldestBirthDateIso(today), [today]);
  const birthMax = useMemo(() => eighteenYearsAgoIso(today), [today]);
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
    setDobMessage(dob ? "" : "Enter your date of birth. You must be 18 or older.");
    if (!accepted) setError("Accept the terms to continue.");
    else setError("");
    return Boolean(firstName.trim() && lastName.trim() && examSlug && dob && accepted);
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedFirst,
          lastName: trimmedLast,
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

      if (plan === "subscribe") {
        window.location.href = subscribeCheckoutPath;
      } else {
        markTrialWelcomePending(TRIAL_DAYS);
        window.location.href = examSlug
          ? `/dashboard?welcome=trial&verify=1`
          : `/select-exam?welcome=trial&verify=1`;
      }
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  const existingAccountError = /already exists|already used a free trial/i.test(error);

  return (
    <form onSubmit={handleSubmit} noValidate className="relative">
      <AuthLoadingOverlay show={loading} message="Creating your account…" className="rounded-2xl" />

      <div className="aee-auth-progress" aria-hidden="true">
        <span data-on={step === 1 ? "true" : "false"} />
        <span data-on={step === 2 ? "true" : "false"} />
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step} of 2
      </p>

      {configWarning ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {configWarning}
        </p>
      ) : null}

      {step === 1 ? (
        <div className="aee-auth-step" data-testid="signup-step-account">
          {(googleEnabled || linkedinEnabled) && !configWarning ? (
            <div className="mb-4 space-y-3">
              {googleEnabled ? (
                <GoogleSignInButton
                  large
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
              <SocialLoginButton
                provider="linkedin"
                large
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
                  minLength={10}
                  autoComplete="new-password"
                  placeholder="At least 10 characters"
                  value={password}
                  aria-invalid={passwordMessage ? true : undefined}
                  aria-describedby="signup-password-reqs"
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
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (nameMessage) setNameMessage("");
                  }}
                  className="apple-input"
                />
              </div>
            </div>
            {nameMessage ? (
              <p className="aee-auth-error -mt-2" role="alert">
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
                <p className="aee-auth-error" role="alert">
                  {examMessage}
                </p>
              ) : null}
            </fieldset>

            <div>
              <p id="signup-dob-hint" className="mb-2 text-sm text-[#334155]">
                You must be 18 or older.
              </p>
              <ExamDatePicker
                id="signup-dob"
                value={dob}
                minDate={birthMin}
                maxDate={birthMax}
                ariaLabel="Date of birth"
                variant="compact"
                onChange={(value) => {
                  setDob(value);
                  setDobMessage("");
                }}
              />
              {dobMessage ? (
                <p className="aee-auth-error" role="alert">
                  {dobMessage}
                </p>
              ) : null}
            </div>

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
            Sign in
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
              Sign in
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
          {plan === "trial" ? "Subscribe to Pro instead" : "Start with the free trial instead"}
        </button>
      </p>
    </form>
  );
}
