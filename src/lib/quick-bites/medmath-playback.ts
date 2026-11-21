import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";

const LOCKED = {
  error: "A paid membership is required to watch Medical Math.",
  code: "MEDMATH_LOCKED",
} as const;

export async function requireMedmathPlayer(request: Request) {
  const auth = await requireAuthenticatedApi(request);
  if (!auth.ok) return auth;
  if (auth.access.role === "staff" || canPlayQuickBites(auth.access)) {
    return { ok: true as const, userId: auth.userId };
  }
  return { ok: false as const, response: NextResponse.json(LOCKED, { status: 403 }) };
}
