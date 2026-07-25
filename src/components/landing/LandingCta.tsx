"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type LandingCtaProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost-on-dark";
  className?: string;
  icon?: ReactNode;
  /** Conversion analytics — fires cta_clicked on navigate. */
  ctaName?: string;
  location?: string;
};

/** Primary conversion button — teal gradient, pill shape, hover lift. */
export function LandingCta({
  href,
  children,
  variant = "primary",
  className,
  icon,
  ctaName,
  location = "landing",
}: LandingCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "aee-flagship-cta",
        variant === "primary" && "aee-flagship-cta--primary",
        variant === "secondary" && "aee-flagship-cta--secondary",
        variant === "ghost-on-dark" && "aee-flagship-cta--ghost-dark",
        className
      )}
      onClick={() => {
        if (ctaName) analytics.ctaClicked(ctaName, location);
      }}
    >
      {children}
      {icon}
    </Link>
  );
}
