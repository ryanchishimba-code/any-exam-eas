import { NextResponse } from "next/server";
import { z } from "zod";
import { isExamSlug } from "@/lib/edtech/exams";
import { ANATOMY_LAYER_IDS, ANATOMY_SYSTEM_IDS } from "@/lib/anatomy/assist-actions";
import { generateAnatomyAssistReply } from "@/lib/anatomy/generate-anatomy-assist";

export const runtime = "nodejs";
export const maxDuration = 45;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4000),
});

const bodySchema = z.object({
  examSlug: z.string().refine(isExamSlug, "Invalid exam"),
  message: z.string().min(1).max(2000),
  selectedStructureId: z.string().nullable().optional(),
  visibleLayers: z.array(z.enum(ANATOMY_LAYER_IDS)).default([]),
  systemFilter: z.enum(["all", ...ANATOMY_SYSTEM_IDS]).default("all"),
  history: z.array(messageSchema).max(12).default([]),
});

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = await enforceUserRateLimit(auth.userId, "anatomy-assist", 20, 60_000);
  if (limited) return limited;

  try {
    const body = bodySchema.parse(await req.json());
    const result = await generateAnatomyAssistReply(
      {
        examSlug: body.examSlug,
        selectedStructureId: body.selectedStructureId ?? null,
        visibleLayers: body.visibleLayers,
        systemFilter: body.systemFilter,
      },
      body.history,
      body.message
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid body" }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Anatomy assist failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
