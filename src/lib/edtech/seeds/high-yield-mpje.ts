import { defineExamTopics } from "./topic-factory";

export const MPJE_HIGH_YIELD_TOPICS = defineExamTopics("mpje", [
  {
    slug: "federal-controlled-substance-laws",
    category: "Federal Law",
    title: "Federal Controlled Substance Laws (CSA & DEA)",
    overview:
      "The Controlled Substances Act framework, DEA schedules, and the pharmacist's obligations under federal law.",
    summary:
      "The Controlled Substances Act (CSA) establishes five schedules based on medical use, abuse potential, and physical or psychological dependence. Schedule I substances have no accepted medical use and the highest abuse potential; Schedules II–V balance decreasing abuse potential against accepted clinical utility. DEA registration is required for every pharmacist, prescriber, and facility that handles controlled substances — each with a specific business activity code.\n\nFederal law sets the floor: states may be more restrictive but never less. Schedule II dispensing requires a valid written or electronic prescription (with narrow emergency oral provisions) and cannot be refilled. Schedules III–V allow up to five refills within six months. Schedule II prescriptions may be partially filled under specific patient circumstances. Practitioners must store controlled substances in a securely locked substantially constructed cabinet, and theft or significant loss must be reported to the DEA within one business day using Form 106.",
    keyConcepts: [
      "Schedule I: no accepted medical use, high abuse potential — research only with Schedule I researcher registration",
      "Schedule II: written/electronic Rx required; no refills; partial fills allowed for LTCF or terminally ill patients",
      "Schedules III–V: up to 5 refills within 6 months; oral Rx permitted",
      "DEA Form 224 (retail pharmacy registration); Form 224a (renewal); unique DEA number validation (letter-letter-7 digits)",
      "Theft/significant loss: report to DEA within 1 business day on Form 106; notify local police",
      "Emergency oral Schedule II: 72-hour supply only; written Rx must follow within 7 days with 'Authorization for emergency dispensing' notation",
      "In-person exemption (Ryan Haight): prescribing via telemedicine requires at least one prior in-person evaluation unless a DEA telemedicine registration exception applies",
      "Practitioners may not prescribe controlled substances for themselves",
    ],
    mustKnowFacts: [
      "Federal law prohibits Schedule II refills — any refill is a violation regardless of state law",
      "DEA number check: first letter indicates registrant type (A/B/F = practitioner; M = mid-level; P = manufacturer); second letter is first letter of registrant's last name; verify checksum",
    ],
    pearls: [
      "When state and federal law conflict on schedule classification, use whichever places greater restrictions on the substance.",
      "A pharmacist who knowingly fills a fraudulent Schedule II prescription may be held criminally liable — verification is a professional and legal duty.",
    ],
    pitfalls: [
      "Confusing 'no refills permitted' for Schedule II with 'new prescription required each time' — partial fills and multiple prescriptions for up to a 90-day supply (non-PDMP states) are distinct concepts",
      "Assuming a DEA registration number that passes the letter test is automatically valid — always verify through DEA's online registry when suspicious",
    ],
    practiceTopicSlug: "federal-controlled-substance-laws",
  },
  {
    slug: "prescription-requirements-validity",
    category: "Dispensing",
    title: "Prescription Requirements & Validity",
    overview:
      "Required elements of a valid prescription, electronic prescribing standards, and when to refuse or verify.",
    summary:
      "A prescription is valid when it is issued by a practitioner acting in the usual course of professional practice and for a legitimate medical purpose. Required elements include: patient name and address, date issued, drug name and strength, quantity, directions for use, prescriber name, address, and DEA number (for controlled substances), and prescriber signature. Oral prescriptions must be immediately reduced to writing. Pharmacists must exercise corresponding responsibility — dispensing a prescription they know or should know is invalid is a violation regardless of apparent legitimacy.\n\nElectronic prescribing for controlled substances (EPCS) follows DEA's 21 CFR Part 1311 two-factor authentication requirements and requires software audited by an approved third party. Faxed Schedule II prescriptions are generally not valid to dispense unless specific exceptions apply (LTCF, parenteral home infusion, hospice). Post-dated prescriptions may not be filled before the written date. A pharmacist may refuse to fill any prescription if professional judgment raises doubt about validity.",
    keyConcepts: [
      "Required Rx elements: patient info, date, drug/strength/quantity/directions, prescriber info/signature, DEA# for controlled",
      "Corresponding responsibility: pharmacist equally liable for knowingly filling an invalid Rx",
      "EPCS: two-factor authentication (something known + hard token/biometric); DEA-compliant software required",
      "Schedule II fax: only valid as Rx original for LTCF, parenteral home infusion, and hospice patients",
      "Post-dated Rxs cannot be filled before the date written on the prescription",
      "Prescriber DEA number must match the drug schedule being prescribed",
      "Forgery red flags: altered quantities, unfamiliar prescriber, unusual drug combinations, patient requests specific pharmacy",
      "Oral Schedule II (emergency): 72-hour emergency supply only; paper follow-up within 7 days",
    ],
    mustKnowFacts: [
      "A prescription for a Schedule II drug signed with a rubber stamp is not valid under federal law — a handwritten signature is required (unless EPCS)",
      "A pharmacist may not fill a prescription issued by a prescriber who is not licensed in any U.S. jurisdiction or lacks DEA authority for the prescribed schedule",
    ],
    pearls: [
      "'Red flag' prescriptions must trigger good-faith verification before dispensing — document the verification steps taken.",
      "DEA allows practitioners to issue multiple Schedule II prescriptions on the same day for up to a 90-day supply if state law permits and each is marked with an earliest fill date.",
    ],
    pitfalls: [
      "Accepting a faxed Schedule II prescription from a retail patient as the original — fax is generally not acceptable as the dispensing document for non-exempt patients",
      "Filling a prescription dated in the future — the date of issuance, not the fill date, must have already passed",
    ],
    practiceTopicSlug: "prescription-requirements-validity",
  },
  {
    slug: "corresponding-responsibility",
    category: "Dispensing",
    title: "Pharmacist Corresponding Responsibility",
    overview:
      "The pharmacist's independent legal obligation to ensure every controlled substance prescription is valid before dispensing.",
    summary:
      "Corresponding responsibility (21 CFR 1306.04) places an affirmative duty on the dispensing pharmacist to verify that every controlled substance prescription was issued for a legitimate medical purpose by an authorized practitioner acting in the usual course of professional practice. This is not merely an optional verification step — it is a federal legal requirement that can result in criminal liability, DEA registration revocation, and civil penalties if ignored.\n\nPharmacists must be alert to red flags including: patient traveling unusual distances, prescriptions for the same drug from multiple prescribers, cash payments for expensive controlled substances, multiple patients presenting with identical prescriptions, and clinical implausibility (e.g., very high doses without corresponding diagnosis). Documentation of verification efforts is essential. Refusing to fill a suspicious prescription is not only legally permitted but may be legally required. Good-faith reliance on a prescriber's apparent legitimacy is not a complete defense if red flags were present and ignored.",
    keyConcepts: [
      "21 CFR 1306.04 creates co-equal pharmacist responsibility with prescriber for legitimate purpose",
      "Red flags: doctor shopping, unusual distance traveled, cash only, high quantities, multiple stimulant/opioid combinations",
      "Verification steps: call prescriber's listed office number (not number on Rx), check state PDMP, confirm DEA registration",
      "PDMP consultation is mandatory in many states before dispensing Schedule II–III",
      "Documentation of verification efforts provides a defense if prescription later proves fraudulent",
      "Refusing a suspicious Rx: pharmacist not required to disclose reason; direct patient to prescriber",
      "Dispensing without resolution of red flags exposes pharmacist to criminal prosecution under CSA",
      "'Pill mills' enforcement: chain pharmacists and corporate supervisors have faced prosecution",
    ],
    mustKnowFacts: [
      "Filling a controlled substance prescription you 'knew or should have known' was invalid is a federal criminal offense — ignorance of red flags is not a defense",
      "DEA and DOJ have prosecuted individual pharmacists who filled prescriptions from known pill-mill prescribers even when prescriptions appeared facially valid",
    ],
    pearls: [
      "Document every step taken when verifying a suspicious prescription — time-stamped notes are key evidence of good faith.",
      "A prescriber calling the pharmacy to demand a prescription be filled does not override pharmacist professional judgment.",
    ],
    pitfalls: [
      "Relying solely on the face of the prescription without consulting the PDMP in states where PDMP check is mandatory",
      "Assuming that because a prescriber has a valid DEA number the prescription is automatically legitimate",
    ],
    practiceTopicSlug: "corresponding-responsibility",
  },
  {
    slug: "state-vs-federal-law-conflicts",
    category: "Multistate",
    title: "State vs. Federal Law Conflicts",
    overview:
      "Navigating preemption, stricter state rules, and how to determine which law governs pharmacy practice.",
    summary:
      "Federal pharmacy law (principally the CSA and FDCA) establishes a national baseline. States have broad police power to regulate the health professions, and state pharmacy law frequently exceeds federal minimums in areas such as drug scheduling, refill limits, mandatory counseling, PDMP requirements, and pharmacist-to-technician ratios. When a valid state law conflicts with federal law, the Supremacy Clause governs: if following state law is impossible without violating federal law, or if state law is an obstacle to federal objectives, federal law preempts.\n\nIn practice for pharmacists, the rule is to apply whichever law is more restrictive. If state law classifies tramadol as a Schedule IV controlled substance while federal law does not schedule it, apply state law's stricter requirement in that state. If federal law mandates more extensive record keeping than state law, apply federal standards. The pharmacist must know both frameworks simultaneously — MPJE tests the ability to identify applicable law in multi-jurisdictional scenarios.",
    keyConcepts: [
      "Supremacy Clause: federal law preempts conflicting state law when compliance with both is impossible",
      "Practical rule: follow whichever law is more restrictive for the pharmacist's conduct",
      "States may add drugs to higher schedules but may NOT remove federally scheduled drugs from their state schedules",
      "State PDMP requirements (mandatory vs. permissive), refill limits, and days-supply restrictions often exceed federal minimums",
      "Emergency prescription dispensing rules vary by state — know state-specific provisions",
      "Prescriptive authority granted by state law does not create federal authority (still need DEA registration if prescribing controlled substances)",
      "Compounding exemptions under FDCA differ from state Board of Pharmacy compounding rules — apply the stricter standard",
      "Interstate dispensing: the law of the state where the patient is located generally governs",
    ],
    mustKnowFacts: [
      "A state may schedule a substance more strictly than federal law, but may not be less restrictive than federal scheduling",
      "For the MPJE, when given a conflict scenario, always choose the more restrictive of the two laws — federal or state — unless told one is inapplicable",
    ],
    pearls: [
      "States that have legalized medical or recreational cannabis cannot override the CSA — cannabis remains Schedule I federally, and pharmacies may not dispense it under a federal DEA registration.",
      "Collaborative practice agreements authorized by state law still require DEA registration if the pharmacist prescribes controlled substances under that authority.",
    ],
    pitfalls: [
      "Assuming federal law always controls — in most day-to-day pharmacy practice scenarios, state law imposes additional obligations that must be followed",
      "Applying one state's law when practicing across state lines — always identify which state's jurisdiction governs the specific practice act",
    ],
    practiceTopicSlug: "state-vs-federal-law-conflicts",
  },
  {
    slug: "record-keeping-inventory",
    category: "Compliance",
    title: "Record Keeping & Inventory",
    overview:
      "DEA record retention, biennial inventory requirements, and perpetual inventory for Schedule II substances.",
    summary:
      "Accurate record keeping is foundational to controlled substance accountability. DEA regulations require pharmacies to maintain a complete and accurate record of all controlled substances received, distributed, and dispensed. Records must be kept for a minimum of two years and be readily retrievable for inspection. Schedule II records must be maintained separately from all other records (or clearly identifiable by a star, asterisk, or other marking).\n\nA biennial inventory is required every two years on or near the same date, must be taken at opening of business or close of business and consistently applied, and must include an exact count or measure for Schedule II and an estimated count for Schedules III–V (exact count if the container holds more than 1,000 dosage units and has been opened). Pharmacies must conduct an initial inventory when a new DEA registration is first issued. Perpetual inventory records for Schedule II are required in some states and best practice everywhere. Any discrepancies between perpetual records and physical counts must be investigated and reported if they constitute theft or significant loss.",
    keyConcepts: [
      "Two-year minimum retention for all DEA records; readily retrievable within 2 business days",
      "Schedule II records: maintained separately or clearly identifiable from other records",
      "Biennial inventory: exact count for Schedule II; estimated count for III–V (exact if >1,000 units in an opened container)",
      "Initial inventory: required when DEA registration is first issued",
      "Power of attorney (POA): required for designated persons to order Schedule II on behalf of a registrant",
      "Form 222 / CSOS: records of all Schedule I–II orders retained for 2 years",
      "Significant loss: defined by DEA as quantity or pattern suggesting theft rather than recordkeeping error",
      "Disposal: use DEA-authorized reverse distributors or authorized collection programs; Form 41 for on-site destruction",
    ],
    mustKnowFacts: [
      "Schedule II records must be kept separately from III–V records or be marked to be easily retrievable — combined records that are not clearly marked violate DEA regulations",
      "Biennial inventory date must be within two years of the prior inventory and applied consistently (always opening or always closing)",
    ],
    pearls: [
      "An exact count is always acceptable for Schedule III–V — the estimated count option only applies to unopened or small-volume containers.",
      "State law may require more frequent inventory cycles or additional records; always apply the stricter standard.",
    ],
    pitfalls: [
      "Failing to conduct an initial inventory when opening a new pharmacy or when a new DEA registration is issued",
      "Discarding Schedule II dispensing records after two years if state law requires a longer retention period",
    ],
    practiceTopicSlug: "record-keeping-inventory",
  },
  {
    slug: "dispensing-and-labeling",
    category: "Dispensing",
    title: "Dispensing & Labeling Requirements",
    overview:
      "Federal and state label content, auxiliary label standards, and pharmacist responsibilities at point of dispensing.",
    summary:
      "Prescription label requirements flow from both state pharmacy acts and federal law. Federal FDCA and CSA requirements set a floor, and state boards typically require additional elements. At minimum, a controlled substance label must include: pharmacy name and address, prescription number, dispensing date, patient name, prescriber name, drug name/strength/quantity dispensed, and directions for use as written by the prescriber. The federally required controlled substance label warning ('CAUTION: Federal law prohibits the transfer of this drug to any person other than the patient for whom it was prescribed') must appear on all controlled substance containers dispensed to patients.\n\nPatient counseling requirements (OBRA '90) apply to Medicaid patients at a minimum and have been broadly adopted by states for all new prescriptions. The pharmacist of record must offer to counsel on drug name, indication, dose, route, duration, side effects, interactions, and storage. Auxiliary labels (e.g., 'Take with food,' 'Avoid alcohol,' 'May cause drowsiness') are not federally mandated but are required by most state boards and professional standards. Unit-of-use packaging must comply with child-resistant packaging requirements under the Poison Prevention Packaging Act (PPPA) unless the patient or prescriber requests non-child-resistant containers.",
    keyConcepts: [
      "Required label elements: pharmacy info, Rx number, date, patient, prescriber, drug/strength/quantity, directions",
      "Controlled substance transfer warning required on all CS dispensed to outpatients",
      "OBRA '90: offer to counsel for all Medicaid patients; states broadly extended to all new Rxs",
      "Counseling content: name/indication, dose/route/duration, side effects, interactions, storage, refill instructions",
      "Child-resistant packaging: required under PPPA for most legend drugs; waivable by patient/prescriber in writing",
      "Auxiliary labels: not federally mandated but professionally required and often state-mandated",
      "Generic substitution: label must reflect drug actually dispensed; prescriber brand-only notation must be honored per state law",
      "Unit-dose repackaging for institutions must meet labeling standards of the dispensing site",
    ],
    mustKnowFacts: [
      "The federally required controlled substance label warning must appear on every CS outpatient container — omitting it is a federal violation",
      "Child-resistant packaging waiver must be patient- or prescriber-initiated; pharmacist cannot decide unilaterally to use non-CRP without authorization",
    ],
    pearls: [
      "Directions must reflect what the prescriber wrote — pharmacists should not unilaterally rewrite directions even if they believe them to be incorrect; counsel and contact prescriber instead.",
      "Blister packs and unit-dose packaging dispensed to nursing homes are exempt from PPPA child-resistant requirements.",
    ],
    pitfalls: [
      "Omitting the patient's address from the label when required by state law (many states require it for controlled substances)",
      "Using 'take as directed' as the sole direction on a controlled substance label — this is generally insufficient and may constitute a dispensing violation",
    ],
    practiceTopicSlug: "dispensing-and-labeling",
  },
  {
    slug: "hipaa-privacy",
    category: "Compliance",
    title: "HIPAA & Patient Privacy",
    overview:
      "Protected health information rules, minimum necessary standard, and pharmacy-specific disclosure obligations.",
    summary:
      "The Health Insurance Portability and Accountability Act (HIPAA) Privacy Rule governs how covered entities — including pharmacies — may use and disclose protected health information (PHI). PHI includes any individually identifiable health information in any medium. Pharmacies as covered entities must provide patients with a Notice of Privacy Practices (NPP) at first dispensing and upon request. The minimum necessary standard requires that disclosures be limited to the least amount of PHI needed to accomplish the purpose.\n\nPharmacies may disclose PHI without patient authorization for treatment, payment, and healthcare operations (TPO). Law enforcement requests, public health reporting, and subpoenas each have specific HIPAA provisions governing scope. Patients have the right to access their own records, request restrictions, and request an accounting of disclosures. A Business Associate Agreement (BAA) is required when PHI is shared with vendors (e.g., pharmacy software companies, billing services). Violations are tiered by culpability from $100 to $50,000 per violation with annual caps, and willful neglect with no correction carries mandatory penalties.",
    keyConcepts: [
      "PHI: individually identifiable health information in any form; 18 HIPAA identifiers must be removed for de-identification",
      "TPO disclosures do not require patient authorization — treatment, payment, healthcare operations",
      "Minimum necessary standard: disclose only what is needed; does not apply to disclosures for treatment",
      "Notice of Privacy Practices: provide at first service encounter; post in pharmacy; available on request",
      "Patient rights: access, amendment, restriction requests, accounting of disclosures, confidential communications",
      "Law enforcement: HIPAA permits limited disclosures per specific provisions; court order or subpoena with patient notice may be required",
      "Business Associate Agreements required for third-party vendors handling PHI",
      "Breach notification: notify affected individuals within 60 days; HHS and media (if >500 in state) within 60 days",
    ],
    mustKnowFacts: [
      "HIPAA preempts less protective state privacy laws; more protective state laws are not preempted and must be followed",
      "Verbal confirmation of whether a person is a pharmacy patient to an unauthorized caller constitutes a HIPAA disclosure — verify identity and authorization before confirming any PHI",
    ],
    pearls: [
      "Leaving patient names on a public pickup counter or calling out names in a crowded pharmacy is a common HIPAA incidental disclosure — incidental disclosures are permissible only if reasonable safeguards are in place.",
      "An authorization must include an expiration date, specific description of PHI to be disclosed, and the purpose of the disclosure — deficiencies make the authorization invalid.",
    ],
    pitfalls: [
      "Releasing PHI to a patient's family member or caregiver without confirming the patient has authorized the disclosure or that the disclosure is otherwise permitted",
      "Assuming a court order automatically satisfies HIPAA — court orders must meet specific HIPAA provisions to authorize disclosure",
    ],
    practiceTopicSlug: "hipaa-privacy",
  },
  {
    slug: "pharmacy-operations-pic",
    category: "Operations",
    title: "Pharmacy Operations & Pharmacist-in-Charge",
    overview:
      "PIC responsibilities, pharmacy permits, operational standards, and supervision requirements.",
    summary:
      "Every licensed pharmacy must designate a Pharmacist-in-Charge (PIC) who bears ultimate responsibility for the professional and legal operation of the pharmacy. The PIC is personally accountable for ensuring compliance with all federal and state pharmacy laws, maintaining adequate drug supplies and records, supervising pharmacy personnel, and ensuring patient safety programs are in place. State boards define the ratio of pharmacists to pharmacy technicians; the PIC must ensure staffing complies with these ratios at all times.\n\nPharmacy permits are separate from pharmacist licensure — the permit authorizes the location to dispense and must be renewed on the schedule set by the state board. Changes of ownership, pharmacist-in-charge, or location typically require a new permit or amendment and advance notice to the board. Technicians must be registered or licensed in most states before performing technical tasks. The PIC is responsible for ensuring that technicians perform only functions within their scope and under appropriate supervision.",
    keyConcepts: [
      "PIC: designated pharmacist legally responsible for all pharmacy operations; only one PIC per pharmacy",
      "PIC liability: may be held personally responsible for pharmacy's legal violations even without direct involvement",
      "Pharmacist-to-technician ratio: set by state law; PIC must ensure compliance at all staffing levels",
      "Permit renewal: pharmacy operates only under current, valid state pharmacy permit",
      "Change of ownership: typically requires new permit application; continuing to operate under old permit is a violation",
      "Technician scope: state-defined; may include data entry, counting, IV admixture preparation under supervision",
      "Intern pharmacist supervision: defined by state law; ratio and supervision requirements vary",
      "Quality assurance programs: required by many states; include error tracking and prevention protocols",
    ],
    mustKnowFacts: [
      "The PIC is responsible for ensuring the pharmacy's DEA registration is current — an expired DEA registration means the pharmacy cannot dispense controlled substances",
      "A change in PIC must typically be reported to the state board within a defined timeframe (often 10–30 days); the new PIC accepts responsibility from the date of designation",
    ],
    pearls: [
      "In states that require a pharmacist to be on-site whenever the pharmacy is open, the PIC is responsible for ensuring adequate pharmacist coverage — leaving the pharmacy without a pharmacist on duty is a PIC violation.",
      "Quality improvement programs that document and analyze dispensing errors are a PIC responsibility — failure to maintain them can result in board action.",
    ],
    pitfalls: [
      "Assuming a prior PIC's compliance failures do not affect an incoming PIC — the incoming PIC should conduct a compliance audit and document any pre-existing deficiencies",
      "Allowing technicians to perform final verification or patient counseling — these are pharmacist-only functions in virtually all jurisdictions",
    ],
    practiceTopicSlug: "pharmacy-operations-pic",
  },
  {
    slug: "dea-ordering-csos-form-222",
    category: "Federal Law",
    title: "DEA Ordering: CSOS & Form 222",
    overview:
      "Schedule I and II ordering procedures using DEA Form 222 (paper) and CSOS (electronic), including power of attorney.",
    summary:
      "Schedule I and II controlled substances may only be transferred between DEA registrants using DEA Form 222 (paper) or the Controlled Substances Ordering System (CSOS) electronic equivalent. Form 222 is a tripartite, serialized document issued by DEA. The ordering registrant completes Copy 1 and 2 and sends them to the supplier; Copy 3 is retained. The supplier fills Copy 1 and retains it; Copy 2 is sent to DEA. All copies must be retained for two years.\n\nCSOS provides a DEA-issued digital certificate enabling electronic ordering with the same legal authority as Form 222. A registrant may grant power of attorney (POA) to a designated agent to sign Form 222 or issue CSOS orders on behalf of the registrant. POA records must be maintained as long as they remain effective and for two years after termination. Errors on Form 222 can render the form void — only certain types of errors (e.g., a single line item error) may be corrected by the supplier; the ordering pharmacy must void the form and issue a new one for other errors. Schedules III–V may be ordered using a purchase order or invoice — Form 222 is not required.",
    keyConcepts: [
      "Form 222 applies to Schedule I and II only; cannot be used for III–V",
      "Tripartite form: Copy 3 retained by purchaser; Copies 1 and 2 to supplier; supplier retains Copy 1, sends Copy 2 to DEA",
      "CSOS: electronic equivalent to Form 222; requires DEA-issued digital certificate",
      "Power of attorney: authorizes designated person to sign/order; POA must be executed on pharmacy letterhead and filed",
      "Errors on Form 222: only supplier may correct certain errors (item not carried, quantity reduced); void and reorder for other mistakes",
      "Form 222 retention: 2 years; readily retrievable",
      "Schedules III–V: no special form required; must maintain records of quantities received",
      "Lost/stolen Form 222: report to DEA immediately; void the form",
    ],
    mustKnowFacts: [
      "A pharmacist who is not the registrant may sign Form 222 only if a valid power of attorney is on file — no POA means only the registrant may sign",
      "CSOS orders have the same legal validity as Form 222 — electronic and paper methods are interchangeable for Schedule I and II ordering",
    ],
    pearls: [
      "Form 222 must be filled out in triplicate at the time of ordering — pre-signing blank forms is a DEA violation.",
      "If a supplier partially fills a Form 222 (e.g., partial quantity available), the remainder may be filled within 60 days on the same form by the original or another DEA-registered supplier.",
    ],
    pitfalls: [
      "Attempting to use Form 222 to order Schedule III–V substances — Form 222 is strictly limited to Schedule I and II controlled substances",
      "Discarding Form 222 records (Copy 3) before the two-year retention period has expired, or failing to maintain them separately from Schedule III–V records",
    ],
    practiceTopicSlug: "dea-ordering-csos-form-222",
  },
  {
    slug: "liability-and-ethics",
    category: "Ethics",
    title: "Liability & Professional Ethics",
    overview:
      "Pharmacist civil and criminal liability, professional standards, duty to counsel, and ethical decision-making frameworks.",
    summary:
      "Pharmacists face both civil and criminal liability for professional misconduct. Civil liability in pharmacy is most commonly negligence: duty (professional standard of care), breach, causation, and damages. The standard of care is defined as what a reasonably prudent pharmacist with similar training and access to information would do under the same circumstances. Failure to counsel, dispensing the wrong drug or dose, or failing to screen for interactions that caused patient harm are classic negligence scenarios.\n\nCriminal liability under the CSA arises when a pharmacist knowingly and intentionally violates controlled substance statutes — e.g., dispensing without a valid prescription, diverting controlled substances, or distributing outside the course of professional practice. Ethical principles guiding pharmacy practice include beneficence, non-maleficence, autonomy, justice, and fidelity. Codes of ethics from ASHP and APhA serve as professional standards even when not codified in law. Conflicts of interest, professional impairment, and mandatory reporting obligations are ethics-and-law crossover issues tested on the MPJE.",
    keyConcepts: [
      "Negligence elements: duty, breach, causation, damages — all four required for liability",
      "Standard of care: reasonably prudent pharmacist with same training in same circumstances",
      "Criminal CSA liability: knowing and intentional violation; lower mens rea for some regulatory violations",
      "Strict liability: FDCA adulteration and misbranding offenses may not require intent",
      "Pharmacist impairment: mandatory reporting obligations in most states; peer assistance programs",
      "Conflict of interest: pharmacist ownership of long-term care facility raises dispensing integrity concerns",
      "Conscientious objection: pharmacist may decline to fill based on moral grounds in some states; must refer patient to obtain medication",
      "Documentation as defense: contemporaneous, objective records support standard of care compliance",
    ],
    mustKnowFacts: [
      "A pharmacist who diverts controlled substances for personal use has committed both a federal crime and a state practice act violation — disciplinary action and criminal prosecution are concurrent",
      "Failure to counsel on a new prescription when required by state law or OBRA '90 is both an ethical and legal breach",
    ],
    pearls: [
      "Respondeat superior: an employer pharmacy may be liable for employee pharmacist errors committed within the scope of employment — but the individual pharmacist remains personally liable too.",
      "The duty to warn about drug interactions arises when the pharmacist has or should have the information available — computer systems that generate interaction alerts create a documentation duty to act.",
    ],
    pitfalls: [
      "Assuming that following a prescriber's order shields the pharmacist from liability — pharmacists have an independent duty to verify clinical appropriateness",
      "Documenting a counseling session as 'patient refused counseling' without actually offering it — this is fraud that creates additional liability",
    ],
    practiceTopicSlug: "liability-and-ethics",
  },
  {
    slug: "drug-supply-chain-dscsa",
    category: "Compliance",
    title: "Drug Supply Chain Security Act (DSCSA)",
    overview:
      "Track-and-trace requirements, suspect and illegitimate product handling, and trading partner verification.",
    summary:
      "The Drug Supply Chain Security Act (DSCSA), enacted in 2013, establishes a national electronic drug tracing system requiring pharmaceutical manufacturers, repackagers, wholesale distributors, third-party logistics providers, and dispensers (including pharmacies) to pass transaction information, transaction history, and transaction statements for each prescription drug product. The goal is a fully electronic, interoperable track-and-trace system by 2023 and enhanced serialization requirements.\n\nPharmacies (dispensers) must only acquire prescription drugs from authorized trading partners, must quarantine and investigate suspect or illegitimate products, and must maintain transaction records for at least six years. Suspect product is product believed to be counterfeit, stolen, intentionally adulterated, or fraudulently sold. Illegitimate product has been confirmed as such. Upon identification, the pharmacy must quarantine the product, notify FDA and trading partners within 24 hours, and not return suspect product to saleable inventory without verification. The DSCSA also requires pharmacies to respond to FDA requests for product tracing information within 24–48 hours.",
    keyConcepts: [
      "Three T's: transaction information, transaction history, transaction statement must accompany each product transfer",
      "Authorized trading partners: licensed manufacturers, repackagers, wholesale distributors, third-party logistics, and dispensers",
      "Serialization: each saleable unit assigned unique product identifier (NDC + lot + serial + expiration); pharmacies must verify at receipt",
      "Suspect product: quarantine immediately; do not dispense; investigate within defined timeframes",
      "Illegitimate product confirmation: notify FDA and immediate trading partners within 24 hours",
      "Record retention: 6 years for DSCSA transaction records (longer than DEA's 2-year requirement)",
      "FDA tracing requests: respond within 24 hours for illegitimate product; 48 hours for other requests",
      "Saleable returns: verification required before returning product to saleable inventory",
    ],
    mustKnowFacts: [
      "DSCSA record retention is 6 years — longer than the 2-year DEA requirement; the longer period governs",
      "Purchasing prescription drugs from an unauthorized trading partner (e.g., unlicensed wholesaler) violates DSCSA and subjects the pharmacy to FDA enforcement and potential FDCA criminal liability",
    ],
    pearls: [
      "The DSCSA enhanced drug distribution security requirements extend traceability to the package level — pharmacies need processes to verify product identifiers upon receipt.",
      "Dispenser exemptions exist for dispensers that receive fewer than 27 packages from a trading partner in a calendar year — but the exemption is narrow and conditions apply.",
    ],
    pitfalls: [
      "Returning a suspect product to a supplier before completing the DSCSA investigation and quarantine requirements — premature returns can mask supply chain security issues",
      "Retaining DSCSA transaction records for only 2 years because that is the DEA standard — the DSCSA 6-year requirement controls for product tracing records",
    ],
    practiceTopicSlug: "drug-supply-chain-dscsa",
  },
  {
    slug: "collaborative-practice-agreements",
    category: "Operations",
    title: "Collaborative Practice Agreements (CPAs)",
    overview:
      "Legal framework, scope of pharmacist prescribing authority, and documentation requirements under CPAs.",
    summary:
      "Collaborative Practice Agreements (CPAs) are formal legal arrangements between one or more pharmacists and one or more physicians (or other authorized prescribers) that allow pharmacists to perform patient care functions — including prescribing, ordering labs, adjusting doses, and administering drugs — within defined parameters. CPAs are authorized by state law and vary widely in scope across jurisdictions. Some states restrict CPAs to specific settings (hospital, clinic), patient populations, or disease states; others permit broad community pharmacy CPAs.\n\nA valid CPA must: identify the collaborating parties and their licenses, define the specific functions delegated, establish patient eligibility criteria, include protocols or treatment algorithms, specify documentation requirements, and define the duration and renewal terms. Pharmacists practicing under a CPA must document each patient encounter in the medical record per the agreement's terms. If the CPA includes controlled substances, the pharmacist must have a DEA registration for the applicable schedule. CPAs do not override federal law — pharmacists cannot perform functions prohibited by the CSA or FDCA under any CPA.",
    keyConcepts: [
      "CPA authorization is state-specific — scope varies from limited disease management to broad prescriptive authority",
      "Required CPA elements: parties identified, scope of practice, patient eligibility, protocols, documentation requirements, duration",
      "Controlled substances under CPA: pharmacist must hold DEA registration for the applicable schedule",
      "Documentation: pharmacist must document encounters per CPA terms in the patient medical record",
      "CPA limitations: cannot authorize functions prohibited by federal law or outside pharmacist's clinical competence",
      "Liability: pharmacist acting outside CPA scope faces professional discipline and civil liability",
      "Renewal: CPAs must be reviewed and renewed per terms; expired CPAs void authority",
      "Settings: hospital/clinic CPAs most established; community pharmacy CPAs growing but more restricted",
    ],
    mustKnowFacts: [
      "A pharmacist prescribing controlled substances under a CPA must have an independent DEA registration — the collaborating physician's DEA number cannot be used",
      "If a CPA is silent on a specific clinical situation, the pharmacist must revert to traditional dispensing functions and contact the collaborating physician",
    ],
    pearls: [
      "CPAs that include immunization authority do not eliminate state immunization standing order or protocol requirements — both frameworks must be satisfied.",
      "Some states require board approval of CPAs in addition to the agreement between the parties — check state-specific requirements before practice.",
    ],
    pitfalls: [
      "Practicing under an expired or unsigned CPA — the pharmacist has no legal authority for the extended functions until the CPA is current and executed",
      "Assuming a hospital-authorized CPA extends to community pharmacy practice — CPA authority is typically site-specific unless expressly stated otherwise",
    ],
    practiceTopicSlug: "collaborative-practice-agreements",
  },
  {
    slug: "immunization-authority",
    category: "Operations",
    title: "Pharmacist Immunization Authority",
    overview:
      "State-specific immunization scope, required training, vaccine administration protocols, and reporting obligations.",
    summary:
      "All 50 states and Washington D.C. authorize pharmacists to administer vaccines, but the scope of that authority — including which vaccines, which patient ages, and whether a prescription or standing order is required — varies significantly by state. Most states require pharmacists to complete an ACPE-accredited immunization training program, maintain current CPR certification, and be trained in the recognition and management of adverse reactions including anaphylaxis.\n\nPharmacists must report administered immunizations to the state immunization information system (IIS or immunization registry) within required timeframes and must document the manufacturer, lot number, site of administration, and vaccination date. Vaccine Information Statements (VIS) must be provided to the patient or legal representative before each dose. Emergency epinephrine (auto-injector) must be immediately available wherever vaccines are administered. PREP Act protections provide liability immunity for authorized vaccine administrators during declared public health emergencies when PREP Act conditions are met.",
    keyConcepts: [
      "Training requirement: ACPE-accredited immunization certificate program + current CPR certification",
      "Anaphylaxis preparedness: epinephrine auto-injector must be immediately accessible; training in recognition and response",
      "VIS: provide before each dose; document the edition date given",
      "IIS reporting: report to state immunization registry within state-defined timeframe",
      "Documentation: vaccine name, manufacturer, lot number, site of injection, date, administering pharmacist",
      "Age restrictions: state-specific — some states limit to adults; others allow pediatric immunizations with or without standing order",
      "VAERS: report adverse events via Vaccine Adverse Event Reporting System; some events mandatory",
      "PREP Act: federal liability immunity for authorized countermeasure administrators during declared emergencies",
    ],
    mustKnowFacts: [
      "Vaccine Information Statements are required by federal law (National Childhood Vaccine Injury Act) — providing them is not optional for vaccines covered by NCVIA",
      "Pharmacists must be prepared to treat anaphylaxis on-site — a vaccination program without epinephrine immediately available violates professional standards in all jurisdictions",
    ],
    pearls: [
      "A standing order from the state health officer or medical director can serve as the prescribing authority for vaccines in many states, eliminating the need for individual patient-specific prescriptions.",
      "PREP Act immunity applies only to covered countermeasures during a declared emergency — standard negligence law governs routine vaccine administration.",
    ],
    pitfalls: [
      "Administering a vaccine to a pediatric patient without verifying whether state law requires a prescription or parental consent for that age group",
      "Failing to document the VIS edition date and the date it was given — both are legally required elements of the immunization record",
    ],
    practiceTopicSlug: "immunization-authority",
  },
  {
    slug: "mail-order-internet-pharmacy",
    category: "Operations",
    title: "Mail-Order & Internet Pharmacy",
    overview:
      "NABP standards, Ryan Haight Act requirements, state licensure obligations, and VIPPS accreditation.",
    summary:
      "Mail-order and internet pharmacies face both federal and multi-state regulatory requirements. The Ryan Haight Online Pharmacy Consumer Protection Act amended the CSA to prohibit dispensing controlled substances via the internet without a valid prescription issued by a practitioner who has conducted at least one in-person medical evaluation of the patient (with limited telemedicine exceptions). Internet pharmacies that dispense controlled substances must obtain a DEA registration that includes the internet pharmacy business activity designator.\n\nPharmacies dispensing across state lines must be licensed in each state where patients are located (the patient's state), not just the state where the pharmacy is physically located. The NABP Verified Internet Pharmacy Practice Sites (VIPPS) program certifies legitimate internet pharmacies that comply with state and federal law. Rogue internet pharmacies — those that dispense without a valid prescription, ship from outside the U.S., or misrepresent credentials — violate the FDCA, CSA, and typically multiple state laws. Pharmacists working in mail-order settings must still comply with OBRA '90 counseling obligations, typically offering counseling via toll-free phone line or written materials.",
    keyConcepts: [
      "Ryan Haight Act: at least one in-person patient evaluation required before prescribing CS via internet (exceptions for DEA telemedicine registrations)",
      "Internet pharmacy DEA registration: must designate 'internet pharmacy' as a business activity",
      "Multi-state licensure: pharmacy must be licensed in each state to which it ships prescription drugs",
      "VIPPS accreditation: voluntary NABP program; legitimate internet pharmacies display seal",
      "OBRA '90 counseling: offer must be made via toll-free line or written offer with mail-order dispensing",
      "FDCA section 503A/503B: compounding exemptions do not apply to compounded drugs sold across state lines without an individual Rx",
      "Canadian pharmacy importation: generally illegal under FDCA; FDA enforcement discretion used selectively",
      "Patient choice: patients have the right to use mail-order pharmacy; pharmacies cannot prevent transfer of valid Rxs",
    ],
    mustKnowFacts: [
      "A pharmacy that ships controlled substances to patients in another state without a DEA registration listing that state as a registered location violates the CSA",
      "Patients must be offered the opportunity to speak with a pharmacist when receiving prescriptions by mail — a toll-free number and written offer satisfy OBRA '90 requirements in most states",
    ],
    pearls: [
      "Post-COVID telemedicine prescribing flexibilities for Schedule III–V controlled substances were extended multiple times by DEA — always verify current status of these temporary exceptions.",
      "A mail-order pharmacy that does not obtain state licensure in the patient's state is practicing pharmacy without a license in that state — a criminal offense in most jurisdictions.",
    ],
    pitfalls: [
      "Assuming a pharmacy licensed in one state can ship to patients in all 50 states — each destination state requires its own pharmacy license or reciprocity",
      "Treating internet pharmacy EPCS requirements as optional — EPCS for internet-dispensed Schedule II drugs must meet all DEA 21 CFR Part 1311 requirements",
    ],
    practiceTopicSlug: "mail-order-internet-pharmacy",
  },
  {
    slug: "board-inspections",
    category: "Compliance",
    title: "Board Inspections & Regulatory Compliance",
    overview:
      "State board inspection authority, DEA inspection rights, pharmacist obligations during inspections, and corrective action processes.",
    summary:
      "State boards of pharmacy and the DEA have broad authority to inspect licensed pharmacies without prior notice during normal business hours. State board inspectors may review all pharmacy records, drug stocks, equipment, and facilities to ensure compliance with state pharmacy law. DEA investigators may inspect all controlled substance records, inventories, and security measures. Neither the state board nor the DEA needs a warrant for an administrative inspection under the statutory authority granted to them — a pharmacist's refusal to allow an authorized inspection is itself a violation that can result in license revocation.\n\nDuring an inspection, the pharmacist has the right to ask to see the inspector's credentials, to be present during the inspection, and to receive a copy of any inspection report. Findings are documented on inspection reports, and pharmacies are typically given an opportunity to correct deficiencies within a specified timeframe. Uncorrected or repeated violations may result in formal disciplinary action including fines, license suspension, or revocation. The PIC is directly responsible for all inspection findings during their tenure.",
    keyConcepts: [
      "Administrative inspection: DEA and state boards may inspect without a warrant during business hours under statutory authority",
      "Right to credentials: pharmacist may request and verify inspector's identification before allowing inspection",
      "DEA inspection scope: controlled substance records, inventories, security, personnel records related to controlled substances",
      "State board inspection scope: all pharmacy records, drug stock, equipment, compounding practices, personnel licenses",
      "Refusal to allow inspection: immediate violation; may result in license suspension and criminal charges",
      "Inspection report: pharmacy receives copy; deficiencies must be corrected within stated timeframe",
      "Corrective action plan (CAP): formal written plan required for serious or systemic deficiencies",
      "Repeat violations: escalating penalties; pattern of non-compliance increases risk of license revocation",
    ],
    mustKnowFacts: [
      "A pharmacist must allow DEA or state board inspectors access during business hours — refusing an authorized administrative inspection is an independent violation of law",
      "The PIC is responsible for all inspection findings: deficiencies discovered during an inspection — even for pre-existing conditions — become the PIC's responsibility from the date of inspection",
    ],
    pearls: [
      "Document the date, time, inspector name, badge/credential number, and scope of every inspection in pharmacy records — this documentation is important for responding to inspection reports.",
      "A corrective action plan accepted by the board does not shield the pharmacy from a parallel DEA investigation — regulatory bodies operate independently.",
    ],
    pitfalls: [
      "Permitting inspectors to remove original controlled substance records without retaining copies — always make copies before records are taken and document what was removed",
      "Failing to respond to inspection findings within the specified timeframe — late responses are treated as failure to correct and can escalate to formal board action",
    ],
    practiceTopicSlug: "board-inspections",
  },
]);
