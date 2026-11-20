"""Step 1 reproductive and endocrine mechanism items. Highest-yield traps."""

ITEMS = []


def add(topic, diff, subject, scenario, question, options, key, expl, ref):
    assert key in options and len(options) == 5 and len(set(options)) == 5
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
    "21-hydroxylase salt wasting",
    4,
    "pathology",
    "A 9-day-old 46,XX infant is brought in after two days of vomiting and listlessness. The clitoris is enlarged and the labia are rugated and partly fused. Blood pressure is 58/32 mm Hg. Sodium is 124 mEq/L, potassium is 6.8 mEq/L, glucose is 46 mg/dL, and plasma renin activity is high. Cortisol is low, androstenedione is high, and 17-hydroxyprogesterone is more than twenty times the newborn reference limit. There is no hypertension, the mother did not virilize during pregnancy, and the skeleton is normal. Volume resuscitation and stress-dose glucocorticoid are started while the confirmatory steroid panel is pending.",
    "Which enzyme block explains both the salt-wasting crisis and the virilization?",
    [
        "21-hydroxylase block, so cortisol and aldosterone fail while precursors shunt into adrenal androgens",
        "11-beta-hydroxylase block, so deoxycorticosterone causes hypertension and hypokalemia",
        "17-alpha-hydroxylase block, so sex steroids are absent and mineralocorticoids cause hypertension",
        "3-beta-hydroxysteroid dehydrogenase block, with dominant DHEA elevation rather than 17-hydroxyprogesterone",
        "Aromatase block, so maternal virilization occurs and estrogen cannot be formed",
    ],
    "21-hydroxylase block, so cortisol and aldosterone fail while precursors shunt into adrenal androgens",
    "CYP21A2 failure stops progesterone from becoming deoxycorticosterone and stops 17-hydroxyprogesterone from becoming 11-deoxycortisol, so aldosterone and cortisol both collapse. ACTH rises, the blocked precursors spill into androstenedione and testosterone, and a 46,XX fetus is virilized. The marker is a very high 17-hydroxyprogesterone with hyponatremia, hyperkalemia, and hypotension. 11-beta-hydroxylase block, so deoxycorticosterone causes hypertension and hypokalemia is the opposite blood-pressure picture: deoxycorticosterone excess raises pressure and lowers potassium, and 11-deoxycortisol rather than this degree of isolated 17-hydroxyprogesterone dominance is the clue. 17-alpha-hydroxylase block, so sex steroids are absent and mineralocorticoids cause hypertension cannot virilize anyone, because the path into androgens is closed and the infant would be hypertensive from corticosterone and deoxycorticosterone. 3-beta-hydroxysteroid dehydrogenase block, with dominant DHEA elevation rather than 17-hydroxyprogesterone leaves pregnenolone products high and 17-hydroxyprogesterone low, and a genetic male is undervirilized rather than a female being strongly androgenized by potent androgens. Aromatase block, so maternal virilization occurs and estrogen cannot be formed does not cause neonatal adrenal crisis, hyperkalemia, or cortisol deficiency, and the mother in this case had a normal pregnancy.",
    "robbins-10",
)

add(
    "11-beta-hydroxylase deficiency",
    5,
    "pathology",
    "A 3-week-old 46,XX infant has ambiguous genitalia with clitoromegaly and labial fusion. Unlike the salt-losing infants in the same nursery, this child is hypertensive at 112/74 mm Hg and the potassium is 2.9 mEq/L. Renin is suppressed. Cortisol is low, ACTH is high, and both 11-deoxycortisol and deoxycorticosterone are markedly elevated. 17-hydroxyprogesterone is only modestly up, and there is no genital ambiguity from absent sex steroids. The family history is negative for early hemorrhagic stroke. Glucocorticoid replacement is being planned to suppress ACTH.",
    "Which enzyme failure produces virilization together with mineralocorticoid hypertension?",
    [
        "11-beta-hydroxylase failure, letting deoxycorticosterone and 11-deoxycortisol accumulate",
        "21-hydroxylase failure, with renin-driven salt wasting and hyperkalemia as the dominant state",
        "Aldosterone synthase failure alone, which virilizes the fetus and raises blood pressure",
        "17-alpha-hydroxylase failure, which removes sex steroids and still causes hypertension",
        "A chimeric aldosterone synthase under ACTH control, with high 18-oxocortisol and no virilization",
    ],
    "11-beta-hydroxylase failure, letting deoxycorticosterone and 11-deoxycortisol accumulate",
    "CYP11B1 performs the last step from 11-deoxycortisol to cortisol and from deoxycorticosterone to corticosterone. When it fails, cortisol falls, ACTH rises, and the gland is driven into androgen production, so a female fetus virilizes. Deoxycorticosterone is itself a mineralocorticoid, so sodium is retained, potassium falls, renin is suppressed, and blood pressure rises. 21-hydroxylase failure, with renin-driven salt wasting and hyperkalemia as the dominant state is the common trap because 17-hydroxyprogesterone can rise in both, but that block destroys aldosterone and presents with shock and high potassium, not hypertension. Aldosterone synthase failure alone, which virilizes the fetus and raises blood pressure does neither: CYP11B2 loss causes salt wasting without androgen excess or high blood pressure. 17-alpha-hydroxylase failure, which removes sex steroids and still causes hypertension also retains sodium through deoxycorticosterone, but it closes the road to androgens, so the infant is sexually infantile rather than virilized. A chimeric aldosterone synthase under ACTH control, with high 18-oxocortisol and no virilization is glucocorticoid-remediable aldosteronism, a hypertensive mineralocorticoid syndrome without genital ambiguity.",
    "robbins-10",
)

add(
    "17-alpha-hydroxylase deficiency",
    5,
    "pathology",
    "A 16-year-old adolescent who was raised as a girl is evaluated for absent breast development and primary amenorrhea. Blood pressure is 158/96 mm Hg and potassium is 2.8 mEq/L. Renin and aldosterone are both suppressed. Pelvic ultrasound shows no uterus. Karyotype is 46,XY, and gonads are located in the inguinal canals. Cortisol is low, ACTH is elevated, deoxycorticosterone and corticosterone are high, and testosterone, androstenedione, and estradiol are all near zero. 17-hydroxyprogesterone is not elevated. There is no salt-wasting history and no maternal virilization.",
    "Which single enzyme loss explains absent sex steroids plus mineralocorticoid hypertension?",
    [
        "17-alpha-hydroxylase loss, blocking cortisol and sex steroids while deoxycorticosterone builds up",
        "21-hydroxylase loss, shunting the pathway into testosterone and causing neonatal salt wasting",
        "11-beta-hydroxylase loss, which virilizes a 46,XX fetus and raises 11-deoxycortisol",
        "5-alpha-reductase loss, so dihydrotestosterone is low but testosterone at puberty is high",
        "Aromatase loss, so androgens are high and a mother virilizes while carrying the pregnancy",
    ],
    "17-alpha-hydroxylase loss, blocking cortisol and sex steroids while deoxycorticosterone builds up",
    "CYP17A1 is required both for 17-hydroxylation on the way to cortisol and for the 17,20-lyase step that makes sex steroids. Without it, pregnenolone is driven into deoxycorticosterone and corticosterone. Those mineralocorticoids expand volume, suppress renin and aldosterone, waste potassium, and raise blood pressure, while corticosterone supplies enough glucocorticoid activity that a neonatal crisis is often avoided. Testes still make anti-Mullerian hormone, so there is no uterus, but they make no testosterone, so the external genitalia are female and puberty never produces breasts or hair. 21-hydroxylase loss, shunting the pathway into testosterone and causing neonatal salt wasting would raise 17-hydroxyprogesterone and androgens and would present with hyperkalemic shock, not absent sex steroids and hypertension. 11-beta-hydroxylase loss, which virilizes a 46,XX fetus and raises 11-deoxycortisol also causes deoxycorticosterone hypertension, but androgens are high, not zero. 5-alpha-reductase loss, so dihydrotestosterone is low but testosterone at puberty is high leaves testosterone intact, so the phenotype virilizes at puberty and the hormone profile is the opposite of near-zero testosterone. Aromatase loss, so androgens are high and a mother virilizes while carrying the pregnancy increases androgens and does not create mineralocorticoid hypertension or a low cortisol.",
    "robbins-10",
)

add(
    "3-beta-hydroxysteroid dehydrogenase deficiency",
    5,
    "pathology",
    "A newborn with ambiguous genitalia develops hypotension, sodium of 121 mEq/L, and potassium of 7.1 mEq/L in the first week. Karyotype is 46,XY. The phallus is small, the urethra opens at the base, and a uterus is absent. The steroid panel shows very high pregnenolone, 17-hydroxypregnenolone, and DHEA, with low progesterone, low 17-hydroxyprogesterone, low cortisol, low aldosterone, and low testosterone. Potent androgens such as androstenedione are not the elevated species. Blood pressure is low rather than high, and the skeletal survey is normal.",
    "Which enzyme defect fits salt wasting with a weak-androgen pattern in a genetic male?",
    [
        "3-beta-hydroxysteroid dehydrogenase defect, stacking DHEA while all delta-4 steroids collapse",
        "21-hydroxylase defect, with a diagnostic surge of 17-hydroxyprogesterone and potent androgens",
        "11-beta-hydroxylase defect, with hypertension from deoxycorticosterone and high 11-deoxycortisol",
        "17-alpha-hydroxylase defect, with hypertension, absent androgens, and high corticosterone",
        "Steroidogenic acute regulatory protein defect, with lipid-laden adrenals and no steroid measurable at all",
    ],
    "3-beta-hydroxysteroid dehydrogenase defect, stacking DHEA while all delta-4 steroids collapse",
    "3-beta-hydroxysteroid dehydrogenase converts delta-5 steroids to delta-4 steroids in both adrenal and gonad. Without it, cortisol, aldosterone, progesterone, and testosterone cannot be made, so the infant salt-wastes. The backlog is pregnenolone, 17-hydroxypregnenolone, and DHEA. DHEA is a weak androgen: it is enough to mildly virilize a female fetus but not enough to finish male external genitalia, so a 46,XY infant is undervirilized and still lacks a uterus because anti-Mullerian hormone was present. 21-hydroxylase defect, with a diagnostic surge of 17-hydroxyprogesterone and potent androgens would raise, not lower, 17-hydroxyprogesterone and would produce strong androgens. 11-beta-hydroxylase defect, with hypertension from deoxycorticosterone and high 11-deoxycortisol is a hypertensive virilizing state, not shock with hyperkalemia. 17-alpha-hydroxylase defect, with hypertension, absent androgens, and high corticosterone also fails to make sex steroids, but blood pressure is high and DHEA is not the piled-up product. Steroidogenic acute regulatory protein defect, with lipid-laden adrenals and no steroid measurable at all blocks the mitochondrial cholesterol door, so DHEA itself is low and the adrenals are packed with lipid.",
    "robbins-10",
)

add(
    "Congenital lipoid adrenal hyperplasia",
    5,
    "pathology",
    "A 12-day-old phenotypic female infant presents in shock. Sodium is 119 mEq/L, potassium is 7.4 mEq/L, glucose is 38 mg/dL, and ACTH is extremely high. Every measured adrenal and gonadal steroid, including 17-hydroxyprogesterone, DHEA, cortisol, aldosterone, and testosterone, is low. Imaging shows massively enlarged adrenals that are bright from accumulated lipid. Karyotype returns 46,XY. There is no uterus. The external genitalia are unambiguously female. Maternal virilization did not occur, and the infant is not hypertensive.",
    "Why are all steroids absent and why is this genetic male externally female?",
    [
        "Steroidogenic acute regulatory protein failure traps cholesterol outside mitochondria, so no steroid is made and fetal Leydig cells die",
        "21-hydroxylase failure with lipid storage as a late secondary change and high 17-hydroxyprogesterone",
        "17-alpha-hydroxylase failure, preserving mineralocorticoids and causing hypertension rather than shock",
        "Aromatase failure, with high fetal androgens exported to the mother during pregnancy",
        "Anti-Mullerian hormone receptor failure, leaving a uterus inside a phenotypic male",
    ],
    "Steroidogenic acute regulatory protein failure traps cholesterol outside mitochondria, so no steroid is made and fetal Leydig cells die",
    "Cholesterol side-chain cleavage sits inside mitochondria. The steroidogenic acute regulatory protein moves cholesterol to that enzyme. When the protein is absent or inactive, almost no steroid of any class is produced. ACTH drive packs the adrenal cortex with cholesterol esters, which is the lipoid appearance. Fetal Leydig cells are destroyed by the same lipid accumulation, so an XY fetus makes neither testosterone nor, after the early window, the androgens needed for male external genitalia. Sertoli cells still make anti-Mullerian hormone early, so no uterus forms. 21-hydroxylase failure with lipid storage as a late secondary change and high 17-hydroxyprogesterone produces high, not low, 17-hydroxyprogesterone and abundant androgens. 17-alpha-hydroxylase failure, preserving mineralocorticoids and causing hypertension rather than shock leaves deoxycorticosterone and corticosterone intact. Aromatase failure, with high fetal androgens exported to the mother during pregnancy raises androgens and virilizes the mother; it does not empty every steroid or enlarge the adrenals with lipid. Anti-Mullerian hormone receptor failure, leaving a uterus inside a phenotypic male is persistent Mullerian duct syndrome, in which external genitalia and testosterone are male.",
    "robbins-10",
)

add(
    "Aromatase deficiency",
    5,
    "pathology",
    "A 15-year-old 46,XX adolescent has primary amenorrhea, no breast development, clitoromegaly, and cystic ovaries. Height is above the mid-parental target and the growth plates remain open. Bone density is low. Estradiol and estrone are undetectable, androstenedione and testosterone are high, and both LH and FSH are high. Cortisol, blood pressure, and potassium are normal, and 17-hydroxyprogesterone is normal. The mother remembers a deepening voice and new facial hair that began late in that pregnancy and receded within weeks after delivery. There is no cafe-au-lait pigmentation.",
    "Which enzyme failure links maternal virilization in pregnancy to this adolescent phenotype?",
    [
        "Placental and ovarian aromatase failure, so androgens cannot become estrogens",
        "21-hydroxylase failure, with lifelong cortisol deficiency and high 17-hydroxyprogesterone",
        "5-alpha-reductase failure in a 46,XY fetus, with a high testosterone-to-dihydrotestosterone ratio",
        "Androgen receptor failure, with breast development from unopposed aromatized estrogen",
        "11-beta-hydroxylase failure, adding hypertension and hypokalemia to virilization",
    ],
    "Placental and ovarian aromatase failure, so androgens cannot become estrogens",
    "Aromatase (CYP19) converts androstenedione and testosterone to estrone and estradiol in the ovary, adipose tissue, and placenta. A fetus who cannot perform that conversion sends androgens across the placenta, and the mother virilizes until delivery removes the source. The 46,XX child is born virilized, cannot make estrogen at puberty, so breasts never develop, the epiphyses do not close, bone is undermineralized, and gonadotropins rise because estrogen negative feedback is missing. Ovarian androgens accumulate and multicystic ovaries form. Cortisol production is intact. 21-hydroxylase failure, with lifelong cortisol deficiency and high 17-hydroxyprogesterone would have shown adrenal crisis or at least an elevated 17-hydroxyprogesterone and abnormal electrolytes, and it does not virilize the mother only during pregnancy. 5-alpha-reductase failure in a 46,XY fetus, with a high testosterone-to-dihydrotestosterone ratio is an XY disorder with testes and no uterus, and puberty virilizes rather than leaving estrogen at zero in an XX adolescent. Androgen receptor failure, with breast development from unopposed aromatized estrogen produces breasts and absent pubic hair in an XY individual whose testosterone is high and whose receptors cannot read it. 11-beta-hydroxylase failure, adding hypertension and hypokalemia to virilization is an adrenal enzyme block with mineralocorticoid hypertension, absent from this normal blood pressure and potassium.",
    "robbins-10",
)

add(
    "Nonclassic 21-hydroxylase versus PCOS",
    5,
    "pathology",
    "A 22-year-old woman has worsening hirsutism, acne, and cycles every 45 to 70 days. Blood pressure is 118/72 mm Hg, potassium is 4.1 mEq/L, and she has never had a salt-losing illness. Morning 17-hydroxyprogesterone is 680 ng/dL, and it rises above 2000 ng/dL sixty minutes after cosyntropin. Androstenedione is high, cortisol stimulates adequately, and a pelvic ultrasound shows enlarged ovaries with many small follicles. LH is mildly higher than FSH. A clinician has already labeled this polycystic ovary syndrome and started spironolactone. She asks why the steroid number changes the mechanism.",
    "What distinguishes this androgen excess from ordinary polycystic ovary syndrome?",
    [
        "Partial 21-hydroxylase deficiency with ACTH-driven androgen shunt and a diagnostic 17-hydroxyprogesterone rise",
        "LH-driven theca androgen production with insulin suppressing SHBG and a normal 17-hydroxyprogesterone",
        "An androgen-secreting adrenal adenoma with suppressed ACTH and a unilateral adrenal mass",
        "Cushing disease with failed low-dose dexamethasone suppression and high urinary free cortisol",
        "Exogenous testosterone gel exposure with suppressed LH and a low androstenedione",
    ],
    "Partial 21-hydroxylase deficiency with ACTH-driven androgen shunt and a diagnostic 17-hydroxyprogesterone rise",
    "Nonclassic 21-hydroxylase deficiency is a partial CYP21A2 block. Cortisol and aldosterone are adequate for daily life, so blood pressure and potassium stay normal and there is no neonatal crisis, but ACTH still pushes the backed-up pathway into androgens. Basal 17-hydroxyprogesterone is already high for a follicular-phase morning, and cosyntropin drives it into the diagnostic range. The ovarian morphology can look polycystic because androgens disturb follicles, which is why the label sticks. LH-driven theca androgen production with insulin suppressing SHBG and a normal 17-hydroxyprogesterone is the actual polycystic ovary mechanism and does not produce a cosyntropin-stimulated 17-hydroxyprogesterone in the thousands. An androgen-secreting adrenal adenoma with suppressed ACTH and a unilateral adrenal mass would suppress ACTH and show a mass, not an ACTH-responsive precursor pattern. Cushing disease with failed low-dose dexamethasone suppression and high urinary free cortisol is a cortisol problem with catabolic signs, not an isolated 17-hydroxyprogesterone story. Exogenous testosterone gel exposure with suppressed LH and a low androstenedione lowers LH and does not elevate the adrenal precursor that responds to cosyntropin.",
    "robbins-10",
)

add(
    "P450 oxidoreductase deficiency",
    5,
    "pathology",
    "A newborn has ambiguous genitalia, craniosynostosis, bowed femurs, and radiohumeral synostosis. Cortisol is low and ACTH is high. Progesterone and 17-hydroxyprogesterone are both elevated, while testosterone and estradiol are low for the degree of genital ambiguity. The mother developed acne and a deeper voice in the third trimester that improved after birth. Karyotype is 46,XX. A fibroblast growth factor receptor 2 sequencing panel, sent because of the skeletal shape, is negative. Blood pressure is normal and potassium is high-normal during a mild stress.",
    "Why do skeletal anomalies and a mixed steroid block travel together here?",
    [
        "P450 oxidoreductase deficiency, starving multiple microsomal cytochrome enzymes of electrons",
        "Isolated 21-hydroxylase deficiency, which also fuses the radius to the humerus",
        "Fibroblast growth factor receptor 2 gain of function with a normal steroid profile",
        "Aromatase deficiency alone, which ossifies cranial sutures and lowers cortisol",
        "11-beta-hydroxylase deficiency, which lengthens bones by excess deoxycorticosterone",
    ],
    "P450 oxidoreductase deficiency, starving multiple microsomal cytochrome enzymes of electrons",
    "P450 oxidoreductase donates electrons to every microsomal cytochrome P450, including 17-alpha-hydroxylase, 21-hydroxylase, and aromatase, and also to enzymes of cholesterol synthesis that the skeleton needs. A partial combined block produces ambiguous genitalia in both sexes: conventional androgen synthesis is impaired, yet an alternative backdoor path to androgen can still virilize a female fetus and the mother. Cortisol is low. The skeletal picture, especially craniosynostosis with radiohumeral synostosis, is Antley-Bixler syndrome with disordered steroidogenesis. Isolated 21-hydroxylase deficiency, which also fuses the radius to the humerus does not change bone shape; the virilization is pure androgen excess with a single-enzyme precursor pattern. Fibroblast growth factor receptor 2 gain of function with a normal steroid profile can mimic the bones but leaves steroids normal, and that panel was negative. Aromatase deficiency alone, which ossifies cranial sutures and lowers cortisol virilizes mother and baby through androgen excess but does not lower cortisol or synostose the radius to the humerus. 11-beta-hydroxylase deficiency, which lengthens bones by excess deoxycorticosterone causes hypertension and virilization without this skeletal syndrome.",
    "robbins-10",
)

