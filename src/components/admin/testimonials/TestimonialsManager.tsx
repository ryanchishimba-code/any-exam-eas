"use client";

/**
 * TestimonialsManager — no-code admin GUI for marketing testimonials.
 *
 * Features:
 *  - List of all testimonials with status + featured badges
 *  - Add / edit form with a LIVE public-style preview
 *  - Drag-and-drop (or click) photo upload, compressed client-side to a data URL
 *  - Moderation: approve / reject before a testimonial goes public
 *  - Soft delete with an Undo affordance
 *  - Optimistic updates + clear success/error messaging
 *
 * Data: GET/POST /api/admin/testimonials, PATCH/DELETE /api/admin/testimonials/:id
 *
 * Extending: to add new testimonial fields, (1) add the column in
 * prisma/schema.prisma + a migration, (2) add it to the zod schema in
 * testimonials-validators.ts, and (3) add an input below + render it in
 * PublicPreviewCard. The list/optimistic plumbing needs no changes.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Pencil,
  Plus,
  Star,
  Trash2,
  Undo2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InlineError, StatusMessage } from "@/components/ui/StatusMessage";
import { compressImageToDataUrl } from "@/lib/images/compress-image";
import {
  deriveInitials,
  gradientForName,
  TESTIMONIAL_AVATAR_GRADIENTS,
} from "@/lib/admin/testimonials-validators";
import type { AdminTestimonial } from "@/lib/admin/testimonials-admin";

type FormState = {
  name: string;
  exam: string;
  quote: string;
  longQuote: string;
  outcome: string;
  detail: string;
  photoUrl: string;
  avatarGradient: string;
  featured: boolean;
  status: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  exam: "",
  quote: "",
  longQuote: "",
  outcome: "",
  detail: "",
  photoUrl: "",
  avatarGradient: TESTIMONIAL_AVATAR_GRADIENTS[0],
  featured: false,
  status: "pending",
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export function TestimonialsManager() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // editingId: null = form closed, "new" = creating, otherwise the row id.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [notice, setNotice] = useState<{ message: string; undoId?: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setItems((data.items ?? []) as AdminTestimonial[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Auto-dismiss success notices (undo prompts linger a little longer).
  useEffect(() => {
    if (!notice) return;
    const ms = notice.undoId ? 8000 : 3500;
    const t = setTimeout(() => setNotice(null), ms);
    return () => clearTimeout(t);
  }, [notice]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditingId("new");
  }

  function openEdit(item: AdminTestimonial) {
    setForm({
      name: item.name,
      exam: item.exam,
      quote: item.quote,
      longQuote: item.longQuote ?? "",
      outcome: item.outcome ?? "",
      detail: item.detail ?? "",
      photoUrl: item.photoUrl ?? "",
      avatarGradient: item.avatarGradient ?? gradientForName(item.name),
      featured: item.featured,
      status: item.status,
    });
    setFormError(null);
    setEditingId(item.id);
  }

  function closeForm() {
    setEditingId(null);
    setFormError(null);
  }

  function patchForm(patch: Partial<FormState>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      exam: form.exam.trim(),
      quote: form.quote.trim(),
      longQuote: form.longQuote.trim() || undefined,
      outcome: form.outcome.trim() || undefined,
      detail: form.detail.trim() || undefined,
      photoUrl: form.photoUrl || undefined,
      avatarGradient: form.avatarGradient || undefined,
      featured: form.featured,
      status: form.status,
    };

    try {
      const isNew = editingId === "new";
      const res = await fetch(
        isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editingId}`,
        {
          method: isNew ? "POST" : "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      const saved = data.item as AdminTestimonial;
      setItems((prev) =>
        isNew ? [saved, ...prev] : prev.map((i) => (i.id === saved.id ? saved : i))
      );
      setNotice({ message: isNew ? "Testimonial added." : "Changes saved." });
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  // Optimistic field patch (status / featured) with rollback on failure.
  async function patchItem(item: AdminTestimonial, patch: Partial<AdminTestimonial>, successMsg: string) {
    const prevItems = items;
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setItems((list) => list.map((i) => (i.id === item.id ? (data.item as AdminTestimonial) : i)));
      setNotice({ message: successMsg });
    } catch (err) {
      setItems(prevItems); // rollback
      setNotice({ message: err instanceof Error ? err.message : "Update failed." });
    }
  }

  async function removeItem(item: AdminTestimonial) {
    const prevItems = items;
    setItems((list) => list.filter((i) => i.id !== item.id)); // optimistic remove
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setNotice({ message: `Deleted “${item.name}”.`, undoId: item.id });
    } catch (err) {
      setItems(prevItems); // rollback
      setNotice({ message: err instanceof Error ? err.message : "Delete failed." });
    }
  }

  async function undoRemove(id: string) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleted: false }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      const restored = data.item as AdminTestimonial;
      setItems((prev) =>
        prev.some((i) => i.id === restored.id) ? prev : [restored, ...prev]
      );
      setNotice({ message: "Restored." });
    } catch (err) {
      setNotice({ message: err instanceof Error ? err.message : "Restore failed." });
    }
  }

  const counts = useMemo(() => {
    return {
      total: items.length,
      approved: items.filter((i) => i.status === "approved").length,
      pending: items.filter((i) => i.status === "pending").length,
      featured: items.filter((i) => i.featured).length,
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Add and moderate the stories shown on the landing page. Only{" "}
            <strong>approved</strong> testimonials appear publicly.
          </p>
        </div>
        {editingId === null ? (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
          >
            <Plus size={16} /> Add testimonial
          </button>
        ) : null}
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total" value={counts.total} />
        <Stat label="Approved (live)" value={counts.approved} accent="emerald" />
        <Stat label="Pending" value={counts.pending} accent="amber" />
        <Stat label="Featured" value={counts.featured} />
      </div>

      {/* Notices */}
      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
            <CheckCircle2 size={16} className="text-emerald-600" />
            {notice.message}
          </span>
          {notice.undoId ? (
            <button
              type="button"
              onClick={() => undoRemove(notice.undoId as string)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200"
            >
              <Undo2 size={13} /> Undo
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Add / edit form with live preview */}
      {editingId !== null ? (
        <TestimonialForm
          mode={editingId === "new" ? "create" : "edit"}
          form={form}
          saving={saving}
          error={formError}
          onChange={patchForm}
          onClose={closeForm}
          onSubmit={submitForm}
        />
      ) : null}

      {error ? <InlineError>{error}</InlineError> : null}

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400 dark:border-zinc-800 dark:bg-zinc-900">
            Loading testimonials…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500 dark:border-zinc-700 dark:bg-zinc-900">
            No testimonials yet. Click <strong>Add testimonial</strong> to create your first one.
            <br />
            <span className="text-xs text-slate-400">
              (The public site shows curated default stories until you approve your own.)
            </span>
          </div>
        ) : (
          items.map((item) => (
            <TestimonialRow
              key={item.id}
              item={item}
              onEdit={() => openEdit(item)}
              onDelete={() => removeItem(item)}
              onApprove={() => patchItem(item, { status: "approved" }, `“${item.name}” is now live.`)}
              onReject={() => patchItem(item, { status: "rejected" }, `“${item.name}” hidden.`)}
              onToggleFeatured={() =>
                patchItem(item, { featured: !item.featured }, item.featured ? "Unfeatured." : "Featured.")
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── List row ─────────────────────────── */

function TestimonialRow({
  item,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured,
}: {
  item: AdminTestimonial;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  onToggleFeatured: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-start">
      <Avatar item={item} size={44} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900 dark:text-zinc-100">{item.name}</p>
          <span className="text-xs text-slate-500 dark:text-zinc-400">{item.exam}</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
              STATUS_STYLES[item.status] ?? "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {item.status}
          </span>
          {item.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-indigo-700">
              <Star size={10} className="fill-current" /> Featured
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-zinc-300">“{item.quote}”</p>
        {item.outcome ? (
          <p className="mt-1 text-xs font-medium text-emerald-700">{item.outcome}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {item.status !== "approved" ? (
          <RowBtn onClick={onApprove} title="Approve (make public)">
            <CheckCircle2 size={14} className="text-emerald-600" /> Approve
          </RowBtn>
        ) : (
          <RowBtn onClick={onReject} title="Unpublish">
            <XCircle size={14} className="text-rose-600" /> Unpublish
          </RowBtn>
        )}
        <RowBtn onClick={onToggleFeatured} title="Toggle featured">
          <Star size={14} className={item.featured ? "fill-indigo-500 text-indigo-500" : ""} />
        </RowBtn>
        <RowBtn onClick={onEdit} title="Edit">
          <Pencil size={14} />
        </RowBtn>
        <RowBtn onClick={onDelete} title="Delete" danger>
          <Trash2 size={14} />
        </RowBtn>
      </div>
    </div>
  );
}

function RowBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
        danger
          ? "border-rose-200 text-rose-600 hover:bg-rose-50"
          : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── Add / edit form ─────────────────────────── */

function TestimonialForm({
  mode,
  form,
  saving,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  form: FormState;
  saving: boolean;
  error: string | null;
  onChange: (patch: Partial<FormState>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {mode === "create" ? "Add testimonial" : "Edit testimonial"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800"
          aria-label="Close form"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Fields */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <Input
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Prisca M."
                required
                maxLength={80}
              />
            </Field>
            <Field label="Exam / role" required>
              <Input
                value={form.exam}
                onChange={(e) => onChange({ exam: e.target.value })}
                placeholder="NCLEX-RN"
                required
                maxLength={80}
              />
            </Field>
          </div>

          <Field label="Quote" required hint="Shown on every testimonial card.">
            <Textarea
              value={form.quote}
              onChange={(e) => onChange({ quote: e.target.value })}
              placeholder="I passed on my first try — the Roadmap told me exactly what to study…"
              required
              rows={3}
              maxLength={600}
            />
          </Field>

          <Field label="Longer quote" hint="Optional — used on wide featured cards.">
            <Textarea
              value={form.longQuote}
              onChange={(e) => onChange({ longQuote: e.target.value })}
              rows={3}
              maxLength={1200}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Outcome" hint='e.g. "Passed NCLEX — first attempt"'>
              <Input
                value={form.outcome}
                onChange={(e) => onChange({ outcome: e.target.value })}
                maxLength={120}
              />
            </Field>
            <Field label="Detail" hint='e.g. "Saved $600+ vs separate QBanks"'>
              <Input
                value={form.detail}
                onChange={(e) => onChange({ detail: e.target.value })}
                maxLength={160}
              />
            </Field>
          </div>

          <PhotoPicker
            photoUrl={form.photoUrl}
            avatarGradient={form.avatarGradient}
            onPhoto={(dataUrl) => onChange({ photoUrl: dataUrl })}
            onClearPhoto={() => onChange({ photoUrl: "" })}
            onPickGradient={(g) => onChange({ avatarGradient: g })}
          />

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-zinc-200">
              <Switch checked={form.featured} onCheckedChange={(v) => onChange({ featured: v })} />
              Featured (wide card)
            </label>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700 dark:text-zinc-200">Status</span>
              <select
                value={form.status}
                onChange={(e) => onChange({ status: e.target.value })}
                className="apple-select w-auto"
              >
                <option value="pending">Pending (hidden)</option>
                <option value="approved">Approved (public)</option>
                <option value="rejected">Rejected (hidden)</option>
              </select>
            </div>
          </div>

          {error ? <InlineError>{error}</InlineError> : null}

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Add testimonial" : "Save changes"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Live public preview */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Public preview
          </p>
          <PublicPreviewCard form={form} />
          <p className="mt-2 text-xs text-slate-400">
            This is roughly how it looks on the landing page.
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-200">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

/* ─────────────────────────── Photo picker ─────────────────────────── */

function PhotoPicker({
  photoUrl,
  avatarGradient,
  onPhoto,
  onClearPhoto,
  onPickGradient,
}: {
  photoUrl: string;
  avatarGradient: string;
  onPhoto: (dataUrl: string) => void;
  onClearPhoto: () => void;
  onPickGradient: (gradient: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setErr(null);
      setBusy(true);
      try {
        const dataUrl = await compressImageToDataUrl(file, { maxDimension: 320, quality: 0.82 });
        onPhoto(dataUrl);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Could not process that image.");
      } finally {
        setBusy(false);
      }
    },
    [onPhoto]
  );

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-200">Photo</span>
      <div className="flex items-center gap-4">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Avatar preview"
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: avatarGradient }}
            aria-hidden
          >
            <ImagePlus size={20} />
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex-1 rounded-xl border border-dashed px-4 py-3 text-center text-sm transition ${
            dragOver
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.05]"
              : "border-slate-300 dark:border-zinc-700"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-[var(--color-accent)] hover:underline"
            disabled={busy}
          >
            {busy ? "Processing…" : "Choose a photo"}
          </button>
          <span className="text-slate-400"> or drag &amp; drop</span>
          <p className="mt-0.5 text-xs text-slate-400">JPG/PNG — auto-resized. Optional.</p>
          {photoUrl ? (
            <button
              type="button"
              onClick={onClearPhoto}
              className="mt-1 text-xs text-rose-600 hover:underline"
            >
              Remove photo
            </button>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {err ? <p className="mt-1.5 text-xs text-rose-600">{err}</p> : null}

      {/* Gradient swatches for the fallback (no-photo) avatar */}
      {!photoUrl ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400">Avatar color:</span>
          {TESTIMONIAL_AVATAR_GRADIENTS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onPickGradient(g)}
              className={`h-6 w-6 rounded-full ring-2 transition ${
                avatarGradient === g ? "ring-slate-900 dark:ring-white" : "ring-transparent"
              }`}
              style={{ background: g }}
              aria-label="Pick avatar color"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── Avatar + preview ─────────────────────────── */

function Avatar({
  item,
  size = 44,
}: {
  item: Pick<AdminTestimonial, "name" | "initials" | "photoUrl" | "avatarGradient">;
  size?: number;
}) {
  const initials = (item.initials || deriveInitials(item.name)).toUpperCase();
  if (item.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.photoUrl}
        alt={item.name}
        className="shrink-0 rounded-full object-cover ring-1 ring-slate-200"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: item.avatarGradient || gradientForName(item.name),
        fontSize: size * 0.34,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

/** Mirrors the landing testimonial card styling so admins see the real look. */
function PublicPreviewCard({ form }: { form: FormState }) {
  const quote = form.featured && form.longQuote.trim() ? form.longQuote : form.quote;
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-md)]">
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-current" />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
        “{quote.trim() || "Your testimonial quote will appear here."}”
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Avatar
          item={{
            name: form.name || "New Student",
            initials: "",
            photoUrl: form.photoUrl,
            avatarGradient: form.avatarGradient,
          }}
          size={40}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
            {form.name || "New Student"}
          </p>
          <p className="truncate text-xs text-[var(--color-ink-muted)]">
            {form.exam || "Exam / role"}
          </p>
        </div>
      </div>
      {form.outcome.trim() ? (
        <p className="mt-3 text-xs font-semibold text-[var(--color-accent)]">{form.outcome}</p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── Stat card ─────────────────────────── */

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "emerald" | "amber";
}) {
  const color =
    accent === "emerald" ? "text-emerald-600" : accent === "amber" ? "text-amber-600" : "text-slate-900 dark:text-zinc-100";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-slate-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}
