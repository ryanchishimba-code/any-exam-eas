import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const CONTROLLED_SUBSTANCES_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "The Controlled Substances Act (CSA) and DEA regulations are core MPJE content. Pharmacists must know schedules I–V, prescription requirements, refill limits, recordkeeping, inventory procedures, and reporting obligations. State law may be stricter than federal law—when tested, apply the more restrictive standard unless the question specifies federal-only.",
        "Exam traps include confusing CII (no refills, written/electronic requirements) with CIII–V (refill limits), misidentifying who may prescribe Schedule II (DEA registrant only), and overlooking partial fill rules, emergency oral orders, and theft/loss reporting timelines.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "The CSA classifies drugs by abuse potential and accepted medical use. Schedule I has no accepted medical use and high abuse potential (heroin, marijuana federally, LSD). Schedules II–V have decreasing abuse potential and increasing accepted medical utility. DEA registration (Form 224) is required to manufacture, distribute, or dispense controlled substances; registrants receive a DEA number verified by checksum algorithm.",
      ],
      bullets: [
        "Schedule II: high abuse potential; accepted medical use with severe restrictions; no refills; 90-day supply max per prescription (federal); written, signed paper OR compliant EPCS",
        "Schedule III–IV: moderate/low abuse; up to 5 refills in 6 months from date of issue; oral emergency order allowed (limited quantity/duration)",
        "Schedule V: lowest abuse; some products OTC in some states; federal refills allowed with prescriber authorization",
        "Valid prescription elements: date, patient name/address, prescriber name/address/DEA, drug name, strength, dosage form, quantity, directions, signature (or EPCS authentication)",
        "EPCS (electronic prescribing of controlled substances): DEA-compliant two-factor authentication; satisfies CII paper requirement in participating states",
        "Partial fills: CII allowed for LTC/hospice with notation 'partial fill'; remaining quantity void after 72 h unless LTC/hospice rules apply",
        "Emergency oral CII order: prescriber must provide written/electronic Rx within 7 days; quantity limited to treat emergency period",
        "Transfer rules: CII not transferable between pharmacies; CIII–V transferable once if refills remain (state rules vary)",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Dispensing CII: verify DEA number, check PDMP, confirm written/EPCS Rx; no refills—new Rx required for each fill",
        "Oxycodone 30 mg #60 with 0 refills, dated 45 days ago: do not dispense—CII expires per state law (often 7 days paper, longer for EPCS—know your state)",
        "Hydrocodone/acetaminophen (Schedule II since 2014 rescheduling): same rules as all CII—no refills",
        "Testosterone CIII: up to 5 refills in 6 months; oral order permitted in emergency with 5-day supply max pending written Rx",
        "Benzodiazepines (generally CIV): refills within 6 months; watch state-specific limits (some states treat as CII equivalent)",
        "Initial inventory: count all controlled substances when first licensed or acquired; biennial inventory every 2 years (any date; maintain record 2 years)",
        "Perpetual inventory: required for CII; recommended for CIII–V; document receipts, dispensing, losses, returns",
        "Theft/significant loss: DEA Form 106 within 1 business day of discovery; also notify state board",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "DEA schedule requirements summary",
          headers: ["Schedule", "Examples", "Refills", "Rx Format", "Transfer"],
          rows: [
            ["I", "Heroin, LSD (federal)", "N/A (no Rx)", "Not prescribable", "N/A"],
            ["II", "Oxycodone, morphine, Adderall, fentanyl patch", "None", "Written or EPCS", "Not transferable"],
            ["III", "Tylenol #3 (codeine), ketamine, testosterone", "5 in 6 months", "Written, oral (emergency), EPCS", "Once (if refills remain)"],
            ["IV", "Benzodiazepines, tramadol, pregabalin (some states)", "5 in 6 months", "Written, oral (emergency), EPCS", "Once (if refills remain)"],
            ["V", "Robitussin AC (codeine), pregabalin (federal V in some)", "Per prescriber", "May not require Rx federally", "Varies"],
          ],
        },
        {
          caption: "Federal vs common state stricter rules (apply more restrictive on MPJE)",
          headers: ["Topic", "Federal Baseline", "Common State Stricter Rule"],
          rows: [
            ["CII expiration", "No federal day limit on validity (states set)", "7 days (paper) common; 30 days EPCS in some states"],
            ["PDMP check", "Not federally mandated for all", "Mandatory query before dispensing in most states"],
            ["EPCS mandate", "Allowed but not required federally", "Mandatory EPCS for CII in many states"],
            ["Refill timing", "5 refills/6 months CIII–V", "Some states limit to 3 refills or shorter validity"],
            ["Partial CII fill", "Allowed LTC/hospice", "Some states prohibit any partial CII except LTC"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "DEA schedule ladder (I–V): descending abuse potential with ascending refill/transfer flexibility icons at each tier",
        "Valid controlled substance prescription checklist: 11 required elements with pass/fail indicators for MPJE vignettes",
        "CII dispensing workflow: Rx received → PDMP query → DEA verification → inventory deduction → perpetual log entry → label/dispense",
        "Biennial vs perpetual inventory timeline: initial count → ongoing CII perpetual log → biennial snapshot every 2 years",
        "Theft/loss reporting flowchart: discovery → secure area → DEA Form 106 (1 business day) → state board notification → internal investigation",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Hydrocodone combinations are CIII—rescheduled to CII in 2014; no refills allowed",
        "CII prescriptions can be refilled with prescriber phone authorization—never; new Rx required each time",
        "Any prescriber can write CII—must hold active DEA registration with Schedule II authorization",
        "Partial CII fills are always prohibited—allowed in LTC/hospice with specific documentation; 72-hour rule for other partials",
        "Transfer CII between pharmacies if patient moves—CII Rxs are never transferable",
        "Oral emergency orders work for CII without limit—limited quantity (usually 72 h supply) and written follow-up within 7 days",
        "Federal law always preempts state—apply whichever is MORE restrictive when state and federal differ on MPJE",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "CII mnemonic: 'No Refills, No Transfer, New Rx Every Time'",
        "5 refills in 6 months applies to CIII–IV only—the '5/6 rule'",
        "DEA number checksum: add digits 1,3,5 + 2×(digits 2,4,6); last digit of sum equals check digit (7th digit)",
        "Emergency oral CII: pharmacist may dispense from oral order; prescrifer must send written Rx within 7 days or pharmacy must reverse",
        "Biennial inventory: exact count required; may be initial or closing stock; due every 2 years from initial inventory date",
        "Destruction of controlled substances: DEA Form 41 for surrendered substances; witness requirements for destruction",
        "Mid-level practitioners (NP/PA): may prescribe CII–V if state law AND DEA authorization allow; scope varies by state",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "CII: no refills, not transferable, written/EPCS Rx; hydrocodone is CII",
        "CIII–IV: max 5 refills in 6 months; one inter-pharmacy transfer if refills remain",
        "Valid Rx requires patient, prescriber, DEA, drug, strength, qty, directions, signature/EPCS",
        "Perpetual inventory required for CII; biennial inventory every 2 years for all schedules",
        "Theft/loss: DEA Form 106 within 1 business day",
        "Emergency oral CII: limited supply; written Rx within 7 days",
        "MPJE: apply the more restrictive of federal vs state law unless question specifies one jurisdiction",
      ],
    },
  ],
};
