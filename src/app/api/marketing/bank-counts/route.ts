import { NextResponse } from "next/server";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import {
  ACTIVE_QUESTION_DEFINITION,
  formatInventoryFormatLine,
} from "@/lib/inventory/active-questions";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";

/** Stamp check on every request. A CDN hour would keep the retired total. */
export const dynamic = "force-dynamic";

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
          "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL,
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
