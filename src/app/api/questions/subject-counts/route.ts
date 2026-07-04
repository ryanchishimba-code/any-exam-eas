import { NextResponse } from "next/server";
import { getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";
import { cacheGetOrSet, cacheKey, CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { respondDbUnavailable } from "@/lib/api-db-error";

export const runtime = "nodejs";

/**
 * Serve-ready question counts per subject for a single exam field.
 *
 * Trust contract: these counts come from the exact same `where` the practice
 * serve path uses, so the number shown next to a topic equals the pool that
 * topic actually draws from. Premium-gated (same as the question bank) and
 * cached briefly to keep the topic picker snappy.
 */
export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const field = new URL(req.url).searchParams.get("field");
  if (!field) {
    return NextResponse.json({ error: "Missing field" }, { status: 400 });
  }

  const { resolveQuestionBankFieldId, enforceQuestionBankFieldAccess } = await import(
    "@/lib/edtech/question-bank-scope"
  );
  const access = await enforceQuestionBankFieldAccess(premium.userId, field);
  if (!access.ok) return access.response;

  const fieldId = resolveQuestionBankFieldId(field);

  try {
    const counts = await cacheGetOrSet(
      cacheKey(["subject-served-counts", fieldId]),
      CACHE_TTL.subjectCatalog,
      () => getSubjectServedCountsWithRetry(fieldId),
      { staleTtlMs: CACHE_STALE.subjectCatalog }
    );

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return NextResponse.json({ field: fieldId, counts, total });
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
