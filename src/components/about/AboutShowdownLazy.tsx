"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function AboutChartsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-12">
      <Skeleton className="h-72 w-full rounded-[28px]" />
      <Skeleton className="h-80 w-full rounded-[28px]" />
    </div>
  );
}

export const AboutShowdownLazy = dynamic(
  () => import("./AboutShowdown").then((m) => m.AboutShowdown),
  { loading: () => <AboutChartsSkeleton />, ssr: false }
);
