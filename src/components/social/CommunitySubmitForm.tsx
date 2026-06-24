"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";
import { EXAM_TAGS } from "@/lib/social/validators";
import { InlineError } from "@/components/ui/StatusMessage";

/**
 * Authenticated community post composer. Submitted posts enter the moderation
 * queue (approved = false) and only appear on the wall once a moderator approves.
 * Renders a sign-in prompt for logged-out visitors.
 */
const MAX = 500;

export function CommunitySubmitForm({ className = "" }: { className?: string }) {
  const { status } = useSession();
  const [content, setContent] = useState("");
  const [examType, setExamType] = useState<string>("");
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");

  if (status !== "authenticated") {
    return (
      <div
        className={`rounded-2xl border border-dashed border-black/[0.1] bg-[var(--color-surface-elevated)] p-5 text-center text-sm text-[var(--color-ink-muted)] dark:border-white/[0.12] ${className}`}
      >
        Sign in to share a study tip or win with the community.
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (content.trim().length < 10) {
      setError("Share a little more detail (at least 10 characters).");
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          examType: examType || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Could not submit your post.");
        setState("idle");
        return;
      }
      setContent("");
      setExamType("");
      setState("done");
    } catch {
      setError("Network error — please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div
        className={`rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-5 text-center text-sm text-[var(--color-ink)] ${className}`}
      >
        Thanks! Your post is awaiting review and will appear once approved.{" "}
        <button
          type="button"
          className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
          onClick={() => setState("idle")}
        >
          Share another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] p-5 shadow-sm dark:border-white/[0.08] ${className}`}
    >
      <label htmlFor="community-post" className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
        Share a study tip or win
      </label>
      <textarea
        id="community-post"
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX))}
        rows={3}
        placeholder="e.g. Passed NCLEX! The Roadmap weak-area drills were a game changer…"
        className="w-full resize-none rounded-xl border border-black/[0.1] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 dark:border-white/[0.12]"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          aria-label="Exam tag"
          className="rounded-lg border border-black/[0.1] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-[var(--color-ink)] dark:border-white/[0.12]"
        >
          <option value="">No exam tag</option>
          {EXAM_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] tabular-nums text-[var(--color-ink-muted)]">
            {content.length}/{MAX}
          </span>
          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" aria-hidden />
            {state === "submitting" ? "Submitting…" : "Post"}
          </button>
        </div>
      </div>
      {error && <InlineError className="mt-3">{error}</InlineError>}
    </form>
  );
}
