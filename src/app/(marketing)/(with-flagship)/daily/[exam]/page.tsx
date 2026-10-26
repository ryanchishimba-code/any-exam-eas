import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DailyAnswerBlock } from "@/components/marketing/DailyQuestionArticle";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  getQotdForExam,
  isQotdExamSlug,
  qotdAbsoluteUrl,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { dailyExamDescription, dailyExamTitle } from "@/lib/marketing/daily-copy";
import { getSiteUrl } from "@/lib/seo";
import { buildDailyExamJsonLd } from "@/lib/seo/daily-jsonld";
import { qotdPath } from "@/lib/demo/qotd";

type Props = { params: Promise<{ exam: string }> };

/** Only the six board slugs are valid under /daily/[exam]. */
export const dynamicParams = false;

/**
 * Same one-minute window as the hub. Each of the six boards is prerendered
 * from the America/Chicago date, so the item rolls at midnight Central
 * rather than at 7 PM.
 */
export const revalidate = 60;

export function generateStaticParams() {
  return EXAM_SLUGS.map((exam) => ({ exam }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam } = await params;
  if (!isQotdExamSlug(exam)) return {};
  const today = todayIsoCentral();
  const item = getQotdForExam(exam, today);
  if (!item) return {};
  const name = EXAM_CATALOG[exam].shortName;
  const canonical = `${getSiteUrl()}${qotdPath(exam)}`;
  const title = dailyExamTitle(name);
  const description = dailyExamDescription(name, item.stem);
  const ogImage = `${getSiteUrl()}${qotdPath(exam, today)}/opengraph-image`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Today’s QOTD for an exam. This undated URL is the indexable canonical. */
export default async function DailyExamTodayPage({ params }: Props) {
  const { exam } = await params;
  if (!isQotdExamSlug(exam)) notFound();

  const today = todayIsoCentral();
  const item = getQotdForExam(exam, today);
  if (!item) notFound();

  return (
    <div className="aee-qotd-page">
      <JsonLdScript data={buildDailyExamJsonLd(item, today)} />
      <div className="aee-qotd-page__inner">
        <QotdPractice
          item={toPublicQotd(item)}
          dateIso={today}
          absoluteShareUrl={qotdAbsoluteUrl(exam, today)}
        />
        <DailyAnswerBlock item={item} />
      </div>
    </div>
  );
}
