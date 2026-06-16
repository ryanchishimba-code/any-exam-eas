import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** PANCE professional practice — prescriber-focused CSA/DEA (not pharmacy dispensing). */
export const CONTROLLED_SUBSTANCES_PANCE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "PANCE professional-practice items test whether you can prescribe controlled substances safely: valid DEA registration, schedule-specific refill rules, PDMP checks, EPCS compliance, and opioid risk mitigation. You are tested as a clinician who writes prescriptions — not as a pharmacist verifying inventory or inter-pharmacy transfers.",
        "High-yield traps include assuming CII prescriptions can be refilled, missing PDMP query requirements before starting opioids, and confusing federal baseline rules with stricter state law (apply the more restrictive standard when both apply).",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Schedule II: high abuse potential; no refills; new prescription required for each fill; common agents include oxycodone, amphetamine, methylphenidate",
        "Schedule III–IV: up to 5 refills within 6 months from date written; benzodiazepines and many opioid combinations",
        "Schedule V: lowest abuse; some products may be Rx or OTC depending on formulation",
        "Prescriber must hold active DEA registration with schedule authorization matching what you prescribe",
        "EPCS: DEA-compliant electronic prescribing satisfies written Rx requirements for controlled substances in participating states",
        "PDMP: query before initiating or renewing opioids/benzodiazepines in most states — document review in chart",
        "Quantity and directions must be specific — avoid open-ended sigs on controlled prescriptions",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "New opioid for moderate acute pain: screen opioid risk, check PDMP, start lowest effective dose for shortest duration; avoid CII if CIII–IV adequate",
        "Chronic opioid therapy: written agreement, functional goals, urine drug screen baseline, PDMP at each refill, naloxone counseling when risk factors present",
        "Benzodiazepine + opioid: avoid when possible — respiratory depression and misuse risk; taper slowly if discontinuing long-term benzo",
        "Patient requests early refill: verify lost/stolen Rx policy, PDMP for duplicate prescribers, consider shorter supply rather than early CII rewrite",
        "Telehealth CII: federal/state telemedicine rules for controlled substances evolved post-COVID — know current Ryan Haight / DEA flexibilities for your practice setting",
        "HIPAA: minimum necessary disclosure; obtain authorization before releasing PHI to family or employers",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Prescriber essentials by schedule",
          headers: ["Schedule", "Refills", "Typical PANCE focus"],
          rows: [
            ["II", "None", "New Rx each fill; validity window; no phone-in refills"],
            ["III", "≤5 in 6 months", "Codeine combos, buprenorphine (context-dependent)"],
            ["IV", "≤5 in 6 months", "Benzodiazepines, tramadol (schedule varies)"],
            ["V", "Varies", "Low-dose codeine cough preparations"],
          ],
        },
        {
          caption: "Federal vs state — apply stricter rule",
          headers: ["Topic", "Federal baseline", "Common state stricter rule"],
          rows: [
            ["PDMP", "Not universal federally", "Mandatory query before dispensing/prescribing"],
            ["CII validity", "State-defined", "7–30 day fill window common"],
            ["EPCS", "Permitted", "Required for CII in many states"],
            ["Opioid limits", "None federal", "Day supply caps for acute pain"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Opioid prescribing workflow: indication → non-opioid trial → PDMP → risk screen → lowest dose/duration → follow-up",
        "Schedule ladder I–V with refill flexibility increasing down the ladder",
        "PDMP red flags: multiple prescribers, early fills, overlapping benzodiazepines",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "CII can be refilled with a phone call — never; new prescription required",
        "Hydrocodone combinations are CIII — rescheduled to CII; no refills",
        "PDMP is optional everywhere — most states require query; document even when not mandated",
        "PA can always prescribe CII — requires DEA registration and state schedule authority",
        "Benzodiazepines are safe with opioids — avoid concurrent use when possible",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "CII mnemonic: No refills, no transfer, new Rx every time",
        "5 refills in 6 months — CIII–IV only",
        "Naloxone co-prescribe when opioid risk factors or high MME",
        "MAT / buprenorphine: separate regulations — X-waiver requirements evolved; know current federal rules",
        "Document PDMP review and opioid risk assessment in every chronic opioid visit",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Prescriber DEA registration required for CII–V",
        "CII: no refills; check validity window before patient goes to pharmacy",
        "PDMP + risk screen before new chronic opioids",
        "EPCS when state requires electronic CII",
        "HIPAA minimum necessary; authorization for non-TPO disclosure",
        "Apply stricter of federal vs state law on PANCE law items",
      ],
    },
  ],
};
