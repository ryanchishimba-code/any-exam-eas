import { NextResponse } from "next/server";
import {
  buildNaplexSkillCells,
  computeMasteryRollup,
  isTodayEngineNaplexEnabled,
  loadUserCellStates,
  type CellState,
} from "@/lib/engine/mastery";
import { NAPLEX_OUTLINE_2025 } from "@/lib/pharmacy/naplex-outline-2025";

export const runtime = "nodejs";

/**
 * GET /api/study/naplex-mastery — domain map + readiness strip for NAPLEX Today.
 */
export async function GET() {
  if (!isTodayEngineNaplexEnabled()) {
    return NextResponse.json(
      { error: "NAPLEX Today engine is not enabled.", code: "TODAY_ENGINE_NAPLEX_OFF" },
      { status: 404 }
    );
  }

  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const cells = buildNaplexSkillCells();
    const states = await loadUserCellStates(premium.userId, "naplex");
    const rollup = computeMasteryRollup({ cells, states });

    const domains = NAPLEX_OUTLINE_2025.map((d) => {
      const domainCells = cells.filter((c) => c.systemKey === d.id);
      const stateRank: Record<CellState, number> = {
        shaky: 0,
        learning: 1,
        primed: 2,
        unseen: 3,
        stable: 4,
        exam_ready: 5,
      };
      let worst: CellState = "unseen";
      for (const cell of domainCells) {
        const st = states.get(cell.cellKey)?.state ?? "unseen";
        if (stateRank[st] < stateRank[worst]) worst = st;
      }
      if (domainCells.length === 0) worst = "unseen";
      const touched = domainCells.filter((c) => {
        const st = states.get(c.cellKey)?.state ?? "unseen";
        return st !== "unseen";
      }).length;
      return {
        domain: d.domain,
        id: d.id,
        label: d.label,
        weight: d.blueprintWeight,
        cellState: worst,
        cellsTouched: touched,
        cellsTotal: domainCells.length,
      };
    });

    return NextResponse.json({
      ok: true,
      examSlug: "naplex",
      rollup,
      domains,
    });
  } catch (e) {
    console.error("[study/naplex-mastery]", e);
    return NextResponse.json({ error: "Could not load NAPLEX mastery." }, { status: 500 });
  }
}
