import { notFound } from "next/navigation";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  EXAM_SEO_KEYS,
  EXAM_SEO_SLUG_ALIASES,
  resolveExamSeoKey,
} from "@/lib/seo/exam-config";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";
import { presentBoardInventory } from "@/lib/inventory/active-questions";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";

/**
 * Five-minute ISR for `/naplex` and the other board hubs. This must stay a
 * numeric literal and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS. Counts
 * use that shared stamp cache, so a purge refreshes every surface together.
 * A missed purge cannot keep an hour-old total.
 */
export const revalidate = 300;

/**
 * Unknown single-segment URLs 404 here. There is no root `loading.tsx`:
 * a root Suspense boundary streams HTTP 200 before `notFound()` can set 404.
 */
export const dynamicParams = false;

type Props = { params: Promise<{ examSlug: string }> };

const STATIC_SLUGS = [
  ...EXAM_SEO_KEYS,
  ...Object.keys(EXAM_SEO_SLUG_ALIASES),
];

export function generateStaticParams() {
  // `/nclex` is owned by the product hub at `src/app/nclex` (Study Guide entry).
  return STATIC_SLUGS.filter((examSlug) => examSlug !== "nclex").map((examSlug) => ({
    examSlug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { examSlug } = await params;
  const key = resolveExamSeoKey(examSlug);
  if (!key) notFound();
  return buildExamMetadata(examSlug);
}

export default async function ExamMarketingPage({ params }: Props) {
  const { examSlug } = await params;
  const key = resolveExamSeoKey(examSlug);
  if (!key) notFound();

  // Same cached snapshot the bank-counts API serves.
  const { bundle, display: bankCounts } = await loadPublicQuestionCounts({ dynamic: false });
  const { snapshot, inventory } = bundle;
  const examCount = bankCounts.exams.find((row) => row.slug === key);
  const questionCountLabel = examCount?.sentence.includes("including")
    ? examCount.sentence
    : examCount?.countLabel;
  const boardInventory = presentBoardInventory({
    slug: key,
    usingLiveCount: !bankCounts.degraded && (examCount?.served ?? 0) > 0,
    board: inventory.boards[key] ?? null,
    clinical: snapshot.boards?.[key] ?? null,
  });

  const [testimonials, samples] = await Promise.all([
    getCachedPublishedTestimonials(6),
    getPublicSampleQuestions(),
  ]);

  const usmleStepCounts =
    key === "usmle" && !inventory.degraded
      ? {
          step1: inventory.fields["usmle-step-1"]?.active ?? 0,
          step2: inventory.fields["usmle-step-2"]?.active ?? 0,
          step3: inventory.fields["usmle-step-3"]?.active ?? 0,
        }
      : undefined;

  return (
    <>
      <JsonLdScript data={buildExamJsonLd(key, inventory.boards[key]?.formats ?? null)} />
      <ExamMarketingLanding
        examKey={key}
        questionCountLabel={questionCountLabel}
        inventory={boardInventory}
        usmleStepCounts={usmleStepCounts}
        testimonials={testimonials}
        samples={samples}
      />
    </>
  );
}
