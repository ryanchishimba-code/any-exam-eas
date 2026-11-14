/** Reproductive-endocrine (11): 2 easy, 3 medium, 6 hard. */
export const REPRO_ITEMS = [
  {
    slug: "re-01",
    domain: "reproductive-endocrine",
    band: "easy",
    difficulty: 2,
    subjectId: "biochemistry",
    blueprintTopic: "adrenal-disorders",
    topicCategory: "adrenal-disorders",
    citationTitle: "Congenital Adrenal Hyperplasia",
    scenario:
      "A 5-year-old girl is brought in during a vomiting illness with blood pressure 78/46 mm Hg. She has had pubic hair and a growth spurt since age 3. Sodium is 122 mEq/L, potassium is 6.6 mEq/L, and 17-hydroxyprogesterone is markedly elevated. Cortisol is low. Blood pressure recovers after glucocorticoid and mineralocorticoid replacement. She has never been hypertensive.",
    question: "Which enzyme block explains the salt loss and the virilization?",
    options: [
      "21-hydroxylase, shunting precursors into adrenal androgens",
      "11-beta-hydroxylase, with mineralocorticoid buildup and hypertension",
      "17-alpha-hydroxylase, blocking both cortisol and sex steroids",
      "Aromatase, blocking conversion of androgens to estrogens",
      "5-alpha-reductase, blocking dihydrotestosterone in genital skin",
    ],
    correctAnswer: "21-hydroxylase, shunting precursors into adrenal androgens",
    explanation: `## Why this answer is correct
21-hydroxylase is required for cortisol and for aldosterone. Its loss raises 17-hydroxyprogesterone, diverts precursors into androgen synthesis (virilized genetic female), and removes mineralocorticoid activity (hyponatremia, hyperkalemia, hypotension). Glucocorticoid replacement also suppresses the ACTH drive.

## Why the other options are wrong
**11-beta-hydroxylase, with mineralocorticoid buildup and hypertension**
11-beta-hydroxylase deficiency also virilizes, but deoxycorticosterone accumulates and causes hypertension with hypokalemia. This child is hypotensive and hyperkalemic.

**17-alpha-hydroxylase, blocking both cortisol and sex steroids**
17-alpha-hydroxylase deficiency prevents sex-steroid synthesis, so genetic females do not virilize, and mineralocorticoid excess causes hypertension.

**Aromatase, blocking conversion of androgens to estrogens**
Aromatase deficiency virilizes a female fetus but does not cause neonatal salt-wasting or a high 17-hydroxyprogesterone.

**5-alpha-reductase, blocking dihydrotestosterone in genital skin**
5-alpha-reductase deficiency under-virilizes a genetic male. It does not virilize a genetic female or disturb sodium and potassium.`,
  },
  {
    slug: "re-02",
    domain: "reproductive-endocrine",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "thyroid-disorders",
    topicCategory: "thyroid-disorders",
    citationTitle: "Graves Disease",
    scenario:
      "A 32-year-old woman has weight loss, tremor, and heat intolerance. The thyroid is diffusely enlarged with a bruit. Heart rate is 118/min. TSH is suppressed, free T4 is high, and radioactive iodine uptake is high and diffuse. She has eyelid retraction, proptosis, and thickened skin over the shins. A stimulating antibody against the TSH receptor is present.",
    question: "How is thyroid hormone production being driven?",
    options: [
      "An IgG antibody activates the TSH receptor on follicular cells",
      "Pituitary TSH secretion is increased by a pituitary adenoma",
      "Dietary iodine deficiency raises TSH and enlarges the gland",
      "Destruction of follicles releases stored hormone for a few weeks",
      "Exogenous thyroxine suppresses uptake of radioactive iodine",
    ],
    correctAnswer: "An IgG antibody activates the TSH receptor on follicular cells",
    explanation: `## Why this answer is correct
In Graves disease an IgG antibody binds and activates the TSH receptor, so follicles make hormone and take up iodine even though pituitary TSH is suppressed by negative feedback. The same autoimmune process produces ophthalmopathy and pretibial myxedema. Diffuse high uptake distinguishes this stimulation from gland destruction or exogenous hormone.

## Why the other options are wrong
**Pituitary TSH secretion is increased by a pituitary adenoma**
A TSH-secreting adenoma would raise TSH along with T4. TSH here is suppressed.

**Dietary iodine deficiency raises TSH and enlarges the gland**
Iodine deficiency causes hypothyroidism with a high TSH, not thyrotoxicosis with a suppressed TSH.

**Destruction of follicles releases stored hormone for a few weeks**
Silent or subacute thyroiditis can release stored hormone, but radioactive iodine uptake is low because the gland is injured, not stimulated.

**Exogenous thyroxine suppresses uptake of radioactive iodine**
Factitious thyroxine suppresses TSH and also suppresses iodine uptake. Uptake here is high, and the eye and skin findings are not produced by ingested hormone.`,
  },
  {
    slug: "re-03",
    domain: "reproductive-endocrine",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "thyroid-disorders",
    topicCategory: "thyroid-disorders",
    citationTitle: "Hashimoto Thyroiditis",
    scenario:
      "A 45-year-old woman has fatigue, cold intolerance, and a rubbery goiter. TSH is high and free T4 is low. Antithyroid peroxidase antibodies are present. Biopsy shows Hürthle cells and a lymphoplasmacytic infiltrate with germinal centers. She had a brief hyperthyroid phase three months ago that resolved without surgery.",
    question: "What process destroyed hormone production?",
    options: [
      "T-cell injury of follicles with later fibrosis of the gland",
      "A stimulating antibody driving unregulated hormone synthesis",
      "Granulomatous inflammation after a viral illness, with a tender gland",
      "A parafollicular-cell tumor secreting calcitonin",
      "Iodine trapping by a single hyperfunctioning nodule",
    ],
    correctAnswer: "T-cell injury of follicles with later fibrosis of the gland",
    explanation: `## Why this answer is correct
Hashimoto thyroiditis is T-cell-mediated destruction of thyroid follicles, with germinal centers and oncocytic (Hürthle) metaplasia. Stored hormone may leak early and cause a transient thyrotoxic phase, but the durable result is hypothyroidism with a high TSH. Antithyroid peroxidase antibodies mark the autoimmune attack.

## Why the other options are wrong
**A stimulating antibody driving unregulated hormone synthesis**
That is Graves disease, which suppresses TSH and increases iodine uptake. This patient is hypothyroid.

**Granulomatous inflammation after a viral illness, with a tender gland**
Subacute granulomatous thyroiditis is painful and follows a viral prodrome. The gland here is rubbery and painless, with germinal centers rather than granulomas.

**A parafollicular-cell tumor secreting calcitonin**
Medullary carcinoma arises from C cells and secretes calcitonin. It does not produce this diffuse lymphocytic hypothyroidism.

**Iodine trapping by a single hyperfunctioning nodule**
A toxic nodule causes hyperthyroidism with high uptake in one focus and a suppressed TSH.`,
  },
  {
    slug: "re-04",
    domain: "reproductive-endocrine",
    band: "medium",
    difficulty: 3,
    subjectId: "physiology",
    blueprintTopic: "pcos-endocrine",
    topicCategory: "pcos-endocrine",
    citationTitle: "Secondary Amenorrhea",
    scenario:
      "A 24-year-old woman has oligomenorrhea, infertility, and acne. BMI is 34 kg/m2. Fasting glucose is 112 mg/dL and fasting insulin is high. LH is high relative to FSH. Total testosterone is mildly elevated. Ovaries are enlarged with many small peripheral follicles. She is not pregnant, and 17-hydroxyprogesterone is normal.",
    question: "Which ovarian-cell change produces the androgen excess?",
    options: [
      "LH-stimulated theca cells overproduce androstenedione",
      "FSH-stimulated granulosa cells overproduce estradiol",
      "Corpus luteum progesterone secretion is prolonged",
      "Adrenal 21-hydroxylase block shunts steroid precursors",
      "Aromatase loss prevents any conversion of androgen to estrogen",
    ],
    correctAnswer: "LH-stimulated theca cells overproduce androstenedione",
    explanation: `## Why this answer is correct
In polycystic ovary syndrome, LH drives theca cells to synthesize androgens, and hyperinsulinemia further amplifies that theca response while suppressing hepatic production of sex-hormone-binding globulin. FSH is relatively low, so granulosa aromatization does not keep up and ovulation fails. A normal 17-hydroxyprogesterone argues against nonclassic congenital adrenal hyperplasia.

## Why the other options are wrong
**FSH-stimulated granulosa cells overproduce estradiol**
Granulosa cells aromatize androgens under FSH. The LH-to-FSH imbalance here favors theca androgen production, not isolated granulosa estradiol excess.

**Corpus luteum progesterone secretion is prolonged**
She is anovulatory, so a functioning corpus luteum is not being formed each month.

**Adrenal 21-hydroxylase block shunts steroid precursors**
That block raises 17-hydroxyprogesterone, which is normal in this patient.

**Aromatase loss prevents any conversion of androgen to estrogen**
Complete aromatase deficiency is a rare virilizing disorder. In this syndrome aromatization still occurs; the problem is the LH and insulin drive on the theca.`,
  },
  {
    slug: "re-05",
    domain: "reproductive-endocrine",
    band: "medium",
    difficulty: 3,
    subjectId: "anatomy",
    blueprintTopic: "pcos-endocrine",
    topicCategory: "hypogonadism",
    citationTitle: "Kallmann Syndrome",
    scenario:
      "A 17-year-old boy has no facial or axillary hair and a prepubertal testicular volume. He cannot smell coffee or smoke. LH and FSH are low, testosterone is low, and the rest of the anterior pituitary hormones are normal. MRI shows absent olfactory bulbs and a normal posterior pituitary bright spot. A brother is similarly affected.",
    question: "Which developmental failure caused the hypogonadism?",
    options: [
      "GnRH neurons failed to migrate with olfactory axons",
      "Pituitary gonadotrophs were destroyed by ischemia at birth",
      "Sertoli cells cannot respond to a high FSH level",
      "Hypothalamic kisspeptin neurons overstimulate GnRH release",
      "The anterior pituitary failed to form from Rathke pouch",
    ],
    correctAnswer: "GnRH neurons failed to migrate with olfactory axons",
    explanation: `## Why this answer is correct
GnRH neurons are born in the olfactory placode and migrate into the hypothalamus along olfactory axons. When that migration fails, olfaction and GnRH release are both lost. LH and FSH stay low, the testes never receive the pubertal signal, and the other pituitary axes remain intact because the pituitary itself formed.

## Why the other options are wrong
**Pituitary gonadotrophs were destroyed by ischemia at birth**
Ischemic pituitary injury would threaten multiple anterior hormones and would not remove the olfactory bulbs.

**Sertoli cells cannot respond to a high FSH level**
FSH is low, not high. The signal never arrives from the hypothalamus.

**Hypothalamic kisspeptin neurons overstimulate GnRH release**
Overstimulation of GnRH would raise LH and FSH. Both are low.

**The anterior pituitary failed to form from Rathke pouch**
Failure of Rathke pouch would delete multiple anterior pituitary lineages. The other axes are normal, and the specific associated finding is absent olfactory bulbs.`,
  },
  {
    slug: "re-06",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "adrenal-disorders",
    topicCategory: "adrenal-disorders",
    citationTitle: "Congenital Adrenal Hyperplasia",
    scenario:
      "A 4-year-old genetic female has clitoromegaly, early pubic hair, and blood pressure of 148/96 mm Hg. Potassium is 3.0 mEq/L and renin is suppressed. 11-deoxycortisol and deoxycorticosterone are high. Cortisol is low. 17-hydroxyprogesterone is only mildly above the reference range. Glucocorticoid replacement lowers the blood pressure.",
    question: "Which enzyme is deficient?",
    options: [
      "11-beta-hydroxylase, letting deoxycorticosterone accumulate",
      "21-hydroxylase, removing both cortisol and aldosterone",
      "17-alpha-hydroxylase, blocking androgen synthesis entirely",
      "Aldosterone synthase, with salt wasting and high renin",
      "3-beta-hydroxysteroid dehydrogenase, blocking the major steroid classes",
    ],
    correctAnswer: "11-beta-hydroxylase, letting deoxycorticosterone accumulate",
    explanation: `## Why this answer is correct
11-beta-hydroxylase converts 11-deoxycortisol to cortisol and deoxycorticosterone to corticosterone. When it is missing, androgens and deoxycorticosterone build up. Deoxycorticosterone activates the mineralocorticoid receptor, expanding volume, suppressing renin, and causing hypertension with hypokalemia, while the androgen excess virilizes.

## Why the other options are wrong
**21-hydroxylase, removing both cortisol and aldosterone**
21-hydroxylase deficiency causes salt wasting or, in nonclassic disease, virilization without this degree of mineralocorticoid hypertension. Deoxycorticosterone would not be the accumulated mineralocorticoid, and renin would be high if aldosterone were absent.

**17-alpha-hydroxylase, blocking androgen synthesis entirely**
17-alpha-hydroxylase deficiency causes hypertension from deoxycorticosterone but prevents sex-steroid synthesis, so a genetic female would not be virilized.

**Aldosterone synthase, with salt wasting and high renin**
Aldosterone synthase deficiency loses salt and raises renin. Blood pressure is low, not high, and girls are not virilized.

**3-beta-hydroxysteroid dehydrogenase, blocking the major steroid classes**
This early block impairs cortisol, mineralocorticoid, and potent androgen synthesis. It does not produce mineralocorticoid hypertension with high deoxycorticosterone.`,
  },
  {
    slug: "re-07",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "adrenal-disorders",
    topicCategory: "adrenal-disorders",
    citationTitle: "Congenital Adrenal Hyperplasia",
    scenario:
      "A 16-year-old genetic female has never menstruated and has no breast or pubic-hair development. Blood pressure is 156/98 mm Hg and potassium is 2.8 mEq/L. Cortisol is low, ACTH is high, and deoxycorticosterone is high. Estradiol, testosterone, and 17-hydroxyprogesterone are low. Gonads are in the pelvis and contain normal oocytes. Renin is suppressed.",
    question: "Which steroid step is blocked?",
    options: [
      "17-alpha-hydroxylation, so sex steroids cannot be made",
      "21-hydroxylation, with androgen excess and salt loss",
      "11-beta-hydroxylation, with androgen excess and hypertension",
      "Aromatization of testosterone inside ovarian granulosa cells",
      "5-alpha-reduction of testosterone in genital skin",
    ],
    correctAnswer: "17-alpha-hydroxylation, so sex steroids cannot be made",
    explanation: `## Why this answer is correct
17-alpha-hydroxylase is required to enter the cortisol and sex-steroid pathways. Without it, pregnenolone flows into the mineralocorticoid path, deoxycorticosterone rises, and volume expansion suppresses renin and lowers potassium. Sex steroids stay low, so a genetic female has neither breast development nor pubic hair, and a genetic male would be undervirilized. Ovaries are present because ovarian differentiation does not require sex steroids.

## Why the other options are wrong
**21-hydroxylation, with androgen excess and salt loss**
21-hydroxylase deficiency raises 17-hydroxyprogesterone and androgens and causes salt loss when mineralocorticoids are absent. This patient has low 17-hydroxyprogesterone, low androgens, and hypertension.

**11-beta-hydroxylation, with androgen excess and hypertension**
11-beta-hydroxylase deficiency shares the hypertension but produces virilization and high androgens. Androgens here are low and puberty has not started.

**Aromatization of testosterone inside ovarian granulosa cells**
Aromatase deficiency would leave androgens high and virilize a genetic female. Testosterone is low in this patient.

**5-alpha-reduction of testosterone in genital skin**
That enzyme acts in genital skin of a genetic male. It does not suppress adrenal sex steroids or raise deoxycorticosterone in a genetic female.`,
  },
  {
    slug: "re-08",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "adrenal-disorders",
    topicCategory: "pituitary",
    citationTitle: "Sheehan Syndrome",
    scenario:
      "A 29-year-old woman hemorrhaged after delivery of twins and required transfusion. Six weeks later she has not lactated, feels cold, and has lost axillary hair. Menses have not returned. TSH, ACTH, prolactin, LH, and FSH are low, and free T4 and cortisol are low. The posterior pituitary bright spot is preserved, and she has no polyuria. MRI shows a small pituitary.",
    question: "Why did the anterior pituitary infarct?",
    options: [
      "Hypertrophied anterior tissue outgrew its portal blood supply",
      "The posterior pituitary lost its direct arterial supply",
      "Autoimmune destruction of pituitary cells began late in pregnancy",
      "Postpartum apoplexy bled into a preexisting macroadenoma",
      "Hypothalamic nuclei lost their systemic arterial perfusion",
    ],
    correctAnswer: "Hypertrophied anterior tissue outgrew its portal blood supply",
    explanation: `## Why this answer is correct
Lactotroph hyperplasia during pregnancy enlarges the anterior pituitary, which is fed by the low-pressure hypothalamo-hypophyseal portal system. Obstetric hemorrhage drops portal perfusion, and the enlarged anterior lobe infarcts. Failure to lactate is often first, followed by central hypothyroidism, adrenal insufficiency, and hypogonadism. The posterior lobe is usually spared because it has a direct arterial supply, so diabetes insipidus is absent and the bright spot remains.

## Why the other options are wrong
**The posterior pituitary lost its direct arterial supply**
The posterior lobe is the territory with a direct arterial supply, and it is intact here: no polyuria and a preserved bright spot.

**Autoimmune destruction of pituitary cells began late in pregnancy**
Lymphocytic hypophysitis can present around pregnancy, but the history is a clear hypotensive hemorrhage followed by an empty, small pituitary rather than a diffusely inflamed gland.

**Postpartum apoplexy bled into a preexisting macroadenoma**
Pituitary apoplexy is hemorrhage into a tumor, with sudden headache and often visual loss. No adenoma is described, and the trigger was obstetric shock.

**Hypothalamic nuclei lost their systemic arterial perfusion**
The hormone pattern is panhypopituitarism after portal ischemia of the gland itself. Hypothalamic infarction is not the anatomy of Sheehan syndrome.`,
  },
  {
    slug: "re-09",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "diabetes-pathophysiology",
    topicCategory: "water-balance",
    citationTitle: "Arginine Vasopressin Disorder (Diabetes Insipidus)",
    scenario:
      "A 61-year-old man who has taken lithium for 18 years wakes three times a night to void and drinks constantly. A 24-hour urine collection is 7.4 L. After water deprivation, plasma osmolality is 318 mOsm/kg and urine osmolality is 155 mOsm/kg. Desmopressin does not raise the urine osmolality. Glucose is 96 mg/dL and sodium is 152 mEq/L. Pituitary MRI is normal.",
    question: "Which collecting-duct step has failed?",
    options: [
      "Antidiuretic-hormone signaling no longer inserts aquaporin-2 water",
      "Hypothalamic neurons no longer synthesize antidiuretic hormone",
      "The pituitary stalk no longer releases stored antidiuretic hormone",
      "Proximal-tubule aquaporin-1 has been removed from the membrane",
      "The thick ascending limb no longer creates the medullary gradient",
    ],
    correctAnswer: "Antidiuretic-hormone signaling no longer inserts aquaporin-2 water",
    explanation: `## Why this answer is correct
Lithium commonly causes nephrogenic diabetes insipidus. Antidiuretic hormone is present, but principal cells do not insert aquaporin-2 water channels, so the collecting duct cannot reabsorb water. Urine stays dilute during dehydration, and desmopressin, which replaces the hormone, does not concentrate the urine. Plasma osmolality and sodium rise.

## Why the other options are wrong
**Hypothalamic neurons no longer synthesize antidiuretic hormone**
Absent hormone production is central diabetes insipidus. Those patients concentrate their urine after desmopressin. This patient does not.

**The pituitary stalk no longer releases stored antidiuretic hormone**
Stalk interruption is another central cause and also responds to desmopressin. The pituitary image is normal and the drug history points to the kidney.

**Proximal-tubule aquaporin-1 has been removed from the membrane**
Aquaporin-1 mediates constitutive proximal reabsorption. It is not the vasopressin-regulated channel, and its loss is not the lithium lesion.

**The thick ascending limb no longer creates the medullary gradient**
Loop-diuretic action dissipates the gradient, but urine can still show a different pattern, and desmopressin resistance plus lithium specifically implicates collecting-duct aquaporin-2 trafficking.`,
  },
  {
    slug: "re-10",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "diabetes-pathophysiology",
    topicCategory: "diabetes-pathophysiology",
    citationTitle: "Type 2 Diabetes",
    scenario:
      "A 54-year-old man has a fasting glucose of 186 mg/dL and an HbA1c of 8.4 percent. Fasting insulin and C-peptide are both elevated. He is obese, and a euglycemic clamp shows that skeletal muscle takes up less glucose than expected at a high insulin level. Islet antibodies are absent. There is no ketoacidosis.",
    question: "Which muscle step is failing despite the high insulin?",
    options: [
      "Translocation of GLUT4 storage vesicles to the sarcolemma",
      "Opening of GLUT2 channels that are insulin independent",
      "Autoimmune loss of beta cells with absent C-peptide",
      "Hepatic glucokinase phosphorylation of glucose at the beta cell",
      "Renal SGLT2 reabsorption of glucose in the proximal tubule",
    ],
    correctAnswer: "Translocation of GLUT4 storage vesicles to the sarcolemma",
    explanation: `## Why this answer is correct
Insulin binds a receptor tyrosine kinase and, through IRS and PI3K-Akt signaling, moves GLUT4 storage vesicles to the membrane of skeletal muscle and adipocytes. In type 2 diabetes that signaling is resistant: insulin and C-peptide are high, yet muscle glucose uptake on a clamp is low. The liver continues to make glucose, and hyperglycemia follows without ketoacidosis.

## Why the other options are wrong
**Opening of GLUT2 channels that are insulin independent**
GLUT2 is the insulin-independent transporter of hepatocytes and beta cells. Muscle uptake that should respond to insulin uses GLUT4.

**Autoimmune loss of beta cells with absent C-peptide**
Type 1 diabetes has low or absent C-peptide and islet antibodies. Both insulin and C-peptide are high here, and antibodies are absent.

**Hepatic glucokinase phosphorylation of glucose at the beta cell**
Glucokinase sets beta-cell glucose sensing. A sensing defect would lower insulin secretion. Secretion here is increased.

**Renal SGLT2 reabsorption of glucose in the proximal tubule**
SGLT2 reclaims filtered glucose. Increased reabsorption can worsen hyperglycemia, but the clamp result is a muscle uptake defect at a matched insulin level, which is GLUT4 translocation.`,
  },
  {
    slug: "re-11",
    domain: "reproductive-endocrine",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "thyroid-disorders",
    topicCategory: "multiple-endocrine-neoplasia",
    citationTitle: "Multiple Endocrine Neoplasia Type 2",
    scenario:
      "A 33-year-old man has episodic headache, palpitations, and hypertension. Urinary metanephrines are elevated, and imaging shows a unilateral adrenal medullary mass. Calcitonin is high, and a thyroid mass arises from parafollicular cells. Serum calcium is high with an inappropriately high parathyroid hormone. His father had a thyroidectomy for the same thyroid tumor. Pituitary and pancreatic imaging are normal.",
    question: "Which gene product is constitutively active in this family?",
    options: [
      "RET receptor tyrosine kinase activated in neural-crest derivatives",
      "Menin, a tumor suppressor lost in parathyroid and pituitary tumors",
      "VHL protein, with cerebellar hemangioblastoma and renal carcinoma",
      "NF1 neurofibromin, with cutaneous neurofibromas and cafe-au-lait spots",
      "PTEN phosphatase, with mucosal neuromas and breast carcinoma",
    ],
    correctAnswer: "RET receptor tyrosine kinase activated in neural-crest derivatives",
    explanation: `## Why this answer is correct
MEN2A is caused by activating mutations of RET, a receptor tyrosine kinase. The same mutation drives medullary thyroid carcinoma from neural-crest parafollicular C cells (high calcitonin), pheochromocytoma from adrenal medulla, and parathyroid hyperplasia. Inheritance is autosomal dominant. A normal pituitary and pancreas separate this pattern from MEN1.

## Why the other options are wrong
**Menin, a tumor suppressor lost in parathyroid and pituitary tumors**
MEN1 is menin loss and features parathyroid, pituitary, and enteropancreatic tumors. Medullary thyroid carcinoma and pheochromocytoma are not the MEN1 triad, and the pituitary here is normal.

**VHL protein, with cerebellar hemangioblastoma and renal carcinoma**
VHL disease can include pheochromocytoma, but not medullary thyroid carcinoma with hyperparathyroidism as the familial pattern described.

**NF1 neurofibromin, with cutaneous neurofibromas and cafe-au-lait spots**
NF1 can be associated with pheochromocytoma. It does not produce this RET-pattern medullary carcinoma plus hyperparathyroidism, and the skin findings are absent.

**PTEN phosphatase, with mucosal neuromas and breast carcinoma**
Mucosal neuromas belong to MEN2B, which is also RET, but MEN2B has a marfanoid habitus and does not feature hyperparathyroidism. PTEN syndromes are Cowden and related hamartoma disorders, not this triad.`,
  },
];
