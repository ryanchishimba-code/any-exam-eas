import { NextResponse } from "next/server";
import {
  buildLandingBankCountsDisplay,
  getQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public live serve-ready counts for landing surfaces and client fallbacks. */
export async function GET() {
  try {
    const snapshot = await getQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    return NextResponse.json(
      {
        ...display,
        updatedAt: snapshot.updatedAt,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
