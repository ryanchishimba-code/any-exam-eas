/**
 * Landing page visual asset specs.
 * Replace placeholders in LandingVisualSlot / LandingAppMockup with exported PNG/WebP
 * generated from these prompts (white bg, teal accent, minimal SaaS style).
 */
export type LandingVisualSpec = {
  id: string;
  placement: string;
  alt: string;
  /** Image-gen or design brief — 1200×800 unless noted */
  prompt: string;
  recommendedSize: string;
};

export const LANDING_VISUALS: Record<string, LandingVisualSpec> = {
  "hero-app-mockup": {
    id: "hero-app-mockup",
    placement: "Hero — right column (desktop), below CTAs (mobile)",
    alt: "Any Exam Easy study dashboard showing question bank, Library, full exam, and analytics navigation",
    prompt:
      "Clean SaaS product mockup on white background: mobile-first healthcare exam prep app dashboard, soft teal (#0d9488) accents, white cards with subtle shadows, bottom tab bar (Home, Bank, Ref, Exam, Stats), Library with memory card grid, minimal typography Inter/SF style, no fake faces, no pass-rate badges, professional medical edtech, 3D phone + desktop browser frame optional, ultra-minimal Apple-like aesthetic",
    recommendedSize: "1200×900",
  },
  "feature-adaptive-learning": {
    id: "feature-adaptive-learning",
    placement: "Features grid — Adaptive AI card",
    alt: "Illustration of adaptive study path adjusting to weak topics",
    prompt:
      "Minimal line illustration white background: brain icon connected to three topic nodes (cardiology, pharmacology, critical care) with one highlighted weak area in soft amber, teal accent lines, flat professional style, no text, medical education SaaS",
    recommendedSize: "640×480",
  },
  "feature-pharmacology": {
    id: "feature-pharmacology",
    placement: "Top 500 Drugs panel — right side illustration",
    alt: "Pharmacology flashcard illustration with drug class color coding",
    prompt:
      "Minimal illustration: stack of three flashcards with pill icon, color-coded top borders (teal, violet, sky blue), generic/brand labels abstract, white background, clean medical education style, no brand drug logos",
    recommendedSize: "560×420",
  },
  "pricing-value-stack": {
    id: "pricing-value-stack",
    placement: "Pricing / comparison panel — above price cards",
    alt: "Visual stack showing four exam logos under one subscription",
    prompt:
      "Icon row on white: four minimal badges NCLEX USMLE NAPLEX PANCE connected by single teal subscription pill underneath labeled One plan, flat icons heart stethoscope pill medical cross, soft slate text, no dollar amounts in image",
    recommendedSize: "800×240",
  },
  "screenshot-question-bank": {
    id: "screenshot-question-bank",
    placement: "Features section — Question bank card",
    alt: "Screenshot of clinical vignette question with rationale panel",
    prompt:
      "UI screenshot mockup: NCLEX-style clinical vignette MCQ with four answer choices, teal primary button, rationale section collapsed, white background, realistic but generic patient scenario, no real PHI",
    recommendedSize: "960×640",
  },
  "screenshot-analytics": {
    id: "screenshot-analytics",
    placement: "Features section — Progress card",
    alt: "Screenshot of practice progress and weak-area analytics",
    prompt:
      "UI screenshot mockup: analytics dashboard with bar chart labeled Practice progress, weak topics list, teal accents, disclaimer-friendly copy no pass probability, white minimal dashboard",
    recommendedSize: "960×640",
  },
};

export function getLandingVisual(id: string): LandingVisualSpec | undefined {
  return LANDING_VISUALS[id];
}

/** Public paths for generated landing assets in /public/images/landing/ */
export const LANDING_VISUAL_PATHS: Record<keyof typeof LANDING_VISUALS, string> = {
  "hero-app-mockup": "/images/landing/hero-app-mockup.jpg",
  "feature-adaptive-learning": "/images/landing/feature-adaptive-learning.jpg",
  "feature-pharmacology": "/images/landing/feature-pharmacology.jpg",
  "pricing-value-stack": "/images/landing/pricing-value-stack.jpg",
  "screenshot-question-bank": "/images/landing/screenshot-question-bank.jpg",
  "screenshot-analytics": "/images/landing/screenshot-analytics.jpg",
};

export function landingVisualSrc(id: string): string | undefined {
  return LANDING_VISUAL_PATHS[id as keyof typeof LANDING_VISUALS];
}

/**
 * Homepage hero product still — WebP with alpha (~40KB vs ~450KB PNG).
 * Keep the PNG on disk as source/fallback; Next Image further serves AVIF/WebP sizes.
 */
export const LANDING_HERO_LAPTOP_SRC = "/images/landing/hero-laptop-float-v5d.webp";
export const LANDING_HERO_LAPTOP_ALT =
  "Laptop with a stethoscope showing NCLEX, NAPLEX, USMLE, PANCE, AANP FNP, and NPTE prep books — Any Exam Easy";

/** Landing hero / marketing video assets in /public/videos/landing/ */
export const LANDING_VIDEO_PATHS = {
  heroShowcase: "/videos/landing/hero-showcase.mp4",
} as const;

export type LandingVideoId = keyof typeof LANDING_VIDEO_PATHS;

export function landingVideoSrc(id: LandingVideoId): string {
  return LANDING_VIDEO_PATHS[id];
}
