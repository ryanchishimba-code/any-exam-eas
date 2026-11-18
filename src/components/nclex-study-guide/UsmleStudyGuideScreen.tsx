import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideReader, type StudyGuideStepLink } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { StudyGuideUpsell } from "@/components/nclex-study-guide/StudyGuideUpsell";
import {
  USMLE_GUIDE_INDEX_PATH,
  USMLE_GUIDE_STEP_LABEL,
  USMLE_GUIDE_STEPS,
  USMLE_STUDY_GUIDES,
  usmleGuideStepFromRoute,
  type UsmleGuideStep,
} from "@/lib/nclex-study-guide/guide-registry";
import { loadUsmleBook } from "@/lib/nclex-study-guide/usmle-load";
import { usmleGuideGate } from "@/lib/nclex-study-guide/usmle-guide-access";
import { resolveStudyGuideAccess } from "@/lib/require-premium-page";

function stepLinks(current: UsmleGuideStep): StudyGuideStepLink[] {
  return USMLE_GUIDE_STEPS.map((step) => ({
    label: USMLE_GUIDE_STEP_LABEL[step],
    href: USMLE_STUDY_GUIDES[step].routeBase,
    current: step === current,
  }));
}

async function visibleOrNotFound(): Promise<"open" | "preview"> {
  const gate = await usmleGuideGate();
  if (gate === "hidden") notFound();
  return gate;
}

/** /usmle/study-guide opens Step 1. The switcher inside the reader changes books. */
export async function UsmleStudyGuideIndexRedirect() {
  await visibleOrNotFound();
  redirect(USMLE_STUDY_GUIDES.step1.routeBase);
}

export async function UsmleStudyGuideStepIndex({ routeStep }: { routeStep: string }) {
  const step = usmleGuideStepFromRoute(routeStep);
  if (!step) notFound();
  const gate = await visibleOrNotFound();
  const config = USMLE_STUDY_GUIDES[step];

  if (gate === "open") {
    const access = await resolveStudyGuideAccess(config.routeBase);
    if (access.status === "upsell") {
      return <StudyGuideUpsell exam="usmle" signedIn={access.signedIn} book={config} />;
    }
  }

  let first = "";
  try {
    const loaded = await loadUsmleBook(step, null);
    first = loaded.chapter?.slug ?? loaded.toc[0]?.slug ?? "";
  } catch (error) {
    unstable_rethrow(error);
    console.error("[usmle/study-guide] index", error);
    return <StudyGuideUnavailable exam="usmle" book={config} />;
  }

  if (!first) return <StudyGuideUnavailable exam="usmle" book={config} />;
  redirect(`${config.routeBase}/${first}`);
}

export async function UsmleStudyGuideChapter({
  routeStep,
  chapterSlug,
}: {
  routeStep: string;
  chapterSlug: string;
}) {
  const step = usmleGuideStepFromRoute(routeStep);
  if (!step) notFound();
  const gate = await visibleOrNotFound();
  const config = USMLE_STUDY_GUIDES[step];

  if (gate === "open") {
    const access = await resolveStudyGuideAccess(`${config.routeBase}/${chapterSlug}`);
    if (access.status === "upsell") {
      return <StudyGuideUpsell exam="usmle" signedIn={access.signedIn} book={config} />;
    }
  }

  let loaded;
  try {
    loaded = await loadUsmleBook(step, chapterSlug);
  } catch (error) {
    unstable_rethrow(error);
    console.error("[usmle/study-guide]", error);
    return <StudyGuideUnavailable exam="usmle" book={config} />;
  }

  if (!loaded.chapter) notFound();

  return (
    <StudyGuideReader
      exam="usmle"
      book={config}
      guideId={loaded.guideId}
      guideTitle={loaded.guideTitle}
      chapters={loaded.toc}
      chapter={loaded.chapter}
      steps={stepLinks(step)}
      notice={gate === "preview" ? "Admin preview" : undefined}
    />
  );
}

export { USMLE_GUIDE_INDEX_PATH };
