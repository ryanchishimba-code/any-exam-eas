import { Check } from "lucide-react";
import { LANDING_HERO_PITCHES } from "@/lib/landing/content";

export function LandingHeroPitches({ className = "" }: { className?: string }) {
  return (
    <ul className={`aee-flagship-hero__pitches ${className}`.trim()} aria-label="Key benefits">
      {LANDING_HERO_PITCHES.map((pitch) => (
        <li key={pitch} className="aee-flagship-hero__pitch">
          <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" strokeWidth={2.5} aria-hidden />
          {pitch}
        </li>
      ))}
    </ul>
  );
}
