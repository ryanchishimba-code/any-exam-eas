"""Step 1 reproductive and endocrine mechanism items. Part 1."""

ITEMS = []


def add(topic, diff, subject, scenario, question, options, key, expl, ref):
    assert key in options and len(set(options)) == 5
    ITEMS.append(
        {
            "blueprintDomain": "reproductive-endocrine",
            "subjectId": subject,
            "taskCategory": "interpretation",
            "blueprintTopic": topic,
            "difficulty": diff,
            "scenario": scenario,
            "question": question,
            "options": options,
            "correctAnswer": key,
            "explanation": expl,
            "ref": ref,
        }
    )


add(
    "21-hydroxylase deficiency",
    5,
    "physiology",
    "A newborn boy is virilized and in the second week becomes a salt-wasting shock with low sodium, high potassium, and hypoglycemia. 17-hydroxyprogesterone is very high. A student calls this 11-beta hydroxylase deficiency because the child is sick, and another says the blood pressure should be high.",
    "Which enzyme failed, and why is the pressure low rather than high?",
    [
        "21-hydroxylase; cortisol and aldosterone cannot be made, so salt is lost, while ACTH drives androgen buildup",
        "11-beta hydroxylase; deoxycorticosterone excess causes hypertension and this salt-wasting picture",
        "17-alpha hydroxylase; sex steroids are increased and potassium is high",
        "Aromatase; estrogens are absent and aldosterone is the missing mineralocorticoid",
        "5-alpha reductase; DHT is low so a newborn boy cannot virilize",
    ],
    "21-hydroxylase; cortisol and aldosterone cannot be made, so salt is lost, while ACTH drives androgen buildup",
    "21-hydroxylase is required for cortisol and aldosterone. Its loss dumps precursors into androgens, so girls are virilized and boys can present in salt-wasting crisis with hyperkalemia. 17-hydroxyprogesterone is the marker. 11-beta hydroxylase blocks cortisol but shunts to DOC, which causes hypertension, not salt wasting. 17-alpha hydroxylase blocks cortisol and sex steroids and leaves mineralocorticoid excess, so pressure is high and androgens are low. Aromatase deficiency affects estrogen, not this adrenal salt loss. 5-alpha reductase deficiency under-virilizes an XY infant; it does not cause a salt-wasting boy who is already virilized.",
    "guyton-14",
)

add(
    "11-beta hydroxylase deficiency",
    5,
    "physiology",
    "A child is virilized and hypertensive. Sodium is not low. Deoxycorticosterone is high and renin is low. 17-hydroxyprogesterone is only modestly up compared with the huge DOC. A classmate remembers the salt-wasting infant and wants fludrocortisone as the main mineralocorticoid replacement.",
    "Why is this child hypertensive, and why is fludrocortisone the wrong emphasis?",
    [
        "DOC, a mineralocorticoid made before the 11-beta block, expands volume; he needs glucocorticoid to turn off ACTH, not extra mineralocorticoid",
        "He lacks aldosterone, so salt wasting is about to start and fludrocortisone is required",
        "The enzyme block is 21-hydroxylase, which always causes hypertension",
        "Renin is high, which proves renal artery stenosis as the cause of the virilization",
        "DOC is a glucocorticoid only and cannot raise blood pressure",
    ],
    "DOC, a mineralocorticoid made before the 11-beta block, expands volume; he needs glucocorticoid to turn off ACTH, not extra mineralocorticoid",
    "11-beta hydroxylase deficiency stops cortisol and sends the pathway toward deoxycorticosterone, which acts like aldosterone. Volume is high, renin is suppressed, and there is no salt wasting. Glucocorticoid replacement suppresses ACTH and therefore the DOC drive. Adding fludrocortisone piles mineralocorticoid onto mineralocorticoid. 21-hydroxylase deficiency is the salt-losing, low-pressure disease. Renin is low here, not high, and stenosis does not virilize. DOC has real mineralocorticoid activity, which is the whole mechanism.",
    "guyton-14",
)

add(
    "17-alpha hydroxylase deficiency",
    5,
    "physiology",
    "A teenager has never menstruated, has hypertension, and has low potassium. She has little pubic hair. Cortisol is low, androgens are low, and mineralocorticoid metabolites are high. A pelvic exam is not the first issue; the blood pressure is. Someone suggests she has 21-hydroxylase deficiency because both are congenital adrenal hyperplasias.",
    "What is overproduced, and why is puberty absent?",
    [
        "Corticosterone and DOC are overproduced and suppress renin; sex steroids cannot be made because 17-hydroxylation is required for them",
        "Androgens are high, so she should be virilized",
        "Aldosterone is directly high and sex steroids are normal",
        "This is the salt-wasting form, so potassium should be high",
        "17-hydroxyprogesterone is the dominant marker, as in 21-hydroxylase deficiency",
    ],
    "Corticosterone and DOC are overproduced and suppress renin; sex steroids cannot be made because 17-hydroxylation is required for them",
    "17-alpha hydroxylase is required to enter the cortisol and sex-steroid pathways. Block it and the adrenal makes mineralocorticoids, blood pressure rises, potassium falls, and there is no puberty because androgens and estrogens are not made. 21-hydroxylase deficiency does the opposite with androgens: virilization and, in the salt-losing form, low pressure. Androgens are low here, so she is not virilized. Aldosterone itself is often low because high DOC expands volume and suppresses renin; the active mineralocorticoid is DOC and corticosterone. Potassium is low, not high. 17-hydroxyprogesterone is not the marker; that steroid requires the enzyme she lacks.",
    "guyton-14",
)

add(
    "Cushing dexamethasone",
    5,
    "physiology",
    "Patient A has a high cortisol that suppresses with low-dose dexamethasone and a high ACTH that is suppressible; she is depressed and drinks heavily. Patient B has a high cortisol that does not suppress with low dose but does with high dose, and ACTH is high. Patient C does not suppress even with high-dose dexamethasone and ACTH is low. All three look Cushingoid or are being tested for it.",
    "Which lesions fit B and C?",
    [
        "B is a pituitary adenoma that still has some feedback; C is an adrenal tumor making cortisol and shutting off ACTH",
        "B is an adrenal carcinoma because high-dose suppression means the adrenal is primary",
        "C is a pituitary adenoma because ACTH is low",
        "A has Cushing disease and should not have suppressed with low-dose dexamethasone",
        "Ectopic ACTH suppresses with low-dose dexamethasone",
    ],
    "B is a pituitary adenoma that still has some feedback; C is an adrenal tumor making cortisol and shutting off ACTH",
    "Low-dose dexamethasone suppression means the axis can still be turned off, which is pseudo-Cushing from depression or alcohol, patient A. Failure of low dose but success of high dose, with high ACTH, is a pituitary adenoma, Cushing disease. Failure of high dose with low ACTH is cortisol from the adrenal itself, which has turned the pituitary off. An adrenal cancer would not suppress and would have low ACTH, so calling B adrenal reverses the test. Low ACTH is not a pituitary tumor. Patient A did suppress, so this is not Cushing disease. Ectopic ACTH usually fails high-dose suppression and the ACTH is high, not low-dose suppressible.",
    "guyton-14",
)

