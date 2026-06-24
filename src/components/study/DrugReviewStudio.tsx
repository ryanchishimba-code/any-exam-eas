"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutGrid,
  Pill,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import type { DrugCardDto, DrugClassId, DrugReviewDashboard, ReviewGrade } from "@/lib/drugs300";
import { GRADE_LABELS } from "@/lib/drugs300";
import { DrugClassFilter, DrugClassFilterPills } from "@/components/study/DrugClassFilter";
import { DrugFlashcard } from "@/components/study/DrugFlashcard";
import { DrugSearch } from "@/components/study/DrugSearch";
import { DrugSearchPreview } from "@/components/study/DrugSearchPreview";
import { InlineError } from "@/components/ui/StatusMessage";
import { getDrugSearchHitById, type DrugSearchHit } from "@/lib/drugs300/search";
import { EndActivityControl } from "./EndActivityControl";
import { ActivitySessionToolbar } from "./ActivitySessionToolbar";
import type { ActivitySessionSummary } from "@/lib/client/exam-session-summary";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

const GRADES: ReviewGrade[] = [0, 1, 2, 3];

export function DrugReviewStudio() {
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DrugReviewDashboard | null>(null);
  const [cards, setCards] = useState<DrugCardDto[]>([]);
  const [activeClass, setActiveClass] = useState<DrugClassId>("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [mnemonicLoading, setMnemonicLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<DrugSearchHit | null>(null);

  const current = cards[index];
  const activeClassStats = dashboard?.classProgress.find((c) => c.id === activeClass);

  const loadCards = useCallback(async (classId: DrugClassId) => {
    setCardsLoading(true);
    try {
      const dueRes = await fetch(
        `/api/drugs300/due?limit=30&class=${encodeURIComponent(classId)}`
      );
      const dueData = await dueRes.json();
      if (!dueRes.ok) throw new Error(dueData.error ?? "Failed to load cards");
      setCards(dueData.cards ?? []);
      setIndex(0);
      setFlipped(false);
      setMnemonic(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading cards");
    } finally {
      setCardsLoading(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const progressRes = await fetch("/api/drugs300/progress");
      const progressData = await progressRes.json();
      if (!progressRes.ok) throw new Error(progressData.error ?? "Failed to load progress");
      setDashboard(progressData);
      await loadCards(activeClass);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading drug review");
    } finally {
      setLoading(false);
    }
  }, [activeClass, loadCards]);

  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- initial load only

  useEffect(() => {
    const drugId = searchParams.get("drug");
    if (!drugId) return;
    const hit = getDrugSearchHitById(drugId);
    if (hit) setSelectedDrug(hit);
  }, [searchParams]);

  const handleDrugSelect = useCallback((drug: DrugSearchHit) => {
    setSelectedDrug(drug);
  }, []);

  async function selectClass(classId: DrugClassId) {
    if (classId === activeClass) return;
    setActiveClass(classId);
    setError("");
    await loadCards(classId);
    const progressRes = await fetch("/api/drugs300/progress");
    const progressData = await progressRes.json();
    if (progressRes.ok) setDashboard(progressData);
  }

  async function submitGrade(grade: ReviewGrade) {
    if (!current || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/drugs300/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugId: current.drugId, grade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Review failed");

      const progressRes = await fetch("/api/drugs300/progress");
      const progressData = await progressRes.json();
      if (progressRes.ok) setDashboard(progressData);

      setFlipped(false);
      setMnemonic(null);
      if (index < cards.length - 1) {
        setIndex((i) => i + 1);
      } else {
        await loadCards(activeClass);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error saving review");
    } finally {
      setSubmitting(false);
    }
  }

  async function fetchMnemonic() {
    if (!current || mnemonicLoading) return;
    setMnemonicLoading(true);
    setError("");
    try {
      const res = await fetch("/api/drugs300/mnemonic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugId: current.drugId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Mnemonic failed");
      setMnemonic(data.mnemonic ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate mnemonic");
    } finally {
      setMnemonicLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="aee-drugs-skeleton h-32 rounded-2xl" />
        <div className="aee-drugs-skeleton h-[420px] rounded-3xl" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <InlineError className="mt-8">
        {error || "Unable to load drug review."}
      </InlineError>
    );
  }

  const { cycle, stats, classProgress } = dashboard;

  return (
    <div className="mt-6 space-y-6">
      {dashboard.resetApplied && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          <RefreshCw className="mr-2 inline h-4 w-4" aria-hidden />
          New quarterly cycle — progress reset for {cycle.key}.
        </div>
      )}

      <div className="space-y-4">
        <DrugSearch onSelect={handleDrugSelect} portaled={false} />
        {selectedDrug && (
          <DrugSearchPreview drug={selectedDrug} onClose={() => setSelectedDrug(null)} />
        )}
      </div>

      {/* Cycle overview */}
      <div className="aee-drugs-progress-card rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-700">
              {cycle.label}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <CalendarClock className="h-4 w-4 text-teal-600" aria-hidden />
              {cycle.daysRemaining} days left in cycle · spaced repetition active
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-teal-700">
              {stats.progressPct}%
            </p>
            <p className="text-xs text-slate-500">{stats.mastered} of {stats.total} mastered</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-teal-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700"
            style={{ width: `${stats.progressPct}%` }}
          />
        </div>
      </div>

      {error && <InlineError>{error}</InlineError>}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        {/* Class sidebar — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
            <p className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              Drug class
            </p>
            <DrugClassFilter
              classes={classProgress}
              activeClass={activeClass}
              onSelect={(id) => void selectClass(id)}
            />
          </div>
        </aside>

        {/* Main flashcard area */}
        <div className="min-w-0 space-y-5">
          {/* Mobile class pills */}
          <div className="lg:hidden">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter by class
            </p>
            <DrugClassFilterPills
              classes={classProgress}
              activeClass={activeClass}
              onSelect={(id) => void selectClass(id)}
            />
          </div>

          {activeClassStats && activeClass !== "all" && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: activeClassStats.color }}
                aria-hidden
              />
              <span className="text-sm font-semibold text-slate-900">
                {activeClassStats.label}
              </span>
              <span className="text-sm text-slate-500">
                {activeClassStats.mastered}/{activeClassStats.total} mastered ·{" "}
                {activeClassStats.due} due
              </span>
              <div className="ml-auto h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${activeClassStats.progressPct}%`,
                    backgroundColor: activeClassStats.color,
                  }}
                />
              </div>
            </div>
          )}

          {cardsLoading ? (
            <div className="aee-drugs-skeleton mx-auto h-[420px] max-w-lg rounded-3xl" />
          ) : !current ? (
            <div className="rounded-2xl border border-teal-100 bg-white p-12 text-center">
              <Pill className="mx-auto h-12 w-12 text-teal-500" aria-hidden />
              <p className="mt-4 text-lg font-semibold text-slate-900">
                All caught up{activeClass !== "all" ? " in this class" : ""}!
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Spaced repetition will schedule your next review. Try another class or check back
                later.
              </p>
            </div>
          ) : (
            <>
              <ActivitySessionToolbar
                variant="teal"
                className="top-[calc(var(--nav-height)+4.25rem)]"
                actions={
                  <>
                    <Link
                      href={STUDY_HUB_PATH}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/80 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 transition hover:bg-teal-100"
                    >
                      <LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="hidden sm:inline">Study Hub</span>
                      <span className="sm:hidden">Hub</span>
                    </Link>
                    <EndActivityControl
                      kind="activity"
                      variant="teal"
                      onConfirm={async (): Promise<ActivitySessionSummary> => {
                        /* Graded cards persist via /api/drugs300/review on each grade */
                        return {
                          title: "Top 500 Drugs",
                          activityType: "drugs",
                          reviewed: stats.reviewed,
                          mastered: stats.mastered,
                          total: stats.total,
                          progressPct: stats.progressPct,
                          endedEarly: true,
                        };
                      }}
                    />
                  </>
                }
              >
                <div className="text-sm text-slate-600">
                  <span>
                    Card {index + 1} of {cards.length}
                    {current.due && (
                      <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                        Due
                      </span>
                    )}
                  </span>
                  <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                    Interval:{" "}
                    {current.intervalDays > 0 ? `${Math.round(current.intervalDays)}d` : "new"}
                  </p>
                </div>
              </ActivitySessionToolbar>

              <DrugFlashcard
                card={current}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                mnemonic={mnemonic}
                onGenerateMnemonic={() => void fetchMnemonic()}
                mnemonicLoading={mnemonicLoading}
              />

              <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    setIndex((i) => i - 1);
                    setFlipped(false);
                    setMnemonic(null);
                  }}
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFlipped(false);
                    setMnemonic(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Reset flip
                </button>
                <button
                  type="button"
                  disabled={index >= cards.length - 1}
                  onClick={() => {
                    setIndex((i) => i + 1);
                    setFlipped(false);
                    setMnemonic(null);
                  }}
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
                  aria-label="Next card"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {flipped && (
                <div className="mx-auto max-w-lg space-y-3">
                  <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Spaced repetition — how well did you know it?
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {GRADES.map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        disabled={submitting}
                        onClick={() => void submitGrade(grade)}
                        aria-label={`Grade: ${GRADE_LABELS[grade]}`}
                        className={`a11y-grade-btn a11y-grade-btn--${grade}`}
                      >
                        {GRADE_LABELS[grade]}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-[0.6875rem] text-slate-400">
                    Again → review soon · Easy → longer interval
                  </p>
                </div>
              )}

              {!flipped && (
                <div className="mx-auto max-w-lg">
                  <button
                    type="button"
                    onClick={() => setFlipped(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:brightness-110"
                  >
                    Flip card
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">{cycle.refreshNote}</p>
    </div>
  );
}
