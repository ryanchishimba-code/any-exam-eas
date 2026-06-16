import { notFound } from "next/navigation";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  EXAM_SEO_KEYS,
  EXAM_SEO_SLUG_ALIASES,
  resolveExamSeoKey,
} from "@/lib/seo/exam-config";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";

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

  return (
    <>
      <JsonLdScript data={buildExamJsonLd(key)} />
      <ExamMarketingLanding examKey={key} />
    </>
  );
}
