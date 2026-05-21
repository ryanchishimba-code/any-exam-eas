import type { ExamQuestion, GeneratedExam } from "./ai";
import type { SearchResult } from "./search";
import { getFieldMeta } from "./fields";
import {
  getFieldSubject,
  subjectMatchesQuestion,
} from "./field-subjects";
import { FIELD_QUESTION_BANKS } from "./field-question-banks";
import { generateProceduralQuestions } from "./procedural-questions";
import { toQuizletStyleQuestion } from "./question-format";

export type BankItem = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  solutionSteps?: string[];
  /** Subject/topic id within the field — e.g. "calculus" */
  subjectId?: string;
  tags?: string[];
};

/** High-yield items modeled after common study-set / board-style MCQs */
const BANK: Record<string, BankItem[]> = {
  anatomy: [
    {
      subjectId: "anatomy",
      question: "Blood belongs to which of the four primary tissue types?",
      options: ["Epithelial tissue", "Connective tissue", "Muscle tissue", "Nervous tissue"],
      correctAnswer: "Connective tissue",
      explanation:
        "Blood is a specialized fluid connective tissue. The four primary tissues are epithelial, connective, muscle, and nervous.",
      tags: ["histology", "high-yield"],
    },
    {
      question: "Which structure passes through the anatomical snuffbox?",
      options: ["Ulnar artery", "Radial artery", "Basilic vein", "Median nerve"],
      correctAnswer: "Radial artery",
      explanation: "The radial artery crosses the floor of the anatomical snuffbox at the wrist.",
      tags: ["upper limb"],
    },
    {
      question: "The serratus anterior is innervated by which nerve?",
      options: ["Axillary nerve", "Long thoracic nerve", "Thoracodorsal nerve", "Suprascapular nerve"],
      correctAnswer: "Long thoracic nerve",
      explanation: "Long thoracic nerve (C5–C7) injury causes winged scapula.",
      tags: ["upper limb", "high-yield"],
    },
    {
      question: "Which chamber of the heart forms most of the heart's posterior surface?",
      options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
      correctAnswer: "Left atrium",
      explanation: "The left atrium is the most posterior cardiac chamber.",
      tags: ["thorax"],
    },
    {
      question: "The ductus arteriosus normally closes to become the:",
      options: ["Ligamentum arteriosum", "Ligamentum teres", "Ligamentum venosum", "Median umbilical ligament"],
      correctAnswer: "Ligamentum arteriosum",
      explanation: "Postnatal closure of the ductus arteriosus forms the ligamentum arteriosum.",
      tags: ["embryology"],
    },
    {
      question: "Which cranial nerve carries parasympathetic fibers to the lacrimal gland?",
      options: ["CN III", "CN V", "CN VII", "CN IX"],
      correctAnswer: "CN VII",
      explanation: "Greater petrosal (CN VII) → pterygopalatine ganglion → lacrimal secretion.",
      tags: ["head/neck"],
    },
    {
      question: "The femoral nerve is primarily derived from which spinal segments?",
      options: ["L2–L4", "L4–S3", "S1–S3", "T12–L2"],
      correctAnswer: "L2–L4",
      explanation: "Femoral nerve (L2–L4) innervates quadriceps and hip flexors.",
      tags: ["lower limb"],
    },
    {
      question: "Which meniscus is more commonly torn in knee twisting injuries?",
      options: ["Medial meniscus", "Lateral meniscus", "Both equally", "Neither—patella only"],
      correctAnswer: "Medial meniscus",
      explanation: "Medial meniscus is tightly attached to the joint capsule and is injured more often.",
      tags: ["lower limb"],
    },
    {
      question: "The portal triad in the liver consists of:",
      options: [
        "Hepatic artery, portal vein, bile duct",
        "Hepatic vein, portal vein, bile duct",
        "Hepatic artery, hepatic vein, cystic duct",
        "Splenic artery, portal vein, gallbladder",
      ],
      correctAnswer: "Hepatic artery, portal vein, bile duct",
      explanation: "Portal triad: proper hepatic artery, portal vein, common bile duct (in hepatoduodenal ligament).",
      tags: ["abdomen"],
    },
    {
      question: "Which layer of the epidermis contains desmosomes prominent on histology?",
      options: ["Stratum basale", "Stratum spinosum", "Stratum granulosum", "Stratum corneum"],
      correctAnswer: "Stratum spinosum",
      explanation: "Desmosomes create the 'spiny' appearance of keratinocytes in stratum spinosum.",
      tags: ["histology"],
    },
    {
      question: "The carotid pulse is best palpated at the level of:",
      options: ["Cricoid cartilage", "Thyroid cartilage (C4)", "Hyoid bone", "C6 vertebral body"],
      correctAnswer: "Thyroid cartilage (C4)",
      explanation: "Common carotid bifurcation is near C4; clinical palpation taught at thyroid cartilage level.",
      tags: ["head/neck"],
    },
    {
      question: "Which bone articulates with the talus at the ankle mortise?",
      options: ["Calcaneus only", "Tibia and fibula", "Navicular", "Cuboid"],
      correctAnswer: "Tibia and fibula",
      explanation: "The ankle joint mortise is formed by the distal tibia, fibula, and trochlea of the talus.",
      tags: ["lower limb"],
    },
  ],
  physiology: [
    {
      question: "Which phase of the cardiac cycle has the lowest ventricular volume?",
      options: ["End-diastole", "Isovolumetric contraction", "End-systole", "Rapid filling"],
      correctAnswer: "End-systole",
      explanation: "End-systole marks minimum ventricular volume before diastolic filling.",
      tags: ["cardiovascular"],
    },
    {
      question: "ADH acts on the collecting duct primarily by inserting:",
      options: ["Na/K pumps", "Aquaporin-2 channels", "Cl channels only", "Bicarbonate exchangers"],
      correctAnswer: "Aquaporin-2 channels",
      explanation: "ADH (vasopressin) increases AQP2 insertion → water reabsorption.",
      tags: ["renal", "high-yield"],
    },
    {
      question: "The primary driver of alveolar ventilation increase during exercise is:",
      options: ["Hypoxemia alone", "Hypercapnia and metabolic acidosis", "Baroreceptor reset only", "Decreased pH of blood only"],
      correctAnswer: "Hypercapnia and metabolic acidosis",
      explanation: "CO2 and H+ from increased metabolism stimulate central/peripheral chemoreceptors.",
      tags: ["respiratory"],
    },
    {
      question: "Which hormone raises blood glucose via hepatic glycogenolysis?",
      options: ["Insulin", "Glucagon", "Somatostatin", "CCK"],
      correctAnswer: "Glucagon",
      explanation: "Glucagon activates hepatic glycogen phosphorylase.",
      tags: ["endocrine"],
    },
    {
      question: "The resting membrane potential of a typical neuron is closest to:",
      options: ["+30 mV", "0 mV", "-70 mV", "-120 mV"],
      correctAnswer: "-70 mV",
      explanation: "K+ permeability dominates at rest (~–70 mV).",
      tags: ["neuro"],
    },
    {
      question: "Which lung volume cannot be measured by simple spirometry alone?",
      options: ["Tidal volume", "Vital capacity", "Residual volume", "Inspiratory reserve volume"],
      correctAnswer: "Residual volume",
      explanation: "RV remains after maximal expiration; requires helium dilution or body plethysmography.",
      tags: ["respiratory"],
    },
    {
      question: "The Frank-Starling mechanism relates preload to:",
      options: ["Heart rate", "Stroke volume", "Systemic vascular resistance", "Coronary flow only"],
      correctAnswer: "Stroke volume",
      explanation: "Increased end-diastolic volume → increased sarcomere stretch → greater stroke volume.",
      tags: ["cardiovascular", "high-yield"],
    },
    {
      question: "In the nephron, most filtered glucose is reabsorbed in the:",
      options: ["Proximal tubule", "Loop of Henle", "Distal tubule", "Collecting duct"],
      correctAnswer: "Proximal tubule",
      explanation: "SGLT-mediated glucose reabsorption occurs mainly in the proximal convoluted tubule.",
      tags: ["renal"],
    },
  ],
  pathology: [
    {
      question: "Caseous necrosis is classically associated with:",
      options: ["Tuberculosis", "Acute pancreatitis", "Brain infarct", "Viral hepatitis"],
      correctAnswer: "Tuberculosis",
      explanation: "Granulomatous inflammation with caseous necrosis is classic for TB.",
      tags: ["inflammation", "high-yield"],
    },
    {
      question: "Reed-Sternberg cells are diagnostic of:",
      options: ["Hodgkin lymphoma", "Burkitt lymphoma", "Multiple myeloma", "AML"],
      correctAnswer: "Hodgkin lymphoma",
      explanation: "Owl-eye Reed-Sternberg cells define Hodgkin lymphoma.",
      tags: ["hematology"],
    },
    {
      question: "The most common cause of community-acquired pneumonia in adults is:",
      options: ["Streptococcus pneumoniae", "Mycoplasma only", "Legionella only", "Staph aureus"],
      correctAnswer: "Streptococcus pneumoniae",
      explanation: "S. pneumoniae remains a leading cause of CAP in adults.",
      tags: ["infectious"],
    },
    {
      question: "Amyloid deposits show which staining property?",
      options: ["Congo red with apple-green birefringence", "Prussian blue", "Sudan black only", "Gram positive"],
      correctAnswer: "Congo red with apple-green birefringence",
      explanation: "Amyloid binds Congo red and shows apple-green birefringence under polarized light.",
      tags: ["histology"],
    },
    {
      question: "Dysplasia is best defined as:",
      options: [
        "Reversible atrophy",
        "Disordered, precancerous cellular proliferation",
        "Acute inflammation",
        "Normal metaplasia only",
      ],
      correctAnswer: "Disordered, precancerous cellular proliferation",
      explanation: "Dysplasia = disordered maturation/architecture; may be reversible if stimulus removed.",
      tags: ["neoplasia"],
    },
    {
      question: "Anaplasia refers to:",
      options: ["Lack of differentiation", "Benign growth", "Chronic inflammation", "Fibrosis"],
      correctAnswer: "Lack of differentiation",
      explanation: "Anaplasia = undifferentiated, pleomorphic malignant cells.",
      tags: ["neoplasia"],
    },
  ],
  pharmacology: [
    {
      question: "Aspirin irreversibly inhibits:",
      options: ["COX-1 and COX-2", "Phospholipase A2 only", "5-lipoxygenase only", "Xanthine oxidase"],
      correctAnswer: "COX-1 and COX-2",
      explanation: "Aspirin acetylates COX enzymes irreversibly (especially COX-1 at low dose).",
      tags: ["NSAIDs"],
    },
    {
      question: "Warfarin inhibits synthesis of vitamin K-dependent factors:",
      options: ["II, VII, IX, X", "I, V, VIII only", "XII, XIII only", "All complement factors"],
      correctAnswer: "II, VII, IX, X",
      explanation: "Warfarin blocks epoxide reductase → ↓ II, VII, IX, X, protein C & S.",
      tags: ["anticoagulation", "high-yield"],
    },
    {
      question: "Metformin primarily lowers glucose by:",
      options: ["Increasing insulin secretion", "Decreasing hepatic gluconeogenesis", "Blocking SGLT2", "Stimulating glucagon"],
      correctAnswer: "Decreasing hepatic gluconeogenesis",
      explanation: "Metformin activates AMPK → ↓ hepatic glucose output.",
      tags: ["diabetes"],
    },
    {
      question: "Beta-blockers are contraindicated in acute asthma primarily because they:",
      options: ["Block β2-mediated bronchodilation", "Cause hyperkalemia", "Increase histamine", "Inhibit COX"],
      correctAnswer: "Block β2-mediated bronchodilation",
      explanation: "Non-selective β-blockade can worsen bronchospasm.",
      tags: ["respiratory"],
    },
    {
      question: "Organophosphate poisoning is treated with atropine plus:",
      options: ["Pralidoxime", "Naloxone", "Flumazenil", "Physostigmine"],
      correctAnswer: "Pralidoxime",
      explanation: "Atropine blocks muscarinic effects; pralidoxime reactivates acetylcholinesterase.",
      tags: ["toxicology"],
    },
    {
      question: "ACE inhibitors are contraindicated in pregnancy because they cause:",
      options: ["Renal agenesis/fetal injury", "Neural tube defects only", "Cleft palate only", "Hemolytic disease"],
      correctAnswer: "Renal agenesis/fetal injury",
      explanation: "ACEi/ARBs are teratogenic—fetal renal failure risk.",
      tags: ["high-yield"],
    },
  ],
  biochemistry: [
    {
      question: "The rate-limiting enzyme of glycolysis is:",
      options: ["Hexokinase", "Phosphofructokinase-1", "Pyruvate kinase", "Aldolase"],
      correctAnswer: "Phosphofructokinase-1",
      explanation: "PFK-1 is the main regulated step of glycolysis.",
      tags: ["metabolism"],
    },
    {
      question: "Von Gierke disease involves deficiency of:",
      options: ["Glucose-6-phosphatase", "Lysosomal acid maltase", "Muscle glycogen phosphorylase", "Debranching enzyme"],
      correctAnswer: "Glucose-6-phosphatase",
      explanation: "G6Pase deficiency → severe fasting hypoglycemia (type I GSD).",
      tags: ["genetics"],
    },
    {
      question: "The urea cycle occurs primarily in:",
      options: ["Liver", "Kidney", "Muscle", "Brain"],
      correctAnswer: "Liver",
      explanation: "Hepatocytes detoxify ammonia to urea via the urea cycle.",
      tags: ["metabolism"],
    },
    {
      question: "Statins inhibit which enzyme?",
      options: ["HMG-CoA reductase", "Acyl-CoA synthetase", "Lipoprotein lipase", "Cholesterol ester transfer protein"],
      correctAnswer: "HMG-CoA reductase",
      explanation: "Statins block the rate-limiting step of cholesterol synthesis.",
      tags: ["lipids"],
    },
  ],
  microbiology: [
    {
      question: "Staphylococcus aureus is classically:",
      options: ["Gram-positive cocci in clusters", "Gram-negative rods", "Acid-fast bacilli", "Spirochetes"],
      correctAnswer: "Gram-positive cocci in clusters",
      explanation: "Staph aureus: catalase-positive, coagulase-positive GPC in clusters.",
      tags: ["bacteriology"],
    },
    {
      question: "The Sabin vaccine is:",
      options: ["Oral live attenuated polio", "Inactivated IM polio", "Subunit hepatitis B", "Toxoid tetanus"],
      correctAnswer: "Oral live attenuated polio",
      explanation: "Sabin = oral polio vaccine (OPV); Salk = inactivated (IPV).",
      tags: ["immunology"],
    },
    {
      question: "Type III hypersensitivity is mediated by:",
      options: ["Immune complexes", "IgE only", "T cells only", "Complement deficiency only"],
      correctAnswer: "Immune complexes",
      explanation: "Immune complex deposition (e.g., serum sickness, some GN).",
      tags: ["immunology", "high-yield"],
    },
    {
      question: "HIV primarily infects:",
      options: ["CD4+ T cells", "Neutrophils", "Platelets", "B cells only"],
      correctAnswer: "CD4+ T cells",
      explanation: "gp120 binds CD4 and co-receptors on T cells/macrophages.",
      tags: ["virology"],
    },
  ],
  "internal-medicine": [
    {
      question: "First-line therapy for uncomplicated hypertension in many adults without comorbidities is:",
      options: ["Thiazide diuretic", "Loop diuretic only", "Alpha blocker only", "Central sympathomimetic"],
      correctAnswer: "Thiazide diuretic",
      explanation: "Guidelines often start with thiazide, CCB, ACEi, or ARB depending on context.",
      tags: ["cardiology"],
    },
    {
      question: "Kussmaul respirations suggest:",
      options: ["Metabolic acidosis", "Metabolic alkalosis", "Hyperventilation from anxiety only", "Opioid toxicity"],
      correctAnswer: "Metabolic acidosis",
      explanation: "Deep, rapid breathing compensates for metabolic acidosis (e.g., DKA).",
      tags: ["high-yield"],
    },
    {
      question: "The most sensitive test for diagnosing acute myocardial infarction early is:",
      options: ["Troponin", "CK-MB only", "LDH", "AST"],
      correctAnswer: "Troponin",
      explanation: "High-sensitivity troponin is cornerstone for NSTEMI/STEMI diagnosis.",
      tags: ["cardiology"],
    },
  ],
  cardiology: [
    {
      question: "ST elevation in leads II, III, and aVF suggests infarction of the:",
      options: ["Right coronary artery territory", "LAD territory", "Circumflex only", "Septal only"],
      correctAnswer: "Right coronary artery territory",
      explanation: "Inferior MI pattern: II, III, aVF (usually RCA in right-dominant circulation).",
      tags: ["ECG", "high-yield"],
    },
    {
      question: "Atrial fibrillation increases stroke risk primarily through:",
      options: ["Left atrial thrombus formation", "Ventricular fibrillation", "Aortic dissection", "Pulmonary embolism only"],
      correctAnswer: "Left atrial thrombus formation",
      explanation: "Stasis in the left atrium/appendage predisposes to thromboembolism.",
      tags: ["high-yield"],
    },
  ],
  neurology: [
    {
      question: "A lesion of the medial longitudinal fasciculus causes:",
      options: ["Internuclear ophthalmoplegia", "Homonymous hemianopia", "Facial droop only", "Cerebellar ataxia only"],
      correctAnswer: "Internuclear ophthalmoplegia",
      explanation: "MLF lesion → impaired adduction ipsilateral to lesion on lateral gaze.",
      tags: ["neuroanatomy"],
    },
    {
      question: "The most common cause of ischemic stroke is:",
      options: ["Cardioembolism", "Large artery atherosclerosis", "Lacunar small vessel disease", "Cryptogenic"],
      correctAnswer: "Large artery atherosclerosis",
      explanation: "Etiology varies by population; large-vessel atherosclerosis and cardioembolism are top causes.",
      tags: ["stroke"],
    },
  ],
  pediatrics: [
    {
      question: "The most common cause of neonatal jaundice in the first 24 hours is:",
      options: ["Hemolytic disease", "Physiologic jaundice", "Breast milk jaundice only", "Biliary atresia"],
      correctAnswer: "Hemolytic disease",
      explanation: "Jaundice within 24h is pathologic—consider hemolysis (Rh/ABO).",
      tags: ["neonatology", "high-yield"],
    },
    {
      question: "Epiglottitis is most commonly associated with:",
      options: ["H. influenzae type b", "RSV only", "Strep pyogenes only", "Adenovirus only"],
      correctAnswer: "H. influenzae type b",
      explanation: "Hib vaccination reduced incidence; still classic association.",
      tags: ["infectious"],
    },
  ],
};

