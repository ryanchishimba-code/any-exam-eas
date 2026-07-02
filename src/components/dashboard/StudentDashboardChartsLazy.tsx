"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Skeleton className="h-80 rounded-2xl lg:col-span-3" />
      <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
    </div>
  );
}

export const StudentDashboardCharts = dynamic(
  () => import("./StudentDashboardCharts").then((m) => m.StudentDashboardCharts),
  { loading: () => <ChartsSkeleton />, ssr: false }
);
