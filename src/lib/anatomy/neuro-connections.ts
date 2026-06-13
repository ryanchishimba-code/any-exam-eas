/**
 * Neuroanatomy relationship graph — drives connected highlighting and pathway overlays.
 */

export type NeuroConnectionKind = "ascending" | "vascular" | "protective";

export type NeuroConnection = {
  from: string;
  to: string;
  kind: NeuroConnectionKind;
  label: string;
};

/** Bidirectional lookup: structure id → connected structure ids. */
export const NEURO_CONNECTION_GRAPH: Record<string, string[]> = {
  brain: ["spinal-cord", "skull", "carotid-artery"],
  "spinal-cord": ["brain", "skull"],
  skull: ["brain", "spinal-cord"],
  "carotid-artery": ["brain", "skull"],
};

export const NEURO_CONNECTIONS: NeuroConnection[] = [
  {
    from: "brain",
    to: "spinal-cord",
    kind: "ascending",
    label: "Brainstem → spinal cord (CNS continuity)",
  },
  {
    from: "carotid-artery",
    to: "brain",
    kind: "vascular",
    label: "Internal carotid → anterior circulation",
  },
  {
    from: "skull",
    to: "brain",
    kind: "protective",
    label: "Calvaria & meninges protect brain parenchyma",
  },
];

export function getNeuroConnectedStructureIds(structureId: string | null): Set<string> {
  if (!structureId) return new Set();
  const related = NEURO_CONNECTION_GRAPH[structureId] ?? [];
  return new Set([structureId, ...related]);
}

export function isNeuroConnected(focusId: string | null, structureId: string): boolean {
  if (!focusId || focusId === structureId) return false;
  return NEURO_CONNECTION_GRAPH[focusId]?.includes(structureId) ?? false;
}

export function isNeuroStructure(structureId: string | null): boolean {
  if (!structureId) return false;
  return structureId in NEURO_CONNECTION_GRAPH;
}
