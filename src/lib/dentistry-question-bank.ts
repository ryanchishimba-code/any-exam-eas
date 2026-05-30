/**
 * INBDE-style seed items for dentistry subject areas.
 */
import type { BankItem } from "./question-bank";

function q(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  tags: string[] = []
): BankItem {
  return {
    subjectId,
    question,
    options,
    correctAnswer: correct,
    explanation,
    tags: [...tags, "high-yield"],
  };
}

export const DENTISTRY_QUESTION_BANK: Record<string, BankItem[]> = {
  "oral-pathology": [
    q("oral-pathology", "Which lesion is most consistent with erythroplakia?", ["White patch that scrapes off", "Red velvety patch that does not wipe away", "Radiolucency at the apex", "Bilateral parotid swelling"], "Red velvety patch that does not wipe away", "Erythroplakia carries higher malignant potential than leukoplakia.", ["oral pathology"]),
    q("oral-pathology", "Ameloblastoma histology typically shows:", ["Keratin pearls in nests", "Palisading basaloid cells with stellate reticulum", "Osteoid laid down by malignant cells", "Non-caseating granulomas"], "Palisading basaloid cells with stellate reticulum", "Benign odontogenic epithelial tumor pattern.", ["pathology"]),
  ],
  "dental-anatomy": [
    q("dental-anatomy", "The mesiobuccal cusp of the maxillary first molar opposes which mandibular tooth surface?", ["Mandibular first molar buccal groove", "Mandibular second premolar lingual cusp", "Mandibular canine incisal edge", "Mandibular central incisor labial surface"], "Mandibular first molar buccal groove", "Angle's classification of occlusion — MB cusp relationship.", ["occlusion"]),
  ],
  radiology: [
    q("radiology", "A periapical radiolucency at the apex after RCT most suggests:", ["Normal periodontal ligament widening", "Persistent periapical disease or incomplete obturation", "Hypercementosis", "Cemento-osseous dysplasia only"], "Persistent periapical disease or incomplete obturation", "Evaluate quality of fill and symptoms.", ["radiology"]),
  ],
  "dental-pharmacology": [
    q("dental-pharmacology", "For a patient on warfarin needing extraction, INR should generally be:", ["Below therapeutic range without physician input", "At or below a level agreed with the physician, often ≤3.5 for simple extraction", "Above 4.0 for hemostasis", "Ignored if local hemostatics are used"], "At or below a level agreed with the physician, often ≤3.5 for simple extraction", "Coordinate medical management; avoid NSAIDs.", ["pharmacology"]),
  ],
  "restorative-dentistry": [
    q("restorative-dentistry", "Composite resin polymerization shrinkage is best minimized by:", ["Bulk-filling entire Class II in one increment", "Incremental layering and adequate curing", "Using only self-etch without adhesive", "Skipping etch on enamel"], "Incremental layering and adequate curing", "Reduces marginal gap and sensitivity.", ["restorative"]),
  ],
  "treatment-planning": [
    q("treatment-planning", "When sequencing full-mouth care, which is typically addressed first?", ["Elective esthetics", "Active infection, pain, and acute disease", "Definitive prosthodontics", "Whitening"], "Active infection, pain, and acute disease", "Stabilize disease before complex rehab.", ["planning"]),
  ],
  periodontics: [
    q("periodontics", "Periodontal probing depth measures from the:", ["CEJ to alveolar crest on radiograph", "Gingival margin to base of sulcus/pocket", "Occlusal table to furcation", "Mucogingival junction to apex"], "Gingival margin to base of sulcus/pocket", "Use consistent force (~25 g) with a periodontal probe.", ["periodontics"]),
  ],
  endodontics: [
    q("endodontics", "Working length in endodontics is ideally established at:", ["Apex only regardless of radiograph", "0.5–1 mm short of the radiographic apex", "2 mm beyond the apex", "CEJ level only"], "0.5–1 mm short of the radiographic apex", "Avoid over-instrumentation beyond the foramen.", ["endodontics"]),
  ],
};

export function getDentistryBankSubjectIds(): string[] {
  return Object.keys(DENTISTRY_QUESTION_BANK);
}

export function getDentistryBankItems(subjectId: string): BankItem[] {
  return DENTISTRY_QUESTION_BANK[subjectId] ?? [];
}
