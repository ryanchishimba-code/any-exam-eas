"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Bone, ChevronDown, Stethoscope } from "lucide-react";
import {
  anatomyStructureHref,
  drugUsedAsFirstLine,
  getClinicalContextForDrug,
} from "@/lib/anatomy/clinical-links";
import { getAnatomyStructure } from "@/lib/anatomy";
import { cn } from "@/lib/utils";

type Props = {
  drugId: string;
  compact?: boolean;
  variant?: "light" | "dark";
  /** Collapse links behind a toggle — keeps Top 500 layout tidy. */
  collapsible?: boolean;
};

/** Reverse bridge: drug card → anatomy structures, diseases, and endpoints. */
export function DrugClinicalBridge({
  drugId,
  compact = false,
  variant = "light",
  collapsible = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const ctx = getClinicalContextForDrug(drugId);
  if (ctx.diseases.length === 0) return null;

  const topDiseases = ctx.diseases.slice(0, compact ? 2 : 4);
  const dark = variant === "dark";
  const structureCount = ctx.structureIds.length;
  const diseaseCount = ctx.diseases.length;

  const sectionClass = compact
    ? dark
      ? "rounded-xl border border-cyan-400/25 bg-cyan-950/40 p-3"
      : "rounded-xl border border-indigo-100 bg-indigo-50/50 p-3"
    : dark
      ? "rounded-2xl border border-cyan-400/25 bg-cyan-950/40 p-4"
      : "rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-4";

  const hintClass = dark ? "text-cyan-100/70" : "text-slate-500";
  const chevronClass = dark ? "text-cyan-200" : "text-indigo-600";

  const summaryParts: string[] = [];
  if (structureCount > 0) {
    summaryParts.push(`${structureCount} structure${structureCount === 1 ? "" : "s"}`);
  }
  summaryParts.push(`${diseaseCount} disease link${diseaseCount === 1 ? "" : "s"}`);

  const linksBody = (
    <>
      {structureCount > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {ctx.structureIds.map((structureId) => {
            const structure = getAnatomyStructure(structureId);
            if (!structure) return null;
            return (
              <Link
                key={structureId}
                href={anatomyStructureHref(structureId)}
                className={
                  dark
                    ? "inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-900/50 px-2.5 py-1 text-xs font-medium text-cyan-50 transition hover:bg-cyan-800/60"
                    : "inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-800 transition hover:bg-indigo-100"
                }
              >
                {structure.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      <ul className={`space-y-2 ${structureCount > 0 ? "mt-3" : ""} ${compact ? "" : "space-y-3"}`}>
        {topDiseases.map((disease) => {
          const role = drugUsedAsFirstLine(disease, drugId) ? "First-line" : "Adjunct";
          const primaryStructure = disease.structureIds[0];
          return (
            <li
              key={disease.id}
              className={
                dark
                  ? "rounded-xl border border-cyan-400/20 bg-cyan-950/30 px-3 py-2.5"
                  : "rounded-xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-sm"
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <Stethoscope
                  className={`h-3.5 w-3.5 ${dark ? "text-cyan-300" : "text-indigo-500"}`}
                  aria-hidden
                />
                <span className={`text-sm font-semibold ${dark ? "text-cyan-50" : "text-slate-900"}`}>
                  {disease.name}
                </span>
                <span
                  className={
                    dark
                      ? "rounded-full bg-cyan-800/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-100"
                      : "rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-800"
                  }
                >
                  {role}
                </span>
                {disease.generated ? (
                  <span
                    className={
                      dark
                        ? "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-cyan-100/80"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    }
                  >
                    Auto-linked
                  </span>
                ) : null}
              </div>
              {!compact && disease.guidelines && disease.guidelines.length > 0 ? (
                <p
                  className={`mt-1.5 text-[10px] leading-snug ${
                    dark ? "text-cyan-100/70" : "text-slate-500"
                  }`}
                >
                  {disease.guidelines
                    .slice(0, 2)
                    .map((g) => g.label)
                    .join(" · ")}
                </p>
              ) : null}
              {!compact && disease.diagnosticEndpoints && disease.diagnosticEndpoints.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {disease.diagnosticEndpoints.slice(0, 2).map((ep) => (
                    <span
                      key={ep.label}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700"
                    >
                      <Activity className="h-3 w-3" aria-hidden />
                      {ep.label}
                      {ep.target ? `: ${ep.target}` : ""}
                    </span>
                  ))}
                </div>
              ) : null}
              {primaryStructure ? (
                <Link
                  href={anatomyStructureHref(primaryStructure)}
                  className={`mt-2 inline-block text-xs font-medium hover:underline ${
                    dark ? "text-cyan-200" : "text-indigo-700"
                  }`}
                >
                  View in 3D explorer →
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>

      {compact && diseaseCount > 2 ? (
        <p className={`mt-2 text-[10px] ${hintClass}`}>
          +{diseaseCount - 2} more disease links — search drug for full preview
        </p>
      ) : null}
    </>
  );

  if (collapsible) {
    return (
      <section className={sectionClass} aria-label="Anatomy and disease connections">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <Bone className={`h-4 w-4 shrink-0 ${dark ? "text-cyan-300" : "text-indigo-600"}`} aria-hidden />
              <span className={`text-sm font-bold ${dark ? "text-cyan-50" : "text-slate-900"}`}>
                Anatomy connections
              </span>
            </span>
            <span className={`mt-1 block text-xs ${dark ? "text-cyan-100/80" : "text-slate-600"}`}>
              {summaryParts.join(" · ")}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0 transition-transform",
              chevronClass,
              expanded && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        {!expanded ? (
          <p className={`mt-2 text-xs ${hintClass}`}>
            Expand to jump to 3D structures and disease links.
          </p>
        ) : (
          <div
            className={cn(
              "mt-3 overflow-y-auto overscroll-contain rounded-lg border pr-1",
              dark ? "border-cyan-400/20 bg-cyan-950/20" : "border-indigo-100/80 bg-white/60",
              compact ? "max-h-[min(11rem,36dvh)]" : "max-h-[min(16rem,44dvh)]"
            )}
          >
            <div className="p-2.5">{linksBody}</div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={sectionClass} aria-label="Anatomy and disease connections">
      <div className="flex items-center gap-2">
        <Bone className={`h-4 w-4 ${dark ? "text-cyan-300" : "text-indigo-600"}`} aria-hidden />
        <h4 className={`text-sm font-bold ${dark ? "text-cyan-50" : "text-slate-900"}`}>
          Anatomy connections
        </h4>
      </div>
      <p className={`mt-1 text-xs ${dark ? "text-cyan-100/80" : "text-slate-600"}`}>
        Where this drug meets disease — jump to the 3D structure.
      </p>
      <div className="mt-3">{linksBody}</div>
    </section>
  );
}
