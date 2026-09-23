import { NextResponse } from "next/server";
import {
  ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
  ACTIVE_INVENTORY_CDN_STALE_SECONDS,
} from "@/lib/inventory/active-inventory-cache";
import {
  ACTIVE_QUESTION_DEFINITION,
  formatInventoryFormatLine,
} from "@/lib/inventory/active-questions";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";

export const revalidate = 3600;

/** Public serve-ready counts for landing surfaces and client fallbacks. */
export async function GET() {
  try {
    const { snapshot, inventory } = await getCachedBankStatsBundle();
    const display = buildLandingBankCountsDisplay(snapshot);
    const boards = Object.fromEntries(
      Object.entries(inventory.boards).map(([slug, board]) => [
        slug,
        {
          active: board.active,
          formats: board.formats,
          topicCount: board.topicCount,
          categoryLabel: board.categoryLabel,
          categories: board.categories,
          scopeNote: board.scopeNote,
          formatLine: formatInventoryFormatLine(
            board.formats,
            slug === "nclex" ? "NGN" : "NGN-style"
          ),
        },
      ])
    );
    return NextResponse.json(
      {
        ...display,
        updatedAt: snapshot.updatedAt,
        inventory: {
          degraded: inventory.degraded,
          definition: ACTIVE_QUESTION_DEFINITION,
          boards,
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${ACTIVE_INVENTORY_CACHE_TTL_SECONDS}, stale-while-revalidate=${ACTIVE_INVENTORY_CDN_STALE_SECONDS}`,
        },
      }
    );
  } catch (error) {
    console.error("[api/marketing/bank-counts]", error);
    return NextResponse.json(
      { error: "Counts unavailable", degraded: true },
      { status: 503 }
    );
  }
}
