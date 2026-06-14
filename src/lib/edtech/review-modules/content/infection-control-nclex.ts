import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const INFECTION_CONTROL_NCLEX_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Infection control is tested on nearly every NCLEX because nursing judgment around precautions, hand hygiene, and antimicrobial monitoring directly protects patients and staff. Standard precautions apply to all patients; transmission-based precautions layer on when the pathogen or syndrome demands it.",
        "NCLEX rewards knowing which PPE for which organism, when soap beats alcohol gel, how to monitor IV vancomycin safely, and how infection control intersects with the sepsis hour-1 bundle. Wrong precaution choices and delayed recognition of neutropenic or septic patients cause preventable harm — the exam punishes comfort measures before safety.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      paragraphs: [
        "Transmission-based precautions are organized by route: contact (direct/indirect touch), droplet (large particles within 3–6 feet), and airborne (small particles that remain suspended). When two types apply, use the more restrictive combination. Neutropenic precautions protect immunocompromised patients from organisms the patient cannot fight — distinct from protecting others from the patient.",
      ],
      bullets: [
        "Standard precautions: hand hygiene before/after every patient contact; PPE when exposure to blood/body fluids is anticipated; safe injection and sharps handling",
        "Contact precautions: gown + gloves for every room entry; private room or cohort; dedicated equipment; MRSA, VRE, C. diff, draining wounds not contained",
        "Droplet precautions: surgical mask within 3–6 feet; private room; influenza, pertussis, meningococcal disease, mumps, rubella",
        "Airborne precautions: N95 fit-tested respirator; negative-pressure room when available; TB, measles, varicella; limit transport; mask patient during transport",
        "Hand hygiene: alcohol-based rub (ABHR) for most organisms; soap and water required for C. diff spores and visible soil — spores resist alcohol",
        "C. diff: contact precautions; oral vancomycin or fidaxomicin for treatment; bleach (sporicidal) for environmental cleaning; discontinue inciting antibiotic when possible",
        "MRSA: contact precautions; nasal screening in high-risk admissions per policy; decolonization protocols vary; treat based on infection vs colonization",
        "Vancomycin nursing monitoring: infuse over ≥60 min to prevent red man syndrome (rate-related histamine flush — not true allergy); trough/AUC per protocol; assess for nephrotoxicity and ototoxicity",
        "Peak/trough labs: trough = level immediately before next dose at steady state (~4th–5th dose); peak used for aminoglycosides (concentration-dependent killing); vancomycin nursing draws trough per order — too-early trough misleads dosing",
        "Neutropenic precautions: reverse isolation protects the patient (neutrophils <500 or expected); no fresh flowers/plants, no raw foods, meticulous hand hygiene, HEPA filtration when available",
        "Sepsis hour-1 bundle nursing priorities: recognize infection + organ dysfunction → lactate → cultures → antibiotics within 1 h → 30 mL/kg crystalloid if hypotensive or lactate ≥4 → reassess perfusion",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Entering C. diff room: gown + gloves → perform care → remove PPE → wash hands with soap and water (not ABHR alone) before leaving",
        "Suspected TB with productive cough: place in airborne isolation immediately; N95 for staff; notify infection control; mask patient during any transport",
        "MRSA wound with uncontained drainage: contact precautions; wound covered with dressing; dedicated equipment; educate family on hand hygiene — not airborne",
        "Starting IV vancomycin: verify renal function; infuse over ≥60 min; premedicate only per order; stop infusion and notify provider if flushing, pruritus, hypotension (red man syndrome)",
        "Vancomycin trough timing: draw level immediately before scheduled dose once at steady state (typically before 4th–5th dose); document exact time; hold dose if level pending per protocol",
        "Aminoglycoside monitoring: peak 30 min post-infusion; trough before next dose; report rising trough (nephrotoxicity) or subtherapeutic peak",
        "Neutropenic patient on chemo: private room; no sick visitors; no rectal temps or enemas; report fever ≥38.3°C once or ≥38.0°C sustained — medical emergency",
        "Sepsis recognition on med-surg floor: qSOFA screen (RR ≥22, altered mentation, SBP ≤100) → activate sepsis protocol → cultures then antibiotics within 1 hour",
        "Hour-1 bundle nursing sequence: measure lactate → obtain blood cultures → administer prescribed broad-spectrum antibiotics → 30 mL/kg crystalloid bolus if indicated → trend urine output and mentation",
        "Post-resuscitation infection control: maintain line sterility; evaluate invasive devices for removal; continue source-control nursing (wound care, drainage, oral care to prevent VAP)",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Transmission-based precautions — NCLEX decision framework",
          headers: ["Precaution", "Organisms / Conditions", "PPE / Room", "Hand Hygiene"],
          rows: [
            ["Standard (all patients)", "Blood, body fluids, secretions, excretions", "Gloves when exposure anticipated", "ABHR or soap and water"],
            ["Contact", "C. diff, MRSA, VRE, draining wounds", "Gown + gloves; private/cohort room", "Soap and water for C. diff; ABHR for MRSA/VRE"],
            ["Droplet", "Influenza, pertussis, meningococcus, mumps", "Surgical mask within 3–6 ft; private room", "ABHR or soap and water"],
            ["Airborne", "TB, measles, varicella (chickenpox)", "N95 respirator; negative-pressure room", "ABHR or soap and water"],
            ["Neutropenic (protective)", "ANC <500 or expected — patient at risk", "Private room; HEPA if available; no plants/raw food", "Meticulous hand hygiene for all entering"],
          ],
        },
        {
          caption: "C. diff vs MRSA — nursing priorities",
          headers: ["Feature", "C. difficile", "MRSA"],
          rows: [
            ["Transmission", "Contact (spores)", "Contact (bacteria)"],
            ["Hand hygiene", "Soap and water — spores resist alcohol", "ABHR acceptable; soap and water if soiled"],
            ["Room cleaning", "Bleach (sporicidal) — EPA-registered", "Routine disinfectants per policy"],
            ["Key sign", "Watery diarrhea, abdominal pain, leukocytosis", "Colonization vs infection — wound, bloodstream, pneumonia"],
            ["Treatment focus", "Oral vancomycin or fidaxomicin; stop inciting abx", "Infection site dictates therapy; contact precautions while colonized/infected"],
            ["NCLEX trap", "Alcohol gel alone after C. diff care", "Airborne precautions for MRSA wound"],
          ],
        },
        {
          caption: "Peak vs trough lab monitoring",
          headers: ["Lab", "Timing", "Used For", "Nursing Action"],
          rows: [
            ["Trough", "Immediately before next scheduled dose at steady state", "Vancomycin, aminoglycosides", "Document draw time; verify steady state (~4th–5th dose for vanc)"],
            ["Peak", "~30 min after IV infusion ends", "Aminoglycosides (concentration-dependent)", "Report subtherapeutic peak or nephrotoxic trough trend"],
            ["Random level", "Not standard for monitoring", "Avoid unless protocol specifies", "Clarify order — trough timing errors change dosing decisions"],
            ["Red man syndrome", "During rapid vancomycin infusion", "Vancomycin rate-related histamine release", "Slow infusion to ≥60 min; stop and notify if reaction occurs"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Precaution pyramid: standard precautions base → add contact, droplet, or airborne by route — use most restrictive when multiple apply",
        "Hand hygiene decision tree: visible soil or C. diff/spore organism → soap and water; otherwise ABHR for ≥20 seconds until dry",
        "C. diff care sequence diagram: don gown/gloves → patient care → doff PPE → soap-and-water hand wash → document",
        "Vancomycin infusion timeline: verify renal labs → load/maintenance per order → infuse ≥60 min → trough before 4th–5th dose → trend creatinine",
        "Neutropenic room setup checklist: private room, HEPA, no plants/flowers, cooked foods only, meticulous hand hygiene signage for visitors",
        "Sepsis hour-1 bundle nursing timeline overlaid with infection control: recognition → cultures → antibiotics → fluids → perfusion reassessment",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Alcohol hand gel is sufficient after C. diff care — spores survive ABHR; soap and water mechanically removes spores",
        "MRSA requires airborne isolation — MRSA is contact precaution unless special circumstances (e.g., burn unit policy); not N95 for routine MRSA",
        "Red man syndrome means vancomycin allergy — it is rate-related histamine release; slow infusion; true IgE allergy is different presentation",
        "Draw vancomycin trough right after infusion — trough is pre-dose at steady state; post-infusion peak is not standard trough monitoring",
        "Neutropenic precautions protect staff from the patient — reverse isolation protects the immunocompromised patient from environmental organisms",
        "Wait for culture results before antibiotics in sepsis — hour-1 bundle requires empiric antibiotics within 1 hour; cultures before abx but never delay abx",
        "Droplet and airborne use the same mask — droplet = surgical mask; airborne = fit-tested N95; surgical mask does not filter airborne particles",
        "Bleach cleaning is optional for C. diff — sporicidal (bleach) environmental cleaning is required to interrupt transmission",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "NCLEX precaution mnemonic: 'Contact Catches, Droplet Drops, Airborne Floats' — match organism to route",
        "C. diff pearl: 'SOAP not GEL' — soap-and-water hand washing after every room exit",
        "Vancomycin pearl: 'SLOW before GLOW' — infuse ≥60 min to prevent red man flushing",
        "Trough pearl: 'Before the fourth, before the dose' — steady-state trough before 4th–5th dose, drawn immediately pre-infusion",
        "Neutropenic pearl: 'No flora, no fever tolerance' — fever in neutropenia is an emergency; cultures and broad-spectrum antibiotics stat",
        "MRSA pearl: 'Gown and glove every entry' — contact precautions for infected or colonized sites per policy",
        "Sepsis + infection control pearl: 'Cover, culture, cure' — source control (line removal, wound care) plus hour-1 bundle",
        "When two precautions apply (e.g., influenza + MRSA co-infection scenarios), combine the more restrictive PPE elements",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Standard precautions for all; add contact (C. diff, MRSA), droplet (flu, pertussis), or airborne (TB, measles, varicella)",
        "C. diff: contact precautions + soap-and-water hands + bleach cleaning + oral vancomycin/fidaxomicin",
        "MRSA: contact precautions (gown + gloves); not routine airborne",
        "Vancomycin: infuse ≥60 min (red man syndrome); trough at steady state before dose; monitor renal function",
        "Peak/trough: trough pre-dose; aminoglycoside peak ~30 min post-infusion",
        "Neutropenic precautions protect the patient — private room, no plants/raw food, fever is emergency",
        "Sepsis hour-1 bundle: lactate, cultures, antibiotics within 1 h, fluids if hypotensive/lactate ≥4, reassess perfusion",
        "NCLEX: match precaution to route → correct hand hygiene → monitor antimicrobials → act fast in sepsis/neutropenic fever",
      ],
    },
  ],
};
