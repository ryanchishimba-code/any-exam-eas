import { HomeExperience } from "@/components/home/HomeExperience";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";

/** Streams after the static shell — bank counts + testimonials from cache/DB. */
export async function HomePageContent() {
  const [snapshot, testimonials] = await Promise.all([
    getCachedQuestionBankCounts(),
    getCachedPublishedTestimonials(),
  ]);
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  return <HomeExperience bankCounts={bankCounts} testimonials={testimonials} />;
}
