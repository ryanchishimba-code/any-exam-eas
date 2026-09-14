import { MarketingHonestProof } from "@/components/marketing/MarketingHonestProof";

/** Replaces invented student quotes with verifiable product facts. */
export function LandingTestimonials() {
  return (
    <section
      className="aee-landing-compact-section border-b border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="proof-heading"
            className="text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl"
          >
            Built for people juggling{" "}
            <span className="aee-display-accent-vibrant">more than one board.</span>
          </h2>
        </div>
        <div className="mt-6">
          <MarketingHonestProof />
        </div>
      </div>
    </section>
  );
}
