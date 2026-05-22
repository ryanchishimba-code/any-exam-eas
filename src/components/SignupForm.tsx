"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LegalCheckbox } from "./LegalCheckbox";
import { Button } from "./ui/Button";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import {
  fetchAuthHealthWarning,
  messageForSignInError,
  messageFromUnknownAuthError,
} from "@/lib/auth-client";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [configWarning, setConfigWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthHealthWarning().then(setConfigWarning);
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
        }),
      });
      const text = await res.text();
      let data: { error?: string } = {};
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

      router.push("/dashboard");
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="apple-card mt-10 space-y-5 p-8 md:p-10">
      {configWarning && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {configWarning}
        </p>
      )}
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
        {LEGAL_DISCLAIMERS.ageRequirement}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading || !accepted || !!configWarning} className="w-full">
        {loading ? "Creating account…" : "Start 7-day free trial"}
      </Button>

      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
