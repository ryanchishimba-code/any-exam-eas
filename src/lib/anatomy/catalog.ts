import { ANATOMY_STRUCTURES } from "./structures";
import { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS } from "./tours";
import { ANATOMY_SYSTEM_LABELS, type AnatomySystem } from "./types";

export type AnatomyCatalogStats = {
  structureCount: number;
  highYieldCount: number;
  tourCount: number;
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
    tourCount: ANATOMY_TOURS.length,
    quizCount: ANATOMY_QUIZ_QUESTIONS.length,
    systemCounts,
  };
}