add(
    "Primary adrenal insufficiency",
    4,
    "physiology",
    "A woman has fatigue, low sodium, high potassium, low glucose, and increased pigmentation in the palmar creases and a scar. ACTH is high and cortisol does not rise after a cosyntropin test. She has no cushingoid features. A student says the pigmentation means her pituitary is overproducing melanin directly from a melanoma.",
    "Why is she pigmented, and why is potassium high?",
    [
        "High ACTH and its POMC cousin MSH darken the skin; the whole adrenal cortex is out, so aldosterone is low and potassium rises",
        "Secondary adrenal insufficiency pigment is darker than primary because ACTH is higher",
        "Potassium is high because cortisol excess dumps potassium in the urine",
        "Cosyntropin failure means the pituitary cannot make ACTH",
        "Pigmentation means she has Cushing disease and the ACTH stain is from cortisol",
    ],
    "High ACTH and its POMC cousin MSH darken the skin; the whole adrenal cortex is out, so aldosterone is low and potassium rises",
    "Primary adrenal failure removes cortisol and aldosterone. Pituitary ACTH rises, and POMC products darken the skin. Hyperkalemia is the mineralocorticoid loss. Secondary adrenal insufficiency has low ACTH, no pigmentation, and aldosterone is largely intact because it is renin-driven, so potassium is usually normal. Cortisol excess wastes potassium; she has too little cortisol. Cosyntropin tests the adrenal response; failure with a high ACTH means the gland, not the pituitary, is dead. Cushing disease is cortisol excess, the opposite body habitus.",
    "guyton-14",
)

add(
    "Primary aldosteronism",
    4,
    "physiology",
    "A 45-year-old man has hypertension and a potassium of 2.9 mmol/L that is hard to replace. He is not on a diuretic. Plasma renin is low and aldosterone is high and does not suppress with salt. Metabolic alkalosis is present. A friend says the low renin means renal artery stenosis.",
    "What is the lesion pattern, and why is renin low?",
    [
        "An adrenal aldosterone-producing adenoma or bilateral hyperplasia expands volume and shuts renin off",
        "Renal artery stenosis raises renin and then aldosterone, so renin would be high",
        "He has Bartter syndrome, which presents with hypertension",
        "Low potassium proves cortisol excess from a pituitary tumor",
        "ACE-inhibitor cough physiology is the cause of the low renin",
    ],
    "An adrenal aldosterone-producing adenoma or bilateral hyperplasia expands volume and shuts renin off",
    "Primary aldosteronism makes aldosterone on its own. Sodium is retained, volume rises, renin falls, and potassium and hydrogen are wasted, so he is hypertensive, hypokalemic, and alkalotic. Renal artery stenosis is secondary aldosteronism: renin is high. Bartter and Gitelman waste salt and have normal or low blood pressure. Cushing can lower potassium but the screening pair here is high aldosterone with low renin, not a pituitary story. An ACE inhibitor raises renin by blocking feedback; it is not this picture.",
    "guyton-14",
)

add(
    "Graves versus thyroiditis versus factitious",
    5,
    "pathology",
    "Three thyrotoxic patients: A has a diffuse goiter, pretibial myxedema, and high radioiodine uptake. B had a sore throat and a tender gland, uptake is near zero, and thyroglobulin is high. C has no goiter, uptake is zero, and thyroglobulin is low. All have a low TSH and a high T4.",
    "Who has Graves disease, and who is taking hormone?",
    [
        "A is Graves, TSH-receptor antibodies driving the gland; C is exogenous hormone because the gland is quiet and thyroglobulin is low",
        "B is Graves because the gland hurts",
        "C has thyroiditis because thyroglobulin is low when the gland is leaking",
        "A has factitious thyrotoxicosis because uptake is high",
        "All three need methimazole as the only distinction is cosmetic",
    ],
    "A is Graves, TSH-receptor antibodies driving the gland; C is exogenous hormone because the gland is quiet and thyroglobulin is low",
    "Graves disease is stimulating antibody. The gland is working, so uptake is high, and the extrathyroidal signs are orbitopathy and pretibial myxedema. Subacute thyroiditis leaks stored hormone, uptake is low, thyroglobulin is high, and the gland is tender. Factitious hormone suppresses the gland, uptake is low, and thyroglobulin is low because the gland is not releasing its protein. A tender gland is thyroiditis, not Graves. Low thyroglobulin means the hormone did not come from the gland. High uptake means the gland is making hormone, the opposite of factitious disease. Methimazole blocks synthesis and helps Graves; it does not stop leak from thyroiditis or exogenous pills.",
    "ata-hyper-2016",
)

add(
    "Methimazole and pregnancy",
    5,
    "pharmacology",
    "A woman with Graves disease is planning pregnancy. She is on methimazole and euthyroid. She is told that in early pregnancy the antithyroid drug choice changes because of a rare scalp and choanal anomaly, and that later the drug may cross and make the fetus hypothyroid. She also has orbitopathy.",
    "Which drug is preferred in the first trimester, and why is ablation not casual here?",
    [
        "Propylthiouracil is preferred in early pregnancy because methimazole is linked to aplasia cutis and choanal atresia; radioiodine is not used in pregnancy and can worsen orbitopathy around treatment",
        "Methimazole is mandatory in the first trimester and PTU is banned for the whole pregnancy",
        "Radioiodine ablation is the safest treatment once she has a positive pregnancy test",
        "Both drugs block release only, so either is identical for the fetus",
        "Orbitopathy is treated by making her hyperthyroid on purpose",
    ],
    "Propylthiouracil is preferred in early pregnancy because methimazole is linked to aplasia cutis and choanal atresia; radioiodine is not used in pregnancy and can worsen orbitopathy around treatment",
    "Both thioamides block new hormone synthesis. Methimazole is generally preferred outside early pregnancy because PTU can cause severe hepatitis, but methimazole's teratogenicity in the first trimester makes PTU the early-pregnancy choice, with a later switch often discussed. Radioiodine destroys the gland and is contraindicated in pregnancy; it can also flare orbitopathy. The drugs are not identical for the fetus. Leaving her hyperthyroid to 'treat' the eyes is harmful; eye disease is managed alongside euthyroidism, not by withholding treatment.",
    "ata-hyper-2016",
)

