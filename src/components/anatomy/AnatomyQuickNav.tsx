"use client";

import { useMemo } from "react";
import {
  getAllAnatomyStructures,
  groupStructuresBySystem,
} from "@/lib/anatomy";
import {
  ANATOMY_PROCEDURES,
  PROCEDURE_URGENCY_LABELS,
  type ProcedureUrgency,
} from "@/lib/anatomy/procedures";
import { ANATOMY_SYSTEM_LABELS } from "@/lib/anatomy/types";
import { AnatomyScrollDropdown } from "@/components/anatomy/AnatomyScrollDropdown";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: string | null;
  activeProcedureId?: string | null;
  onSelectStructure: (id: string) => void;
  onSelectProcedure?: (procedureId: string, structureId: string) => void;
  /** Hover / keyboard focus preview — rotates 3D camera to structure. */
  onPreviewStructure?: (structureId: string | null) => void;
};

const URGENCY_ORDER: ProcedureUrgency[] = ["emergent", "urgent", "elective"];
const VISIBLE_ROWS = 5;

function structureOptionLabel(name: string, highYield: boolean, isSubregion: boolean) {
  const prefix = isSubregion ? "↳ " : "";
  const hy = highYield ? " ★" : "";
  return `${prefix}${name}${hy}`;
}

function sortStructuresForDropdown(structures: ReturnType<typeof getAllAnatomyStructures>) {
  const parents = structures.filter((s) => !s.parentId).sort((a, b) => a.name.localeCompare(b.name));
  const subregions = structures.filter((s) => s.parentId).sort((a, b) => a.name.localeCompare(b.name));
  return [...parents, ...subregions];
}

function procedureFocusStructureId(proc: (typeof ANATOMY_PROCEDURES)[number]) {
  return proc.subregionIds?.[0] ?? proc.structureIds[0] ?? proc.id;
}

/** Jump menus — structure and procedure catalogs with live 3D preview on hover. */
export function AnatomyQuickNav({
  selectedId,
  activeProcedureId,
  onSelectStructure,
  onSelectProcedure,
  onPreviewStructure,
}: Props) {
  const structureGroups = useMemo(
    () =>
      groupStructuresBySystem(getAllAnatomyStructures()).map(({ system, structures }) => ({
        id: system,
        label: ANATOMY_SYSTEM_LABELS[system],
        items: sortStructuresForDropdown(structures).map((s) => ({
          id: s.id,
          label: structureOptionLabel(s.name, s.highYield, Boolean(s.parentId)),
          focusId: s.id,
        })),
      })),
    []
  );

  const procedureGroups = useMemo(() => {
    const sorted = [...ANATOMY_PROCEDURES].sort((a, b) => a.name.localeCompare(b.name));
    return URGENCY_ORDER.map((urgency) => ({
      id: urgency,
      label: PROCEDURE_URGENCY_LABELS[urgency],
      items: sorted
        .filter((p) => p.urgency === urgency)
        .map((p) => ({
          id: p.id,
          label: `${p.name}${p.highYield ? " ★" : ""}`,
          focusId: procedureFocusStructureId(p),
        })),
    })).filter((g) => g.items.length > 0);
  }, []);

  return (
    <section
      aria-label="Jump to structure or procedure"
      className={cn(anatomyUi.panel, "overflow-visible px-4 py-4 sm:px-5")}
    >
      <div className="mb-3">
        <p className={anatomyUi.sectionLabel}>Jump to</p>
        <p className={anatomyUi.sectionHint}>
          Hover to preview in 3D · click to select
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AnatomyScrollDropdown
          label="Structure"
          placeholder="Choose a structure…"
          value={selectedId ?? ""}
          groups={structureGroups}
          visibleRows={VISIBLE_ROWS}
          placement="up"
          onPreview={onPreviewStructure}
          onChange={onSelectStructure}
        />

        <AnatomyScrollDropdown
          label="Procedure"
          placeholder="Choose a procedure…"
          value={activeProcedureId ?? ""}
          groups={procedureGroups}
          visibleRows={VISIBLE_ROWS}
          placement="up"
          disabled={!onSelectProcedure}
          onPreview={onPreviewStructure}
          onChange={(procId) => {
            if (!onSelectProcedure) return;
            const proc = ANATOMY_PROCEDURES.find((p) => p.id === procId);
            if (!proc) return;
            const structureId = procedureFocusStructureId(proc);
            onSelectProcedure(procId, structureId);
          }}
        />
      </div>
    </section>
  );
}
