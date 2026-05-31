"use client";

import { useMemo, useState } from "react";
import { AdminAccessControls } from "@/components/crm/AdminAccessControls";

type SupportNote = {
  id: string;
  userId?: string;
  authorId?: string;
  body: string;
  pinned: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  author?: { id: string; name?: string | null; email?: string | null } | null;
};

type InternalTag = {
  id: string;
  userId: string;
  tag: string;
  createdById: string;
  createdAt: string | Date;
};

type GenerationHistoryRow = {
  id: string;
  userId: string;
  examId?: string | null;
  quiltId?: string | null;
  field: string;
  subjectId?: string | null;
  topic: string;
  difficulty: string;
  questionCount: number;
  status: string;
  durationMs?: number | null;
  errorMessage?: string | null;
  createdAt: string | Date;
};

type ActivityTimelineRow = {
  id: string;
  userId: string;
  action: string;
  summary: string;
  createdAt: string | Date;
};

type Profile = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/crm/user-profile").getCrmUserProfile>>
>;

export default function UserProfileCRM({ profile }: { profile: Profile }) {
  const [noteBody, setNoteBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [tag, setTag] = useState("");
  const [busy, setBusy] = useState(false);

  const userId = profile.user.id;
  const [supportNotes, setSupportNotes] = useState<SupportNote[]>(
    profile.supportNotes ?? []
  );
  const [internalTags, setInternalTags] = useState<InternalTag[]>(
    profile.internalTags ?? []
  );

  const tags = useMemo(
    () => internalTags.map((t) => t.tag),
    [internalTags]
  );
  const pinnedNotes = useMemo(
    () => supportNotes.filter((n) => Boolean(n.pinned)),
    [supportNotes]
  );

  const generationHistory = (profile.generationHistory ?? []) as GenerationHistoryRow[];
  const activityTimeline = (profile.activityTimeline ?? []) as ActivityTimelineRow[];

  async function addNote() {
    setBusy(true);
    try {
      const res = await fetch(`/api/internal/users/${userId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: noteBody, pinned }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        note?: SupportNote;
      };
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setNoteBody("");
      setPinned(false);
      const note = data.note;
      if (note) setSupportNotes((prev) => [note, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  async function addTag() {
    if (!tag.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/internal/users/${userId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tag }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        tag?: InternalTag;
      };
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setTag("");
      if (data.tag) setInternalTags((prev) => [data.tag!, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  async function removeTag(tagToRemove: string) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/internal/users/${userId}/tags?tag=${encodeURIComponent(tagToRemove)}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setInternalTags((prev) => prev.filter((t) => t.tag !== tagToRemove));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Account overview</h2>
          <div className="mt-3 text-sm text-black/70">
            <div>
              <span className="font-medium text-black/90">Email:</span>{" "}
              {profile.user.email}
            </div>
            <div className="mt-1">
              <span className="font-medium text-black/90">Role:</span>{" "}
              {profile.user.role}
            </div>
            <div className="mt-1">
              <span className="font-medium text-black/90">Status:</span>{" "}
              {profile.user.accountStatus}
            </div>
            <div className="mt-1">
              <span className="font-medium text-black/90">Last active:</span>{" "}
              {profile.user.lastActiveAt
                ? new Date(profile.user.lastActiveAt).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold">Subscription</h2>
          <div className="mt-3 text-sm text-black/70">
            <div>Status: {profile.subscription?.status ?? "—"}</div>
            <div className="mt-1">
              Trial ends:{" "}
              {profile.subscription?.trialEndsAt
                ? new Date(profile.subscription.trialEndsAt).toLocaleDateString()
                : "—"}
            </div>
            <div className="mt-1">
              Period end:{" "}
              {profile.subscription?.currentPeriodEnd
                ? new Date(profile.subscription.currentPeriodEnd).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      </section>

      <AdminAccessControls userId={userId} />

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <h2 className="text-sm font-semibold">Usage metrics</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["loginCount", profile.usageMetrics?.loginCount ?? 0],
            ["generationCount", profile.usageMetrics?.generationCount ?? 0],
            ["examCount", profile.usageMetrics?.examCount ?? 0],
            ["quiltCount", profile.usageMetrics?.quiltCount ?? 0],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-lg bg-black/5 p-3">
              <div className="text-xs text-black/60">{String(k)}</div>
              <div className="mt-1 text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold">Support notes</h2>

          {pinnedNotes.length > 0 && (
            <div className="mb-3 text-xs text-black/60">
              Pinned: {pinnedNotes.length}
            </div>
          )}

          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <textarea
                className="w-full rounded-lg border border-black/10 bg-white p-3 text-sm"
                rows={3}
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Add an internal support note…"
              />
              <label className="flex items-center gap-2 text-sm text-black/70">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                Pin note
              </label>
              <button
                className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                onClick={() => void addNote()}
                disabled={busy || !noteBody.trim()}
              >
                Add note
              </button>
            </div>

            <div className="space-y-2">
              {supportNotes.slice(0, 8).map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-black/10 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs text-black/60">
                      {n.author?.name ?? "Staff"} •{" "}
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    {n.pinned && <div className="text-xs font-semibold">Pinned</div>}
                  </div>
                  <div className="mt-2 text-sm text-black/80">{n.body}</div>
                </div>
              ))}
              {supportNotes.length === 0 && (
                <p className="text-sm text-black/50">No notes yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold">Internal tags</h2>

          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. High-value institution user"
              />
              <button
                className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                onClick={() => void addTag()}
                disabled={busy || !tag.trim()}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className="text-sm text-black/50">No tags yet.</p>
              ) : (
                tags.map((t: string) => (
                  <button
                    key={t}
                    onClick={() => void removeTag(t)}
                    className="rounded-full border border-black/15 bg-black/5 px-3 py-1 text-xs hover:bg-black/10"
                    title="Click to remove"
                  >
                    {t}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Bookmarks</h2>
            <p className="mt-2 text-sm text-black/60">
              {profile.bookmarks?.length
                ? `Saved by staff: ${profile.bookmarks.length}`
                : "No bookmarks yet."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold">Recent generation history</h2>
          <div className="mt-3 space-y-2">
            {generationHistory.slice(0, 8).map((g) => (
              <div key={g.id} className="rounded-lg bg-black/5 p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <div className="font-medium text-black/90">
                    {g.field}
                    {g.subjectId ? ` • ${g.subjectId}` : ""}
                  </div>
                  <div className="text-xs text-black/60">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-1 text-xs text-black/60">{g.topic}</div>
                <div className="mt-2 text-xs text-black/70">
                  {g.difficulty} • {g.questionCount} questions • {g.status}
                </div>
                {g.errorMessage && (
                  <div className="mt-2 text-xs a11y-incorrect-text">
                    <strong>Error:</strong> {g.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-sm font-semibold">Activity timeline</h2>
          <div className="mt-3 space-y-2">
            {activityTimeline.slice(0, 12).map((a) => (
              <div key={a.id} className="rounded-lg border border-black/10 bg-white p-3">
                <div className="flex justify-between gap-3">
                  <div className="text-xs font-medium text-black/80">{a.action}</div>
                  <div className="text-xs text-black/60">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-sm text-black/70">{a.summary}</div>
              </div>
            ))}
            {(profile.activityTimeline ?? []).length === 0 && (
              <p className="text-sm text-black/50">No timeline events yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

