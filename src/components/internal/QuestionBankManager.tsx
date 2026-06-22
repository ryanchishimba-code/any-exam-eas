"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Download, Filter, AlertTriangle, RefreshCw } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";
import { hasPermission } from "@/lib/permissions";
import { QuestionAnalyticsPanel } from "@/components/internal/QuestionAnalyticsPanel";
import { AddQuestionForm } from "@/components/internal/AddQuestionForm";
import { QuestionDetailDrawer } from "@/components/internal/QuestionDetailDrawer";
import type {
  AdminQuestionListItem,
  AdminQuestionFacets,
} from "@/lib/admin/question-bank-admin";

type Tab = "manage" | "analytics";

const STATUS_BADGE: Record<string, string> = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-800",
  flagged: "bg-orange-50 text-orange-800",
  rejected: "bg-red-50 text-red-700",
};

const initialFilters = {
  search: "",
  fieldId: "",
  reviewStatus: "",
  difficulty: "",
  itemType: "",
  source: "",
  blueprint: "",
  qaPassed: "",
  active: "",
  reportedOnly: false,
  sort: "updatedAt" as "updatedAt" | "createdAt" | "difficulty",
  order: "desc" as "asc" | "desc",
};

export function QuestionBankManager() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canEdit = hasPermission(role, "questions.edit");
  const canPublish = hasPermission(role, "questions.publish");

  const [tab, setTab] = useState<Tab>("manage");
  const [facets, setFacets] = useState<AdminQuestionFacets | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [items, setItems] = useState<AdminQuestionListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.search) p.set("search", filters.search);
    if (filters.fieldId) p.set("fieldId", filters.fieldId);
    if (filters.reviewStatus) p.set("reviewStatus", filters.reviewStatus);
    if (filters.difficulty) p.set("difficulty", filters.difficulty);
    if (filters.itemType) p.set("itemType", filters.itemType);
    if (filters.source) p.set("source", filters.source);
    if (filters.blueprint) p.set("blueprint", filters.blueprint);
    if (filters.qaPassed) p.set("qaPassed", filters.qaPassed);
    if (filters.active) p.set("active", filters.active);
    if (filters.reportedOnly) p.set("reportedOnly", "true");
    p.set("sort", filters.sort);
    p.set("order", filters.order);
    return p.toString();
  }, [filters]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/internal/questions/bank/facets", {
          credentials: "include",
        });
        if (res.ok) setFacets(await res.json());
      } catch {
        /* non-blocking */
      }
    })();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/internal/questions/bank?${queryString}&page=${page}&pageSize=${pageSize}`,
        { credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [queryString, page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [queryString]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))
    );
  }

  async function runBulk(action: string, extra?: Record<string, unknown>) {
    if (!selected.size) return;
    setBulkMsg(null);
    try {
      const res = await fetch("/api/internal/questions/bank/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected], action, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setBulkMsg(`Updated ${data.updated} question(s).`);
      setSelected(new Set());
      void load();
    } catch (e) {
      setBulkMsg(e instanceof Error ? e.message : String(e));
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            Question bank
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Review, edit, and expand questions across every exam. Filter by board, bulk-approve, and
            preview how items look to students.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tab === "manage" && canEdit ? (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={16} /> Add question
            </button>
          ) : null}
          {tab === "manage" ? (
            <a
              href={`/api/internal/questions/bank/export?${queryString}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] px-4 py-2 text-sm font-medium"
            >
              <Download size={16} /> Export CSV
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex gap-1 border-b border-black/[0.08]">
        {(["manage", "analytics"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                : "border-transparent text-black/45 hover:text-black/70"
            }`}
          >
            {t === "manage" ? "Manage" : "Performance analytics"}
          </button>
        ))}
      </div>

      {tab === "analytics" ? (
        <QuestionAnalyticsPanel />
      ) : (
        <>
          {facets ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatCard label="Total" value={facets.totals.all} />
              <StatCard label="QA passed" value={facets.totals.qaPassed} accent="green" />
              <StatCard label="Pending" value={facets.totals.pending} accent="amber" />
              <StatCard label="Flagged" value={facets.totals.flagged} accent="orange" />
              <StatCard label="Archived" value={facets.totals.drafts} />
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center gap-2">
              <form
                className="flex flex-1 min-w-[14rem] items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFilters((f) => ({ ...f, search: searchInput }));
                }}
              >
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search stem, rationale, scenario…"
                  className="apple-input w-full"
                />
              </form>
              <select
                value={filters.fieldId}
                onChange={(e) => setFilters((f) => ({ ...f, fieldId: e.target.value }))}
                className="apple-input"
              >
                <option value="">All exams</option>
                {facets?.fields.map((f) => (
                  <option key={f.fieldId} value={f.fieldId}>
                    {f.examName} ({f.count})
                  </option>
                ))}
              </select>
              <select
                value={filters.reviewStatus}
                onChange={(e) => setFilters((f) => ({ ...f, reviewStatus: e.target.value }))}
                className="apple-input"
              >
                <option value="">Any status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                className="apple-input"
              >
                <option value="">Any difficulty</option>
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    Difficulty {d}
                  </option>
                ))}
              </select>
              <select
                value={filters.qaPassed}
                onChange={(e) => setFilters((f) => ({ ...f, qaPassed: e.target.value }))}
                className="apple-input"
              >
                <option value="">QA: any</option>
                <option value="true">QA passed</option>
                <option value="false">QA not passed</option>
              </select>
              <select
                value={filters.active}
                onChange={(e) => setFilters((f) => ({ ...f, active: e.target.value }))}
                className="apple-input"
              >
                <option value="">Active + archived</option>
                <option value="true">Active only</option>
                <option value="false">Archived only</option>
              </select>
              <input
                value={filters.blueprint}
                onChange={(e) => setFilters((f) => ({ ...f, blueprint: e.target.value }))}
                placeholder="Blueprint contains…"
                className="apple-input w-40"
              />
              <label className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.reportedOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, reportedOnly: e.target.checked }))}
                  className="h-4 w-4"
                />
                <AlertTriangle size={14} className="text-orange-600" /> Reported
              </label>
              <button
                type="button"
                onClick={() => {
                  setFilters(initialFilters);
                  setSearchInput("");
                }}
                className="inline-flex items-center gap-1 rounded-full border border-black/[0.1] px-3 py-2 text-sm"
              >
                <Filter size={14} /> Reset
              </button>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-full border border-black/[0.1] p-2"
                aria-label="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] px-4 py-3 text-sm">
              <span className="font-medium">{selected.size} selected</span>
              {canPublish ? (
                <>
                  <BulkBtn onClick={() => void runBulk("approve")}>Approve</BulkBtn>
                  <BulkBtn onClick={() => void runBulk("flag")}>Flag</BulkBtn>
                  <BulkBtn onClick={() => void runBulk("reject")}>Reject</BulkBtn>
                  <BulkBtn onClick={() => void runBulk("archive")}>Archive</BulkBtn>
                  <BulkBtn onClick={() => void runBulk("activate")}>Activate</BulkBtn>
                  <BulkBtn onClick={() => void runBulk("qa_pass")}>Mark QA</BulkBtn>
                </>
              ) : null}
              {canEdit ? (
                <BulkBtn
                  onClick={() => {
                    const t = window.prompt("Set tags (comma separated). This replaces existing tags.");
                    if (t != null) {
                      void runBulk("set_tags", {
                        tags: t.split(",").map((s) => s.trim()).filter(Boolean),
                      });
                    }
                  }}
                >
                  Set tags
                </BulkBtn>
              ) : null}
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="ml-auto text-xs text-black/50 underline"
              >
                Clear
              </button>
            </div>
          ) : null}

          {bulkMsg ? <p className="text-sm text-[var(--color-ink-muted)]">{bulkMsg}</p> : null}
          {error ? <InlineError>{error}</InlineError> : null}

          <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/[0.06] bg-black/[0.02] text-xs uppercase text-black/45">
                <tr>
                  <th className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selected.size === items.length}
                      onChange={toggleAll}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="px-3 py-2.5">Question</th>
                  <th className="px-3 py-2.5">Exam</th>
                  <th className="px-3 py-2.5">Diff</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">QA</th>
                  <th className="px-3 py-2.5">Reports</th>
                  <th className="px-3 py-2.5">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-black/45">
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-black/45">
                      No questions match these filters.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className={`cursor-pointer transition hover:bg-black/[0.02] ${
                        !item.active ? "opacity-60" : ""
                      }`}
                      onClick={() => setDetailId(item.id)}
                    >
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="max-w-md px-3 py-2.5">
                        <p className="line-clamp-2">{item.questionPreview}</p>
                        <p className="mt-0.5 text-xs text-black/40">
                          {item.subjectId}
                          {item.blueprintDomain ? ` · ${item.blueprintDomain}` : ""}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-xs">{item.examName}</td>
                      <td className="px-3 py-2.5 tabular-nums">{item.difficulty ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            STATUS_BADGE[item.reviewStatus ?? ""] ?? "bg-black/[0.05] text-black/55"
                          }`}
                        >
                          {item.reviewStatus ?? "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {item.qaPassed ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {item.openReports > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                            <AlertTriangle size={11} /> {item.openReports}
                          </span>
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-black/50">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-black/55">
            <span>
              {total.toLocaleString()} question(s) · page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-black/[0.1] px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-black/[0.1] px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {detailId ? (
        <QuestionDetailDrawer
          id={detailId}
          canEdit={canEdit}
          canPublish={canPublish}
          onClose={() => setDetailId(null)}
          onSaved={() => void load()}
        />
      ) : null}

      {showAdd && facets ? (
        <AddQuestionForm
          fields={facets.fields.length ? facets.fields : [{ fieldId: "nursing", examName: "NCLEX-RN" }]}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "green" | "amber" | "orange";
}) {
  const color =
    accent === "green"
      ? "text-green-600"
      : accent === "amber"
        ? "text-amber-600"
        : accent === "orange"
          ? "text-orange-600"
          : "text-[var(--color-ink)]";
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-3">
      <p className="text-xs text-black/50">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function BulkBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-black/[0.12] bg-white px-3 py-1 text-xs font-medium hover:bg-black/[0.03]"
    >
      {children}
    </button>
  );
}
