import { notFound } from "next/navigation";
import { UsmleQuickBitesLibrary } from "@/components/quick-bites/UsmleQuickBitesLibrary";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { usmleQuickBitesGate } from "@/lib/quick-bites/usmle-access";
import { USMLE_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-flags";
import {
  loadUsmleQuickBites,
  usmleQuickBitesForGate,
  usmleQuickBiteStepFromQuery,
} from "@/lib/quick-bites/usmle-bites";
import { requireAppPage } from "@/lib/require-premium-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Rapid Review Cards: USMLE — AnyExamEasy" },
  description: "USMLE Rapid Review Cards for Step 1, Step 2 CK, and Step 3.",
  robots: { index: false, follow: false },
};

/** Students get a 404 until a release flag is on. Admins can preview. Released bites are limited to the go-live allowlist. */
export default async function UsmleRapidReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const gate = await usmleQuickBitesGate();
  if (gate === "hidden") notFound();

  const { step: stepQuery } = await searchParams;
  const step = usmleQuickBiteStepFromQuery(stepQuery);
  // Released: only go-live allowlisted ids. Admin preview (flags off): every bite.
  const bites = usmleQuickBitesForGate(loadUsmleQuickBites(step), gate);

  let canReadAll = gate === "preview";
  if (gate === "open") {
    const access = await requireAppPage(USMLE_QUICK_BITES_PATH);
    canReadAll = canPlayQuickBites(access);
  }

  return (
    <div className="dashboard-ui mx-auto w-full min-w-0 max-w-5xl">
      <UsmleQuickBitesLibrary
        step={step}
        bites={bites}
        canReadAll={canReadAll}
        preview={gate === "preview"}
      />
    </div>
  );
}
