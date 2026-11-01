"use client";

import { useState, type FormEvent } from "react";
import { DAILY_LEAD_CONSENT_COPY } from "@/lib/marketing/daily-lead-copy";

type SaveResponse = {
  ok?: boolean;
  status?: "pending" | "confirmed" | "unsubscribed";
  confirmationSent?: boolean;
};

/** Optional daily-question email. Confirmation is required before any question is sent. */
export function DailyInboxCapture({ examSlug }: { examSlug?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending" || status === "done") return;
    setStatus("pending");
    setNote("");
    try {
      const res = await fetch("/api/daily/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, examSlug }),
      });
      const data = (await res.json().catch(() => ({}))) as SaveResponse;
      if (!res.ok || !data.ok) {
        setStatus("error");
        setNote("Could not save that email. Try again.");
        return;
      }
      setStatus("done");
      if (data.status === "confirmed") {
        setNote("This address is already confirmed. You can unsubscribe from a daily question email.");
        return;
      }
      setNote(
        data.confirmationSent
          ? "Check your inbox to confirm. We will not send a question until you do."
          : "Saved as unconfirmed. We could not send the confirmation email just now, and we will not send a question until you confirm."
      );
    } catch {
      setStatus("error");
      setNote("Could not save that email. Try again.");
    }
  }

  return (
    <form className="aee-qotd-hub__inbox aee-qotd-trial__inbox" onSubmit={onSubmit}>
      <label htmlFor={examSlug ? `daily-inbox-email-${examSlug}` : "daily-inbox-email"}>
        Email me the daily question
      </label>
      <p className="aee-qotd-trial__note">{DAILY_LEAD_CONSENT_COPY}</p>
      <div className="aee-qotd-trial__inbox-row">
        <input
          id={examSlug ? `daily-inbox-email-${examSlug}` : "daily-inbox-email"}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          value={email}
          disabled={status === "pending" || status === "done"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") {
              setStatus("idle");
              setNote("");
            }
          }}
        />
        <button type="submit" disabled={status === "pending" || status === "done"}>
          {status === "pending" ? "Saving…" : status === "done" ? "Saved" : "Send confirmation"}
        </button>
      </div>
      <p className="aee-qotd-trial__note" role="status">
        {note}
      </p>
    </form>
  );
}