add(
    "Apparent mineralocorticoid excess",
    5,
    "pathology",
    "A 44-year-old man has blood pressure 176/104 mm Hg and potassium 2.7 mEq/L after three months of eating large amounts of natural black licorice. He is not on a diuretic. Plasma renin is suppressed and aldosterone is suppressed. Arterial blood gas shows a metabolic alkalosis. The ratio of urinary free cortisol to urinary free cortisone is high. Morning cortisol and ACTH are normal, and a CT of the adrenals shows no nodule. When he stops the licorice, the pressure and potassium slowly improve. He has no family history of early stroke.",
    "Which enzyme is inhibited, and why does cortisol behave like aldosterone?",
    [
        "11-beta-hydroxysteroid dehydrogenase type 2 is inhibited, so cortisol occupies the mineralocorticoid receptor",
        "Aldosterone synthase is overactive, so aldosterone itself is high and renin is low",
        "Epithelial sodium channel degradation fails, and spironolactone is the specific antidote",
        "11-beta-hydroxylase is congenitally absent, so deoxycorticosterone and androgens both rise",
        "21-hydroxylase is blocked, so renin rises and potassium rises with salt wasting",
    ],
    "11-beta-hydroxysteroid dehydrogenase type 2 is inhibited, so cortisol occupies the mineralocorticoid receptor",
    "The mineralocorticoid receptor cannot distinguish cortisol from aldosterone, and cortisol circulates at much higher levels. In aldosterone target cells, 11-beta-hydroxysteroid dehydrogenase type 2 converts cortisol to inactive cortisone. Glycyrrhetinic acid in licorice inhibits that enzyme, so cortisol floods the receptor, epithelial sodium channels open, potassium is secreted, renin falls, and aldosterone falls because volume is expanded. The biochemical signature is a high urinary cortisol-to-cortisone ratio with both renin and aldosterone suppressed. Aldosterone synthase is overactive, so aldosterone itself is high and renin is low describes primary aldosteronism, which this suppressed aldosterone excludes. Epithelial sodium channel degradation fails, and spironolactone is the specific antidote is Liddle syndrome; the channel is downstream of the receptor, the cortisol-to-cortisone ratio is normal, and the drug that works is amiloride, not a receptor blocker. 11-beta-hydroxylase is congenitally absent, so deoxycorticosterone and androgens both rise is a virilizing congenital enzyme loss with high deoxycorticosterone, not an acquired licorice effect in an adult with normal androgens. 21-hydroxylase is blocked, so renin rises and potassium rises with salt wasting is the salt-losing direction, opposite this hypertension and low potassium.",
    "robbins-10",
)

add(
    "Liddle syndrome drug choice",
    5,
    "pharmacology",
    "A 27-year-old man has blood pressure 168/102 mm Hg, potassium 2.9 mEq/L, and a metabolic alkalosis. Renin is low and aldosterone is low. The urinary cortisol-to-cortisone ratio is normal. His father and brother have the same pattern and early hypertension. Spironolactone for eight weeks did not move the potassium or the pressure. There is no licorice intake, no licorice-flavored tobacco, and dexamethasone for two weeks also changed nothing. A genetics report shows a mutation that removes the PY motif from the beta subunit of the epithelial sodium channel.",
    "Which drug class works, and why did mineralocorticoid blockade fail?",
    [
        "Amiloride blocks the constitutively open epithelial sodium channel that no longer needs aldosterone",
        "Spironolactone blocks mineralocorticoid receptors that are being driven by excess aldosterone",
        "Dexamethasone suppresses an ACTH-dependent chimeric aldosterone synthase",
        "Losartan blocks angiotensin II that is elevated because renin is high",
        "Hydrochlorothiazide inhibits the sodium-chloride cotransporter that is overactive in this disease",
    ],
    "Amiloride blocks the constitutively open epithelial sodium channel that no longer needs aldosterone",
    "Liddle syndrome is a gain of function in the epithelial sodium channel. The PY motif that Nedd4-2 uses to remove the channel is gone, so channels stay in the apical membrane of the collecting duct whether or not aldosterone is present. Sodium is reabsorbed, potassium is wasted, volume expands, and both renin and aldosterone are suppressed. Because the channel is locked on downstream of the receptor, a receptor antagonist cannot turn it off. Amiloride or triamterene blocks the channel itself. Spironolactone blocks mineralocorticoid receptors that are being driven by excess aldosterone would work in primary aldosteronism or apparent mineralocorticoid excess, where the receptor is the problem and aldosterone or cortisol is the ligand; here aldosterone is low and the trial already failed. Dexamethasone suppresses an ACTH-dependent chimeric aldosterone synthase is the treatment of glucocorticoid-remediable aldosteronism, which has high aldosterone and a response to dexamethasone this patient did not show. Losartan blocks angiotensin II that is elevated because renin is high misses the suppressed renin: there is no angiotensin drive to block. Hydrochlorothiazide inhibits the sodium-chloride cotransporter that is overactive in this disease targets the wrong nephron transporter; that cotransporter is the one that is underactive in Gitelman syndrome, which causes low blood pressure.",
    "katzung-16",
)

add(
    "Glucocorticoid-remediable aldosteronism",
    5,
    "pathology",
    "A 19-year-old man has blood pressure 164/100 mm Hg and potassium 3.3 mEq/L. Plasma renin is suppressed and aldosterone is high. His father died of a cerebral hemorrhage at 32, and a paternal uncle is hypertensive. Low-dose dexamethasone for several days drops the aldosterone and begins to improve the potassium. Urinary 18-hydroxycortisol and 18-oxocortisol are markedly elevated. Adrenal CT shows no adenoma. He is not virilized, cortisol production is otherwise normal, and he does not eat licorice. A crossover between two closely related cytochrome genes is suspected.",
    "Which gene event lets ACTH drive aldosterone production?",
    [
        "A chimeric gene places aldosterone synthase coding sequence under the ACTH-responsive 11-beta-hydroxylase promoter",
        "An adrenal adenoma secretes aldosterone that rises further when dexamethasone removes ACTH",
        "Inactivating mutation of 11-beta-hydroxysteroid dehydrogenase lets cortisol activate the mineralocorticoid receptor",
        "A constitutively open epithelial sodium channel suppresses aldosterone and ignores dexamethasone",
        "21-hydroxylase deficiency shunts pregnenolone into testosterone and raises renin",
    ],
    "A chimeric gene places aldosterone synthase coding sequence under the ACTH-responsive 11-beta-hydroxylase promoter",
    "CYP11B1 and CYP11B2 sit next to each other. Unequal crossing over can put the coding region of aldosterone synthase (CYP11B2) behind the ACTH-driven promoter of 11-beta-hydroxylase (CYP11B1). Aldosterone is then made in the zona fasciculata under ACTH control, independent of angiotensin II. Renin is suppressed by volume expansion. The fasciculata also makes the hybrid steroids 18-hydroxycortisol and 18-oxocortisol. Dexamethasone turns off ACTH and therefore turns off the chimeric enzyme, which is why the aldosterone falls. The family history of early hemorrhagic stroke is characteristic. An adrenal adenoma secretes aldosterone that rises further when dexamethasone removes ACTH is ordinary primary aldosteronism: dexamethasone does not suppress an adenoma, and hybrid steroids are not the marker. Inactivating mutation of 11-beta-hydroxysteroid dehydrogenase lets cortisol activate the mineralocorticoid receptor suppresses aldosterone rather than raising it. A constitutively open epithelial sodium channel suppresses aldosterone and ignores dexamethasone is Liddle syndrome, where aldosterone is low and dexamethasone is irrelevant. 21-hydroxylase deficiency shunts pregnenolone into testosterone and raises renin is a virilizing, usually salt-wasting state with high renin, not ACTH-dependent aldosterone.",
    "robbins-10",
)

add(
    "Secondary adrenal insufficiency",
    5,
    "pathology",
    "A 38-year-old woman stops a two-year course of prednisone for asthma over three days. Ten days later she has fatigue, nausea, and blood pressure 86/54 mm Hg during a viral illness. Sodium is 128 mEq/L, potassium is 4.0 mEq/L, and glucose is 58 mg/dL. Morning cortisol is 2 mcg/dL and ACTH is undetectable. She is pale, not hyperpigmented. A cosyntropin test is blunted because the adrenal cortex has been asleep. Renin is normal. She has no vitiligo and no history of meningitis. Thyroid hormone is normal.",
    "Why is potassium normal despite cortisol deficiency and hyponatremia?",
    [
        "Zona glomerulosa aldosterone secretion is maintained by angiotensin II, so potassium handling stays intact",
        "Primary adrenal destruction removes both cortisol and aldosterone, which must raise potassium",
        "ACTH excess darkens the skin and is required for the hyponatremia of cortisol deficiency",
        "Prednisone withdrawal increases renin and therefore increases aldosterone to the point of hyperkalemia",
        "Cortisol deficiency blocks the epithelial sodium channel directly and always causes hyperkalemia",
    ],
    "Zona glomerulosa aldosterone secretion is maintained by angiotensin II, so potassium handling stays intact",
    "Long-term glucocorticoid use suppresses CRH and ACTH. The ACTH-dependent zona fasciculata atrophies, so cortisol is low and a new illness can precipitate crisis. The zona glomerulosa is controlled mainly by angiotensin II and potassium, not by ACTH, so aldosterone continues and potassium stays normal. Hyponatremia still happens because cortisol deficiency removes negative feedback on vasopressin and impairs free-water excretion. Pale skin fits low ACTH, the opposite of melanocyte stimulation. Primary adrenal destruction removes both cortisol and aldosterone, which must raise potassium is Addison disease: high ACTH, hyperpigmentation, high renin, and hyperkalemia, none of which are present. ACTH excess darkens the skin and is required for the hyponatremia of cortisol deficiency reverses the ACTH finding; hyponatremia here occurs with low ACTH. Prednisone withdrawal increases renin and therefore increases aldosterone to the point of hyperkalemia invents a renin surge this normal renin and normal potassium do not show. Cortisol deficiency blocks the epithelial sodium channel directly and always causes hyperkalemia confuses cortisol with aldosterone; cortisol is not the ligand that must be present for everyday potassium secretion.",
    "robbins-10",
)

add(
    "Ectopic ACTH feedback",
    5,
    "pathology",
    "A 58-year-old man with a 40-pack-year smoking history has rapid weight gain in the face and trunk, profound proximal weakness, easy bruising, and blood pressure 170/100 mm Hg. Potassium is 2.4 mEq/L and glucose is 240 mg/dL. Morning cortisol is very high and ACTH is very high. A 1 mg overnight dexamethasone test does not suppress cortisol, and an 8 mg high-dose test also fails to suppress it. CRH stimulation does not raise ACTH further. Chest CT shows a central lung mass. Inferior petrosal sinus sampling is not elevated relative to peripheral blood. He is deeply pigmented.",
    "Why does high-dose dexamethasone fail to suppress cortisol in this patient?",
    [
        "Ectopic ACTH secretion lacks the partial glucocorticoid feedback retained by a pituitary corticotroph adenoma",
        "A pituitary microadenoma suppresses only when the dexamethasone dose is kept at 1 mg",
        "An adrenal cortisol-secreting adenoma raises ACTH and then ignores dexamethasone",
        "Exogenous prednisone use raises measured ACTH and darkens the skin",
        "Glucocorticoid-remediable aldosteronism raises cortisol and fails every dexamethasone test",
    ],
    "Ectopic ACTH secretion lacks the partial glucocorticoid feedback retained by a pituitary corticotroph adenoma",
    "Cushing disease from a pituitary adenoma usually keeps enough glucocorticoid-receptor feedback that a high dexamethasone dose can still reduce ACTH, even though a low dose cannot. Most ectopic ACTH tumors, classically small cell lung carcinoma, do not have that feedback machinery, so neither low-dose nor high-dose dexamethasone moves the cortisol, and CRH does not provoke a further rise. Extremely high cortisol overwhelms 11-beta-hydroxysteroid dehydrogenase type 2, so cortisol activates mineralocorticoid receptors and potassium falls. High ACTH also pigments the skin. A pituitary microadenoma suppresses only when the dexamethasone dose is kept at 1 mg reverses the doses: the low dose fails in every endogenous Cushing state, and the high dose is the one that can suppress pituitary disease. An adrenal cortisol-secreting adenoma raises ACTH and then ignores dexamethasone actually suppresses ACTH by cortisol negative feedback; ACTH would be low, not high. Exogenous prednisone use raises measured ACTH and darkens the skin does the opposite to ACTH and does not create a lung mass or true hyperpigmentation from ACTH. Glucocorticoid-remediable aldosteronism raises cortisol and fails every dexamethasone test is an aldosterone disorder that suppresses with dexamethasone and does not raise cortisol into the Cushing range.",
    "robbins-10",
)

add(
    "Abiraterone mineralocorticoid shunt",
    5,
    "pharmacology",
    "A 71-year-old man with metastatic prostate cancer starts abiraterone. Three weeks later blood pressure is 166/98 mm Hg, potassium is 3.0 mEq/L, and he has mild edema. PSA has fallen. Testosterone is suppressed. Morning cortisol is low and ACTH is high. Renin is suppressed. He was not prescribed a glucocorticoid with the new drug. The oncology fellow adds prednisone 5 mg daily, and over the next two weeks the pressure falls and the potassium rises without stopping abiraterone.",
    "Why did hypertension and hypokalemia appear, and why does prednisone reverse them?",
    [
        "CYP17 blockade lowers cortisol, ACTH rises, and deoxycorticosterone accumulates until prednisone suppresses ACTH",
        "5-alpha-reductase blockade lowers dihydrotestosterone and directly opens epithelial sodium channels",
        "Androgen receptor blockade raises LH, and the LH surge retains sodium in the collecting duct",
        "GnRH receptor downregulation removes testosterone and immediately causes mineralocorticoid excess",
        "Aromatase inhibition raises estradiol, and estradiol activates the mineralocorticoid receptor",
    ],
    "CYP17 blockade lowers cortisol, ACTH rises, and deoxycorticosterone accumulates until prednisone suppresses ACTH",
    "Abiraterone inhibits CYP17A1, so both cortisol and androgen synthesis fall. The cortisol drop raises ACTH. Upstream steroids that do not need 17-hydroxylation, especially deoxycorticosterone, are driven hard by that ACTH and activate the mineralocorticoid receptor. The result is hypertension, potassium wasting, and suppressed renin, even though aldosterone itself is not the product. A replacement glucocorticoid such as prednisone feeds back on the pituitary, lowers ACTH, and shuts off the shunt, which is why the electrolytes improve while the androgen block continues. 5-alpha-reductase blockade lowers dihydrotestosterone and directly opens epithelial sodium channels is the finasteride mechanism and has no mineralocorticoid shunt. Androgen receptor blockade raises LH, and the LH surge retains sodium in the collecting duct describes a receptor antagonist such as bicalutamide, which raises testosterone rather than causing ACTH-dependent deoxycorticosterone excess. GnRH receptor downregulation removes testosterone and immediately causes mineralocorticoid excess is what continuous leuprolide eventually does to sex steroids, without this cortisol and ACTH pattern. Aromatase inhibition raises estradiol, and estradiol activates the mineralocorticoid receptor reverses the aromatase effect: an aromatase inhibitor lowers estradiol and does not create this ACTH-driven mineralocorticoid picture.",
    "katzung-16",
)

add(
    "Metyrapone block",
    4,
    "pharmacology",
    "A 45-year-old woman with Cushing disease is given metyrapone while a surgical date is pending. Within days, serum cortisol falls, blood pressure improves slightly, and 11-deoxycortisol rises several-fold. ACTH, already high, rises further. She develops new acne and an increase in facial hair over the next month. Potassium remains normal. The drug was chosen because it interrupts the last cortisol step rather than blocking the androgen receptor or the mineralocorticoid receptor. Liver enzymes stay normal.",
    "Which enzyme step explains the fall in cortisol and the rise in 11-deoxycortisol?",
    [
        "11-beta-hydroxylase inhibition, so 11-deoxycortisol cannot become cortisol",
        "21-hydroxylase inhibition, so 17-hydroxyprogesterone cannot become 11-deoxycortisol",
        "17-alpha-hydroxylase inhibition, so deoxycorticosterone builds and androgens disappear",
        "Aromatase inhibition, so androstenedione cannot become estrone",
        "5-alpha-reductase inhibition, so testosterone cannot become dihydrotestosterone",
    ],
    "11-beta-hydroxylase inhibition, so 11-deoxycortisol cannot become cortisol",
    "Metyrapone inhibits CYP11B1, the 11-beta-hydroxylase that converts 11-deoxycortisol to cortisol. Cortisol falls, the loss of negative feedback raises ACTH, and the immediate precursor 11-deoxycortisol accumulates. Extra ACTH also drives the intact androgen pathway, so acne and hirsutism are expected and are not a sign that the drug is an androgen. Historically the rise in 11-deoxycortisol after metyrapone was used as a test that the pituitary could still release ACTH. 21-hydroxylase inhibition, so 17-hydroxyprogesterone cannot become 11-deoxycortisol would drop 11-deoxycortisol, not raise it, and would pile up 17-hydroxyprogesterone. 17-alpha-hydroxylase inhibition, so deoxycorticosterone builds and androgens disappear is the abiraterone pattern: androgens fall and mineralocorticoids rise, whereas this patient grew more facial hair and kept a normal potassium. Aromatase inhibition, so androstenedione cannot become estrone lowers estrogens and does not create an 11-deoxycortisol backlog or a prompt cortisol fall from the adrenal last step. 5-alpha-reductase inhibition, so testosterone cannot become dihydrotestosterone is finasteride and does not change cortisol or 11-deoxycortisol at all.",
    "katzung-16",
)

add(
    "Ketoconazole steroidogenesis",
    4,
    "pharmacology",
    "A 49-year-old man with ectopic ACTH production is started on high-dose ketoconazole because surgery is delayed. Cortisol falls within two days, and testosterone falls as well. He develops tender gynecomastia. The team is told the drug is not a receptor antagonist and does not block peripheral deiodinase. Liver enzymes are checked twice a week because this imidazole is hepatotoxic at the doses used to slow steroidogenesis. He is not taking spironolactone. ACTH remains high because the tumor is ectopic.",
    "Which action accounts for the simultaneous drop in cortisol and testosterone?",
    [
        "Inhibition of several cytochrome P450 steroid enzymes, including side-chain cleavage and 17,20-lyase",
        "Competitive blockade of the glucocorticoid receptor without lowering measured cortisol",
        "Mineralocorticoid receptor blockade with a secondary fall in adrenal androgens",
        "Selective 5-alpha-reductase type 2 inhibition in skin and prostate",
        "Downregulation of pituitary GnRH receptors after an initial hormone flare",
    ],
    "Inhibition of several cytochrome P450 steroid enzymes, including side-chain cleavage and 17,20-lyase",
    "At high doses, ketoconazole inhibits human cytochrome P450 enzymes of steroid synthesis, notably cholesterol side-chain cleavage and the 17,20-lyase activity of CYP17, with additional effects on 11-beta-hydroxylase. Cortisol and testosterone both fall quickly, which is why the drug can bridge a patient with severe Cushing and why gynecomastia appears as the androgen-to-estrogen balance shifts and testosterone drops. It is an enzyme inhibitor, not a hormone-receptor blocker, and the hepatotoxicity is the limiting adverse effect. Competitive blockade of the glucocorticoid receptor without lowering measured cortisol is mifepristone at high dose: cortisol levels stay high or rise while the receptor is blocked. Mineralocorticoid receptor blockade with a secondary fall in adrenal androgens is not how spironolactone lowers blood pressure, and spironolactone was not the drug given. Selective 5-alpha-reductase type 2 inhibition in skin and prostate is finasteride, which lowers dihydrotestosterone and leaves cortisol untouched. Downregulation of pituitary GnRH receptors after an initial hormone flare is the leuprolide sequence and would not rapidly lower cortisol from an ectopic ACTH source.",
    "katzung-16",
)

add(
    "Spironolactone antiandrogen effect",
    4,
    "pharmacology",
    "A 63-year-old man with heart failure and a reduced ejection fraction is titrated to spironolactone 25 mg daily on top of an ACE inhibitor. Three months later he has painful bilateral breast enlargement with glandular tissue on examination. Potassium is 4.8 mEq/L and creatinine is stable. He is distressed by the breast change but the heart-failure indication remains. Eplerenone is available. He is not taking a 5-alpha-reductase inhibitor, and his testosterone was normal before the diuretic was added. Digoxin level is not elevated.",
    "Which extra receptor action explains the gynecomastia, and which switch avoids it?",
    [
        "Androgen receptor blockade by spironolactone; eplerenone spares the androgen receptor",
        "Estrogen receptor agonism identical to tamoxifen, which also causes endometrial proliferation",
        "5-alpha-reductase inhibition, so dihydrotestosterone falls and the prostate shrinks",
        "Aromatase induction, so testosterone is converted to estradiol faster than in obesity",
        "GnRH receptor agonist activity, with a flare of LH followed by castrate testosterone",
    ],
    "Androgen receptor blockade by spironolactone; eplerenone spares the androgen receptor",
    "Spironolactone is a mineralocorticoid-receptor antagonist and also an androgen-receptor antagonist, and it weakly interferes with androgen synthesis. In a man that antiandrogen effect produces gynecomastia and sometimes erectile dysfunction, which is the same property used on purpose for hirsutism in women. Eplerenone blocks the mineralocorticoid receptor more selectively and does not occupy the androgen receptor, so it is the switch when breast pain is the limiting adverse effect and a mineralocorticoid antagonist is still wanted. Potassium still has to be watched with either drug. Estrogen receptor agonism identical to tamoxifen, which also causes endometrial proliferation is a SERM effect spironolactone does not have, and tamoxifen is not a diuretic. 5-alpha-reductase inhibition, so dihydrotestosterone falls and the prostate shrinks is finasteride, which this patient is not taking and which does not cause glandular gynecomastia as its main action. Aromatase induction, so testosterone is converted to estradiol faster than in obesity is the adipose mechanism of obesity-related gynecomastia, not the pharmacology of this drug. GnRH receptor agonist activity, with a flare of LH followed by castrate testosterone describes leuprolide, which would suppress testosterone into the castrate range rather than cause gynecomastia at a heart-failure dose.",
    "katzung-16",
)

