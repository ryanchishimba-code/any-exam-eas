import { notFound } from "next/navigation";
import { UsmleQuickBitesLibrary } from "@/components/quick-bites/UsmleQuickBitesLibrary";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { usmleQuickBitesGate } from "@/lib/quick-bites/usmle-access";
import { USMLE_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-flags";
import {
  loadUsmleQuickBites,
  usmleQuickBiteStepFromQuery,
} from "@/lib/quick-bites/usmle-bites";
import { requireAppPage } from "@/lib/require-premium-page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Quick Bites: USMLE — AnyExamEasy" },
  description: "Hidden USMLE Quick Bites for Step 1, Step 2 CK, and Step 3.",
  robots: { index: false, follow: false },
};

/** Students get a 404 until a release flag is on. Admins can preview. */
export default async function UsmleQuickBitesPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const gate = await usmleQuickBitesGate();
  if (gate === "hidden") notFound();

  const { step: stepQuery } = await searchParams;
  const step = usmleQuickBiteStepFromQuery(stepQuery);
  const bites = loadUsmleQuickBites(step);

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
