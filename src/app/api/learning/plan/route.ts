import { NextResponse } from "next/server";
import { aiLogicEngine } from "@/lib/core/ai-logic";
import { getLearningProfileSnapshot } from "@/lib/learning/engine";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const fieldId = new URL(req.url).searchParams.get("field") ?? "nursing";

  const profile = await getLearningProfileSnapshot(premium.userId);
  const weakestTopics = profile.weakestConcepts
    .filter((c) => c.fieldId === fieldId || profile.weakestConcepts.length <= 8)
    .map((c) => c.conceptKey.replace(/^(tag|subject):/, ""));

  const plan = await aiLogicEngine.generatePersonalizedPlan({
    weakestTopics,
    readinessScore: profile.readinessScore,
    fieldId,
    studyStreakDays: profile.studyStreakDays,
  });

  return NextResponse.json({ plan, profile });
}