add(
    "DKA versus HHS",
    5,
    "physiology",
    "Patient A is 16, type 1, with glucose 420 mg/dL, pH 7.15, bicarbonate 8, and moderate ketones. Potassium is 5.4 mmol/L and he has not been eating. Patient B is 72, type 2, with glucose 900 mg/dL, pH 7.35, bicarbonate 20, osmolality 340, and almost no ketones. He is very dry and sleepy. Someone wants to start insulin in A before any fluid and without checking potassium again after insulin.",
    "Why can A have a normal or high potassium and still need potassium, and why is B not in ketoacidosis?",
    [
        "Acidosis and low insulin shift potassium out of cells, so the serum number hides a total-body deficit; B still makes enough insulin to limit ketogenesis but not enough to control glucose",
        "A high serum potassium means total-body potassium is high and replacement will cause arrhythmia",
        "B must be in DKA because the glucose is higher",
        "Insulin is started in A before fluids because glucose, not volume, is the first threat",
        "Ketones are required for hyperosmolar coma",
    ],
    "Acidosis and low insulin shift potassium out of cells, so the serum number hides a total-body deficit; B still makes enough insulin to limit ketogenesis but not enough to control glucose",
    "In DKA, potassium leaves cells with the acidosis and the insulin lack, so the serum can look normal or high while the body is depleted. Insulin drives potassium back in and can stop the heart if you do not replace it. Fluids come first. Patient B has hyperosmolar hyperglycemic state: enough insulin remains to suppress most ketogenesis, so acidosis is mild, but glucose and osmolality are extreme. A high serum potassium is not a surplus. A higher glucose does not define DKA; ketones and acidosis do. Insulin before volume in a crashing dry patient is the wrong order. Ketones are exactly what HHS lacks.",
    "ada-2026",
)

add(
    "Metformin contraindication",
    4,
    "pharmacology",
    "A woman with type 2 diabetes and an eGFR of 25 mL/min is scheduled for a contrast CT. She takes metformin and had a recent bout of vomiting. A student says metformin causes hypoglycemia like a sulfonylurea and that the kidney function does not matter.",
    "What is the dangerous accumulation, and does metformin cause hypoglycemia alone?",
    [
        "Metformin can cause lactic acidosis when clearance is poor or tissue perfusion is low; by itself it does not raise insulin, so hypoglycemia is not its standalone effect",
        "Metformin stimulates insulin release and is the main cause of fasting hypoglycemia",
        "Contrast is irrelevant because metformin is metabolized by the liver only",
        "Lactic acidosis is the sulfonylurea toxicity",
        "An eGFR of 25 is a reason to increase the metformin dose",
    ],
    "Metformin can cause lactic acidosis when clearance is poor or tissue perfusion is low; by itself it does not raise insulin, so hypoglycemia is not its standalone effect",
    "Metformin decreases hepatic gluconeogenesis and increases insulin sensitivity. It is cleared by the kidney. When GFR is very low, or after contrast in someone at risk, or when perfusion is poor, lactate can accumulate. It does not squeeze insulin from the pancreas, so alone it rarely causes hypoglycemia. That hypoglycemia is the sulfonylurea and insulin problem. Contrast plus low GFR is exactly the hold-the-drug situation. Sulfonylureas cause hypoglycemia, not this lactate story. A lower GFR is a reason to stop or avoid the drug, not to raise it.",
    "ada-2026",
)

add(
    "Sulfonylurea hypoglycemia",
    4,
    "pharmacology",
    "An older man on glyburide is found confused with a glucose of 38 mg/dL. He ate little and took his usual dose. He wakes with dextrose and an hour later is hypoglycemic again. Renal function is reduced. A student gives one amp of dextrose and discharges him.",
    "Why did the sugar return to low, and why is glyburide a poor choice here?",
    [
        "Sulfonylureas keep potassium channels closed and insulin secretion going for many hours; glyburide is long-acting and renally cleared, so one glucose dose does not end the episode",
        "Glyburide wears off in minutes, so recurrent lows mean he took insulin secretly",
        "Dextrose stimulates further sulfonylurea release from the bottle, which is the mechanism",
        "Hypoglycemia from this class is impossible if he still has a pancreas",
        "Reduced kidney function shortens glyburide action",
    ],
    "Sulfonylureas keep potassium channels closed and insulin secretion going for many hours; glyburide is long-acting and renally cleared, so one glucose dose does not end the episode",
    "Sulfonylureas close the beta-cell K-ATP channel, calcium enters, and insulin is released regardless of the current glucose once the drug is on board. Glyburide lasts and accumulates when the kidneys fail, which is why it is a bad drug in older adults. He needs observation and repeated glucose, sometimes octreotide, not a doorway discharge. A short action would not explain the relapse. Dextrose does not release more tablets. The whole toxicity requires a pancreas that can still be forced to secrete. Low GFR prolongs, not shortens, the effect.",
    "katzung-16",
)

add(
    "PTH, PTHrP, vitamin D",
    5,
    "physiology",
    "Patient A has a high calcium, low phosphate, high PTH, and a bone film with subperiosteal resorption. Patient B has a squamous lung cancer, high calcium, low PTH, and low phosphate. Patient C has high calcium, high phosphate, low PTH, and a history of eating supplements. Patient D has sarcoidosis, high calcium, low PTH, and a high 1,25-dihydroxyvitamin D.",
    "Who has primary hyperparathyroidism, and who is making vitamin D outside the kidney's usual control?",
    [
        "A is a parathyroid adenoma; D has granulomatous 1-alpha hydroxylase activity that is not turned off by calcium",
        "B has primary hyperparathyroidism because the cancer secretes PTH",
        "C has humoral hypercalcemia of malignancy because both minerals are high",
        "D has hypoparathyroidism because PTH is low",
        "A should have a high phosphate because PTH holds phosphate in the blood",
    ],
    "A is a parathyroid adenoma; D has granulomatous 1-alpha hydroxylase activity that is not turned off by calcium",
    "Primary hyperparathyroidism raises calcium, lowers phosphate, and the PTH is high; bone is resorbed. PTHrP from squamous cancer imitates PTH on bone and kidney but the real PTH is suppressed. Milk-alkali or vitamin D excess raises both calcium and phosphate and suppresses PTH. Sarcoid macrophages make 1,25-vitamin D on their own, so calcium rises and PTH falls, and the active vitamin D is high. Cancer does not raise the PTH assay in the usual PTHrP case. High calcium with high phosphate is not PTHrP, which wastes phosphate. Low PTH with high calcium is appropriate suppression, not hypoparathyroidism, which would have low calcium. PTH dumps phosphate in the urine, so phosphate is low, not high.",
    "guyton-14",
)

