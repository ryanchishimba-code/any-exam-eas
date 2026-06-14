import { ANATOMY_STRUCTURES } from "../../structures";
import { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS } from "../../tours";
import { ANATOMY_PROCEDURES } from "../../procedures";
import { ANATOMY_SUBREGION_STRUCTURES } from "../../subregions/structures";
import { ANATOMY_SYSTEM_LABELS, type AnatomySystem } from "../../types";

export type AnatomyCatalogStats = {
  structureCount: number;
  highYieldCount: number;
  subregionCount: number;
  procedureCount: number;
  tourCount: number;
  procedureTourCount: number;
  quizCount: number;
  systemCounts: Record<AnatomySystem, number>;
};

export function getAnatomyCatalogStats(): AnatomyCatalogStats {
  const systemCounts = Object.keys(ANATOMY_SYSTEM_LABELS).reduce(
    (acc, key) => {
      acc[key as AnatomySystem] = 0;
      return acc;
    },
    {} as Record<AnatomySystem, number>
  );

  for (const s of ANATOMY_STRUCTURES) {
    systemCounts[s.system] += 1;
  }

  return {
    structureCount: ANATOMY_STRUCTURES.length,
    highYieldCount: ANATOMY_STRUCTURES.filter((s) => s.highYield).length,
    subregionCount: ANATOMY_SUBREGION_STRUCTURES.length,
    procedureCount: ANATOMY_PROCEDURES.length,
    tourCount: ANATOMY_TOURS.length,
    procedureTourCount: ANATOMY_TOURS.filter((t) => t.kind === "procedure").length,
    quizCount: ANATOMY_QUIZ_QUESTIONS.length,
    systemCounts,
  };
}
