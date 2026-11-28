# Batch 3. Sex development (27.3), more bone (6.4), and more neural steps (12.3).

add(
    domain="reproductive-endocrine", subject="embryology", topic="sry-directs-testis",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="Without SRY, an embryo develops as female. SRY on the Y chromosome recruits genes for testis development and suppresses female development. Bipotential gonads can become either ovary or testis.",
    forbid=["sry", "y chromosome"],
    vignette=(
        "A 30-year-old couple reviews an embryo at six weeks. Temperature is 36.6°C, pulse is 74/min, "
        "respirations are 14/min, and blood pressure is 118/72 mm Hg. The gonads can still become either ovary "
        "or testis. A single gene on one sex chromosome must act or the embryo follows the female path."
    ),
    stem="Which of the following happens if that gene does not act?",
    options=[
        "The gonads follow the female path",
        "The gonads become testes by default",
        "The Wolffian duct grows without any hormone",
        "Leydig cells secrete testosterone at once",
        "The glans becomes a penis without testosterone",
    ],
    key=0,
    whys=[
        "Without a functional SRY gene on the Y chromosome, the bipotential gonad follows the female path, with oogonia and primordial follicles. Testes require the SRY cascade.",
        "Testes are not the default. They require SRY.",
        "The Wolffian duct needs testosterone to grow. Without the male cascade it degrades.",
        "Leydig cells secrete testosterone after the testis has formed, which requires SRY.",
        "The same cells become the glans penis only with testosterone. Without it they become the clitoris.",
    ],
)

add(
    domain="reproductive-endocrine", subject="embryology", topic="testosterone-wolffian",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="Testosterone from Leydig cells grows the Wolffian duct into the male tract. Without testosterone the Wolffian duct degrades. Sustentacular-cell secretions degrade the Mullerian duct in males. Without those secretions the Mullerian duct develops.",
    forbid=["wolffian", "mullerian"],
    vignette=(
        "A male embryo has testes. Temperature is not measured. Cells in the testis secrete testosterone, and "
        "a second secretion from supporting cells removes the duct that would have formed a uterus and tubes. "
        "The other duct, which will form the epididymis and ductus deferens, keeps growing."
    ),
    stem="Which of the following keeps that second duct growing?",
    options=[
        "Androgen from the cells in the newly formed gonad",
        "Absence of every secretion, the female default",
        "A gene that is present only on two X chromosomes",
        "Follicle-stimulating hormone from a newborn pituitary",
        "Progesterone secreted by a yellowish body",
    ],
    key=0,
    whys=[
        "Testosterone from Leydig cells stimulates the Wolffian duct, which becomes the epididymis, ductus deferens, and seminal vesicles. Sustentacular secretions separately degrade the Mullerian duct. His embryo has both of those male signals.",
        "Without testosterone the Wolffian duct degrades, and without sustentacular secretion the Mullerian duct develops. That is the female pattern, not this growing male duct.",
        "XX embryos lack SRY and follow the female path. They do not grow the Wolffian duct.",
        "FSH rises as puberty approaches, years later. It is not the embryonic signal for the Wolffian duct.",
        "Progesterone is the corpus luteum's hormone in an adult cycle, not the embryonic duct signal.",
    ],
)

add(
    domain="reproductive-endocrine", subject="embryology", topic="glans-bipotential",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="With testosterone, bipotential cells form the glans penis. Without testosterone the same cells form the clitoris.",
    forbid=["clitoris", "glans"],
    vignette=(
        "An embryo's external genitals can still follow either path. Temperature is not measured. The same "
        "group of cells will form one structure if testosterone is present and a different structure if it is "
        "absent. Internal ducts are a separate decision."
    ),
    stem="Which of the following forms if testosterone is absent?",
    options=[
        "What those cells become when androgen is absent",
        "The glans penis, treated as the default form",
        "The epididymis, from the duct that needs androgen",
        "The testes, which form with no gene on the Y",
        "A uterus, which comes from that same external bud",
    ],
    key=0,
    whys=[
        "The bipotential cells become the glans penis with testosterone and the clitoris without it. Absence of testosterone yields the clitoris.",
        "The glans penis requires testosterone. It is not the default.",
        "The epididymis comes from the Wolffian duct, which also needs testosterone, but it is not this external bud.",
        "Testes require SRY. They are not the no-androgen default of this external tissue.",
        "The uterus develops from the Mullerian duct, an internal duct, not from the external glans cells.",
    ],
)

