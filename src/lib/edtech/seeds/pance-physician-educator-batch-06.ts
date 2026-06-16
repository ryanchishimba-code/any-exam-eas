/** PANCE neurologic + psychiatry — physician-educator batch 06. */
import { panceVignette } from "@/lib/exam-prep/pance-seed-factory";

const BATCH = "physician-educator-batch-06";
const PE = ["physician-educator", BATCH, "pance", "pance-seed", "PANCE-2025"];

export const PANCE_PHYSICIAN_EDUCATOR_BATCH_06 = [
  panceVignette(
    "neurologic",
    `A 34-year-old woman presents with the worst headache of her life, sudden onset, associated with vomiting. BP 168/98 mm Hg, HR 104/min. Neck stiffness is present. CT head without contrast shows subarachnoid blood.`,
    "What is the most appropriate next step in management?",
    [
      "Neurosurgical consultation and blood pressure control",
      "Lumbar puncture to confirm diagnosis",
      "Oral sumatriptan and discharge",
      "MRI brain in 2 weeks",
    ],
    "Neurosurgical consultation and blood pressure control",
    `CT-confirmed subarachnoid hemorrhage requires neurosurgical evaluation for aneurysm securing and BP management — LP is unnecessary when CT is positive. Triptans treat migraine, not SAH.`,
    {
      blueprintSystem: "neurologic",
      taskCategory: "intervention",
      blueprintTopic: "headache",
      difficulty: 5,
      tags: ["SAH", ...PE],
    }
  ),
  panceVignette(
    "neurologic",
    `A 25-year-old man is brought in after a generalized tonic-clonic seizure lasting 2 minutes, now alert. No prior seizures. Blood glucose 98 mg/dL. He is afebrile and neurologically nonfocal.`,
    "What is the most appropriate next step?",
    [
      "EEG and MRI brain as outpatient workup; counsel on driving restrictions",
      "Start phenytoin loading dose immediately",
      "Lumbar puncture in the ED",
      "Discharge without follow-up",
    ],
    "EEG and MRI brain as outpatient workup; counsel on driving restrictions",
    `First unprovoked seizure in a stable patient warrants outpatient EEG/MRI and safety counseling — not automatic chronic antiepileptic therapy after a single event. LP is for suspected meningitis/encephalitis.`,
    {
      blueprintSystem: "neurologic",
      taskCategory: "labs",
      blueprintTopic: "seizure",
      difficulty: 3,
      tags: ["seizure", ...PE],
    }
  ),
  panceVignette(
    "neurologic",
    `A 40-year-old woman has 3 days of progressive bilateral leg weakness and urinary retention. BP 128/82 mm Hg, HR 88/min. Exam shows decreased sensation below T10 and hyperreflexia in the lower extremities. MRI spine shows T2 hyperintensity from T8–T11.`,
    "What is the most likely diagnosis?",
    [
      "Transverse myelitis",
      "Guillain-Barré syndrome",
      "Cauda equina syndrome from disc herniation",
      "Peripheral neuropathy",
    ],
    "Transverse myelitis",
    `Acute bilateral weakness with sensory level and UMN signs localizes to spinal cord — transverse myelitis on MRI. GBS is ascending weakness with areflexia. Cauda equina causes LMN signs and saddle anesthesia.`,
    {
      blueprintSystem: "neurologic",
      taskCategory: "diagnosis",
      blueprintTopic: "MS",
      difficulty: 4,
      tags: ["myelitis", ...PE],
      related: { reviewModuleSlug: "acute-ischemic-stroke" },
    }
  ),
  panceVignette(
    "psychiatry",
    `A 42-year-old man presents with 6 weeks of depressed mood, insomnia, poor appetite, and inability to concentrate. He denies suicidal ideation. PHQ-9 score is 16. BP 122/78 mm Hg. No medical comorbidities.`,
    "What is the most appropriate initial treatment?",
    [
      "SSRI plus psychotherapy referral",
      "Lithium monotherapy",
      "Benzodiazepine daily",
      "Electroconvulsive therapy",
    ],
    "SSRI plus psychotherapy referral",
    `Moderate major depression (PHQ-9 ≥15) is first-line treated with SSRI and therapy. Lithium is for bipolar disorder. Daily benzodiazepines are not antidepressants. ECT is for severe/refractory or psychotic depression.`,
    {
      blueprintSystem: "psychiatry",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "depression",
      difficulty: 3,
      tags: ["depression", ...PE],
    }
  ),
  panceVignette(
    "psychiatry",
    `A 19-year-old college student presents with 5 days of decreased sleep, pressured speech, grandiose ideas, and risky spending. BP 132/84 mm Hg, HR 96/min. No substance use. She is alert and oriented.`,
    "What is the most appropriate initial pharmacotherapy?",
    [
      "Mood stabilizer such as valproate or atypical antipsychotic",
      "SSRI monotherapy",
      "Cholinesterase inhibitor",
      "Stimulant augmentation",
    ],
    "Mood stabilizer such as valproate or atypical antipsychotic",
    `Acute mania requires mood stabilizer or atypical antipsychotic — SSRIs alone can worsen mania. Stimulants are contraindicated. Cholinesterase inhibitors treat dementia.`,
    {
      blueprintSystem: "psychiatry",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "bipolar",
      difficulty: 4,
      tags: ["mania", ...PE],
    }
  ),
  panceVignette(
    "psychiatry",
    `A 55-year-old man with alcohol use disorder presents with tremor, diaphoresis, and visual hallucinations 18 hours after his last drink. BP 162/98 mm Hg, HR 112/min.`,
    "What is the most appropriate initial management?",
    [
      "Benzodiazepines (e.g. lorazepam) with thiamine before glucose",
      "Disulfiram loading dose",
      "Haloperidol monotherapy without benzodiazepine",
      "Observation only",
    ],
    "Benzodiazepines (e.g. lorazepam) with thiamine before glucose",
    `Alcohol withdrawal with autonomic hyperactivity and hallucinations requires benzodiazepines to prevent seizures/delirium tremens; thiamine before glucose prevents Wernicke. Haloperidol alone does not prevent seizures. Disulfiram is for abstinence maintenance, not acute withdrawal.`,
    {
      blueprintSystem: "psychiatry",
      taskCategory: "intervention",
      blueprintTopic: "substance use",
      difficulty: 4,
      tags: ["alcohol-withdrawal", ...PE],
    }
  ),
  panceVignette(
    "psychiatry",
    `A 28-year-old woman reports intrusive thoughts of harming her newborn and avoids being alone with the baby. She has no plan to act and is distressed by the thoughts. BP 118/72 mm Hg, HR 80/min. Mood is euthymic.`,
    "What is the most likely diagnosis?",
    [
      "Postpartum obsessive-compulsive disorder",
      "Postpartum psychosis",
      "Normal new-parent anxiety requiring no intervention",
      "Munchausen syndrome by proxy",
    ],
    "Postpartum obsessive-compulsive disorder",
    `Ego-dystonic intrusive harm thoughts without intent or psychosis suggests postpartum OCD — treat with SSRI/CBT. Postpartum psychosis includes delusions, disorganization, and high suicide/infanticide risk. Normal anxiety lacks intrusive obsessions.`,
    {
      blueprintSystem: "psychiatry",
      taskCategory: "diagnosis",
      blueprintTopic: "anxiety",
      difficulty: 4,
      tags: ["postpartum", "OCD", ...PE],
    }
  ),
  panceVignette(
    "neurologic",
    `A 60-year-old man with type 2 diabetes reports burning pain and numbness in both feet for 6 months, worse at night. HbA1c 9.2%. Exam shows decreased vibration sense and absent ankle reflexes.`,
    "What is the most appropriate initial treatment for his symptoms?",
    [
      "Gabapentin or pregabalin",
      "High-dose oral corticosteroids",
      "Immediate surgical decompression",
      "Opioid monotherapy",
    ],
    "Gabapentin or pregabalin",
    `Painful diabetic peripheral neuropathy is first-line treated with gabapentinoids or SNRIs/TCAs — optimize glycemic control concurrently. Steroids do not treat chronic DSPN. Surgery is not indicated without focal compression.`,
    {
      blueprintSystem: "neurologic",
      taskCategory: "pharmacotherapy",
      blueprintTopic: "neuropathy",
      difficulty: 3,
      tags: ["neuropathy", "diabetes", ...PE],
    }
  ),
];
