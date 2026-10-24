import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import {
  CONSENTED_TESTIMONIAL_SEEDS,
  type ConsentedTestimonialSeed,
} from "@/lib/testimonials/consented-seed";

function examNeedles(examSlug: ExamSlug): string[] {
  const catalog = EXAM_CATALOG[examSlug];
  return [examSlug, catalog.shortName, catalog.name]
    .map((value) => value.toLowerCase())
    .filter((value) => value.length >= 3);
}

/** First consented seed whose exam label matches the learner's board. */
export function consentedTestimonialForExam(
  examSlug: ExamSlug
): ConsentedTestimonialSeed | null {
  const needles = examNeedles(examSlug);
  const match = CONSENTED_TESTIMONIAL_SEEDS.find((seed) => {
    const exam = seed.exam.trim().toLowerCase();
    return needles.some((needle) => exam.includes(needle) || needle.includes(exam));
  });
  return match ?? null;
}
