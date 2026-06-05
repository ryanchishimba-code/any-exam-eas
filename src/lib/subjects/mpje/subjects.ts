import type { SubjectArea } from "../types";

export const MPJE_SUBJECTS: SubjectArea[] = [
  {
    id: "federal-pharmacy-law",
    label: "Federal Pharmacy Law",
    contentArea: "MPJE — Federal statutes & regulations",
    textbookRefs: "DEA regulations, FDA pharmacy compounding guidance, Federal Food, Drug, and Cosmetic Act",
    examHints:
      "FDA oversight, federal labeling, REMS, DSCSA, federal enforcement, interstate commerce",
    keywords: ["federal", "FDA", "FDCA", "DSCSA", "REMS", "interstate"],
    focusPlaceholder: "e.g. Federal drug distribution requirements",
  },
  {
    id: "uniform-mpje",
    label: "Uniform MPJE (UMPJE)",
    contentArea: "MPJE — Uniform state law patterns",
    textbookRefs: "NABP MPJE/UMPJE content outline, Model State Pharmacy Act",
    examHints:
      "uniform licensure, technician ratios, prescription validity, transfer rules, immunization authority",
    keywords: ["uniform", "UMPJE", "model act", "multistate", "licensure"],
    focusPlaceholder: "e.g. Uniform prescription transfer rules",
  },
  {
    id: "controlled-substances",
    label: "Controlled Substances (DEA)",
    contentArea: "MPJE — DEA & scheduling",
    textbookRefs: "Controlled Substances Act, DEA pharmacist's manual",
    examHints:
      "schedules I–V, C-II limits, partial fills, PDMP, theft/loss reporting, inventory, CSOS",
    keywords: ["DEA", "controlled substance", "schedule", "PDMP", "C-II", "inventory"],
    focusPlaceholder: "e.g. Schedule II refill rules",
  },
  {
    id: "dispensing-procedures",
    label: "Dispensing & Prescription Validity",
    contentArea: "MPJE — Dispensing standards",
    textbookRefs: "State board dispensing rules, USP standards",
    examHints:
      "valid prescription elements, refills, emergency dispensing, DUR, therapeutic substitution, labeling",
    keywords: ["dispensing", "prescription", "refill", "DUR", "label", "validity"],
    focusPlaceholder: "e.g. Required prescription elements",
  },
  {
    id: "pharmacy-ethics",
    label: "Pharmacy Ethics & Professionalism",
    contentArea: "MPJE — Ethics & conduct",
    textbookRefs: "APhA Code of Ethics, state board codes of conduct",
    examHints:
      "patient advocacy, conflicts of interest, impaired practitioner, whistleblower, moral distress",
    keywords: ["ethics", "professionalism", "conduct", "conflict", "advocacy"],
    focusPlaceholder: "e.g. Pharmacist duty to report impairment",
  },
  {
    id: "compounding-regulations",
    label: "Compounding Regulations",
    contentArea: "MPJE — Compounding law",
    textbookRefs: "USP <795>/<797>, FDA compounding policy, 503A/503B",
    examHints: "non-sterile vs sterile, beyond-use dating, outsourcing facilities, hazardous drugs",
    keywords: ["compounding", "USP", "503A", "503B", "BUD", "sterile"],
    focusPlaceholder: "e.g. USP <797> requirements",
  },
  {
    id: "patient-privacy",
    label: "HIPAA & Patient Privacy",
    contentArea: "MPJE — Privacy law",
    textbookRefs: "HIPAA Privacy & Security Rules, state privacy statutes",
    examHints: "PHI disclosure, minimum necessary, breach notification, patient rights, HIPAA exceptions",
    keywords: ["HIPAA", "privacy", "PHI", "confidentiality", "breach"],
    focusPlaceholder: "e.g. Permitted PHI disclosures",
  },
  {
    id: "pharmacy-operations",
    label: "Pharmacy Operations & Records",
    contentArea: "MPJE — Operations",
    textbookRefs: "State board recordkeeping rules, Medicare Part D MTM",
    examHints: "record retention, inspections, technician supervision, MTM billing, inventory audits",
    keywords: ["records", "inspection", "technician", "MTM", "inventory", "operations"],
    focusPlaceholder: "e.g. Prescription record retention",
  },
  {
    id: "state-practice-act",
    label: "State Practice Act & Board Rules",
    contentArea: "MPJE — State-specific law",
    textbookRefs: "State pharmacy practice act, state board of pharmacy regulations",
    examHints:
      "licensure requirements, scope of practice, collaborative practice, immunizations, telepharmacy",
    keywords: ["practice act", "board", "licensure", "scope", "collaborative", "telepharmacy"],
    focusPlaceholder: "e.g. Pharmacist immunization authority",
  },
];
