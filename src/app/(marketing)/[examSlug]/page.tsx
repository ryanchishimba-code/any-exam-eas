import { notFound } from "next/navigation";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  EXAM_SEO_KEYS,
  EXAM_SEO_SLUG_ALIASES,
  resolveExamSeoKey,
} from "@/lib/seo/exam-config";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { getUsmleExamOptionsWithCounts } from "@/lib/exam-prep/usmle/exam-options";

export const revalidate = 3600;

type Props = { params: Promise<{ examSlug: string }> };

const STATIC_SLUGS = [
  ...EXAM_SEO_KEYS,
  ...Object.keys(EXAM_SEO_SLUG_ALIASES),
];

export function generateStaticParams() {
  return STATIC_SLUGS.map((examSlug) => ({ examSlug }));
}

export async function generateMetadata({ params }: Props) {
  const { examSlug } = await params;
  return buildExamMetadata(examSlug);
}

export default async function ExamMarketingPage({ params }: Props) {
  const { examSlug } = await params;
  const key = resolveExamSeoKey(examSlug);
  if (!key) notFound();

  // Live, accurate per-exam question count for the hero (cached ~1h).
  const bankCounts = buildLandingBankCountsDisplay(await getCachedQuestionBankCounts());
  const questionCountLabel = bankCounts.exams.find((row) => row.slug === key)?.countLabel;

  const usmleStepCounts =
    key === "usmle"
      ? Object.fromEntries(
          (await getUsmleExamOptionsWithCounts()).options.map((opt) => [
            opt.level,
            opt.questionCount,
          ])
        )
      : undefined;

  return (
    <>
      <JsonLdScript data={buildExamJsonLd(key)} />
      <ExamMarketingLanding
        examKey={key}
        questionCountLabel={questionCountLabel}
        usmleStepCounts={usmleStepCounts}
      />
    </>
  );
}
