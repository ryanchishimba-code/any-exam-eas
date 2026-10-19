import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import {
  getQotdForExam,
  isQotdExamSlug,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdPath,
  toPublicQotd,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ exam: string; date: string }> };

/**
 * A dated URL is one America/Chicago calendar day. Whether that day is still
 * ahead of today depends on the clock, so this segment renders on each request.
 *
 * Do not opt this segment into ISR and then call the Next connection API to
 * uncache a 404. That throws DYNAMIC_SERVER_USAGE during the static render, and
 * the live route returns 500 before notFound runs. `force-dynamic` reads
 * Central time per request:
 * invalid and future dates 404, and a URL that becomes today at midnight is
 * not stuck on a cached not-found page.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam, date } = await params;
  const now = new Date();
  if (!isQotdExamSlug(exam) || !parseQotdDate(date, now)) return {};
  const item = getQotdForExam(exam, date, now);
  if (!item) return {};
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
  const now = new Date();
  if (!isQotdExamSlug(exam) || !parseQotdDate(date, now)) notFound();

  const item = getQotdForExam(exam, date, now);
  if (!item) notFound();
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
