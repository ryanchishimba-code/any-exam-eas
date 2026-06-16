import { LANDING_HERO_TRUST_SIGNALS } from "@/lib/landing/content";

export function LandingHeroTrustPills({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`aee-hero-trust-pills ${className}`.trim()}
      aria-label="Platform trust signals"
    >
      {LANDING_HERO_TRUST_SIGNALS.map((signal, index) => (
        <li key={signal} className="aee-hero-trust-pills__item">
          {index > 0 ? (
            <span className="aee-hero-trust-pills__dot" aria-hidden>
              ·
            </span>
          ) : null}
          <span>{signal}</span>
        </li>
      ))}
    </ul>
  );
}
