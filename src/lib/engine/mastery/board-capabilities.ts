/**
 * Per-board mastery capabilities for the uniform engine.
 * Every board always gets concept + question SRS. Cell writes are gated here.
 */

import type { ExamSlug } from "@/types/edtech";
import {
  isTodayEngineEnabled,
  isTodayEngineNaplexEnabled,
  isTodayEngineUsmleEnabled,
} from "./feature-flag";

export type MasteryBoardCapabilities = {
  examSlug: ExamSlug;
  /** ConceptMastery + QuestionMastery always on. */
  conceptAndSrs: true;
  /** Skill Cell state machine writes on attempt. */
  cellWrites: boolean;
  /** Today session builder available. */
  todaySessions: boolean;
  /** How cells are resolved when ontology is sparse. */
  cellStrategy: "ontology" | "blueprint_fallback";
};

/** Independent flags for boards that are still scaffolding cells. */
export function isTodayEnginePanceEnabled(): boolean {
  return envFlag("TODAY_ENGINE_PANCE", isTodayEngineEnabled());
}

export function isTodayEngineFnpEnabled(): boolean {
  return envFlag("TODAY_ENGINE_FNP", isTodayEngineEnabled());
}

export function isTodayEngineNpteEnabled(): boolean {
  return envFlag("TODAY_ENGINE_NPTE", isTodayEngineEnabled());
}

function envFlag(name: string, inheritDefault: boolean): boolean {
  const raw =
    process.env[`NEXT_PUBLIC_${name}`] ?? process.env[name] ?? "";
  if (raw === "false" || raw === "0") return false;
  if (raw === "true" || raw === "1") return true;
  return inheritDefault;
}

export function getBoardMasteryCapabilities(
  examSlug: ExamSlug
): MasteryBoardCapabilities {
  switch (examSlug) {
    case "nclex":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEngineEnabled(),
        todaySessions: isTodayEngineEnabled(),
        cellStrategy: "ontology",
      };
    case "naplex":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEngineNaplexEnabled(),
        todaySessions: isTodayEngineNaplexEnabled(),
        cellStrategy: "ontology",
      };
    case "usmle":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEngineUsmleEnabled(),
        todaySessions: isTodayEngineUsmleEnabled(),
        cellStrategy: "ontology",
      };
    case "pance":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEnginePanceEnabled(),
        todaySessions: false,
        cellStrategy: "blueprint_fallback",
      };
    case "aanp-fnp":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEngineFnpEnabled(),
        todaySessions: false,
        cellStrategy: "blueprint_fallback",
      };
    case "npte-pt":
      return {
        examSlug,
        conceptAndSrs: true,
        cellWrites: isTodayEngineNpteEnabled(),
        todaySessions: false,
        cellStrategy: "blueprint_fallback",
      };
    default: {
      const _exhaustive: never = examSlug;
      void _exhaustive;
      return {
        examSlug: "nclex",
        conceptAndSrs: true,
        cellWrites: false,
        todaySessions: false,
        cellStrategy: "blueprint_fallback",
      };
    }
  }
}