add(
    "Finasteride volume reduction",
    4,
    "pharmacology",
    "A 66-year-old man with bothersome urinary hesitancy has a prostate volume of 62 mL and a PSA of 3.2 ng/mL. He is offered two drugs. One is expected to relax smooth muscle in the bladder neck within days without changing gland size. The other, which he starts, is expected to shrink the gland over many months. A year later the volume is 41 mL and the PSA is 1.6 ng/mL. Serum testosterone is unchanged. He is warned not to donate blood and that a pregnant partner must not handle crushed tablets because a male fetus would be affected.",
    "Which enzyme inhibition accounts for the smaller prostate and the halved PSA?",
    [
        "5-alpha-reductase type 2 inhibition, lowering dihydrotestosterone in prostate and skin",
        "Alpha-1 adrenergic blockade, relaxing stromal smooth muscle without reducing volume",
        "Androgen receptor blockade, which raises LH and raises serum testosterone",
        "GnRH receptor downregulation, driving testosterone into the castrate range",
        "Aromatase inhibition, lowering estradiol and increasing vertebral fracture risk",
    ],
    "5-alpha-reductase type 2 inhibition, lowering dihydrotestosterone in prostate and skin",
    "Prostate growth and male-pattern hair depend on dihydrotestosterone made locally by 5-alpha-reductase type 2. Finasteride inhibits that enzyme, so dihydrotestosterone falls, prostate volume slowly declines, and PSA falls by about half, which means a later screening PSA must be interpreted against that lower baseline. Testosterone itself is not the ligand this drug removes, so serum testosterone stays the same or rises slightly. The pregnancy warning exists because a male fetus needs dihydrotestosterone for external genitalia. Alpha-1 adrenergic blockade, relaxing stromal smooth muscle without reducing volume is tamsulosin or a similar blocker: symptoms can improve quickly and the gland does not shrink, which was the drug he was offered and did not use as the volume-reducing choice. Androgen receptor blockade, which raises LH and raises serum testosterone is bicalutamide; testosterone would rise, not stay flat while the gland shrinks from a dihydrotestosterone deficit. GnRH receptor downregulation, driving testosterone into the castrate range is leuprolide and would collapse serum testosterone. Aromatase inhibition, lowering estradiol and increasing vertebral fracture risk is anastrozole, used in breast cancer, and it does not shrink a benign prostate through dihydrotestosterone.",
    "katzung-16",
)

add(
    "Androgen receptor blockade feedback",
    4,
    "pharmacology",
    "A 74-year-old man with metastatic prostate cancer is treated with bicalutamide alone for several weeks while he declines injectable therapy. PSA falls from 48 to 19 ng/mL. Serum testosterone rises from 410 to 890 ng/dL, and LH is higher than at baseline. He has mild breast tenderness. Liver enzymes are monitored. He is not taking finasteride, and dihydrotestosterone formation is intact. The oncologist explains that the cancer can still progress later by receptor mutations, but the current hormone pattern is the expected pharmacology, not nonadherence.",
    "Why did testosterone rise while PSA fell?",
    [
        "Blocked androgen receptors in the hypothalamus and pituitary increase GnRH and LH, while the prostate receptor is also blocked",
        "5-alpha-reductase inhibition lowers dihydrotestosterone and leaves LH and testosterone unchanged",
        "Continuous GnRH agonism has already downregulated the pituitary and castrated testosterone production",
        "CYP17 inhibition has stopped testicular androgen synthesis and ACTH is driving deoxycorticosterone",
        "Aromatase inhibition has removed estradiol negative feedback and collapsed PSA by lowering estrogen",
    ],
    "Blocked androgen receptors in the hypothalamus and pituitary increase GnRH and LH, while the prostate receptor is also blocked",
    "Bicalutamide and flutamide are competitive androgen-receptor antagonists. In the prostate that blockade lowers PSA and slows androgen-driven growth even if circulating testosterone is high. The same receptors in the hypothalamus and pituitary normally carry androgen negative feedback. Blocking them is read as androgen deficiency, so GnRH and LH rise and the Leydig cells make more testosterone. Gynecomastia follows from the high testosterone being aromatized to estradiol while the androgen receptor cannot oppose breast growth. 5-alpha-reductase inhibition lowers dihydrotestosterone and leaves LH and testosterone unchanged is finasteride, which would not push testosterone from 410 to 890. Continuous GnRH agonism has already downregulated the pituitary and castrated testosterone production would lower testosterone, not raise it. CYP17 inhibition has stopped testicular androgen synthesis and ACTH is driving deoxycorticosterone is abiraterone, which suppresses testosterone. Aromatase inhibition has removed estradiol negative feedback and collapsed PSA by lowering estrogen is anastrozole and is not a prostate-cancer androgen-receptor strategy.",
    "katzung-16",
)

add(
    "Continuous GnRH agonist",
    5,
    "pharmacology",
    "A 7-year-old girl with central precocious puberty has breast development, an advanced bone age, pubertal LH pulses, and a pubertal LH rise after GnRH stimulation. Estradiol is in the early pubertal range and a brain MRI is normal. She is started on daily leuprolide. During the first week, breast tenderness increases and a spot estradiol is higher than baseline. By six weeks, LH is suppressed, estradiol is prepubertal, and the bone age advancement slows. Her parents had been told the medicine is a GnRH agonist and are alarmed that an agonist could end puberty.",
    "Why does a GnRH agonist ultimately stop ovarian estrogen production?",
    [
        "Continuous receptor stimulation downregulates pituitary GnRH receptors after a brief flare of LH and estradiol",
        "Pulsatile GnRH replacement would do the same thing and is the treatment for Kallmann syndrome",
        "The drug inhibits ovarian aromatase, so androstenedione cannot become estradiol",
        "The drug antagonizes the estrogen receptor in the hypothalamus like clomiphene",
        "The drug blocks 5-alpha-reductase and therefore stops ovarian steroidogenesis",
    ],
    "Continuous receptor stimulation downregulates pituitary GnRH receptors after a brief flare of LH and estradiol",
    "GnRH receptors on gonadotrophs need pulsatile ligand to keep signaling. A long-acting agonist given continuously occupies them without a pulse, and after an initial release of stored LH and FSH the receptors downregulate and desensitize. Gonadotropins then fall, the ovary loses its drive, and estradiol returns to the prepubertal range. The first-week flare is that initial release and is expected, not treatment failure. In prostate cancer the same flare can worsen bone pain, which is why a receptor antagonist is sometimes overlapped at the start. Pulsatile GnRH replacement would do the same thing and is the treatment for Kallmann syndrome is the opposite pattern: pulses restore fertility and puberty when the hypothalamus cannot make GnRH. The drug inhibits ovarian aromatase, so androstenedione cannot become estradiol is anastrozole or letrozole and would not suppress LH. The drug antagonizes the estrogen receptor in the hypothalamus like clomiphene would increase, not suppress, GnRH output. The drug blocks 5-alpha-reductase and therefore stops ovarian steroidogenesis is finasteride, which does not turn off the pituitary-ovarian axis.",
    "katzung-16",
)

add(
    "Raloxifene tissue profile",
    5,
    "pharmacology",
    "A 66-year-old postmenopausal woman has a T-score of -2.8 at the lumbar spine, an intact uterus, and a strong family history of estrogen-receptor-positive breast cancer. She has already declined a bisphosphonate after a discussion of rare jaw osteonecrosis. She wants a medicine that reduces vertebral fracture risk and reduces invasive breast cancer risk. She has no personal history of venous thrombosis. The clinician contrasts two selective estrogen receptor modulators: one stimulates endometrium, and one antagonizes endometrium. She does not need ovulation induction, and she is years past her last menstrual period.",
    "Which drug matches antagonism in breast and uterus with agonism in bone?",
    [
        "Raloxifene antagonizes breast and endometrium and agonizes bone",
        "Tamoxifen antagonizes breast but agonizes endometrium and bone",
        "Anastrozole lowers estrogen everywhere and accelerates bone loss",
        "Clomiphene blocks hypothalamic estrogen receptors to raise FSH",
        "Conjugated estrogen plus progestin agonizes breast as well as bone",
    ],
    "Raloxifene antagonizes breast and endometrium and agonizes bone",
    "Selective estrogen receptor modulators do not act the same way in every tissue, because coactivators and corepressors differ. Raloxifene is an antagonist in breast and in endometrium and an agonist in bone, so it lowers the risk of invasive breast cancer and reduces vertebral fractures without the endometrial proliferation of tamoxifen. Venous thrombosis risk remains, which is why that history was checked. Tamoxifen antagonizes breast but agonizes endometrium and bone also protects bone and breast but stimulates the uterus, raising the risk of endometrial hyperplasia and carcinoma, which is the wrong profile for a woman whose uterus is still present when an endometrium-neutral choice exists. Anastrozole lowers estrogen everywhere and accelerates bone loss is an aromatase inhibitor: it can reduce breast cancer recurrence after menopause but it causes bone loss rather than treating osteoporosis. Clomiphene blocks hypothalamic estrogen receptors to raise FSH is a fertility drug and does not treat postmenopausal bone or breast risk. Conjugated estrogen plus progestin agonizes breast as well as bone relieves vasomotor symptoms and supports bone but increases breast cancer risk, which is the outcome she is trying to reduce.",
    "katzung-16",
)

add(
    "Aromatase inhibitor before menopause",
    5,
    "pharmacology",
    "A 36-year-old premenopausal woman with an estrogen-receptor-positive breast cancer is started on anastrozole alone because she declined ovarian suppression. Six weeks later she is still having regular menses. Estradiol is 80 pg/mL, FSH is higher than her pretreatment follicular-phase value, and LH has risen. A postmenopausal patient on the same dose in the same clinic has an estradiol below the assay limit and no menses. The premenopausal patient has intact ovaries and no aromatase-inhibitor adverse effect on liver enzymes. Her oncologist explains that the drug is working on the enzyme but the ovary is not a postmenopausal fat pad.",
    "Why does anastrozole monotherapy fail to keep estradiol suppressed before menopause?",
    [
        "The FSH rise drives residual ovarian follicles to make enough androgen substrate to overcome the enzyme block",
        "Anastrozole is an estrogen receptor agonist in the ovary and therefore raises estradiol",
        "Premenopausal aromatization occurs only in the adrenal, which anastrozole cannot reach",
        "Tamoxifen would have lowered estradiol by the same enzyme and is required first",
        "GnRH pulses stop when estradiol falls, so the ovary should have shut off immediately",
    ],
    "The FSH rise drives residual ovarian follicles to make enough androgen substrate to overcome the enzyme block",
    "Anastrozole inhibits aromatase, the enzyme that converts androgens to estrogens. After menopause the only important source is peripheral tissue, and the inhibitor can hold estradiol down. Before menopause the hypothalamus reads any fall in estradiol as a signal to increase GnRH and therefore FSH. FSH recruits follicles, theca cells supply more androgen substrate, and granulosa aromatase activity is driven hard enough that a standard inhibitor dose does not keep estradiol suppressed. That is why an aromatase inhibitor in a premenopausal woman is paired with ovarian suppression if it is used at all. Anastrozole is an estrogen receptor agonist in the ovary and therefore raises estradiol confuses the drug with a SERM; it does not bind the estrogen receptor. Premenopausal aromatization occurs only in the adrenal, which anastrozole cannot reach is wrong on both counts: the ovary is the dominant premenopausal source, and anastrozole does inhibit the enzyme wherever it is expressed. Tamoxifen would have lowered estradiol by the same enzyme and is required first is a receptor modulator, not an enzyme inhibitor, and it does not lower estradiol this way. GnRH pulses stop when estradiol falls, so the ovary should have shut off immediately reverses negative feedback: a fall in estradiol increases, rather than stops, GnRH drive.",
    "katzung-16",
)

add(
    "Clomiphene feedback",
    4,
    "pharmacology",
    "A 28-year-old woman with polycystic ovary syndrome wants to conceive. She has irregular cycles, a normal day-3 FSH, a patent uterine cavity, and a partner semen analysis within normal limits. She is not hypogonadotropic and she can smell normally. Clomiphene is started on cycle day 3. By day 12 a dominant follicle is present, and a progesterone level one week after the LH surge is 12 ng/mL. She asks how a drug described as an antiestrogen can cause ovulation rather than block it. She is not using an aromatase inhibitor or injectable gonadotropins.",
    "Where does clomiphene act to raise the FSH that recruited this follicle?",
    [
        "Hypothalamic estrogen receptor antagonism removes negative feedback and increases GnRH and FSH",
        "Direct FSH receptor agonism on granulosa cells, identical to injected gonadotropin",
        "Ovarian aromatase inhibition, which lowers estradiol and is the letrozole mechanism",
        "Progesterone receptor antagonism in the endometrium, which triggers decidual necrosis",
        "Pituitary GnRH receptor downregulation, the same end result as continuous leuprolide",
    ],
    "Hypothalamic estrogen receptor antagonism removes negative feedback and increases GnRH and FSH",
    "Clomiphene is a selective estrogen receptor modulator that acts as an antagonist at the hypothalamus. Estrogen normally slows GnRH and lowers FSH during the follicular phase. Blocking that negative feedback lets GnRH pulse frequency and amplitude rise, the pituitary releases more FSH, and a follicle can be recruited if the pituitary and ovary are capable of responding. Ovulation then follows, and the luteal progesterone proves a corpus luteum formed. The drug does not itself stimulate the ovary the way an injection does, which is why it fails when the hypothalamus cannot be provoked, as in very low-weight hypothalamic amenorrhea. Direct FSH receptor agonism on granulosa cells, identical to injected gonadotropin bypasses the pituitary and is the mechanism of menotropin injections, not a tablet that depends on an intact axis. Ovarian aromatase inhibition, which lowers estradiol and is the letrozole mechanism is a different oral ovulation drug; letrozole lowers estradiol synthesis, whereas clomiphene blocks the receptor that reads estradiol. Progesterone receptor antagonism in the endometrium, which triggers decidual necrosis is mifepristone and ends, rather than starts, a progesterone-supported lining. Pituitary GnRH receptor downregulation, the same end result as continuous leuprolide would suppress FSH and prevent this follicle.",
    "katzung-16",
)

add(
    "Mifepristone decidual effect",
    4,
    "pharmacology",
    "A 24-year-old woman requests medication abortion at 7 weeks by certain last menstrual period and ultrasound. She receives mifepristone in clinic and takes misoprostol at home the next day. Bleeding and cramping begin after the misoprostol, and a follow-up ultrasound shows an empty uterus. She asks which drug did which job. She is not using an oxytocin infusion, a GnRH agonist, or methotrexate. The counselor explains that progesterone from the corpus luteum is what is holding the early pregnancy in place, and that one of the two medicines specifically removes that signal before the prostaglandin is given.",
    "What does mifepristone do to the early pregnancy before misoprostol is taken?",
    [
        "Progesterone receptor blockade causes decidual breakdown and detaches the pregnancy",
        "Prostaglandin E1 agonism contracts the myometrium and softens the cervix",
        "Oxytocin receptor agonism is the primary abortifacient action of this antiprogestin",
        "Continuous GnRH receptor stimulation downregulates LH and starves the corpus luteum",
        "Estrogen receptor antagonism in the hypothalamus raises FSH and restarts menses",
    ],
    "Progesterone receptor blockade causes decidual breakdown and detaches the pregnancy",
    "Early pregnancy endometrium is a decidua maintained by progesterone acting on its receptor. Mifepristone is a progesterone-receptor antagonist. Blocking that receptor produces decidual necrosis, separates the trophoblast, increases endogenous prostaglandin sensitivity, and softens the cervix. Misoprostol, given afterward, is the prostaglandin that produces coordinated uterine contractions and expulsion. At much higher doses the same drug also blocks the glucocorticoid receptor, which is a different indication, but the abortion dose is aimed at the progesterone receptor. Prostaglandin E1 agonism contracts the myometrium and softens the cervix is the misoprostol step, not the mifepristone step. Oxytocin receptor agonism is the primary abortifacient action of this antiprogestin is incorrect because mifepristone does not stimulate oxytocin receptors; oxytocin is a different hormone used for labor. Continuous GnRH receptor stimulation downregulates LH and starves the corpus luteum is the leuprolide pattern and is far too slow and indirect for a 7-week medication abortion. Estrogen receptor antagonism in the hypothalamus raises FSH and restarts menses describes clomiphene, which induces ovulation rather than interrupting a gestation.",
    "katzung-16",
)

add(
    "Complete androgen insensitivity",
    5,
    "pathology",
    "A 17-year-old adolescent who has been raised as a girl is evaluated for primary amenorrhea. Breast development is Tanner 4, but pubic and axillary hair are almost absent. The vagina ends blindly and ultrasound shows no uterus and no cervix. Bilateral inguinal masses are testes. Karyotype is 46,XY. Serum testosterone is in the adult male range, LH is high, and estradiol is present from peripheral conversion. FSH is normal to high. There is no phallic enlargement at puberty and no voice deepening. A sibling with a similar history was told the problem was an enzyme that makes dihydrotestosterone.",
    "Why do breasts develop at puberty while a uterus and pubic hair do not?",
    [
        "Testosterone is aromatized to estradiol, anti-Mullerian hormone removed the uterus, and androgen receptors cannot grow sexual hair",
        "5-alpha-reductase deficiency prevents breast development and causes phallic growth at puberty",
        "Mullerian agenesis in a 46,XX individual leaves ovaries, normal hair, and a normal female testosterone",
        "Streak gonads in 46,XY gonadal dysgenesis leave a uterus and make no testosterone for aromatization",
        "Excess anti-Mullerian hormone after puberty directly stimulates mammary ducts",
    ],
    "Testosterone is aromatized to estradiol, anti-Mullerian hormone removed the uterus, and androgen receptors cannot grow sexual hair",
    "Complete androgen insensitivity is an X-linked androgen-receptor defect. Testes develop because SRY is intact, Sertoli cells secrete anti-Mullerian hormone so the uterus and fallopian tubes regress, and Leydig cells secrete testosterone. None of the testosterone or dihydrotestosterone can signal, so the external genitalia develop along female lines and, at puberty, androgen-dependent hair never appears. Aromatase still converts testosterone to estradiol, and that estradiol stimulates breast growth without androgen receptor activity to oppose it. LH is high because androgen negative feedback also requires the receptor. 5-alpha-reductase deficiency prevents breast development and causes phallic growth at puberty is the disorder the sibling story is tempting: those patients virilize at puberty, do not grow breasts, and have working androgen receptors with a high testosterone-to-dihydrotestosterone ratio. Mullerian agenesis in a 46,XX individual leaves ovaries, normal hair, and a normal female testosterone produces primary amenorrhea and no uterus, but pubic hair, breasts, and a 46,XX karyotype are normal and testosterone is not in the male range. Streak gonads in 46,XY gonadal dysgenesis leave a uterus and make no testosterone for aromatization, so spontaneous breasts do not occur and a uterus is present. Excess anti-Mullerian hormone after puberty directly stimulates mammary ducts has no such action; anti-Mullerian hormone regresses ducts in fetal life and does not create Tanner 4 breasts.",
    "robbins-10",
)

add(
    "5-alpha-reductase deficiency",
    5,
    "pathology",
    "A 14-year-old adolescent who was raised as a girl develops a deepening voice, increased muscle, and marked phallic enlargement over one year, without breast development. Examination shows bilateral inguinal gonads, no uterus, and a small blind vagina. Karyotype is 46,XY. Serum testosterone is in the male range and dihydrotestosterone is very low, so the testosterone-to-dihydrotestosterone ratio is above 30. LH is only mildly elevated. At laparoscopy the vas deferens and seminal vesicles are present and the prostate is rudimentary. Pubic hair is increasing. There is no maternal history of virilization in pregnancy.",
    "Why are Wolffian ducts present while the prostate and newborn external genitalia failed to masculinize?",
    [
        "Wolffian ducts respond to testosterone itself, whereas prostate and external genitalia require dihydrotestosterone",
        "Androgen receptor absence allows aromatized estradiol to produce the breasts seen in this puberty",
        "Absent anti-Mullerian hormone leaves a uterus and still permits a full prostate",
        "21-hydroxylase deficiency in a 46,XX fetus creates a vas deferens and suppresses dihydrotestosterone",
        "Aromatase deficiency keeps estradiol high and closes the epiphyses before puberty",
    ],
    "Wolffian ducts respond to testosterone itself, whereas prostate and external genitalia require dihydrotestosterone",
    "5-alpha-reductase type 2 makes dihydrotestosterone in genital skin and the prostate anlage. Testosterone from the fetal testis stabilizes the Wolffian ducts without that conversion, so epididymis, vas deferens, and seminal vesicles form. External genital fusion, phallic growth in fetal life, and prostate development need dihydrotestosterone, so the newborn looks female or ambiguous and the prostate stays rudimentary. At puberty the surge of testosterone is high enough, together with type 1 enzyme activity outside genital skin, to virilize the body and enlarge the phallus. Androgen receptors work, so estrogen from aromatization does not produce breasts. Androgen receptor absence allows aromatized estradiol to produce the breasts seen in this puberty is complete androgen insensitivity, which has breasts and no pubertal virilization. Absent anti-Mullerian hormone leaves a uterus and still permits a full prostate is persistent Mullerian duct syndrome, a male external phenotype with a uterus. 21-hydroxylase deficiency in a 46,XX fetus creates a vas deferens and suppresses dihydrotestosterone virilizes external genitalia of a genetic female but does not stabilize Wolffian ducts or create a 46,XY testosterone-to-dihydrotestosterone problem. Aromatase deficiency keeps estradiol high and closes the epiphyses before puberty reverses the estrogen finding: aromatase deficiency lowers estradiol and leaves growth plates open.",
    "robbins-10",
)

