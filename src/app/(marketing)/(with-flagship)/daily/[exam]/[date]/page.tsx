import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { DailyAnswerBlock } from "@/components/marketing/DailyQuestionArticle";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import {
  getQotdForExam,
  isQotdExamSlug,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdMatchesToday,
  qotdPath,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { dailyExamDescription, dailyExamTitle } from "@/lib/marketing/daily-copy";
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
  const selfUrl = qotdAbsoluteUrl(exam, date);
  const liveUrl = `${getSiteUrl()}${qotdPath(exam)}`;
  const sameAsLive = qotdMatchesToday(date);
  const canonical = sameAsLive ? liveUrl : selfUrl;
  const title = dailyExamTitle(name);
  const description = dailyExamDescription(name, item.stem);
  const ogImageUrl = `${getSiteUrl()}${qotdPath(exam, date)}/opengraph-image`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    // Dated URLs repeat the 7-day pack or a past item. The undated board URL
    // is the only indexable copy, with dateModified for freshness.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: selfUrl,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
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
        <DailyAnswerBlock item={item} />
      </div>
    </div>
  );
}
