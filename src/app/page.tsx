import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FieldsShowcase } from "@/components/FieldsShowcase";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <FieldsShowcase />
      <section className="apple-cta-dark py-[clamp(4rem,10vw,6rem)] text-center text-white">
        <div className="mx-auto max-w-[980px] px-6">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.02em]">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[#a1a1a6]">
            Seven days free. Full access to exam generation, learning quilts, lesson
            plans, and progress tracking.
          </p>
          <div className="mt-9">
            <Button
              href="/signup"
              className="!bg-white !text-[var(--color-ink)] !shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:!bg-[#f5f5f7]"
            >
              Create your account
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
