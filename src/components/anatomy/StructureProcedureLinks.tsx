"use client";

import { useEffect, useState } from "react";
import { Syringe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getProceduresForStructure,
  PROCEDURE_APPROACH_LABELS,
  PROCEDURE_URGENCY_LABELS,
  type AnatomyProcedure,
} from "@/lib/anatomy/procedures";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  structure: AnatomyStructure;
  focusedProcedureId?: string | null;
  onFocusProcedure?: (procedureId: string | null) => void;
  initialFocusedProcedureId?: string | null;
};

export function StructureProcedureLinks({
  structure,
  focusedProcedureId = null,
  onFocusProcedure,
  initialFocusedProcedureId,
}: Props) {
  const [internalFocus, setInternalFocus] = useState<string | null>(
    initialFocusedProcedureId ?? null
  );
  const activeId = focusedProcedureId ?? internalFocus;
  const setFocus = onFocusProcedure ?? setInternalFocus;

  useEffect(() => {
    if (initialFocusedProcedureId) {
      setInternalFocus(initialFocusedProcedureId);
    }
  }, [initialFocusedProcedureId]);

  const procedures = getProceduresForStructure(structure.id);
  if (procedures.length === 0) return null;

  const emergent = procedures.filter((p) => p.urgency === "emergent");
  const urgent = procedures.filter((p) => p.urgency === "urgent");
  const elective = procedures.filter((p) => p.urgency === "elective");

  return (
    <section aria-label="Surgical procedures">
      <div className="mb-2 flex items-center gap-2">
        <Syringe className="h-4 w-4 text-indigo-600" aria-hidden />
        <h4 className="text-sm font-bold text-[var(--color-ink)]">Procedures & surgeries</h4>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
        Board-relevant operations for {structure.name.toLowerCase()} — tap to expand indications
        and pearls.
      </p>

      <div className="space-y-4">
        {emergent.length > 0 ? (
          <ProcedureGroup
            label="Emergent"
            procedures={emergent}
            focusedProcedureId={activeId}
            onFocusProcedure={setFocus}
            accent="border-rose-200 bg-rose-50/50"
          />
        ) : null}
        {urgent.length > 0 ? (
          <ProcedureGroup
            label="Urgent"
            procedures={urgent}
            focusedProcedureId={activeId}
            onFocusProcedure={setFocus}
            accent="border-amber-200 bg-amber-50/40"
          />
        ) : null}
        {elective.length > 0 ? (
          <ProcedureGroup
            label="Elective"
            procedures={elective}
            focusedProcedureId={activeId}
            onFocusProcedure={setFocus}
            accent="border-slate-200 bg-slate-50/60"
          />
        ) : null}
      </div>
    </section>
  );
}

function ProcedureGroup({
  label,
  procedures,
  focusedProcedureId,
  onFocusProcedure,
  accent,
}: {
  label: string;
  procedures: AnatomyProcedure[];
  focusedProcedureId?: string | null;
  onFocusProcedure?: (procedureId: string | null) => void;
  accent: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
        {label}
      </p>
      <ul className="space-y-2">
        {procedures.map((proc) => (
          <ProcedureCard
            key={proc.id}
            procedure={proc}
            focused={focusedProcedureId === proc.id}
            onFocus={() => onFocusProcedure?.(proc.id)}
            accent={accent}
          />
        ))}
      </ul>
    </div>
  );
}

function ProcedureCard({
  procedure,
  focused,
  onFocus,
  accent,
}: {
  procedure: AnatomyProcedure;
  focused: boolean;
  onFocus: () => void;
  accent: string;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onFocus}
        className={cn(
          "w-full rounded-xl border p-3 text-left transition",
          focused ? "border-indigo-300 bg-indigo-50/80 shadow-sm" : accent,
          "hover:border-indigo-200 hover:shadow-sm"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-ink)]">{procedure.name}</p>
          <div className="flex flex-wrap gap-1">
            {procedure.highYield ? (
              <Badge className="bg-amber-100 text-[10px] text-amber-900">High-yield</Badge>
            ) : null}
            <Badge className="bg-white/80 text-[10px] text-slate-700">
              {PROCEDURE_APPROACH_LABELS[procedure.approach]}
            </Badge>
          </div>
        </div>

        {focused ? (
          <div className="mt-3 space-y-2 border-t border-black/[0.06] pt-3 text-xs leading-relaxed">
            <p>
              <span className="font-semibold text-[var(--color-ink)]">Indication: </span>
              {procedure.indication}
            </p>
            <blockquote className="rounded-lg border-l-2 border-indigo-400 bg-white/70 px-2.5 py-2 font-medium text-[var(--color-ink)]">
              {procedure.examPearl}
            </blockquote>
            {procedure.complications.length > 0 ? (
              <p>
                <span className="font-semibold text-[var(--color-ink)]">Complications: </span>
                {procedure.complications.join("; ")}
              </p>
            ) : null}
            <p className="text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)]">
              {PROCEDURE_URGENCY_LABELS[procedure.urgency]}
            </p>
          </div>
        ) : (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--color-ink-muted)]">
            {procedure.indication}
          </p>
        )}
      </button>
    </li>
  );
}