add(
    "Mullerian agenesis",
    4,
    "pathology",
    "An 18-year-old woman has primary amenorrhea and cyclic lower abdominal cramping is absent. Breasts are Tanner 5, pubic and axillary hair are normal, and she is 168 cm tall. The vagina is short and blind. Ultrasound and MRI show absent uterus and cervix with normal ovaries containing follicles. Karyotype is 46,XX. Serum testosterone is in the female range, FSH and LH are normal, and estradiol is consistent with follicular activity. Renal ultrasound shows a solitary kidney. There are no inguinal gonads. She has normal olfaction and no signs of virilization.",
    "Why are breast development, sexual hair, and gonadotropins normal when the uterus is absent?",
    [
        "Ovaries and androgen-sensitive follicles are intact; only Mullerian duct development failed",
        "Androgen receptor failure removed the uterus and should have erased pubic hair",
        "5-alpha-reductase failure in a 46,XY testis left dihydrotestosterone too low for a prostate",
        "Functional hypothalamic amenorrhea suppressed GnRH, FSH, and estradiol together",
        "Anti-Mullerian hormone excess from a granulosa tumor removed the uterus after puberty",
    ],
    "Ovaries and androgen-sensitive follicles are intact; only Mullerian duct development failed",
    "Mullerian agenesis, or Mayer-Rokitansky-Kuster-Hauser syndrome, is failure of Mullerian duct development in a 46,XX individual. Ovaries are normal, so estradiol produces breasts, the hypothalamic-pituitary axis cycles, and gonadotropins are not elevated. Pubic and axillary hair are androgen-dependent and the androgens and receptors are normal, so hair is present. The vagina that is present is the lower, urogenital-sinus portion; the upper vagina and uterus are Mullerian and absent. Renal anomalies travel with the defect because the ducts develop beside the mesonephros. Androgen receptor failure removed the uterus and should have erased pubic hair is androgen insensitivity: karyotype XY, testes, male-range testosterone, and absent hair. 5-alpha-reductase failure in a 46,XY testis left dihydrotestosterone too low for a prostate is also an XY disorder and would not leave normal female testosterone with Tanner 5 breasts and ovaries. Functional hypothalamic amenorrhea suppressed GnRH, FSH, and estradiol together would drop estradiol and prevent full breast development if it had been lifelong, and the uterus would still be present. Anti-Mullerian hormone excess from a granulosa tumor removed the uterus after puberty is not a mechanism of uterine disappearance; anti-Mullerian hormone acts on ducts in embryonic life, and a granulosa tumor would raise inhibin and estrogen rather than erase an established uterus.",
    "robbins-10",
)

add(
    "Swyer syndrome",
    5,
    "pathology",
    "A 16-year-old phenotypic girl has no breast development and no menarche. Height is 172 cm. External genitalia are female and unambiguous. MRI shows a small uterus and fallopian tubes and streak gonads. Karyotype is 46,XY. Testosterone is in the female range, estradiol is very low, and FSH and LH are both in the menopausal range. Pubic hair is sparse. There is no inguinal testis and no breast tissue to suggest aromatization of a male-range testosterone. The streaks are scheduled for removal because of a tumor risk, and estrogen will be replaced before progesterone is added.",
    "Why is a uterus present in this 46,XY adolescent?",
    [
        "Streak gonads never produced anti-Mullerian hormone or testosterone, so Mullerian ducts persisted and external genitalia stayed female",
        "Androgen receptors are absent, but Sertoli cells still secreted anti-Mullerian hormone and removed the uterus",
        "5-alpha-reductase type 2 failed, so the prostate is absent and a uterus formed in its place",
        "Mullerian agenesis in a 46,XX fetus left ovaries that cannot make enough estradiol for breasts",
        "Excess maternal androgen at week 10 stabilized Wolffian ducts and deleted the uterus",
    ],
    "Streak gonads never produced anti-Mullerian hormone or testosterone, so Mullerian ducts persisted and external genitalia stayed female",
    "Swyer syndrome is 46,XY complete gonadal dysgenesis, often from an SRY or downstream testis-determining defect. The gonads are streaks. No Sertoli cells means no anti-Mullerian hormone, so Mullerian ducts become uterus and fallopian tubes. No Leydig cells means no testosterone and no dihydrotestosterone, so Wolffian ducts regress and external genitalia follow the female default. Puberty does not occur because there is no sex steroid, gonadotropins are high, and the streaks are removed because of gonadoblastoma risk. Estrogen can then be given, and progesterone is added because a uterus is present. Androgen receptors are absent, but Sertoli cells still secreted anti-Mullerian hormone and removed the uterus describes complete androgen insensitivity, which has testes, male-range testosterone, breasts, and no uterus. 5-alpha-reductase type 2 failed, so the prostate is absent and a uterus formed in its place still has working Sertoli cells, so anti-Mullerian hormone removes the uterus; a prostate defect does not create one. Mullerian agenesis in a 46,XX fetus left ovaries that cannot make enough estradiol for breasts is 46,XX with normal hormones and normal breasts, and the uterus is absent rather than present. Excess maternal androgen at week 10 stabilized Wolffian ducts and deleted the uterus does not delete a uterus, because androgen does not replace anti-Mullerian hormone, and it would virilize external genitalia.",
    "robbins-10",
)

add(
    "Persistent Mullerian duct syndrome",
    4,
    "pathology",
    "A 2-year-old boy is taken to the operating room for a unilateral inguinal hernia and undescended testis. Inside the hernia sac the surgeon finds a midline uterus and fallopian tubes, and both gonads look like testes. Karyotype is 46,XY. External genitalia are male, with a normal penile urethra. Serum testosterone after hCG stimulation is appropriate for age, and there is no hypospadias. A molecular panel shows a loss-of-function variant in the anti-Mullerian hormone receptor. The contralateral testis is also not fully descended. He has no hypertension or electrolyte abnormality.",
    "Which fetal signal failed, and which fetal signal clearly worked?",
    [
        "Sertoli anti-Mullerian hormone signaling failed, while Leydig testosterone and dihydrotestosterone worked",
        "Leydig testosterone failed, while anti-Mullerian hormone successfully removed the uterus",
        "5-alpha-reductase failed, so the external genitalia should be female and the vas absent",
        "Androgen receptor signaling failed, so breasts will be the dominant puberty finding",
        "SRY failed, so the gonads should be streaks and the karyotype should read 46,XX",
    ],
    "Sertoli anti-Mullerian hormone signaling failed, while Leydig testosterone and dihydrotestosterone worked",
    "Persistent Mullerian duct syndrome occurs when anti-Mullerian hormone is absent or its type II receptor does not work. Sertoli cells are the source. Without that signal the Mullerian ducts persist as uterus and tubes even though the karyotype is XY and testes formed. Leydig cell testosterone still stabilizes Wolffian ducts, and dihydrotestosterone still masculinizes the external genitalia, so the child looks male. Cryptorchidism and inguinal hernia, sometimes with the uterus in the sac, are the usual presentation. Fertility is threatened by the undescended testes and the anatomy, not by a lack of androgen. Leydig testosterone failed, while anti-Mullerian hormone successfully removed the uterus would leave no uterus and would leave external genitalia undervirilized. 5-alpha-reductase failed, so the external genitalia should be female and the vas absent reverses both findings: dihydrotestosterone failure feminizes the outside but the vas, which needs testosterone, remains, and no uterus forms. Androgen receptor signaling failed, so breasts will be the dominant puberty finding is androgen insensitivity, with female external genitalia and no uterus. SRY failed, so the gonads should be streaks and the karyotype should read 46,XX would not produce testes or male external genitalia.",
    "robbins-10",
)

add(
    "Androgen exposure of an XX fetus",
    5,
    "physiology",
    "A 46,XX newborn has a fused scrotum-like labia, clitoromegaly, and a urogenital sinus, the picture of a strongly virilized female. Ultrasound nevertheless shows a uterus and ovaries, and there is no vas deferens and no epididymis. The infant is hypotensive with hyponatremia and hyperkalemia, and 17-hydroxyprogesterone is extremely high, consistent with a fetal adrenal androgen source between weeks 9 and 12. The teaching attending asks why a hormone level high enough to masculinize the outside did not produce male internal ducts or erase the uterus. The mother was not given an androgenic medication.",
    "Why did systemic androgen virilize the outside without creating a vas or removing the uterus?",
    [
        "External genitalia respond to androgen, but only local testicular testosterone stabilizes Wolffian ducts and only anti-Mullerian hormone removes the uterus",
        "Any androgen exposure deletes Mullerian ducts, so this uterus means the androgen arrived after birth",
        "Wolffian ducts are stabilized by dihydrotestosterone made in the placenta, which should have left a vas",
        "Anti-Mullerian hormone is secreted by the ovary whenever androgens are high, so the uterus should be gone",
        "A 46,XX fetus with this degree of virilization must have an SRY translocation and testes",
    ],
    "External genitalia respond to androgen, but only local testicular testosterone stabilizes Wolffian ducts and only anti-Mullerian hormone removes the uterus",
    "The external genitalia of either karyotype are bipotential and masculinize if androgen, especially dihydrotestosterone, is present during the critical window. Adrenal androgens in 21-hydroxylase deficiency reach that threshold in a female fetus. The Wolffian duct is different: it regresses unless a high local concentration of testosterone arrives from the adjacent testis. Circulating adrenal androgen does not reliably replace that local signal, so no vas or epididymis forms. The uterus regresses only in response to anti-Mullerian hormone from Sertoli cells, which an ovary does not secrete, so the uterus stays. Any androgen exposure deletes Mullerian ducts, so this uterus means the androgen arrived after birth is false: androgen is not the Mullerian regression signal, and the genital tubercle is already differentiated by the early second trimester. Wolffian ducts are stabilized by dihydrotestosterone made in the placenta, which should have left a vas misstates the ligand; Wolffian stabilization is testosterone from the testis, not placental dihydrotestosterone. Anti-Mullerian hormone is secreted by the ovary whenever androgens are high, so the uterus should be gone assigns a Sertoli product to the ovary. A 46,XX fetus with this degree of virilization must have an SRY translocation and testes would have testes, anti-Mullerian hormone, and no uterus, and would not have this salt-wasting adrenal profile.",
    "langman-embryo",
)

add(
    "Kallmann neuron migration",
    4,
    "pathology",
    "A 19-year-old man is referred for absent puberty. He has a small penis, testicular volume of 3 mL, sparse body hair, and an arm span greater than his height. He cannot smell coffee or soap, and formal testing confirms anosmia. LH and FSH are both low, and testosterone is prepubertal. MRI shows absent olfactory bulbs and a normal anterior pituitary. The rest of the pituitary axes are intact. Karyotype is 46,XY. There is no small, firm testis suggestive of seminiferous tubule hyalinization, and FSH is not selectively sky high. A renal ultrasound, sent because of the inheritance pattern under discussion, shows unilateral renal agenesis.",
    "Which shared embryonic journey explains the low gonadotropins and the absent olfactory bulbs?",
    [
        "GnRH neurons failed to migrate with olfactory axons from the nasal placode into the hypothalamus",
        "SRY failed, so the gonads are streaks and FSH should be high with a present uterus",
        "Klinefelter seminiferous tubule dysgenesis raised FSH and deleted the olfactory bulbs",
        "Pituitary ACTH cells failed to migrate, so cortisol is low and smell is lost",
        "Anti-Mullerian hormone excess suppressed GnRH after a normal olfactory migration",
    ],
    "GnRH neurons failed to migrate with olfactory axons from the nasal placode into the hypothalamus",
    "GnRH neurons are born in the nasal placode and migrate along olfactory axons into the forebrain. ANOS1 and other Kallmann genes disrupt that shared path. The olfactory bulbs do not form, so smell is lost, and GnRH never arrives in the hypothalamus, so LH and FSH stay low and the testes never receive the signal for puberty. The pituitary gland itself is present and the other axes work, which is why giving pulsatile GnRH can stimulate the gonadotrophs. Unilateral renal agenesis is a classic companion of the X-linked form. SRY failed, so the gonads are streaks and FSH should be high with a present uterus is Swyer syndrome, a hypergonadotropic state with a uterus. Klinefelter seminiferous tubule dysgenesis raised FSH and deleted the olfactory bulbs raises FSH because seminiferous tubules and inhibin B are damaged, smell is normal, and the karyotype is 47,XXY. Pituitary ACTH cells failed to migrate, so cortisol is low and smell is lost invents a migration that is not the Kallmann path and ignores the isolated gonadotropin deficiency. Anti-Mullerian hormone excess suppressed GnRH after a normal olfactory migration is not a physiologic brake on GnRH and would not erase the olfactory bulbs.",
    "langman-embryo",
)

add(
    "DiGeorge pharyngeal pouches",
    4,
    "pathology",
    "A 4-day-old infant has multifocal seizures. Ionized calcium is low, PTH is undetectable, and phosphate is high. The chest radiograph shows no thymic shadow. Lymphocyte count is low and a candidal rash is spreading. Echocardiography shows an interrupted aortic arch. The ears are low set and the palate is cleft. There is no goiter and no midline neck mass. Fluorescent in situ hybridization is ordered for a chromosome 22 deletion. The endocrine fellow is asked which embryonic structures account for the missing parathyroid glands and the missing thymus together.",
    "Which pharyngeal pouches failed to develop?",
    [
        "Third and fourth pharyngeal pouches, which supply the parathyroids and the thymus",
        "First and second pharyngeal clefts, which supply the external ear canal and the palatine tonsil only",
        "Foramen cecum and thyroglossal duct, which supply the thyroid follicular cells",
        "Ultimobranchial body alone, which supplies parathyroid hormone and the thymus cortex",
        "Neural crest migration into the adrenal medulla alone, which supplies cortisol",
    ],
    "Third and fourth pharyngeal pouches, which supply the parathyroids and the thymus",
    "The third pharyngeal pouch gives rise to the inferior parathyroid glands and the thymus. The fourth pouch gives rise to the superior parathyroid glands, and its ultimobranchial component, populated by neural crest, gives rise to thyroid C cells. A 22q11 deletion disrupts development of these pouches and the cardiac neural crest, producing hypoparathyroidism, thymic aplasia with T-cell deficiency, and conotruncal anomalies such as interrupted aortic arch or tetralogy, often with a cleft palate. Low calcium with undetectable PTH and high phosphate is the parathyroid failure, not a vitamin D problem. First and second pharyngeal clefts, which supply the external ear canal and the palatine tonsil only do not form parathyroids or thymus; a second-cleft cyst is a lateral neck lesion. Foramen cecum and thyroglossal duct, which supply the thyroid follicular cells explain a midline thyroid remnant, not hypocalcemia plus an absent thymus. Ultimobranchial body alone, which supplies parathyroid hormone and the thymus cortex confuses C cells with PTH; the ultimobranchial body does not make the thymus or the bulk of parathyroid tissue. Neural crest migration into the adrenal medulla alone, which supplies cortisol would threaten epinephrine, not cortisol, and would not remove the thymus or the parathyroids.",
    "langman-embryo",
)

add(
    "Thyroglossal duct remnant",
    4,
    "pathology",
    "A 6-year-old child has a painless midline neck mass just below the hyoid that has slowly enlarged. It moves upward when the child swallows and rises further when the tongue is protruded. There is no lateral punctum, no fever, and the mass is not pulsatile. Thyroid function tests are normal. Ultrasound of the usual pretracheal bed identifies thyroid tissue in the normal location in addition to the tract. A surgeon planning excision is reminded to remove the central portion of the hyoid. A classmate suggests this is a branchial cleft cyst because both are embryonic leftovers in the neck.",
    "Which embryonic path left this midline tract?",
    [
        "The thyroid bud descended from the foramen cecum, and the thyroglossal duct failed to obliterate",
        "A second branchial cleft sinus remained open and tracks to the tonsillar fossa from a lateral opening",
        "The third pharyngeal pouch thymus failed to descend and left a midline parathyroid adenoma",
        "Ultimobranchial C cells migrated up the carotid and formed a lateral medullary carcinoma",
        "Neural crest in the adrenal medulla left a catecholamine-secreting midline nodule",
    ],
    "The thyroid bud descended from the foramen cecum, and the thyroglossal duct failed to obliterate",
    "The thyroid follicular anlage begins as an endodermal thickening at the foramen cecum and descends in the midline, anterior to the hyoid, to the pretracheal position. The tract normally obliterates. A remnant cyst stays in the midline, is attached to the path of the hyoid, and therefore moves with tongue protrusion as well as swallowing. Removing the cyst without the central hyoid leaves a tract and a recurrence. Because the mass is a remnant and not the only thyroid, this child still has a normal gland; a lingual thyroid would be different, because it may be the only thyroid tissue. A second branchial cleft sinus remained open and tracks to the tonsillar fossa from a lateral opening is lateral, often with a punctum along the anterior sternocleidomastoid, and does not move with tongue protrusion. The third pharyngeal pouch thymus failed to descend and left a midline parathyroid adenoma is a developmental failure of thymus and inferior parathyroids, not a mobile midline cyst. Ultimobranchial C cells migrated up the carotid and formed a lateral medullary carcinoma are parafollicular cells and do not form a childhood midline cyst that moves with the tongue. Neural crest in the adrenal medulla left a catecholamine-secreting midline nodule is a pheochromocytoma location and chemistry this mass does not have.",
    "langman-embryo",
)

add(
    "SRY-positive 46,XX testicular disorder",
    4,
    "pathology",
    "A 29-year-old man is evaluated for azoospermia. He is 180 cm tall, has small firm testes, and has completed puberty with male external genitalia and no hypospadias. There is no uterus on imaging. Karyotype is 46,XX. A fluorescence study shows SRY material on the tip of one X chromosome. FSH is high, testosterone is low-normal, and LH is mildly high. 17-hydroxyprogesterone is normal, sodium and potassium are normal, and he was not virilized from an infant female phenotype. A biopsy is not expected to find spermatogenesis. He has no anosmia.",
    "How did an XX karyotype still produce testes and male external genitalia?",
    [
        "Translocation of SRY onto an X chromosome initiated testis differentiation, but other Y genes needed for spermatogenesis are missing",
        "21-hydroxylase deficiency virilized a 46,XX fetus and left a uterus with ovaries",
        "Androgen insensitivity in a 46,XY fetus produced female external genitalia and a blind vagina",
        "3-beta-hydroxysteroid dehydrogenase deficiency left DHEA high and the karyotype unstable",
        "Anti-Mullerian hormone receptor failure preserved a uterus inside an otherwise ordinary 46,XY male",
    ],
    "Translocation of SRY onto an X chromosome initiated testis differentiation, but other Y genes needed for spermatogenesis are missing",
    "SRY is usually on the short arm of the Y chromosome and, during recombination, can translocate to the X. An embryo that inherits that X activates the testis-determining cascade, forms testes, secretes anti-Mullerian hormone, and masculinizes the external genitalia with testicular androgens. The rest of the Y chromosome, including azoospermia-factor regions required for spermatogenesis, is absent, so the testes are small and there is no sperm. FSH rises as seminiferous tubules fail. This is not a hormone-excess virilization of a female internal anatomy. 21-hydroxylase deficiency virilized a 46,XX fetus and left a uterus with ovaries would leave ovaries and a uterus and would show an adrenal precursor abnormality, not SRY-positive testes. Androgen insensitivity in a 46,XY fetus produced female external genitalia and a blind vagina is a female phenotype with a Y chromosome and a nonworking receptor. 3-beta-hydroxysteroid dehydrogenase deficiency left DHEA high and the karyotype unstable is an autosomal enzyme defect and does not move SRY or create azoospermia in a fully masculinized XX adult. Anti-Mullerian hormone receptor failure preserved a uterus inside an otherwise ordinary 46,XY male would show a uterus and a Y chromosome.",
    "langman-embryo",
)

add(
    "PCOS androgen mechanism",
    4,
    "pathology",
    "A 26-year-old woman has cycles every two to four months, acne, and terminal hair on the chin and lower abdomen. BMI is 34. Fasting insulin is high, fasting glucose is 104 mg/dL, and a two-hour glucose is 168 mg/dL. SHBG is low, total testosterone is mildly high, and free testosterone is disproportionately high. LH drawn on several mornings is about twice FSH. Ovaries are enlarged with many peripheral follicles, and 17-hydroxyprogesterone is normal both basal and after cosyntropin. She does not have Cushingoid striae or a suppressed ACTH. Prolactin and TSH are normal.",
    "Which paired mechanisms raise her free testosterone?",
    [
        "Rapid GnRH pulses raise LH, which drives theca androgen synthesis, and insulin lowers hepatic SHBG",
        "FSH-driven granulosa aromatase excess raises estradiol and also raises SHBG",
        "21-hydroxylase block elevates 17-hydroxyprogesterone and is required for this free-testosterone pattern",
        "Autoimmune destruction of theca cells lowers androgens and raises SHBG",
        "Aromatase overexpression in adipocytes converts testosterone into estradiol and lowers free androgen",
    ],
    "Rapid GnRH pulses raise LH, which drives theca androgen synthesis, and insulin lowers hepatic SHBG",
    "In polycystic ovary syndrome the GnRH pulse generator runs fast, and fast pulses favor LH over FSH. LH stimulates theca cells to convert cholesterol into androstenedione and testosterone. Hyperinsulinemia acts on the ovary to increase that androgen output and, at the liver, suppresses SHBG. Less SHBG means a larger fraction of the testosterone is free and active at the hair follicle, so hirsutism can exceed what the total testosterone suggests. The relatively low FSH and the androgenic follicle environment stall follicle maturation, so ovulation is infrequent. FSH-driven granulosa aromatase excess raises estradiol and also raises SHBG would lower free androgen and is the opposite enzyme direction; granulosa aromatase is not the driver of the high free testosterone. 21-hydroxylase block elevates 17-hydroxyprogesterone and is required for this free-testosterone pattern was excluded by the normal cosyntropin test. Autoimmune destruction of theca cells lowers androgens and raises SHBG would cause low, not high, free testosterone. Aromatase overexpression in adipocytes converts testosterone into estradiol and lowers free androgen is a real adipose pathway but it consumes testosterone and does not explain a high free testosterone with a low SHBG.",
    "robbins-10",
)

