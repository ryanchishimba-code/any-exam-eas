"use client";

import Image from "next/image";
import { getLandingVisual, landingVisualSrc } from "@/lib/marketing/landing-visuals";

export function LandingAppMockup() {
  const spec = getLandingVisual("hero-app-mockup");
  const src = landingVisualSrc("hero-app-mockup");

  return (
    <figure
      className="aee-landing-app-mockup"
      data-visual-id="hero-app-mockup"
      data-image-prompt={spec?.prompt}
    >
      <div className="aee-landing-app-mockup__frame overflow-hidden">
        <Image
          src={src!}
          alt={spec?.alt ?? "Any Exam Easy study dashboard"}
          width={1200}
          height={900}
          priority
          className="h-auto w-full object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 420px"
        />
      </div>
    </figure>
  );
}
