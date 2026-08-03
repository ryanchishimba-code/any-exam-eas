import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QotdPractice } from "@/components/marketing/QotdPractice";
import {
  getQotdForExam,
  isQotdExamSlug,
  qotdAbsoluteUrl,
  todayIsoUtc,
} from "@/lib/demo/qotd";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { getSiteUrl } from "@/lib/seo";
import { qotdPath } from "@/lib/demo/qotd";

type Props = { params: Promise<{ exam: string }> };

export function generateStaticParams() {
  return EXAM_SLUGS.map((exam) => ({ exam }));
}

/** Only the six board slugs are valid under /daily/[exam]. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam } = await params;
  if (!isQotdExamSlug(exam)) return {};
  const today = todayIsoUtc();
  const item = getQotdForExam(exam, today);
  const name = EXAM_CATALOG[exam].shortName;
  const canonical = qotdAbsoluteUrl(exam, today);
  const description =
    item.stem.length > 155 ? `${item.stem.slice(0, 152)}…` : item.stem;
  const ogImage = `${getSiteUrl()}${qotdPath(exam, today)}/opengraph-image`;

  return {
    title: `${name} Question of the Day`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} Question of the Day | AnyExamEasy`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} Question of the Day` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Question of the Day | AnyExamEasy`,
      description,
      images: [ogImage],
    },
  };
}

/** Today’s QOTD for an exam — canonical points at the dated share URL. */
export default async function DailyExamTodayPage({ params }: Props) {
  const { exam } = await params;
  if (!isQotdExamSlug(exam)) notFound();

  const today = todayIsoUtc();
  const item = getQotdForExam(exam, today);

  return (
    <div className="aee-qotd-page">
      <div className="aee-qotd-page__inner">
        <QotdPractice
          item={item}
          dateIso={today}
          absoluteShareUrl={qotdAbsoluteUrl(exam, today)}
        />
      </div>
    </div>
  );
}
