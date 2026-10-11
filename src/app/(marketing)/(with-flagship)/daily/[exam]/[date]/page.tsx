import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import {
  getQotdForExam,
  isQotdExamSlug,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdPath,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ exam: string; date: string }> };

/**
 * A dated URL is that America/Chicago calendar day. Today’s six share links
 * are prerendered; any other past or current date is cached for a day after
 * the first request. Future and invalid dates 404 without caching, so a URL
 * that is still tomorrow is not stuck as a not-found page after midnight.
 */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const today = todayIsoCentral();
  return EXAM_SLUGS.map((exam) => ({ exam, date: today }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam, date } = await params;
  if (!isQotdExamSlug(exam) || !parseQotdDate(date)) {
    await connection();
    return {};
  }
  const item = getQotdForExam(exam, date);
  if (!item) {
    await connection();
    return {};
  }
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
  if (!isQotdExamSlug(exam) || !parseQotdDate(date)) {
    await connection();
    notFound();
  }

  const item = getQotdForExam(exam, date);
  if (!item) {
    await connection();
    notFound();
  }
  const absoluteShareUrl = qotdAbsoluteUrl(exam, date);

  return (
    <div className="aee-qotd-page">
      <div className="aee-qotd-page__inner">
        <QotdPractice
          item={toPublicQotd(item)}
          dateIso={date}
          absoluteShareUrl={absoluteShareUrl}
        />
      </div>
    </div>
  );
}
