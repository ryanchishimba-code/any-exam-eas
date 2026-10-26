"use client";

import { useState, type FormEvent } from "react";

/** One-line daily inbox capture. Rendered on the server so it does not pop in. */
export function DailyInboxCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending" || status === "done") return;
    setStatus("pending");
    try {
      const res = await fetch("/api/daily/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const buttonLabel = status === "done" ? "Subscribed" : "Subscribe";

  return (
    <form className="aee-daily-inbox" onSubmit={onSubmit}>
      <label htmlFor="daily-inbox-email">Get today&apos;s question in your inbox</label>
      <input
        id="daily-inbox-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={email}
        disabled={status === "pending" || status === "done"}
        onChange={(event) => {
          setEmail(event.target.value);
          if (status === "error") setStatus("idle");
        }}
      />
      <button type="submit" disabled={status === "pending" || status === "done"}>
        {buttonLabel}
      </button>
      <p
        className={`aee-daily-inbox__status${status === "error" ? " is-error" : ""}`}
        role="status"
      >
        {status === "done" ? "Subscribed." : status === "error" ? "Could not subscribe. Try again." : ""}
      </p>
    </form>
  );
}
