import { permanentRedirect } from "next/navigation";
import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";
import { getCachedSession } from "@/lib/auth/session";
import { isStaffRole } from "@/lib/permissions";
import { USMLE_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-flags";
import {
  isUsmleVideoQuickBitesReleased,
  usmleVideoRouteDecision,
} from "@/lib/quick-bites/usmle-video-flags";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Quick Bites: USMLE — AnyExamEasy" },
  robots: { index: false, follow: false },
};

function cardsLocation(searchParams: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
    }
  }
  const text = query.toString();
  return text ? `${USMLE_QUICK_BITES_PATH}?${text}` : USMLE_QUICK_BITES_PATH;
}

/** Videos when the flag is on. Staff can preview while it is off. Everyone else keeps the cards URL. */
export default async function UsmleQuickBitesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getCachedSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const released = isUsmleVideoQuickBitesReleased();
  if (usmleVideoRouteDecision(released, isStaffRole(role)) === "cards") {
    permanentRedirect(cardsLocation(await searchParams));
  }

  const params = await searchParams;
  const stepQuery = typeof params.step === "string" ? params.step : null;
  return (
    <QuickBitesPage
      exam="usmle"
      initialVideoStepQuery={stepQuery}
      includeHeldVideos={!released}
      previewNote={
        released ? undefined : "Staff preview. Students cannot see this. Nothing here is live."
      }
    />
  );
}
