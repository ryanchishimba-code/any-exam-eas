import { LandingAuthCta } from "@/components/home/LandingAuthCta";
import { TrustBar } from "@/components/home/TrustBar";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

export function HomeBottomCta() {
  return (
    <section
      className="apple-section aee-section-dark relative overflow-hidden text-center"
      aria-labelledby="home-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(20,184,166,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6">
        <p className="aee-section-label !text-teal-400">Get started today</p>
        <h2 id="home-cta-heading" className="aee-headline aee-headline-light mt-4">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[1.1875rem] font-normal leading-[1.47059] tracking-[-0.022em] text-slate-400">
          {formatTrialIntroPrice()} for {formatTrialLabel()}, then {formatMonthlyPrice()}/month.
          Full access to the advanced question engine, adaptive exams, and analytics.
        </p>
        <div className="mx-auto mt-12 max-w-md">
          <LandingAuthCta variant="dark" callbackUrl="/dashboard" />
        </div>
        <TrustBar variant="dark" className="mt-8" />
      </div>
    </section>
  );
}