add(
    "PCOS unopposed estrogen",
    4,
    "pathology",
    "A 34-year-old woman with long-standing oligomenorrhea, obesity, and hirsutism presents with unpredictable heavy bleeding. She has not had a spontaneous monthly period in three years. Endometrial biopsy shows persistent proliferative glands and foci of complex hyperplasia without secretory change. A serum progesterone drawn at random is 0.4 ng/mL. Estradiol is in the mid-follicular range. FSH is not menopausal. A progesterone challenge later produces a withdrawal bleed. She does not have a coagulopathy, and cervical screening is negative. 17-hydroxyprogesterone is normal.",
    "Why is the endometrium hyperplastic despite so few periods?",
    [
        "Anovulation means no corpus luteum, so estrogen proliferates the lining without progesterone opposition",
        "Progesterone excess from repeated ovulation has decidualized the stroma and then broken through",
        "Menopausal FSH elevation has exhausted follicles and left an atrophic, not hyperplastic, lining",
        "Anti-Mullerian hormone from granulosa cells directly proliferates endometrial glands",
        "Androgen receptor blockade by endogenous testosterone causes secretory exhaustion",
    ],
    "Anovulation means no corpus luteum, so estrogen proliferates the lining without progesterone opposition",
    "Ovulation produces a corpus luteum and a luteal progesterone rise that converts proliferative endometrium into secretory endometrium and then, when progesterone falls, an organized bleed. Without ovulation there is no corpus luteum, progesterone stays low, and estradiol continues to drive gland proliferation. The lining eventually outgrows its supply and sheds irregularly, which is the heavy unpredictable bleeding, and over years it can progress from hyperplasia toward endometrioid carcinoma. A progesterone challenge bleeds because the lining was estrogen-primed and the outflow tract is open. Progesterone excess from repeated ovulation has decidualized the stroma and then broken through would show secretory histology and a high progesterone, the opposite of this biopsy. Menopausal FSH elevation has exhausted follicles and left an atrophic, not hyperplastic, lining is the low-estrogen state; her FSH is not menopausal and estradiol is present. Anti-Mullerian hormone from granulosa cells directly proliferates endometrial glands is not an endometrial growth factor in this sense; it marks follicle reserve. Androgen receptor blockade by endogenous testosterone causes secretory exhaustion reverses both the hormone and the histology: testosterone is high, not blocking its receptor, and the glands are proliferative rather than secretory.",
    "robbins-10",
)

add(
    "Two-cell estradiol synthesis",
    4,
    "physiology",
    "Granulosa cells isolated from a preovulatory follicle are cultured with cholesterol and FSH. They do not release estradiol. When androstenedione is added to the same FSH-containing medium, estradiol appears in the supernatant within hours. Theca cells from the same follicle, given LH and cholesterol, release androstenedione but almost no estradiol. A receptor survey shows LH receptors and CYP17 in the theca, and FSH receptors with inducible aromatase in the granulosa. The granulosa cells acquire LH receptors only later, close to ovulation. No adrenal tissue is in the culture. The experiment is repeated twice with the same split result.",
    "Which division of labor explains these culture results?",
    [
        "LH drives theca CYP17 to make androgens, and FSH induces granulosa aromatase to convert them to estradiol",
        "FSH drives theca CYP17, and LH induces aromatase inside the same theca cell",
        "Granulosa cells express CYP17 and can make estradiol from cholesterol once FSH is present",
        "Theca aromatase is the main estrogen source and does not need an androgen substrate",
        "Progesterone from the corpus luteum is required before any follicular estradiol can be made",
    ],
    "LH drives theca CYP17 to make androgens, and FSH induces granulosa aromatase to convert them to estradiol",
    "Estradiol synthesis in the follicle is a two-cell, two-gonadotropin sequence. Theca interna cells are under LH, express the enzymes through CYP17, and stop at androstenedione because they have little aromatase. That androgen diffuses to granulosa cells. FSH induces CYP19 aromatase in granulosa cells, which converts androstenedione to estrone and then estradiol, but granulosa cells lack CYP17 and therefore cannot start from cholesterol. The culture reproduces exactly that split: cholesterol plus FSH is not enough, androstenedione plus FSH is enough, and theca makes the androgen. FSH drives theca CYP17, and LH induces aromatase inside the same theca cell swaps both the cells and the gonadotropins. Granulosa cells express CYP17 and can make estradiol from cholesterol once FSH is present is contradicted by the cholesterol-only well that made no estradiol. Theca aromatase is the main estrogen source and does not need an androgen substrate is contradicted by the theca well that released androgen rather than estradiol. Progesterone from the corpus luteum is required before any follicular estradiol can be made reverses the calendar: follicular estradiol comes before the corpus luteum exists.",
    "guyton-14",
)

add(
    "LH surge switch",
    4,
    "physiology",
    "In a monitored cycle, estradiol rises from 40 pg/mL on day 2 to 80 pg/mL on day 8 and LH stays low. From day 10 through day 12 estradiol is held above 250 pg/mL. On day 12 LH rises sharply, a dominant follicle measures 20 mm, and ovulation follows about 36 hours later. In a prior experimental cycle the same woman was given an estradiol pulse that peaked high for only six hours; LH remained suppressed and no follicle ruptured. Progesterone is still low before the surge. She is not taking clomiphene or a GnRH agonist. Cervical mucus on the day of the surge is clear and stretchy.",
    "What converts estrogen feedback from negative to positive?",
    [
        "A sustained high estradiol for about two days switches the pituitary and hypothalamus into an LH surge",
        "Any brief estradiol spike, however short, triggers ovulation the same day",
        "Falling estradiol is the signal that ruptures the follicle",
        "Progesterone withdrawal from a prior corpus luteum is required to start the surge",
        "Inhibin B rising above estradiol is what releases the LH peak",
    ],
    "A sustained high estradiol for about two days switches the pituitary and hypothalamus into an LH surge",
    "Through most of the follicular phase, estradiol and inhibin restrain FSH and LH. Once estradiol stays high for a sufficient duration, classically on the order of fifty hours above the ovulatory threshold, feedback at the pituitary and hypothalamus flips from negative to positive. The LH surge then lasts about a day and a half, and ovulation follows roughly 36 hours after the surge begins. A short spike does not flip the switch, which is why the six-hour experiment only suppressed LH. A small amount of progesterone can facilitate the surge, but it is not the initiating signal while progesterone is still low. Any brief estradiol spike, however short, triggers ovulation the same day is excluded by the six-hour clamp. Falling estradiol is the signal that ruptures the follicle is the pattern of luteolysis and menses, not of ovulation. Progesterone withdrawal from a prior corpus luteum is required to start the surge describes menstrual shedding, and the surge occurs before a new corpus luteum exists. Inhibin B rising above estradiol is what releases the LH peak is backward: inhibin B selectively holds FSH down and does not generate the LH surge.",
    "guyton-14",
)

add(
    "Midluteal progesterone",
    4,
    "physiology",
    "A 31-year-old woman with regular 28-day cycles is evaluated for one year of infertility. Day-3 FSH is 6 mIU/mL and anti-Mullerian hormone is normal. A hysterosalpingogram has not yet been done. Seven days after a urinary LH surge, serum progesterone is 14 ng/mL and the basal body temperature has been 0.4 degrees higher than her follicular baseline. An endometrial biopsy is not available. Her partner semen analysis is pending. She has no galactorrhea, and prolactin is normal. The couple asks whether this blood test means the fallopian tubes are open.",
    "What does the midluteal progesterone establish, and what does it leave untested?",
    [
        "Ovulation occurred and the corpus luteum is secreting progesterone; tubal patency is not measured by this level",
        "Both tubes are patent because progesterone only rises when an oocyte has entered the uterus",
        "Ovarian reserve is gone because a high progesterone suppresses day-3 FSH",
        "The endometrium is secretory only if progesterone is below 1 ng/mL",
        "A luteal-phase progesterone of 14 ng/mL means she did not ovulate and needs clomiphene before any further test",
    ],
    "Ovulation occurred and the corpus luteum is secreting progesterone; tubal patency is not measured by this level",
    "After ovulation, luteinized granulosa cells form the corpus luteum and secrete progesterone. A midluteal value well above 3 ng/mL, here 14, confirms that a follicle ruptured and that the corpus luteum is working. Progesterone also raises the hypothalamic temperature set point, which is the basal-temperature shift. The fallopian tubes are not part of that hormone loop: an oocyte can be trapped by a blocked tube and the corpus luteum will still make progesterone. Tubal patency needs imaging or a surgical look. Ovarian reserve is a follicular-phase question answered here by the normal day-3 FSH and anti-Mullerian hormone, not by the luteal progesterone. Both tubes are patent because progesterone only rises when an oocyte has entered the uterus confuses luteal hormone production with tubal transport. Ovarian reserve is gone because a high progesterone suppresses day-3 FSH misreads a normal reserve test. The endometrium is secretory only if progesterone is below 1 ng/mL reverses the threshold: secretory transformation requires progesterone exposure, and a low value would suggest anovulation. A luteal-phase progesterone of 14 ng/mL means she did not ovulate and needs clomiphene before any further test uses the anovulatory cutoff on an ovulatory result.",
    "guyton-14",
)

add(
    "GnRH pulse frequency",
    5,
    "physiology",
    "Two women are studied with frequent LH sampling. The first has polycystic ovary syndrome: LH pulses about once an hour, mean LH high, FSH relatively low, and ovaries full of small follicles. The second has recovered functional hypothalamic amenorrhea and is being replaced with a pump: when pulses are delivered every three hours, FSH rises more than LH and a follicle slowly grows; when the same daily dose is switched to hourly pulses, LH rises disproportionately. Neither woman is on a continuous agonist. A third observation, from a man on depot leuprolide, shows both hormones falling after the first weeks.",
    "How does GnRH pulse frequency choose between LH and FSH?",
    [
        "Rapid pulses favor LH-beta transcription, slow pulses favor FSH, and continuous occupancy downregulates both",
        "Rapid pulses favor FSH, which is why polycystic ovary syndrome has a low LH",
        "Pulse frequency does not matter; only the total daily GnRH dose sets the LH to FSH ratio",
        "Slow pulses downregulate the receptor the way a depot agonist does",
        "FSH is released only by a continuous GnRH infusion, and LH is released only by inhibin",
    ],
    "Rapid pulses favor LH-beta transcription, slow pulses favor FSH, and continuous occupancy downregulates both",
    "Gonadotrophs read the pattern of GnRH, not just the amount. Pulses about once an hour preferentially increase LH-beta gene transcription, which is the polycystic ovary pattern and the hourly-pump result. Pulses every two to three hours favor FSH-beta, which is useful for follicle recruitment and is closer to the slower pattern of the luteal phase when progesterone slows the generator. Continuous receptor occupancy, as with depot leuprolide, desensitizes the gonadotroph and both hormones fall after the flare. The pump experiment keeps the daily dose constant and changes only the interval, so the ratio change is frequency, not dose. Rapid pulses favor FSH, which is why polycystic ovary syndrome has a low LH reverses the observed LH dominance. Pulse frequency does not matter; only the total daily GnRH dose sets the LH to FSH ratio is excluded by the same daily dose producing opposite ratios at two intervals. Slow pulses downregulate the receptor the way a depot agonist does confuses a physiologic slow pulse, which still works, with continuous occupancy. FSH is released only by a continuous GnRH infusion, and LH is released only by inhibin assigns FSH to the pattern that actually suppresses both hormones, and inhibin inhibits FSH rather than releasing LH.",
    "guyton-14",
)

add(
    "Luteal-placental shift",
    4,
    "physiology",
    "A woman with a corpus luteum cyst undergoes laparoscopy. In one pregnancy the cyst, which is the corpus luteum, is removed at 6 weeks from the last menstrual period. Serum progesterone falls from 22 ng/mL to 4 ng/mL and she bleeds. In a later pregnancy a similar cyst is removed at 12 weeks. Progesterone stays at 28 ng/mL, hCG is high, and the pregnancy continues without progesterone supplementation. Ultrasound at 12 weeks shows a live fetus and a placenta. She has no adrenal enzyme defect. The surgeon asks why the same operation is dangerous at one gestational age and tolerated at the other.",
    "What has taken over progesterone production by 12 weeks?",
    [
        "The placenta now makes progesterone, so the pregnancy no longer depends on hCG support of the corpus luteum",
        "Maternal adrenal 21-hydroxylase has been induced by hCG and is the new progesterone source",
        "The fetal liver converts DHEA-sulfate directly into progesterone after week 6",
        "Pituitary LH replaces hCG at 12 weeks and keeps the removed corpus luteum alive",
        "Decidual prolactin maintains progesterone secretion after the corpus luteum is gone at 6 weeks",
    ],
    "The placenta now makes progesterone, so the pregnancy no longer depends on hCG support of the corpus luteum",
    "For the first 7 to 8 weeks, and safely through about 10 weeks, progesterone that maintains the decidua comes from the corpus luteum. Syncytiotrophoblast hCG binds the LH receptor and keeps that corpus luteum from regressing. Remove it at 6 weeks and progesterone collapses. By about 8 to 10 weeks the placenta itself synthesizes enough progesterone from maternal cholesterol that the corpus luteum is no longer required. At 12 weeks that luteal-placental shift has occurred, so progesterone stays high after the cyst is removed. Maternal adrenal 21-hydroxylase has been induced by hCG and is the new progesterone source is not a pregnancy progesterone pathway; 21-hydroxylase is an adrenal enzyme on the way to cortisol and aldosterone. The fetal liver converts DHEA-sulfate directly into progesterone after week 6 uses the wrong product: the fetal adrenal-liver unit supplies DHEA-sulfate for placental estriol, not the bulk of progesterone. Pituitary LH replaces hCG at 12 weeks and keeps the removed corpus luteum alive cannot stimulate a corpus luteum that has been removed, and pituitary LH is suppressed by pregnancy steroids. Decidual prolactin maintains progesterone secretion after the corpus luteum is gone at 6 weeks does not explain the progesterone crash at 6 weeks or the placental capacity at 12 weeks.",
    "guyton-14",
)

add(
    "Anovulatory breakthrough bleeding",
    4,
    "physiology",
    "A 15-year-old girl has a BMI of 33 and bleeding that arrives every two to five months and then lasts more than ten days. Hemoglobin is 9.8 g/dL. Coagulation studies are normal and a pregnancy test is negative. Endometrial sampling shows proliferative glands without secretory vacuoles. A random progesterone is 0.3 ng/mL and estradiol is 90 pg/mL. TSH and prolactin are normal. She has never had a sustained basal-temperature rise. After a ten-day course of a progestin she has a predictable bleed and the next cycle can be scheduled. Her mother asks why the lining bleeds at all if she is not ovulating.",
    "Which bleeding mechanism fits proliferative histology and a flat progesterone?",
    [
        "Estrogen breakthrough bleeding from a lining that proliferated without progesterone stabilization",
        "Progesterone withdrawal bleeding, the mechanism of a normal monthly period",
        "Estrogen withdrawal bleeding after a sudden crash from a high ovulatory peak",
        "Androgen withdrawal bleeding because testosterone fell and the spiral arteries constricted",
        "Progesterone breakthrough bleeding from a long-acting progestin-only implant",
    ],
    "Estrogen breakthrough bleeding from a lining that proliferated without progesterone stabilization",
    "In a normal cycle, progesterone from the corpus luteum stabilizes the estrogen-primed endometrium and then its fall triggers an organized withdrawal bleed. This patient is not ovulating, so progesterone stays flat and the glands never become secretory. Estradiol still proliferates the lining until it is thick, fragile, and under-supported by stroma and vessels. Random portions then break down. That is estrogen breakthrough bleeding, and it is often heavy because there is no progesterone-coordinated vascular spasm of the whole lining. A progestin given for ten days supplies the missing stabilization and its withdrawal produces a controlled bleed. Progesterone withdrawal bleeding, the mechanism of a normal monthly period requires a preceding luteal progesterone rise she does not have. Estrogen withdrawal bleeding after a sudden crash from a high ovulatory peak is the midcycle spot some ovulatory women have, not months of proliferation. Androgen withdrawal bleeding because testosterone fell and the spiral arteries constricted is not the endometrial control system; spiral-artery changes are progesterone dependent. Progesterone breakthrough bleeding from a long-acting progestin-only implant is spotting on continuous progestin exposure, and she is not using one.",
    "guyton-14",
)

add(
    "Early secretory endometrium",
    4,
    "pathology",
    "An endometrial biopsy is taken four days after a documented LH surge in a 29-year-old woman with regular cycles. The glands are slightly coiled. The epithelial nuclei are pushed toward the lumen by uniform subnuclear vacuoles, and mitoses are no longer prominent. The stroma is not yet decidualized and spiral arterioles are not yet prominent. Serum progesterone that morning is 8 ng/mL. A biopsy from her previous anovulatory year, taken at a random time, showed straight tubular glands, pseudostratified nuclei, and many mitoses without vacuoles. She is not taking exogenous hormones.",
    "Which hormone produced the subnuclear vacuoles, and from where?",
    [
        "Progesterone from the new corpus luteum acting on an estrogen-primed gland",
        "Estradiol alone, which creates subnuclear glycogen vacuoles on day 8",
        "FSH acting directly on endometrial epithelium to start secretion",
        "Progesterone from the adrenal zona glomerulosa before ovulation",
        "Anti-Mullerian hormone from granulosa cells opening endometrial vacuoles",
    ],
    "Progesterone from the new corpus luteum acting on an estrogen-primed gland",
    "Subnuclear vacuoles are the first reliable histologic sign of ovulation. They appear about 36 to 48 hours after ovulation, when progesterone from the corpus luteum pushes glycogen to the base of the glandular cell and the nucleus sits above it. Four days after the LH surge is about two days after ovulation, which is exactly that window, and the serum progesterone of 8 ng/mL confirms a corpus luteum. Later the vacuoles move above the nucleus, secretions fill the lumen, and the stroma decidualizes. The earlier biopsy, with straight glands and mitoses, is estrogen-driven proliferative endometrium. Estradiol alone, which creates subnuclear glycogen vacuoles on day 8 produces proliferation, not vacuoles; day 8 is still follicular. FSH acting directly on endometrial epithelium to start secretion has no endometrial receptor effect that creates this histology; FSH acts on granulosa cells. Progesterone from the adrenal zona glomerulosa before ovulation is the wrong zone and the wrong time: the glomerulosa makes aldosterone, and preovulatory progesterone is too low to vacuolate the glands. Anti-Mullerian hormone from granulosa cells opening endometrial vacuoles is not an endometrial secretagogue.",
    "robbins-10",
)

add(
    "Prolactin and GnRH",
    4,
    "physiology",
    "A 31-year-old woman starts risperidone for a psychotic disorder. Three months later she has amenorrhea and bilateral galactorrhea. Prolactin is 95 ng/mL, TSH is normal, a pregnancy test is negative, and pituitary MRI shows no adenoma. LH and FSH are low, and estradiol is 20 pg/mL. She previously had monthly cycles. A morning cortisol is normal. The psychiatrist confirms she is taking the medication regularly and that aripiprazole, which has a different dopamine effect, is being considered. She is not on metoclopramide or estrogen.",
    "How did this drug stop ovulation?",
    [
        "Dopamine D2 blockade removes inhibition of lactotrophs, and the resulting prolactin suppresses GnRH",
        "The drug is a GnRH receptor agonist and downregulates the pituitary directly",
        "Dopamine D2 stimulation suppresses prolactin and therefore raises GnRH",
        "TRH excess from new hypothyroidism stimulates prolactin, and the TSH should be high",
        "Ovarian aromatase is inhibited, so estradiol falls while LH and FSH rise",
    ],
    "Dopamine D2 blockade removes inhibition of lactotrophs, and the resulting prolactin suppresses GnRH",
    "Hypothalamic dopamine, acting on D2 receptors, is the tonic brake on pituitary lactotrophs. Risperidone blocks those receptors, so prolactin rises even though there is no adenoma. Prolactin, through kisspeptin neurons, slows GnRH pulsatility. LH and FSH fall, the ovary makes little estradiol, ovulation stops, and milk production is stimulated. That is why a normal MRI and a low, not high, gonadotropin pair still produce amenorrhea and galactorrhea. Treating the cause, or switching to an antipsychotic with less D2 blockade, lets prolactin fall and GnRH recover. The drug is a GnRH receptor agonist and downregulates the pituitary directly would not raise prolactin to 95 or cause galactorrhea. Dopamine D2 stimulation suppresses prolactin and therefore raises GnRH is the action of cabergoline, the treatment for a prolactinoma, and the opposite of risperidone. TRH excess from new hypothyroidism stimulates prolactin, and the TSH should be high is a real alternative cause of hyperprolactinemia, excluded here by a normal TSH. Ovarian aromatase is inhibited, so estradiol falls while LH and FSH rise would raise gonadotropins by loss of estrogen feedback; here LH and FSH are low, which places the block above the pituitary.",
    "guyton-14",
)

