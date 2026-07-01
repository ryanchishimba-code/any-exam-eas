import { getAnatomyStructure, searchAnatomyStructures } from "@/lib/anatomy";
import {
  ANATOMY_LAYER_LABELS,
  ANATOMY_SYSTEM_LABELS,
  type AnatomyLayer,
  type AnatomySystem,
} from "@/lib/anatomy/types";
import type { ExamSlug } from "@/types/edtech";

export type AnatomyAssistContextInput = {
  examSlug: ExamSlug;
  selectedStructureId: string | null;
  visibleLayers: AnatomyLayer[];
  systemFilter: AnatomySystem | "all";
};

export type AnatomyAssistContext = {
  systemPrompt: string;
  structureSnapshot: string | null;
};

function formatStructureBlock(structureId: string): string | null {
  const s = getAnatomyStructure(structureId);
  if (!s) return null;
  const parent = s.parentId ? getAnatomyStructure(s.parentId) : null;
  const lines = [
    `id: ${s.id}`,
    `name: ${s.name}`,
    `system: ${ANATOMY_SYSTEM_LABELS[s.system]}`,
    `layer: ${ANATOMY_LAYER_LABELS[s.layer]}`,
    parent ? `parent: ${parent.name} (${parent.id})` : null,
    `description: ${s.description}`,
    s.clinicalFacts.length ? `clinical: ${s.clinicalFacts.slice(0, 4).join(" | ")}` : null,
    s.pathologies?.length ? `pathologies: ${s.pathologies.join(", ")}` : null,
    s.keywords.length ? `keywords: ${s.keywords.slice(0, 8).join(", ")}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildAnatomyAssistContext(input: AnatomyAssistContextInput): AnatomyAssistContext {
  const layerSummary = input.visibleLayers
    .map((l) => ANATOMY_LAYER_LABELS[l])
    .join(", ");
  const systemLabel =
    input.systemFilter === "all"
      ? "All systems"
      : ANATOMY_SYSTEM_LABELS[input.systemFilter];

  const structureSnapshot = input.selectedStructureId
    ? formatStructureBlock(input.selectedStructureId)
    : null;

  const catalogHints = searchAnatomyStructures("", { highYieldOnly: true })
    .filter((s) => !s.parentId)
    .slice(0, 12)
    .map((s) => `${s.id} (${s.name})`)
    .join("; ");

  const systemPrompt = [
    "You are an expert anatomy tutor embedded in a 3D medical anatomy explorer.",
    `The student is preparing for the ${input.examSlug.toUpperCase()} exam.`,
    `Visible layers: ${layerSummary || "none"}. System filter: ${systemLabel}.`,
    structureSnapshot
      ? `Currently selected structure:\n${structureSnapshot}`
      : "No structure is selected — suggest relevant structures when helpful.",
    `High-yield structure ids (examples): ${catalogHints}.`,
    "Answer concisely in plain language. Use clinical pearls when relevant.",
    "When the student asks to see, highlight, peel, or focus on anatomy, emit tool calls.",
    "Only use structure ids that exist in the catalog.",
  ].join("\n");

  return { systemPrompt, structureSnapshot };
}
