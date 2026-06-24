"use client";

import { useCallback, useState } from "react";
import { CalendarClock, Loader2, Send, Trash2 } from "lucide-react";
import { PUBLISH_PLATFORMS, type PublishPlatform } from "@/lib/social/validators";
import type { ScheduledPostView } from "@/lib/social/publish";

const PLATFORM_LABEL: Record<PublishPlatform, string> = {
  x: "X",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  publishing: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  canceled: "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export function SocialScheduler({
  initialPosts,
  providerConfigured,
}: {
  initialPosts: ScheduledPostView[];
  providerConfigured: boolean;
}) {
  const [posts, setPosts] = useState<ScheduledPostView[]>(initialPosts);
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState<PublishPlatform[]>(["x", "linkedin"]);
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/social/schedule", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { items: ScheduledPostView[] };
      setPosts(data.items ?? []);
    }
  }, []);

  const togglePlatform = (p: PublishPlatform) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const submit = useCallback(
    async (mode: "now" | "schedule") => {
      setError("");
      if (content.trim().length < 10) return setError("Write a little more.");
      if (platforms.length === 0) return setError("Pick at least one channel.");
      if (mode === "schedule" && !when) return setError("Choose a date and time to schedule.");

      setBusy(true);
      try {
        const res = await fetch("/api/admin/social/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            platforms,
            scheduledAt: mode === "schedule" ? new Date(when).toISOString() : undefined,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? "Could not save.");
          return;
        }
        setContent("");
        setWhen("");
        await refresh();
      } finally {
        setBusy(false);
      }
    },
    [content, platforms, when, refresh]
  );

  const act = useCallback(
    async (id: string, action: "cancel" | "publish_now") => {
      await fetch(`/api/admin/social/schedule/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await refresh();
    },
    [refresh]
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
        <CalendarClock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden />
        Publish &amp; schedule to brand channels
      </h2>
      {!providerConfigured && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          Ayrshare isn&apos;t connected yet — set <code>AYRSHARE_API_KEY</code> to go live. Posts you
          create now stay queued and publish automatically once the key is added.
        </p>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 1000))}
        rows={3}
        placeholder="Write a post for X, LinkedIn, and Facebook…"
        className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PUBLISH_PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => togglePlatform(p)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              platforms.includes(p)
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "border border-slate-200 text-slate-600 dark:border-zinc-700 dark:text-zinc-300"
            }`}
          >
            {PLATFORM_LABEL[p]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
        />
        <button
          type="button"
          onClick={() => void submit("schedule")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
        >
          <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Schedule
        </button>
        <button
          type="button"
          onClick={() => void submit("now")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
          Publish now
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}

      {/* Queue */}
      <ul className="mt-5 space-y-2">
        {posts.length === 0 ? (
          <li className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-500">
            No scheduled posts yet.
          </li>
        ) : (
          posts.map((post) => (
            <li
              key={post.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-zinc-800"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-900 dark:text-zinc-100">{post.content}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-zinc-500">
                  <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${STATUS_STYLE[post.status] ?? ""}`}>
                    {post.status}
                  </span>
                  <span>{post.platforms.join(", ")}</span>
                  {post.scheduledAt && <span>· {new Date(post.scheduledAt).toLocaleString()}</span>}
                  {post.error && <span className="text-rose-500">· {post.error}</span>}
                </p>
              </div>
              {post.status !== "published" && post.status !== "canceled" && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void act(post.id, "publish_now")}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Publish now
                  </button>
                  <button
                    type="button"
                    onClick={() => void act(post.id, "cancel")}
                    aria-label="Cancel"
                    className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
