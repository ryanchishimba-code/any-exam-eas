"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { QuestionQualityRubricPanel } from "@/components/questions/QuestionQualityRubricPanel";
import type { QuestionQualityRating } from "@/lib/questions/quality-rubric";

export function QuestionQualitySection({ questionId }: { questionId: string }) {
  const [rating, setRating] = useState<QuestionQualityRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoImprove, setAutoImprove] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (persist = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internal/questions/quality/score", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: questionId, persist }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setRating(data.rating as QuestionQualityRating);
      setAutoImprove(Boolean(data.autoImproveRecommended));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    void load(true);
  }, [load]);

  return (
    <section className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-black/80">
          <Sparkles className="h-4 w-4 text-purple-600" aria-hidden />
          Board quality rubric
        </h3>
        <button
          type="button"
          onClick={() => void load(true)}
          disabled={loading}
          className="text-xs font-medium text-purple-700 hover:underline disabled:opacity-50"
        >
          Re-score
        </button>
      </div>

      {loading && !rating ? (
        <p className="text-sm text-black/50">Scoring against board criteria…</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {rating ? <QuestionQualityRubricPanel rating={rating} /> : null}
      {autoImprove && rating ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          AI improvement recommended — use the improvement prompt from the quality API or
          pipeline polish for weak distractors and rationale depth.
        </p>
      ) : null}
    </section>
  );
}
