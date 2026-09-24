import { requirePremiumApi } from "@/lib/api-access";
import type { NextResponse } from "next/server";

/**
 * Published study-guide HTML, TOC, and personal annotations share the page
 * gate (`requirePremiumPage` / `hasPremiumAccess`). Trial and paid study
 * access pass. Guests and post-trial free do not.
 */
export async function requireStudyGuidePremium(req?: Request): Promise<
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }
> {
  const access = await requirePremiumApi(req);
  if (!access.ok) return access;
  return { ok: true, userId: access.userId };
}
