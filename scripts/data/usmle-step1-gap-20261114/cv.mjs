/** Step 1 gap batch — cardiovascular (18): 3 easy, 5 medium, 10 hard. */
export const CV_ITEMS = [
  {
    slug: "cv-01",
    domain: "cardiovascular",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "valvular-disease-mechanisms",
    citationTitle: "Aortic Stenosis",
    scenario:
      "A 76-year-old man has exertional syncope and chest pressure. A harsh crescendo-decrescendo systolic murmur radiates to both carotids. The carotid upstroke is delayed and low in amplitude. The second heart sound is soft. Echocardiography shows a calcified aortic valve with a small orifice and a normal mitral valve.",
    question: "Why does he lose consciousness on exertion?",
    options: [
      "Cardiac output cannot rise across a fixed outflow orifice",
      "Left atrial pressure falls and coronary filling collapses",
      "An abrupt drop in systemic vascular resistance opens a shunt",
      "Ventricular filling is halted by a tense pericardial sac",
      "The mitral valve prolapses and stroke volume suddenly doubles",
    ],
    correctAnswer: "Cardiac output cannot rise across a fixed outflow orifice",
    explanation: `## Why this answer is correct
Calcific aortic stenosis fixes the outflow orifice. Skeletal muscle vasodilation during exercise lowers systemic resistance, but stroke volume cannot increase through the stenotic valve, so arterial pressure falls and cerebral perfusion fails. The slow, low carotid pulse and soft S2 match severe stenosis.

## Why the other options are wrong
**Left atrial pressure falls and coronary filling collapses**
Left atrial pressure rises, rather than falls, when a stiff left ventricle backs up. Syncope in stenosis is an output problem, not a fall in atrial pressure.

**An abrupt drop in systemic vascular resistance opens a shunt**
There is no septal defect. The murmur is an ejection murmur into the carotids, not a shunt murmur.

**Ventricular filling is halted by a tense pericardial sac**
Tamponade causes distant hearts sounds, pulsus paradoxus, and elevated venous pressure, not a carotid-radiating ejection murmur.

**The mitral valve prolapses and stroke volume suddenly doubles**
Mitral prolapse is a mid-systolic click, and doubling stroke volume would raise, not drop, cerebral blood flow.`,
  },
  {
    slug: "cv-02",
    domain: "cardiovascular",
    band: "easy",
    difficulty: 2,
    subjectId: "pathology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "valvular-disease-mechanisms",
    citationTitle: "Mitral Stenosis",
    scenario:
      "A 38-year-old woman who had rheumatic fever as a child has dyspnea and new palpitations. A loud S1 and an opening snap are followed by a diastolic rumble at the apex. The snap moves closer to S2 as symptoms worsen. ECG shows atrial fibrillation. The aortic valve is not calcified.",
    question: "Why does the opening snap move closer to the second heart sound?",
    options: [
      "Higher left atrial pressure opens the valve earlier in diastole",
      "Left ventricular pressure stays high and delays the mitral opening",
      "Pulmonary valve closure is delayed by a right bundle delay",
      "Aortic closure becomes earlier because forward flow falls",
      "Pericardial constraint shortens the interval after S2",
    ],
    correctAnswer: "Higher left atrial pressure opens the valve earlier in diastole",
    explanation: `## Why this answer is correct
The mitral valve opens when ventricular pressure falls below atrial pressure. As stenosis worsens, left atrial pressure is higher, so that crossover happens sooner after aortic closure and the A2–opening snap interval shortens. Chronic rheumatic scarring is the usual cause of this lesion, and the enlarged atrium fibrillates.

## Why the other options are wrong
**Left ventricular pressure stays high and delays the mitral opening**
A higher ventricular diastolic pressure would delay opening and lengthen the A2–snap interval. The interval here is shortening.

**Pulmonary valve closure is delayed by a right bundle delay**
A split S2 from delayed P2 is a right-ventricular conduction or volume phenomenon. It does not time an apical opening snap.

**Aortic closure becomes earlier because forward flow falls**
The interval change is produced by earlier mitral opening from high atrial pressure, not by an earlier aortic closure alone.

**Pericardial constraint shortens the interval after S2**
Constrictive pericarditis causes a knock from abrupt cessation of filling. It is not an opening snap of a rheumatic mitral valve.`,
  },
  {
    slug: "cv-03",
    domain: "cardiovascular",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "congenital-heart",
    citationTitle: "Atrial Septal Defect",
    scenario:
      "A 21-year-old woman is told she has a murmur. S2 splits on both inspiration and expiration, and the split interval does not change with the respiratory cycle. A systolic murmur is heard at the upper left sternal border. Echocardiography shows a secundum atrial communication and right-ventricular enlargement. She is acyanotic.",
    question: "Why is splitting of S2 fixed across the respiratory cycle?",
    options: [
      "The atrial communication equalizes respiratory flow swings",
      "The aortic valve stays open longer than the pulmonary valve",
      "Left-bundle conduction delays aortic valve closure",
      "Pulmonary stenosis delays P2 more during inspiration",
      "A ventricular septal defect equalizes ventricular pressures",
    ],
    correctAnswer: "The atrial communication equalizes respiratory flow swings",
    explanation: `## Why this answer is correct
Inspiration normally increases right venous return and delays P2. An atrial septal defect lets the two atria share that extra volume, so right-ventricular stroke volume, and therefore the split, stays wide in both phases of respiration. The pulmonary flow murmur and right-ventricular enlargement follow the left-to-right atrial shunt.

## Why the other options are wrong
**The aortic valve stays open longer than the pulmonary valve**
In an atrial septal defect, pulmonary closure is delayed relative to aortic closure. Aortic closure is not the delayed sound.

**Left-bundle conduction delays aortic valve closure**
Left bundle branch block delays A2 and can reverse splitting. Splitting still varies with respiration unless an atrial communication is present.

**Pulmonary stenosis delays P2 more during inspiration**
Pulmonary stenosis widens splitting, and the width still changes with respiration. Fixed splitting is the atrial-level communication.

**A ventricular septal defect equalizes ventricular pressures**
A ventricular septal defect causes a holosystolic murmur and does not fix the respiratory movement of S2.`,
  },
  {
    slug: "cv-04",
    domain: "cardiovascular",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "congenital-heart",
    citationTitle: "Ventricular Septal Defect",
    scenario:
      "A 19-year-old man who had a large ventricular septal defect as a child now has cyanosis and clubbing. The holosystolic murmur has become soft. Cardiac catheterization shows pulmonary vascular resistance higher than systemic vascular resistance, and oximetry shows right-to-left flow at the ventricular level. Chest imaging shows enlarged central pulmonary arteries.",
    question: "What change reversed the direction of the shunt?",
    options: [
      "Pulmonary arteriolar resistance rose above systemic resistance",
      "Systemic resistance rose and forced more left-to-right flow",
      "The septal defect closed and flow crossed an atrial septum",
      "Aortic pressure fell below right atrial pressure",
      "Left ventricular compliance suddenly exceeded right compliance",
    ],
    correctAnswer: "Pulmonary arteriolar resistance rose above systemic resistance",
    explanation: `## Why this answer is correct
A large ventricular septal defect exposes the pulmonary arteries to systemic pressure. Over years the arterioles remodel, pulmonary resistance climbs, and when it exceeds systemic resistance the shunt reverses. Cyanosis at that point is Eisenmenger physiology, and the murmur softens because the pressure gradient across the defect shrinks.

## Why the other options are wrong
**Systemic resistance rose and forced more left-to-right flow**
Higher systemic resistance would favor left-to-right flow. This patient has right-to-left flow and cyanosis.

**The septal defect closed and flow crossed an atrial septum**
Catheterization still shows flow at the ventricular level. The defect did not close.

**Aortic pressure fell below right atrial pressure**
The measured reversal is between the ventricles, and pulmonary resistance, not aortic pressure falling below atrial pressure, is the driver.

**Left ventricular compliance suddenly exceeded right compliance**
Compliance differences govern diastolic filling. The shunt reversal here is a systolic phenomenon driven by pulmonary vascular resistance.`,
  },
  {
    slug: "cv-05",
    domain: "cardiovascular",
    band: "medium",
    difficulty: 3,
    subjectId: "pharmacology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "congenital-heart",
    citationTitle: "Patent Ductus Arteriosus",
    scenario:
      "A premature infant has a continuous murmur, bounding pulses, and pulmonary edema. Echocardiography shows a patent ductus arteriosus with left-to-right flow. A cyclooxygenase inhibitor is given, and the murmur disappears over the next day. Prostaglandin E1 had not been infused.",
    question: "Why did the cyclooxygenase inhibitor close the ductus?",
    options: [
      "It lowered prostaglandin E2 that was keeping the ductus open",
      "It raised prostaglandin E1 and dilated the ductus smooth muscle",
      "It blocked beta-1 receptors and slowed ductal flow",
      "It inhibited angiotensin II formation in the ductal wall",
      "It antagonized endothelin so the vessel could fibrose",
    ],
    correctAnswer: "It lowered prostaglandin E2 that was keeping the ductus open",
    explanation: `## Why this answer is correct
Patency of the ductus is maintained by prostaglandin E2 acting on ductal smooth muscle. Indomethacin or ibuprofen inhibits cyclooxygenase, lowers prostaglandin E2, and allows the ductus to constrict. That is the desired effect when a premature infant has a hemodynamically significant left-to-right ductal shunt.

## Why the other options are wrong
**It raised prostaglandin E1 and dilated the ductus smooth muscle**
Prostaglandin E1 infusion (alprostadil) keeps a ductus open. A cyclooxygenase inhibitor does the opposite.

**It blocked beta-1 receptors and slowed ductal flow**
Beta blockade slows heart rate. It does not remove the prostaglandin that holds the ductus open.

**It inhibited angiotensin II formation in the ductal wall**
ACE inhibition is not the mechanism of ductal closure in neonates.

**It antagonized endothelin so the vessel could fibrose**
Endothelin antagonism is a pulmonary-hypertension strategy. Ductal closure after a cyclooxygenase inhibitor is prostaglandin withdrawal.`,
  },
  {
    slug: "cv-06",
    domain: "cardiovascular",
    band: "medium",
    difficulty: 3,
    subjectId: "physiology",
    blueprintTopic: "valvular-disease-mechanisms",
    topicCategory: "congenital-heart",
    citationTitle: "Tetralogy of Fallot",
    scenario:
      "A 6-month-old boy with a known ventricular septal defect, right-ventricular outflow narrowing, and an overriding aorta has a hypercyanotic spell while crying. He is placed in a knee-chest position and the cyanosis lessens. A loud systolic murmur from the outflow tract is present between spells.",
    question: "Why does the knee-chest position improve his color?",
    options: [
      "Higher systemic resistance sends more blood to the lungs",
      "Lower systemic resistance increases right-to-left ventricular flow",
      "Pulmonary resistance rises and closes the outflow tract",
      "Heart rate falls and aortic override disappears",
      "Venous return stops and right-ventricular pressure collapses",
    ],
    correctAnswer: "Higher systemic resistance sends more blood to the lungs",
    explanation: `## Why this answer is correct
In tetralogy, the ventricular septal defect and the obstructed right-ventricular outflow compete. Knee-chest posture compresses the femoral arteries and raises systemic vascular resistance, so a larger share of right-ventricular blood crosses the outflow tract into the lungs instead of shunting into the aorta. Cyanosis decreases.

## Why the other options are wrong
**Lower systemic resistance increases right-to-left ventricular flow**
Lower systemic resistance is what worsens a spell. The posture raises resistance.

**Pulmonary resistance rises and closes the outflow tract**
Raising pulmonary resistance would worsen right-to-left shunting. The useful change is on the systemic side of the defect.

**Heart rate falls and aortic override disappears**
Aortic override is an anatomic relationship. Position does not remove it, and the benefit is hemodynamic.

**Venous return stops and right-ventricular pressure collapses**
Knee-chest position does not stop venous return. It changes the systemic resistance that the shunt faces.`,
  },
  {
    slug: "cv-07",
    domain: "cardiovascular",
    band: "medium",
    difficulty: 3,
    subjectId: "anatomy",
    blueprintTopic: "hypertension-mechanisms",
    topicCategory: "congenital-heart",
    citationTitle: "Coarctation of the Aorta",
    scenario:
      "A 15-year-old girl with short stature, a webbed neck, and widely spaced nipples has headaches and calf pain when she runs. Blood pressure is 164/98 mm Hg in the right arm and 96/64 mm Hg in the leg. The femoral pulse is delayed. A chest radiograph shows notches along the undersurface of several ribs. Echocardiography shows a bicuspid aortic valve and a narrowing just beyond the left subclavian artery.",
    question: "What produced the notches along the ribs?",
    options: [
      "Dilated intercostal arteries collateralizing around the coarctation",
      "Erosions from enlarged intercostal nerves in neurofibromatosis type 1",
      "Pulsatile pulmonary arteries rubbing the upper rib margins",
      "Venous collaterals from superior vena cava obstruction",
      "Osteolytic metastases in the posterior rib cortex",
    ],
    correctAnswer: "Dilated intercostal arteries collateralizing around the coarctation",
    explanation: `## Why this answer is correct
A juxtaductal aortic narrowing drops pressure distal to the lesion. Blood reaches the descending aorta through internal thoracic and intercostal collateral arteries. Those enlarged, pulsatile intercostal arteries erode the undersurface of the ribs. A bicuspid aortic valve commonly accompanies coarctation, and arm hypertension with delayed femoral pulses is the bedside clue.

## Why the other options are wrong
**Erosions from enlarged intercostal nerves in neurofibromatosis type 1**
Neurofibromatosis can notch ribs by nerve tumors. It does not create this arm-leg pressure gradient or a bicuspid aortic valve.

**Pulsatile pulmonary arteries rubbing the upper rib margins**
Pulmonary arteries do not groove the inferior rib margins. The vessels that do are intercostal collaterals.

**Venous collaterals from superior vena cava obstruction**
Superior vena cava obstruction dilates chest-wall veins. It does not notch ribs or delay the femoral pulse.

**Osteolytic metastases in the posterior rib cortex**
Metastases destroy bone irregularly and do not follow a bilateral inferior pattern tied to a coarctation pressure gradient.`,
  },
  {
    slug: "cv-08",
    domain: "cardiovascular",
    band: "medium",
    difficulty: 3,
    subjectId: "physiology",
    blueprintTopic: "heart-failure-pathophysiology",
    topicCategory: "hypertrophic-cardiomyopathy",
    citationTitle: "Hypertrophic Cardiomyopathy",
    scenario:
      "A 20-year-old man has a systolic murmur at the left sternal border that becomes louder when he stands and during Valsalva. Handgrip makes the murmur softer. Echocardiography shows asymmetric septal hypertrophy and systolic anterior motion of the mitral valve. His father died suddenly while playing basketball.",
    question: "Why does handgrip soften the murmur?",
    options: [
      "Higher afterload widens the outflow tract and shrinks the gradient",
      "Lower preload pulls the septum into the outflow tract",
      "Faster heart rate shortens diastole and stiffens the ventricular wall",
      "Increased venous return dilates the right ventricle",
      "Handgrip closes the aortic valve earlier in systole",
    ],
    correctAnswer: "Higher afterload widens the outflow tract and shrinks the gradient",
    explanation: `## Why this answer is correct
Dynamic left-ventricular outflow obstruction worsens when the chamber is small. Handgrip raises systemic arterial pressure, so the left ventricle faces a higher afterload, cavity size is better maintained, the hypertrophied septum and anterior mitral leaflet crowd the tract less, and the gradient and murmur decrease.

## Why the other options are wrong
**Lower preload pulls the septum into the outflow tract**
Lower preload (standing, Valsalva strain) makes this murmur louder, which is the opposite of the handgrip effect.

**Faster heart rate shortens diastole and stiffens the ventricular wall**
Tachycardia can worsen obstruction, but the maneuver in question is isometric handgrip, and the murmur got softer.

**Increased venous return dilates the right ventricle**
Handgrip is an afterload maneuver. Right-ventricular dilation is not what reduces a left-outflow gradient.

**Handgrip closes the aortic valve earlier in systole**
The murmur change is from a smaller dynamic gradient, not from earlier aortic closure.`,
  },
  {
    slug: "cv-09",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "acs-pathophysiology",
    topicCategory: "acs-pathophysiology",
    citationTitle: "Papillary Muscle Rupture",
    scenario:
      "A 64-year-old man has an inferior ST-elevation myocardial infarction treated on day 1. On day 4 he suddenly becomes dyspneic. A new holosystolic murmur is heard at the apex and radiates to the left axilla. Pulmonary edema is severe, and the cardiac index is low. The inferior wall is akinetic. There is no pericardial effusion.",
    question: "Why is the posteromedial papillary muscle the one that ruptured?",
    options: [
      "It is perfused by one coronary artery, usually the right coronary",
      "It is perfused by both the anterior descending and circumflex arteries",
      "It is supplied by thebesian veins rather than a coronary artery",
      "It attaches to the tricuspid valve and faces the right ventricle",
      "It lies in the atrial wall and is fed by the sinus-node artery",
    ],
    correctAnswer: "It is perfused by one coronary artery, usually the right coronary",
    explanation: `## Why this answer is correct
The posteromedial papillary muscle usually receives blood from the posterior descending artery alone, which comes from the right coronary artery in a right-dominant circulation. An inferior infarct can therefore necrose that entire muscle. Rupture a few days later produces acute severe mitral regurgitation, a holosystolic murmur, and pulmonary edema without a pericardial effusion.

## Why the other options are wrong
**It is perfused by both the anterior descending and circumflex arteries**
Dual supply describes the anterolateral papillary muscle, which is less often ruptured by a single coronary occlusion.

**It is supplied by thebesian veins rather than a coronary artery**
Thebesian veins are small cardiac venous channels. Papillary muscles are arterial territories.

**It attaches to the tricuspid valve and faces the right ventricle**
The posteromedial papillary muscle of the left ventricle anchors mitral chordae. Tricuspid papillary muscles are right-sided and would not send a murmur to the axilla with pulmonary edema.

**It lies in the atrial wall and is fed by the sinus-node artery**
The sinus-node artery supplies the sinus node. The ruptured structure is ventricular papillary muscle.`,
  },
];
