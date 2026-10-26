import { NextResponse } from "next/server";
import type { UserAccess } from "@/lib/access-control";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites, canPlayQuickBiteEpisode } from "@/lib/quick-bites/access";
import { isOpenQuickBite } from "@/lib/quick-bites/catalog";
import { isOpenFnpQuickBite } from "@/lib/quick-bites/fnp-catalog";
import { isOpenPanceQuickBite } from "@/lib/quick-bites/pance-catalog";
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

export function fnpQuickBiteProgressAccess(access: UserAccess, slug: string): boolean {
  if (isOpenFnpQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}

export function panceQuickBiteProgressAccess(access: UserAccess, slug: string): boolean {
  if (isOpenPanceQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}

export function canReadFnpQuickBiteProgress(access: UserAccess, slugs: readonly string[]): boolean {
  return slugs.some((slug) => fnpQuickBiteProgressAccess(access, slug));
}

export function canReadPanceQuickBiteProgress(access: UserAccess, slugs: readonly string[]): boolean {
  return slugs.some((slug) => panceQuickBiteProgressAccess(access, slug));
}
