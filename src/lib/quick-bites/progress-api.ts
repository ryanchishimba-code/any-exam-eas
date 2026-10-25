import { NextResponse } from "next/server";
import type { UserAccess } from "@/lib/access-control";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites, canPlayQuickBiteEpisode } from "@/lib/quick-bites/access";
import { isOpenQuickBite } from "@/lib/quick-bites/catalog";
import { isOpenPharmacyQuickBite } from "@/lib/quick-bites/pharmacy-catalog";
import { listQuickBiteProgressForUser } from "@/lib/quick-bites/progress-server";

export async function quickBiteProgressListResponse(
  request: Request,
  options: {
    slugs: readonly string[];
    canRead: (access: UserAccess) => boolean;
    lockedMessage: string;
  }
) {
  const authResult = await requireAuthenticatedApi(request);
  if (!authResult.ok) return authResult.response;
  if (!options.canRead(authResult.access)) {
    return NextResponse.json({ error: options.lockedMessage }, { status: 403 });
  }
  const progress = await listQuickBiteProgressForUser(authResult.userId, options.slugs);
  return NextResponse.json(
    { progress },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export function nursingQuickBiteProgressAccess(access: UserAccess, slug: string): boolean {
  if (isOpenQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}

export function pharmacyQuickBiteProgressAccess(access: UserAccess, slug: string): boolean {
  if (isOpenPharmacyQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}

export function canReadNursingQuickBiteProgress(access: UserAccess, slugs: readonly string[]): boolean {
  return slugs.some((slug) => nursingQuickBiteProgressAccess(access, slug));
}

export function canReadPharmacyQuickBiteProgress(access: UserAccess, slugs: readonly string[]): boolean {
  return slugs.some((slug) => pharmacyQuickBiteProgressAccess(access, slug));
}

export function canReadPaidQuickBiteProgress(access: UserAccess): boolean {
  return canPlayQuickBites(access);
}
