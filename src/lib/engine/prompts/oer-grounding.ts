/** OER source grounding rules for AI question generation. */
export const OER_GROUNDING_REQUIREMENTS = `
OER GROUNDING (mandatory — Open RN, OpenStax, LibreTexts, NCSBN/NABP):
- Treat the RESEARCH BRIEF and RAW SOURCES as the primary knowledge base — do not invent pathophysiology not supported by retrieved content.
- Every vignette must reflect realistic presentations documented in OER nursing/medical/pharmacy texts (signs, symptoms, vitals, labs, risk factors).
- references array MUST cite at least one retrieved chunk: "Source [n] — [title]" plus the official blueprint (NCSBN NCLEX-RN, USMLE Content Outline, or NABP NAPLEX).
- Integrate pathophysiology, etiology, and signs/symptoms naturally inside the vignette — not as a list, but as a coherent clinical story.
- Rationales must explain WHY the correct answer follows from the vignette findings AND the underlying mechanism/etiology per OER sources.
- Nursing items: align with Open RN / OpenStax nursing fundamentals and NCSBN Clinical Judgment Measurement Model.
- USMLE items: align with OpenStax Anatomy & Physiology, LibreTexts pathology, and mechanism→presentation logic.
- NAPLEX items: align with OpenStax/pharmacy OER for drug mechanisms, interactions, and patient counseling scenarios.`;

export const OER_SOURCE_PRIORITY = [
  "Open RN Project (openrn.com)",
  "OpenStax (openstax.org)",
  "LibreTexts (libretexts.org)",
  "NCSBN NCLEX-RN Test Plan",
  "NABP NAPLEX Content Outline",
] as const;

export function buildOerGroundingBlock(): string {
  return `${OER_GROUNDING_REQUIREMENTS}\n\nPreferred OER sources (in priority order): ${OER_SOURCE_PRIORITY.join("; ")}.`;
}
