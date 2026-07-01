import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";

/** Client-executable actions returned by the anatomy AI tutor. */
export type AnatomyAssistAction =
  | { type: "select_structure"; structureId: string }
  | { type: "toggle_layer"; layer: AnatomyLayer; visible: boolean }
  | { type: "set_system_filter"; system: AnatomySystem | "all" }
  | { type: "reset_view" };

export const ANATOMY_LAYER_IDS = [
  "skin",
  "muscle",
  "organ",
  "vascular",
  "nerve",
  "bone",
] as const satisfies readonly AnatomyLayer[];

export const ANATOMY_SYSTEM_IDS = [
  "skeletal",
  "muscular",
  "cardiovascular",
  "nervous",
  "respiratory",
  "digestive",
  "lymphatic",
  "urinary",
  "endocrine",
] as const satisfies readonly AnatomySystem[];

export function parseAnatomyAssistActions(raw: unknown): AnatomyAssistAction[] {
  if (!Array.isArray(raw)) return [];
  const out: AnatomyAssistAction[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const type = rec.type;
    if (type === "select_structure" && typeof rec.structureId === "string") {
      out.push({ type, structureId: rec.structureId });
    } else if (
      type === "toggle_layer" &&
      typeof rec.layer === "string" &&
      ANATOMY_LAYER_IDS.includes(rec.layer as AnatomyLayer) &&
      typeof rec.visible === "boolean"
    ) {
      out.push({ type, layer: rec.layer as AnatomyLayer, visible: rec.visible });
    } else if (
      type === "set_system_filter" &&
      (rec.system === "all" ||
        (typeof rec.system === "string" &&
          ANATOMY_SYSTEM_IDS.includes(rec.system as AnatomySystem)))
    ) {
      out.push({
        type,
        system: rec.system === "all" ? "all" : (rec.system as AnatomySystem),
      });
    } else if (type === "reset_view") {
      out.push({ type: "reset_view" });
    }
  }
  return out;
}
