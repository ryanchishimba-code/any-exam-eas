# Batch 3. Research ethics from OpenStax Psychology 2e, section 2.4.

add(
    domain="social-sciences", subject="ethics", topic="irb-human-research",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Any research institution receiving federal support for human research must have an IRB. The IRB includes administrators, scientists, and community members and must generally approve a proposal before the study proceeds.",
    forbid=["institutional review", "irb"],
    vignette=(
        "A 26-year-old student plans a study of adult volunteers at a university that receives federal research "
        "funds. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. "
        "A committee of administrators, scientists, and community members must review the plan. The study is not "
        "supposed to start until that committee agrees."
    ),
    stem="Which of the following must happen before the study starts?",
    options=[
        "The human-subjects committee must approve the plan",
        "An animal-care committee must inspect the rodent rooms",
        "Participants must be debriefed before any consent form",
        "Parents must sign because every volunteer is under 18",
        "The study may begin with no review if consent is verbal",
    ],
    key=0,
    whys=[
        "An institution with federal support for human research must have an institutional review board of administrators, scientists, and community members. Approval is generally required before the study proceeds. Her university study of adults needs that approval.",
        "An IACUC reviews animal research, not a study of adult volunteers.",
        "Debriefing comes after a study that used deception. Consent comes before participation.",
        "Parents or guardians sign when participants are under 18. Her volunteers are adults.",
        "Verbal consent does not replace IRB review at a federally supported institution.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="informed-consent-voluntary",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Informed consent describes what participants can expect, including risks and implications. Involvement is voluntary and can stop at any time without penalty. Data remain confidential.",
    forbid=["informed consent", "voluntary"],
    vignette=(
        "A 34-year-old man is asked to join a psychology study. Temperature is 36.6°C, pulse is 74/min, "
        "respirations are 14/min, and blood pressure is 122/76 mm Hg. The form describes the procedures and the "
        "risks. It says he may leave at any time and will not be penalized, and that his data will be kept "
        "private."
    ),
    stem="Which of the following is he allowed to do after signing?",
    options=[
        "Stop participating at any time without a penalty",
        "Skip the description of risks and still be fully informed",
        "Require the team to name him in the published data",
        "Join even though he is 16 and signs alone",
        "Avoid a later explanation if the study used deception",
    ],
    key=0,
    whys=[
        "Informed consent states that participation is voluntary and can be discontinued without penalty, and that data stay confidential. He may stop after signing.",
        "The form must describe risks. Omitting them is not informed consent.",
        "The form guarantees confidentiality. Publishing his name would break that.",
        "Participants under 18 need a parent or guardian to sign.",
        "If deception was used, a full debriefing is required at the end.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="minor-guardian-consent",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="If participants are under 18, a parent or legal guardian must sign the informed consent form.",
    forbid=["guardian", "under 18", "parent"],
    vignette=(
        "A 15-year-old girl is invited into a school study of study habits. Temperature is 36.6°C, pulse is "
        "80/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. She wants to join. The form has a "
        "signature line she cannot complete by herself."
    ),
    stem="Which of the following must sign before she joins?",
    options=[
        "A parent or legal guardian, along with the required form",
        "Only the student, because the study is at school",
        "The animal-care committee, because she is a minor",
        "No one, because surveys never need consent",
        "The journal editor, after the study is published",
    ],
    key=0,
    whys=[
        "When participants are under 18, a parent or legal guardian must sign informed consent. She is 15, so her signature alone is not enough.",
        "Being at school does not let a minor consent alone.",
        "An IACUC reviews animal protocols. It does not sign a minor's consent.",
        "Human research still needs consent. A survey of a minor is not exempt from the guardian requirement in this section.",
        "Publication is not the consent step. Consent comes before participation.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="deception-requires-debrief",
    task="mechanism", difficulty=3, src="os-psych-2-4", nutrition=False,
    fact="Deception may be used so knowledge of the exact question does not change results, but not if it would be harmful. Participants must then be fully debriefed: purpose, data use, why deception was needed, and how to learn more.",
    forbid=["deception", "debrief"],
    vignette=(
        "A 29-year-old man finishes a study of how clothing changes first impressions. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. The consent form did not "
        "state the exact question, so his guess would not change his answers. The misdirection was not harmful. "
        "The team now owes him a full explanation."
    ),
    stem="Which of the following must the team now provide?",
    options=[
        "The true purpose, the data use, and why the misdirection was needed",
        "Nothing further, because he already signed consent",
        "A guarantee that deception may be harmful if the question requires it",
        "Permission to skip consent when the next study starts",
        "An animal-committee inspection of the interview room",
    ],
    key=0,
    whys=[
        "When deception is used, participants must be debriefed with the purpose, how the data will be used, why deception was necessary, and how to get more information. His clothing study hid the question and now requires that explanation. Deception must not be harmful.",
        "Consent before the study does not replace the debriefing after deception.",
        "Deception is not allowed to the point of harm.",
        "Each study still needs its own consent. Debriefing does not waive the next consent.",
        "An IACUC inspects animal facilities. This was a human impression study.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="tuskegee-withheld-treatment",
    task="mechanism", difficulty=3, src="os-psych-2-4", nutrition=False,
    fact="In the Tuskegee study, men with syphilis were not told they had it. Penicillin was known to work by 1947 and was still withheld. The study ended in 1972 after the press reported it and led to the National Research Act of 1974.",
    forbid=["tuskegee", "penicillin", "1974"],
    vignette=(
        "A class reviews a study that began in 1932 among rural Black men. Temperature is 36.6°C, pulse is "
        "76/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. Men who tested positive were not "
        "told they had the infection. By 1947 an effective drug existed, and it was still not given. The study "
        "ended in 1972 after the press exposed it."
    ),
    stem="Which of the following made the continued study unacceptable?",
    options=[
        "A cure was withheld and the diagnosis was never shared",
        "An institutional review board had approved it in 1932",
        "The men signed a modern consent form that listed the drug",
        "Only rodents were used, so human rules did not apply",
        "Debriefing at the end repaired the withheld treatment",
    ],
    key=0,
    whys=[
        "Participants with syphilis were never told the diagnosis. Penicillin was recognized as effective by 1947 and was still withheld, and men were discouraged from seeking care. Exposure in 1972 led to the National Research Act of 1974. That withholding is why the study was unacceptable.",
        "Modern IRB review did not exist for this study. The section presents it as the abuse that later rules answered.",
        "The men were not given a consent process that disclosed the disease or the drug.",
        "The subjects were men, not research rodents.",
        "A debriefing does not undo decades of withheld treatment.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="iacuc-animal-review",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Animal proposals are reviewed by an IACUC of administrators, scientists, veterinarians, and community members. It requires humane treatment and inspects facilities twice a year. No animal project proceeds without approval.",
    forbid=["iacuc", "animal"],
    vignette=(
        "A 31-year-old researcher wants to test a drug in rats. Temperature is 36.6°C, pulse is 68/min, "
        "respirations are 14/min, and blood pressure is 116/72 mm Hg. A committee of administrators, scientists, "
        "veterinarians, and community members must approve the plan. The same committee inspects the animal "
        "rooms twice a year. He may not start without that approval."
    ),
    stem="Which of the following reviews this animal plan?",
    options=[
        "The committee that also checks the housing rooms twice a year",
        "The human-subjects board, because rats are federal subjects",
        "Only the researcher, if pain is likely to be brief",
        "A parent or guardian, because the rats are young",
        "No committee, because 90 percent of such work uses rodents",
    ],
    key=0,
    whys=[
        "An IACUC of administrators, scientists, veterinarians, and community members reviews animal work, requires humane treatment, and inspects facilities semi-annually. No animal project proceeds without approval. His rat study needs that committee.",
        "An IRB reviews human research. Animal work goes to the IACUC.",
        "The researcher cannot approve his own animal protocol.",
        "Guardian consent is for human participants under 18.",
        "The estimate that 90 percent of psychology animal research uses rodents or birds does not remove the approval requirement.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="minimize-animal-distress",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Animal researchers must design experiments to minimize pain or distress. About 90 percent of psychology animal research uses rodents or birds.",
    forbid=["distress", "rodent"],
    vignette=(
        "A 27-year-old student designs a learning study in birds. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 110/68 mm Hg. The protocol is written so the birds have "
        "as little pain and distress as the question allows. Birds and rodents account for most psychology "
        "animal studies."
    ),
    stem="Which of the following is required in the design?",
    options=[
        "The plan must keep pain and suffering as low as possible",
        "Pain is acceptable if the species is a rodent or a bird",
        "Humane treatment applies only to human participants",
        "Deception of the birds replaces the need to limit pain",
        "A human-subjects board is the only required review",
    ],
    key=0,
    whys=[
        "Researchers must design animal experiments to minimize pain or distress. Her bird study has to do that. The APA estimate is that about 90 percent of psychology animal research uses rodents or birds, which does not relax the duty.",
        "Using rodents or birds does not make pain acceptable. Distress must still be minimized.",
        "Humane treatment is required for animal subjects as well as respect for human participants.",
        "Deception and debriefing are human-research practices. They do not replace minimizing animal pain.",
        "Animal work is reviewed by the IACUC, not only by the human IRB.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="confidentiality-in-consent",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Informed consent guarantees that data collected in the experiment will remain completely confidential.",
    forbid=["confidential"],
    vignette=(
        "A 42-year-old woman finishes a memory study. Temperature is 36.6°C, pulse is 70/min, respirations are "
        "14/min, and blood pressure is 124/76 mm Hg. She asks whether her name will be attached to her scores in "
        "the data file shared outside the team. The form she signed said the data would be kept private."
    ),
    stem="Which of the following did the form promise about her data?",
    options=[
        "The scores stay unnamed outside the study rules",
        "Her name will be printed beside each score",
        "Secrecy would apply only when she is under 18",
        "Secrecy ends if the study used no misdirection",
        "The housing-review committee may post her scores",
    ],
    key=0,
    whys=[
        "Informed consent guarantees that collected data remain completely confidential. Her form promised that privacy.",
        "Publishing her name with scores would break confidentiality.",
        "Confidentiality is part of consent for participants generally, not only for minors.",
        "Deception changes the need for debriefing. It does not cancel confidentiality.",
        "An animal committee does not publish a human participant's scores.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="national-research-act",
    task="mechanism", difficulty=3, src="os-psych-2-4", nutrition=False,
    fact="Outrage over Tuskegee led to the National Research Act of 1974 and the strict guidelines for human research described in the chapter.",
    forbid=["1974", "national research"],
    vignette=(
        "A 23-year-old student asks why human studies now need a formal ethics review. Temperature is 36.6°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The class has just "
        "covered a 40-year study in which infected men were not treated even after a cure existed. Public "
        "exposure in 1972 produced a federal statute two years later."
    ),
    stem="Which of the following did that statute lead to?",
    options=[
        "The strict rules for research on human participants",
        "A rule that animal studies need no committee",
        "Permission to withhold a known cure if meals are free",
        "An end to written consent forms for adults",
        "A requirement that deception never be explained afterward",
    ],
    key=0,
    whys=[
        "The Tuskegee study's exposure led to the National Research Act of 1974 and the strict human-research guidelines in the chapter, including IRB review. She is asking about that consequence.",
        "Animal studies still require an IACUC. The statute's lesson in this section is human-research protection.",
        "Withholding penicillin was a reason the study was unethical, not a rule the statute created.",
        "Adult consent remains required.",
        "Deception, when used, must be followed by a full debriefing.",
    ],
)

add(
    domain="social-sciences", subject="ethics", topic="debrief-contents",
    task="mechanism", difficulty=2, src="os-psych-2-4", nutrition=False,
    fact="Debriefing includes the purpose, how data will be used, why deception was necessary, and how to obtain additional information.",
    forbid=["purpose of the experiment"],
    vignette=(
        "A 36-year-old man was misled about the exact question in a harmless study of first impressions. "
        "Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. "
        "At the end the investigator explains the real question, how the answers will be used, why the "
        "misdirection was needed, and where to read more."
    ),
    stem="Which of the following is this end-of-study explanation?",
    options=[
        "The account owed after the question was concealed",
        "The consent form he should have signed after the study",
        "The housing inspection done twice each year",
        "A waiver that lets the next study skip ethics review",
        "The statute that followed exposure of the syphilis study",
    ],
    key=0,
    whys=[
        "A debriefing after deception gives the purpose, the data use, the reason for deception, and how to learn more. He received that full account. The misdirection was not harmful, which is the limit the section allows.",
        "Consent is signed before participation, not after.",
        "Semi-annual inspection is an IACUC duty for animal facilities.",
        "A debriefing does not waive IRB review of a later study.",
        "The National Research Act followed Tuskegee. It is not this end-of-study talk.",
    ],
)
