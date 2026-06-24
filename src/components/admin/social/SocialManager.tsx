"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Megaphone, Trash2, X } from "lucide-react";
import type { ModerationSocialPost, SocialEngagementSummary } from "@/lib/social/types";
import type { SocialAccountStatus } from "@/lib/social/accounts";
import { EXAM_TAGS } from "@/lib/social/validators";

type Tab = "pending" | "approved" | "rejected";

type Props = {
  initialSummary: SocialEngagementSummary | null;
  initialPending: ModerationSocialPost[];
  channels: SocialAccountStatus[];
};

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${tone ?? "text-slate-900 dark:text-zinc-50"}`}>
        {value}
      </p>
    </div>
  );
}

export function SocialManager({ initialSummary, initialPending, channels }: Props) {
  const [summary] = useState(initialSummary);
  const [tab, setTab] = useState<Tab>("pending");
  const [posts, setPosts] = useState<ModerationSocialPost[]>(initialPending);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Publish composer
  const [draft, setDraft] = useState("");
  const [draftExam, setDraftExam] = useState("");
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async (which: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social/posts?status=${which}`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { items: ModerationSocialPost[] };
        setPosts(data.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  const moderate = useCallback(
    async (id: string, action: "approve" | "reject" | "delete" | "restore") => {
      setBusyId(id);
      try {
        const res = await fetch(`/api/admin/social/posts/${id}`, {
          method: action === "delete" ? "DELETE" : "PATCH",
          headers: { "Content-Type": "application/json" },
          ...(action === "delete" ? {} : { body: JSON.stringify({ action }) }),
        });
        if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setBusyId(null);
      }
    },
    []
  );

  const publish = useCallback(async () => {
    if (draft.trim().length < 10) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.trim(), examType: draftExam || undefined }),
      });
      if (res.ok) {
        setDraft("");
        setDraftExam("");
        if (tab === "approved") void load("approved");
      }
    } finally {
      setPublishing(false);
    }
  }, [draft, draftExam, tab, load]);

  return (
    <div className="space-y-8">
      {/* Engagement analytics */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
          Engagement (last 30 days)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending review" value={summary?.pendingPosts ?? 0} tone="text-amber-600 dark:text-amber-400" />
          <StatCard label="Approved posts" value={summary?.approvedPosts ?? 0} tone="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Total likes" value={summary?.totalLikes ?? 0} />
          <StatCard label="Shares (30d)" value={summary?.shares.total ?? 0} />
        </div>

        {summary && summary.shares.byPlatform.length > 0 && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Shares by platform</h3>
              <ul className="mt-3 space-y-1.5">
                {summary.shares.byPlatform.map((row) => (
                  <li key={row.platform} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-700 dark:text-zinc-300">{row.platform}</span>
                    <span className="tabular-nums font-medium text-slate-500 dark:text-zinc-400">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Shares by content</h3>
              <ul className="mt-3 space-y-1.5">
                {summary.shares.byEntityType.map((row) => (
                  <li key={row.entityType} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-700 dark:text-zinc-300">{row.entityType}</span>
                    <span className="tabular-nums font-medium text-slate-500 dark:text-zinc-400">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Publish official post */}
      <section className="rounded-xl border border-indigo-200/60 bg-white p-5 dark:border-indigo-500/20 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
          <Megaphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden />
          Publish an official post
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
          Appears on the community wall immediately, badged as official.
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 500))}
          rows={3}
          placeholder="Share an announcement, study tip, or success story…"
          className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <select
            value={draftExam}
            onChange={(e) => setDraftExam(e.target.value)}
            aria-label="Exam tag"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
          >
            <option value="">No exam tag</option>
            {EXAM_TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void publish()}
            disabled={publishing || draft.trim().length < 10}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </section>

      {/* Moderation queue */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400 dark:border-zinc-700 dark:text-zinc-500">
            No {tab} posts.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-900 dark:text-zinc-100">{post.content}</p>
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-zinc-500">
                      {post.authorName ?? "Unknown"} · {post.authorEmail ?? "—"}
                      {post.examType ? ` · ${post.examType}` : ""} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {tab !== "approved" && (
                      <button
                        type="button"
                        disabled={busyId === post.id}
                        onClick={() => void moderate(post.id, "approve")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden /> Approve
                      </button>
                    )}
                    {tab !== "rejected" && (
                      <button
                        type="button"
                        disabled={busyId === post.id}
                        onClick={() => void moderate(post.id, "reject")}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden /> Reject
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => void moderate(post.id, "delete")}
                      aria-label="Delete post"
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Brand channels (Phase 2: Ayrshare publishing/scheduling) */}
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Brand channels</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
            Scheduling — Phase 2 (Ayrshare)
          </span>
        </div>
        {channels.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
            No channels connected yet. Outbound publishing &amp; scheduling to X, LinkedIn, and
            Facebook will be wired through Ayrshare. Tokens are stored encrypted in{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-zinc-800">social_accounts</code>.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {channels.map((c) => (
              <li key={c.platform} className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate-700 dark:text-zinc-300">
                  {c.platform} {c.displayName ? `· ${c.displayName}` : ""}
                </span>
                <span className={c.connected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                  {c.connected ? "Connected" : "Not connected"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