add(
    "Menopause and inhibin",
    4,
    "physiology",
    "A 49-year-old woman has cycles that have shortened and then become unpredictable over two years. She has occasional hot flashes. On day 3, FSH is 32 mIU/mL, LH is 14 mIU/mL, and estradiol is 45 pg/mL, a low-normal early follicular value rather than an undetectable one. Anti-Mullerian hormone is very low. Inhibin B is low. She is not on hormonal contraception. Pregnancy test is negative. A friend tells her the FSH cannot rise until estradiol is fully gone, so the laboratory must be wrong. Thyroid function is normal and prolactin is normal.",
    "Why is FSH already high while estradiol is only partly reduced?",
    [
        "Loss of granulosa inhibin B removes selective negative feedback on FSH before estradiol production is exhausted",
        "LH must rise first, and a high FSH with a normal LH means a pituitary adenoma",
        "Estradiol has to reach zero before any gonadotropin can leave the negative-feedback range",
        "High inhibin B is what drives the hot flashes and the FSH rise together",
        "Prolactin suppression of GnRH is the usual first event of natural menopause",
    ],
    "Loss of granulosa inhibin B removes selective negative feedback on FSH before estradiol production is exhausted",
    "The earliest endocrine event of ovarian aging is loss of small follicles and their granulosa cells. Those cells make inhibin B, which selectively inhibits pituitary FSH. As inhibin B falls, FSH rises in the early follicular phase even while the remaining follicles can still produce a near-normal estradiol on some cycles. That high FSH then accelerates recruitment and atresia. Later, estradiol falls more consistently, LH rises too, and cycles stop. Hot flashes track estrogen withdrawal at the hypothalamus and can begin while estradiol is fluctuating rather than absent. Anti-Mullerian hormone falling is the same follicle-pool story. LH must rise first, and a high FSH with a normal LH means a pituitary adenoma reverses the order: FSH leads LH in the menopause transition, and an adenoma is not required. Estradiol has to reach zero before any gonadotropin can leave the negative-feedback range ignores inhibin. High inhibin B is what drives the hot flashes and the FSH rise together reverses the inhibin direction. Prolactin suppression of GnRH is the usual first event of natural menopause would lower, not raise, FSH, and her prolactin is normal.",
    "guyton-14",
)

add(
    "Placental lactogen insulin resistance",
    4,
    "physiology",
    "A 29-year-old woman with no diabetes before pregnancy has a 75-gram glucose tolerance test at 27 weeks. Fasting glucose is 98 mg/dL and the one-hour value is 198 mg/dL. She has gained weight as expected, the fetus is normally grown, and there is no Cushingoid appearance. Placental mass is appropriate. Random nonpregnant glucose values from a year ago were normal. Ketones are negative and an anion gap is absent. The obstetrician explains that several placental products change maternal fuel use, but one hormone rises steadily through the second half of pregnancy and is the classic driver of the insulin resistance that spares glucose for the fetus.",
    "Which placental hormone accounts for this gestational insulin resistance?",
    [
        "Human placental lactogen promotes maternal lipolysis and resistance to insulin",
        "Human chorionic gonadotropin stimulates the TSH receptor and is the main diabetogenic signal",
        "Placental progesterone directly closes beta-cell potassium channels and stops insulin release",
        "Decidual prolactin suppresses hepatic gluconeogenesis and therefore raises fasting glucose",
        "Fetal insulin crosses the placenta and blocks maternal GLUT4 for the rest of pregnancy",
    ],
    "Human placental lactogen promotes maternal lipolysis and resistance to insulin",
    "Human placental lactogen, also called human chorionic somatomammotropin, rises through the second and third trimesters in parallel with the insulin resistance of pregnancy. It shifts the mother toward lipolysis and decreases her sensitivity to insulin so that glucose is available to the fetus. Women whose insulin secretion cannot keep up develop gestational diabetes, which is why screening is done at 24 to 28 weeks rather than at conception. Cortisol and progesterone contribute, but placental lactogen is the hormone whose rise and metabolic actions define this physiology. Human chorionic gonadotropin stimulates the TSH receptor and is the main diabetogenic signal can cause transient thyrotoxicosis when very high, not the diabetogenic shift at 27 weeks when hCG has already fallen from its first-trimester peak. Placental progesterone directly closes beta-cell potassium channels and stops insulin release confuses progesterone with a sulfonylurea; beta cells usually increase insulin output in pregnancy, and the defect is resistance, not channel closure. Decidual prolactin suppresses hepatic gluconeogenesis and therefore raises fasting glucose would lower glucose if gluconeogenesis were suppressed, and decidual prolactin is not the driver. Fetal insulin crosses the placenta and blocks maternal GLUT4 for the rest of pregnancy does not happen: insulin does not cross the placenta in meaningful amounts.",
    "guyton-14",
)

add(
    "SHBG and total testosterone",
    5,
    "physiology",
    "A 33-year-old woman has tremor, heat intolerance, and a 6 kg weight loss. TSH is suppressed and free T4 is high. She has no hirsutism and her cycles are only slightly shorter. Total testosterone is above the female reference range, free testosterone is normal, and SHBG is twice the usual value. LH is not elevated, ovaries are not polycystic, and 17-hydroxyprogesterone is normal. Fasting insulin is low-normal. A clinician who looked only at the total testosterone started a workup for an androgen-secreting tumor. After the thyroid is treated, SHBG and total testosterone fall together and free testosterone stays normal.",
    "Why was total testosterone high while free testosterone was not?",
    [
        "Thyroid hormone increased hepatic SHBG, which binds testosterone and raises the total without raising the free fraction",
        "LH-driven theca production raised free testosterone and suppressed SHBG, as in polycystic ovary syndrome",
        "5-alpha-reductase excess converted estradiol into dihydrotestosterone and lowered SHBG",
        "Aromatase failure left estradiol low and pushed free androgen up",
        "Exogenous testosterone ester suppressed LH and lowered SHBG while raising free hormone",
    ],
    "Thyroid hormone increased hepatic SHBG, which binds testosterone and raises the total without raising the free fraction",
    "Hepatic SHBG production is increased by thyroid hormone and by estrogen, and decreased by insulin and by androgens. In hyperthyroidism the extra binding protein soaks up testosterone. The pituitary and hypothalamus regulate the free fraction, so free testosterone stays normal while the bound pool, and therefore the total, rises. There is no hirsutism because hair follicles see free hormone. Treating the thyroid removes the stimulus to SHBG and the total falls. LH-driven theca production raised free testosterone and suppressed SHBG, as in polycystic ovary syndrome would raise the free fraction and lower SHBG, and LH would be high, none of which is present. 5-alpha-reductase excess converted estradiol into dihydrotestosterone and lowered SHBG misstates the enzyme: 5-alpha-reductase converts testosterone to dihydrotestosterone, not estradiol to dihydrotestosterone, and it would not raise SHBG. Aromatase failure left estradiol low and pushed free androgen up would increase free androgen and cause virilization, and estrogen would be low rather than this being a binding-protein story. Exogenous testosterone ester suppressed LH and lowered SHBG while raising free hormone would suppress LH, lower SHBG, and raise free testosterone, the opposite binding pattern.",
    "guyton-14",
)

add(
    "Thyroid peroxidase organification",
    5,
    "physiology",
    "A 3-week-old infant has prolonged jaundice, a large goiter, and constipation. TSH is above 200 mIU/L and free T4 is undetectable. Hearing screening is normal, and there is no family history of deafness. A radioiodine uptake at 4 hours is substantial, proving that iodide entered the gland, but administration of perchlorate then discharges most of that radioiodine. Serum thyroglobulin is high, not low. The infant was not exposed to excess iodine, and a sodium-iodide symporter sequence, sent because of the goiter, is wild type. Levothyroxine is started while the enzymatic diagnosis is discussed.",
    "Which step failed if iodide is trapped and then discharged by perchlorate?",
    [
        "Thyroid peroxidase cannot organify the iodide that the symporter has already trapped",
        "The sodium-iodide symporter cannot move iodide into the follicular cell at all",
        "Pendrin failure blocks apical iodide transport and also causes congenital deafness",
        "Thyroglobulin synthesis failure leaves organification intact and serum thyroglobulin low",
        "Type 2 deiodinase failure in the pituitary lowers TSH despite a low free T4",
    ],
    "Thyroid peroxidase cannot organify the iodide that the symporter has already trapped",
    "Iodide is trapped by the sodium-iodide symporter and then must be oxidized and bound to tyrosyl residues on thyroglobulin. Thyroid peroxidase does that organification and the later coupling of iodotyrosines. Perchlorate blocks further uptake. If iodide was already covalently bound, it stays in the gland; if it is still free inorganic iodide, it leaks out and the uptake falls. A positive discharge test with a good initial uptake and normal hearing is a peroxidase defect. The sodium-iodide symporter cannot move iodide into the follicular cell at all would have produced a low uptake before perchlorate was given, and that gene was wild type. Pendrin failure blocks apical iodide transport and also causes congenital deafness can give a partial discharge defect, but deafness is part of Pendred syndrome and this hearing screen was normal. Thyroglobulin synthesis failure leaves organification intact and serum thyroglobulin low would not discharge iodide, and measured thyroglobulin was high. Type 2 deiodinase failure in the pituitary lowers TSH despite a low free T4 would disturb feedback, not the discharge of trapped iodide, and this TSH is extremely high.",
    "guyton-14",
)

add(
    "Pendred syndrome",
    5,
    "pathology",
    "A 9-year-old child has congenital sensorineural deafness and a newly noticed goiter. Growth has been normal and the child is clinically euthyroid, with a TSH at the upper limit of normal and a low-normal free T4. Iodine intake in the household is marginal. A perchlorate discharge test is positive, indicating a partial organification defect, but thyroid peroxidase sequencing is normal. Inner-ear imaging shows a widened vestibular aqueduct. Family history suggests autosomal recessive inheritance. There is no hyperthyroidism and no exposure to amiodarone or contrast.",
    "Which protein failure links the cochlear defect to the partial organification defect?",
    [
        "Pendrin cannot exchange iodide into the follicular lumen and cannot maintain cochlear endolymph",
        "Thyroid peroxidase is absent, which always includes congenital deafness",
        "The sodium-iodide symporter is absent, so radioiodine uptake never occurs",
        "Thyroglobulin is deleted, so serum thyroglobulin is undetectable and hearing is lost",
        "Type 1 deiodinase is absent, so reverse T3 falls and the cochlea calcifies",
    ],
    "Pendrin cannot exchange iodide into the follicular lumen and cannot maintain cochlear endolymph",
    "Pendrin, encoded by SLC26A4, sits on the apical membrane of the thyrocyte and exchanges iodide into the colloid, and it also handles anions in the inner ear. Loss of function produces a partial organification defect, a positive perchlorate discharge test, and goiter that is more evident when iodine is scarce, together with congenital deafness and an enlarged vestibular aqueduct. Most children are euthyroid or only mildly hypothyroid because some iodide still reaches thyroglobulin. Thyroid peroxidase is absent, which always includes congenital deafness is the enzyme of organification itself and does not cause this syndromic deafness; that gene was normal. The sodium-iodide symporter is absent, so radioiodine uptake never occurs would prevent trapping before any discharge test could be positive in this pattern, and it does not enlarge the vestibular aqueduct. Thyroglobulin is deleted, so serum thyroglobulin is undetectable and hearing is lost is a goitrous hypothyroidism with intact hearing and low thyroglobulin. Type 1 deiodinase is absent, so reverse T3 falls and the cochlea calcifies is a peripheral thyroid-hormone activation step, not a cause of congenital deafness with a discharge-positive goiter.",
    "robbins-10",
)

add(
    "Jod-Basedow versus Wolff-Chaikoff",
    5,
    "physiology",
    "A 74-year-old man who grew up in an iodine-deficient mountain region has a long-standing multinodular goiter. Two weeks after a contrast-enhanced CT he develops atrial fibrillation. TSH is suppressed, free T4 is high, and free T3 is high. The gland is nodular and nontender. Anti-TSH-receptor antibodies are negative. A healthy intern who received the same contrast dose for a kidney stone has a normal TSH six weeks later. The attending contrasts the transient organification block expected in a normal gland with the behavior of nodules that are no longer under TSH control.",
    "Why did the iodine load cause hyperthyroidism in the patient but not in the intern?",
    [
        "Autonomous nodules use the iodine to make excess hormone, which is the Jod-Basedow effect",
        "Wolff-Chaikoff inhibition persisted in the patient and increased hormone release",
        "Subacute thyroiditis dumped stored hormone because the contrast caused gland pain",
        "New Graves disease appeared because contrast induces stimulating antibodies",
        "Both men should remain hyperthyroid, because a normal gland cannot escape iodide block",
    ],
    "Autonomous nodules use the iodine to make excess hormone, which is the Jod-Basedow effect",
    "A large iodide load briefly inhibits organification, the Wolff-Chaikoff effect. A normal gland then escapes by downregulating the sodium-iodide symporter, intracellular iodide falls, and hormone synthesis resumes at a euthyroid rate. That is the intern. Nodules that have become autonomous are not held by TSH and will use a sudden supply of iodine as substrate, so hormone production rises. That iodine-induced hyperthyroidism is the Jod-Basedow effect and is the reason a nodular goiter from an iodine-poor region can declare itself after contrast or amiodarone. Wolff-Chaikoff inhibition persisted in the patient and increased hormone release describes the inhibitory phenomenon, which lowers rather than raises synthesis, and escape failure causes hypothyroidism. Subacute thyroiditis dumped stored hormone because the contrast caused gland pain requires a tender gland and a low uptake from inflammation, not autonomous use of new iodine. New Graves disease appeared because contrast induces stimulating antibodies is excluded by the negative antibody and by the nodular background. Both men should remain hyperthyroid, because a normal gland cannot escape iodide block is the opposite of escape: the normal gland downregulates uptake and stays euthyroid.",
    "guyton-14",
)

add(
    "Nonthyroidal illness",
    4,
    "physiology",
    "A 68-year-old man has been in the intensive care unit for six days with pneumonia and septic shock, now improving. He had no thyroid disease. TSH is 0.8 mIU/L, free T4 is low-normal, total T3 is frankly low, and reverse T3 is high. He is not bradycardic, the gland is not enlarged, and anti-thyroid peroxidase antibodies are negative. A student orders levothyroxine because the T3 is low. The fellow asks for the deiodinase pattern before any hormone is given. Cortisol and a basic metabolic panel do not suggest adrenal failure. By discharge the plan is to recheck thyroid tests only if they stay abnormal after recovery.",
    "Which deiodinase pattern produces low T3 and high reverse T3 with a nonelevated TSH?",
    [
        "Outer-ring deiodinase activity falls, so less T3 is made and reverse T3 clearance slows",
        "Primary hypothyroidism raises TSH and lowers reverse T3 along with T3",
        "Graves disease raises T3 and suppresses reverse T3 while TSH falls to zero",
        "Thyroid-binding globulin excess raises free T4 and raises TSH together",
        "Type 2 deiodinase in the pituitary is overactive, which lowers TSH and raises T3",
    ],
    "Outer-ring deiodinase activity falls, so less T3 is made and reverse T3 clearance slows",
    "In severe illness, type 1 deiodinase, an outer-ring enzyme, is downregulated. Less T4 is converted to T3, and reverse T3, which is cleared by the same outer-ring activity, accumulates. Type 3 deiodinase, an inner-ring enzyme, is often upregulated and pushes T4 toward reverse T3. TSH stays inappropriately normal for the low T3 because the illness also changes hypothalamic set points and because T4 is not frankly low. This low-T3 state reduces metabolic demand and is not treated with levothyroxine. Primary hypothyroidism raises TSH and lowers reverse T3 along with T3 would show a high TSH and a low free T4, and reverse T3 is not the elevated species. Graves disease raises T3 and suppresses reverse T3 while TSH falls to zero is hyperthyroidism, with a high T3 and a fully suppressed TSH. Thyroid-binding globulin excess raises free T4 and raises TSH together actually raises total hormone while free T4 and TSH stay normal. Type 2 deiodinase in the pituitary is overactive, which lowers TSH and raises T3 would increase local T3 in the pituitary and circulating T3, not this high reverse T3 pattern.",
    "guyton-14",
)

add(
    "Estrogen and thyroid-binding globulin",
    4,
    "physiology",
    "A 57-year-old woman starts oral conjugated estrogen for severe hot flashes. Eight weeks later a screening panel shows a high total T4, a normal free T4, and a TSH of 1.6 mIU/L. She feels well, her pulse is 72, and she has no tremor, goiter, or eye findings. Thyroid-binding globulin is elevated. She is not pregnant. A clinician who saw only the total T4 prescribed methimazole. Repeat free T4 by equilibrium dialysis is again normal. She asks whether the estrogen created hyperthyroidism or only changed the binding protein.",
    "Why is total T4 high while free T4 and TSH remain normal?",
    [
        "Estrogen raises thyroid-binding globulin, so total hormone rises until the free fraction is normal again",
        "Graves disease has begun, which would suppress TSH and raise free T4",
        "A TSH-secreting adenoma keeps TSH normal while free T4 is truly high",
        "Factitious levothyroxine suppresses thyroglobulin and suppresses TSH",
        "Nonthyroidal illness lowers T3 and raises reverse T3 with a low free T4",
    ],
    "Estrogen raises thyroid-binding globulin, so total hormone rises until the free fraction is normal again",
    "Oral estrogen increases hepatic production and glycosylation of thyroid-binding globulin, so more binding sites appear. Total T4 rises as hormone occupies those sites. Free T4 falls only transiently, TSH does not need to stay high, and a new steady state is reached with a normal free fraction and a normal TSH. The patient is euthyroid and methimazole is not indicated. The same pattern occurs in pregnancy. Graves disease has begun, which would suppress TSH and raise free T4 requires a low TSH and a high free T4, neither of which is present. A TSH-secreting adenoma keeps TSH normal while free T4 is truly high would elevate free hormone and usually cause clinical thyrotoxicosis and a pituitary mass. Factitious levothyroxine suppresses thyroglobulin and suppresses TSH would suppress TSH and raise free T4 if the dose were excessive. Nonthyroidal illness lowers T3 and raises reverse T3 with a low free T4 is a sick-patient pattern, not the binding change of a well woman on estrogen.",
    "guyton-14",
)

add(
    "Propylthiouracil in thyroid storm",
    4,
    "pharmacology",
    "A 41-year-old woman with known Graves disease misses her methimazole and then develops pneumonia. She is febrile to 40.1 C, agitated, and in atrial fibrillation with a rate of 160. Free T4 and free T3 are both very high and TSH is suppressed. The team gives intravenous fluid, a beta blocker, and a glucocorticoid, and chooses propylthiouracil rather than restarting methimazole as the thionamide. Iodide will be given only after the thionamide has been started. She is not pregnant. Liver enzymes are currently normal. The question is which extra enzymatic action makes propylthiouracil the storm drug.",
    "What does propylthiouracil inhibit that methimazole does not?",
    [
        "Peripheral type 1 deiodinase, so conversion of T4 to T3 falls immediately",
        "The sodium-iodide symporter only, without any effect on thyroid peroxidase",
        "Thyroid-binding globulin synthesis, which lowers total but not free hormone",
        "TSH-receptor antibodies, which clear from the circulation within one hour",
        "Parathyroid hormone secretion, which is why calcium is checked in storm",
    ],
    "Peripheral type 1 deiodinase, so conversion of T4 to T3 falls immediately",
    "Both propylthiouracil and methimazole inhibit thyroid peroxidase and therefore new hormone synthesis. Only propylthiouracil also inhibits peripheral type 1 deiodinase, so T4 already in the blood is converted to T3 more slowly. In storm, where existing hormone is the immediate problem, that extra block is why propylthiouracil is preferred, along with a beta blocker, a glucocorticoid that also slows conversion, and iodide given after synthesis is blocked so that the iodine is not used as substrate. Peripheral type 1 deiodinase inhibition is a pharmacologic difference, not a difference in antibody clearance. The sodium-iodide symporter only, without any effect on thyroid peroxidase is not how either thionamide works; both hit peroxidase. Thyroid-binding globulin synthesis, which lowers total but not free hormone is an estrogen effect, not a thionamide effect. TSH-receptor antibodies, which clear from the circulation within one hour are not cleared by the drug. Parathyroid hormone secretion, which is why calcium is checked in storm is unrelated; storm treatment is aimed at thyroid hormone synthesis and T4-to-T3 conversion.",
    "katzung-16",
)

