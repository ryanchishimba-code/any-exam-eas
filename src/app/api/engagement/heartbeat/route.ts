import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { ENGAGEMENT_SURFACES } from "@/lib/engagement/config";
import { processEngagementHeartbeat } from "@/lib/engagement/heartbeat-server";

export const runtime = "nodejs";

const surfaceSchema = z.enum(
  ENGAGEMENT_SURFACES as unknown as [
    (typeof ENGAGEMENT_SURFACES)[number],
    ...(typeof ENGAGEMENT_SURFACES)[number][]
  ]
);

const bodySchema = z.object({
  surface: surfaceSchema,
  requestedSeconds: z.number().min(0).max(60).default(30),
});

export async function POST(request: Request) {
  const auth = await requireAuthenticatedApi(request);
  if (!auth.ok) return auth.response;

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await request.json();
    body = bodySchema.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const result = await processEngagementHeartbeat(
    auth.userId,
    body.surface,
    body.requestedSeconds
  );

  return NextResponse.json({ ok: true, ...result });
}