add(
    "Pseudohypoparathyroidism",
    5,
    "physiology",
    "A short child with short fourth metacarpals has a low calcium, a high phosphate, and a high PTH. Infused PTH does not raise urinary cAMP. A classmate with a surgical thyroidectomy has the same minerals but a low PTH. The mother has the same hand shape and a normal calcium.",
    "Where is the resistance, and why can the mother look different?",
    [
        "The kidney Gs protein does not answer PTH, so cAMP does not rise; the gene is imprinted and the maternal allele matters, so a parent can carry the phenotype with or without the biochemistry",
        "The parathyroids are absent, so PTH should be low",
        "Vitamin D poisoning explains the low calcium and high PTH",
        "This is hypoparathyroidism because the minerals match a low PTH patient",
        "Urinary cAMP should fall in normal people given PTH, so the test was misread",
    ],
    "The kidney Gs protein does not answer PTH, so cAMP does not rise; the gene is imprinted and the maternal allele matters, so a parent can carry the phenotype with or without the biochemistry",
    "Pseudohypoparathyroidism type Ia is end-organ resistance. PTH is high and cannot lower phosphate or raise calcium, and exogenous PTH does not generate cAMP. Albright hereditary osteodystrophy can appear in relatives; GNAS imprinting means the maternal allele is the one that matters in the kidney, so family members can share the body habitus with different labs. Absent parathyroids would lower PTH, which is the post-surgical classmate. Vitamin D poisoning raises calcium. The minerals look like hypoparathyroidism but the high PTH is the separator. Normal kidneys increase cAMP when PTH is infused.",
    "guyton-14",
)

add(
    "Post-thyroidectomy calcium",
    4,
    "physiology",
    "Six hours after a total thyroidectomy a woman has perioral tingling and a positive Chvostek sign. Calcium is low and PTH is low. Phosphate is high. She is not septic. A student blames hungry bone from a longstanding parathyroid adenoma because the surgery was a thyroidectomy for cancer and the parathyroids were at risk.",
    "What was removed or stunned, and why is phosphate high?",
    [
        "The parathyroids were removed or ischemic, so PTH is gone, bone and kidney release less calcium, and the kidney holds phosphate",
        "Hungry bone keeps PTH high and phosphate low",
        "Hypocalcemia after neck surgery is from high calcitonin that lasts for months",
        "A high phosphate means vitamin D toxicity",
        "Chvostek sign is specific for hypokalemia",
    ],
    "The parathyroids were removed or ischemic, so PTH is gone, bone and kidney release less calcium, and the kidney holds phosphate",
    "PTH normally raises calcium and dumps phosphate. Without it, calcium falls, phosphate rises, and neuromuscular irritability appears soon after surgery. Hungry bone after parathyroidectomy for longstanding hyperparathyroidism also drops calcium, but PTH is not low in the same way at the moment of cure if residual glands work, and the classic immediate low PTH is gland injury. Calcitonin is not the lasting cause. Vitamin D toxicity raises calcium. Chvostek sign is facial twitching from low calcium, not potassium.",
    "guyton-14",
)

add(
    "Insulin signaling",
    4,
    "physiology",
    "A student is asked why muscle takes up glucose after a meal but the liver's main glucose transporter does not wait for insulin. She says both tissues use GLUT4. A patient with a rare insulin-receptor mutation has high insulin, high glucose, and acanthosis.",
    "Which transporter is insulin-dependent, and what does the receptor mutation prove?",
    [
        "GLUT4 in muscle and fat is moved to the membrane by insulin signaling; liver GLUT2 is constitutive. Receptor failure causes hyperglycemia despite high insulin",
        "GLUT2 is the insulin-regulated transporter in muscle",
        "The liver cannot take up glucose unless insulin opens GLUT4",
        "High insulin with high glucose means the pancreas has failed",
        "Acanthosis nigricans means insulin levels are low",
    ],
    "GLUT4 in muscle and fat is moved to the membrane by insulin signaling; liver GLUT2 is constitutive. Receptor failure causes hyperglycemia despite high insulin",
    "Insulin binds its receptor, a tyrosine kinase, and in muscle and adipose tissue sends GLUT4 to the surface. Liver and beta cells use GLUT2, which is not parked waiting for insulin; the liver's insulin effect on glucose is mostly enzyme regulation. A receptor mutation is insulin resistance: glucose stays high while insulin is high, and acanthosis tracks that high insulin. GLUT2 is not the regulated muscle transporter. The liver does take up glucose without a GLUT4 step. High insulin means the pancreas is working, which is the opposite of type 1 failure. Acanthosis is a sign of high, not low, insulin.",
    "guyton-14",
)

add(
    "Menstrual cycle LH surge",
    5,
    "physiology",
    "A woman is mid-cycle. Estradiol has been high for two days. The LH surge is starting. A student says estrogen always inhibits LH, so a surge is impossible, and that progesterone was the hormone that triggered ovulation. Basal body temperature has not risen yet.",
    "What switched, and what raises the temperature after ovulation?",
    [
        "Sustained high estradiol becomes positive feedback at the pituitary and hypothalamus and triggers the LH surge; progesterone from the corpus luteum then raises temperature",
        "Estrogen is only inhibitory, so the surge is FSH from the ovary",
        "Progesterone triggers the LH surge and temperature falls after ovulation",
        "The LH surge follows menstruation by one day",
        "Ovulation is caused by a drop in estradiol to zero",
    ],
    "Sustained high estradiol becomes positive feedback at the pituitary and hypothalamus and triggers the LH surge; progesterone from the corpus luteum then raises temperature",
    "Low or moderate estrogen inhibits gonadotropins. When estradiol stays high through the late follicular phase, feedback flips and LH surges, which ovulates the follicle. After ovulation the corpus luteum makes progesterone, which is thermogenic, so the temperature rise is a post-ovulation sign, not the trigger. Calling estrogen only inhibitory misses the switch. FSH does not surge as the ovulatory signal in that way. Progesterone is not the pre-ovulatory trigger, and temperature rises rather than falls. The surge is mid-cycle, not the day after menses. Estradiol is high, not zero, when the surge starts.",
    "guyton-14",
)

