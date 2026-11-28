import type { Metadata } from "next";
import { DailyVitalsDay } from "@/components/daily-vitals/DailyVitalsDay";
import { hubMetadata } from "@/lib/daily-vitals/metadata";
import { todayIsoCentral } from "@/lib/daily-vitals/schedule";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return hubMetadata();
}

export default function DailyVitalsPage() {
  return <DailyVitalsDay date={todayIsoCentral()} />;
}
