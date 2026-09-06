"use client";

import Link from "next/link";
import { anatomyHref, drugs300DrugHref } from "@/lib/edtech/practice-links-core";
import { labRowsForFlags } from "@/lib/nursing/lab-teaching-ranges";
import {
  NAPLEX_LAB_TEACHING_DISCLAIMER,
  naplexCalcPatternsForFlags,
  naplexLabRowsForFlags,
} from "@/lib/pharmacy/lab-teaching-ranges";
import { naplexDomainByNumber } from "@/lib/pharmacy/naplex-outline-2025";
import type { MasteryItemTags } from "@/lib/engine/mastery/types";
import type { ExamSlug } from "@/types/edtech";

/**
 * In-pane attachments on miss — Top 509 / Anatomy / Labs / Calc patterns
 * without navigating away. Domain chip shown for NAPLEX even before miss.
 */
export function MasteryMissAttachments({
  tags,
  examSlug = "nclex",
  missed,
}: {
  tags?: MasteryItemTags | null;
  examSlug?: ExamSlug;
  missed: boolean;
}) {
  if (!tags) return null;

  const isNaplex = examSlug === "naplex";
  const domain = tags.naplexDomain ? naplexDomainByNumber(tags.naplexDomain) : null;
  const labs = isNaplex
    ? naplexLabRowsForFlags(tags.labFlags)
    : labRowsForFlags(tags.labFlags);
  const calcs = isNaplex ? naplexCalcPatternsForFlags(tags.calcFlags) : [];
  const drugs = tags.drugIds ?? [];
  const anatomyId = tags.anatomyId;

  const chipOnly =
    !missed &&
    isNaplex &&
    (Boolean(domain) || Boolean(tags.naplexSubtopic));

  if (!missed && !chipOnly) return null;

  const hasAnything =
    drugs.length > 0 || Boolean(anatomyId) || labs.length > 0 || calcs.length > 0;
  if (
    missed &&
    !hasAnything &&
    !tags.clientNeeds &&
    !tags.cjmmFunction &&
    !domain
  ) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/80 p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        {domain ? (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
            Domain {domain.domain}: {domain.label}
          </span>
        ) : null}
        {tags.naplexSubtopic ? (
          <span className="rounded-full bg-[var(--color-border)]/40 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-muted)]">
            {tags.naplexSubtopic.replace(/-/g, " ")}
          </span>
        ) : null}
        {tags.clientNeeds ? (
          <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
            Client Needs: {tags.clientNeeds.replace(/-/g, " ")}
          </span>
        ) : null}
        {tags.cjmmFunction ? (
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800 dark:text-indigo-200">
            CJMM: {tags.cjmmFunction.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>

      {missed && hasAnything ? (
        <p className="text-[12px] font-semibold text-[var(--color-ink)]">
          Attachments for this miss
        </p>
      ) : null}

      {missed && drugs.length > 0 ? (
        <ul className="space-y-1 text-[12px] text-[var(--color-ink-muted)]">
          {drugs.slice(0, 4).map((slug) => (
            <li key={slug}>
              <Link
                href={drugs300DrugHref(slug)}
                className="font-medium text-[var(--color-accent)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Top 509: {slug.replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {missed && anatomyId ? (
        <p className="text-[12px]">
          <Link
            href={anatomyHref(examSlug, anatomyId)}
            className="font-medium text-[var(--color-accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anatomy: {anatomyId.replace(/-/g, " ")}
          </Link>
        </p>
      ) : null}

      {missed && labs.length > 0 ? (
        <ul className="space-y-2 text-[12px] text-[var(--color-ink-muted)]">
          {isNaplex ? (
            <li className="text-[11px] italic text-[var(--color-ink-muted)]">
              {NAPLEX_LAB_TEACHING_DISCLAIMER}
            </li>
          ) : null}
          {labs.map((lab) => {
            const name = "name" in lab ? lab.name : lab.label;
            const action =
              "firstNurseAction" in lab
                ? lab.firstNurseAction
                : "note" in lab
                  ? lab.note
                  : null;
            return (
              <li key={lab.id} className="rounded-lg bg-black/[0.03] px-2.5 py-2">
                <p className="font-semibold text-[var(--color-ink)]">
                  {name}{" "}
                  <span className="font-normal text-[var(--color-ink-muted)]">
                    ({lab.teachingRange}
                    {"unit" in lab && lab.unit ? ` ${lab.unit}` : ""})
                  </span>
                </p>
                {action ? <p className="mt-0.5">{action}</p> : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {missed && calcs.length > 0 ? (
        <div className="rounded-lg bg-black/[0.03] px-2.5 py-2">
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">
            Calc pattern (Deep Dive beat 2)
          </p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-[var(--color-ink-muted)]">
            {calcs.map((c) => (
              <li key={c.id}>• {c.label}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
