"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { ReferenceBriefSources } from "@/components/reference/ReferenceBriefSources";
import { practiceTopicHref, referenceTopicHref } from "@/lib/edtech/practice-links";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { prepareBriefForDisplay } from "@/lib/reference/brief-display";
import type { ReferenceStudyBrief } from "@/lib/reference/study-brief-types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  onBriefLoaded?: (brief: ReferenceStudyBrief) => void;
};

const BRIEF_SURFACE =
  "rounded-xl border border-white/40 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm sm:rounded-2xl";

function BriefActionButton({
  children,
  className,
  href,
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-xs font-bold shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2";

  if (href) {
    return (
      <Link href={href} className={cn(base, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn(base, className)}>
      {children}
    </button>
  );
}

export function ReferenceAiBrief({ examSlug, onBriefLoaded }: Props) {
  const [brief, setBrief] = useState<ReferenceStudyBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const theme = EXAM_SELECTION_THEMES[examSlug];

  const display = useMemo(
    () => (brief ? prepareBriefForDisplay(brief) : null),
    [brief]
  );

  const load = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError(null);
      setRetryAfterSec(null);
      try {
        const qs = new URLSearchParams({ exam: examSlug });
        if (refresh) qs.set("refresh", "1");
        const res = await fetch(`/api/reference/brief?${qs.toString()}`);
        const data = (await res.json()) as { brief?: ReferenceStudyBrief; error?: string };

        if (res.status === 429) {
          const retry = Number(res.headers.get("Retry-After") ?? "30");
          setRetryAfterSec(Number.isFinite(retry) ? retry : 30);
          throw new Error("Refresh limit reached — showing your last brief.");
        }

        if (!res.ok) throw new Error(data.error ?? "Could not load study brief");

        const nextBrief = data.brief ?? null;
        setBrief(nextBrief);
        if (nextBrief) onBriefLoaded?.(nextBrief);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [examSlug, onBriefLoaded]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (retryAfterSec == null || retryAfterSec <= 0) return;
    const timer = window.setInterval(() => {
      setRetryAfterSec((s) => {
        if (s == null || s <= 1) {
          window.clearInterval(timer);
          return null;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAfterSec]);

  return (
    <section
      id="hub-brief"
      aria-labelledby="ai-brief-heading"
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[18px] border border-black/10 px-4 py-4 shadow-[var(--shadow-apple-md)] sm:rounded-[22px] sm:p-6",
        "bg-gradient-to-br text-white",
        theme.gradient
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/15" aria-hidden />
      <div
        className={cn("pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl", theme.orb)}
        aria-hidden
      />
      <div className="relative min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <p id="ai-brief-heading" className="text-sm font-bold tracking-tight sm:text-base">
              AI Study Brief
            </p>
          </div>
          <BriefActionButton
            className={cn("h-10 shrink-0 rounded-full px-4 sm:h-9", theme.ctaClass)}
            onClick={() => void load(true)}
            disabled={loading || (retryAfterSec != null && retryAfterSec > 0)}
          >
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} aria-hidden />
            {retryAfterSec != null && retryAfterSec > 0 ? `Wait ${retryAfterSec}s` : "Refresh"}
          </BriefActionButton>
        </div>

        {loading && !brief ? (
          <div className="mt-4 space-y-3 sm:mt-5" aria-busy="true" aria-label="Loading study brief">
            <div className="h-7 w-full max-w-md animate-pulse rounded-lg bg-white/20" />
            <div className="h-4 w-full animate-pulse rounded bg-white/15" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-white/10" />
              ))}
            </div>
          </div>
        ) : error && !brief ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm leading-relaxed text-white/90">{error}</p>
            <BriefActionButton className={cn("h-10 px-4 sm:h-9", theme.ctaClass)} onClick={() => void load()}>
              Try again
            </BriefActionButton>
          </div>
        ) : display ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-4 sm:mt-5"
          >
            <h2 className="text-lg font-bold leading-snug tracking-tight break-words sm:text-xl">
              {display.headline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed break-words text-white/90">{display.summary}</p>

            {display.metaLine ? (
              <p className="mt-2 text-[11px] text-white/65">{display.metaLine}</p>
            ) : null}

            {error ? <p className="mt-2 text-xs text-white/75">{error}</p> : null}

            {display.boardUpdates.length > 0 ? (
              <div className={cn("mt-4 p-3 sm:p-4", BRIEF_SURFACE)}>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Key points
                </p>
                <ul className="mt-2 space-y-2">
                  {display.boardUpdates.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed break-words text-slate-800">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {display.focusAreas.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {display.focusAreas.map((area) => (
                  <div key={area.topicKey} className={cn("min-w-0 p-3 sm:p-4", BRIEF_SURFACE)}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 flex-1 font-semibold leading-snug break-words text-slate-900">
                        {area.topicName}
                      </h3>
                      {area.masteryScore != null ? (
                        <span className="shrink-0 text-xs font-bold tabular-nums text-slate-600">
                          {area.masteryScore}%
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {area.pearls.map((pearl) => (
                        <li key={pearl} className="text-xs leading-relaxed break-words text-slate-700">
                          {pearl}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <BriefActionButton
                        href={practiceTopicHref(examSlug, area.topicKey, 10)}
                        className={cn("h-10 px-3 text-[11px] sm:h-9", theme.ctaClass)}
                      >
                        Practice 10
                      </BriefActionButton>
                      <BriefActionButton
                        href={referenceTopicHref(examSlug, area.topicKey)}
                        className="h-10 border border-slate-300 bg-slate-100 px-3 text-[11px] text-slate-900 hover:bg-slate-200 sm:h-9"
                      >
                        Memory cards
                      </BriefActionButton>
                    </div>
                    {area.showStudyAction ? (
                      <p className="mt-2 text-[11px] leading-relaxed break-words text-slate-600">
                        {area.studyAction}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {brief && brief.sources.length > 0 ? (
              <ReferenceBriefSources
                sources={brief.sources.slice(0, 8)}
                variant="dark"
                ctaClass={theme.ctaClass}
                extraCount={Math.max(0, brief.sources.length - 8)}
              />
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
