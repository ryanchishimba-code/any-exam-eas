"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  ImagePlus,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import { BlogRichTextEditor } from "@/components/admin/blog/BlogRichTextEditor";
import type { AdminBlogPost } from "@/lib/admin/blog-admin";
import {
  BLOG_CATEGORIES,
  estimateReadTimeMinutes,
  slugifyTitle,
} from "@/lib/admin/blog-validators";
import { compressImageToDataUrl } from "@/lib/images/compress-image";
import { ROUTES } from "@/lib/routes";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  published: boolean;
  scheduledAt: string;
  metaTitle: string;
  metaDescription: string;
};

function toForm(post?: AdminBlogPost | null): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    category: post?.category ?? "Study Tips",
    tags: (post?.tags ?? []).join(", "),
    published: post?.published ?? false,
    scheduledAt: post?.scheduledAt
      ? new Date(post.scheduledAt).toISOString().slice(0, 16)
      : "",
    metaTitle: post?.metaTitle ?? "",
    metaDescription: post?.metaDescription ?? "",
  };
}

type Props = {
  mode: "create" | "edit";
  initial?: AdminBlogPost | null;
};

export function BlogPostEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [postId, setPostId] = useState<string | null>(initial?.id ?? null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedJson = useRef("");

  const readTime = useMemo(
    () => estimateReadTimeMinutes(form.content || form.excerpt),
    [form.content, form.excerpt]
  );

  const payload = useCallback(() => {
    return {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || null,
      category: form.category,
      tags: form.tags,
      published: form.published,
      scheduledAt: form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
    };
  }, [form]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    if (slugManual || mode === "edit") return;
    setForm((prev) => ({ ...prev, slug: slugifyTitle(prev.title) }));
  }, [form.title, slugManual, mode]);

  const save = useCallback(
    async (opts?: { silent?: boolean; publish?: boolean }) => {
      if (!form.title.trim()) {
        if (!opts?.silent) setError("Title is required.");
        return null;
      }
      setSaving(true);
      if (!opts?.silent) setError("");
      try {
        const body = {
          ...payload(),
          published: opts?.publish ?? form.published,
        };
        const json = JSON.stringify(body);
        if (opts?.silent && json === lastSavedJson.current && postId) {
          setSaving(false);
          return postId;
        }

        const res = await fetch(
          postId ? `/api/admin/blog/${postId}` : "/api/admin/blog",
          {
            method: postId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: json,
          }
        );
        const data = (await res.json()) as {
          item?: AdminBlogPost;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Save failed.");
        if (!data.item) throw new Error("Save failed.");

        lastSavedJson.current = json;
        setPostId(data.item.id);
        setForm(toForm(data.item));
        if (!opts?.silent) {
          setNotice(opts?.publish || data.item.published ? "Published." : "Draft saved.");
        } else {
          setNotice("Auto-saved");
        }
        if (mode === "create" && !postId) {
          router.replace(`${ROUTES.admin.blog}/${data.item.id}`);
        }
        return data.item.id;
      } catch (e) {
        if (!opts?.silent) {
          setError(e instanceof Error ? e.message : "Save failed.");
        }
        return null;
      } finally {
        setSaving(false);
      }
    },
    [form.published, form.title, mode, payload, postId, router]
  );

  // Auto-save drafts every 2.5s after edits (existing posts only).
  useEffect(() => {
    if (!postId || form.published) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void save({ silent: true });
    }, 2500);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [form, postId, save]);

  async function runAi(action: "improve_title" | "generate_excerpt" | "suggest_tags") {
    setAiBusy(action);
    setError("");
    try {
      const res = await fetch("/api/admin/blog/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
        }),
      });
      const data = (await res.json()) as {
        title?: string;
        excerpt?: string;
        tags?: string[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "AI assist failed.");
      if (action === "improve_title" && data.title) {
        setForm((p) => ({ ...p, title: data.title! }));
      }
      if (action === "generate_excerpt" && data.excerpt) {
        setForm((p) => ({ ...p, excerpt: data.excerpt! }));
      }
      if (action === "suggest_tags" && data.tags) {
        setForm((p) => ({ ...p, tags: data.tags!.join(", ") }));
      }
      setNotice("AI suggestion applied.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI assist failed.");
    } finally {
      setAiBusy(null);
    }
  }

  async function onCoverFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImageToDataUrl(file, {
        maxDimension: 1600,
        quality: 0.85,
      });
      setForm((p) => ({ ...p, coverImage: dataUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={ROUTES.admin.blog}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
            {mode === "create" ? "New post" : "Edit post"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ~{readTime} min read
            {saving ? " · Saving…" : notice ? ` · ${notice}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {postId && form.published ? (
            <Button href={`/blog/${form.slug}`} variant="secondary" className="!px-4 !py-2 text-sm">
              <Eye className="mr-1.5 h-4 w-4" />
              View
            </Button>
          ) : null}
          <Button
            variant="secondary"
            className="!px-4 !py-2 text-sm"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save draft
          </Button>
          <Button
            className="!px-4 !py-2 text-sm"
            disabled={saving}
            onClick={() => void save({ publish: true })}
          >
            Publish
          </Button>
        </div>
      </div>

      {notice ? <StatusMessage variant="success">{notice}</StatusMessage> : null}
      {error ? <InlineError>{error}</InlineError> : null}

      <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-800">
        {(["edit", "preview"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPreviewTab(tab)}
            className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              previewTab === tab
                ? "border-indigo-600 text-indigo-700 dark:text-indigo-300"
                : "border-transparent text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {previewTab === "preview" ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          {form.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImage}
              alt=""
              className="mb-6 max-h-72 w-full rounded-xl object-cover"
            />
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {form.category} · {readTime} min read
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
            {form.title || "Untitled"}
          </h2>
          {form.excerpt ? (
            <p className="mt-3 text-lg text-slate-600 dark:text-zinc-300">{form.excerpt}</p>
          ) : null}
          <div
            className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: form.content || "<p><em>Start writing to preview…</em></p>",
            }}
          />
        </article>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="How to crush NCLEX prioritization questions"
              />
              <button
                type="button"
                disabled={!!aiBusy}
                onClick={() => void runAi("improve_title")}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {aiBusy === "improve_title" ? "Improving…" : "Improve title"}
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Slug
              </label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setForm((p) => ({
                    ...p,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  }));
                }}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Excerpt
                </label>
                <button
                  type="button"
                  disabled={!!aiBusy}
                  onClick={() => void runAi("generate_excerpt")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {aiBusy === "generate_excerpt" ? "Generating…" : "Generate excerpt"}
                </button>
              </div>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                placeholder="One or two sentences for cards and SEO."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content
              </label>
              <BlogRichTextEditor
                value={form.content}
                onChange={(html) => setForm((p) => ({ ...p, content: html }))}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
                  Published
                </span>
                <Switch
                  checked={form.published}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, published: checked }))
                  }
                />
              </div>
              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Schedule (optional)
              </label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scheduledAt: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cover image
              </label>
              {form.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.coverImage}
                  alt=""
                  className="mt-2 max-h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="mt-2 flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 dark:border-zinc-700">
                  <ImagePlus className="h-6 w-6" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={(e) => void onCoverFile(e.target.files?.[0] ?? null)}
              />
              <Input
                value={form.coverImage.startsWith("data:") ? "" : form.coverImage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, coverImage: e.target.value }))
                }
                placeholder="Or paste image URL"
                className="mt-2"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="mt-2"
                placeholder="Or type a custom category"
              />

              <div className="mt-4 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tags
                </label>
                <button
                  type="button"
                  disabled={!!aiBusy}
                  onClick={() => void runAi("suggest_tags")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {aiBusy === "suggest_tags" ? "Suggesting…" : "Suggest tags"}
                </button>
              </div>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                className="mt-1.5"
                placeholder="nclex, prioritization, study tips"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">SEO</p>
              <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta title
              </label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))}
                className="mt-1.5"
                maxLength={70}
                placeholder="Defaults to post title"
              />
              <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Meta description
              </label>
              <Textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metaDescription: e.target.value }))
                }
                className="mt-1.5"
                rows={3}
                maxLength={170}
                placeholder="Defaults to excerpt"
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
