-- Public testimonials require a recorded consent timestamp.
-- Existing rows stay null and therefore stay off the marketing site.
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "consentedAt" TIMESTAMP(3);
