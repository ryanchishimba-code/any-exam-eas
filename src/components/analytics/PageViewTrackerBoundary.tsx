"use client";

import { Suspense } from "react";
import { PageViewTracker } from "./PageViewTracker";

export function PageViewTrackerBoundary() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
