import { redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { getCachedSession } from "@/lib/auth/session";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** /nclex/study-guide → first chapter (or placeholder slug). */
export default async function StudyGuideIndexPage() {
  let first = "manuscript-pending";

  // Access check and table of contents share one fallback; `unstable_rethrow`
  // keeps the login and paywall redirects working.
  try {
    first = await withDbRetry(async () => {
      const session = await getCachedSession();
      if (!session?.user?.id) {
        redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.nclexStudyGuide)}`);
      }
      await requirePremiumPage(ROUTES.nclexStudyGuide);

      const guide = await getPublishedGuide("rn");
      const guideId = guide?.id ?? DEFAULT_NCLEX_GUIDE_ID;
      const toc = await getGuideToc(guideId);
      return toc[0]?.slug ?? "manuscript-pending";
    });
  } catch (e) {
    unstable_rethrow(e);
    console.error("[nclex/study-guide] index", e);
    return <StudyGuideUnavailable />;
  }

  redirect(`${ROUTES.nclexStudyGuide}/${first}`);
}
