import { redirect } from "next/navigation";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** /nclex/study-guide → first chapter (or placeholder slug). */
export default async function StudyGuideIndexPage() {
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
