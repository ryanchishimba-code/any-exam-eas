# Last 10 immune items so batch 1 totals 100.

add(
    domain="blood-lymph-immune", subject="immunology", topic="b-cell-native-antigen",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="B cells recognize native, unprocessed antigen and do not require MHC molecules or antigen-presenting cells to bind it.",
    forbid=["mhc"],
    vignette=(
        "A 24-year-old woman who catalogs seeds is studied after a first injection of a protein. Temperature is "
        "36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. One lymphocyte "
        "binds the protein in its original folded shape, with no requirement that another cell display a cut "
        "peptide. A second lymphocyte binds only a peptide fragment held in a surface groove of another cell."
    ),
    stem="Which of the following lymphocytes binds the intact folded protein?",
    options=[
        "The cell that recognizes native antigen without a presenting groove",
        "The cell that recognizes only a peptide in a presenting groove",
        "A red-cell precursor that carries no antigen receptor",
        "A platelet that releases granules but does not bind antigen",
        "A liver phagocyte that engulfs debris in a sinusoid",
    ],
    key=0,
    whys=[
        "B cells bind native, unprocessed antigen and do not need MHC or an antigen-presenting cell to recognize it. The first lymphocyte bound the folded protein with no peptide display. The second lymphocyte, which needs a peptide in a groove, is the T cell pattern.",
        "That description is the second lymphocyte, not the one that bound the intact protein.",
        "Red-cell precursors do not bind native antigen through an antibody receptor.",
        "Platelets are not the lymphocyte that recognized folded protein.",
        "Kupffer cells phagocytose in liver sinusoids. They are not the lymphocyte in this comparison.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="class-switch-same-specificity",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="Class switching changes the antibody class. Specificity and the antigen-binding sites stay the same.",
    forbid=["switch"],
    vignette=(
        "A 17-year-old boy who clerks in a pharmacy is followed after a first vaccine dose and a second dose "
        "8 weeks later. Temperature is 36.5°C, pulse is 66/min, respirations are 14/min, and blood pressure is "
        "108/64 mm Hg. Early antibody is a pentamer. Later antibody is a monomer. Both grab the same site on "
        "the vaccine protein, and the binding loops have not changed."
    ),
    stem="Which of the following changed between the early and later antibody?",
    options=[
        "The class changed, and the binding site stayed the same",
        "The binding site changed, and the class stayed a pentamer",
        "Both the antibody class and the binding site changed",
        "Neither the class nor the binding site changed",
        "The antibody became a T-cell receptor with a new groove",
    ],
    key=0,
    whys=[
        "Class switching replaces one antibody class with another while specificity and the antigen-binding sites stay the same. His early antibody is a pentamer and the later one is a monomer, and both bind the same site with unchanged loops.",
        "The binding loops did not change, and the later antibody is a monomer, not still a pentamer.",
        "The binding site stayed the same, so both features did not change.",
        "The class did change from pentamer to monomer.",
        "The molecule is still antibody. It did not become a T-cell receptor.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="passive-antibody-no-memory",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="Passive immunity transfers antibody without the recipient making a response, so no memory develops. The protection lasts only until the transferred antibody degrades. A vaccine is active immunity and does generate memory.",
    forbid=["passive", "memory"],
    vignette=(
        "A 30-year-old man who guides river trips receives an injection of antibody after a possible exposure. "
        "Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. "
        "He makes no antibody of his own to this organism. Protection is gone by 8 weeks. A coworker who received "
        "a vaccine instead still has a rapid rise in her own antibody when tested at 8 weeks."
    ),
    stem="Which of the following best explains why his protection ended?",
    options=[
        "Transferred antibody faded, and he formed no lasting response",
        "The vaccine he received failed to take because he was already immune",
        "His own pentamer switched to a monomer and then stopped",
        "Mast-cell antibody consumed the injection within 10 minutes",
        "Colonic bacteria destroyed the antibody in the first hour",
    ],
    key=0,
    whys=[
        "Passive immunization gives antibody without an immune response in the recipient, so no immunological memory forms. Protection lasts only until the transferred antibody degrades. He made none of his own, and protection was gone at 8 weeks. His coworker received a vaccine, which is active immunization and still shows her own rapid response.",
        "He received antibody, not a vaccine. The coworker is the one who was vaccinated.",
        "Class switching is part of an active response. He made no antibody of his own.",
        "The loss of protection is at 8 weeks, not in 10 minutes, and he is not described as having an allergic consumption of the dose.",
        "Colonic bacteria are not the reason transferred antibody disappears over weeks.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="t-independent-polysaccharide",
    task="mechanism", difficulty=4, src="os-21-4", nutrition=False,
    fact="T cell-independent antigens are typically repeating carbohydrates on bacterial walls. They cross-link surface antibody and activate the B cell without T-cell cytokines. Proteins usually need helper T cells.",
    forbid=["independent"],
    vignette=(
        "A 4-year-old girl who attends preschool has a vaccine made only of a repeating sugar from a bacterial "
        "capsule. Temperature is 36.8°C, pulse is 100/min, respirations are 20/min, and blood pressure is "
        "90/56 mm Hg. Her B cells bind many identical sugars at once and begin to make antibody even though "
        "helper T cells are not providing cytokines. A protein vaccine given the same day does not activate "
        "B cells unless those helper cells join in."
    ),
    stem="Which of the following lets the sugar vaccine activate B cells alone?",
    options=[
        "Repeating units cross-link surface antibody without T-cell help",
        "The sugar is presented on a class II groove to a helper cell first",
        "The sugar must switch from IgM to IgG before any activation",
        "Mast cells must release histamine before the B cell responds",
        "The sugar crosses the placenta and returns as passive antibody",
    ],
    key=0,
    whys=[
        "Repeating carbohydrates cross-link B-cell surface antibody and activate the cell without T-cell cytokines. Her sugar vaccine did that. The protein vaccine given the same day still needed helper T cells, which is the T-dependent pattern.",
        "Peptide display on class II MHC is how a B cell gets help for a protein antigen. The sugar vaccine activated B cells without that help.",
        "Class switching happens after activation. It is not required before the sugar can cross-link the receptor.",
        "Mast-cell histamine is an IgE effector event, not the trigger for this capsular-sugar vaccine.",
        "Placental transfer is passive IgG. She is 4 years old and received a vaccine.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="clonal-deletion-bone-marrow",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="Central tolerance deletes or inactivates self-reactive B cells in the bone marrow. Strong binding to self antigen on tissues causes clonal deletion by apoptosis. Soluble self antigen causes anergy instead.",
    forbid=["anergy", "deletion"],
    vignette=(
        "A developing B cell in a 6-year-old boy's marrow binds strongly to a protein displayed on the surface "
        "of neighboring marrow cells. Temperature is 36.7°C, pulse is 88/min, respirations are 18/min, and "
        "blood pressure is 96/60 mm Hg. The immature cell then dies by apoptosis and never leaves the marrow. "
        "A second immature cell that meets only a soluble self protein becomes unresponsive but is not killed."
    ),
    stem="Which of the following is the fate of the cell that bound the surface self protein?",
    options=[
        "Programmed cell death removes it before it can exit that organ",
        "It leaves and secretes high-affinity antibody to self",
        "It becomes a memory cell aimed at that self molecule",
        "It changes class and enters the mucosal secretions",
        "It only becomes unresponsive, which is the second cell's fate",
    ],
    key=0,
    whys=[
        "Strong binding of an immature B cell to self antigen on tissues in the marrow signals apoptosis, which is clonal deletion. This cell bound a surface self protein and died before leaving. The second cell, exposed to soluble self protein, is the one that becomes unresponsive without being killed.",
        "Deletion removes the cell. It does not leave and secrete self antibody.",
        "Memory cells come from clonal expansion after a foreign antigen, not from a cell that died in the marrow.",
        "Class switching to IgA is a later response to foreign antigen, not the fate of a deleted immature cell.",
        "Unresponsiveness without death is the fate of the second cell, which met soluble antigen. The first cell was killed.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="plasma-cell-terminal",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="After activation, B cells become plasma cells, which often return to the bone marrow, secrete antibody, and then die. They are terminally differentiated and do not maintain themselves.",
    forbid=["plasma"],
    vignette=(
        "A 26-year-old woman who illustrates maps has a marrow sample 2 weeks after a booster vaccine. Temperature "
        "is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The sample "
        "contains cells that have left the lymph node, make large amounts of antibody, show almost no surface "
        "antibody, and are not expected to divide further. They die after the secretory period."
    ),
    stem="Which of the following best describes these marrow cells?",
    options=[
        "Terminally differentiated cells devoted to antibody secretion",
        "Naive cells displaying two surface classes and secreting neither",
        "Memory cells that wait without secreting until the next exposure",
        "Helper cells that must display peptide to finish B-cell activation",
        "Phagocytes that line hepatic sinusoids and clear bacteria",
    ],
    key=0,
    whys=[
        "Plasma cells often return to the marrow, secrete antibody, lack surface antibody, and die after that secretory period because they do not maintain themselves. They are terminally differentiated. These cells match that description 2 weeks after a booster.",
        "Naive B cells display IgM and IgD and have not yet responded. These cells are secreting and have almost no surface antibody.",
        "Memory cells are the ones that persist for a faster later response. The cells here are secreting and then die.",
        "Helper T cells provide cytokines. They are not the marrow cells packed with antibody secretion.",
        "Kupffer cells are liver phagocytes, not antibody-secreting marrow cells.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="secondary-response-faster",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="The primary antibody response is delayed several days and is lower. A second exposure to the same antigen has no delay and produces much more antibody. A new antigen starts another primary response.",
    forbid=["secondary"],
    vignette=(
        "A 22-year-old man who repairs bikes receives antigen A on day 0 and again on day 60, and antigen B for "
        "the first time on day 60. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood "
        "pressure is 116/72 mm Hg. Antibody to A is low and delayed after the first dose, then rises immediately "
        "and much higher after the second dose. Antibody to B, given once, is low and delayed."
    ),
    stem="Which of the following best explains the immediate high rise to antigen A only?",
    options=[
        "He has already met A, so the next exposure is prompt and larger",
        "Antigen B is a repeating sugar and needs no helper-cell signal",
        "Both antigens are crossing the placenta in a newborn",
        "Antigen A is bound to mast cells and antigen B is not",
        "Both responses are passive transfers of someone else's antibody",
    ],
    key=0,
    whys=[
        "A second encounter with the same antigen produces antibody without the delay of the primary response, and in larger amount. A different antigen starts a new primary response, low and delayed. A was given twice and rose immediately the second time. B was given once and stayed in the delayed low pattern.",
        "Nothing in the study says B is a repeating sugar. Its curve is a first exposure.",
        "He is 22 years old. Placental transfer is not this paired immunization.",
        "Mast-cell binding is the IgE allergy pattern. It does not explain the two laboratory curves.",
        "He made the responses after the antigens were given to him. They are not a transfer of another person's antibody.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="fc-region-effector-cells",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="The Fc region is formed by the two heavy chains and is bound by Fc receptors on effector cells, which can then attach to antibody-coated pathogens.",
    forbid=["fc region", "fc receptor"],
    vignette=(
        "A 33-year-old woman who teaches violin has bacteria in a blood culture. Temperature is 38.6°C, pulse "
        "is 108/min, respirations are 20/min, and blood pressure is 100/62 mm Hg. Antibody coats the organisms. "
        "A phagocyte grabs the organisms only when its receptor binds the tail of that antibody, the portion "
        "made by the two heavy chains, not the antigen-binding end."
    ),
    stem="Which of the following part of the antibody did the phagocyte bind?",
    options=[
        "The heavy-chain tail, not the antigen-binding end",
        "The antigen-binding end, which is made only of light chain",
        "A secreted pentamer's extra J piece and nothing else",
        "The groove of a class II molecule on the phagocyte",
        "A T-cell receptor that the phagocyte borrowed",
    ],
    key=0,
    whys=[
        "The Fc portion is formed by the two heavy chains and is what Fc receptors on effector cells bind, allowing those cells to grab antibody-coated pathogens. The phagocyte bound the tail made by the heavy chains, not the antigen-binding end.",
        "The antigen-binding sites are at the other end of the molecule and include both heavy and light chain. The phagocyte did not bind that end.",
        "IgM is a pentamer, but the vignette identifies the bound piece as the heavy-chain tail, not a J chain.",
        "Class II MHC displays peptide to T cells. The phagocyte bound antibody tail on a coated organism.",
        "The phagocyte used its own receptor for the antibody tail. It did not borrow a T-cell receptor.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="t-dependent-two-signals",
    task="mechanism", difficulty=4, src="os-21-4", nutrition=False,
    fact="A protein antigen usually does not cross-link B-cell antibody enough. Full activation needs two signals: surface immunoglobulin binding native antigen, and cytokines from a helper T cell that recognized peptide on class II MHC.",
    forbid=["two signals"],
    vignette=(
        "A 15-year-old boy who folds maps receives a pure protein vaccine. Temperature is 36.6°C, pulse is "
        "72/min, respirations are 14/min, and blood pressure is 106/64 mm Hg. His B cells bind the intact "
        "protein, internalize it, and display a peptide fragment. Antibody appears only after a helper cell "
        "recognizes that fragment and releases cytokines onto the B cell. Without the helper cell, contact "
        "alone does not finish activation."
    ),
    stem="Which of the following pair of signals finished the activation?",
    options=[
        "Intact-protein binding plus a helper-cell chemical signal",
        "Cross-linking by a repeating sugar, without helper cells",
        "A single signal consisting of mast-cell histamine",
        "Passive transfer of antibody without a B-cell event",
        "Removal of the B cell because the protein was self",
    ],
    key=0,
    whys=[
        "Protein antigens usually need two signals: surface immunoglobulin binding native antigen, and cytokines from a helper T cell that saw peptide on class II MHC. His B cells bound and displayed the protein, and antibody appeared only after the helper cell released cytokines. Binding alone was not enough.",
        "Repeating sugar can activate B cells without help. This vaccine is a pure protein, and help was required.",
        "Histamine release is an allergic effector step, not the second signal for this protein vaccine.",
        "He made antibody after a helper cell joined. That is not passive transfer.",
        "Marrow deletion removes self-reactive immature cells. This protein vaccine activated a response rather than deleting the clone.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="peripheral-tolerance-needs-t-help",
    task="mechanism", difficulty=4, src="os-21-4", nutrition=False,
    fact="Peripheral tolerance: a mature B cell that binds self antigen but receives no helper T-cell signal undergoes apoptosis. Most protein antigens need that Th2 signal.",
    forbid=["peripheral"],
    vignette=(
        "A mature B cell in a 40-year-old man's lymph node binds one of his own proteins. Temperature is 36.7°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. No helper cell that "
        "recognizes the same protein provides a cytokine signal. The B cell then dies. A neighboring B cell that "
        "binds a foreign protein and does receive the helper signal goes on to secrete antibody."
    ),
    stem="Which of the following caused the self-binding cell to die?",
    options=[
        "It recognized a self molecule and never got help from a T cell",
        "It bound a repeating bacterial sugar and was fully activated",
        "It received helper cytokines and therefore underwent class switching",
        "It was a plasma cell that had already finished secreting",
        "It crossed the placenta as already-made maternal antibody",
    ],
    key=0,
    whys=[
        "Most protein antigens need a helper T-cell signal. A mature B cell that binds self antigen and does not receive that signal is driven to apoptosis. This cell bound his own protein, got no helper cytokine, and died. The neighbor that bound foreign protein and did get help secreted antibody.",
        "A repeating sugar can activate a B cell without help. This cell bound a self protein and died, so it was not activated by a sugar.",
        "Helper cytokines would have pushed the cell toward antibody, as happened to the neighbor. This cell did not receive them.",
        "Plasma cells are already secreting and then die after that work. This cell died because help never came, before secretion.",
        "Placental transfer moves IgG, not a lymph-node B cell.",
    ],
)
