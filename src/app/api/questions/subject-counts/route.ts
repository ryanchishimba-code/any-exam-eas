import { NextResponse } from "next/server";
import { getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";
import {
  ACTIVE_QUESTION_DEFINITION,
  fieldInventoryPayload,
} from "@/lib/inventory/active-questions";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { cacheAsidePublishedStamp } from "@/lib/inventory/active-inventory-stamp";
import { respondDbUnavailable } from "@/lib/api-db-error";

export const runtime = "nodejs";

/**
 * Active question counts per subject for a single exam field.
 *
 * Trust contract: counts come from the active inventory (published, not retired),
 * the same helper marketing uses. If that lookup is degraded, fall back to the
 * serve-path subject counts so the topic picker still matches what practice draws.
 */
export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const field = new URL(req.url).searchParams.get("field");
  if (!field) {
    return NextResponse.json({ error: "Missing field" }, { status: 400 });
  }

  const { resolveQuestionBankReadAccess } = await import("@/lib/edtech/question-bank-scope");
  const access = await resolveQuestionBankReadAccess(premium.userId, field);
  if (!access.ok) return access.response;

  const fieldId = access.fieldId;

  try {
    const fromInventory = fieldInventoryPayload(fieldId, await getCachedActiveInventory());
    if (fromInventory) {
      return NextResponse.json(fromInventory, {
        headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
      });
    }

    const counts = await cacheAsidePublishedStamp(
      ["subject-served-counts", fieldId],
      CACHE_TTL.subjectCatalog,
      () => getSubjectServedCountsWithRetry(fieldId),
      { staleTtlMs: CACHE_STALE.subjectCatalog }
    );

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return NextResponse.json({
      field: fieldId,
      counts,
      total,
      formats: null,
      categories: [],
      categoryLabel: null,
      definition: ACTIVE_QUESTION_DEFINITION,
    });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[questions/subject-counts] lookup failed:", error);
    return NextResponse.json(
      {
        field: fieldId,
        counts: {},
        total: 0,
        dbError: true,
        error: "Could not load topic counts. Try again in a moment.",
      },
      { status: 503 }
    );
  }
}
