# Batch 3. Hormone mechanisms from OpenStax 17.2.

add(
    domain="reproductive-endocrine", subject="physiology", topic="steroid-hormone-transport",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Steroid hormones are made from cholesterol, are not water soluble, and travel in blood bound to transport proteins. That binding extends their half-life. Cortisol's half-life is about 60 to 90 minutes. Epinephrine's is about one minute.",
    forbid=["steroid", "cholesterol"],
    vignette=(
        "A 34-year-old woman who teaches chemistry compares two circulating signals. Temperature is 36.6°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. One signal is made from "
        "cholesterol, does not dissolve in water, and rides on a carrier protein. The other is cleared in about "
        "a minute and is derived from an amino acid."
    ),
    stem="Which of the following is required for the cholesterol-derived signal to travel in blood?",
    options=[
        "A bound carrier, because this signal is not water-soluble",
        "A second messenger, because the signal cannot leave the cell",
        "A membrane receptor, because the signal cannot cross the bilayer",
        "A sodium-driven pump, the same path thyroid hormone uses",
        "No carrier, because the signal dissolves freely in plasma",
    ],
    key=0,
    whys=[
        "Steroid hormones come from cholesterol and are hydrophobic, so they travel bound to transport proteins. That binding also lengthens half-life. Cortisol lasts about 60 to 90 minutes, while epinephrine, an amino-acid hormone, lasts about a minute. Her water-insoluble signal is the steroid.",
        "A second messenger is how water-soluble hormones signal after binding a surface receptor. It is not how a steroid travels in blood.",
        "Steroids cross the membrane to intracellular receptors. A surface receptor is the water-soluble pattern.",
        "Thyroid hormone uses a carrier-mediated, energy- and sodium-dependent entry. Steroids diffuse through the bilayer.",
        "A steroid does not dissolve freely in plasma. It needs a transport protein.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="steroid-intracellular-receptor",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Steroid hormones diffuse through the membrane to intracellular receptors. Water-soluble amino-acid hormones, except thyroid hormone, bind surface receptors and use a second messenger.",
    forbid=["intracellular"],
    vignette=(
        "A 29-year-old man who studies cells applies a cholesterol-derived hormone to a target cell. Temperature "
        "is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. The hormone "
        "crosses the lipid bilayer without a surface receptor. A water-soluble hormone in the same dish stops "
        "at the outer face of the membrane."
    ),
    stem="Which of the following receptor does the cholesterol-derived hormone use?",
    options=[
        "A receptor inside the cell, after crossing the membrane",
        "A receptor on the outer face of the membrane",
        "A G protein that makes cyclic AMP at the surface",
        "A sodium-dependent carrier, the thyroid-hormone path",
        "No receptor, because the hormone acts only in plasma",
    ],
    key=0,
    whys=[
        "Steroid hormones diffuse through the bilayer and bind intracellular receptors. His cholesterol-derived hormone crossed without a surface receptor. The water-soluble hormone stopped at the outer face.",
        "Surface receptors are for water-soluble hormones that cannot cross the bilayer.",
        "Cyclic AMP is a second messenger for many water-soluble hormones after a surface receptor activates a G protein.",
        "Thyroid hormone, although from amino acids, crosses by a carrier that needs energy and sodium. Steroids diffuse.",
        "The hormone binds a receptor inside the cell. It does not act only in plasma.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="camp-second-messenger",
    task="mechanism", difficulty=3, src="os-17-2", nutrition=False,
    fact="Most water-soluble hormones use cAMP. The hormone binds a surface receptor, activates a G protein, which activates adenylyl cyclase, which makes cAMP from ATP. cAMP activates protein kinase. Glucagon, calcitonin, and TSH use this path.",
    forbid=["cyclic amp", "camp", "adenylyl"],
    vignette=(
        "A 41-year-old woman who teaches biology adds a water-soluble hormone to liver cells. Temperature is "
        "36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. The hormone binds "
        "the outer membrane, a G protein turns on, and an enzyme converts ATP into a small intracellular "
        "signal. That signal turns on a kinase. The hormone never enters the cell."
    ),
    stem="Which of the following is the small intracellular signal made from ATP?",
    options=[
        "The intracellular nucleotide produced from ATP",
        "The steroid that crossed the bilayer to bind inside the cell",
        "The calcium released by inositol triphosphate",
        "The transport protein that carries cortisol in plasma",
        "The hormone itself, now acting as its own second message",
    ],
    key=0,
    whys=[
        "In the common water-soluble path, a surface receptor activates a G protein, which activates adenylyl cyclase, which makes cyclic AMP from ATP. Cyclic AMP then activates protein kinase. Her hormone stayed outside and ATP was converted into the intracellular signal.",
        "A steroid would have entered the cell. This hormone did not.",
        "Inositol triphosphate releases calcium in the alternative pathway. The vignette specifies a signal made from ATP.",
        "Cortisol's carrier keeps a steroid in the blood. It is not made from ATP inside the cell.",
        "The hormone is the first messenger. The small signal made from ATP is the second messenger.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="ip3-calcium-messenger",
    task="mechanism", difficulty=4, src="os-17-2", nutrition=False,
    fact="Some water-soluble hormones use calcium. Phospholipase C splits a membrane phospholipid into DAG and IP3. DAG activates kinases. IP3 releases calcium from the smooth endoplasmic reticulum. Calcium can bind calmodulin.",
    forbid=["calmodulin", "inositol"],
    vignette=(
        "A 38-year-old man who studies signaling adds a water-soluble hormone that does not raise cyclic AMP. "
        "Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. "
        "A membrane enzyme splits a phospholipid into two pieces. One piece releases calcium from an internal "
        "store. The calcium then binds a small regulatory protein."
    ),
    stem="Which of the following released the calcium?",
    options=[
        "The split product that releases the stored cation",
        "Cyclic AMP produced directly from ATP",
        "A steroid diffusing to a receptor in the nucleus",
        "The carrier protein that holds cortisol in plasma",
        "Loss of surface receptors after prolonged exposure",
    ],
    key=0,
    whys=[
        "Phospholipase C splits a membrane phospholipid into DAG and IP3. IP3 releases calcium from stores such as the smooth endoplasmic reticulum, and calcium can bind calmodulin. His hormone did not raise cyclic AMP, and calcium came from an internal store.",
        "Cyclic AMP is the other second-messenger path. This hormone did not use it.",
        "A steroid would enter the cell. This hormone is water-soluble and acts through a membrane enzyme.",
        "Cortisol's carrier is for transport in blood, not for releasing intracellular calcium.",
        "Downregulation reduces receptor number when a hormone is chronically high. It does not release calcium.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="downregulation-receptors",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Chronically high hormone levels cause target cells to decrease receptor number, called downregulation. Chronically low levels cause upregulation, an increase in receptor number.",
    forbid=["downregulation", "upregulation"],
    vignette=(
        "A 45-year-old woman who has had a high level of one hormone for months now responds less to it. "
        "Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. "
        "Her target cells have fewer receptors for that hormone than they did before the level stayed high. "
        "The hormone is still present."
    ),
    stem="Which of the following did the target cells do?",
    options=[
        "They reduced the number of receptors for the abundant hormone",
        "They increased the number of receptors for the abundant hormone",
        "They switched the hormone from a surface receptor to a nuclear one",
        "They lengthened the hormone's half-life to 60 minutes",
        "They started a positive feedback loop that releases still more",
    ],
    key=0,
    whys=[
        "When a hormone stays high, target cells decrease receptor number so they respond less. That is downregulation. Her cells have fewer receptors after months of a high level, and the response has fallen.",
        "Increasing receptor number is upregulation, which happens when a hormone is chronically low, not high.",
        "Receptor location is set by whether the hormone is a steroid or water-soluble. A high level does not move the receptor from the surface to the nucleus.",
        "Half-life is a property of the hormone's chemistry and binding to carriers, not of receptor count.",
        "Positive feedback would increase release further. Her cells became less reactive.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="oxytocin-positive-feedback",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Oxytocin in labor is positive feedback. Contractions push the fetus, the cervix stretches, and the pituitary releases more oxytocin until birth, after which release falls.",
    forbid=["oxytocin", "positive feedback"],
    vignette=(
        "A 28-year-old woman in labor has contractions that keep getting stronger. Temperature is 37.0°C, pulse "
        "is 96/min, respirations are 20/min, and blood pressure is 128/76 mm Hg. Each contraction pushes the "
        "fetus down, the cervix stretches, and the pituitary releases more of the same hormone. After the baby "
        "is born, that release falls."
    ),
    stem="Which of the following kind of loop is this?",
    options=[
        "The response increases the signal until the birth is finished",
        "The response inhibits the signal once the level is adequate",
        "Target cells remove receptors because the hormone is high",
        "Two opposing hormones cancel each other at the liver",
        "A carrier protein simply prolongs the hormone's half-life",
    ],
    key=0,
    whys=[
        "Oxytocin release in labor is positive feedback. Contractions stretch the cervix, which causes more oxytocin, until birth, when release falls. Her contractions are strengthening through that loop.",
        "Inhibition once the level is adequate is negative feedback, the more common pattern, illustrated by glucocorticoids.",
        "Fewer receptors is downregulation. It would weaken the response, not strengthen the contractions.",
        "Insulin and glucagon are the opposing pair at the liver. They are not this labor loop.",
        "A transport protein lengthens steroid half-life. It does not make contractions escalate until birth.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="glucocorticoid-negative-feedback",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Negative feedback is the common pattern. Rising glucocorticoids cause the hypothalamus and pituitary to reduce the signals that tell the adrenal to secrete more.",
    forbid=["negative feedback", "glucocorticoid"],
    vignette=(
        "A 52-year-old man who keeps books has a rising adrenal hormone that affects metabolism. Temperature is "
        "36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 136/82 mm Hg. As the blood level "
        "rises, the hypothalamus and pituitary send less drive to the adrenal gland. Secretion then levels off "
        "inside a narrow range."
    ),
    stem="Which of the following is this control pattern?",
    options=[
        "A rising level turns off the drive for more secretion",
        "A rising level causes still more secretion until birth",
        "Target cells add receptors because the level is high",
        "Two hormones with the same effect multiply the response",
        "The hormone must bind a plasma carrier to be measured",
    ],
    key=0,
    whys=[
        "Negative feedback inhibits further secretion once the level is adequate. Rising glucocorticoids tell the hypothalamus and pituitary to reduce adrenal drive. His level rises and the upstream signals fall, keeping the hormone in a narrow range.",
        "Escalating secretion until an endpoint is positive feedback, as with oxytocin in labor.",
        "High levels cause fewer receptors, not more. More receptors happen when the hormone is chronically low.",
        "Two hormones amplifying one effect is synergism, such as FSH and estrogen for egg maturation.",
        "Carrier binding is how steroids travel. It is not the feedback that reduced adrenal drive.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="insulin-glucagon-antagonism",
    task="mechanism", difficulty=2, src="os-17-2", nutrition=False,
    fact="Antagonistic hormones oppose each other. Insulin increases liver storage of glucose as glycogen and lowers blood glucose. Glucagon breaks glycogen down and raises blood glucose.",
    forbid=["antagonistic", "glucagon"],
    vignette=(
        "A 40-year-old woman who teaches cooking has two pancreatic signals. Temperature is 36.6°C, pulse is "
        "72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. One signal makes the liver store "
        "glucose as glycogen and the blood glucose falls. The other breaks that store down and the blood glucose "
        "rises. She is fasting, and the second signal dominates."
    ),
    stem="Which of the following is the relationship of these two signals?",
    options=[
        "They push blood glucose in opposite directions",
        "Each one enables the other to act on the liver",
        "Together they produce a larger effect than either alone",
        "A high level of either one removes the other's receptors",
        "Both must bind intracellular receptors to be active",
    ],
    key=0,
    whys=[
        "Insulin and glucagon are antagonistic. Insulin stores glucose as glycogen and lowers blood glucose. Glucagon breaks glycogen down and raises it. She is fasting, so the raising signal dominates.",
        "One hormone enabling another is a permissive effect, as with thyroid hormone and some reproductive hormones.",
        "A combined larger effect is synergism. These two oppose each other.",
        "Receptor loss from a high level is downregulation of that hormone's own receptors, not this pair's relationship.",
        "Both are peptide hormones and use surface receptors. They do not need intracellular steroid receptors.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="fsh-estrogen-synergy",
    task="mechanism", difficulty=3, src="os-17-2", nutrition=False,
    fact="Synergism: FSH from the pituitary and estrogens from the ovary are both required for maturation of ova.",
    forbid=["synerg", "fsh"],
    vignette=(
        "A 24-year-old woman who is trying to conceive has follicles that do not mature. Temperature is 36.6°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. She has ovarian estrogen "
        "but almost none of the pituitary signal that must act with it. Egg cells do not finish maturing."
    ),
    stem="Which of the following is missing for the egg cells to mature?",
    options=[
        "The glandular partner estrogen needs for egg maturation",
        "Insulin, which would store glucose and replace estrogen",
        "A positive feedback loop of oxytocin on the uterus",
        "Downregulation of every estrogen receptor",
        "A plasma carrier that would shorten estrogen's half-life",
    ],
    key=0,
    whys=[
        "Maturation of ova requires both FSH from the pituitary and estrogen from the ovary. She has estrogen and lacks the pituitary partner, so the eggs do not mature.",
        "Insulin and glucagon regulate glucose. Insulin does not replace the pituitary signal for egg maturation.",
        "Oxytocin's positive feedback is labor, not follicular maturation.",
        "Downregulation would remove receptors. Her problem is a missing hormone, not excess receptor loss.",
        "A carrier lengthens steroid half-life. It does not replace the missing pituitary signal.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="thyroid-permissive-iodine",
    task="mechanism", difficulty=3, src="os-17-2", nutrition=True,
    fact="A permissive effect means one hormone allows another to act. Thyroid hormone is permissive for some reproductive hormones. Iodine deficiency can therefore impair reproductive development.",
    forbid=["permissive", "iodine"],
    vignette=(
        "A 15-year-old girl who eats no seafood or iodized salt has delayed reproductive development. Temperature "
        "is 36.4°C, pulse is 58/min, respirations are 12/min, and blood pressure is 100/64 mm Hg. The hormone "
        "that contains the missing dietary element is low. Reproductive hormones are present but do not act normally."
    ),
    stem="Which of the following best describes the missing hormone's role?",
    options=[
        "Those gonadal signals cannot act unless it is there",
        "It opposes estrogen the way glucagon opposes insulin",
        "It is the positive feedback signal of labor",
        "It travels free in plasma because it is a steroid",
        "It uses cyclic AMP even though it is thyroid hormone",
    ],
    key=0,
    whys=[
        "Thyroid hormone has a permissive relationship with some reproductive hormones: it must be present for them to act. Iodine is part of thyroid hormone, so a diet without iodine can impair reproductive development. She lacks that dietary element and reproductive hormones are present but ineffective.",
        "Opposition is antagonism, the insulin-glucagon pattern, not the thyroid relationship.",
        "Labor's escalating signal is oxytocin.",
        "Thyroid hormone is lipid-soluble but is not described as a steroid that travels free. Steroids use carriers.",
        "Thyroid hormone crosses by a carrier and is not the usual cyclic AMP surface-receptor hormone.",
    ],
)
