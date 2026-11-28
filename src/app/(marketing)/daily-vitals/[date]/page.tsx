import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { DailyVitalsDay } from "@/components/daily-vitals/DailyVitalsDay";
import { dayMetadata } from "@/lib/daily-vitals/metadata";
import { parseDailyVitalsDate, todayIsoCentral } from "@/lib/daily-vitals/schedule";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ date: todayIsoCentral() }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  if (!parseDailyVitalsDate(date)) {
    await connection();
    return {};
  }
  return dayMetadata(date);
}

export default async function DailyVitalsDatedPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!parseDailyVitalsDate(date)) {
    await connection();
    notFound();
  }
  return <DailyVitalsDay date={date} />;
}
