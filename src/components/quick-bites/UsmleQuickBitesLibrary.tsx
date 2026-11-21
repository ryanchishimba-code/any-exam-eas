"use client";

import { useState } from "react";
import Link from "next/link";
import { UsmleBiteDiagram } from "@/components/quick-bites/usmle-diagrams";
import {
  usmleQuickBiteGroups,
  usmleQuickBiteHref,
  type UsmleQuickBite,
  type UsmleQuickBiteStep,
  USMLE_QUICK_BITE_STEP_CHOICES,
} from "@/lib/quick-bites/usmle-bites";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

/**
 * Same library chrome as Video Quick Bites: eyebrow, title, two-column grid,
 * numbered rows. The pane is the bite, because these are not videos.
 */
export function UsmleQuickBitesLibrary({
  step,
  bites,
  canReadAll,
  preview,
}: {
  step: UsmleQuickBiteStep;
  bites: UsmleQuickBite[];
  canReadAll: boolean;
  preview: boolean;
}) {
  const groups = usmleQuickBiteGroups(bites);
  const firstOpen = bites.find((bite) => bite.open) ?? bites[0] ?? null;
  const [activeId, setActiveId] = useState<string | null>(firstOpen?.id ?? null);
  const active = bites.find((bite) => bite.id === activeId) ?? null;
  const readable = active ? canReadAll || active.open : false;

  return (
    <section
      id="usmle-quick-bites"
      aria-labelledby="usmle-quick-bites-heading"
      className={cn(dbUi.surface, "scroll-mt-28 space-y-5 p-4 sm:p-6")}
    >
      <div className="space-y-2">
        <p className={dbUi.eyebrow}>Quick Bites by AnyExamEasy</p>
        <h1
          id="usmle-quick-bites-heading"
          className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
        >
          Quick Bites: USMLE
        </h1>
        <p className={dbUi.subtitle}>
          One decision, one number, or one mechanism. About a minute each.
        </p>
        {preview ? (
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            Admin preview. Students cannot see this. Nothing here is live.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2" role="navigation" aria-label="USMLE Step">
        {USMLE_QUICK_BITE_STEP_CHOICES.map((choice) => {
          const current = choice.id === step;
          return (
            <Link
              key={choice.id}
              href={usmleQuickBiteHref(choice.id)}
              aria-current={current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-semibold",
                current
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[var(--db-line,var(--color-border))]/80 text-[var(--color-ink)] hover:border-[var(--color-accent)]/40"
              )}
            >
              {choice.label}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.8fr)] lg:gap-x-6">
        <div
          id="quick-bites-player"
          className="min-w-0 rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--color-surface)] p-4 sm:p-5"
        >
          {active && readable ? <BiteBody bite={active} /> : <LockedBite />}
        </div>
        <div className="min-w-0 lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:max-h-[calc(100dvh-var(--nav-height)-2rem)] lg:overflow-y-auto lg:pr-1">
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="mb-2.5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                  {group.title}
                </h2>
                <ul className="grid grid-cols-1 gap-2">
                  {group.bites.map((bite) => {
                    const selected = bite.id === active?.id;
                    return (
                      <li key={bite.id}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Read ${bite.number}. ${bite.title}`}
                          onClick={() => setActiveId(bite.id)}
                          className={cn(
                            "flex min-h-11 w-full items-start gap-2 rounded-2xl border bg-[var(--color-surface)] px-3 py-2.5 text-left transition hover:border-[var(--color-accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                            selected
                              ? "border-[var(--color-accent)]"
                              : "border-[var(--db-line,var(--color-border))]/80"
                          )}
                        >
                          <span className="w-8 shrink-0 pt-0.5 text-[13px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                            {bite.number}
                          </span>
                          <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)] lg:text-[14px]">
                            {bite.title}
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-[var(--color-ink-muted)] lg:text-[12px]">
                            {canReadAll || bite.open ? bite.read : "Locked"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BiteBody({ bite }: { bite: UsmleQuickBite }) {
  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          {bite.group}
          <span className="px-1.5" aria-hidden>
            ·
          </span>
          {bite.read}
        </p>
        <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[22px]">
          {bite.title}
        </h2>
        <p className="text-[16px] font-medium leading-relaxed text-[var(--color-ink)]">{bite.lead}</p>
      </header>
      {bite.diagram && bite.diagramAlt ? (
        <UsmleBiteDiagram id={bite.diagram} alt={bite.diagramAlt} />
      ) : null}
      <ul className="space-y-2">
        {bite.lines.map((line) => (
          <li key={line} className="text-[14px] leading-relaxed text-[var(--color-ink)]">
            {line}
          </li>
        ))}
      </ul>
      <p className="rounded-2xl bg-[var(--color-accent)]/10 px-3 py-2.5 text-[14px] leading-relaxed text-[var(--color-ink)]">
        <span className="font-semibold">The usual miss. </span>
        {bite.miss}
      </p>
      <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        <a
          href={bite.source.url}
          className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-border)] underline-offset-2 hover:text-[var(--color-accent)]"
        >
          {bite.source.name}
        </a>{" "}
        ({bite.source.year}). {bite.source.says}
      </p>
      {bite.source.more && bite.source.more.length > 0 ? (
        <ul className="space-y-1">
          {bite.source.more.map((item) => (
            <li key={item.url} className="text-[12px] leading-relaxed">
              <a
                href={item.url}
                className="text-[var(--color-ink-muted)] underline decoration-[var(--color-border)] underline-offset-2 hover:text-[var(--color-accent)]"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function LockedBite() {
  return (
    <div className="flex min-h-40 flex-col justify-center gap-2">
      <p className="text-[16px] font-semibold text-[var(--color-ink)]">This bite is part of the paid library.</p>
      <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
        The open sample on this Step can be read without a subscription.
      </p>
    </div>
  );
}
