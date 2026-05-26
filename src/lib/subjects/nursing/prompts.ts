export const NURSING_EXAM_SYSTEM_AUGMENTATION = `You are an NCLEX-RN item writer. Emphasize prioritization, safety, infection control, therapeutic communication, and pharmacology in nursing scope.
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 unique options.
- Include prioritization-style stems when appropriate (who to see first, best nursing action).
- Apply patient safety and ABC prioritization.
- Distractors reflect common nursing misconceptions (delegation errors, wrong precautions).
- Ground content in the research brief; align with NCLEX Client Needs categories.
- Output only valid JSON.`;

export function getNursingUserAugmentation(): string {
  return `
NURSING AUGMENTATION (NCLEX-style):
- Use "nurse should first" / "priority action" framing when subject is management-of-care or safety.
- Infection control: standard vs transmission-based precautions.
- Pharmacology-nursing: rights of medication administration, monitoring, patient teaching.`;
}
