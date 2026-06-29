"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";
import { analytics } from "@/lib/analytics";

export function AboutCtas() {
  return (
    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Button
        href={ROUTES.auth.signup}
        onClick={() => analytics.ctaClicked("start_free_trial", "about_hero")}
      >
        Start free trial
      </Button>
      <Button
        href={ROUTES.pricing}
        variant="secondary"
        onClick={() => analytics.ctaClicked("view_pricing", "about_hero")}
      >
        View pricing
      </Button>
      <Link
        href={ROUTES.toolkit}
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        onClick={() => analytics.ctaClicked("explore_toolkit", "about_hero")}
      >
        Explore the toolkit
      </Link>
    </div>
  );
}
