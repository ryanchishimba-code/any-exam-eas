import { appBaseUrl } from "@/lib/email/config";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { prisma } from "@/lib/prisma";
import { firstTenQuestionsHref } from "@/lib/study/first-ten-href";

/** The exam on the account, or a single choose-your-exam step when none is saved. */
export type LifecycleExam = {
  slug: string | null;
  /** Catalog short name, such as NCLEX or AANP FNP. Null when no exam is saved. */
  name: string | null;
  startUrl: string;
  startCta: string;
};

export function lifecycleExamFromSlug(slug: string | null | undefined): LifecycleExam {
  if (slug && isExamSlug(slug)) {
    const name = EXAM_CATALOG[slug].shortName;
    return {
      slug,
      name,
      startUrl: `${appBaseUrl()}${firstTenQuestionsHref(slug)}`,
      startCta: `Start with 10 ${name} questions`,
    };
  }
  return {
    slug: null,
    name: null,
    startUrl: `${appBaseUrl()}/select-exam`,
    startCta: "Choose your exam, then start 10 questions",
  };
}

/** Reads the selected exam from UserExamPreference.examSlug. */
export async function loadLifecycleExam(userId: string): Promise<LifecycleExam> {
  const pref = await prisma.userExamPreference.findUnique({
    where: { userId },
    select: { examSlug: true },
  });
  return lifecycleExamFromSlug(pref?.examSlug);
}