add(
    "PCOS mechanism",
    4,
    "physiology",
    "A woman has irregular menses, acne, and hirsutism. LH is high relative to FSH. The ovaries are enlarged with many small follicles. She is insulin resistant. A student says the androgens come from an adrenal tumor because DHEA-S must be the source whenever hair grows, and that FSH is high.",
    "Why is LH high relative to FSH, and where are the androgens from in this common disease?",
    [
        "Insulin and high LH drive theca-cell androgens; follicles do not mature well because FSH action is relatively low, and an adrenal tumor is not required",
        "FSH is higher than LH, which luteinizes many follicles",
        "Androgens come only from a cortisol-producing adenoma",
        "Insulin resistance lowers ovarian androgen production",
        "Regular monthly ovulation is the definition of this physiology",
    ],
    "Insulin and high LH drive theca-cell androgens; follicles do not mature well because FSH action is relatively low, and an adrenal tumor is not required",
    "In PCOS, LH is disproportionately high and pushes theca cells to make androgens. FSH is relatively low, so many follicles stall. Hyperinsulinemia amplifies ovarian androgen production and lowers sex-hormone binding globulin. Most hirsutism of this pattern is ovarian, and a very high DHEA-S would be the adrenal-tumor clue, which is not this story. FSH is not the dominant gonadotropin here. A cortisol adenoma is Cushing syndrome. Insulin resistance increases, not lowers, the androgen drive. Ovulation is infrequent, which is why menses are irregular.",
    "guyton-14",
)

add(
    "Prolactin and GnRH",
    4,
    "physiology",
    "A woman has galactorrhea and amenorrhea. Prolactin is high and a pituitary MRI shows a small adenoma. LH and FSH are low. She is not pregnant. A student says high prolactin should increase GnRH because lactation and fertility go together, and recommends dopamine as the drug that would raise prolactin further.",
    "How does prolactin stop menses, and what does a dopamine agonist do?",
    [
        "Prolactin suppresses GnRH, so gonadotropins fall and ovulation stops; dopamine agonists such as cabergoline lower prolactin because dopamine is the physiologic brake",
        "Prolactin stimulates GnRH, so LH should be high",
        "Dopamine agonists are used to increase prolactin in a prolactinoma",
        "Amenorrhea with galactorrhea is primary ovarian failure, so FSH is high",
        "A pituitary adenoma that makes prolactin always presents with bitemporal hemianopia first",
    ],
    "Prolactin suppresses GnRH, so gonadotropins fall and ovulation stops; dopamine agonists such as cabergoline lower prolactin because dopamine is the physiologic brake",
    "High prolactin turns down GnRH. Without pulsatile GnRH, LH and FSH fall and the ovary is quiet, so menses stop and milk can be present. Dopamine from the hypothalamus inhibits lactotrophs, so a dopamine agonist treats the adenoma. The fertility-and-lactation intuition is backward for the GnRH effect. A dopamine agonist does not raise prolactin. Primary ovarian failure would raise FSH. A microadenoma often has no visual-field cut; that finding is a macroadenoma clue, not a requirement.",
    "katzung-16",
)

add(
    "MEN syndromes",
    4,
    "pathology",
    "Family A has hyperparathyroidism, a pituitary prolactinoma, and a pancreatic gastrinoma. Family B has medullary thyroid cancer, pheochromocytoma, and hyperparathyroidism. Family C has medullary thyroid cancer, pheo, and mucosal neuromas, with a marfanoid habitus and no hyperparathyroidism as the lead feature.",
    "Which genes and which family gets thyroidectomy based on the RET risk?",
    [
        "A is MEN1 (menin); B is MEN2A and C is MEN2B, both RET, and medullary thyroid cancer risk drives early thyroidectomy",
        "All three are MEN1 because each has an endocrine tumor",
        "MEN2B has hyperparathyroidism as its defining parathyroid disease and no neuromas",
        "Pheochromocytoma belongs only to MEN1",
        "Medullary thyroid cancer is a follicular-cell cancer treated with radioiodine as the inherited lesion",
    ],
    "A is MEN1 (menin); B is MEN2A and C is MEN2B, both RET, and medullary thyroid cancer risk drives early thyroidectomy",
    "MEN1 is parathyroid, pituitary, and pancreas, the menin gene. MEN2 is RET. 2A adds hyperparathyroidism to medullary thyroid cancer and pheo. 2B has medullary thyroid cancer, pheo, and mucosal neuromas, and is marfanoid, without the parathyroid disease as its signature. The thyroid cancer is C-cell, calcitonin-producing, and the reason gene carriers lose the thyroid early. Not every endocrine cluster is MEN1. 2B is the neuroma family. Pheo is the MEN2 tumor, not the MEN1 one. Follicular cells make papillary and follicular cancers; medullary cancer does not take up iodine the way those do.",
    "robbins-10",
)

add(
    "Pheochromocytoma before beta blocker",
    5,
    "pharmacology",
    "A man has paroxysms of headache, palpitations, and hypertension. Plasma metanephrines are high. A surgeon plans a resection. A student starts a beta blocker the night before for the tachycardia and the pressure rises further. He has not received an alpha blocker.",
    "Why did the pressure rise, and what must come first?",
    [
        "Blocking beta-2 vasodilation while alpha constriction is unopposed raises pressure; phenoxybenzamine or another alpha block comes before any beta blocker",
        "Beta blockers are the first and only preoperative drug",
        "Alpha blockade would worsen the tachycardia and is saved for after removal",
        "Metanephrines are a thyroid marker, so this is a thyroid storm protocol",
        "The pressure rise means the tumor is not catecholamine-secreting",
    ],
    "Blocking beta-2 vasodilation while alpha constriction is unopposed raises pressure; phenoxybenzamine or another alpha block comes before any beta blocker",
    "Pheochromocytoma pours out epinephrine and norepinephrine. Alpha receptors constrict; beta-2 receptors dilate in some beds. If you block beta first, dilation is lost and alpha constriction is unopposed, so pressure climbs. Irreversible alpha blockade, volume replacement, then a beta blocker if the heart rate needs it, is the order. Beta blockade is not the opening drug. Alpha blockade is preoperative, not something you skip until the gland is out. Metanephrines are catecholamine metabolites, not a thyroid test. The rise is exactly what a catecholamine tumor does when beta-blocked first.",
    "katzung-16",
)

