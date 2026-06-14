import type { ExamSlug } from "@/types/edtech";

export type ReferenceExternalResource = {
  label: string;
  description: string;
  url: string;
};

/** Trusted guideline and reference sites surfaced on the Reference hub. */
export const REFERENCE_EXTERNAL_RESOURCES: Partial<Record<ExamSlug, ReferenceExternalResource[]>> = {
  naplex: [
    {
      label: "IDSA Guidelines",
      description: "Infectious Diseases Society of America practice guidelines",
      url: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    },
    {
      label: "CDC Antibiotic Use",
      description: "Core elements of antibiotic stewardship",
      url: "https://www.cdc.gov/antibiotic-use/hcp/core-elements/index.html",
    },
    {
      label: "Sanford Guide",
      description: "Antimicrobial spectrum and dosing reference",
      url: "https://www.sanfordguide.com/",
    },
    {
      label: "HIVinfo",
      description: "NIH DHHS HIV treatment and OI guidelines",
      url: "https://hivinfo.nih.gov/guidelines",
    },
    {
      label: "LactMed",
      description: "NIH drugs and lactation database",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK501922/",
    },
  ],
  usmle: [
    {
      label: "IDSA Guidelines",
      description: "CAP, meningitis, C. diff, vancomycin monitoring",
      url: "https://www.idsociety.org/practice-guideline/practice-guidelines/",
    },
    {
      label: "Surviving Sepsis Campaign",
      description: "Sepsis and septic shock management",
      url: "https://www.sccm.org/survivingsepsiscampaign",
    },
    {
      label: "HIVinfo (NIH)",
      description: "HIV treatment and opportunistic infection guidelines",
      url: "https://hivinfo.nih.gov/guidelines",
    },
    {
      label: "CDC Vaccine Schedules",
      description: "Immunization and prophylaxis reference",
      url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/",
    },
    {
      label: "Sanford Guide",
      description: "Antimicrobial spectrum quick reference",
      url: "https://www.sanfordguide.com/",
    },
  ],
  nclex: [
    {
      label: "CDC Infection Control",
      description: "Isolation precautions and HAI prevention",
      url: "https://www.cdc.gov/infection-control/hcp/isolation-precautions/",
    },
    {
      label: "Surviving Sepsis Campaign",
      description: "Hour-1 sepsis bundle reference",
      url: "https://www.sccm.org/survivingsepsiscampaign",
    },
    {
      label: "CDC C. diff",
      description: "Clostridioides difficile infection prevention",
      url: "https://www.cdc.gov/c-diff/hcp/prevention/index.html",
    },
    {
      label: "WHO Hand Hygiene",
      description: "Five moments for hand hygiene",
      url: "https://www.who.int/teams/integrated-health-services/infection-prevention-control/hand-hygiene",
    },
    {
      label: "Open RN Nursing Skills",
      description: "Nursing fundamentals and clinical skills OER",
      url: "https://openrn.ecampusontario.ca/",
    },
  ],
};

export function getReferenceExternalResources(examSlug: ExamSlug): ReferenceExternalResource[] {
  return REFERENCE_EXTERNAL_RESOURCES[examSlug] ?? [];
}
