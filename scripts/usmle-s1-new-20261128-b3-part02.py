# Batch 3. Ovarian cycle from OpenStax 27.2.

add(
    domain="reproductive-endocrine", subject="physiology", topic="oogonia-arrest-meiosis",
    task="mechanism", difficulty=3, src="os-27-2", nutrition=False,
    fact="Oogonia form primary oocytes in the fetal ovary before birth and arrest in meiosis I until puberty. Counts fall from 1-2 million in an infant to about 400,000 at puberty to zero at menopause.",
    forbid=["meiosis", "oogonia"],
    vignette=(
        "A 16-year-old girl has just had her first menstrual period. Temperature is 36.6°C, pulse is 76/min, "
        "respirations are 14/min, and blood pressure is 110/68 mm Hg. The egg cells in her ovaries were formed "
        "before she was born and have been paused in the first division since then. They now begin to resume "
        "that division, one cycle at a time."
    ),
    stem="Which of the following is true of those paused cells?",
    options=[
        "They were made in fetal life and then held at the first meiotic stop",
        "They are made new from stem cells each month after puberty",
        "They finish both divisions before they leave the ovary",
        "They are haploid from the moment they are formed",
        "Their number rises from puberty until menopause",
    ],
    key=0,
    whys=[
        "Oogonia become primary oocytes in the fetal ovary and arrest in meiosis I until puberty. She has just reached menarche, and those cells were paused since before birth.",
        "New oocytes are not produced each month. The pool was set before birth.",
        "The secondary oocyte finishes meiosis II only if a sperm penetrates it, which is after ovulation.",
        "Primary oocytes are still diploid while paused in meiosis I. The ovum is a brief haploid stage at fertilization.",
        "The count falls, from about one to two million in infancy to about 400,000 at puberty and to zero by the end of menopause.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="lh-surge-ovulation",
    task="mechanism", difficulty=3, src="os-27-2", nutrition=False,
    fact="Very high estrogen from the dominant follicle switches to positive feedback and causes an LH surge. The surge resumes meiosis and triggers proteases that help the follicle wall rupture.",
    forbid=["surge", "luteinizing"],
    vignette=(
        "A 26-year-old woman is at midcycle. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, "
        "and blood pressure is 112/70 mm Hg. Estrogen from one follicle is so high that the pituitary releases a "
        "large burst of a gonadotropin. That burst restarts division in the egg cell and enzymes weaken the "
        "ovary wall so the egg is expelled."
    ),
    stem="Which of the following caused the burst of gonadotropin?",
    options=[
        "Extremely high estrogen switched the pituitary to release more",
        "Low estrogen removed negative feedback and the pituitary stopped",
        "Progesterone from the corpus luteum started a new follicle",
        "Falling FSH killed the dominant follicle before release",
        "Oxytocin released in labor because the cervix stretched",
    ],
    key=0,
    whys=[
        "Once only the dominant follicle remains, its very high estrogen switches the pituitary from negative feedback to a large release of LH and FSH. The LH surge restarts meiosis and activates proteases that help the wall rupture. She is at midcycle with that pattern.",
        "Moderate high estrogen reduces GnRH, LH, and FSH. Only the extreme level from the dominant follicle switches to more release.",
        "Progesterone from the corpus luteum keeps GnRH, LH, and FSH low so no new dominant follicle develops.",
        "A fall in FSH causes most tertiary follicles to die. The dominant follicle survives and then drives the surge.",
        "Oxytocin's feedback is labor, not ovulation.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="corpus-luteum-progesterone",
    task="mechanism", difficulty=2, src="os-27-2", nutrition=False,
    fact="After ovulation, LH luteinizes the remaining granulosa and theca cells into the corpus luteum, which secretes large amounts of progesterone. If no pregnancy in 10-12 days, it becomes the corpus albicans.",
    forbid=["progesterone", "luteum"],
    vignette=(
        "A 30-year-old woman is a week past ovulation and is not pregnant. Temperature is 36.7°C, pulse is "
        "74/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The collapsed follicle has become "
        "a yellowish body that secretes a steroid needed to maintain an early pregnancy. That body will stop "
        "secreting and degrade if pregnancy does not start within about 10 to 12 days."
    ),
    stem="Which of the following is the main steroid this body secretes?",
    options=[
        "The luteal product that keeps early gestation going",
        "The pituitary drive that made the follicle grow",
        "The estrogen that caused the midcycle gonadotropin burst",
        "Insulin, which stores glucose in the liver as glycogen",
        "Cortisol secreted by the adrenal cortex",
    ],
    key=0,
    whys=[
        "After ovulation, the remaining cells become the corpus luteum and secrete progesterone, which maintains early pregnancy. Without pregnancy in 10 to 12 days it stops and becomes the corpus albicans. She is a week past ovulation.",
        "FSH is the pituitary signal that grows follicles. The yellowish body is ovarian.",
        "The dominant follicle's estrogen drives the LH surge before ovulation. After ovulation the luteal cells mainly secrete progesterone.",
        "Insulin is a pancreatic peptide, not the luteal steroid.",
        "Cortisol is an adrenal steroid with a 60 to 90 minute half-life. It is not this ovarian product.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="dominant-follicle-fsh",
    task="mechanism", difficulty=3, src="os-27-2", nutrition=False,
    fact="Rising estrogen from growing follicles lowers FSH. Most tertiary follicles die from the FSH drop. One survives, the dominant follicle, favored by size, granulosa-cell number, and FSH receptors.",
    forbid=["dominant", "atresia"],
    vignette=(
        "A 25-year-old woman is early in the follicular phase. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 108/66 mm Hg. Several large follicles are making estrogen. "
        "The estrogen lowers a pituitary signal those follicles need. All but one of them die."
    ),
    stem="Which of the following lets one follicle survive that drop?",
    options=[
        "It has more cells and more receptors for the falling signal",
        "It switches to progesterone and ignores the pituitary",
        "It is a primordial follicle with one flat cell layer",
        "It has already become the whitish nonfunctional body",
        "It uses oxytocin instead of the falling signal",
    ],
    key=0,
    whys=[
        "High estrogen lowers FSH, and most tertiary follicles die because they need FSH. The survivor is larger, with more granulosa cells and more FSH receptors. She is in that selection step.",
        "Progesterone is the corpus luteum's product after ovulation, not the signal that saves one growing follicle.",
        "A primordial follicle has a single flat layer of granulosa cells and is resting. The follicles dying here are tertiary.",
        "The corpus albicans is the degraded corpus luteum, not a growing follicle.",
        "Oxytocin is the labor hormone. Follicle survival depends on FSH receptors.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="secondary-oocyte-meiosis-ii",
    task="mechanism", difficulty=3, src="os-27-2", nutrition=False,
    fact="The secondary oocyte completes meiosis II only if a sperm penetrates it, producing a haploid ovum that becomes a diploid zygote at fertilization. Polar bodies degrade.",
    forbid=["polar", "sperm"],
    vignette=(
        "A 27-year-old woman has just ovulated. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, "
        "and blood pressure is 112/68 mm Hg. The cell that left the ovary is still diploid and has not finished "
        "its second division. That division finishes only if a male gamete gets through its coverings."
    ),
    stem="Which of the following must happen before a haploid ovum forms?",
    options=[
        "A sperm cell has to cross the oocyte's outer coats",
        "The yellowish body must later degrade into a whitish body",
        "FSH must fall so that every tertiary follicle dies",
        "The cell must finish both divisions while still in the ovary",
        "Estrogen must stay low for the entire luteal phase",
    ],
    key=0,
    whys=[
        "Meiosis II of the secondary oocyte finishes only if a sperm penetrates it. The haploid ovum exists briefly and, at fertilization, becomes the diploid zygote. Her ovulated cell is still waiting for that.",
        "The corpus albicans forms if there is no pregnancy. It is not the step that finishes meiosis II.",
        "An FSH drop selects the dominant follicle earlier. It does not complete the second division.",
        "The first division resumes just before ovulation. The second finishes only after sperm entry.",
        "The luteal phase is dominated by progesterone, not by a requirement for low estrogen to make the ovum.",
    ],
)

add(
    domain="reproductive-endocrine", subject="anatomy", topic="ovary-cortex-medulla",
    task="anatomy", difficulty=2, src="os-27-2", nutrition=False,
    fact="The ovary has surface cuboidal epithelium, then tunica albuginea, then cortex with stroma and follicles, then medulla with vessels, lymph, and nerves.",
    forbid=["medulla", "cortex"],
    vignette=(
        "A 22-year-old woman has an ovary examined in anatomy lab. Temperature is 36.6°C, pulse is 70/min, "
        "respirations are 14/min, and blood pressure is 110/68 mm Hg. Under a cuboidal surface and a dense "
        "connective-tissue coat, follicles sit in the outer tissue. Vessels, lymphatics, and nerves occupy the "
        "inner region."
    ),
    stem="Which of the following is the inner region of the ovary?",
    options=[
        "The inner region with the blood supply and nerve supply",
        "The region where the follicles and oocytes develop",
        "The cuboidal epithelium on the surface",
        "The dense coat just under that epithelium",
        "The single flat cell layer of a resting follicle",
    ],
    key=0,
    whys=[
        "The ovarian medulla is the inner region and contains blood vessels, lymph vessels, and nerves. Follicles are in the cortex, outside that.",
        "Oocytes develop in the cortex, the outer portion under the tunica albuginea.",
        "The surface is cuboidal epithelium, superficial to the tunica albuginea. It is not the inner region.",
        "The tunica albuginea is the dense coat under the surface epithelium.",
        "A single flat granulosa layer describes a primordial follicle in the cortex, not the medulla.",
    ],
)

add(
    domain="reproductive-endocrine", subject="histology", topic="zona-pellucida",
    task="histology", difficulty=2, src="os-27-2", nutrition=False,
    fact="In the secondary follicle the primary oocyte secretes the zona pellucida, a thin acellular membrane important in fertilization.",
    forbid=["zona", "pellucida"],
    vignette=(
        "A 23-year-old woman has a growing follicle with several layers of support cells and a forming fluid "
        "space. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. "
        "The egg cell inside secretes a thin coat with no cells in it. That coat will matter when a sperm arrives."
    ),
    stem="Which of the following secreted that coat?",
    options=[
        "The oocyte itself secretes that acellular coat",
        "The theca cells that make estrogen with the granulosa cells",
        "The yellowish body left after the oocyte departs",
        "The cuboidal epithelium on the ovary surface",
        "The pituitary, as part of the midcycle burst",
    ],
    key=0,
    whys=[
        "In a secondary follicle the primary oocyte secretes the zona pellucida, a thin acellular membrane that is important in fertilization. Her follicle is at that growing stage.",
        "Theca cells, with granulosa cells, produce estrogens. They do not secrete the zona.",
        "The yellowish body left after ovulation forms after ovulation from cells left behind. It secretes progesterone.",
        "Surface epithelium covers the ovary. It does not coat the oocyte.",
        "The LH surge triggers ovulation. It does not secrete the oocyte's coat.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="follicular-phase-estrogen",
    task="mechanism", difficulty=2, src="os-27-2", nutrition=False,
    fact="The follicular phase is when tertiary follicles grow and secrete estrogen. GnRH from the hypothalamus makes the anterior pituitary release FSH and LH. FSH grows the follicles. LH stimulates estradiol.",
    forbid=["follicular phase"],
    vignette=(
        "A 21-year-old woman is in the first half of a 28-day cycle. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 110/68 mm Hg. The hypothalamus releases a signal, the "
        "anterior pituitary releases two gonadotropins, and growing follicles secrete estrogen. Ovulation has "
        "not happened."
    ),
    stem="Which of the following is this phase of the ovarian cycle?",
    options=[
        "The pre-ovulatory phase of follicle growth and estrogen secretion",
        "The phase of progesterone from the yellowish body",
        "The phase after the yellowish body has turned white",
        "The phase in which labor contractions escalate",
        "The phase in which no follicles remain, after menopause",
    ],
    key=0,
    whys=[
        "The follicular phase is the growth of tertiary follicles with estrogen secretion, driven by GnRH, FSH, and LH, before ovulation. She is in the first half of the cycle and has not ovulated.",
        "Progesterone from the corpus luteum defines the luteal phase, after ovulation.",
        "The corpus albicans is the degraded corpus luteum if pregnancy does not occur.",
        "Escalating contractions are oxytocin in labor, not the ovarian follicular phase.",
        "Menopause is the end of reproductive function, when follicles are gone. She is cycling.",
    ],
)

add(
    domain="reproductive-endocrine", subject="anatomy", topic="hymen-not-virginity",
    task="anatomy", difficulty=2, src="os-27-2", nutrition=False,
    fact="The hymen is a thin membrane that sometimes partly covers the vaginal entrance. An intact hymen cannot indicate virginity. Even at birth it is only partial so secretions can exit.",
    forbid=["hymen", "virgin"],
    vignette=(
        "A 17-year-old girl asks about a thin membrane that partly covers the vaginal opening. Temperature is "
        "36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 108/64 mm Hg. The membrane was "
        "already only partial at birth so menstrual fluid can leave. She has never had penile-vaginal intercourse."
    ),
    stem="Which of the following is true of that membrane?",
    options=[
        "Its presence or absence does not prove sexual history",
        "A complete sheet at birth would still let menses out",
        "It is the same structure as the greater vestibular glands",
        "It is the cuboidal covering of the ovary",
        "It closes completely after the first menstrual period",
    ],
    key=0,
    whys=[
        "An intact hymen cannot be used as a sign of virginity. Even at birth it is only a partial membrane so menstrual fluid and other secretions can exit. She has that partial membrane.",
        "A complete sheet would block exit of menstrual fluid. The membrane is partial for that reason.",
        "Bartholin glands, the greater vestibular glands, open beside the vaginal entrance. They are not the hymen.",
        "The ovary's surface is cuboidal epithelium, inside the pelvis, not this membrane.",
        "The hymen does not seal after menarche. Secretions must still be able to leave.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="gnrh-gonadotropins",
    task="mechanism", difficulty=2, src="os-27-2", nutrition=False,
    fact="The hypothalamus produces GnRH, which signals the anterior pituitary to produce FSH and LH. Those travel in blood to granulosa and theca cells.",
    forbid=["gnrh", "hypothalamus"],
    vignette=(
        "A 19-year-old woman has regular cycles. Temperature is 36.6°C, pulse is 70/min, respirations are "
        "14/min, and blood pressure is 106/66 mm Hg. A signal from the base of the brain tells the anterior "
        "pituitary to release two hormones. Those two reach the ovary in the blood and bind follicle cells."
    ),
    stem="Which of the following releases the two hormones that bind the follicle?",
    options=[
        "The anterior pituitary, after a signal from the brain",
        "The yellowish body left after ovulation, as its only products",
        "The granulosa cells, before any pituitary signal",
        "The adrenal cortex, as cortisol and aldosterone",
        "The posterior pituitary, as oxytocin in labor",
    ],
    key=0,
    whys=[
        "GnRH from the hypothalamus makes the anterior pituitary release FSH and LH, which bind granulosa and theca cells. Her cycles use that sequence.",
        "The yellowish body left after ovulation secretes progesterone after ovulation. It is not the source of the two gonadotropins.",
        "Granulosa and theca cells make estrogen in response to LH. They do not release FSH and LH.",
        "Cortisol and aldosterone are adrenal steroids, not the gonadotropins.",
        "Oxytocin in labor is a different feedback loop. FSH and LH come from the anterior pituitary.",
    ],
)
