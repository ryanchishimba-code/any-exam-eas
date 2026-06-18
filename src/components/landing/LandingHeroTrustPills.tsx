import { ShieldCheck } from "lucide-react";
import { LANDING_HERO_TRUST_SIGNALS } from "@/lib/landing/content";

export function LandingHeroTrustPills({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`aee-hero-trust-pills aee-hero-trust-pills--badges ${className}`.trim()}
      aria-label="Platform trust signals"
    >
      {LANDING_HERO_TRUST_SIGNALS.map((signal) => (
        <li key={signal} className="aee-hero-trust-pills__badge">
          <ShieldCheck className="aee-hero-trust-pills__badge-icon" aria-hidden />
          <span>{signal}</span>
        </li>
      ))}
    </ul>
  );
}
