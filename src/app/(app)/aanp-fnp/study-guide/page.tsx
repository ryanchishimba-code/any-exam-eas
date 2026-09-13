import { redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";
import { loadPublishedGuideFirstSlug } from "@/lib/nclex-study-guide/load-published";

export const dynamic = "force-dynamic";

const EXAM = "aanp-fnp" as const;
const CONFIG = STUDY_GUIDES[EXAM];

/** /aanp-fnp/study-guide → first chapter (or placeholder slug). */
export default async function StudyGuideIndexPage() {
  let first = "manuscript-pending";

  try {
    first = await loadPublishedGuideFirstSlug(EXAM);
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[${EXAM}/study-guide] index`, e);
    return <StudyGuideUnavailable exam={EXAM} />;
  }

  redirect(`${CONFIG.routeBase}/${first}`);
}
