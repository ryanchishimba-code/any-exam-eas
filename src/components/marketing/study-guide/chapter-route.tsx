import { notFound } from "next/navigation";
import { PublicGuideChapterView } from "@/components/marketing/study-guide/PublicGuideChapterView";
import { boardChapterMetadata, usmleChapterMetadata } from "@/components/marketing/study-guide/PublicStudyGuidePage";
import { boardChapterAt, publishGuide, publishUsmleStep, usmleChapterAt } from "@/lib/study-guides/load-public-guide";
import { publicStudyGuide, USMLE_PUBLIC_STEPS, type PublicStudyGuideId } from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO, STEP_SEO } from "@/lib/study-guides/seo-copy";

export function createBoardChapterRoute(id: PublicStudyGuideId) {
  return {
    generateStaticParams() {
      const published = publishGuide(id);
      if (published.mode !== "chapters") return [];
      return published.chapters.map((chapter) => ({ chapter: chapter.slug }));
    },
    async generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
      const { chapter } = await params;
      return boardChapterMetadata(id, chapter);
    },
    async Page({ params }: { params: Promise<{ chapter: string }> }) {
      const { chapter: slug } = await params;
      const located = boardChapterAt(id, slug);
      if (!located) notFound();
      const guide = publicStudyGuide(id);
      const query = GUIDE_SEO[id]?.query ?? guide.title;
      return (
        <PublicGuideChapterView
          guide={guide}
          guidePath={guide.path}
          guideName={query}
          path={`${guide.path}/${located.chapter.slug}`}
          query={query}
          chapter={located.chapter}
          prev={located.prev}
          next={located.next}
        />
      );
    },
  };
}

export function createUsmleChapterRoute() {
  return {
    generateStaticParams() {
      const params: { step: string; chapter: string }[] = [];
      for (const step of USMLE_PUBLIC_STEPS) {
        const published = publishUsmleStep(step.id);
        if (!published || published.mode !== "chapters") continue;
        for (const chapter of published.chapters) {
          params.push({ step: step.id, chapter: chapter.slug });
        }
      }
      return params;
    },
    async generateMetadata({ params }: { params: Promise<{ step: string; chapter: string }> }) {
      const { step, chapter } = await params;
      return usmleChapterMetadata(step, chapter);
    },
    async Page({ params }: { params: Promise<{ step: string; chapter: string }> }) {
      const { step: stepId, chapter: slug } = await params;
      const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
      const located = usmleChapterAt(stepId, slug);
      if (!step || !located) notFound();
      const guide = publicStudyGuide("usmle");
      const query = STEP_SEO[stepId]?.query ?? step.title;
      return (
        <PublicGuideChapterView
          guide={guide}
          guidePath={step.path}
          guideName={query}
          path={`${step.path}/${located.chapter.slug}`}
          query={query}
          chapter={located.chapter}
          prev={located.prev}
          next={located.next}
        />
      );
    },
  };
}
