"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LegalCheckbox } from "./LegalCheckbox";
import { Button } from "./ui/Button";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          dateOfBirth: dob,
          acceptedTerms: accepted,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) throw new Error("Account created but sign-in failed");

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="apple-card mt-10 space-y-5 p-8 md:p-10">
      <input
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="apple-input"
      />
      <input
        required
        type="email"
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

      <Button type="submit" disabled={loading || !accepted} className="w-full">
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
