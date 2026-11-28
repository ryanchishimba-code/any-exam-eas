import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DailyTrialSticky } from "@/components/marketing/DailyTrialCta";
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
import { qotdExamMetaDescription, qotdExamTitle } from "@/lib/demo/qotd-titles";
import { getSiteUrl } from "@/lib/seo";
import { publicWebPageJsonLd } from "@/lib/seo/public-schema";
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
  const description = qotdExamMetaDescription(exam);
  const ogImage = `${getSiteUrl()}${qotdPath(exam, today)}/opengraph-image`;

  const title = qotdExamTitle(name);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} Question of the Day` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Today’s QOTD for an exam — canonical stays on /daily/{exam}. */
export default async function DailyExamTodayPage({ params }: Props) {
  const { exam } = await params;
  if (!isQotdExamSlug(exam)) notFound();

  const today = todayIsoCentral();
  const item = getQotdForExam(exam, today);
  if (!item) notFound();

  const name = EXAM_CATALOG[exam].shortName;
  const path = qotdPath(exam);
  const title = qotdExamTitle(name);
  const description = qotdExamMetaDescription(exam);

  return (
    <div className="aee-qotd-page">
      <JsonLdScript
        data={publicWebPageJsonLd({
          name: title,
          description,
          path,
          crumbs: [
            { name: "Daily", path: "/daily" },
            { name, path },
          ],
        })}
      />
      <div className="aee-qotd-page__inner">
        <QotdPractice
          item={toPublicQotd(item)}
          dateIso={today}
          absoluteShareUrl={qotdAbsoluteUrl(exam, today)}
        />
      </div>
      <DailyTrialSticky board={exam} />
    </div>
  );
}