add(
    "Glycogen storage von Gierke",
    4,
    "physiology",
    "A toddler has a huge liver, severe fasting hypoglycemia, lactic acidosis, hyperuricemia, and high triglycerides. Muscle cramps with brief exercise are absent. Glucose-6-phosphatase is the enzyme under discussion. A student picks McArdle disease because both are glycogenoses.",
    "Why can this child not free glucose, and why is McArdle the wrong organ?",
    [
        "Glucose-6-phosphatase in liver is required to release free glucose; McArdle is muscle phosphorylase, with cramps and no hypoglycemia",
        "McArdle disease causes fasting hypoglycemia and a big liver",
        "Von Gierke disease is a lysosomal maltase defect that enlarges the heart",
        "The lactic acid means he has too much glucose-6-phosphatase",
        "Branching enzyme deficiency presents with this severe fasting hypoglycemia as its classic form",
    ],
    "Glucose-6-phosphatase in liver is required to release free glucose; McArdle is muscle phosphorylase, with cramps and no hypoglycemia",
    "Von Gierke disease traps glucose-6-phosphate in the liver. Glycogen builds, free glucose cannot be released, and the phosphate is shunted to lactate and to the pentose pathway that feeds uric acid, with lipid following. McArdle disease cannot break muscle glycogen, so brief exercise causes cramps and myoglobinuria, and the blood glucose is maintained by the liver. Pompe disease is lysosomal acid maltase and hits the heart. The enzyme is missing, not overactive. Andersen branching-enzyme disease causes cirrhosis and abnormal glycogen, not this classic fasting biochemical storm.",
    "guyton-14",
)

add(
    "McArdle disease",
    4,
    "physiology",
    "A teenager gets cramps and burgundy urine after a short sprint. The forearm exercise test does not raise lactate. He can sometimes continue after a brief rest, the second wind. Between sprints his blood glucose is normal and the liver is not enlarged.",
    "Which enzyme, and why does a second wind happen?",
    [
        "Muscle glycogen phosphorylase is missing, so anaerobic glycogen cannot make lactate; blood-borne fuels after a few minutes bypass the missing enzyme",
        "Liver glucose-6-phosphatase is missing, so sprints cause hypoglycemia as the first sign",
        "Acid maltase is missing, so the ECG is the test of choice for the burgundy urine",
        "Lactate should rise more than normal when phosphorylase is gone",
        "The urine color is bilirubin from hemolysis of G6PD deficiency only",
    ],
    "Muscle glycogen phosphorylase is missing, so anaerobic glycogen cannot make lactate; blood-borne fuels after a few minutes bypass the missing enzyme",
    "McArdle disease is muscle phosphorylase deficiency. Glycogen cannot enter glycolysis in muscle, so lactate does not rise with ischemic exercise and ATP fails, cramping the muscle and spilling myoglobin. After a few minutes, liver glucose and fatty acids delivered by blood take over, which is the second wind. The liver enzyme of von Gierke disease would cause fasting hypoglycemia and hepatomegaly, which he does not have. Pompe disease is a floppy infant or cardiomyopathy, not sprint myoglobinuria. Lactate stays flat, which is the test. Myoglobin, not bilirubin, colors the urine.",
    "guyton-14",
)

add(
    "Carnitine shuttle",
    5,
    "physiology",
    "A child becomes profoundly hypoglycemic during a gastroenteritis when he stops eating, and he has no ketones in the urine. Muscle weakness is present. A medium-chain triglyceride supplement is being discussed because medium-chain fats do not need the carnitine shuttle. He does not have a big liver from von Gierke disease.",
    "Why are ketones absent, and why do medium-chain fats bypass the block?",
    [
        "Long-chain fatty acids cannot enter mitochondria without carnitine palmitoyltransferase, so the liver cannot make ketones; medium-chain fats enter without that shuttle",
        "Ketones are absent because he has too much insulin from an insulinoma during the illness",
        "Medium-chain fats require more carnitine than long-chain fats",
        "Hypoglycemia with no ketones is the definition of von Gierke disease",
        "Carnitine carries glucose into the mitochondria",
    ],
    "Long-chain fatty acids cannot enter mitochondria without carnitine palmitoyltransferase, so the liver cannot make ketones; medium-chain fats enter without that shuttle",
    "Beta oxidation and ketone production need fatty acids inside mitochondria. The carnitine shuttle, including CPT-I and CPT-II, carries long-chain acyl groups in. A block presents as hypoketotic hypoglycemia when fasting removes dietary carbohydrate, plus weak muscles. Medium-chain fatty acids skip the shuttle, which is why that nutrition is used. An insulinoma would suppress ketones but is not a carnitine story and not a fasting-illness pattern with a shuttle bypass. Medium chains need the shuttle less, not more. Von Gierke disease has lactate and a huge liver and can still make ketones from fat. Carnitine does not carry glucose.",
    "guyton-14",
)

add(
    "PKU",
    4,
    "pathology",
    "A fair-haired infant who missed the newborn screen is irritable and later intellectually delayed. The diaper has a musty smell. Phenylalanine is high and tyrosine is low. A student says he needs a high-phenylalanine diet to replace the missing amino acid, and that tyrosine is essential only in healthy children.",
    "Which enzyme failed, and which amino acid becomes essential?",
    [
        "Phenylalanine hydroxylase or its biopterin cofactor failed; tyrosine must be supplied and phenylalanine restricted",
        "Tyrosinase failed, so this is albinism and the diet is irrelevant",
        "Homogentisate oxidase failed, so urine turns black",
        "Cystathionine synthase failed, so methionine is low and phenylalanine is a bystander",
        "A high-phenylalanine diet prevents the intellectual disability",
    ],
    "Phenylalanine hydroxylase or its biopterin cofactor failed; tyrosine must be supplied and phenylalanine restricted",
    "Phenylalanine cannot become tyrosine. It and its metabolites accumulate, which injures the developing brain and causes the musty odor and pale pigment because tyrosine is short for melanin. Treatment is a phenylalanine-restricted diet plus tyrosine, which has become essential. Tyrosinase deficiency is albinism without this amino-acid pair and without the musty delay. Homogentisate oxidase is alkaptonuria. Cystathionine synthase is homocystinuria. Feeding more phenylalanine is the exposure that causes the injury.",
    "robbins-10",
)

add(
    "Homocystinuria versus Marfan",
    5,
    "pathology",
    "A tall child has a downward lens dislocation, intellectual disability, and a clot in a leg vein. Homocysteine is high. A classmate with Marfan syndrome has an upward lens dislocation, a normal intellect, and an aortic root at risk. Someone prescribes a low-methionine plan for the Marfan patient.",
    "Which enzyme and which direction of the lens separate them?",
    [
        "Cystathionine synthase deficiency causes downward dislocation and thrombosis; Marfan is fibrillin with upward dislocation and no homocysteine clot",
        "Both are fibrillin defects and the lens direction is random",
        "Homocystinuria dislocates the lens upward",
        "Marfan syndrome causes fair hair and a musty urine",
        "Thrombosis means the child has too little homocysteine",
    ],
    "Cystathionine synthase deficiency causes downward dislocation and thrombosis; Marfan is fibrillin with upward dislocation and no homocysteine clot",
    "Classic homocystinuria cannot condense homocysteine with serine. Homocysteine injures vessels and the brain, and the lens zonules fail downward. Marfan syndrome is a connective-tissue microfibril disease: upward lens dislocation, aortic aneurysm, and normal intelligence, without a clotting amino acid. The lens direction is the clinical separator, not a coin flip. Upward dislocation is Marfan. A musty smell is PKU. The clot is from too much homocysteine, not too little.",
    "robbins-10",
)

