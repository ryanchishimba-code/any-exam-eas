import { NextResponse } from "next/server";
import { z } from "zod";
import { recordDrugReview } from "@/lib/drugs300";

export const runtime = "nodejs";

const bodySchema = z.object({
  drugId: z.string().min(1),
  grade: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  try {
    const body = bodySchema.parse(await req.json());
    const card = await recordDrugReview(auth.userId, body.drugId, body.grade);
    return NextResponse.json({ card });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid body" }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Review failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
