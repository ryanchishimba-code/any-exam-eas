"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { LegalCheckbox } from "./LegalCheckbox";
import { PlanChoice } from "./PlanChoice";
import { Button } from "./ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { MARKETING_DISCLAIMER, formatMonthlyPrice, formatTrialIntroPrice } from "@/lib/site";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import type { SignupPlan } from "@/lib/validators/auth";
import {
  fetchAuthHealthWarning,
  messageForSignInError,
  messageFromUnknownAuthError,
} from "@/lib/auth-client";
import { MemberLoginLink } from "@/components/auth/MemberLoginLink";
import { loadReturningUserHint, rememberEmail, saveReturningUserHint } from "@/lib/client/returning-user";

export function SignupForm({ initialPlan = "" }: { initialPlan?: SignupPlan | "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [plan, setPlan] = useState<SignupPlan | "">(initialPlan);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
    const hint = loadReturningUserHint();
    if (hint?.email) setEmail(hint.email);
    if (hint?.name) setName(hint.name);
  }, []);

  useEffect(() => {
    if (initialPlan) setPlan(initialPlan);
  }, [initialPlan]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!plan) {
      setError("Choose a trial or subscription plan to continue.");
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
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(messageForSignInError(signInRes.error));
      }

      saveReturningUserHint({
        email: trimmedEmail,
        name: name.trim(),
        lastMethod: "email",
      });

      window.location.href = `/checkout?plan=${plan}`;
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  const submitLabel =
    plan === "subscribe"
      ? `Subscribe — ${formatMonthlyPrice()}/mo`
      : plan === "trial"
        ? `Start trial — ${formatTrialIntroPrice()}`
        : "Create account & subscribe";

  return (
    <form onSubmit={handleSubmit} noValidate className="apple-card mt-10 space-y-5 p-8 md:p-10">
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        {MARKETING_DISCLAIMER}
      </p>

      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}

      <PlanChoice value={plan} onChange={setPlan} disabled={loading} />

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

      <LegalCheckbox checked={accepted} onChange={setAccepted} />

      <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.ageRequirement} All exam features require an active subscription.
      </p>

      {error && <InlineError>{error}</InlineError>}

      <Button
        type="submit"
        disabled={loading || !accepted || !plan || !!configWarning}
        className="w-full"
      >
        {loading ? "Please wait…" : submitLabel}
      </Button>

      <MemberLoginLink callbackUrl="/dashboard" className="text-center" showEmailHint />
    </form>
  );
}
