import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** /nclex/study-guide → first chapter (or placeholder slug). */
export default async function StudyGuideIndexPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.nclexStudyGuide)}`);
  }
  await requirePremiumPage(ROUTES.nclexStudyGuide);

  let first = "manuscript-pending";
  try {
    const guide = await getPublishedGuide("rn");
    const guideId = guide?.id ?? DEFAULT_NCLEX_GUIDE_ID;
    const toc = await getGuideToc(guideId);
    first = toc[0]?.slug ?? "manuscript-pending";
  } catch {
    // DB / Prisma client not ready — still redirect to seed slug
  }
  redirect(`${ROUTES.nclexStudyGuide}/${first}`);
}
