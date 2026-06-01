"use client";

import { Suspense } from "react";
import { TrialWelcomeHost } from "@/components/auth/TrialWelcomeHost";

function TrialWelcomeFallback() {
  return null;
}

/** Suspense boundary required for useSearchParams in TrialWelcomeHost. */
export function TrialWelcomeRoot() {
  return (
    <Suspense fallback={<TrialWelcomeFallback />}>
      <TrialWelcomeHost />
    </Suspense>
  );
}