add(
    domain="reproductive-endocrine", subject="embryology", topic="primordial-gonads-one-month",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="Primordial gonads begin to develop about one month after conception. Little reproductive change occurs between infancy and puberty.",
    forbid=["one month", "infancy"],
    vignette=(
        "A pregnancy is four weeks along. Temperature of the mother is 36.6°C, pulse is 80/min, respirations "
        "are 16/min, and blood pressure is 110/68 mm Hg. The early gonads are just beginning to form. After "
        "birth, this system changes little until the years just before sexual maturity."
    ),
    stem="Which of the following is the quiet interval?",
    options=[
        "From infancy until the years just before reproductive maturity",
        "The first month after conception, when the gonads start",
        "The midcycle gonadotropin burst that expels an oocyte",
        "Childbirth, when oxytocin release keeps rising",
        "The week after ovulation, when progesterone is high",
    ],
    key=0,
    whys=[
        "Primordial gonads start about one month after conception. Between infancy and puberty there is little change in the reproductive system. The vignette names that quiet interval.",
        "The first month is when the gonads begin, not the long quiet interval.",
        "The LH surge is an adult ovarian-cycle event.",
        "Oxytocin in labor is positive feedback at delivery, not the childhood interval.",
        "The luteal progesterone peak is an adult cycle phase.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="puberty-feedback-less-sensitive",
    task="mechanism", difficulty=4, src="os-27-3", nutrition=False,
    fact="Before puberty, tiny amounts of sex steroid shut off GnRH, LH, and FSH. At puberty the hypothalamus and pituitary become less sensitive to that negative feedback, and the gonads become more sensitive to LH and FSH.",
    forbid=["sensitivity", "negative feedback"],
    vignette=(
        "A 9-year-old child is entering the start of sexual maturation. Temperature is 36.6°C, pulse is 80/min, "
        "respirations are 16/min, and blood pressure is 100/62 mm Hg. Before this, a very small amount of sex "
        "steroid was enough to shut off the brain signals. Now it takes a higher steroid level to shut them off, "
        "and the gonads respond more strongly to the pituitary signals."
    ),
    stem="Which of the following changed in the brain's control?",
    options=[
        "A higher steroid level is now required to turn the drive off",
        "A lower steroid level shuts the signals off more easily than before",
        "The gonads ignore pituitary signals more than they did in childhood",
        "Childbirth hormone release replaces the pituitary drive",
        "The growth plate seals and height gain stops at once",
    ],
    key=0,
    whys=[
        "At puberty the hypothalamus and pituitary become less sensitive to negative feedback, so larger sex-steroid concentrations are needed to suppress LH and FSH. The gonads also become more sensitive to those pituitary signals. This child is at that change.",
        "Higher sensitivity, with shutdown by very low steroids, is the prepubertal pattern.",
        "The gonads become more responsive to LH and FSH, not less.",
        "Oxytocin is the labor hormone. Puberty is driven by GnRH, LH, FSH, and gonadal steroids.",
        "Growth-plate closure ends height gain in early adulthood. It is not the brain change described.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="lh-night-before-puberty",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="LH first becomes detectable around age 8 or 9, mainly at night during sleep, several years before physical changes.",
    forbid=["night", "sleep"],
    vignette=(
        "An 8-year-old child has no breast development and no growth of the testes. Temperature is 36.6°C, "
        "pulse is 78/min, respirations are 16/min, and blood pressure is 98/60 mm Hg. A pituitary hormone is "
        "already detectable, mostly during sleep. Body changes will not show for several years."
    ),
    stem="Which of the following is already happening?",
    options=[
        "A glandular product can be measured mainly at night",
        "Cyclic monthly bleeding has already occurred",
        "Fertile ejaculations are already present by then",
        "The growth spurt of 4 inches a year is underway",
        "The growth lines in the long bones have all sealed",
    ],
    key=0,
    whys=[
        "LH becomes detectable around age 8 or 9, mainly at night during sleep, years before physical puberty. This child has no visible changes yet, which fits.",
        "The beginning of cyclic monthly bleeding follows breast development, hair, and the growth spurt. It has not occurred.",
        "The first fertile ejaculations are typically around age 15, with wide variation.",
        "The male growth spurt is near the end of puberty, about ages 11 to 13. This child has no physical signs yet.",
        "Open plates are expected in a growing child. Sealed lines mean growth in length has stopped.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="female-puberty-sequence",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="In females the first visible puberty change is breast development, then axillary and pubic hair. The growth spurt starts about age 9 to 11 and can add about 3 inches a year. The beginning of cyclic monthly bleeding comes after that.",
    forbid=["menarche", "breast"],
    vignette=(
        "A 10-year-old girl has new breast tissue and is growing about 3 inches a year. Temperature is 36.6°C, "
        "pulse is 82/min, respirations are 16/min, and blood pressure is 102/64 mm Hg. Axillary and pubic hair "
        "are starting. She has not yet had a first menstrual period."
    ),
    stem="Which of the following comes next in the usual sequence?",
    options=[
        "Monthly bleeding starts after the growth spurt has begun",
        "Growth of the testes, as the first physical sign",
        "Deepening of the voice from growth of the larynx",
        "A nocturnal hormone with no later body changes at all",
        "Sealing of every growth plate in a long bone before any height gain",
    ],
    key=0,
    whys=[
        "The usual female order is breast development, then axillary and pubic hair, a growth spurt from about age 9 to 11 of about 3 inches a year, and then menarche. She has the earlier steps and has not menstruated yet.",
        "Testicular growth is the typical first physical sign in males.",
        "Laryngeal growth and a lower voice are male secondary characteristics driven by testosterone.",
        "Nighttime LH starts years earlier and is followed by body changes. It is not the next step now.",
        "Height is increasing. Plate closure would stop that gain.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="male-puberty-sequence",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="In males the first physical sign is testicular growth, then scrotal and penile growth, then hair. The larynx enlarges and the voice drops. Fertile ejaculations are typically around age 15. The growth spurt is later, about ages 11 to 13, up to about 4 inches a year, and can continue into the early 20s.",
    forbid=["testes", "larynx"],
    vignette=(
        "A 13-year-old boy has enlarging testes, a larger scrotum, and new facial and pubic hair. Temperature "
        "is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. His voice is "
        "dropping. His fastest height gain is happening now, later than the typical girl of the same age."
    ),
    stem="Which of the following was the first physical sign in this sequence?",
    options=[
        "Enlargement of the male gonads, before the voice drops",
        "Breast development, as in the female sequence",
        "The beginning of cyclic monthly bleeding",
        "A growth spurt at age 9, before any genital change",
        "Fertile ejaculations during early infancy",
    ],
    key=0,
    whys=[
        "In males the first physical sign is growth of the testes, followed by scrotum and penis, then hair, then laryngeal growth with a lower voice. The growth spurt is later, about ages 11 to 13. His sequence started with the testes.",
        "Breast development is the typical first visible change in females.",
        "The beginning of cyclic monthly bleeding is part of female puberty.",
        "The female growth spurt starts about ages 9 to 11. The male spurt is toward the end of puberty.",
        "Fertile ejaculations typically appear around age 15, not in infancy.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="leptin-menarche-fat",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=True,
    fact="Body fat and leptin from adipose cells are linked to menarche. Very lean, highly active girls such as gymnasts often have delayed puberty. Average menarche fell from about 17 years in 1860 to about 12.75 years by 1960 and remains there.",
    forbid=["leptin", "gymnast"],
    vignette=(
        "A 15-year-old girl who trains as a gymnast has very little body fat and has not had a first menstrual "
        "period. Temperature is 36.5°C, pulse is 54/min, respirations are 12/min, and blood pressure is 98/60 mm Hg. "
        "A hormone from her fat cells is low. The same delay is described in other extremely lean, active girls."
    ),
    stem="Which of the following is the likely reason maturation is delayed?",
    options=[
        "Very low body fat and a low signal from fat cells",
        "Excess fat, which always delays the first period",
        "A sealed growth plate, which stops every hormone",
        "Nighttime hormone release, which prevents puberty",
        "Absence of a Y chromosome, which blocks ovaries",
    ],
    key=0,
    whys=[
        "Leptin from adipose cells and the amount of stored fat are linked to menarche. Extremely lean, highly active girls often have delayed puberty. She is a lean gymnast who has not menstruated.",
        "The section links low fat, not excess fat, to delay. Better nutrition historically moved average menarche earlier, from about 17 years in 1860 to about 12.75 years.",
        "Growth-plate closure ends height gain. It does not explain a missing first period in a lean athlete.",
        "Nighttime LH is the normal early signal of puberty, not a block.",
        "Absence of a Y chromosome is the ordinary female path. It does not delay menarche.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="secondary-sex-characteristics",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="Female secondary characteristics include fat at breasts and hips, breast development, a broader pelvis, and axillary and pubic hair. Male characteristics include a larger larynx and deeper voice, more muscle, and facial, axillary, and pubic hair.",
    forbid=["pelvis", "voice"],
    vignette=(
        "A 14-year-old girl has a wider pelvis, more fat at the hips and breasts, and new axillary and pubic "
        "hair. Temperature is 36.6°C, pulse is 78/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. "
        "These changes support reproduction but are not the gonads themselves."
    ),
    stem="Which of the following are these changes?",
    options=[
        "Traits with a supporting role, apart from ovary or testis",
        "The early gonad becoming a male gonad instead",
        "The embryonic duct that becomes the epididymis",
        "The primary ossification center of the femur",
        "The hormone that rises during childbirth",
    ],
    key=0,
    whys=[
        "Secondary sexual characteristics are physical changes with auxiliary roles in reproduction. In females they include breast and hip fat, breast development, a broader pelvis, and axillary and pubic hair. She has those, distinct from the ovary itself.",
        "The bipotential gonad becomes a testis only with SRY. She is describing body-shape changes.",
        "The epididymis is a Wolffian-duct derivative, not these external changes.",
        "The primary ossification center is fetal bone formation.",
        "Oxytocin drives labor contractions. It is not this set of puberty changes.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="ossification-begins-week-six",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="The embryonic skeleton starts as fibrous membranes and hyaline cartilage. Ossification begins by the sixth or seventh week.",
    forbid=["sixth", "seventh"],
    vignette=(
        "An embryo at seven weeks is forming bone. Temperature is not measured. Until now the skeleton was "
        "membranes and cartilage. Mineralized bone is just starting to replace those models."
    ),
    stem="Which of the following has just started?",
    options=[
        "Replacement of membrane and the cartilage model by bone",
        "Sealing of every growth plate in a long bone",
        "The adult remodeling rate of a few percent a year",
        "The beginning of cyclic monthly bleeding",
        "A positive pregnancy test from a corpus luteum",
    ],
    key=0,
    whys=[
        "Ossification begins by the sixth or seventh week, replacing the fibrous membranes and hyaline cartilage of the early skeleton. This embryo is at that start.",
        "Growth plates close in early adulthood, not at seven weeks.",
        "Five to ten percent yearly remodeling is an adult process.",
        "The beginning of cyclic monthly bleeding is a puberty event.",
        "The yellowish body left after ovulation supports early pregnancy. It is not the start of ossification.",
    ],
)

add(
    domain="msk-skin", subject="histology", topic="cartilage-matrix-ingredients",
    task="histology", difficulty=2, src="os-6-4", nutrition=False,
    fact="The cartilage model matrix is made by chondroblasts and contains hyaluronic acid, chondroitin sulfate, collagen, and water. Isolated chondroblasts are called chondrocytes.",
    forbid=["chondroitin", "hyaluronic"],
    vignette=(
        "A fetal bone model is still cartilage. Temperature is not measured. The cells secrete a semi-solid "
        "matrix of water, a sugar acid, a sulfated sugar, and a strong fiber protein. Once the matrix walls a "
        "cell off, the cell's name changes."
    ),
    stem="Which of the following is in that matrix besides water and the fiber protein?",
    options=[
        "A sugar acid together with a sulfated chain",
        "The lung lining secreted by alveolar cells",
        "Bile salts, which emulsify dietary fat",
        "Cyclic AMP used as if it were a structural fiber",
        "The strong acid secreted in the stomach",
    ],
    key=0,
    whys=[
        "Chondroblasts produce a matrix of hyaluronic acid, chondroitin sulfate, collagen, and water. Walled-off cells are chondrocytes. The sugar acid and sulfated sugar are the non-collagen, non-water parts named here.",
        "Surfactant is a lung product, not cartilage matrix.",
        "Bile salts emulsify fat. They are not in the cartilage model.",
        "Cyclic AMP is a second messenger, not a structural matrix fiber.",
        "Gastric acid is not a component of the cartilage model.",
    ],
)

add(
    domain="msk-skin", subject="anatomy", topic="skull-sutures-open-at-birth",
    task="anatomy", difficulty=2, src="os-6-4", nutrition=False,
    fact="At birth the skull and clavicles are not fully ossified and the sutures are not closed, so the head and shoulders can deform in the birth canal. Facial bones are the last to finish intramembranous ossification, at the end of the adolescent growth spurt.",
    forbid=["suture", "birth canal"],
    vignette=(
        "A newborn's skull bones are not fused. Temperature is 36.8°C, pulse is 140/min, respirations are "
        "40/min. The gaps let the head change shape during delivery. The flat bones of the face will not reach "
        "adult size until the end of the adolescent growth spurt."
    ),
    stem="Which of the following is the reason the skull bones are unfused?",
    options=[
        "So the head can mold while the baby is being born",
        "Because cartilage never forms in the skull",
        "Because the growth plates of the face have sealed",
        "Because remodeling has already stopped",
        "Because the clavicles form by replacing cartilage",
    ],
    key=0,
    whys=[
        "At birth the skull and clavicles are not fully ossified and the sutures are open so the head and shoulders can deform in the birth canal. Facial bones finish later, at the end of the adolescent growth spurt.",
        "Most cranial bones do form from membrane, but the open sutures are specifically for passage through the birth canal, not because cartilage is impossible. The skull base uses cartilage.",
        "Sealed plates would mean growth is finished. The face is still far from adult size.",
        "Remodeling continues in adult life. It has not stopped.",
        "Clavicles form by intramembranous ossification, not by replacing a cartilage model.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="secondary-ossification-centers",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="After birth, secondary ossification centers form in the epiphyses. Cartilage remains as articular cartilage and as the epiphyseal plate.",
    forbid=["secondary", "epiphysis"],
    vignette=(
        "A 2-year-old child has bone forming in the ends of the femurs. Temperature is 36.6°C, pulse is "
        "100/min, respirations are 22/min, and blood pressure is 90/56 mm Hg. The shaft center formed before "
        "birth. Cartilage remains at the joint surface and in the plate between the end and the shaft."
    ),
    stem="Which of the following are the centers now forming in the ends?",
    options=[
        "The centers that appear in the bone ends after birth",
        "The first shaft center, which appears before birth",
        "The facial bones forming directly from embryonic tissue",
        "The sealed line left after lengthwise growth stops",
        "The marrow cavity, which is not a center of bone formation",
    ],
    key=0,
    whys=[
        "Secondary ossification centers develop in the epiphyses after birth. The primary center is in the shaft before birth. Cartilage remains as articular cartilage and the growth plate. This child has the later centers.",
        "The primary center is the earlier shaft center, deep to the periosteal collar.",
        "Facial bones use intramembranous ossification. They are not the end-of-femur centers.",
        "The epiphyseal line is what remains after the plate closes, later.",
        "The medullary cavity is a space, not an ossification center.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="hypertrophy-zone",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="In the zone of maturation and hypertrophy, older and larger chondrocytes lie closer to the diaphysis. Length comes from proliferation plus this maturation. The calcified zone nearest the shaft has mostly dead chondrocytes.",
    forbid=["hypertrophy", "calcified"],
    vignette=(
        "A 11-year-old boy has an open growth plate. Temperature is 36.6°C, pulse is 84/min, respirations are "
        "16/min, and blood pressure is 104/64 mm Hg. Moving from the end toward the shaft, cartilage cells get "
        "older and larger. Nearest the shaft, most of those cells are dead because the matrix has hardened."
    ),
    stem="Which of the following zone has the older, larger cells?",
    options=[
        "The zone of enlargement just before the hardened layer",
        "The reserve layer that only anchors the plate",
        "The layer that has already become an epiphyseal line",
        "The outer membrane, where width is added",
        "The medullary cavity, which contains no cartilage cells",
    ],
    key=0,
    whys=[
        "The zone of maturation and hypertrophy holds older, larger chondrocytes closer to the diaphysis. The next zone, nearest the shaft, is calcified and its chondrocytes are mostly dead. His plate shows that gradient.",
        "The reserve zone secures the plate and its small cells do not drive growth.",
        "An epiphyseal line means the plate has closed. His plate is open.",
        "The periosteum adds width by appositional growth. It is not a zone of the plate.",
        "The medullary cavity has no columns of growth-plate chondrocytes.",
    ],
)

add(
    domain="msk-skin", subject="pathology", topic="oi-exercise-and-risk",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="For osteogenesis imperfecta there is no cure. Swimming is recommended because collisions and compression are less likely. Smoking and extra weight are especially risky. Bisphosphonates are under study.",
    forbid=["swimming", "smoking"],
    vignette=(
        "A 9-year-old girl with bones that break easily is choosing exercise. Temperature is 36.6°C, pulse is "
        "88/min, respirations are 18/min, and blood pressure is 100/62 mm Hg. Her matrix protein is defective. "
        "The safer exercise avoids collisions and compressive force. Extra body weight and smoking would add risk."
    ),
    stem="Which of the following exercise fits that advice?",
    options=[
        "Activity in water, where impacts and compression are less likely",
        "Collision sports, because the bones need impact to harden",
        "No activity at all, because every movement fractures bone",
        "Weight gain, because heavier bones do not break",
        "A cure that replaces the defective protein permanently",
    ],
    key=0,
    whys=[
        "Osteogenesis imperfecta has no known cure. Swimming is recommended because the body is less likely to meet collisions or compressive force. Smoking and extra weight are especially risky. She should choose the water exercise.",
        "Impact and collision raise fracture risk. They are not advised.",
        "Safe exercise is encouraged so she can stay mobile. Total avoidance is not the recommendation.",
        "Extra body weight adds stress on fragile bones.",
        "There is no known cure. Treatment limits fractures and supports mobility. Bisphosphonates are being studied, not established here as a cure.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="thermoreceptor-skin",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="Thermoreceptors in the skin change membrane voltage in proportion to temperature. That graded potential, if large enough, starts an action potential at the initial segment.",
    forbid=["thermoreceptor", "temperature"],
    vignette=(
        "A 21-year-old man tests bath water with his fingers. Pulse is 76/min, respirations are 14/min, and "
        "blood pressure is 118/72 mm Hg. Sensors in the skin change their membrane voltage according to how hot "
        "the water is. A traveling signal starts only if that local change is large enough."
    ),
    stem="Which of the following sensors started the local voltage change?",
    options=[
        "Skin receptors whose local voltage matches how strong the stimulus is",
        "Muscle end plates, which release the first sensory chemical",
        "Descending motor cells that begin in the frontal lobe",
        "Sensors of solute concentration in the stomach wall",
        "Cartilage cells that are stacked in the growth plate",
    ],
    key=0,
    whys=[
        "Thermoreceptors in the skin produce a graded potential proportional to stimulus strength. If it reaches threshold, an action potential starts at the initial segment. His finger test began there.",
        "The end plate is where the lower motor neuron meets muscle, at the end of the motor path.",
        "Upper motor neurons send the command out after cortical integration.",
        "Gastric osmoreceptors sense luminal concentration, not bath water on the skin.",
        "The sensors here are thermoreceptors. The option that restates a different organ is not the source of this voltage.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="end-plate-then-muscle-potential",
    task="mechanism", difficulty=3, src="os-12-3", nutrition=False,
    fact="Acetylcholine at the neuromuscular junction causes an end-plate potential and then a muscle action potential, and the fiber contracts.",
    forbid=["end-plate", "end plate"],
    vignette=(
        "A 26-year-old woman contracts her biceps. Temperature is 36.6°C, pulse is 72/min, respirations are "
        "14/min, and blood pressure is 114/70 mm Hg. A chemical from the nerve produces a large potential at the "
        "muscle membrane under the nerve ending. A traveling potential then runs along the muscle fiber, and "
        "the fiber shortens."
    ),
    stem="Which of the following potential comes first at the muscle?",
    options=[
        "The large local voltage beneath the nerve terminal",
        "The traveling potential that shortens the fiber, with no prior spike",
        "A local voltage change inside a skin heat receptor",
        "The cortical command, as if recorded on the muscle",
        "A hormone second messenger made from ATP in the liver",
    ],
    key=0,
    whys=[
        "Acetylcholine produces an end-plate potential first. The muscle action potential follows, and the fiber contracts. Her biceps showed that order.",
        "The traveling muscle potential comes after the large local end-plate potential, not instead of it.",
        "A skin thermoreceptor is the sensory start, not the potential under the nerve ending on muscle.",
        "The cortical command is in the upper motor neuron. It is not a potential recorded as the first event on the muscle.",
        "Cyclic AMP is a hormone second messenger, not the neuromuscular potential.",
    ],
)

add(
    domain="behavioral-nervous", subject="anatomy", topic="sensory-axon-enters-cord",
    task="anatomy", difficulty=2, src="os-12-3", nutrition=False,
    fact="The peripheral sensory axon's process enters the spinal cord and synapses in the gray matter. From there the path continues toward the thalamus.",
    forbid=["spinal cord", "gray matter"],
    vignette=(
        "A 23-year-old man feels a pin on his finger. Temperature is 36.6°C, pulse is 74/min, respirations are "
        "14/min, and blood pressure is 116/72 mm Hg. The sensory fiber enters the cord and meets the next cell "
        "in the cord's gray matter. The path then continues upward."
    ),
    stem="Which of the following is the first meeting place inside the cord?",
    options=[
        "A contact in the cord's central gray, before the upward path",
        "The muscle, before any cord cell is involved",
        "The outer gray matter of the brain, with no cord stop",
        "The gallbladder, which releases stored bile",
        "The ovary, at the moment an oocyte is released",
    ],
    key=0,
    whys=[
        "The sensory axon enters the spinal cord and synapses on another neuron in the gray matter. The path then continues toward the thalamus and cortex. His pin sensation uses that first cord contact.",
        "The muscle is the end of the motor path, not the sensory entry.",
        "The cortex is where conscious perception begins, after the cord and the thalamus.",
        "Bile release is a digestive hormone effect, not a sensory synapse.",
        "Ovulation is ovarian. It is not the cord synapse.",
    ],
)

add(
    domain="behavioral-nervous", subject="anatomy", topic="cortex-outer-gray",
    task="anatomy", difficulty=2, src="os-12-3", nutrition=False,
    fact="The cerebral cortex is the outermost layer of gray matter, where conscious perception begins.",
    forbid=["outermost", "gray matter of the brain"],
    vignette=(
        "A 45-year-old woman becomes aware of a cold glass in her hand. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The signal has passed the deep "
        "relay. Awareness begins in the outer layer of gray matter of the brain."
    ),
    stem="Which of the following layer is required for that awareness?",
    options=[
        "The outer gray layer of the cerebral hemispheres",
        "The muscle membrane under the nerve ending",
        "The cartilage that remains in the growth plate",
        "The lining that releases the acid-stimulating hormone",
        "The yellowish body left after ovulation",
    ],
    key=0,
    whys=[
        "The cerebral cortex is the outermost gray matter of the brain, and conscious perception begins there after the thalamic relay. She becomes aware at that layer.",
        "The end plate is a motor ending on muscle.",
        "The growth plate lengthens bone. It does not perceive temperature.",
        "Gastrin-releasing mucosa is gastric. It is not the site of awareness.",
        "The yellowish body left after ovulation secretes progesterone. It is not sensory cortex.",
    ],
)
