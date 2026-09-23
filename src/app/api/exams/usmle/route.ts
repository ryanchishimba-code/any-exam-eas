import { NextResponse } from "next/server";
import { getUsmleExamOptionsWithCounts } from "@/lib/exam-prep/usmle/exam-options";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";

// Counts come from the DB (cached ~5 min via unstable_cache); render dynamically.
export const dynamic = "force-dynamic";

/**
 * GET /api/exams/usmle
 * Returns USMLE step options with live, accurate question counts.
 * Shape: { options: UsmleExamOption[], updatedAt: string, degraded: boolean }
 */
export async function GET() {
  try {
    const payload = await getUsmleExamOptionsWithCounts();
    return NextResponse.json(payload, {
      headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
    });
  } catch (error) {
    console.error("[api/exams/usmle] failed:", error);
    return NextResponse.json(
      { error: "Failed to load USMLE exam options." },
      { status: 500 }
    );
  }
}