add(
    "Antithyroid drug in early pregnancy",
    4,
    "pharmacology",
    "A 28-year-old woman with Graves disease is 8 weeks pregnant and clinically euthyroid on methimazole 10 mg daily. Free T4 is at the upper reference limit and TSH is 0.2 mIU/L. She has no liver disease. The pregnancy was unplanned and organogenesis is underway. She asks whether to stay on the current drug through the first trimester. The plan discussed with her is to change antithyroid drugs now and to change back after the first trimester, using the lowest dose that keeps free T4 at or just above the reference limit. Radioiodine is not an option. She has no agranulocytosis.",
    "Which switch fits the first-trimester teratogenicity and later hepatotoxicity tradeoff?",
    [
        "Use propylthiouracil now, then return to methimazole after the first trimester",
        "Continue methimazole through organogenesis because it does not cross the placenta",
        "Stop every antithyroid drug until delivery because both are contraindicated for the whole pregnancy",
        "Give radioiodine this week and stop the thionamide the same day",
        "Replace the thionamide with iodine drops alone for the entire gestation",
    ],
    "Use propylthiouracil now, then return to methimazole after the first trimester",
    "Methimazole exposure in the first trimester is associated with aplasia cutis, choanal atresia, and a related embryopathy. Propylthiouracil is therefore the preferred thionamide during that window. Propylthiouracil has a higher risk of severe hepatocellular injury, so after organogenesis the usual plan is to return to methimazole for the second and third trimesters. Both drugs cross the placenta, and the dose is kept as low as possible so fetal hypothyroidism is avoided. This sequencing is the recommendation of the 2016 American Thyroid Association hyperthyroidism guidance. Continue methimazole through organogenesis because it does not cross the placenta is wrong on both the safety timing and the claim that the drug stays out of the fetus. Stop every antithyroid drug until delivery because both are contraindicated for the whole pregnancy would leave uncontrolled Graves disease, which itself threatens the pregnancy. Give radioiodine this week and stop the thionamide the same day is contraindicated in pregnancy because the isotope crosses the placenta and ablates the fetal thyroid. Replace the thionamide with iodine drops alone for the entire gestation can be a brief preoperative block but is not the gestational substitute for a thionamide.",
    "ata-hyper-2016",
)

add(
    "Factitious thyrotoxicosis",
    5,
    "pathology",
    "A 36-year-old nurse has weight loss, tremor, and a pulse of 110. TSH is suppressed and free T4 is high. The thyroid is small and nontender. Radioactive iodine uptake at 24 hours is 1 percent. Serum thyroglobulin is undetectable. There is no pelvic mass, no eye disease, and TSH-receptor antibodies are negative. Erythrocyte sedimentation rate is normal. She denies taking thyroid hormone. A urine iodine is not extremely high. The differential of low-uptake thyrotoxicosis is being narrowed by the thyroglobulin result before any decision about antithyroid drugs or steroids.",
    "Which source of hormone fits a low uptake and an undetectable thyroglobulin?",
    [
        "Exogenous levothyroxine suppresses TSH and shuts off thyroglobulin release from a quiet gland",
        "Subacute thyroiditis releases stored hormone and raises thyroglobulin from a tender gland",
        "Graves disease drives a high radioactive iodine uptake and a high thyroglobulin",
        "A toxic adenoma shows focal uptake in one nodule and suppresses the rest of the gland",
        "Struma ovarii concentrates iodine in a pelvic mass and still releases thyroglobulin",
    ],
    "Exogenous levothyroxine suppresses TSH and shuts off thyroglobulin release from a quiet gland",
    "Thyroglobulin enters the blood when the gland is synthesizing or leaking hormone. Exogenous levothyroxine suppresses TSH, the patient's own gland goes quiet, uptake falls near zero, and thyroglobulin disappears. That combination, in a nontender gland without iodine excess or a pelvic mass, is factitious thyrotoxicosis. The 2016 American Thyroid Association approach to thyrotoxicosis uses uptake and thyroglobulin exactly to separate ingestion from inflammatory release. Subacute thyroiditis releases stored hormone and raises thyroglobulin from a tender gland also has a low uptake, but thyroglobulin is high, the gland is painful, and the sedimentation rate is high. Graves disease drives a high radioactive iodine uptake and a high thyroglobulin is diffuse high uptake with antibodies, the opposite scan. A toxic adenoma shows focal uptake in one nodule and suppresses the rest of the gland would still show a hot focus, not a 1 percent whole-gland uptake. Struma ovarii concentrates iodine in a pelvic mass and still releases thyroglobulin can suppress neck uptake, but there is a pelvic mass and thyroglobulin is not typically undetectable in this pattern.",
    "ata-hyper-2016",
)

add(
    "Thyroid hormone resistance versus TSH-oma",
    5,
    "pathology",
    "A 24-year-old man and his brother both have a goiter, a free T4 about 1.6 times the upper limit, and a TSH of 4.8 mIU/L that should have been suppressed. Neither has heat intolerance, and the sex hormone-binding globulin is normal. The alpha subunit is not elevated. MRI of the pituitary is normal, and visual fields are full. TRH stimulation still raises TSH. A cousin was treated with antithyroid drugs for years and became clinically hypothyroid without the TSH ever falling. There is no atrial fibrillation and no headache.",
    "Why is TSH not suppressed by the high free T4?",
    [
        "A thyroid hormone receptor beta mutation resets the pituitary set point without making peripheral tissues thyrotoxic",
        "A TSH-secreting adenoma raises the alpha subunit and enlarges the pituitary",
        "Thyroid-binding globulin excess raises total T4 while free T4 stays normal",
        "Factitious levothyroxine suppresses TSH and suppresses thyroglobulin",
        "Nonthyroidal illness lowers T3, raises reverse T3, and keeps free T4 low",
    ],
    "A thyroid hormone receptor beta mutation resets the pituitary set point without making peripheral tissues thyrotoxic",
    "Resistance to thyroid hormone from a thyroid hormone receptor beta mutation impairs feedback at the pituitary. TSH stays normal or high, the gland is driven to make extra T4 and T3, and a new balance is reached at a higher hormone level. If the same receptor defect is present in liver and other tissues, the patient is not clinically thyrotoxic, sex hormone-binding globulin stays normal, and there is no pituitary mass and no alpha-subunit excess. TRH can still release TSH. Antithyroid drugs only make the patient hypothyroid at the tissues while TSH rises further. A TSH-secreting adenoma raises the alpha subunit and enlarges the pituitary causes real thyrotoxicosis, a high sex hormone-binding globulin, a mass, a high alpha subunit, and a flat TRH test. Thyroid-binding globulin excess raises total T4 while free T4 stays normal does not raise free T4. Factitious levothyroxine suppresses TSH and suppresses thyroglobulin would suppress TSH. Nonthyroidal illness lowers T3, raises reverse T3, and keeps free T4 low is the opposite free-T4 direction and occurs in sick patients.",
    "robbins-10",
)

add(
    "hCG and the TSH receptor",
    4,
    "pathology",
    "A 22-year-old woman at 14 weeks by dates has vaginal bleeding and a uterus the size of 20 weeks. Ultrasound shows a snowstorm pattern and no fetus. Serum beta-hCG is 520,000 mIU/mL. She has a tremor and a pulse of 120. TSH is suppressed and free T4 is high. TSH-receptor antibodies are negative, and there is no stare or pretibial myxedema. Theca-lutein cysts are present on both ovaries. After uterine evacuation the hCG falls and, over the next several weeks, the free T4 and TSH return to normal without radioiodine. She was not taking biotin or levothyroxine.",
    "Why did this pregnancy product make her thyrotoxic?",
    [
        "Very high hCG cross-reacts with the TSH receptor because the hormones share an alpha subunit",
        "A coincidental Graves disease will continue after hCG returns to zero",
        "A TSH-secreting pituitary adenoma raised TSH and therefore raised T4",
        "Ovarian hyperstimulation secreted T4 from the theca-lutein cysts",
        "Subacute thyroiditis was triggered by the mole and will leave a permanently low uptake",
    ],
    "Very high hCG cross-reacts with the TSH receptor because the hormones share an alpha subunit",
    "hCG and TSH share the same alpha subunit, and their beta subunits are similar enough that very high hCG weakly activates the TSH receptor. Molar pregnancy and some cases of hyperemesis produce enough hCG to suppress TSH and raise free T4. The thyroid stimulation goes away when the hCG source is removed, which is why evacuation, not radioiodine or long-term thionamide, is the treatment. Theca-lutein cysts are another hCG effect and are not the source of T4. A coincidental Graves disease will continue after hCG returns to zero would have stimulating antibodies and would not resolve just because the uterus was emptied. A TSH-secreting pituitary adenoma raised TSH and therefore raised T4 would show a high or nonsuppressed TSH, not a suppressed one. Ovarian hyperstimulation secreted T4 from the theca-lutein cysts misplaces hormone synthesis; those cysts make sex steroids under hCG drive, not T4. Subacute thyroiditis was triggered by the mole and will leave a permanently low uptake is a painful inflammatory release and does not track the hCG concentration.",
    "robbins-10",
)

add(
    "Familial hypocalciuric hypercalcemia",
    5,
    "pathology",
    "A 40-year-old woman has a serum calcium of 10.9 mg/dL on repeated samples. PTH is 58 pg/mL in a reference range up to 65. Twenty-four-hour urine calcium is 42 mg, and the calcium-to-creatinine clearance ratio is 0.006. She has never had a kidney stone, and bone density is normal. Her mother has a calcium of 11.0 mg/dL and the same low urine calcium. A sestamibi scan shows no adenoma. She feels well. A surgeon has offered a four-gland exploration because the PTH is not suppressed. Phosphate is normal-low, 25-hydroxyvitamin D is normal, and creatinine is normal.",
    "Which receptor defect makes parathyroidectomy the wrong operation?",
    [
        "An inactivating calcium-sensing receptor mutation raises the set point in the parathyroid and the kidney",
        "A single parathyroid adenoma oversecretes PTH and spills calcium into the urine",
        "Parathyroid hormone-related peptide from an occult cancer suppresses PTH and raises urine calcium",
        "Granulomatous 1-alpha hydroxylase excess raises calcitriol and suppresses PTH",
        "Milk-alkali ingestion suppresses PTH, raises bicarbonate, and injures the kidney",
    ],
    "An inactivating calcium-sensing receptor mutation raises the set point in the parathyroid and the kidney",
    "The calcium-sensing receptor tells the parathyroid how high the calcium is and, in the thick ascending limb, restrains paracellular calcium reabsorption. An inactivating mutation makes both organs behave as if calcium were lower than it is. PTH is not suppressed at a mildly high serum calcium, and the kidney reabsorbs calcium avidly, so urine calcium is very low and the clearance ratio is below 0.01. The set point is inherited, which is why the mother has the same pattern. Surgery cannot correct a receptor set point present in every remaining cell. An inactivating calcium-sensing receptor mutation is autosomal dominant and usually asymptomatic. A single parathyroid adenoma oversecretes PTH and spills calcium into the urine would raise PTH more clearly and increase, not decrease, urine calcium. Parathyroid hormone-related peptide from an occult cancer suppresses PTH and raises urine calcium suppresses PTH. Granulomatous 1-alpha hydroxylase excess raises calcitriol and suppresses PTH also suppresses PTH and raises calcitriol. Milk-alkali ingestion suppresses PTH, raises bicarbonate, and injures the kidney suppresses PTH and adds alkalosis and renal insufficiency.",
    "robbins-10",
)

add(
    "GNAS imprinting and pseudohypoparathyroidism",
    5,
    "pathology",
    "A 7-year-old child has a round face, short fourth and fifth metacarpals, and subcutaneous ossifications. Calcium is 7.4 mg/dL, phosphate is 7.1 mg/dL, and PTH is 280 pg/mL. Urinary cyclic AMP does not rise after a PTH infusion. TSH is mildly elevated with a low-normal free T4. The mother has the same short metacarpals and ossifications, but her calcium, phosphate, and PTH are normal. The maternal grandfather had the skeletal findings and normal calcium. The child is developing slowly. There is no neck scar and no diarrhea to suggest magnesium loss.",
    "Why does the child resist PTH when the mother has the body habitus without the resistance?",
    [
        "A maternal GNAS mutation removes the only Gs-alpha allele expressed in the proximal tubule",
        "A paternal GNAS mutation causes the same renal resistance and the same hypocalcemia",
        "Primary hypoparathyroidism lowers PTH and raises phosphate after thyroid surgery",
        "Vitamin D receptor mutation raises calcitriol and produces alopecia without this body habitus",
        "FGF23 excess lowers phosphate and lowers calcitriol from a mesenchymal tumor",
    ],
    "A maternal GNAS mutation removes the only Gs-alpha allele expressed in the proximal tubule",
    "Gs-alpha is encoded by GNAS and, in the renal proximal tubule, is expressed mainly from the maternal allele because the paternal allele is silenced. A mutation inherited from the mother leaves the tubule with no working Gs-alpha. PTH cannot generate cyclic AMP, phosphate is retained, calcium falls, and PTH rises. The same haploinsufficiency in tissues that express both alleles produces Albright hereditary osteodystrophy, and other Gs-coupled hormones such as TSH can be affected. The mother herself inherited the mutation from her father, so her kidneys still use her normal maternal allele and her calcium is normal: that is pseudopseudohypoparathyroidism. She transmits the mutation as a maternal allele, and the child has full resistance. A paternal GNAS mutation causes the same renal resistance and the same hypocalcemia is the imprinting error: a paternal mutation causes the skeletal phenotype without renal resistance. Primary hypoparathyroidism lowers PTH and raises phosphate after thyroid surgery has a low, not high, PTH. Vitamin D receptor mutation raises calcitriol and produces alopecia without this body habitus is vitamin D-dependent rickets type 2. FGF23 excess lowers phosphate and lowers calcitriol from a mesenchymal tumor lowers phosphate rather than raising it.",
    "robbins-10",
)

add(
    "Vitamin D-dependent rickets",
    5,
    "pathology",
    "A 2-year-old has bowed legs, a rachitic rosary, and sparse scalp hair that never grew. Calcium is 7.6 mg/dL, phosphate is 2.2 mg/dL, and PTH is high. 25-hydroxyvitamin D is normal. 1,25-dihydroxyvitamin D is several times the upper limit. Calcium and calcitriol supplements at ordinary replacement doses do not heal the growth plates, and the alopecia does not change. A sibling with a different enzyme defect had a low, not high, calcitriol and improved promptly when physiologic calcitriol was started. There is no dietary history of vitamin D absence and no chronic liver disease.",
    "Which lesion fits high calcitriol, rickets, and alopecia that ignores calcitriol treatment?",
    [
        "A vitamin D receptor mutation blocks calcitriol signaling despite very high hormone levels",
        "1-alpha hydroxylase deficiency leaves calcitriol low and responds to physiologic calcitriol",
        "Dietary vitamin D deficiency lowers 25-hydroxyvitamin D and is cured by cholecalciferol",
        "FGF23 excess from bone lowers phosphate and suppresses 1,25-dihydroxyvitamin D",
        "Pseudohypoparathyroidism raises phosphate and prevents the cyclic AMP response to PTH",
    ],
    "A vitamin D receptor mutation blocks calcitriol signaling despite very high hormone levels",
    "Vitamin D-dependent rickets type 2 is a defect in the vitamin D receptor. The kidney makes calcitriol, but target tissues cannot respond, so calcium stays low, PTH rises, phosphate is wasted under that PTH, and rickets follows. Many receptor mutations, especially in the DNA-binding domain, also cause alopecia because the hair cycle requires the receptor. Giving more calcitriol does not bypass a broken receptor, so calcium infusions are often required. 1-alpha hydroxylase deficiency leaves calcitriol low and responds to physiologic calcitriol is type 1 disease, the sibling pattern, with low 1,25 and no alopecia. Dietary vitamin D deficiency lowers 25-hydroxyvitamin D and is cured by cholecalciferol would show a low 25-hydroxy level, which is normal here. FGF23 excess from bone lowers phosphate and suppresses 1,25-dihydroxyvitamin D suppresses calcitriol rather than raising it and does not cause alopecia. Pseudohypoparathyroidism raises phosphate and prevents the cyclic AMP response to PTH has a high phosphate because the kidney ignores PTH, plus the Albright habitus, not alopecia with a sky-high calcitriol.",
    "robbins-10",
)

add(
    "FGF23 osteomalacia",
    5,
    "pathology",
    "A 54-year-old man has three years of progressive proximal weakness, bone pain, and insufficiency fractures. Calcium is 9.2 mg/dL, phosphate is 1.6 mg/dL, and PTH is 28 pg/mL in a normal range. 25-hydroxyvitamin D is normal. 1,25-dihydroxyvitamin D is low despite the hypophosphatemia, which should have induced it. The tubular reabsorption of phosphate is low. A small soft-tissue mass in the thigh is a benign mesenchymal tumor. After it is removed, phosphate and calcitriol normalize over weeks. He has no family history of childhood rickets and no aminoaciduria.",
    "Which hormone from the tumor explains the phosphate wasting and the low calcitriol?",
    [
        "FGF23 inhibits proximal phosphate reabsorption and inhibits renal 1-alpha hydroxylase",
        "PTH excess from a parathyroid adenoma raises calcium and lowers phosphate",
        "Vitamin D deficiency lowers 25-hydroxyvitamin D and raises PTH",
        "Fanconi syndrome wastes phosphate together with glucose, amino acids, and bicarbonate",
        "Calcitonin excess from medullary thyroid cancer raises phosphate and lowers calcium",
    ],
    "FGF23 inhibits proximal phosphate reabsorption and inhibits renal 1-alpha hydroxylase",
    "FGF23, normally from osteocytes, tells the proximal tubule to internalize sodium-phosphate cotransporters and tells the kidney to turn off 1-alpha hydroxylase. A mesenchymal tumor that secretes FGF23 reproduces that signal: phosphate is wasted, calcitriol is low or inappropriately normal, calcium stays normal, and PTH does not rise the way it does in vitamin D deficiency. Removing the tumor removes the hormone. This adult-onset pattern is tumor-induced osteomalacia rather than hereditary hypophosphatemic rickets. PTH excess from a parathyroid adenoma raises calcium and lowers phosphate would raise calcium and PTH. Vitamin D deficiency lowers 25-hydroxyvitamin D and raises PTH would lower the 25-hydroxy level and raise PTH, and calcitriol is often maintained by the high PTH until late. Fanconi syndrome wastes phosphate together with glucose, amino acids, and bicarbonate is a broader proximal-tubule failure this patient does not have. Calcitonin excess from medullary thyroid cancer raises phosphate and lowers calcium is the opposite mineral direction and is not produced by a thigh mesenchymal tumor.",
    "robbins-10",
)

add(
    "Humoral hypercalcemia of malignancy",
    5,
    "pathology",
    "A 63-year-old man with a 50-pack-year history has a central lung mass. Biopsy shows squamous cell carcinoma. Calcium is 13.8 mg/dL, phosphate is 1.9 mg/dL, and PTH is suppressed. 1,25-dihydroxyvitamin D is low-normal, not elevated. He is dehydrated and confused. A bone scan does not show widespread metastases, and alkaline phosphatase is only mildly up. PTH-related peptide is markedly elevated. There is no granulomatous disease on chest imaging beyond the mass, and he is not taking calcium carbonate or vitamin D. Saline and a bisphosphonate are started.",
    "Which peptide accounts for the low phosphate and the suppressed PTH?",
    [
        "PTH-related peptide mimics PTH on bone resorption and on renal phosphate excretion",
        "Local cytokine osteolysis from diffuse metastases raises phosphate and PTH",
        "Extrarenal 1-alpha hydroxylase in lymphoma raises calcitriol and raises phosphate",
        "Primary hyperparathyroidism raises PTH and is unrelated to the lung mass",
        "Vitamin D intoxication raises 25-hydroxyvitamin D and suppresses phosphate excretion",
    ],
    "PTH-related peptide mimics PTH on bone resorption and on renal phosphate excretion",
    "Squamous cancers commonly secrete PTH-related peptide. It binds the PTH receptor, increases bone resorption, and decreases proximal phosphate reabsorption, so calcium rises and phosphate falls. The real parathyroid sees the high calcium and shuts off, so PTH is suppressed. Unlike native PTH, PTH-related peptide does not strongly drive renal 1-alpha hydroxylase, and the hypercalcemia itself suppresses it, so calcitriol is low or inappropriately normal. Widespread bone metastases are not required. Local cytokine osteolysis from diffuse metastases raises phosphate and PTH would need a positive bone survey and would not specifically lower phosphate through a renal PTH-like effect or raise PTH-related peptide. Extrarenal 1-alpha hydroxylase in lymphoma raises calcitriol and raises phosphate produces a high calcitriol, which this patient does not have. Primary hyperparathyroidism raises PTH and is unrelated to the lung mass is excluded by the suppressed PTH. Vitamin D intoxication raises 25-hydroxyvitamin D and suppresses phosphate excretion tends to raise phosphate because PTH is suppressed and there is no phosphaturic peptide.",
    "robbins-10",
)

