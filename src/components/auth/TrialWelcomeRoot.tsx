"use client";

import type { ReactNode } from "react";
import { TrialWelcomeProvider } from "@/components/auth/TrialWelcomeHost";

/**
 * Wraps the app shell so dashboard code can tell when the trial welcome is showing.
 * The host's useSearchParams suspense boundary stays inside the provider and does
 * not remount the page.
 */
export function TrialWelcomeRoot({ children }: { children?: ReactNode }) {
  return <TrialWelcomeProvider>{children}</TrialWelcomeProvider>;
}
