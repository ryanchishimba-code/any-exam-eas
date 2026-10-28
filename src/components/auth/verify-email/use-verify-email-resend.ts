"use client";

import { useCallback, useEffect, useState } from "react";

export const VERIFY_EMAIL_RESEND_COOLDOWN_SEC = 60;

export function useVerifyEmailResend() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = window.setInterval(() => {
      setCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownSec]);

  const resend = useCallback(async () => {
    if (cooldownSec > 0) return;
    setLoading(true);
    setMessage(null);
    setMessageKind(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (res.ok) {
        setMessage(data.message ?? "Verification email sent. Check your inbox.");
        setMessageKind("success");
        setCooldownSec(VERIFY_EMAIL_RESEND_COOLDOWN_SEC);
      } else {
        setMessage(data.error ?? data.message ?? "Could not send email.");
        setMessageKind("error");
      }
    } catch {
      setMessage("Could not send email. Try again in a moment.");
      setMessageKind("error");
    } finally {
      setLoading(false);
    }
  }, [cooldownSec]);

  return { message, messageKind, loading, cooldownSec, resend };
}