add(
    "Granulomatous calcitriol production",
    4,
    "pathology",
    "A 38-year-old woman has a dry cough, bilateral hilar lymphadenopathy, and an elevated angiotensin-converting enzyme. Calcium is 11.6 mg/dL and phosphate is 4.9 mg/dL. PTH is suppressed. 25-hydroxyvitamin D is normal and 1,25-dihydroxyvitamin D is high. She is not taking supplements. The hypercalcemia improves after glucocorticoids are started for pulmonary sarcoidosis, and the calcitriol falls. A parathyroid scan is not pursued because the PTH is low. There is no squamous cell cancer and no PTH-related peptide assay abnormality.",
    "Why is calcitriol high when PTH is suppressed?",
    [
        "Macrophage 1-alpha hydroxylase in granulomas makes calcitriol without PTH control",
        "A parathyroid adenoma raises PTH, lowers phosphate, and raises calcitriol under PTH drive",
        "PTH-related peptide lowers phosphate and keeps calcitriol from rising",
        "Dietary calcium carbonate alone raises 1,25-dihydroxyvitamin D and lowers bicarbonate",
        "FGF23 from osteocytes raises 1,25-dihydroxyvitamin D and raises phosphate",
    ],
    "Macrophage 1-alpha hydroxylase in granulomas makes calcitriol without PTH control",
    "Activated macrophages in sarcoid granulomas express 1-alpha hydroxylase that is driven by inflammatory cytokines rather than by PTH, and it is not turned off by FGF23 or by high calcium the way the renal enzyme is. The resulting calcitriol increases gut calcium and phosphate absorption and bone resorption. PTH is suppressed by the high calcium, so the kidney keeps phosphate, and phosphate is normal or high. Glucocorticoids suppress the macrophage enzyme, which is why the calcium falls with treatment of the sarcoidosis. A parathyroid adenoma raises PTH, lowers phosphate, and raises calcitriol under PTH drive requires a high PTH and a low phosphate. PTH-related peptide lowers phosphate and keeps calcitriol from rising is the squamous-cancer pattern, with low phosphate and a calcitriol that is not high. Dietary calcium carbonate alone raises 1,25-dihydroxyvitamin D and lowers bicarbonate is milk-alkali thinking inverted: calcium loads suppress calcitriol, and the syndrome includes metabolic alkalosis and renal insufficiency. FGF23 from osteocytes raises 1,25-dihydroxyvitamin D and raises phosphate does the opposite to calcitriol; FGF23 suppresses 1-alpha hydroxylase and lowers phosphate.",
    "robbins-10",
)

add(
    "Hungry bone syndrome",
    4,
    "pathology",
    "A 58-year-old woman with a long-standing parathyroid adenoma and an alkaline phosphatase three times normal undergoes successful removal of the adenoma. Preoperative calcium was 12.4 mg/dL and phosphate was 2.0 mg/dL. On the second postoperative day she has perioral tingling. Calcium is 7.1 mg/dL, phosphate is 1.7 mg/dL, and magnesium is 1.3 mg/dL. Intact PTH is 22 pg/mL, inside the reference range, not undetectable. The neck incision is intact and there is no stridor. She had severe osteitis fibrosa on preoperative films. Calcium and phosphate are both being replaced.",
    "Why are calcium and phosphate both low after the adenoma is gone?",
    [
        "Hungry bone takes up calcium and phosphate once the high PTH drive is suddenly removed",
        "Surgical hypoparathyroidism lowers calcium and raises phosphate because PTH is absent",
        "Remaining parathyroid tissue is still oversecreting PTH and spilling phosphate",
        "Vitamin D intoxication was unmasked by surgery and raised both minerals",
        "FGF23 release from the healing bone raises phosphate and lowers calcitriol",
    ],
    "Hungry bone takes up calcium and phosphate once the high PTH drive is suddenly removed",
    "Years of high PTH leave a large amount of undermineralized osteoid. When the adenoma is removed, PTH falls abruptly into the normal range and the bone can finally mineralize. It pulls calcium, phosphate, and magnesium out of the blood at the same time. The clue that this is hungry bone rather than loss of all parathyroid tissue is the combination of low calcium and low phosphate with a detectable, normal PTH. A high preoperative alkaline phosphatase predicts how hungry the skeleton is. Surgical hypoparathyroidism lowers calcium and raises phosphate because PTH is absent would show an undetectable PTH and a high phosphate, because the phosphaturic effect of PTH is gone. Remaining parathyroid tissue is still oversecreting PTH and spilling phosphate would keep calcium high. Vitamin D intoxication was unmasked by surgery and raised both minerals would raise calcium, not drop it to 7.1. FGF23 release from the healing bone raises phosphate and lowers calcitriol would not lower phosphate; FGF23 lowers phosphate by wasting it, and it is not the postoperative mechanism here.",
    "robbins-10",
)

add(
    "Insulin GLUT4 signaling",
    4,
    "physiology",
    "Adipocytes in a signaling study bind insulin normally, and the insulin receptor autophosphorylates on tyrosine. IRS-1 is tyrosine phosphorylated. Downstream, PIP3 does not increase, Akt is not phosphorylated, and GLUT4 vesicles remain in the cytosol. Glucose uptake does not rise. A separate growth-factor stimulus still phosphorylates ERK, so the mitogenic cascade can function when it is driven by its own pathway. Hepatocytes studied in parallel take up glucose through a different transporter that does not require this translocation. The inhibitor under study is aimed at the lipid kinase that converts PIP2 to PIP3.",
    "Which step is required for insulin-stimulated glucose uptake in fat and muscle?",
    [
        "PI3-kinase generates PIP3, Akt is activated, and GLUT4 vesicles move to the membrane",
        "MAPK and ERK phosphorylation is the branch that translocates GLUT4",
        "GLUT2 insertion in hepatocytes is the insulin-dependent step this inhibitor blocks",
        "Glucagon receptor Gs signaling in muscle opens GLUT4 by raising cAMP",
        "AMPK activation by metformin closes GLUT4 vesicles and stops glucose uptake",
    ],
    "PI3-kinase generates PIP3, Akt is activated, and GLUT4 vesicles move to the membrane",
    "The insulin receptor is a tyrosine kinase. After IRS phosphorylation, PI3-kinase phosphorylates PIP2 to PIP3. PIP3 recruits PDK1 and Akt. Akt then inactivates the Rab-GAP AS160, allowing GLUT4 storage vesicles to fuse with the membrane in skeletal muscle and adipose tissue. That is the metabolic branch. The cells in this study fail exactly at PIP3, so GLUT4 never moves, even though the receptor and IRS worked. MAPK and ERK phosphorylation is the branch that translocates GLUT4 is the mitogenic arm and is not required for glucose uptake; the study shows ERK can still be phosphorylated when uptake is blocked. GLUT2 insertion in hepatocytes is the insulin-dependent step this inhibitor blocks is wrong because hepatocyte GLUT2 is constitutive and insulin regulates hepatic glucose metabolism by enzyme phosphorylation and gene expression, not by GLUT4 translocation. Glucagon receptor Gs signaling in muscle opens GLUT4 by raising cAMP is not a muscle pathway; muscle lacks this glucagon-driven control of glucose uptake. AMPK activation by metformin closes GLUT4 vesicles and stops glucose uptake reverses metformin, which increases AMPK activity and can increase glucose uptake.",
    "guyton-14",
)

add(
    "Diabetic ketoacidosis ketogenesis",
    5,
    "physiology",
    "A 19-year-old with type 1 diabetes presents after two days of vomiting. Glucose is 430 mg/dL, arterial pH is 7.11, bicarbonate is 8 mEq/L, and the anion gap is 28. Beta-hydroxybutyrate is markedly elevated. A nitroprusside urine test, which detects acetoacetate, is only weakly positive. Insulin has been omitted. Glucagon, cortisol, and epinephrine are high. Free fatty acids are high. He has no known inborn error of metabolism. The team starts saline and plans insulin once potassium is known. A student asks why the liver is making ketones at all and why the dipstick undercalls the load.",
    "Which hepatic state produces this anion-gap ketoacidosis?",
    [
        "Low malonyl-CoA disinhibits CPT-1, and mitochondrial HMG-CoA synthase builds ketone bodies",
        "High malonyl-CoA from active acetyl-CoA carboxylase blocks CPT-1 and stops fat oxidation",
        "Muscle mitochondrial HMG-CoA synthase exports the ketones measured in serum",
        "Hormone-sensitive lipase is inhibited by glucagon, so ketones come from glycolysis",
        "Glycogen breakdown in skeletal muscle generates the unmeasured ketoacid anions",
    ],
    "Low malonyl-CoA disinhibits CPT-1, and mitochondrial HMG-CoA synthase builds ketone bodies",
    "Without insulin, adipocyte hormone-sensitive lipase is unrestrained and free fatty acids flood the liver. Insulin is also required to keep acetyl-CoA carboxylase active, so malonyl-CoA falls. Malonyl-CoA is the physiologic brake on carnitine palmitoyltransferase-1, and without it fatty acids enter mitochondria, beta-oxidation produces excess acetyl-CoA, and the liver-specific mitochondrial HMG-CoA synthase converts that acetyl-CoA into ketones. A high NADH ratio favors beta-hydroxybutyrate over acetoacetate, so the nitroprusside reaction, which sees acetoacetate, underestimates the total. High malonyl-CoA from active acetyl-CoA carboxylase blocks CPT-1 and stops fat oxidation is the fed, high-insulin state, the opposite of ketoacidosis. Muscle mitochondrial HMG-CoA synthase exports the ketones measured in serum assigns the enzyme to muscle, which lacks mitochondrial HMG-CoA synthase and does not make ketones. Hormone-sensitive lipase is inhibited by glucagon, so ketones come from glycolysis reverses the lipase: glucagon and the lack of insulin activate it. Glycogen breakdown in skeletal muscle generates the unmeasured ketoacid anions produces lactate at most and cannot make ketone bodies, and muscle lacks glucose-6-phosphatase as well as the ketogenic enzyme.",
    "guyton-14",
)

add(
    "Hyperosmolar state versus ketoacidosis",
    5,
    "pathology",
    "A 74-year-old woman with type 2 diabetes is brought in obtunded after a week of sugary drinks and a urinary infection. Glucose is 980 mg/dL, sodium is 148 mEq/L, and calculated serum osmolality is 342 mOsm/kg. Arterial pH is 7.38, bicarbonate is 22 mEq/L, and the anion gap is 14. Serum ketones are trace. She is profoundly volume depleted. A younger patient in the next bed has glucose 380, pH 7.10, and a large ketone load. The attending uses the older patient's near-normal pH and trivial ketones, despite a higher glucose, to name the syndrome and to explain the insulin biology underneath it.",
    "Why are ketones minimal despite this degree of hyperglycemia?",
    [
        "Residual insulin is enough to restrain lipolysis and hepatic ketogenesis but not enough to control glucose",
        "Complete insulin absence blocks ketogenesis and produces this hyperosmolar picture",
        "A pH of 7.38 with bicarbonate of 22 defines diabetic ketoacidosis rather than the hyperosmolar state",
        "Osmolality above 320 means ketoacids are present even when the assay is negative",
        "Type 2 diabetes cannot develop an anion-gap acidosis under any circumstance",
    ],
    "Residual insulin is enough to restrain lipolysis and hepatic ketogenesis but not enough to control glucose",
    "Hyperosmolar hyperglycemic syndrome is the extreme of hyperglycemia and dehydration, typically in older adults with type 2 diabetes. Enough insulin remains to keep hormone-sensitive lipase and hepatic ketogenesis largely suppressed, so pH and bicarbonate stay near normal and ketones are minimal, but not enough insulin remains to dispose of glucose. The depressed consciousness tracks the osmolality. Diabetic ketoacidosis is the opposite insulin extreme: almost none, so ketogenesis runs and the gap acidosis dominates, usually at a lower glucose. The Standards of Care separate the two by pH, bicarbonate, ketones, and effective osmolality, and both still require fluid and insulin, with the hyperosmolar patient needing particularly careful volume replacement. Complete insulin absence blocks ketogenesis and produces this hyperosmolar picture reverses the biology: absence of insulin causes ketoacidosis. A pH of 7.38 with bicarbonate of 22 defines diabetic ketoacidosis rather than the hyperosmolar state uses the ketoacidosis thresholds on numbers that exclude it. Osmolality above 320 means ketoacids are present even when the assay is negative confuses the hyperosmolar criterion with the presence of ketones. Type 2 diabetes cannot develop an anion-gap acidosis under any circumstance is false; ketosis-prone type 2 diabetes and SGLT2-associated ketoacidosis both occur.",
    "ada-2026",
)

add(
    "Potassium before insulin in ketoacidosis",
    5,
    "pathology",
    "A 22-year-old man with new type 1 diabetes has glucose 510 mg/dL, pH 7.18, bicarbonate 10 mEq/L, and a large ketone load. Serum potassium on arrival, before any insulin, is 2.9 mEq/L. The electrocardiogram shows flattened T waves. He has been vomiting for two days and has a large urine output. The resident is about to start an intravenous insulin infusion because the gap acidosis is obvious. The attending stops the insulin, orders potassium replacement first, and explains that the serum number hides a large whole-body deficit. Creatinine is 1.4 mg/dL from volume depletion.",
    "Why must insulin wait when the serum potassium is already 2.9 mEq/L?",
    [
        "Total-body potassium is depleted, and insulin would drive the remaining extracellular potassium into cells",
        "Serum potassium of 2.9 means body stores are high and insulin will correct them by urinary loss",
        "Insulin should be started immediately because acidosis always raises potassium further",
        "Potassium replacement is withheld until the anion gap closes, regardless of the serum level",
        "Hyperosmolar coma, not ketoacidosis, is the only state in which potassium is replaced before insulin",
    ],
    "Total-body potassium is depleted, and insulin would drive the remaining extracellular potassium into cells",
    "In diabetic ketoacidosis, potassium is lost in urine for days because of osmotic diuresis and aldosterone, so total-body stores are low even when the serum potassium looks normal or high. The serum can look high at presentation because insulin deficiency, hyperosmolality, and acidosis shift potassium out of cells. Insulin treatment reverses that shift and drags potassium back inside with glucose. If the serum potassium is already below 3.3 mEq/L, starting insulin can precipitate ventricular arrhythmia and respiratory failure. The Standards of Care therefore hold insulin and replace potassium until the serum level is at least 3.3 mEq/L, then give potassium with the insulin when the level is in the middle range. Serum potassium of 2.9 means body stores are high and insulin will correct them by urinary loss reads the serum value backward. Insulin should be started immediately because acidosis always raises potassium further ignores a measured value that is already dangerously low. Potassium replacement is withheld until the anion gap closes, regardless of the serum level would delay the one replacement this patient needs before insulin. Hyperosmolar coma, not ketoacidosis, is the only state in which potassium is replaced before insulin forgets that the same transcellular risk, and the same potassium rule, applies in ketoacidosis.",
    "ada-2026",
)

add(
    "SGLT2 inhibitor euglycemic ketoacidosis",
    5,
    "pharmacology",
    "A 58-year-old man with type 2 diabetes takes empagliflozin and metformin. He fasts for two days around an outpatient procedure and cuts his basal insulin because his home glucose readings are 110 to 140 mg/dL. He then develops nausea and deep breathing. In the emergency department glucose is 148 mg/dL, pH is 7.16, bicarbonate is 9 mEq/L, the anion gap is 26, and beta-hydroxybutyrate is high. Lactate is normal. He is not septic. The SGLT2 inhibitor is stopped, dextrose is given with insulin, and the gap closes. A colleague had argued that a glucose under 200 rules out ketoacidosis.",
    "How can an SGLT2 inhibitor produce ketoacidosis while glucose stays near normal?",
    [
        "Urinary glucose loss lowers insulin and raises glucagon, so ketogenesis proceeds without marked hyperglycemia",
        "The drug blocks hepatic HMG-CoA synthase and therefore prevents any ketone formation",
        "Metformin alone causes this anion-gap pattern by generating beta-hydroxybutyrate",
        "A glucose of 148 excludes ketoacidosis, so the gap must be lactic acidosis",
        "SGLT2 inhibition closes beta-cell potassium channels and forces insulin release",
    ],
    "Urinary glucose loss lowers insulin and raises glucagon, so ketogenesis proceeds without marked hyperglycemia",
    "SGLT2 inhibitors block proximal glucose reabsorption. The ongoing urinary glucose loss lowers plasma glucose, which lowers insulin, and the drugs also raise glucagon. That lower insulin-to-glucagon ratio disinhibits lipolysis and hepatic ketogenesis. Because glucose is being lost in the urine, the blood glucose may sit near the normal range while ketoacids accumulate, especially if the patient is fasting, ill, or has reduced an insulin dose. This is still diabetic ketoacidosis and is treated with insulin and dextrose, and the SGLT2 inhibitor is stopped. The Standards of Care specifically warn that a near-normal glucose does not exclude it. The drug blocks hepatic HMG-CoA synthase and therefore prevents any ketone formation is the opposite of the observed high beta-hydroxybutyrate. Metformin alone causes this anion-gap pattern by generating beta-hydroxybutyrate causes lactic acidosis in the right setting, and the lactate here is normal. A glucose of 148 excludes ketoacidosis, so the gap must be lactic acidosis is the error that delayed recognition. SGLT2 inhibition closes beta-cell potassium channels and forces insulin release is the sulfonylurea mechanism and would raise insulin and risk hypoglycemia, not this low-insulin ketosis.",
    "ada-2026",
)

add(
    "McCune-Albright precocious puberty",
    5,
    "pathology",
    "A 5-year-old girl has two episodes of vaginal bleeding and early breast development. Estradiol is in the pubertal range and random LH is undetectable. A GnRH stimulation test does not raise LH. A large cafe-au-lait patch with irregular borders stops at the midline on one side of the trunk. She limps, and radiographs show polyostotic fibrous dysplasia. There is no virilization, 17-hydroxyprogesterone is normal, and she has no ovarian mass other than a functional cyst that later regresses. Head circumference is normal and there are no neurofibromas. TSH and cortisol are currently normal, though the family is told other glands can become autonomous later.",
    "Which mosaic mutation drives ovarian estrogen production without LH?",
    [
        "An activating GNAS mutation causes autonomous ovarian Gs signaling and peripheral precocious puberty",
        "A hypothalamic hamartoma drives central puberty, and GnRH stimulation would raise LH",
        "21-hydroxylase deficiency virilizes and raises 17-hydroxyprogesterone without estrogen-driven bleeding",
        "A granulosa-cell tumor explains the fibrous dysplasia and the coast-of-Maine skin patch",
        "Exogenous estrogen cream raises estradiol but does not produce polyostotic bone lesions",
    ],
    "An activating GNAS mutation causes autonomous ovarian Gs signaling and peripheral precocious puberty",
    "McCune-Albright syndrome is a postzygotic activating mutation of GNAS, so Gs-alpha stays on in a mosaic distribution. In the ovary that signal makes estrogen without LH, which is peripheral precocious puberty: high estradiol, suppressed LH, and a flat GnRH stimulation test. The same mosaic explains the irregular cafe-au-lait macule that respects the midline and the fibrous dysplasia. Other Gs-coupled glands can later overfunction. Because the mutation is somatic, it is not inherited in the usual Mendelian way. A hypothalamic hamartoma drives central puberty, and GnRH stimulation would raise LH would show a pubertal LH response and would not create fibrous dysplasia or this skin lesion. 21-hydroxylase deficiency virilizes and raises 17-hydroxyprogesterone without estrogen-driven bleeding is an androgen problem with an abnormal 17-hydroxyprogesterone, not cyclic estrogen bleeding with bone lesions. A granulosa-cell tumor explains the fibrous dysplasia and the coast-of-Maine skin patch can secrete estrogen and suppress LH, but it does not cause the skin and bone mosaic. Exogenous estrogen cream raises estradiol but does not produce polyostotic bone lesions lacks the skeletal and pigment findings.",
    "robbins-10",
)

add(
    "Vitamin D activation steps",
    4,
    "physiology",
    "A 60-year-old man with long-standing chronic kidney disease has a GFR of 18 mL/min. Calcium is 7.9 mg/dL, phosphate is 6.4 mg/dL, and PTH is 410 pg/mL. 25-hydroxyvitamin D is 32 ng/mL, inside the reference range, after he was repleted with cholecalciferol. 1,25-dihydroxyvitamin D remains low. He does not have a mesenchymal tumor, sarcoidosis, or a vitamin D receptor mutation. The nephrologist explains that replacing the storage form was necessary but cannot replace the lost renal step, and an active analog is being added. FGF23 is also high, as expected for this degree of phosphate retention.",
    "Which step is missing, and what normally regulates it?",
    [
        "Renal 1-alpha hydroxylase is lost; PTH would stimulate it and FGF23 and high phosphate suppress it",
        "Hepatic 25-hydroxylase is the step that fails first in chronic kidney disease",
        "Skin conversion of 7-dehydrocholesterol fails because the kidney no longer sees ultraviolet light",
        "Macrophage 1-alpha hydroxylase is the regulated source of calcitriol in healthy kidneys",
        "Parathyroid chief cells hydroxylate 25-hydroxyvitamin D when phosphate is high",
    ],
    "Renal 1-alpha hydroxylase is lost; PTH would stimulate it and FGF23 and high phosphate suppress it",
    "Vitamin D is hydroxylated at carbon 25 in the liver and at carbon 1 in the proximal tubule. The renal 1-alpha hydroxylase is stimulated by PTH and by low phosphate, and it is inhibited by FGF23, by high phosphate, and by calcitriol itself. In advanced chronic kidney disease the enzyme mass is gone, phosphate and FGF23 are high, and 1,25-dihydroxyvitamin D stays low even after 25-hydroxyvitamin D has been repleted. That low calcitriol, together with phosphate retention, drives secondary hyperparathyroidism. An active vitamin D analog bypasses the missing renal step. Hepatic 25-hydroxylase is the step that fails first in chronic kidney disease would have left 25-hydroxyvitamin D low, and it was repleted into the normal range. Skin conversion of 7-dehydrocholesterol fails because the kidney no longer sees ultraviolet light confuses the cutaneous production of cholecalciferol with a renal function. Macrophage 1-alpha hydroxylase is the regulated source of calcitriol in healthy kidneys is the unregulated extrarenal source in granulomatous disease, not the healthy kidney. Parathyroid chief cells hydroxylate 25-hydroxyvitamin D when phosphate is high places the enzyme in the wrong gland; the parathyroid responds to the low calcitriol by secreting PTH.",
    "guyton-14",
)