add(
    "OTC deficiency",
    5,
    "physiology",
    "A male infant becomes lethargic as feeds increase. Ammonia is very high, BUN is low, and orotic acid is high in the urine. There is no megaloblastic anemia. A sister is healthy. A student picks orotic aciduria because orotic acid is high, and plans uridine only.",
    "Which cycle is blocked, and why is this not hereditary orotic aciduria?",
    [
        "Ornithine transcarbamylase is missing, so carbamoyl phosphate spills into pyrimidine synthesis and makes orotic acid; the emergency is hyperammonemia, and orotic aciduria the disease also has megaloblastic anemia and no ammonia crisis",
        "Arginase deficiency, which has a high BUN",
        "CPS-I deficiency, which also raises orotic acid",
        "The urea cycle is intact and the ammonia is from liver failure with a high BUN",
        "Uridine alone treats the X-linked ammonia crisis",
    ],
    "Ornithine transcarbamylase is missing, so carbamoyl phosphate spills into pyrimidine synthesis and makes orotic acid; the emergency is hyperammonemia, and orotic aciduria the disease also has megaloblastic anemia and no ammonia crisis",
    "OTC is X-linked. Carbamoyl phosphate cannot enter the urea cycle, ammonia rises, and the excess carbamoyl phosphate makes orotic acid. Hereditary orotic aciduria is a pyrimidine-synthesis defect with megaloblastic anemia and growth failure, and it does not present as a neonatal ammonia crisis; uridine helps that disease, not this one. Arginase deficiency is a later, different urea-cycle picture and does not raise BUN; BUN is low when the cycle is blocked. CPS-I deficiency raises ammonia but not orotic acid, because carbamoyl phosphate itself is not made. This is not intact-cycle liver failure. The treatment of the crisis is ammonia removal, not uridine monotherapy.",
    "guyton-14",
)

add(
    "Galactosemia",
    4,
    "physiology",
    "A newborn on milk becomes jaundiced, vomits, and has a reducing sugar in the urine that is not glucose on a glucose oxidase strip. E. coli sepsis is a worry. Cataracts are starting. The enzyme that makes galactose-1-phosphate is the one named in the severe form, and milk is stopped.",
    "What accumulates, and why is the urine trick useful?",
    [
        "Galactose-1-phosphate and galactitol accumulate because galactose-1-phosphate uridyltransferase is missing; the urine reduces copper but is not glucose",
        "Fructose-1-phosphate accumulates after the first milk feed",
        "Glucose-6-phosphatase deficiency presents on the first day of milk with cataracts",
        "The reducing sugar is glucose, so the oxidase strip should have been positive",
        "Stopping milk is useless because lactose is not the source of galactose",
    ],
    "Galactose-1-phosphate and galactitol accumulate because galactose-1-phosphate uridyltransferase is missing; the urine reduces copper but is not glucose",
    "Classic galactosemia lacks GALT. Galactose-1-phosphate is toxic to liver, kidney, and brain, and galactitol swells the lens. Milk lactose is glucose plus galactose, so stopping milk stops the source. The urine has galactose, a reducing sugar that glucose oxidase ignores. Hereditary fructose intolerance needs fructose, not the first milk. Von Gierke disease is a fasting glycogen problem, not cataracts from milk. A negative glucose oxidase strip is the point of the test. Lactose is exactly the dietary source.",
    "guyton-14",
)

add(
    "Hereditary fructose intolerance",
    4,
    "physiology",
    "A baby is fine on breast milk and becomes hypoglycemic and vomits when fruit juice and sucrose are added. The liver is tender and phosphate is low. Aldolase B is the enzyme. A parent was told this is galactosemia because both are sugar diseases of infants.",
    "Why did milk spare him, and what traps the phosphate?",
    [
        "Milk has no fructose; aldolase B failure traps fructose-1-phosphate and consumes phosphate, which blocks glycogenolysis and gluconeogenesis",
        "Breast milk is rich in fructose, so the story is impossible",
        "Galactosemia presents only after juice and spares milk",
        "Hexokinase is the missing enzyme, so fructose never gets phosphorylated",
        "Hypoglycemia means he needs more sucrose",
    ],
    "Milk has no fructose; aldolase B failure traps fructose-1-phosphate and consumes phosphate, which blocks glycogenolysis and gluconeogenesis",
    "Sucrose and fruit contain fructose. Aldolase B splits fructose-1-phosphate. Without it the phosphate ester accumulates, inorganic phosphate falls, and the liver cannot run glycogen breakdown or gluconeogenesis, so glucose falls. Breast milk does not contain fructose, which is why he was well at first. Galactosemia is triggered by milk, the opposite timing. The phosphorylating enzyme works; the cleavage enzyme does not. More sucrose is the poison.",
    "guyton-14",
)

add(
    "Spironolactone versus finasteride",
    4,
    "pharmacology",
    "A man on spironolactone for heart failure develops tender breast tissue. A second man takes finasteride for prostatic hyperplasia and is told his PSA and his scalp hair may change. A student says both drugs block the androgen receptor.",
    "Which receptor or enzyme does each drug hit?",
    [
        "Spironolactone blocks the androgen receptor as well as the mineralocorticoid receptor; finasteride inhibits 5-alpha reductase and lowers DHT without blocking the androgen receptor",
        "Finasteride is an androgen-receptor blocker and spironolactone only blocks 5-alpha reductase",
        "Both inhibit aromatase, so estrogen falls and breasts shrink",
        "Gynecomastia from spironolactone means the dose is subtherapeutic",
        "Finasteride raises DHT, which shrinks the prostate",
    ],
    "Spironolactone blocks the androgen receptor as well as the mineralocorticoid receptor; finasteride inhibits 5-alpha reductase and lowers DHT without blocking the androgen receptor",
    "Spironolactone's off-target androgen-receptor block is why men get gynecomastia. Finasteride and dutasteride block conversion of testosterone to the more potent DHT in prostate and hair follicle. Testosterone itself can still bind the androgen receptor, which is a different drug class (flutamide, spironolactone). Swapping the mechanisms swaps the side effects you warn about. They are not aromatase inhibitors; aromatase inhibition would lower estrogen. Breast tenderness is a real effect, not a sign of a tiny dose. Finasteride lowers DHT, which is how the prostate shrinks.",
    "katzung-16",
)

