import { NextResponse } from "next/server";
import { userHasFeature } from "@/lib/access-control";
import { loadAnalyticsSnapshot } from "@/lib/learning/analytics-snapshot";
import type { ExamSlug } from "@/types/edtech";

export const runtime = "nodejs";
export const maxDuration = 60;

const EXAM_SLUGS = new Set<ExamSlug>([
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
]);

function isExamSlug(value: string | null): value is ExamSlug {
  return value != null && EXAM_SLUGS.has(value as ExamSlug);
}

/** Analytics body. The page shell closes before this runs. */
export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  if (!userHasFeature(premium.access, "advanced_analytics")) {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const exam = new URL(req.url).searchParams.get("exam");
  if (!isExamSlug(exam)) {
    return NextResponse.json({ error: "Unknown exam" }, { status: 400 });
  }

  try {
    const snapshot = await loadAnalyticsSnapshot(premium.userId, exam);
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("[learning/analytics-snapshot] lookup failed:", error);
    return NextResponse.json({ error: "Analytics unavailable" }, { status: 503 });
  }
}
