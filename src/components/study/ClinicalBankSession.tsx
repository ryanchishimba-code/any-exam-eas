"use client";

import { useMemo, useRef, useState } from "react";
import { CaseStudyPlayer } from "@/components/ngn/CaseStudyPlayer";
import { InlineBold } from "@/components/ngn/InlineBold";
import { ItemRenderer } from "@/components/ngn/ItemRenderer";
import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import type { ClinicalSessionPayload } from "@/lib/assessment/clinical-session";
import { draftForNgnItem } from "@/lib/assessment/attempt-grade";
import type { NgnItem } from "@/lib/assessment/types";
import type { SessionAttemptDraft } from "@/lib/learning/session-attempt-plan";
import { SessionCompletionCard, SessionPersistGate } from "@/components/study/SessionCompletionCard";
import type { SessionReceipt } from "@/components/study/SessionCompletionCard";

type Props = {
  session: ClinicalSessionPayload;
  mode?: "tutor" | "timed";
  reviewQueue?: boolean;
  onExit: () => void;
};

type UnitPhase = "answer" | "review";

function caseKey(id: string, version: number): string {
  return `${id}:${version}`;
}

export function ClinicalBankSession({ session, reviewQueue = false, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<UnitPhase>("answer");
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [revealed, setRevealed] = useState<Record<string, NgnItem>>({});
  const [drafts, setDrafts] = useState<SessionAttemptDraft[]>([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [receipt, setReceipt] = useState<SessionReceipt | null>(null);
  const [sessionId] = useState(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `ngn-${Date.now()}`;
  });

  const unit = session.units[index];
  const total = session.units.length;
  const label = session.practiceFormat === "case" ? "Case" : "Item";

  const summary = useMemo(() => {
    const correct = drafts.filter((draft) => draft.correct).length;
    return {
      correct,
      total: drafts.length,
      accuracy: drafts.length > 0 ? Math.round((correct / drafts.length) * 100) : 0,
    };
  }, [drafts]);

  async function revealItems(items: NgnItem[], subjectId: string | null, responseMap: Record<string, unknown>) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      const duration = Math.max(0, Date.now() - startedAt);
      const perItem = Math.round(duration / Math.max(1, items.length));
      const nextRevealed: Record<string, NgnItem> = {};
      const nextDrafts: SessionAttemptDraft[] = [];
      for (const item of items) {
        const response = responseMap[item.id] ?? null;
        const res = await fetch("/api/study/ngn-reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id, version: item.version, response }),
        });
        const data = (await res.json().catch(() => ({}))) as { item?: NgnItem; error?: string };
        if (!res.ok || !data.item) {
          throw new Error(data.error || "Could not score this item.");
        }
        nextRevealed[item.id] = data.item;
        nextDrafts.push(
          draftForNgnItem({
            item: data.item,
            response,
            subjectId,
            durationMs: perItem,
            tags: subjectId ? [`subject:${subjectId}`] : [],
          })
        );
      }
      setRevealed((current) => ({ ...current, ...nextRevealed }));
      setDrafts((current) => [...current, ...nextDrafts]);
      setPhase("review");
    } catch (revealError) {
      setError(revealError instanceof Error ? revealError.message : "Could not score this item.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  async function finish(allDrafts: SessionAttemptDraft[]) {
    setSaving("saving");
    setError(null);
    try {
      const res = await fetch("/api/study/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: {
            sessionId,
            sourceType: "bank",
            field: session.fieldId,
            subjectId: session.subjectId,
            mode: reviewQueue ? "review" : "practice",
            practiceFormat: session.practiceFormat,
          },
          attempts: allDrafts,
          completed: true,
          score: allDrafts.length
            ? Math.round((allDrafts.filter((draft) => draft.correct).length / allDrafts.length) * 100)
            : 0,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as SessionReceipt & {
        error?: string;
        persisted?: boolean;
        attemptsSaved?: number;
      };
      if (!res.ok || data.persisted !== true || data.attemptsSaved !== allDrafts.length) {
        throw new Error(data.error || "Could not save this session. Analytics will stay empty until it saves.");
      }
      setReceipt(data);
      setSaving("done");
    } catch (saveError) {
      setSaving("error");
      setError(saveError instanceof Error ? saveError.message : "Could not save this session.");
    }
  }

  function advance(allDrafts: SessionAttemptDraft[]) {
    if (index + 1 >= total) {
      void finish(allDrafts);
      return;
    }
    setIndex((value) => value + 1);
    setPhase("answer");
    setStartedAt(Date.now());
    setError(null);
  }

  if (saving === "saving" || saving === "error") {
    return (
      <SessionPersistGate
        state={saving}
        error={error}
        onRetry={() => void finish(drafts)}
      />
    );
  }

  if (saving === "done" && receipt) {
    return (
      <SessionCompletionCard
        title={session.practiceFormat === "case" ? "Case set complete" : "NGN set complete"}
        subtitle="Partial credit follows the item's scoring rule. Full credit counts as correct."
        summary={summary}
        receipt={receipt}
        onReview={onExit}
        reviewLabel="Back to question bank"
      />
    );
  }

  if (!unit) return null;

  const progress = (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D4C8]">
      {label} {index + 1} of {total}
    </p>
  );

  if (unit.kind === "standalone") {
    const item = revealed[unit.item.id] ?? unit.item;
    const response = responses[unit.item.id];
    return (
      <section className="mx-auto w-full max-w-3xl pb-8 text-[#0A2540]">
        {progress}
        <div className="mt-4 rounded-3xl border border-[#e2e8f0] bg-white p-5 sm:p-6">
          <h2 className="text-[19px] font-semibold leading-7 tracking-tight">
            <InlineBold text={item.stem} />
          </h2>
          <div className="mt-5">
            <ItemRenderer
              item={item}
              seed={`${sessionId}:${item.id}`}
              response={response}
              onChange={(next) => setResponses((current) => ({ ...current, [item.id]: next }))}
              disabled={phase === "review" || pending}
              showRationale={phase === "review"}
              sourcesById={session.sourcesById}
            />
          </div>
          {error ? <p className="mt-4 text-sm text-[#9f1239]">{error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {phase === "answer" ? (
              <button
                type="button"
                disabled={pending}
                className={`min-h-11 rounded-full bg-[#0A2540] px-5 text-sm font-semibold text-white disabled:opacity-60 ${ngnFocus}`}
                onClick={() => void revealItems([unit.item], unit.subjectId, { [unit.item.id]: response ?? null })}
              >
                {pending ? "Scoring…" : "Check answer"}
              </button>
            ) : (
              <button
                type="button"
                className={`min-h-11 rounded-full bg-[#0A2540] px-5 text-sm font-semibold text-white ${ngnFocus}`}
                onClick={() => advance(drafts)}
              >
                {index + 1 >= total ? "Finish" : "Next"}
              </button>
            )}
          </div>
        </div>
        <p className={`mt-4 text-sm ${ngnMuted}`}>
          {session.practiceFormat === "ngn" ? "Bow-tie and trend items are scored one at a time." : ""}
        </p>
      </section>
    );
  }

  const items = unit.items.map((item) => revealed[item.id] ?? item);
  const references = session.caseReferences[caseKey(unit.caseDoc.id, unit.caseDoc.version)] ?? unit.caseDoc.references;
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 max-lg:sticky max-lg:top-[var(--nav-height)] max-lg:z-20 max-lg:mb-0 max-lg:bg-[var(--color-bg)] max-lg:pb-4 max-lg:pt-1">
        {progress}
        <p className={`text-sm max-lg:min-w-0 max-lg:flex-1 ${ngnMuted}`}>{unit.caseDoc.title}</p>
      </div>
      <CaseStudyPlayer
        key={`${unit.caseDoc.id}:${unit.caseDoc.version}`}
        caseDoc={{ ...unit.caseDoc, references, items }}
        items={items}
        mode={phase === "review" ? "review" : "exam"}
        attemptSeed={`${sessionId}:${unit.caseDoc.id}`}
        initialResponses={responses}
        sourcesById={session.sourcesById}
        rationaleVisible={phase === "review"}
        busy={pending}
        onSubmit={
          phase === "answer"
            ? (next) => {
                setResponses((current) => ({ ...current, ...next }));
                void revealItems(unit.items, unit.subjectId, next);
              }
            : undefined
        }
      />
      {error ? <p className="mt-4 text-sm text-[#9f1239]">{error}</p> : null}
      {phase === "review" ? (
        <div className="mt-4">
          <button
            type="button"
            className={`min-h-11 rounded-full bg-[#0A2540] px-5 text-sm font-semibold text-white ${ngnFocus}`}
            onClick={() => advance(drafts)}
          >
            {index + 1 >= total ? "Finish" : "Next case"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
