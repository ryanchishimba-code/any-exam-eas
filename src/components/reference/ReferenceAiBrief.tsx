"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReferenceBriefSources } from "@/components/reference/ReferenceBriefSources";
import { practiceTopicHref, referenceTopicHref } from "@/lib/edtech/practice-links";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import type { ReferenceStudyBrief } from "@/lib/reference/study-brief-types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  onBriefLoaded?: (brief: ReferenceStudyBrief) => void;
};

const BRIEF_SURFACE =
  "rounded-2xl border border-white/40 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm";

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
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-bold shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

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
          throw new Error("Brief refresh limit reached. Cached content is still available.");
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

  const updatedLabel = brief
    ? new Date(brief.generatedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <section
      id="hub-brief"
      aria-labelledby="ai-brief-heading"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-black/10 p-5 shadow-[var(--shadow-apple-md)] sm:p-6",
        "bg-gradient-to-br text-white",
        theme.gradient
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/15" aria-hidden />
      <div
        className={cn("pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl", theme.orb)}
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p id="ai-brief-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                AI Study Brief
              </p>
              <p className="text-[11px] text-white/70">
                OER + guidelines · personalized · sources cited below
              </p>
            </div>
          </div>
          <BriefActionButton
            className={cn("h-9 rounded-full px-4", theme.ctaClass)}
            onClick={() => void load(true)}
            disabled={loading || (retryAfterSec != null && retryAfterSec > 0)}
          >
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} aria-hidden />
            {retryAfterSec != null && retryAfterSec > 0 ? `Wait ${retryAfterSec}s` : "Refresh"}
          </BriefActionButton>
        </div>

        {loading && !brief ? (
          <div className="mt-5 space-y-3" aria-busy="true" aria-label="Loading study brief">
            <div className="h-7 w-3/4 max-w-md animate-pulse rounded-lg bg-white/20" />
            <div className="h-4 w-full animate-pulse rounded bg-white/15" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/15" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        ) : error && !brief ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-white/90">{error}</p>
            <BriefActionButton className={cn("h-9 px-4", theme.ctaClass)} onClick={() => void load()}>
              Try again
            </BriefActionButton>
          </div>
        ) : brief ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5"
          >
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{brief.headline}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/90">{brief.summary}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {brief.aiPowered ? (
                <Badge className="border-slate-200 bg-white/95 text-slate-800">AI synthesized</Badge>
              ) : (
                <Badge className="border-slate-200 bg-white/95 text-slate-800">OER research</Badge>
              )}
              {brief.cached ? (
                <Badge className="border-slate-200 bg-white/95 text-slate-700">Cached</Badge>
              ) : null}
              {brief.sourceCount > 0 ? (
                <Badge className="border-slate-200 bg-white/95 text-slate-800">
                  {brief.sourceCount} sources
                </Badge>
              ) : null}
              {updatedLabel ? (
                <Badge className="border-slate-200 bg-white/95 text-slate-700">Updated {updatedLabel}</Badge>
              ) : null}
            </div>

            {error ? <p className="mt-2 text-xs text-white/75">{error}</p> : null}

            {brief.boardUpdates.length > 0 ? (
              <ul className={cn("mt-4 space-y-2 p-4", BRIEF_SURFACE)}>
                {brief.boardUpdates.slice(0, 5).map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-800">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            <ReferenceBriefSources sources={brief.sources} variant="dark" ctaClass={theme.ctaClass} />

            {brief.focusAreas.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {brief.focusAreas.map((area) => (
                  <div key={area.topicKey} className={cn("p-4", BRIEF_SURFACE)}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{area.topicName}</h3>
                      {area.masteryScore != null ? (
                        <span className="text-xs font-bold tabular-nums text-slate-600">
                          {area.masteryScore}%
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {area.pearls.slice(0, 2).map((pearl) => (
                        <li key={pearl} className="text-xs leading-relaxed text-slate-700">
                          {pearl}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <BriefActionButton
                        href={referenceTopicHref(examSlug, area.topicKey)}
                        className={cn("h-9 px-3 text-[11px]", theme.ctaClass)}
                      >
                        Memory cards
                      </BriefActionButton>
                      <BriefActionButton
                        href={practiceTopicHref(examSlug, area.topicKey, 10)}
                        className="h-9 border border-slate-300 bg-slate-100 px-3 text-[11px] text-slate-900 hover:bg-slate-200"
                      >
                        Practice 10
                      </BriefActionButton>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{area.studyAction}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