add(
    "Beta blocker and hypoglycemia",
    4,
    "pharmacology",
    "A man with type 1 diabetes is put on propranolol for tremor. During an insulin reaction he does not feel the usual pounding heart or tremor, and he is sweaty and confused by the time anyone notices. A nonselective beta blocker was chosen. A student says beta blockers raise glucose and cannot mask a low.",
    "Which warning symptoms are blocked, and which one remains?",
    [
        "Tremor and tachycardia are beta-adrenergic and are blunted; sweating is cholinergic and can remain, and recovery from hypoglycemia is also slowed because beta-2 helps counter-regulation",
        "Sweating is the symptom beta blockers remove, while tremor remains",
        "Propranolol causes hypoglycemia by releasing insulin",
        "Selective and nonselective agents are identical for this warning",
        "Masking means the glucose number on the meter rises falsely",
    ],
    "Tremor and tachycardia are beta-adrenergic and are blunted; sweating is cholinergic and can remain, and recovery from hypoglycemia is also slowed because beta-2 helps counter-regulation",
    "The adrenergic warning of hypoglycemia is a beta effect: shake and a fast heart. Propranolol blocks it, so the patient skips the early alarm and presents confused. Sweating is muscarinic and often persists, which is the clue that remains. Nonselective blockade also impairs glycogenolysis and gluconeogenesis that depend on beta-2. Sweating is not the blocked symptom. Propranolol does not release insulin the way a sulfonylurea does. Beta-1 selective drugs are somewhat less guilty, so they are not identical. The meter still reads a true low; the mask is symptomatic, not analytic.",
    "katzung-16",
)

add(
    "ACE inhibitor cough and pregnancy",
    5,
    "pharmacology",
    "A woman on lisinopril has a dry cough and a normal chest radiograph. She stops the drug and the cough ends. She later becomes pregnant while a relative restarts her on the same pill from an old bottle. She is in the second trimester.",
    "Why the cough, and why must the drug stop in pregnancy?",
    [
        "ACE inhibitors raise bradykinin, which coughs; in pregnancy they injure the fetal kidney and cause oligohydramnios, so they are stopped",
        "The cough is from low bradykinin and is treated by raising the dose",
        "ARBs cause the same cough as often as ACE inhibitors because both raise bradykinin equally",
        "ACE inhibitors are first-line antihypertensives throughout pregnancy",
        "Fetal injury is limited to the first 48 hours after conception and the second trimester is safe",
    ],
    "ACE inhibitors raise bradykinin, which coughs; in pregnancy they injure the fetal kidney and cause oligohydramnios, so they are stopped",
    "ACE normally degrades bradykinin. Inhibit it and bradykinin builds up in the lung and triggers a dry cough that goes away when the drug stops. The same blockade of angiotensin II formation is catastrophic for the fetal renal circulation later in pregnancy: oligohydramnios, skull and renal malformation. Raising the dose would worsen the cough. ARBs block the receptor and do not raise bradykinin the same way, so cough is much less common, but they are also teratogenic. They are contraindicated in pregnancy, not first-line. Injury continues through the second and third trimesters, which is why a leftover bottle is an emergency stop.",
    "katzung-16",
)

add(
    "Thyroid hormone in pregnancy",
    4,
    "physiology",
    "A pregnant woman on levothyroxine feels well but her TSH has risen above the pregnancy target. Estrogen is high and thyroxine-binding globulin is high. Free T4 is drifting down. A student says she needs less hormone because TBG is high and total T4 will look high even if she is hypothyroid.",
    "Why does the dose usually rise?",
    [
        "High TBG binds more hormone, and pregnancy increases clearance and volume; she needs more levothyroxine so free hormone and TSH stay normal. A high total T4 can hide a low free level",
        "Pregnancy lowers TBG, so the dose is cut in half",
        "TSH is an unreliable pregnancy lab and should be ignored",
        "Levothyroxine is stopped in pregnancy because it does not cross any relevant pathway to the fetus",
        "Free T4 falling means she is hyperthyroid and the dose is too high",
    ],
    "High TBG binds more hormone, and pregnancy increases clearance and volume; she needs more levothyroxine so free hormone and TSH stay normal. A high total T4 can hide a low free level",
    "Estrogen raises thyroxine-binding globulin. More hormone is bound, free hormone tends to fall, TSH rises, and the replacement dose is increased, often early in pregnancy. Total T4 rises with the binding protein and is a trap if you treat the total and not the free level and the TSH. TBG goes up, not down. TSH remains the guide, with pregnancy-specific ranges. Maternal thyroid hormone matters for the fetus, especially early, and is not stopped. A falling free T4 is hypothyroidism, not excess.",
    "guyton-14",
)

add(
    "Amiodarone thyroid",
    5,
    "pharmacology",
    "A man on amiodarone for atrial fibrillation has a low TSH and a high free T4. One mechanism discussed is iodine load causing hyperthyroidism in a nodular gland, and another is thyroiditis from the drug. A student says amiodarone only causes hypothyroidism because it blocks conversion of T4 to T3, so a low TSH is impossible.",
    "Which statement is right?",
    [
        "Amiodarone can cause either hypothyroidism or hyperthyroidism; blocked T4-to-T3 conversion can raise T4, but a suppressed TSH means real thyrotoxicosis that still has to be sorted into iodine-induced versus destructive",
        "Amiodarone never affects the thyroid because it contains no iodine",
        "A low TSH on amiodarone is always hypothyroidism",
        "Type 1 and type 2 amiodarone thyrotoxicosis are treated identically with high-dose hormone replacement",
        "Stopping the interpretation at the deiodinase block is enough when TSH is suppressed",
    ],
    "Amiodarone can cause either hypothyroidism or hyperthyroidism; blocked T4-to-T3 conversion can raise T4, but a suppressed TSH means real thyrotoxicosis that still has to be sorted into iodine-induced versus destructive",
    "Amiodarone is iodine-rich and also inhibits peripheral deiodinase. Hypothyroidism is common, especially where iodine is sufficient. Hyperthyroidism also occurs: type 1 is extra synthesis in a nodular or Graves gland, type 2 is destructive thyroiditis. A low TSH is not hypothyroidism. The drug is loaded with iodine. High-dose levothyroxine is the wrong direction for thyrotoxicosis. The deiodinase effect can confuse total and free levels, but a suppressed TSH is not dismissed as a lab quirk.",
    "katzung-16",
)
