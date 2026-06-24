"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, Heart, Loader2 } from "lucide-react";
import type { PublicSocialPost } from "@/lib/social/types";
import { SocialShareBar } from "@/components/social/SocialShareBar";

/**
 * Community wall: official brand posts + approved user-generated content.
 *
 * "Real-time" is implemented with lightweight polling (default 30s) — the
 * pragmatic choice for Neon serverless, which has no client push channel. The
 * feed endpoint is edge-cached for a few seconds so polling stays cheap.
 */
type CommunityFeedProps = {
  examType?: string;
  limit?: number;
  /** Poll interval in ms; set 0 to disable polling. */
  pollMs?: number;
  className?: string;
};

const EXAM_FILTERS = ["All", "NCLEX", "USMLE", "NAPLEX", "PANCE", "AANP FNP", "NPTE-PT"];

export function CommunityFeed({
  examType,
  limit = 30,
  pollMs = 30_000,
  className = "",
}: CommunityFeedProps) {
  const [filter, setFilter] = useState<string>(examType ?? "All");
  const [posts, setPosts] = useState<PublicSocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = new URLSearchParams({ limit: String(limit) });
    if (filter && filter !== "All") params.set("examType", filter);

    try {
      const res = await fetch(`/api/social/feed?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items: PublicSocialPost[] };
      setPosts(data.items ?? []);
    } catch {
      /* ignore aborted/failed polls */
    } finally {
      setLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(() => void load(), pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  const like = useCallback(
    async (id: string) => {
      if (liked.has(id)) return;
      setLiked((prev) => new Set(prev).add(id));
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
      try {
        await fetch(`/api/social/posts/${id}/like`, { method: "POST" });
      } catch {
        /* optimistic — ignore failure */
      }
    },
    [liked]
  );

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap gap-2">
        {EXAM_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f
                ? "bg-[var(--color-accent)] text-white"
                : "border border-black/[0.08] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] dark:border-white/[0.1]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[var(--color-ink-muted)]">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className="ml-2 text-sm">Loading the community wall…</span>
        </div>
      ) : posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-ink-muted)]">
          No posts yet. Be the first to share a study win!
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] p-5 shadow-sm dark:border-white/[0.08]"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-xs font-semibold text-[var(--color-accent)]">
                  {post.authorInitials ?? "AE"}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate text-sm font-semibold text-[var(--color-ink)]">
                    {post.authorName ?? "AnyExamEasy"}
                    {post.kind === "official" && (
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-label="Official" />
                    )}
                  </p>
                  {post.examType && (
                    <p className="text-[0.6875rem] text-[var(--color-ink-muted)]">{post.examType}</p>
                  )}
                </div>
              </div>

              <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink)]">
                {post.content}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => void like(post.id)}
                  aria-pressed={liked.has(post.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition ${
                    liked.has(post.id)
                      ? "text-rose-500"
                      : "text-[var(--color-ink-muted)] hover:text-rose-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked.has(post.id) ? "fill-current" : ""}`} aria-hidden />
                  {post.likes}
                </button>
                <SocialShareBar
                  entityType="post"
                  entityId={post.id}
                  text={post.content.slice(0, 120)}
                  size="sm"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
