"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FEEDBACK_CATEGORIES,
  type FeedbackListItem,
  type FeedbackSort,
} from "@/lib/feedback/types";
import { InlineError } from "@/components/ui/StatusMessage";

export default function FeedbackInbox() {
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<FeedbackSort>("newest");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("sort", sort);

    try {
      const res = await fetch(`/api/internal/feedback?${params}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [category, status, q, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleResolved(id: string, resolved: boolean) {
    const res = await fetch(`/api/internal/feedback/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    if (!res.ok) return;
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this feedback permanently?")) return;
    const res = await fetch(`/api/internal/feedback/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return;
    void load();
  }

  const categoryLabel = (id: string) =>
    FEEDBACK_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="text-sm">
          <span className="apple-label">Category</span>
          <select
            className="apple-input mt-1 block min-w-[160px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {FEEDBACK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="apple-label">Status</span>
          <select
            className="apple-input mt-1 block min-w-[120px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <label className="text-sm flex-1 min-w-[200px]">
          <span className="apple-label">Search</span>
          <input
            className="apple-input mt-1 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQ(search.trim())}
            placeholder="Message, name, or email…"
          />
        </label>
        <label className="text-sm">
          <span className="apple-label">Sort</span>
          <select
            className="apple-input mt-1 block min-w-[160px]"
            value={sort}
            onChange={(e) => setSort(e.target.value as FeedbackSort)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="rating_high">Highest rating</option>
            <option value="rating_low">Lowest rating</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white"
          onClick={() => setQ(search.trim())}
        >
          Apply
        </button>
      </div>

      <p className="text-sm text-black/60">
        {loading ? "Loading…" : `${total} submission${total === 1 ? "" : "s"}`}
      </p>

      {error && <InlineError>{error}</InlineError>}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/15 bg-white/60 p-12 text-center text-sm text-black/50">
          No feedback matches your filters.
        </div>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border bg-white p-5 ${
              item.status === "resolved"
                ? "border-black/5 opacity-80"
                : "border-black/10"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-black/[0.06] px-2 py-0.5">
                    {categoryLabel(item.category)}
                  </span>
                  <span className="text-amber-600">{"★".repeat(item.rating)}</span>
                  <span
                    className={
                      item.status === "resolved"
                        ? "font-medium text-blue-800"
                        : "font-medium text-sky-800"
                    }
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">
                  {item.name || "Anonymous"}
                  {item.email ? (
                    <span className="font-normal text-black/50"> · {item.email}</span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-black/45">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/[0.03]"
                  onClick={() =>
                    void toggleResolved(item.id, item.status !== "resolved")
                  }
                >
                  {item.status === "resolved" ? "Reopen" : "Mark resolved"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-orange-300 px-3 py-1 text-xs font-medium text-orange-900 hover:bg-orange-50"
                  onClick={() => void remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-black/80">
              {item.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
