import { Hero } from "@/components/Hero";
import { LoginPromo } from "@/components/LoginPromo";
import { FeatureGrid } from "@/components/FeatureGrid";
import { SubjectsShowcase } from "@/components/home/SubjectsShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { Button } from "@/components/ui/Button";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Testimonials />
      <SubjectsShowcase />
      <FeatureGrid />
      <LoginPromo />
      <section className="apple-section apple-section-dark text-center">
        <div className="mx-auto max-w-[980px] px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.02em] text-white">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-[#a1a1a6]">
            {formatTrialIntroPrice()} for {formatTrialLabel()}, then {formatMonthlyPrice()}/month.
            Full access to the advanced question engine, adaptive exams, and analytics.
          </p>
          <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button
              href="/signup?plan=trial"
              className="!bg-[#0071e3] !px-10 !py-4 !text-base !text-white hover:!bg-[#0077ed]"
            >
              Start {formatTrialLabel()} — {formatTrialIntroPrice()}
            </Button>
            <Button
              href="/signup?plan=subscribe"
              variant="secondary"
              className="!border-white/25 !bg-white/10 !px-10 !py-4 !text-base !text-white hover:!bg-white/15"
            >
              Subscribe Now — {formatMonthlyPrice()}/mo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
