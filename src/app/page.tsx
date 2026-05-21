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
      <section className="bg-[var(--color-ink)] py-24 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-neutral-400">
          Seven days free. Full access to exam generation, learning quilts, lesson
          plans, and progress tracking.
        </p>
        <div className="mt-8">
          <Button href="/signup" className="!bg-white !text-[var(--color-ink)] hover:!bg-neutral-200">
            Create your account
          </Button>
        </div>
      </section>
    </>
  );
}
