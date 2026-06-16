import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANP FNP pediatrics (~22% combined lifespan weight). */
export const AANP_PEDIATRICS_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Pediatric content spans newborn through adolescent (~22% of items combined). Bright Futures well-child care, immunization schedules, febrile infant algorithms, developmental milestones, and adolescent confidentiality are core.",
        "Dosing is weight-based; never apply adult algorithms to infants. Return precautions and caregiver education are part of complete Plan answers.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Bright Futures preventive visit schedule and age-appropriate screening",
        "CDC/AAP immunization schedule and catch-up rules",
        "Developmental milestones by age (social, language, motor)",
        "Febrile infant risk stratification by age group",
        "Adolescent confidentiality: STI, mental health, substance use screening",
        "Weight-based dosing and liquid formulation calculations",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Neonate <28 days with fever: admit, full sepsis evaluation, empiric IV antibiotics",
        "Otitis media: amoxicillin first line; observation option ≥2 years with mild unilateral",
        "Asthma in child: ICS for persistent symptoms; spacer with MDI; action plan for school",
        "ADHD: Vanderbilt screens; stimulant therapy + behavioral support; monitor growth/BP",
        "Adolescent depression: confidential screening; safety plan if suicidal ideation",
        "Sports clearance: cardiac history, concussion return-to-play protocols",
        "Failure to thrive: caloric intake, neglect consideration, organic workup as indicated",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Key developmental milestones (approximate)",
          headers: ["Age", "Social/language", "Motor"],
          rows: [
            ["2 months", "Social smile", "Lifts head prone"],
            ["6 months", "Babbles", "Sits without support"],
            ["12 months", "First words", "Pulls to stand, cruises"],
            ["18 months", "Several words", "Walks independently"],
            ["24 months", "2-word phrases", "Runs, stacks blocks"],
            ["36 months", "3-word sentences", "Tricycle, copies circle"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "CDC immunization schedule 0–18 years (highlights: HBV birth, DTaP/IPV/Hib series, MMR varicella at 12–15 mo)",
        "Febrile infant algorithm by age band",
        "Adolescent HEADSS psychosocial interview topics",
        "Weight-based amoxicillin dosing for otitis media (80–90 mg/kg/day divided BID)",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Treat viral URI with antibiotics — educate and provide return precautions",
        "Use adult acetaminophen dosing for toddlers — weight-based mg/kg",
        "Disclose adolescent STI results to parents without assent when confidentiality applies",
        "Skip immunizations in mild illness — most mild acute illness is not a contraindication",
        "Apply low-risk UTI algorithm to febrile neonate",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Pediatric Plan items must include caregiver education and specific return precautions",
        "Immunization catch-up is a favorite topic — know minimum intervals",
        "Toxic appearance trumps numeric fever — ill-appearing child needs escalation",
        "Confidentiality laws vary by state but exam tests ethical adolescent care principles",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Pediatrics ≈ 22% — immunizations, milestones, febrile infant, adolescent care",
        "Neonate fever = aggressive workup + admission",
        "Bright Futures + CDC schedule drive preventive items",
        "Weight-based dosing always",
        "Include caregiver instructions in Plan answers",
      ],
    },
  ],
};
