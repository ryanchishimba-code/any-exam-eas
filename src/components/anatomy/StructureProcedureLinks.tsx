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
        <Syringe className="h-4 w-4 text-cyan-400" aria-hidden />
        <h4 className="text-sm font-bold text-white">Procedures & surgeries</h4>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-white/70">
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
            accent="border-rose-500/25 bg-[#2a2228]"
          />
        ) : null}
        {urgent.length > 0 ? (
          <ProcedureGroup
            label="Urgent"
            procedures={urgent}
            focusedProcedureId={activeId}
            onFocusProcedure={setFocus}
            accent="border-amber-500/25 bg-[#2a2820]"
          />
        ) : null}
        {elective.length > 0 ? (
          <ProcedureGroup
            label="Elective"
            procedures={elective}
            focusedProcedureId={activeId}
            onFocusProcedure={setFocus}
            accent="border-white/[0.08] bg-[#222b38]"
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
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
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
          focused ? "border-cyan-500/40 bg-[#283040] shadow-sm" : accent,
          "hover:border-cyan-500/30 hover:bg-[#2a3442]"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-white">{procedure.name}</p>
          <div className="flex flex-wrap gap-1">
            {procedure.highYield ? (
              <Badge className="bg-amber-500/15 text-[10px] text-amber-200">High-yield</Badge>
            ) : null}
            <Badge className="bg-white/[0.08] text-[10px] text-white/70">
              {PROCEDURE_APPROACH_LABELS[procedure.approach]}
            </Badge>
          </div>
        </div>

        {focused ? (
          <div className="mt-3 space-y-2 border-t border-white/[0.08] pt-3 text-xs leading-relaxed text-white">
            <p>
              <span className="font-semibold text-white">Indication: </span>
              {procedure.indication}
            </p>
            <blockquote className="rounded-lg border-l-2 border-cyan-500/50 bg-[#283040] px-2.5 py-2 font-medium text-white">
              {procedure.examPearl}
            </blockquote>
            {procedure.complications.length > 0 ? (
              <p>
                <span className="font-semibold text-white">Complications: </span>
                {procedure.complications.join("; ")}
              </p>
            ) : null}
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              {PROCEDURE_URGENCY_LABELS[procedure.urgency]}
            </p>
          </div>
        ) : (
          <p className="mt-1 line-clamp-2 text-xs text-white/70">
            {procedure.indication}
          </p>
        )}
      </button>
    </li>
  );
}
