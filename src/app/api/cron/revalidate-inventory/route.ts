import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cron-auth";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_PATHS,
} from "@/lib/inventory/active-inventory-cache";
import { revalidateActiveQuestionInventory } from "@/lib/inventory/revalidate-active-inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Drop the shared active-question inventory cache.
 * Called by `db:retire-near-duplicates --apply` and by operators after a
 * publish change that already landed in the database.
 *
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
 *     https://www.anyexameasy.com/api/cron/revalidate-inventory
 */
async function handle(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = revalidateActiveQuestionInventory();
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, revalidated: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: ACTIVE_INVENTORY_CACHE_TAG,
    paths: ACTIVE_INVENTORY_PATHS,
  });
}

export function GET(req: Request) {
  return handle(req);
}

export function POST(req: Request) {
  return handle(req);
}
