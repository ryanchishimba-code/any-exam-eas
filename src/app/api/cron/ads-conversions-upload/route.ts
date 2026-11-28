import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hourly placeholder for a later offline conversion upload.
 * This release is a no-op: it does not read or write the database, even if
 * GOOGLE_ADS_CONVERSIONS_ENABLED is set. The uploader ships in a later PR
 * after the migration is approved.
 */
export async function GET(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, enabled: false });
}
