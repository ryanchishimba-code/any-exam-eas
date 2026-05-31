"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FEEDBACK_CATEGORIES } from "@/lib/feedback/types";
import { InlineError } from "@/components/ui/StatusMessage";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
          className={`h-10 w-10 rounded-lg text-lg transition-colors ${
            n <= value
              ? "bg-amber-400/20 text-amber-600"
              : "bg-black/[0.04] text-black/30 hover:text-amber-500"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function FeedbackForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message, rating }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");

      setSuccess(true);
      setMessage("");
      setCategory("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="a11y-banner a11y-banner--success flex-col items-center rounded-2xl p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto" aria-hidden />
        <p className="mt-3 text-lg font-semibold">Thank you</p>
        <p className="mt-2 text-sm">
          Your feedback was received. We read every submission and use it to improve Any Exam Easy.
        </p>
        <Button
          type="button"
          className="mt-6"
          variant="secondary"
          onClick={() => setSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="apple-label">Name (optional)</span>
          <input
            className="apple-input mt-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={120}
          />
        </label>
        <label className="block text-sm">
          <span className="apple-label">Email (optional)</span>
          <input
            type="email"
            className="apple-input mt-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={254}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="apple-label">Category</span>
        <select
          className="apple-input mt-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a category…
          </option>
          {FEEDBACK_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="apple-label">Rating</span>
        <div className="mt-2">
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>

      <label className="block text-sm">
        <span className="apple-label">Message</span>
        <textarea
          className="apple-input mt-2 min-h-[140px] w-full resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={5000}
          placeholder="Tell us what worked well or what we should improve…"
        />
      </label>

      {error && <InlineError>{error}</InlineError>}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : "Submit feedback"}
      </Button>
    </form>
  );
}
