import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateMnemonic } from "@/lib/drugs300";

export const runtime = "nodejs";

const bodySchema = z.object({
  drugId: z.string().min(1),
});

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = await enforceUserRateLimit(auth.userId, "drugs300-mnemonic", 12, 60_000);
  if (limited) return limited;

  try {
    const body = bodySchema.parse(await req.json());
    const mnemonic = await getOrCreateMnemonic(auth.userId, body.drugId);
    return NextResponse.json({ mnemonic });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid body" }, { status: 400 });
    }
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    const message = e instanceof Error ? e.message : "Mnemonic generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
