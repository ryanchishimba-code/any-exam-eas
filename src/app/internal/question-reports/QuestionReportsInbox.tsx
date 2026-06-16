"use client";

import { useCallback, useEffect, useState } from "react";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import {
  QUESTION_REPORT_REASONS,
  type QuestionReportDetail,
  type QuestionReportListItem,
} from "@/lib/question-reports/types";
import { InlineError } from "@/components/ui/StatusMessage";

function reasonLabel(id: string) {
  return QUESTION_REPORT_REASONS.find((r) => r.id === id)?.label ?? id;
}

function severityClass(severity: string) {
  if (severity === "error") return "text-red-700 bg-red-50 border-red-200";
  if (severity === "warn") return "text-amber-800 bg-amber-50 border-amber-200";
  return "text-slate-700 bg-slate-50 border-slate-200";
}

export default function QuestionReportsInbox() {
  const [items, setItems] = useState<QuestionReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<QuestionReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("open");
  const [examSlug, setExamSlug] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (examSlug) params.set("examSlug", examSlug);
    try {
      const res = await fetch(`/api/internal/question-reports?${params}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [status, examSlug]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/internal/question-reports/${id}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setDetail(data);
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  async function patchReport(body: Record<string, unknown>) {
    if (!selectedId) return;
    setActionMsg(null);
    const res = await fetch(`/api/internal/question-reports/${selectedId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setActionMsg(data.error ?? "Action failed.");
      return;
    }
    setDetail(data.report ?? null);
    void loadList();
    setActionMsg("Updated.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Question reports</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Student-flagged items with automated QA analysis, proposed fixes, and generation rules for future items.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-black/[0.08] px-3 py-2 text-sm"
        >
          <option value="open">Open</option>
          <option value="applied">Applied</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
          <option value="">All statuses</option>
        </select>
        <select
          value={examSlug}
          onChange={(e) => setExamSlug(e.target.value)}
          className="rounded-lg border border-black/[0.08] px-3 py-2 text-sm"
        >
          <option value="">All exams</option>
          {EXAM_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {EXAM_CATALOG[slug as ExamSlug].name}
            </option>
          ))}
        </select>
      </div>

      {error ? <InlineError>{error}</InlineError> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-black/[0.08] bg-white">
          <div className="border-b border-black/[0.06] px-4 py-3 text-sm font-medium">
            {loading ? "Loading…" : `${total} report(s)`}
          </div>
          <ul className="max-h-[32rem] divide-y divide-black/[0.06] overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full px-4 py-3 text-left text-sm transition hover:bg-black/[0.02] ${
                    selectedId === item.id ? "bg-black/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.examName ?? item.fieldId}</span>
                    <span className="text-xs uppercase text-black/45">{item.status}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[var(--color-ink-muted)]">
                    {item.stemPreview ?? "No stem preview"}
                  </p>
                  <p className="mt-1 text-xs text-black/45">
                    {reasonLabel(item.reason)} · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
            {!loading && items.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-[var(--color-ink-muted)]">
                No reports match these filters.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-4 sm:p-5">
          {!selectedId ? (
            <p className="text-sm text-[var(--color-ink-muted)]">Select a report to review analysis.</p>
          ) : detailLoading ? (
            <p className="text-sm text-[var(--color-ink-muted)]">Loading analysis…</p>
          ) : detail ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Origin</p>
                <p className="mt-1 text-sm font-medium">{detail.examName ?? detail.fieldId}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Field: {detail.fieldId}
                  {detail.subjectId ? ` · Subject: ${detail.subjectId}` : ""}
                  {detail.bankItemId ? ` · Bank ID: ${detail.bankItemId}` : ""}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Student report</p>
                <p className="mt-1 text-sm">{reasonLabel(detail.reason)}</p>
                {detail.message ? (
                  <p className="mt-2 rounded-lg bg-black/[0.03] p-3 text-sm">{detail.message}</p>
                ) : null}
                {detail.selectedAnswer ? (
                  <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                    Student selected: {detail.selectedAnswer}
                  </p>
                ) : null}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/45">System analysis</p>
                <p className="mt-1 text-sm">{detail.issueSummary}</p>
                <ul className="mt-3 space-y-2">
                  {detail.systemIssues.map((issue, i) => (
                    <li
                      key={`${issue.code}-${i}`}
                      className={`rounded-lg border px-3 py-2 text-xs ${severityClass(issue.severity)}`}
                    >
                      <span className="font-semibold">{issue.code}</span> — {issue.message}
                    </li>
                  ))}
                </ul>
              </div>

              {detail.proposedFix ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Proposed changes</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {detail.proposedFix.changeSummary.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {detail.proposedFix.changes.options ? (
                    <div className="mt-3 rounded-lg border border-black/[0.06] p-3 text-xs">
                      <p className="font-semibold">New options preview</p>
                      <ol className="mt-2 list-decimal pl-4">
                        {detail.proposedFix.changes.options.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {detail.generationNotes ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-black/45">
                    Rules for future generation
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/[0.03] p-3 text-xs leading-relaxed">
                    {detail.generationNotes}
                  </pre>
                </div>
              ) : null}

              {actionMsg ? <p className="text-sm text-[var(--color-ink-muted)]">{actionMsg}</p> : null}

              <div className="flex flex-wrap gap-2 border-t border-black/[0.06] pt-4">
                {detail.proposedFix?.autoApplicable && detail.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => void patchReport({ applyFix: true })}
                    className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
                  >
                    Apply auto-fix to bank
                  </button>
                ) : null}
                {detail.status === "open" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void patchReport({ status: "resolved" })}
                      className="rounded-full border border-black/[0.08] px-4 py-2 text-sm font-medium"
                    >
                      Mark resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => void patchReport({ status: "dismissed" })}
                      className="rounded-full border border-black/[0.08] px-4 py-2 text-sm font-medium"
                    >
                      Dismiss
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
