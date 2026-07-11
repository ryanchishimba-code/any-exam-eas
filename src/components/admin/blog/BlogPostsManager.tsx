"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Eye,
  Pencil,
  Plus,
  Search,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import type { AdminBlogPost } from "@/lib/admin/blog-admin";
import { BLOG_CATEGORIES } from "@/lib/admin/blog-validators";
import { ROUTES } from "@/lib/routes";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogPostsManager() {
  const [items, setItems] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [maxPosts, setMaxPosts] = useState(4);
  const [canCreate, setCanCreate] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status !== "all") params.set("status", status);
      if (category) params.set("category", category);
      const res = await fetch(`/api/admin/blog?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as {
        items?: AdminBlogPost[];
        error?: string;
        activeCount?: number;
        maxPosts?: number;
        canCreate?: boolean;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to load posts.");
      setItems(data.items ?? []);
      setActiveCount(data.activeCount ?? data.items?.length ?? 0);
      setMaxPosts(data.maxPosts ?? 4);
      setCanCreate(data.canCreate ?? (data.activeCount ?? 0) < (data.maxPosts ?? 4));
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [q, status, category]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const allSelected = items.length > 0 && selected.size === items.length;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runBulk(action: "publish" | "unpublish" | "delete") {
    if (selected.size === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selected.size} post(s)?`)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected], action }),
      });
      const data = (await res.json()) as { error?: string; count?: number };
      if (!res.ok) throw new Error(data.error ?? "Bulk action failed.");
      setNotice(`${action} complete (${data.count ?? selected.size}).`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteOne(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      setNotice("Post deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  const categories = useMemo(() => {
    const fromItems = items.map((i) => i.category);
    return [...new Set([...BLOG_CATEGORIES, ...fromItems])];
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
            Blog
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Create SEO-ready posts for study tips, exam guides, and product updates.
            {" "}
            <span className="font-medium text-slate-700 dark:text-zinc-300">
              {activeCount}/{maxPosts} posts used
            </span>
            .
          </p>
        </div>
        {canCreate ? (
          <Button href={`${ROUTES.admin.blog}/new`}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden />
            New Post
          </Button>
        ) : (
          <Button disabled title={`Limit of ${maxPosts} posts reached. Delete one to add another.`}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden />
            Limit reached
          </Button>
        )}
      </div>

      {!canCreate ? (
        <StatusMessage variant="info">
          You can upload up to {maxPosts} blog posts. Delete an existing post to create a new one.
        </StatusMessage>
      ) : null}

      {notice ? <StatusMessage variant="success">{notice}</StatusMessage> : null}
      {error ? <InlineError>{error}</InlineError> : null}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, slug, excerpt…"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {selected.size > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-3 text-sm dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <span className="font-medium text-indigo-900 dark:text-indigo-100">
            {selected.size} selected
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runBulk("publish")}
            className="rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runBulk("unpublish")}
            className="rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
          >
            Unpublish
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runBulk("delete")}
            className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-3">
                <button type="button" onClick={toggleAll} aria-label="Select all" className="text-slate-500">
                  {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="px-3 py-3 font-medium">Title</th>
              <th className="px-3 py-3 font-medium">Slug</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Published</th>
              <th className="px-3 py-3 font-medium">Views</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  Loading posts…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No posts yet. Create your first one.
                </td>
              </tr>
            ) : (
              items.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => toggleOne(post.id)}
                      aria-label={`Select ${post.title}`}
                    >
                      {selected.has(post.id) ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="max-w-[220px] px-3 py-3">
                    <p className="truncate font-medium text-slate-900 dark:text-zinc-100">
                      {post.title}
                    </p>
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-3 font-mono text-xs text-slate-500">
                    {post.slug}
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-zinc-300">{post.category}</td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        post.published
                          ? "rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800"
                          : "rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{formatDate(post.publishedAt)}</td>
                  <td className="px-3 py-3 text-slate-600">{post.views}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      {post.published ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                          title="View public"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <Link
                        href={`${ROUTES.admin.blog}/${post.id}`}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        title="Delete"
                        disabled={busy}
                        onClick={() => void deleteOne(post.id, post.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
