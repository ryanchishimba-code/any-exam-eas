import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import {
  getQotdForExam,
  isQotdExamSlug,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdPath,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ exam: string; date: string }> };

/**
 * A dated URL is the question for that UTC day on every board. Today’s six
 * share links are prerendered; any other valid date is cached for a day after
 * the first request. Invalid dates 404. A deploy rebuilds the pack.
 */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const today = new Date().toISOString().slice(0, 10);
  return EXAM_SLUGS.map((exam) => ({ exam, date: today }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam, date } = await params;
  if (!isQotdExamSlug(exam) || !parseQotdDate(date)) return {};
  const item = getQotdForExam(exam, date);
  const name = EXAM_CATALOG[exam].shortName;
  const canonical = qotdAbsoluteUrl(exam, date);
  const description =
    item.stem.length > 155 ? `${item.stem.slice(0, 152)}…` : item.stem;
  const ogImageUrl = `${getSiteUrl()}${qotdPath(exam, date)}/opengraph-image`;

  return {
    title: `${name} Question of the Day — ${date}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} Question of the Day | AnyExamEasy`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${name} Question of the Day` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Question of the Day | AnyExamEasy`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DailyExamDatedPage({ params }: Props) {
  const { exam, date } = await params;
  if (!isQotdExamSlug(exam) || !parseQotdDate(date)) notFound();

  const item = getQotdForExam(exam, date);
  const absoluteShareUrl = qotdAbsoluteUrl(exam, date);

  return (
    <div className="aee-qotd-page">
      <div className="aee-qotd-page__inner">
        <QotdPractice item={item} dateIso={date} absoluteShareUrl={absoluteShareUrl} />
      </div>
    </div>
  );
}
