import { redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { getCachedSession } from "@/lib/auth/session";
import {
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

const EXAM = "aanp-fnp" as const;
const CONFIG = STUDY_GUIDES[EXAM];

/** /aanp-fnp/study-guide → first chapter (or placeholder slug). */
export default async function StudyGuideIndexPage() {
  let first = "manuscript-pending";

  try {
    first = await withDbRetry(async () => {
      const session = await getCachedSession();
      if (!session?.user?.id) {
        redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(CONFIG.routeBase)}`);
      }
      await requirePremiumPage(CONFIG.routeBase);

      const guide = await getPublishedGuide(EXAM);
      const guideId = guide?.id ?? CONFIG.guideId;
      const toc = await getGuideToc(guideId);
      return toc[0]?.slug ?? "manuscript-pending";
    });
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[${EXAM}/study-guide] index`, e);
    return <StudyGuideUnavailable exam={EXAM} />;
  }

  redirect(`${CONFIG.routeBase}/${first}`);
}
