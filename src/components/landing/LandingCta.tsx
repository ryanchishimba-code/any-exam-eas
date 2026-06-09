"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingCtaProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost-on-dark";
  className?: string;
  icon?: ReactNode;
};

/** Primary conversion button — teal gradient, pill shape, hover lift. */
export function LandingCta({
  href,
  children,
  variant = "primary",
  className,
  icon,
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
    >
      {children}
      {icon}
    </Link>
  );
}
