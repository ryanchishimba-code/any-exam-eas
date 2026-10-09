import { NextResponse } from "next/server";
import {
  PUBLIC_BANK_COUNTS_BROWSER_CACHE_CONTROL,
  PUBLIC_BANK_COUNTS_CDN_CACHE_CONTROL,
} from "@/lib/inventory/active-inventory-cache";
import { formatBoardQuestionSentence } from "@/lib/counts";
import {
  ACTIVE_QUESTION_DEFINITION,
  formatInventoryFormatLine,
} from "@/lib/inventory/active-questions";
import { buildLandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { getPublicBankStatsBundle } from "@/lib/marketing/public-bank-stats";

/**
 * Dynamic so a purge can still rebuild on the origin. The CDN caches the
 * logged-out JSON for 10 minutes (`s-maxage=600`, stale-while-revalidate).
 */
export const dynamic = "force-dynamic";

/** Public serve-ready counts for landing surfaces and client fallbacks. */
export async function GET() {
  try {
    const { snapshot, inventory } = await getPublicBankStatsBundle();
    const display = buildLandingBankCountsDisplay(snapshot);
    const boards = Object.fromEntries(
      Object.entries(inventory.boards).map(([slug, board]) => {
        const units = snapshot.boards?.[slug as keyof NonNullable<typeof snapshot.boards>];
        const scored = units
          ? units.bankItems + units.standaloneNgn + units.caseItems
          : board.active;
        const formatLine =
          units && (units.standaloneNgn > 0 || units.caseStudies > 0)
            ? formatBoardQuestionSentence(units)
            : formatInventoryFormatLine(board.formats, slug === "nclex" ? "NGN" : "NGN-style");
        return [
          slug,
          {
            active: scored,
            formats: board.formats,
            topicCount: board.topicCount,
            categoryLabel: board.categoryLabel,
            categories: board.categories,
            scopeNote: board.scopeNote,
            formatLine,
          },
        ];
      })
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
          "Cache-Control": PUBLIC_BANK_COUNTS_BROWSER_CACHE_CONTROL,
          "CDN-Cache-Control": PUBLIC_BANK_COUNTS_CDN_CACHE_CONTROL,
          "Vercel-CDN-Cache-Control": PUBLIC_BANK_COUNTS_CDN_CACHE_CONTROL,
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
