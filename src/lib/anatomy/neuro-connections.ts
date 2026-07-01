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
  "spinal-cord": ["skull", "carotid-artery"],
  skull: ["spinal-cord", "carotid-artery"],
  "carotid-artery": ["skull", "spinal-cord"],
};

export const NEURO_CONNECTIONS: NeuroConnection[] = [
  {
    from: "carotid-artery",
    to: "skull",
    kind: "vascular",
    label: "Internal carotid → anterior circulation",
  },
  {
    from: "skull",
    to: "spinal-cord",
    kind: "protective",
    label: "Vertebral column protects spinal cord",
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
