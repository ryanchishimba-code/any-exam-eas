import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gatherStudyMaterial } from "@/lib/research";
import { generateLearningQuilt } from "@/lib/ai";
import {
  trackEvent,
  logActivity,
  recordGeneration,
} from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = enforceUserRateLimit(userId, "learn-quilt", 8, 60_000);
  if (limited) return limited;

  const { field, topic, preferredMode } = await req.json();
  if (!field || !topic) {
    return NextResponse.json({ error: "Field and topic required" }, { status: 400 });
  }

  const { sources, researchBrief } = await gatherStudyMaterial(field, topic);
  const quilt = await generateLearningQuilt({
    field,
    topic,
    preferredMode: preferredMode ?? "mixed",
    sources,
    researchBrief,
  });

  const saved = await prisma.learningQuilt.create({
    data: {
      userId: userId,
      title: quilt.title,
      field,
      topic,
      preferredMode: quilt.recommendedMode,
      tiles: JSON.stringify(quilt.tiles),
    },
  });

  trackEvent({
    userId: userId,
    eventType: EVENT_TYPES.QUILT_GENERATED,
    category: "education",
    metadata: { field, topic, tileCount: quilt.tiles.length },
    req,
  });
  void logActivity({
    userId: userId,
    action: "quilt_generated",
    summary: `Learning quilt: ${topic}`,
    metadata: { quiltId: saved.id, field },
  });
  void recordGeneration({
    userId: userId,
    quiltId: saved.id,
    field,
    topic,
    difficulty: "medium",
    questionCount: quilt.tiles.length,
  });

  return NextResponse.json({ quilt, quiltId: saved.id });
}
