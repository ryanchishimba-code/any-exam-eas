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
}: {
  initialPlan?: SignupPlan | "";
  initialPromo?: string;
  initialInterval?: BillingInterval;
  initialTier?: SubscriptionTier;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
          disabled={loading || !accepted || !!configWarning}
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
        {!accepted && (
          <p className="text-center text-[0.6875rem] text-[var(--color-ink-muted)]">
            Accept the terms above to continue.
          </p>
        )}
      </div>

      <p className="text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.ageRequirement} {MARKETING_DISCLAIMER}
      </p>

      <MemberLoginLink className="text-center" showEmailHint />
    </form>
  );
}
