"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Check } from "lucide-react";
import { LegalCheckbox } from "./LegalCheckbox";
import { Button } from "./ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { MARKETING_DISCLAIMER } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import type { BillingInterval } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import {
  fetchAuthHealthWarning,
  messageFromUnknownAuthError,
  resolveSignInFailure,
} from "@/lib/auth-client";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";

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
  const [dob, setDob] = useState("");
  const [examSlug, setExamSlug] = useState<ExamSlug | "">(initialExam);
  const [testDate, setTestDate] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Plan, tier, and billing interval are chosen at checkout (after the account
  // exists). Registration always starts the free trial unless the visitor
  // explicitly arrived from a "subscribe now" link.
  const plan: SignupPlan = initialPlan === "subscribe" ? "subscribe" : "trial";

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

    if (!examSlug) {
      setError("Choose the exam you're preparing for to continue.");
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

      const promoQs = initialPromo.trim()
        ? `&promo=${encodeURIComponent(initialPromo.trim())}`
        : "";

      window.location.href = `/checkout?plan=${plan}&interval=${initialInterval}&tier=${initialTier}${promoQs}`;
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  const trialHighlights = [
    "Full access to every question bank and full-length exam",
    "No charge today — pick your plan and payment after you sign up",
    "Cancel anytime before your trial ends",
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="apple-card mt-10 space-y-6 p-8 md:p-10">
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
          <div className="pt-1">
            <label htmlFor="signup-test-date" className="apple-label">
              When&apos;s your test? <span className="font-normal text-[var(--color-ink-muted)]">(optional)</span>
            </label>
            <input
              id="signup-test-date"
              type="date"
              value={testDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setTestDate(e.target.value)}
              className="apple-input mt-2"
            />
            <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
              We&apos;ll show a countdown on your dashboard. You can set or change this anytime.
            </p>
          </div>
        )}
      </fieldset>

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
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="apple-input"
        />
        <div>
          <label className="apple-label">Date of birth (18+ required)</label>
          <input
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="apple-input mt-2"
          />
        </div>
      </fieldset>

      <LegalCheckbox checked={accepted} onChange={setAccepted} />

      {error && <InlineError>{error}</InlineError>}

      <div className="space-y-2">
        <Button
          type="submit"
          disabled={loading || !accepted || !examSlug || !!configWarning}
          className="w-full"
        >
          {loading
            ? "Creating your account…"
            : plan === "trial"
              ? `Start my ${TRIAL_DAYS}-day free trial`
              : "Create my account"}
        </Button>
        <p className="text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          {plan === "trial"
            ? "Next: choose your plan and add payment. You won't be charged until your trial ends."
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

      <p className="text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.ageRequirement} {MARKETING_DISCLAIMER}
      </p>

      <MemberLoginLink className="text-center" showEmailHint />
    </form>
  );
}
