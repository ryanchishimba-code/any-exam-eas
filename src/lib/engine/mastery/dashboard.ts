/**
 * Dashboard helpers — load Mastery rollup + domain tiles colored by cell state.
 */

import { buildNclexSkillCells, buildNaplexSkillCells } from "@/lib/engine/mastery/cells";
import { computeMasteryRollup } from "@/lib/engine/mastery/rollup";
import { loadUserCellStates } from "@/lib/engine/mastery/persist";
import { cellStateToRoadmapKey, emptyCellState } from "@/lib/engine/mastery/transitions";
import {
  isTodayEngineEnabled,
  isTodayEngineNaplexEnabled,
} from "@/lib/engine/mastery/feature-flag";
import type { MasteryRollup } from "@/lib/engine/mastery/types";
import type { DomainMapTile } from "@/components/dashboard/DomainMap";
import { practiceTopicHref, todayPracticeHref } from "@/lib/edtech/practice-links-core";
import { clientNeeds2026 } from "@/lib/nursing/client-needs-2026";
import { NAPLEX_OUTLINE_2025 } from "@/lib/pharmacy/naplex-outline-2025";

export async function loadNclexMasteryDashboard(userId: string): Promise<{
  rollup: MasteryRollup;
  mapTiles: DomainMapTile[];
} | null> {
  if (!isTodayEngineEnabled()) return null;

  const cells = buildNclexSkillCells("rn");
  const states = await loadUserCellStates(userId, "nclex");
  const rollup = computeMasteryRollup({ cells, states });

  // Aggregate to Client Needs systems for the Map (one tile per system).
  const needs = clientNeeds2026("rn");
  const mapTiles: DomainMapTile[] = needs.map((need) => {
    const systemCells = cells.filter((c) => c.systemKey === need.id);
    const systemStates = systemCells.map(
      (c) => states.get(c.cellKey) ?? emptyCellState(c.cellKey)
    );
    // Worst (highest priority leak) state wins coloring.
    const rank = (s: string) =>
      s === "shaky"
        ? 0
        : s === "learning"
          ? 1
          : s === "primed" || s === "unseen"
            ? 2
            : s === "stable"
              ? 3
              : 4;
    const worst =
      systemStates.sort((a, b) => rank(a.state) - rank(b.state))[0]?.state ?? "unseen";
    const answered = systemStates.reduce((n, s) => n + s.itemsAnswered, 0);
    const score =
      worst === "exam_ready"
        ? 90
        : worst === "stable"
          ? 75
          : worst === "learning"
            ? 55
            : worst === "shaky"
              ? 35
              : answered > 0
                ? 40
                : 10;

    return {
      id: need.id,
      label: need.label,
      weightPct: need.weight,
      score,
      status: cellStateToRoadmapKey(worst),
      practiceHref: practiceTopicHref("nclex", systemCells[0]?.topicKey ?? "mixed", 15),
      coveragePct: Math.min(
        100,
        Math.round((answered / Math.max(1, systemCells.length * 5)) * 100)
      ),
    };
  });

  return { rollup, mapTiles };
}

/** Five-domain NAPLEX map tiles + rollup for Practice Hub. */
export async function loadNaplexMasteryDashboard(userId: string): Promise<{
  rollup: MasteryRollup;
  mapTiles: DomainMapTile[];
} | null> {
  if (!isTodayEngineNaplexEnabled()) return null;

  const cells = buildNaplexSkillCells();
  const states = await loadUserCellStates(userId, "naplex");
  const rollup = computeMasteryRollup({ cells, states });

  const mapTiles: DomainMapTile[] = NAPLEX_OUTLINE_2025.map((domain) => {
    const systemCells = cells.filter((c) => c.systemKey === domain.id);
    const systemStates = systemCells.map(
      (c) => states.get(c.cellKey) ?? emptyCellState(c.cellKey)
    );
    const rank = (s: string) =>
      s === "shaky"
        ? 0
        : s === "learning"
          ? 1
          : s === "primed" || s === "unseen"
            ? 2
            : s === "stable"
              ? 3
              : 4;
    const worst =
      systemStates.sort((a, b) => rank(a.state) - rank(b.state))[0]?.state ?? "unseen";
    const answered = systemStates.reduce((n, s) => n + s.itemsAnswered, 0);
    const score =
      worst === "exam_ready"
        ? 90
        : worst === "stable"
          ? 75
          : worst === "learning"
            ? 55
            : worst === "shaky"
              ? 35
              : answered > 0
                ? 40
                : 10;

    return {
      id: domain.id,
      label: `D${domain.domain} · ${domain.label}`,
      weightPct: domain.blueprintWeight,
      score,
      status: cellStateToRoadmapKey(worst),
      practiceHref: todayPracticeHref("naplex", 40),
      coveragePct: Math.min(
        100,
        Math.round((answered / Math.max(1, systemCells.length * 5)) * 100)
      ),
    };
  });

  return { rollup, mapTiles };
}
