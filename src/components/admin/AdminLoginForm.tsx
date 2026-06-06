"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { messageForSignInError } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { completeLoginFlow } from "@/lib/client/post-login";
import { InlineError } from "@/components/ui/StatusMessage";

type Props = {
  callbackUrl?: string;
};

export function AdminLoginForm({ callbackUrl = "/admin" }: Props) {
  const router = useRouter();
  const safeCallback = sanitizeCallbackUrl(callbackUrl, "/admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError("Enter your admin email and password.");
      setLoading(false);
      return;
    }

    try {
      const precheck = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, password }),
      });
      const preData = await precheck.json().catch(() => ({}));
      if (!precheck.ok) {
        setError(preData?.error ?? "Invalid email or password.");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email: trimmed,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError(res?.error ? messageForSignInError(res.error) : "Sign-in failed.");
        setLoading(false);
        return;
      }

      await completeLoginFlow({
        router,
        callbackUrl: safeCallback,
        email: trimmed,
        method: "email",
      });
    } catch {
      setError("Could not sign in. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin sign in</h1>
          <p className="text-sm text-slate-500">Authorized administrators only</p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Email</span>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ring-cyan-600 focus:ring-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ring-cyan-600 focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <InlineError>{error}</InlineError>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in to admin"}
        </button>
      </form>
    </div>
  );
}
