"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getLandingVisual, landingVisualSrc } from "@/lib/marketing/landing-visuals";

type Props = {
  visualId: string;
  /** Override public path; defaults to LANDING_VISUAL_PATHS */
  src?: string;
  className?: string;
  children?: ReactNode;
  priority?: boolean;
  fit?: "cover" | "contain";
};

/**
 * Landing graphic — uses image from /public/images/landing/ when available.
 */
export function LandingVisualSlot({
  visualId,
  src: srcOverride,
  className = "",
  children,
  priority = false,
  fit = "cover",
}: Props) {
  const spec = getLandingVisual(visualId);
  const src = srcOverride ?? landingVisualSrc(visualId);

  return (
    <figure
      className={`overflow-hidden ${className}`}
      data-visual-id={visualId}
      data-image-prompt={spec?.prompt}
      data-recommended-size={spec?.recommendedSize}
    >
      {src ? (
        <Image
          src={src}
          alt={spec?.alt ?? "Any Exam Easy product illustration"}
          width={1200}
          height={800}
          priority={priority}
          className={cn(
            "h-full w-full object-center",
            fit === "contain" ? "object-contain" : "object-cover"
          )}
          sizes="(max-width: 640px) 100vw, 480px"
        />
      ) : (
        children
      )}
      {spec ? <figcaption className="sr-only">{spec.alt}</figcaption> : null}
    </figure>
  );
}
