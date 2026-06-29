import { NextResponse } from "next/server";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

export const revalidate = 3600;

/** Public serve-ready counts for landing surfaces and client fallbacks. */
export async function GET() {
  try {
    const snapshot = await getCachedQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    return NextResponse.json(
      {
        ...display,
        updatedAt: snapshot.updatedAt,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
