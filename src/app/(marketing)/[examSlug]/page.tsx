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
  getQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

export const dynamic = "force-dynamic";

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
  const bankCounts = buildLandingBankCountsDisplay(await getQuestionBankCounts());
  const questionCountLabel = bankCounts.exams.find((row) => row.slug === key)?.countLabel;

  return (
    <>
      <JsonLdScript data={buildExamJsonLd(key)} />
      <ExamMarketingLanding examKey={key} questionCountLabel={questionCountLabel} />
    </>
  );
}
