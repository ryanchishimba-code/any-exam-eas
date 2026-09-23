import { NextResponse } from "next/server";
import {
  getRecommendedSubjects,
  getSubjectCatalog,
  getTrendingSubjects,
} from "@/lib/subjects/catalog";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { prisma } from "@/lib/prisma";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const revalidate = 60;

type CatalogPayload = {
  subjects: Array<
    ReturnType<typeof getSubjectCatalog>[number] & {
      questionCount: number;
      topicCount: number;
    }
  >;
  trending: ReturnType<typeof getTrendingSubjects>;
  recommended: ReturnType<typeof getRecommendedSubjects>;
  totalQuestions: number;
  updatedAt: string;
};

let catalogCache: { payload: CatalogPayload; at: number } | null = null;
const CATALOG_TTL_MS = 60_000;

async function countQuestionsByField(): Promise<Map<string, number>> {
  try {
    const inventory = await getCachedActiveInventory();
    if (!inventory.degraded) {
      return new Map(
        Object.values(inventory.fields).map((field) => [field.fieldId, field.active])
      );
    }
  } catch (error) {
    console.error("[catalog/subjects] inventory counts failed:", error);
  }

  const rows = await prisma.questionBankItem.groupBy({
    by: ["fieldId"],
    where: { active: true, qaPassed: true },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.fieldId, r._count._all]));
}

export async function GET() {
  try {
    const now = Date.now();
    if (catalogCache && now - catalogCache.at < CATALOG_TTL_MS) {
      return NextResponse.json(catalogCache.payload, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }

    const catalog = getSubjectCatalog();
    const counts = await countQuestionsByField();

    const enriched = catalog.map((entry) => ({
      ...entry,
      questionCount: counts.get(entry.fieldId) ?? 0,
      topicCount: getSubjectsForFieldId(entry.fieldId).length,
    }));

    const totalQuestions = enriched.reduce((n, e) => n + e.questionCount, 0);

    const payload: CatalogPayload = {
      subjects: enriched,
      trending: getTrendingSubjects(),
      recommended: getRecommendedSubjects(),
      totalQuestions,
      updatedAt: new Date().toISOString(),
    };

    catalogCache = { payload, at: now };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e) {
    console.error("[catalog/subjects] lookup failed:", e);

    // Serve stale cache if we have one, otherwise a count-free catalog, so a
    // DB outage degrades the marketing pages instead of breaking them. Never
    // leak raw database errors to the client.
    if (catalogCache) {
      return NextResponse.json(catalogCache.payload, {
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
      });
    }

    const fallback: CatalogPayload = {
      subjects: getSubjectCatalog().map((entry) => ({
        ...entry,
        questionCount: 0,
        topicCount: getSubjectsForFieldId(entry.fieldId).length,
      })),
      trending: getTrendingSubjects(),
      recommended: getRecommendedSubjects(),
      totalQuestions: 0,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
    });
  }
}
