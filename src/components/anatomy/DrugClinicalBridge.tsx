"use client";

import Link from "next/link";
import { Activity, Bone, Stethoscope } from "lucide-react";
import {
  anatomyStructureHref,
  drugUsedAsFirstLine,
  getClinicalContextForDrug,
} from "@/lib/anatomy/clinical-links";
import { getAnatomyStructure } from "@/lib/anatomy";

type Props = {
  drugId: string;
  compact?: boolean;
  variant?: "light" | "dark";
};

/** Reverse bridge: drug card → anatomy structures, diseases, and endpoints. */
export function DrugClinicalBridge({ drugId, compact = false, variant = "light" }: Props) {
  const ctx = getClinicalContextForDrug(drugId);
  if (ctx.diseases.length === 0) return null;

  const topDiseases = ctx.diseases.slice(0, compact ? 2 : 4);
  const dark = variant === "dark";

  return (
    <section
      className={
        compact
          ? dark
            ? "mt-3 rounded-xl border border-cyan-400/25 bg-cyan-950/40 p-3"
            : "mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3"
          : dark
            ? "mt-5 rounded-2xl border border-cyan-400/25 bg-cyan-950/40 p-4"
            : "mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-4"
      }
      aria-label="Anatomy and disease connections"
    >
      <div className="flex items-center gap-2">
        <Bone className={`h-4 w-4 ${dark ? "text-cyan-300" : "text-indigo-600"}`} aria-hidden />
        <h4 className={`text-sm font-bold ${dark ? "text-cyan-50" : "text-slate-900"}`}>
          Anatomy connections
        </h4>
      </div>
      <p className={`mt-1 text-xs ${dark ? "text-cyan-100/80" : "text-slate-600"}`}>
        Where this drug meets disease — jump to the 3D structure.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
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

      <ul className={`mt-3 space-y-2 ${compact ? "" : "space-y-3"}`}>
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
              </div>
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

      {compact && ctx.diseases.length > 2 ? (
        <p className={`mt-2 text-[10px] ${dark ? "text-cyan-200/70" : "text-slate-500"}`}>
          +{ctx.diseases.length - 2} more disease links — search drug for full preview
        </p>
      ) : null}
    </section>
  );
}
