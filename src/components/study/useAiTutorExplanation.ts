"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AIExplanation } from "@/lib/core/types";
import type { LearningInsight } from "@/lib/learning/types";
import { mergeAiTutorInsight } from "@/lib/learning/merge-ai-insight";
import type { AiTutorRequest } from "./ai-tutor-types";

type State = {
  loading: boolean;
  error: string | null;
  source: "ai" | "fallback" | null;
  insight: LearningInsight | null;
};

type Options = {
  /** On NCLEX/NAPLEX/USMLE misses, fetch AI coaching immediately. */
  autoFetchOnMiss?: boolean;
  correct?: boolean;
};

export function useAiTutorExplanation(
  baseInsight: LearningInsight,
  request: AiTutorRequest | null,
  options: Options = {}
) {
  const { autoFetchOnMiss = false, correct = false } = options;
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    source: null,
    insight: null,
  });
  const abortRef = useRef<AbortController | null>(null);
  const aiRawRef = useRef<AIExplanation | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    aiRawRef.current = null;
    setState({ loading: false, error: null, source: null, insight: null });
  }, [request?.questionId]);

  useEffect(() => {
    if (!aiRawRef.current) return;
    setState((prev) => ({
      ...prev,
      insight: mergeAiTutorInsight(baseInsight, aiRawRef.current!),
    }));
  }, [baseInsight]);

  const fetchExplanation = useCallback(async () => {
    if (!request) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch("/api/learning/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        explanation?: AIExplanation;
        source?: "ai" | "fallback";
      };

      if (!res.ok) {
        if (res.status === 403 && data.code === "PRO_FEATURE_REQUIRED") {
          throw new Error("Upgrade to Pro to unlock AI Tutor coaching.");
        }
        throw new Error(data.error ?? "AI Tutor unavailable");
      }

      if (!data.explanation) {
        throw new Error("AI Tutor returned an empty response");
      }

      aiRawRef.current = data.explanation;
      setState({
        loading: false,
        error: null,
        source: data.source ?? "ai",
        insight: mergeAiTutorInsight(baseInsight, data.explanation),
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setState({
        loading: false,
        error: e instanceof Error ? e.message : "AI Tutor failed",
        source: null,
        insight: null,
      });
    }
  }, [baseInsight, request]);

  useEffect(() => {
    if (!autoFetchOnMiss || correct || !request) return;
    if (state.source || state.loading) return;
    void fetchExplanation();
  }, [
    autoFetchOnMiss,
    correct,
    request,
    state.source,
    state.loading,
    fetchExplanation,
  ]);

  return {
    ...state,
    displayInsight: state.insight ?? baseInsight,
    fetchExplanation,
    canFetch: Boolean(request),
    hasAiEnhancement: state.source != null,
  };
}
