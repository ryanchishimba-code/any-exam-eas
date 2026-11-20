"""Last Step 1 items to reach 300: endocrine remainder and multisystem."""

ITEMS = []


def add(domain, subject, topic, diff, scenario, question, options, key, expl, ref):
    assert key in options and len(set(options)) == 5
    ITEMS.append(
        {
            "blueprintDomain": domain,
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


def E(topic, diff, scenario, question, options, key, expl, ref="guyton-14", subject="physiology"):
    add("reproductive-endocrine", subject, topic, diff, scenario, question, options, key, expl, ref)


def M(topic, diff, scenario, question, options, key, expl, ref="robbins-10", subject="pathology"):
    add("multisystem", subject, topic, diff, scenario, question, options, key, expl, ref)


E(
    "Insulinoma versus factitious hypoglycemia",
    5,
    "Two patients arrive with glucose of 40 mg/dL and high insulin. Patient A has a high C-peptide and a pancreatic mass. Patient B has a low C-peptide and works in a clinic with access to insulin vials. A student says both injected insulin because both have high insulin.",
    "What does C-peptide separate?",
    [
        "Endogenous insulin, from an insulinoma or a sulfonylurea, comes with C-peptide; injected insulin does not",
        "Injected insulin raises C-peptide",
        "A low C-peptide proves an insulinoma",
        "Sulfonylureas suppress C-peptide the way injected insulin does",
        "C-peptide is a liver enzyme, unrelated to the beta cell",
    ],
    "Endogenous insulin, from an insulinoma or a sulfonylurea, comes with C-peptide; injected insulin does not",
    "Proinsulin is split into insulin and C-peptide, so anything that makes the beta cell secrete, including an insulinoma or a sulfonylurea, raises both. Pharmaceutical insulin has no C-peptide, so a high insulin with a low C-peptide is injection. Injected insulin does not raise C-peptide. A low C-peptide argues against an insulinoma. Sulfonylureas force endogenous secretion and raise C-peptide; a sulfonylurea screen is the next step when C-peptide is high and no mass is obvious. C-peptide is the beta-cell fragment, not a liver enzyme.",
    "katzung-16",
)

E(
    "Acromegaly",
    4,
    "A 42-year-old has enlarging hands, a new gap between his teeth, headaches, and diabetes. IGF-1 is high. Glucose does not suppress growth hormone. A student orders insulin-like growth factor because he thinks growth hormone itself is always low in a pituitary adenoma, and he says the diabetes is a coincidence.",
    "Why does growth hormone raise glucose, and what fails to suppress it?",
    [
        "Growth hormone causes insulin resistance; in acromegaly a glucose load fails to suppress GH, and IGF-1 from the liver is the integrated marker",
        "Growth hormone lowers glucose, so diabetes rules the diagnosis out",
        "A normal suppression test confirms acromegaly",
        "IGF-1 is low when GH is high",
        "The jaw and hands enlarge from TSH, not GH",
    ],
    "Growth hormone causes insulin resistance; in acromegaly a glucose load fails to suppress GH, and IGF-1 from the liver is the integrated marker",
    "Excess GH from a pituitary adenoma makes the liver produce IGF-1, which grows bone and soft tissue after the plates have closed. GH opposes insulin, so diabetes appears. Normally glucose suppresses GH; failure of that suppression is the confirmatory test. Diabetes is part of the disease, not a coincidence. Successful suppression would argue against autonomy. IGF-1 is high, not low, when GH is chronically high. The soft-tissue growth is GH and IGF-1, not TSH.",
)

E(
    "Laron dwarfism",
    5,
    "A child is very short with a prominent forehead. Growth hormone is high and IGF-1 is low. Growth hormone injections do not raise IGF-1. A student diagnoses GH deficiency because the child is short, and plans more GH.",
    "Where is the resistance?",
    [
        "The growth-hormone receptor does not signal, so the liver makes no IGF-1 and GH rises; giving more GH cannot work",
        "The pituitary makes no GH, so the level is high",
        "IGF-1 is high and GH is low in receptor resistance",
        "GH injections bypass the receptor and still raise IGF-1",
        "This is hypothyroidism, which raises GH",
    ],
    "The growth-hormone receptor does not signal, so the liver makes no IGF-1 and GH rises; giving more GH cannot work",
    "Laron syndrome is GH receptor deficiency. The liver does not make IGF-1, IGF-1's negative feedback is gone, and GH is high. The child looks GH-deficient but the level is the opposite, and exogenous GH does nothing because the receptor is the problem. IGF-1 treatment is the logic, not more GH. Pituitary failure would lower GH. IGF-1 is low here, not high. Injections cannot bypass a broken receptor. Hypothyroidism causes short stature with a different hormone pattern, not high GH and low IGF-1 as the pair.",
)

E(
    "Craniopharyngioma",
    4,
    "A 10-year-old has stopped growing, has headaches, and has bitemporal visual loss. Calcification sits above the sella. Diabetes insipidus is present. A student calls it a prolactinoma because any pituitary-region mass secretes prolactin, and says calcification means a meningioma only.",
    "What embryonic remnant, and why diabetes insipidus?",
    [
        "Rathke pouch remnants form a craniopharyngioma that compresses the chiasm and the pituitary stalk, interrupting ADH and GH",
        "A prolactinoma calcifies and presents in children as the usual tumor",
        "ADH is made in the anterior pituitary, so stalk compression spares water balance",
        "Bitemporal hemianopia means a tumor in the occipital lobe",
        "GH deficiency from stalk compression makes the child tall",
    ],
    "Rathke pouch remnants form a craniopharyngioma that compresses the chiasm and the pituitary stalk, interrupting ADH and GH",
    "Craniopharyngioma comes from Rathke pouch, often calcifies, and sits near the chiasm and stalk in children. Stalk compression blocks inhibitory dopamine (prolactin may rise a little) and, more importantly here, blocks ADH delivery and anterior pituitary releasing signals, so diabetes insipidus and growth failure follow. A prolactinoma is an adult lactotroph tumor and is not the calcified childhood mass. ADH is made in the hypothalamus and released from the posterior pituitary; the stalk carries it. Bitemporal field loss is the chiasm, not the occipital lobe. Lost GH stops growth; it does not make him tall.",
    "robbins-10",
)

E(
    "Leuprolide flare",
    5,
    "A man with prostate cancer is started on leuprolide. In the first week his bone pain worsens and his PSA ticks up. A student stops the drug because an agonist should lower testosterone immediately, and he adds testosterone gel.",
    "Why the early flare, and what must not be added?",
    [
        "A GnRH agonist first stimulates LH and testosterone, then downregulates the receptor; an antiandrogen covers the flare, and testosterone gel is the disease",
        "Leuprolide blocks the androgen receptor from the first dose",
        "The flare means the tumor is hormone-insensitive and the drug should stop",
        "Testosterone gel is the antidote to a GnRH agonist",
        "Continuous GnRH raises LH forever",
    ],
    "A GnRH agonist first stimulates LH and testosterone, then downregulates the receptor; an antiandrogen covers the flare, and testosterone gel is the disease",
    "Pulsatile GnRH raises LH. Continuous GnRH agonist first flares LH and testosterone, then the receptor downregulates and testosterone falls to castrate levels. The first week can hurt bone metastases, so an androgen-receptor blocker is used as cover. Stopping the drug for the expected flare loses the later suppression. Leuprolide is not a receptor blocker. The flare does not prove hormone resistance. Testosterone gel feeds the cancer. Continuous exposure does not raise LH forever; that is the pulsatile pattern.",
    "katzung-16",
)

E(
    "Tamoxifen tissues",
    5,
    "A woman takes tamoxifen after estrogen-receptor-positive breast cancer. Hot flashes occur, and a follow-up notes a thicker endometrium. Bone density has not fallen the way it did for a friend on an aromatase inhibitor. A student says tamoxifen blocks estrogen receptors in every tissue, so the uterus and bone should both atrophy.",
    "Where is it an antagonist, and where an agonist?",
    [
        "Antagonist in breast, agonist in bone and endometrium; the uterus can thicken or form cancer, and bone is relatively protected",
        "Antagonist in bone and agonist in breast",
        "It lowers endometrial cancer risk the way it lowers breast cancer risk",
        "Aromatase inhibitors are agonists in the breast",
        "Hot flashes mean estrogen activity is increased in the brain",
    ],
    "Antagonist in breast, agonist in bone and endometrium; the uterus can thicken or form cancer, and bone is relatively protected",
    "Tamoxifen is a selective estrogen receptor modulator. It blocks the breast receptor, which is the point in ER-positive cancer, but it stimulates endometrium and bone. Endometrial thickening and cancer risk are the trade, and hot flashes reflect blockade in the hypothalamus. It is not an antagonist everywhere. It does not protect the uterus the way it protects the breast. Aromatase inhibitors lower estrogen production in postmenopausal women and do not agonize the breast; they tend to thin bone. Hot flashes are a low-estrogen-signal symptom, not increased brain estrogen.",
    "katzung-16",
)

E(
    "Clomiphene",
    4,
    "A woman who wants to conceive is given a drug that blocks estrogen feedback at the hypothalamus. FSH rises and she ovulates. A student says the drug is an estrogen agonist at the pituitary, and that it works in premature ovarian failure with a sky-high FSH.",
    "How does the drug raise FSH, and who will not respond?",
    [
        "Clomiphene is an estrogen antagonist at the hypothalamus, so GnRH and FSH rise; a failed ovary cannot answer a high FSH",
        "It is an estrogen agonist, so FSH falls",
        "It works best when FSH is already menopausal",
        "It blocks FSH receptors on the follicle",
        "Ovulation occurs because progesterone rises first and then FSH falls",
    ],
    "Clomiphene is an estrogen antagonist at the hypothalamus, so GnRH and FSH rise; a failed ovary cannot answer a high FSH",
    "Clomiphene blocks estrogen's negative feedback. The hypothalamus sees a low-estrogen signal, GnRH and then FSH and LH rise, and a responsive ovary ovulates. If the ovary has failed, FSH is already high and more signal cannot recruit follicles. It is not a pituitary estrogen agonist. Menopausal FSH means there is nothing to stimulate. It does not block the ovarian FSH receptor. The sequence is gonadotropin then ovulation then progesterone, not progesterone first.",
    "katzung-16",
)

E(
    "Sildenafil nitrates",
    5,
    "A man takes sildenafil and later is given a nitrate for chest pain. His blood pressure collapses. A student says the drugs both raise cGMP by the same enzyme so the combination is redundant but safe, and that sildenafil is an alpha blocker.",
    "Why the collapse?",
    [
        "Nitrates donate nitric oxide, which raises cGMP, and sildenafil stops PDE-5 from breaking cGMP down, so vasodilation is extreme",
        "Sildenafil blocks nitric oxide synthase, so nitrates cannot work",
        "The combination raises blood pressure",
        "PDE-5 inhibition lowers cGMP",
        "Alpha blockade is the mechanism of sildenafil",
    ],
    "Nitrates donate nitric oxide, which raises cGMP, and sildenafil stops PDE-5 from breaking cGMP down, so vasodilation is extreme",
    "Erection and vascular smooth-muscle relaxation use nitric oxide, guanylate cyclase, and cGMP. Sildenafil inhibits PDE-5, so cGMP lasts. A nitrate floods the system with NO and more cGMP. Together the vessels dilate and pressure falls. Sildenafil does not block NO synthase. The combination causes hypotension, not hypertension. PDE-5 inhibition raises, not lowers, cGMP. Sildenafil is not an alpha blocker.",
    "katzung-16",
)

E(
    "Left varicocele",
    4,
    "A man has a dull ache and a bag-of-worms fullness in the left scrotum that is worse when standing. The right side is normal. A student says the right side is the usual side because the right gonadal vein drains to the vena cava at an angle, and that a sudden right varicocele is harmless.",
    "Why the left, and when is the right a warning?",
    [
        "The left gonadal vein drains to the left renal vein at a right angle, so left varicoceles are common; a new right varicocele raises concern for a vena cava or renal obstruction",
        "Both sides drain the same way, so side does not matter",
        "The right vein drains to the renal vein and is the common side",
        "A right varicocele is always benign",
        "Varicoceles are arterial aneurysms",
    ],
    "The left gonadal vein drains to the left renal vein at a right angle, so left varicoceles are common; a new right varicocele raises concern for a vena cava or renal obstruction",
    "The left testicular vein enters the left renal vein perpendicularly and under higher pressure, so left varicoceles predominate and can impair fertility by warming the testis. The right vein enters the IVC more directly. A unilateral right varicocele, especially if it appears suddenly or does not decompress, can signal a retroperitoneal mass or thrombus. Side is not random. The right is not the usual renal-vein side. A new right varicocele is not dismissed. These are veins, not arteries.",
    "guyton-14",
)

E(
    "Prostate cancer versus BPH zone",
    4,
    "An older man has a rock-hard nodule on the posterior rectal exam and a high PSA. Another older man has hesitancy and a uniformly enlarged, rubbery gland. Bone pain in the first man shows blastic lesions. A student says both diseases start in the same central zone and both make lytic bone lesions.",
    "Which zone, and what do the bone lesions look like?",
    [
        "Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone and is not a hard nodule",
        "Cancer is transitional and BPH is peripheral",
        "Prostate metastases are purely lytic",
        "A rubbery symmetric gland is cancer",
        "PSA rises only in BPH and falls in cancer",
    ],
    "Cancer begins in the peripheral zone and sends osteoblastic metastases; BPH is transitional zone and is not a hard nodule",
    "Adenocarcinoma arises in the peripheral zone, where a finger feels it, and it metastasizes as osteoblastic (sclerotic) bone lesions. BPH is nodular hyperplasia of the transitional zone around the urethra, causing obstructive symptoms with a rubbery gland. The zones are not the same. Prostate cancer in bone is classically blastic, unlike the lytic lesions of many other cancers. A hard nodule is cancer until proven otherwise; rubbery symmetry is hyperplasia. PSA can rise in both, and it rises in cancer.",
    "robbins-10",
)

E(
    "Testicular tumor markers",
    5,
    "A young man has a painless testicular mass. One histology is a homogeneous fried-egg tumor sensitive to radiation, with normal AFP. Another is a glandular tumor with high AFP. A third, with hemorrhage, has a very high beta-hCG and looks like cytotrophoblast and syncytiotrophoblast. A student says all three raise AFP and all are treated with radiation only.",
    "Which marker fits the yolk-sac element, and which tumor is the radiosensitive one?",
    [
        "AFP is yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP; choriocarcinoma raises beta-hCG",
        "Seminoma raises AFP and is radioresistant",
        "Choriocarcinoma raises AFP and not hCG",
        "Yolk sac tumors raise beta-hCG only",
        "A painless mass is infection, so markers are irrelevant",
    ],
    "AFP is yolk sac; seminoma is the radiosensitive homogeneous tumor and does not raise AFP; choriocarcinoma raises beta-hCG",
    "Seminoma is a germ-cell tumor of uniform cells, often radiosensitive, and AFP stays normal; if AFP is up, a nonseminomatous element is present. Yolk sac tumor makes AFP. Choriocarcinoma makes beta-hCG and bleeds. They are not one marker and one treatment. Seminoma does not raise AFP. Choriocarcinoma is the hCG tumor. Yolk sac is AFP. A painless testicular mass in a young man is cancer until proven otherwise.",
    "robbins-10",
)

E(
    "Molar pregnancy",
    5,
    "A woman has bleeding, a uterus too large for dates, severe vomiting, and a snowstorm ultrasound with no fetus. Beta-hCG is extremely high. TSH is low and free T4 is up. A student diagnoses a normal twin pregnancy because the uterus is large, and says hCG cannot affect the thyroid.",
    "What is the chromosomal pattern of a complete mole, and why the thyroid?",
    [
        "A complete mole is diploid paternal chromosomes with no fetus; very high hCG stimulates the TSH receptor",
        "A complete mole contains a fetus and maternal and paternal DNA",
        "hCG suppresses the thyroid, so T4 should be low",
        "Twins produce this snowstorm and a higher hCG than a mole",
        "Theca-lutein cysts mean a low hCG",
    ],
    "A complete mole is diploid paternal chromosomes with no fetus; very high hCG stimulates the TSH receptor",
    "A complete hydatidiform mole is usually 46,XX, both sets paternal, with no fetal tissue and swollen villi. hCG is enormous, ovaries can form theca-lutein cysts, and hCG cross-reacts on the TSH receptor so mild thyrotoxicosis and hyperemesis occur. A partial mole has a fetus and is triploid. hCG stimulates, it does not suppress, the thyroid. A twin pregnancy does not look like a snowstorm without a fetus. Theca-lutein cysts reflect high, not low, hCG.",
    "robbins-10",
)

E(
    "Endometriosis",
    4,
    "A woman has painful periods, pain with intercourse, and infertility. A fixed retroverted uterus and a tender nodule behind the cervix are found. Laparoscopy shows powder-burn implants. A student says the pain is anovulation because cycles are painful, and that implants are inside the uterine muscle.",
    "Where is the tissue, and how is this different from adenomyosis?",
    [
        "Endometrial glands are outside the uterus, often on the ovary or peritoneum; adenomyosis is endometrial tissue within the myometrium",
        "Both are endometrial tissue confined to the cavity",
        "Powder-burn lesions are cervical cancer",
        "Painful menses mean she is not ovulating",
        "Infertility with cyclic pain is explained by an absent uterus",
    ],
    "Endometrial glands are outside the uterus, often on the ovary or peritoneum; adenomyosis is endometrial tissue within the myometrium",
    "Endometriosis is ectopic endometrium that bleeds with the cycle, causing dysmenorrhea, dyspareunia, a fixed uterus, and infertility. Implants look like powder burns, and an ovary can become a chocolate cyst. Adenomyosis is the same tissue grown into the muscle of the uterus, a bulky tender uterus, not peritoneal implants. The cavity is not the only site. Powder burns are not carcinoma. Cyclic pain implies she is having hormonal cycles, not anovulation as the explanation. The uterus is present and often fixed.",
    "robbins-10",
)

E(
    "Cryptorchidism",
    4,
    "A 1-year-old boy still has an empty scrotum on the right, and the testis is felt in the inguinal canal. A student says cancer risk returns to normal after orchiopexy, and that fertility is unaffected if only one side is undescended. He also says the testis should be left because descent after age 1 is reliable.",
    "What risks remain?",
    [
        "An undescended testis has impaired fertility potential and a cancer risk that orchiopexy does not erase; it is brought down so it can be examined, and waiting past infancy is not the plan",
        "Cancer risk falls to zero after the testis is moved",
        "A unilateral undescended testis never affects fertility",
        "Most testes still in the canal at one year will descend at puberty",
        "Orchiopexy is done only for appearance and has no surveillance purpose",
    ],
    "An undescended testis has impaired fertility potential and a cancer risk that orchiopexy does not erase; it is brought down so it can be examined, and waiting past infancy is not the plan",
    "Cryptorchidism exposes the testis to the wrong temperature. Germ cells suffer, so fertility can be reduced even when one side is involved because the contralateral testis is often not entirely normal either, and the cancer risk is increased. Orchiopexy makes the testis examinable; it does not reset malignant potential to zero. Descent after a year is unlikely. The operation is for the testis, not cosmetics alone.",
    "robbins-10",
)

E(
    "Sertoli versus Leydig",
    4,
    "A boy has precocious puberty and a testicular mass. Reinke crystals are in the tumor cells. A student says Sertoli cells make testosterone and Leydig cells make inhibin, and that a Leydig tumor would suppress puberty.",
    "Which cell made the androgen?",
    [
        "Leydig cells make testosterone and can form crystals of Reinke; Sertoli cells support spermatogenesis and make inhibin and AMH",
        "Sertoli cells make testosterone",
        "A Leydig tumor delays puberty",
        "Reinke crystals are the seminoma marker",
        "Inhibin is the Leydig product that virilizes",
    ],
    "Leydig cells make testosterone and can form crystals of Reinke; Sertoli cells support spermatogenesis and make inhibin and AMH",
    "Leydig cells are the interstitial androgen source. A Leydig-cell tumor can virilize a child, and Reinke crystals are the histologic clue. Sertoli cells nurse germ cells, make inhibin (feedback on FSH) and anti-Müllerian hormone, and do not make the testosterone surge. A testosterone-secreting tumor advances puberty, it does not delay it. Seminoma is a germ-cell tumor without Reinke crystals. Inhibin does not virilize.",
)

E(
    "Oxytocin versus ADH",
    4,
    "A student confuses the two posterior pituitary hormones. One causes milk ejection and uterine contraction and is released by nipple suckling and cervical stretch. The other raises water reabsorption in the collecting duct via V2 receptors and cAMP. She says both use the same V2 receptor and both are made in the anterior pituitary.",
    "Where are they made, and which receptor holds water?",
    [
        "Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH uses V2 receptors and aquaporins, oxytocin uses a different receptor on breast and uterus",
        "Both are made in the anterior pituitary",
        "Oxytocin inserts aquaporins in the collecting duct",
        "ADH causes milk letdown",
        "V1 receptors in the kidney are the antidiuretic ones",
    ],
    "Both are made in hypothalamic nuclei and released from the posterior pituitary; ADH uses V2 receptors and aquaporins, oxytocin uses a different receptor on breast and uterus",
    "Supraoptic and paraventricular neurons make ADH and oxytocin. The posterior pituitary only releases them. ADH's V2 receptor puts aquaporin-2 in the collecting duct; V1 receptors constrict vessels. Oxytocin contracts myoepithelium and uterine muscle and does not retain water. They are not anterior-pituitary products. Oxytocin does not insert renal aquaporins. ADH is not the milk-ejection hormone. The antidiuretic receptor is V2, not V1.",
)

E(
    "Inhibin and AMH",
    4,
    "A student is asked which testicular cell feeds back on FSH and which product removes the Müllerian duct in a male fetus. She assigns both jobs to Leydig-cell testosterone. A boy with absent Sertoli function is being discussed as a thought experiment.",
    "Which cell does both of those jobs?",
    [
        "Sertoli cells make inhibin, which restrains FSH, and anti-Müllerian hormone, which regresses the uterus anlage; testosterone from Leydig cells keeps the wolffian duct",
        "Leydig cells make AMH and inhibin",
        "Testosterone regresses the Müllerian duct",
        "Inhibin raises FSH",
        "AMH is an ovarian hormone only, so a male fetus does not make it",
    ],
    "Sertoli cells make inhibin, which restrains FSH, and anti-Müllerian hormone, which regresses the uterus anlage; testosterone from Leydig cells keeps the wolffian duct",
    "Sertoli cells do the two jobs she gave to testosterone. Inhibin selectively feeds back on FSH. AMH, also from Sertoli cells, removes Müllerian structures. Testosterone and DHT build and keep wolffian ducts and external male genitalia; they do not remove the Müllerian duct. Inhibin lowers FSH, it does not raise it. Male fetuses make AMH; that is how they avoid a uterus. Absent Sertoli function would leave Müllerian structures and raise FSH.",
    "langman-embryo",
)

# multisystem 43
M(
    "AA versus AL amyloid",
    4,
    "Patient A has long rheumatoid arthritis and protein in the urine; the deposit stains with Congo red and loses the apple-green color after permanganate. Patient B has a plasma-cell dyscrasia, macroglossia, and a deposit that resists permanganate. A student says both proteins are immunoglobulin light chain.",
    "Which protein is which?",
    [
        "A is serum amyloid A from chronic inflammation; B is immunoglobulin light chain",
        "Both are light chain",
        "A is transthyretin and B is beta-2 microglobulin",
        "Permanganate-sensitive amyloid is AL",
        "Macroglossia is the AA pattern",
    ],
    "A is serum amyloid A from chronic inflammation; B is immunoglobulin light chain",
    "AA amyloid comes from serum amyloid A, an acute-phase protein, in chronic inflammation, and the Congo-red birefringence is abolished by permanganate. AL amyloid is light chain from a plasma-cell clone, resists that treatment, and causes macroglossia, heart, and kidney disease. They are not both light chain. Transthyretin is senile or familial cardiac amyloid; beta-2 microglobulin is dialysis-related. Permanganate sensitivity points to AA, not AL. Macroglossia is the AL clue.",
)

M(
    "Goodpasture",
    5,
    "A young man has hemoptysis and then hematuria. Biopsy shows linear IgG along the glomerular basement membrane. Anti-GBM antibodies are present. A student calls it granulomatosis with polyangiitis because lung and kidney are both involved, and he expects a c-ANCA and a pauci-immune glomerulus.",
    "What is the antigen, and why is the immunofluorescence linear?",
    [
        "Antibodies bind type IV collagen that is shared by lung and kidney basement membranes, so IgG lines the membrane; GPA is ANCA-positive and has little immunoglobulin on the biopsy",
        "Immune complexes in lumps mean Goodpasture",
        "c-ANCA is the Goodpasture test",
        "Type II collagen is the shared antigen",
        "Hemoptysis plus hematuria is always infection, so antibodies are irrelevant",
    ],
    "Antibodies bind type IV collagen that is shared by lung and kidney basement membranes, so IgG lines the membrane; GPA is ANCA-positive and has little immunoglobulin on the biopsy",
    "Goodpasture disease is type II hypersensitivity to the noncollagenous domain of type IV collagen in GBM and alveolar basement membrane. Antibody sticks in a line. GPA is a small-vessel vasculitis with PR3-ANCA, granulomas, and a pauci-immune crescent, not linear IgG. Lumpy immunofluorescence is immune-complex disease. The ANCA is not the Goodpasture marker. Type II collagen is cartilage. The antibody is the disease.",
)

M(
    "GPA versus microscopic polyangiitis",
    5,
    "Patient A has chronic sinusitis, cavitary lung nodules, and glomerulonephritis, with c-ANCA/PR3. Patient B has lung capillaritis and glomerulonephritis without granulomas or upper-airway disease, with p-ANCA/MPO. A student calls both immune-complex lupus because the kidney is involved.",
    "What is absent on the biopsy of both, compared with lupus?",
    [
        "Both are pauci-immune ANCA vasculitides; lupus nephritis has immune deposits. Granulomas and sinus disease separate GPA from microscopic polyangiitis",
        "Both have dense subepithelial deposits",
        "p-ANCA is specific for GPA",
        "Microscopic polyangiitis is a large-vessel disease",
        "C-ANCA targets myeloperoxidase",
    ],
    "Both are pauci-immune ANCA vasculitides; lupus nephritis has immune deposits. Granulomas and sinus disease separate GPA from microscopic polyangiitis",
    "ANCA vasculitides injure small vessels without much immunoglobulin in the tissue, which is pauci-immune, unlike lupus. GPA adds necrotizing granulomas of the respiratory tract and is usually PR3/c-ANCA. Microscopic polyangiitis is the same-sized vessels without granulomas and is usually MPO/p-ANCA. Dense deposits are immune-complex disease. p-ANCA is the MPA/eosinophilic pattern more than GPA. These are small vessels, not the aorta. c-ANCA is PR3, not MPO.",
)

M(
    "Polyarteritis nodosa",
    4,
    "A man with hepatitis B has fever, mononeuritis multiplex, abdominal pain after meals, and hypertension from renal infarcts. The lungs are spared. ANCA is negative. Angiography shows microaneurysms of medium muscular arteries. A student calls it GPA because of the nerve findings.",
    "Which vessel size, and why is ANCA the wrong test?",
    [
        "Medium muscular arteries, fibrinoid necrosis and aneurysms, associated with hepatitis B, ANCA-negative, lungs spared",
        "Small vessels with PR3-ANCA and granulomas",
        "The aorta, as in giant-cell arteritis of a young man",
        "Capillaries only, with linear IgG",
        "Hepatitis B is unrelated to this vasculitis",
    ],
    "Medium muscular arteries, fibrinoid necrosis and aneurysms, associated with hepatitis B, ANCA-negative, lungs spared",
    "Polyarteritis nodosa is a medium-vessel necrotizing arteritis. Hepatitis B is the classic association. It spares the pulmonary arteries, hits nerve, gut, and kidney as infarcts rather than glomerulonephritis, and ANCA is negative. GPA is small-vessel, ANCA-positive, and involves the lung and sinus. Giant-cell arteritis is older adults and the aorta and its branches. Linear IgG is anti-GBM disease. Hepatitis B is part of the classic story.",
)

M(
    "IgA vasculitis",
    4,
    "A child has purpura on the legs and buttocks, joint pain, abdominal pain, and blood in the urine a week after a cold. Immunofluorescence of the kidney is IgA-dominant. A student calls it acute post-streptococcal glomerulonephritis because it followed an infection, and expects subepithelial humps and low C3.",
    "What is the deposit, and why is complement not the APSGN pattern?",
    [
        "IgA immune complexes in small vessels of skin, gut, and mesangium; post-streptococcal disease is weeks later with low C3 and humps, not palpable purpura as the lead",
        "Linear IgG is the Henoch-Schonlein finding",
        "C3 is always consumed in IgA vasculitis the way it is in post-strep disease",
        "The purpura is thrombocytopenia, so platelets are low",
        "Joint pain means rheumatoid factor disease in a child a week after a cold",
    ],
    "IgA immune complexes in small vessels of skin, gut, and mesangium; post-streptococcal disease is weeks later with low C3 and humps, not palpable purpura as the lead",
    "IgA vasculitis (Henoch-Schönlein) follows a mucosal infection quickly. IgA deposits in vessels and mesangium. The tetrad is purpura, arthritis, abdominal pain, and renal disease, with a normal platelet count. Post-streptococcal glomerulonephritis is later, low C3, and subepithelial humps, without this skin. Linear IgG is anti-GBM. Complement is often normal in IgA disease. The purpura is vasculitis, not a low platelet count. This is not juvenile rheumatoid arthritis.",
)

M(
    "SLE complement",
    4,
    "A young woman has a malar rash, painless oral ulcers, arthritis, a positive ANA and anti-dsDNA, and a low C3 and C4. Urine has protein and red-cell casts. A student says complement is high because antibodies mean more immune activity, and that anti-Smith is less specific than anti-dsDNA.",
    "Why is complement low, and which antibody is most specific?",
    [
        "Immune complexes consume C3 and C4; anti-Smith is the most specific ANA subset, and anti-dsDNA tracks renal disease",
        "Complement rises in active lupus nephritis",
        "Anti-dsDNA is nonspecific and anti-histone is specific for native lupus",
        "Red-cell casts mean bladder cancer, not glomerular inflammation",
        "A malar rash is dermatomyositis",
    ],
    "Immune complexes consume C3 and C4; anti-Smith is the most specific ANA subset, and anti-dsDNA tracks renal disease",
    "Lupus nephritis is type III hypersensitivity. Complexes fix complement, so C3 and C4 fall when disease is active, and anti-dsDNA titers often rise with the kidney. Anti-Smith is very specific though less sensitive. Complement does not rise as the activity marker; it falls. Anti-histone is the drug-induced lupus clue, not the specific native marker. Red-cell casts are glomerular. A malar rash sparing the nasolabial folds is lupus, not the eyelid heliotrope of dermatomyositis.",
)

M(
    "TTP versus DIC versus HUS",
    5,
    "Patient A has fever, thrombocytopenia, microangiopathic hemolysis, renal failure, and confusion. ADAMTS13 is very low. Coagulation times are normal. Patient B has sepsis, oozing, low fibrinogen, high D-dimer, and long PT and PTT. Patient C is a child after bloody diarrhea from E. coli, with renal failure and a smear of schistocytes, and normal coags. A student gives all three heparin as the distinguishing treatment.",
    "What is missing in A, and what is consumed in B?",
    [
        "A lacks the vWF-cleaving protease, so platelet thrombi form; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS and is not DIC",
        "All three have low fibrinogen as the definition",
        "ADAMTS13 deficiency prolongs the PT",
        "Heparin is the treatment of TTP",
        "E. coli HUS is treated with platelets as the first move and antibiotics always help",
    ],
    "A lacks the vWF-cleaving protease, so platelet thrombi form; B consumes clotting factors and fibrinogen; C is toxin-mediated HUS and is not DIC",
    "TTP is ADAMTS13 deficiency. Ultra-large vWF multimers trap platelets, the smear shows schistocytes, and the clotting times stay normal because factors are not consumed. Plasma exchange replaces the enzyme. DIC consumes factors, fibrinogen falls, D-dimer rises, and PT/PTT lengthen; treat the cause. HUS after Shiga toxin is renal-predominant thrombotic microangiopathy with normal coags. Heparin does not replace ADAMTS13. A low ADAMTS13 does not prolong the PT. Platelet transfusion in TTP can feed the thrombi, and antibiotics in Shiga HUS are not the simple fix.",
)

M(
    "HIT",
    5,
    "A man on heparin for eight days has a platelet count that fell by half, and he develops a new arterial clot. The student stops heparin and starts a low-molecular-weight heparin because it is a different bottle, and he orders a platelet transfusion so the count looks normal.",
    "What antibody, and why is the other heparin wrong?",
    [
        "IgG against platelet factor 4-heparin activates platelets and causes thrombosis; every heparin must stop, including low-molecular-weight heparin, and platelets are not the treatment",
        "HIT is a nonimmune platelet clump on day 1 that causes bleeding",
        "Low-molecular-weight heparin is safe in HIT",
        "The antibody prolongs bleeding and forbids anticoagulation of any kind",
        "Platelet transfusion is required before any further anticoagulant",
    ],
    "IgG against platelet factor 4-heparin activates platelets and causes thrombosis; every heparin must stop, including low-molecular-weight heparin, and platelets are not the treatment",
    "HIT is immune. Antibodies to PF4-heparin complexes activate platelets, the count falls around day 5 to 10, and the clinical problem is thrombosis, not bleeding. All heparin stops. A direct thrombin inhibitor or another non-heparin anticoagulant is used. Low-molecular-weight heparin cross-reacts. This is not the benign early nonimmune drop. You do not withhold all anticoagulation in a clotting patient, and you do not pour platelets into an activating antibody.",
    "katzung-16",
)

M(
    "Warfarin necrosis",
    5,
    "A woman started on warfarin without a heparin bridge develops painful skin necrosis over the breast on day 3. Protein C is low. A student says the INR is not yet therapeutic so the drug cannot be the cause, and he increases the warfarin.",
    "Why the early clot in the skin?",
    [
        "Protein C, a short-half-life anticoagulant, falls before the longer-lived procoagulant factors, so warfarin is briefly prothrombotic",
        "Warfarin inhibits platelet COX the way aspirin does",
        "Necrosis means the dose is too low and should be doubled",
        "Protein C excess causes the necrosis",
        "Heparin bridge increases the risk of this necrosis",
    ],
    "Protein C, a short-half-life anticoagulant, falls before the longer-lived procoagulant factors, so warfarin is briefly prothrombotic",
    "Warfarin blocks vitamin K-dependent gamma carboxylation of factors II, VII, IX, X and of proteins C and S. Protein C disappears first. For a few days the patient is hypercoagulable, especially if protein C was already low, and dermal vessels thrombose. A subtherapeutic INR does not mean the drug is inactive. Warfarin is not an antiplatelet COX inhibitor. Raising the dose worsens the imbalance. The problem is too little protein C, not too much. Bridging with heparin covers this window; it does not cause the necrosis.",
    "katzung-16",
)

M(
    "vWD versus hemophilia",
    4,
    "A woman has heavy periods, nosebleeds, and a prolonged bleeding time. PTT is mildly long and factor VIII activity is a bit low. Her father had the same nosebleeds. A man in the next room has deep joint bleeds, a very long PTT, a normal bleeding time, and an affected uncle. A student says both have platelet defects because both bleed.",
    "Which factor is qualitative in her, and why is his bleeding time normal?",
    [
        "She has von Willebrand disease, autosomal, with a bad platelet-adhesion protein that also carries VIII; he has factor VIII deficiency, an X-linked deep-bleeding disease with normal primary hemostasis",
        "Both are factor VIII deficiency",
        "Hemophilia prolongs the bleeding time",
        "von Willebrand disease is X-linked and causes hemarthroses as the first sign",
        "A long PTT means the extrinsic pathway in both",
    ],
    "She has von Willebrand disease, autosomal, with a bad platelet-adhesion protein that also carries VIII; he has factor VIII deficiency, an X-linked deep-bleeding disease with normal primary hemostasis",
    "vWF glues platelets to collagen and carries factor VIII. When it is low or defective, mucosal bleeding and a long bleeding time follow, VIII may be secondarily low, and the inheritance hits both sexes. Hemophilia A is factor VIII itself, X-linked, deep bleeds into joints, normal platelets and bleeding time, and a long PTT. They are not the same platelet defect. Hemophilia does not prolong the bleeding time. vWD is not the hemarthrosis disease and is not X-linked in the usual types. PTT is the intrinsic pathway, which includes VIII, not the extrinsic PT pathway.",
)

M(
    "G6PD hemolysis",
    4,
    "An African-American man takes primaquine and a few days later has dark urine, jaundice, and bite cells. Heinz bodies are seen on a special stain. Between attacks his blood count is normal. A student says the enzyme is high because the older cells survived, and he prescribes more primaquine.",
    "Why this timing, and why can the enzyme assay be normal a week later?",
    [
        "Older red cells with the least G6PD lyse when oxidant stress uses up glutathione; after they are gone the remaining young cells can assay near normal",
        "G6PD excess causes hemolysis",
        "The assay is most abnormal a month later when only young cells remain",
        "Heinz bodies are denatured hemoglobin from a membrane spectrin defect",
        "Primaquine is safe in G6PD deficiency",
    ],
    "Older red cells with the least G6PD lyse when oxidant stress uses up glutathione; after they are gone the remaining young cells can assay near normal",
    "G6PD is the first pentose-pathway enzyme that keeps glutathione reduced. The A- variant declines as red cells age. An oxidant drug lyses the old cells, then the crisis stops, and a test drawn after the old cells are gone can look normal. You do not see enzyme excess. The assay is falsely reassuring right after a hemolysis, not a month later when a mixed-age population has returned. Heinz bodies are oxidized hemoglobin, not hereditary spherocytosis. Primaquine is a classic trigger and is avoided.",
    "katzung-16",
)

M(
    "Hereditary spherocytosis",
    4,
    "A teenager has anemia, jaundice, gallstones, and a family history. The smear shows round red cells without central pallor. MCHC is high. A student calls it G6PD deficiency because of the jaundice, and says splenectomy would worsen spherocytosis.",
    "What protein failed, and why does the spleen matter?",
    [
        "Spectrin or ankyrin is weak, so cells lose membrane, become spheres, and are trapped in the spleen; splenectomy stops the hemolysis even though the sphere shape remains",
        "A hemoglobin point mutation sickles the cells",
        "G6PD deficiency makes spherocytes as the main smear",
        "Splenectomy increases destruction of spherocytes",
        "MCHC is low because the cells are overhydrated",
    ],
    "Spectrin or ankyrin is weak, so cells lose membrane, become spheres, and are trapped in the spleen; splenectomy stops the hemolysis even though the sphere shape remains",
    "Hereditary spherocytosis is a membrane cytoskeleton defect. Cells lose surface area, become spheres with a high MCHC, and cannot deform through the spleen, so they are destroyed there. Pigment gallstones follow. Splenectomy removes the filter; the cells stay spherical but they are not culled. Sickle cell is a hemoglobin mutation with a different smear. G6PD causes bite cells after oxidant stress, not a chronic spherocytic family disease. Splenectomy decreases, not increases, destruction. The cells are dehydrated of surface, so hemoglobin is concentrated and MCHC is high.",
)

M(
    "Sickle mechanism",
    4,
    "A child of African descent has pain crises, a low hemoglobin, and Howell-Jolly bodies. Hemoglobin electrophoresis shows HbS. A student says sickling happens when hemoglobin is oxygenated, and that the spleen stays enlarged for life.",
    "When does the polymer form, and what happens to the spleen?",
    [
        "Deoxygenated HbS polymerizes; repeated infarcts autosplenectomize, which is why Howell-Jolly bodies appear and encapsulated bacteria are a risk",
        "Oxygenated HbS is the polymer",
        "The spleen enlarges permanently and function improves",
        "Howell-Jolly bodies mean the spleen is hyperactive",
        "HbS is a quantitative globin-chain defect like thalassemia",
    ],
    "Deoxygenated HbS polymerizes; repeated infarcts autosplenectomize, which is why Howell-Jolly bodies appear and encapsulated bacteria are a risk",
    "A point mutation makes valine replace glutamate. When oxygen comes off, HbS stacks and the cell sickles, especially in slow, acidic, deoxygenated capillary beds. The spleen is infarcted over childhood, function is lost, nuclear remnants stay in red cells, and Salmonella and pneumococcus become dangerous. Oxygenated hemoglobin does not polymerize. The spleen does not stay large and healthy. Howell-Jolly bodies mean the spleen is absent or not working. Sickle cell is a qualitative hemoglobin defect; thalassemia is quantitative.",
)

M(
    "Thalassemia versus iron deficiency",
    4,
    "A child has a very low MCV, a normal iron and ferritin, and a high hemoglobin A2. Target cells are on the smear. A student treats with iron because the cells are small, and says ferritin should be low.",
    "What chain is underproduced, and why is iron wrong?",
    [
        "Beta chains are reduced, alpha chains precipitate, and A2 (delta) rises; iron stores are normal, so iron will overload him",
        "Iron deficiency raises hemoglobin A2",
        "Ferritin is low in thalassemia trait",
        "Target cells mean B12 deficiency",
        "Beta thalassemia trait has a high MCV",
    ],
    "Beta chains are reduced, alpha chains precipitate, and A2 (delta) rises; iron stores are normal, so iron will overload him",
    "Beta thalassemia trait is a quantitative drop in beta globin. Excess alpha chains damage precursors, the MCV is very low, targets appear, and HbA2 is up because delta chains are relatively increased. Iron studies are normal. Giving iron does not fix the gene and can load him. Iron deficiency lowers A2 and ferritin. Ferritin is not low here. Targets are a hemoglobinopathy clue, not B12, which is macrocytic. The MCV is low, not high.",
)

M(
    "PNH",
    5,
    "A man has dark urine in the morning, abdominal vein thrombosis, and a low blood count of all three lines. Flow cytometry is missing CD55 and CD59. A student says the urine is myoglobin from a morning workout, and that thrombosis means he has too many complement inhibitors.",
    "What anchor is missing?",
    [
        "GPI anchor, so decay-accelerating factor and MIRL are absent and complement lyses red cells, especially at night; hepatic-vein thrombosis is part of the disease",
        "Spectrin, so spherocytes thrombus",
        "CD55 excess causes the hemolysis",
        "Myoglobinuria is the morning pigment of PNH",
        "Complement inhibitors are increased",
    ],
    "GPI anchor, so decay-accelerating factor and MIRL are absent and complement lyses red cells, especially at night; hepatic-vein thrombosis is part of the disease",
    "PNH is an acquired PIGA mutation. Without a GPI anchor, CD55 and CD59 are not on the cell, complement is not braked, and cells lyse. Acidosis of sleep activates complement, so urine is dark in the morning. The same clone thrombosies odd veins, including the hepatic vein, and the marrow often fails. Spectrin is hereditary spherocytosis. The proteins are missing, not in excess. The pigment is hemoglobin. Complement inhibition is lost, not increased.",
)

M(
    "Warm versus cold antibody",
    4,
    "Patient A has anemia, spherocytes, and IgG and C3 on the red cell at body temperature, and a lupus history. Patient B has pain and blue fingers in the cold, and IgM that agglutinates red cells in the cooler extremity. A student says both are IgG and both are treated with the same first logic of staying warm only.",
    "Which antibody is which?",
    [
        "Warm is IgG, extravascular, associated with lupus; cold is IgM, fixes complement in the periphery, and follows mycoplasma or lymphoma",
        "Both are IgM",
        "Cold agglutinin disease is IgG against Rh",
        "Warm antibodies agglutinate only in the fingers",
        "Spherocytes mean the antibody is IgM",
    ],
    "Warm is IgG, extravascular, associated with lupus; cold is IgM, fixes complement in the periphery, and follows mycoplasma or lymphoma",
    "Warm autoimmune hemolysis is IgG, often against Rh, and the spleen removes the coated cells, making spherocytes. It associates with lupus, CLL, and drugs. Cold agglutinin disease is IgM, which binds in cool fingers, fixes complement, and can follow Mycoplasma or EBV or a lymphoma. Staying warm matters for cold disease; warm disease is a steroid and spleen problem. They are not both IgG. Cold disease is not an Rh IgG. Warm antibodies bind at 37 degrees, not only in the fingers. Spherocytes are the warm, IgG, splenic pattern.",
)

M(
    "AML versus ALL",
    4,
    "A 60-year-old has blasts with Auer rods and a positive myeloperoxidase. A 6-year-old has blasts that are PAS-positive and terminal-deoxynucleotidyl-transferase positive, and the marrow is packed. A student says Auer rods are lymphoid and that ALL is a disease of older adults.",
    "Which lineage has Auer rods?",
    [
        "Auer rods are fused granules in myeloid blasts, so this is AML; TdT-positive blasts in a child are lymphoblasts",
        "Auer rods define ALL",
        "Myeloperoxidase is a lymphoid enzyme",
        "ALL peaks in the seventh decade",
        "TdT is the myeloid marker",
    ],
    "Auer rods are fused granules in myeloid blasts, so this is AML; TdT-positive blasts in a child are lymphoblasts",
    "Auer rods and myeloperoxidase mark myeloid differentiation, acute myeloid leukemia, which is the adult blast crisis in this vignette and can cause DIC especially in the promyelocytic subtype. ALL is the childhood disease of lymphoblasts, TdT positive, PAS-positive blocks. Auer rods are not lymphoid. Myeloperoxidase is myeloid. ALL is not an older-adult peak. TdT is the lymphoblast marker.",
)

M(
    "CML versus leukemoid",
    5,
    "A man has a very high neutrophil count, basophilia, a low leukocyte alkaline phosphatase, and a translocation between chromosomes 9 and 22. He feels full in the left upper quadrant. A student calls it a leukemoid reaction because the count is high, and expects a high LAP and no basophilia.",
    "What fusion, and how is LAP different?",
    [
        "BCR-ABL from t(9;22) is a tyrosine kinase that drives CML; LAP is low, whereas a reactive leukemoid count has a high LAP and no basophilia",
        "Leukemoid reactions have low LAP and basophilia",
        "The Philadelphia chromosome is t(15;17)",
        "Imatinib blocks a retinoic-acid receptor",
        "The spleen is small in CML",
    ],
    "BCR-ABL from t(9;22) is a tyrosine kinase that drives CML; LAP is low, whereas a reactive leukemoid count has a high LAP and no basophilia",
    "CML is the BCR-ABL tyrosine kinase, t(9;22). Neutrophils are poorly differentiated in function, so LAP is low, basophils are up, and the spleen is large. A leukemoid reaction to infection has a high LAP, toxic granules, and no basophilia. The LAP and the basophils are the separator before the karyotype. t(15;17) is acute promyelocytic leukemia. Imatinib blocks the ABL kinase, not a retinoic-acid receptor; ATRA is the promyelocytic drug. The spleen is big.",
)

M(
    "Hodgkin Reed-Sternberg",
    4,
    "A young adult has a cervical node, night sweats, and a mediastinal mass. The node shows a few large CD15 and CD30 positive cells with owl eyes in a sea of lymphocytes. A student says the malignant cell is the small lymphocyte and that extranodal spread at diagnosis is the usual pattern.",
    "Which cell is malignant, and how does spread differ from non-Hodgkin lymphoma?",
    [
        "The Reed-Sternberg cell is the malignant B cell; Hodgkin lymphoma spreads node to contiguous node, whereas non-Hodgkin lymphomas are often already disseminated",
        "The small lymphocytes are the clone",
        "CD15 and CD30 are the myeloid Auer-rod markers",
        "Hodgkin disease starts in multiple extranodal sites",
        "Owl-eye cells are CMV, not a lymphoma",
    ],
    "The Reed-Sternberg cell is the malignant B cell; Hodgkin lymphoma spreads node to contiguous node, whereas non-Hodgkin lymphomas are often already disseminated",
    "Reed-Sternberg cells are the neoplastic B cells, CD15 and CD30 positive, sitting in a reactive lymph-node background. Disease moves to the next node in line, which is why staging and contiguous radiation logic existed. The crowd of small lymphocytes is reactive. Those CD markers are not Auer rods. Non-Hodgkin lymphomas more often present widespread, including extranodal. The owl eye here is a binucleate tumor cell, not a viral inclusion, though the differential of big cells includes infection.",
)

M(
    "Multiple myeloma",
    4,
    "An older man has back pain, a punched-out skull film, anemia, and rouleaux. Calcium is high and the anion gap is low. Urine has light chains. A student says the gap is high because of the protein, and that the bone lesions are blastic.",
    "Why the low anion gap and the lytic bone?",
    [
        "IgG is cationic and lowers the anion gap; osteoclast-activating cytokines from the plasma cells punch out bone and release calcium",
        "Myeloma protein raises the anion gap",
        "Bone lesions are osteoblastic like prostate cancer",
        "Light chains are the intact immunoglobulin on serum electrophoresis only",
        "Rouleaux means iron deficiency",
    ],
    "IgG is cationic and lowers the anion gap; osteoclast-activating cytokines from the plasma cells punch out bone and release calcium",
    "A large IgG paraprotein is positively charged and narrows the measured anion gap. Plasma cells activate osteoclasts, so lesions are purely lytic, calcium rises, and marrow replacement causes anemia. Rouleaux are stacked red cells from the protein. The gap goes down, not up. Prostate cancer is blastic. Urine light chains (Bence Jones) may not show as a big serum spike if only light chain is made. Rouleaux are not an iron-deficiency smear.",
)

M(
    "p53 and Rb",
    4,
    "A family has sarcomas, breast cancer, and leukemias at young ages. Another child has a retinoblastoma and later an osteosarcoma. A student says both genes are proto-oncogenes that need one hit, and that p53 pushes the cell through a damaged G1.",
    "What do these genes normally do?",
    [
        "Both are tumor suppressors needing two hits; p53 stops the cycle for repair or apoptosis, and Rb holds E2F until phosphorylation",
        "p53 is an oncogene activated by one mutation",
        "Rb promotes E2F constantly",
        "Li-Fraumeni is an Rb germline mutation",
        "A single somatic hit in one Rb allele in a retinal cell is enough if the germline is normal, and the familial form needs no second hit",
    ],
    "Both are tumor suppressors needing two hits; p53 stops the cycle for repair or apoptosis, and Rb holds E2F until phosphorylation",
    "p53 and Rb brake the cell. p53 answers DNA damage. Rb binds E2F until cyclin-dependent kinases phosphorylate it. Losing both copies removes the brake. Li-Fraumeni is germline p53. Familial retinoblastoma is germline Rb plus a second hit, and osteosarcoma is the later tumor. They are not one-hit oncogenes. Rb restrains E2F; it does not activate it until it is phosphorylated and lets go. The familial form still needs a second hit in the tumor cell; a single germline hit alone is not the tumor.",
)

M(
    "BCL2 follicular lymphoma",
    4,
    "An older adult has a waxing and waning lymphadenopathy. The node is follicular. t(14;18) is present. A student says the translocation creates a hyperactive cell-cycle kinase, and that the cells die faster than normal.",
    "What is overexpressed, and what death pathway is blocked?",
    [
        "BCL2 is put next to the immunoglobulin heavy-chain promoter, so the cells resist apoptosis",
        "The translocation is BCR-ABL",
        "BCL2 promotes apoptosis, so the nodes shrink from cell death",
        "Follicular lymphoma is a T-cell disease",
        "t(14;18) is the Burkitt myc translocation",
    ],
    "BCL2 is put next to the immunoglobulin heavy-chain promoter, so the cells resist apoptosis",
    "t(14;18) drives BCL2 from the Ig heavy-chain enhancer. BCL2 blocks the mitochondrial apoptosis pathway, so B cells accumulate slowly and the nodes wax and wane. It is not a kinase like BCL-ABL. The cells fail to die; they do not die faster. This is a B-cell lymphoma. Burkitt is t(8;14), myc next to immunoglobulin.",
)

M(
    "Burkitt myc",
    4,
    "A child has a jaw mass. Another patient with HIV has an abdominal mass. Both are starry-sky lymphomas with a myc translocation to an immunoglobulin locus. A student says myc is a tumor suppressor and that the starry sky is caseous necrosis.",
    "What does myc do, and what is the starry sky?",
    [
        "Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages eating apoptotic debris in a fast tumor",
        "Myc repairs DNA and loss of one copy causes the tumor",
        "The starry sky is caseation from tuberculosis",
        "The translocation is t(9;22)",
        "Burkitt lymphoma is indolent",
    ],
    "Myc is a transcription-factor oncogene driving proliferation; the stars are tingible-body macrophages eating apoptotic debris in a fast tumor",
    "Myc next to an immunoglobulin promoter is a powerful proliferation signal. The tumor doubles fast, many cells apoptose, and macrophages full of debris make the starry sky. It is an oncogene, not a suppressor. Caseation is granulomatous necrosis, not this high-power look. t(9;22) is CML. Burkitt is aggressive, not indolent.",
)

M(
    "APC and colon cancer",
    4,
    "A family has hundreds of colonic polyps starting in adolescence and colon cancers early. A different patient has a single cancer in the right colon, mucinous, with microsatellite instability and a strong family history but only a few polyps. A student says both are APC and both start with a mismatch-repair mutation.",
    "Which gene starts the polyposis, and which is the mismatch repair?",
    [
        "APC starts the adenoma-carcinoma sequence of FAP; Lynch syndrome is mismatch-repair failure, few polyps, and right-sided mucinous cancers",
        "Both are APC",
        "Lynch syndrome produces thousands of polyps",
        "Mismatch repair is the first hit of every sporadic polyp",
        "FAP cancers are usually in the rectum only after age 80",
    ],
    "APC starts the adenoma-carcinoma sequence of FAP; Lynch syndrome is mismatch-repair failure, few polyps, and right-sided mucinous cancers",
    "FAP is germline APC. Hundreds of adenomas form, and cancer is nearly certain without colectomy, often by middle age. Lynch syndrome is MLH1, MSH2, and related mismatch-repair genes. Polyps are few, cancers are often right-sided and mucinous, with microsatellite instability, and other organs such as endometrium are at risk. They are not the same gene. Lynch is not a carpet of polyps. Most sporadic polyps still begin with APC, not mismatch repair. FAP does not wait until age 80.",
)

M(
    "Free radicals reperfusion",
    4,
    "A heart is reperfused after an occlusion. Injury worsens for a period, with contraction bands and a burst of reactive oxygen. A student says reperfusion is always purely helpful and that neutrophils and oxygen cannot injure tissue that was ischemic.",
    "What is generated when oxygen returns?",
    [
        "Reactive oxygen species from mitochondria and from neutrophils, plus calcium influx, add injury on top of the ischemia",
        "Reperfusion prevents all membrane damage",
        "Contraction bands mean the myocytes were never ischemic",
        "Oxygen return lowers intracellular calcium",
        "Free radicals are scavenged completely by a minute of ischemia",
    ],
    "Reactive oxygen species from mitochondria and from neutrophils, plus calcium influx, add injury on top of the ischemia",
    "Reperfusion saves tissue and also injures it. Oxygen meets a damaged electron transport chain and makes superoxide. Neutrophils arrive and add more radicals. Calcium pours in through a leaky membrane and hypercontracts the sarcomeres into contraction bands. It is not purely benign. Contraction bands are a reperfusion finding in cells that were ischemic. Calcium rises, it does not fall. A period of ischemia depletes antioxidant capacity; radicals are not instantly cleared.",
)

M(
    "Apoptosis versus necrosis",
    4,
    "A pathologist compares two livers. One has cells shrinking, with intact membranes, apoptotic bodies, and no neutrophil rush. The other has swollen cells, ruptured membranes, and a neutrophilic infiltrate. A student says both are always pathologic and both spill enzymes the same way.",
    "Which process keeps the membrane intact?",
    [
        "Apoptosis is ATP-dependent cell death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames",
        "Necrosis is programmed and noninflammatory",
        "Apoptosis always means a pathologic injury and never a developmental event",
        "Both spill the same cytosolic enzymes because both rupture",
        "Neutrophils define apoptosis",
    ],
    "Apoptosis is ATP-dependent cell death with an intact membrane and no inflammation; necrosis ruptures the membrane and inflames",
    "Apoptosis packages the cell for phagocytosis. The membrane stays intact, so contents do not pour out and neutrophils are not called. It can be physiologic, as in development. Necrosis is messy ATP-failure death: swelling, rupture, enzyme leak, and inflammation. Necrosis is not the programmed noninflammatory path. Apoptosis is not always disease. Enzyme spill into blood is the necrotic pattern. Neutrophils mark necrosis.",
)

M(
    "Caseous versus coagulative",
    4,
    "A lung has a cheese-like granuloma with no tissue outline left in the center. A heart one day after an infarct has dead myocytes that still show their outlines and no nuclei. A student says both are liquefactive because both are dead, and that the heart lesion is caseous.",
    "Which necrosis keeps the architecture for a while, and which is granulomatous?",
    [
        "Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis wipes the outline inside a granuloma",
        "The heart undergoes liquefactive necrosis like the brain",
        "Caseous necrosis is the enzyme-rich pattern of pancreatitis",
        "Coagulative necrosis is full of neutrophils on day one as its definition",
        "Architecture is lost first in a myocardial infarct",
    ],
    "Coagulative necrosis of the heart keeps the outline; caseous necrosis of tuberculosis wipes the outline inside a granuloma",
    "Ischemia denatures enzymes and structural proteins together, so the heart keeps a ghost outline (coagulative) until macrophages arrive. The brain, rich in enzymes and poor in scaffolding, liquefies. Tuberculosis makes caseous necrosis, amorphous debris inside granulomas. Pancreatitis is fat necrosis and enzymatic liquefaction. Day-one infarcts are coagulative with few neutrophils; neutrophils come later. The outline is preserved early in the heart, which is the point.",
)

M(
    "Granuloma",
    4,
    "A node shows epithelioid macrophages, giant cells, and a cuff of lymphocytes around a necrotic center. A student says this pattern is acute bacterial pneumonia, and that CD4 T cells and interferon-gamma are irrelevant to macrophage activation.",
    "What cell type defines the granuloma, and what activates it?",
    [
        "Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma; this is delayed hypersensitivity, not a neutrophil pneumonia",
        "Neutrophils are the epithelioid cell",
        "Granulomas are type I hypersensitivity",
        "Interferon-gamma turns macrophages off",
        "Caseation means an acute pyogenic abscess",
    ],
    "Epithelioid macrophages activated by Th1 CD4 cells through interferon-gamma; this is delayed hypersensitivity, not a neutrophil pneumonia",
    "A granuloma is organized macrophages that look epithelial, often fused into giant cells, walled by lymphocytes. Th1 cells secrete interferon-gamma to activate them. It is type IV immunity to persistent antigen, such as tuberculosis. Neutrophils make abscesses and pneumonia, not epithelioid clusters. Type I is IgE. Interferon-gamma activates, it does not suppress, the macrophage. Caseation is the necrotic center of a granuloma, not pus.",
)

M(
    "Sarcoidosis",
    4,
    "A young African-American woman has shortness of breath, bilateral hilar lymphadenopathy, a high ACE, and hypercalcemia. The biopsy is noncaseating granulomas. A student starts four-drug tuberculosis therapy because any granuloma is tuberculosis, and says calcium is low.",
    "Why is calcium high, and what is missing in the granuloma compared with TB?",
    [
        "Macrophages make 1,25-vitamin D, so calcium rises; the granulomas do not caseate, unlike the classic tuberculous ones",
        "Calcium is low because vitamin D is consumed",
        "Caseation is required for sarcoidosis",
        "Hilar nodes in sarcoid are unilateral with a cavity",
        "ACE is low",
    ],
    "Macrophages make 1,25-vitamin D, so calcium rises; the granulomas do not caseate, unlike the classic tuberculous ones",
    "Sarcoid granulomas express 1-alpha hydroxylase, make active vitamin D, and raise calcium and the risk of stones. They are noncaseating. Tuberculosis classically caseates and does not give this vitamin D picture as its lead. Calcium is high, not low. Caseation argues against sarcoid. The classic film is bilateral hilar adenopathy, not a unilateral cavity. ACE is often high.",
)

M(
    "Paraneoplastic ACTH and PTH",
    5,
    "A smoker has a central lung mass, profound weakness, and a very high cortisol that does not suppress with high-dose dexamethasone. ACTH is high. Another smoker has a peripheral lung mass, high calcium, low PTH, and no bone metastases on the scan. A student says both secrete PTH and both will suppress with high-dose steroid.",
    "Which tumor secretes what?",
    [
        "Small-cell carcinoma secretes ACTH; squamous carcinoma secretes PTHrP, which suppresses real PTH",
        "Both secrete PTH",
        "Squamous carcinoma secretes ACTH and suppresses with dexamethasone",
        "High-dose dexamethasone suppresses ectopic ACTH",
        "PTHrP raises PTH on the assay",
    ],
    "Small-cell carcinoma secretes ACTH; squamous carcinoma secretes PTHrP, which suppresses real PTH",
    "Small-cell lung cancer is central and neuroendocrine and makes ACTH. Ectopic ACTH usually does not suppress with high-dose dexamethasone, unlike a pituitary adenoma. Squamous cancer is often peripheral or central and makes PTHrP, which acts like PTH but is not detected as PTH, so the PTH assay is low and calcium is high without bone metastases. They are not the same peptide. Squamous cancer is the calcium tumor, not the ACTH one. Ectopic ACTH resists high-dose suppression. PTHrP does not raise the PTH assay.",
)

M(
    "Cachexia TNF",
    4,
    "A man with metastatic cancer loses fat and muscle despite a feeding plan. He is not simply starving in a way that the body can adapt by lowering metabolic rate. A student says the loss is only reduced intake, and that TNF lowers metabolic rate.",
    "What cytokine drives this, and how is it different from starvation?",
    [
        "TNF and related cytokines raise metabolic rate and waste both fat and muscle; starvation preferentially uses fat and lowers the metabolic rate",
        "Starvation and cachexia are identical metabolically",
        "TNF increases appetite",
        "Muscle is spared in cachexia",
        "Feeding fully reverses cytokine cachexia the way it reverses pure starvation",
    ],
    "TNF and related cytokines raise metabolic rate and waste both fat and muscle; starvation preferentially uses fat and lowers the metabolic rate",
    "Cancer cachexia is inflammatory. TNF (cachectin), IL-1, and IL-6 raise resting energy expenditure and break down muscle as well as fat. Simple starvation lowers the metabolic rate and prefers fat while sparing protein longer. The patterns are not identical. TNF suppresses appetite and still wastes tissue beyond intake. Muscle is not spared. Calories help starvation more completely than they reverse a cytokine-driven cachexia.",
)

M(
    "Xeroderma and mismatch",
    4,
    "A child burns severely in little sun and has many skin cancers. Nucleotide excision repair of thymine dimers is broken. Another family has colon cancers and a broken mismatch-repair gene. A student says both cannot repair double-strand breaks, the BRCA job, and that thymine dimers are a mismatch problem.",
    "Which repair fits the sun?",
    [
        "Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not the sun disease",
        "Mismatch repair is the xeroderma pigmentosum pathway",
        "BRCA1 repairs thymine dimers",
        "Ultraviolet light causes double-strand breaks as its main lesion",
        "Lynch syndrome is extreme sun sensitivity",
    ],
    "Nucleotide excision repair removes ultraviolet dimers; mismatch repair fixes replication errors and is Lynch syndrome, not the sun disease",
    "Ultraviolet light fuses adjacent pyrimidines. Nucleotide excision repair cuts out the dimer; that pathway is xeroderma pigmentosum, with skin cancers. Mismatch repair fixes base-base errors after replication; germline loss is Lynch syndrome and microsatellite cancers, not photosensitivity. BRCA proteins help repair double-strand breaks. Dimers are bulky adducts, not the classic double-strand break. Lynch patients are not the children who burn in minutes.",
)

M(
    "Ataxia telangiectasia",
    4,
    "A child has unsteady gait, dilated vessels on the eyes, low immunoglobulins, and a high AFP. Radiation for a different indication would be dangerous. A student calls it Friedreich ataxia because of the gait, and says DNA repair is intact.",
    "What is not repaired, and why the vessels and the AFP?",
    [
        "ATM kinase, which answers double-strand breaks, is missing; telangiectasias, immunodeficiency, and a high AFP come with the cerebellar ataxia",
        "Frataxin is missing, so AFP is high and telangiectasias are required",
        "The disease is pure motor and DNA repair is normal",
        "Immunoglobulins are high",
        "Radiation is the safest imaging because the cells repair breaks well",
    ],
    "ATM kinase, which answers double-strand breaks, is missing; telangiectasias, immunodeficiency, and a high AFP come with the cerebellar ataxia",
    "Ataxia-telangiectasia is ATM. Double-strand breaks are not signaled, so radiation and radiomimetic drugs are dangerous, IgA is often low, sinopulmonary infections occur, AFP is high, and the cerebellum fails. Friedreich ataxia is frataxin, dorsal columns, and cardiomyopathy, without telangiectasias or a high AFP. Repair is not intact. Immunoglobulins are low, not high. Radiation is exactly what these cells handle badly.",
)

M(
    "Embolus types",
    4,
    "Patient A has a long-bone fracture and a petechial rash and confusion a day later. Patient B has calf swelling and then sudden chest pain and a clear chest film. Patient C, after delivery, has sudden dyspnea and seizures. A student says all three are thrombotic pulmonary emboli and all have wedge infarcts on the film.",
    "Which one is fat, and which is amniotic?",
    [
        "A is fat embolism with the rash and neurologic change; C is amniotic-fluid embolism with a consumptive picture around delivery; B is the thrombus",
        "All three are thrombus because all cause dyspnea",
        "Fat embolism is a cholesterol crystal from an atherosclerotic plaque",
        "Amniotic embolism is a clot from the calf",
        "The chest film is always abnormal in pulmonary thromboembolism",
    ],
    "A is fat embolism with the rash and neurologic change; C is amniotic-fluid embolism with a consumptive picture around delivery; B is the thrombus",
    "Fat embolism after a long-bone fracture sends marrow fat to the lung and brain and causes a petechial rash. Amniotic-fluid embolism is a peripartum catastrophe of sudden hypoxia, seizure or collapse, and often DIC. Venous thrombus from the leg is the classic pulmonary embolus, and the film is often normal. Dyspnea does not make them the same. Atherosclerotic cholesterol emboli follow a procedure on an artery and infarct toes and kidneys, with eosinophils. Amniotic fluid is not a calf clot. A normal film does not exclude thromboembolism.",
)

M(
    "Shock organs",
    4,
    "After prolonged hypotension a pathologist sees a pale renal cortex and a congested medulla, patchy liver necrosis around central veins, and a bowel with hemorrhagic mucosa. The brain shows watershed injury. A student says the liver dies first around the portal tract because that is farthest from blood.",
    "Which liver zone, and why the kidney cortex?",
    [
        "Zone 3 around the central vein is last in the liver's oxygen gradient; the renal cortex is also relatively under-supplied when pressure falls",
        "Zone 1 around the portal tract is the most ischemic",
        "The renal medulla is the first and only renal injury",
        "The bowel is spared in shock because it has a dual blood supply that never fails",
        "Watershed brain injury means the brainstem only",
    ],
    "Zone 3 around the central vein is last in the liver's oxygen gradient; the renal cortex is also relatively under-supplied when pressure falls",
    "Hepatic blood runs from portal tract to central vein, so zone 3 is the least oxygenated and necroses in shock. The renal cortex, with its filtration demand, shows pale cortical necrosis or tubular injury when pressure falls; the medulla is congested. Zone 1 is best oxygenated. The medulla is vulnerable to some injuries but the classic shock kidney description is cortical pallor. The gut mucosa is a shock target, not a protected dual-supply organ in this setting. Watershed injury is the cortical border zones, not the brainstem alone.",
)