const GENERAL_MEDICINE: BankItem[] = [
  {
    question: "The primary tissue type of tendons and ligaments is:",
    options: ["Dense regular connective tissue", "Loose areolar tissue", "Adipose tissue", "Reticular tissue"],
    correctAnswer: "Dense regular connective tissue",
    explanation: "Collagen fibers run parallel in dense regular CT (tendons/ligaments).",
    tags: ["histology"],
  },
  {
    question: "Which electrolyte abnormality is most associated with peaked T waves on ECG?",
    options: ["Hyperkalemia", "Hypokalemia", "Hypocalcemia", "Hypermagnesemia"],
    correctAnswer: "Hyperkalemia",
    explanation: "Severe hyperkalemia → peaked T waves, widened QRS, sine wave pattern.",
    tags: ["high-yield"],
  },
];

function bankItemToQuestion(item: BankItem, id: number): ExamQuestion {
  return toQuizletStyleQuestion({
    id,
    type: "multiple_choice",
    question: item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getBankQuestions(params: {
  field: string;
  subjectId: string;
  topic: string;
  count: number;
}): ExamQuestion[] {
  const meta = getFieldMeta(params.field);
  const fieldId = meta?.id ?? params.field.toLowerCase().replace(/\s+/g, "-");
  const subject = getFieldSubject(params.field, params.subjectId);
  const subjectKey = subject?.id ?? params.subjectId;

  const pools: BankItem[] = [];

  const tagWithSubject = (items: BankItem[], defaultSubject: string) =>
    items.map((i) => ({ ...i, subjectId: i.subjectId ?? defaultSubject }));

  if (fieldId === "medicine" && BANK[subjectKey]?.length) {
    pools.push(...tagWithSubject(BANK[subjectKey], subjectKey));
  } else if (fieldId === "medicine") {
    pools.push(...tagWithSubject(GENERAL_MEDICINE, subjectKey));
  }

  const fieldBank = FIELD_QUESTION_BANKS[fieldId] ?? [];
  for (const item of fieldBank) {
    if (item.subjectId === subjectKey) pools.push(item);
  }

  const topicLower = params.topic.toLowerCase();
  const strict = pools.filter(
    (item) =>
      item.subjectId === subjectKey ||
      (subject && subjectMatchesQuestion(subject, item.question, item.tags))
  );

  const ranked = strict.sort((a, b) => {
    const score = (item: BankItem) =>
      topicLower
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .filter((w) => (item.question + item.explanation).toLowerCase().includes(w)).length;
    return score(b) - score(a);
  });

  const unique = new Map<string, BankItem>();
  for (const item of ranked) unique.set(item.question.toLowerCase(), item);

  let pool = [...unique.values()];

  if (pool.length < params.count && subject) {
    const procedural = generateProceduralQuestions({
      field: params.field,
      subject,
      count: params.count - pool.length,
      existingQuestions: new Set(pool.map((p) => p.question.toLowerCase())),
    });
    pool = [...pool, ...procedural];
  }

  const selected = shuffle(pool).slice(0, params.count);

  while (selected.length < params.count && subject) {
    const more = generateProceduralQuestions({
      field: params.field,
      subject,
      count: params.count - selected.length,
      existingQuestions: new Set(selected.map((p) => p.question.toLowerCase())),
    });
    if (more.length === 0) break;
    for (const m of more) {
      if (selected.length >= params.count) break;
      const k = m.question.toLowerCase();
      if (!selected.some((s) => s.question.toLowerCase() === k)) selected.push(m);
    }
  }

  return selected.map((item, i) => bankItemToQuestion(item, i + 1));
}

export function buildOfflineExam(params: {
  field: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  subjectArea?: string;
  subjectId?: string;
  medicineMode?: boolean;
}): GeneratedExam {
  const subjectId = params.subjectId ?? params.subjectArea ?? "";
  const questions = getBankQuestions({
    field: params.field,
    subjectId,
    topic: params.topic,
    count: params.questionCount,
  });

  const subject = getFieldSubject(params.field, subjectId);

  return {
    title: `${params.topic} — ${params.field} Practice`,
    field: params.field,
    topic: params.topic,
    sourcesReviewed: params.sources.length,
    studyNotes: `${questions.length} ${subject?.label ?? params.topic} questions (${subject?.textbookRefs}). Select an answer, then check.`,
    questions,
  };
}
