"""Step 1 social-science ethics and human-development items. Data only."""

ITEMS = [
    {
        "id": "eth-01",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 74-year-old man is admitted with a foot abscess and osteomyelitis, and surgery recommends a below-knee amputation. Yesterday he was febrile and disoriented. This morning he is afebrile, oriented to person, place, and time, and he scores 28 out of 30 on a bedside cognitive screen. He describes the infection in his own words, states that without amputation he may die of sepsis, and explains that he rejects amputation because he watched his brother die after a similar operation. He would rather die with his leg than live without it, and he repeats that choice after the risks are restated. His adult children say he is not competent and ask you to let them sign the consent. He has no advance directive and has not named a surrogate."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Accept his informed refusal and do not proceed with amputation",
            "Petition the court today to declare incompetence and authorize surgery",
            "Let his adult children provide substituted consent because they are next of kin",
            "Transfer him for an emergency psychiatry admission so the surgery can proceed",
            "Ask a second surgeon to operate under a two-physician emergency waiver",
        ],
        "correctAnswer": "Accept his informed refusal and do not proceed with amputation",
        "explanation": (
            "He currently has decision-making capacity for this choice. He understands the infection, appreciates that refusing amputation may be fatal, offers a stable reason, and expresses a consistent choice. Capacity is a clinical judgment about this decision at this time. Legal incompetence is a status a court declares, and a capacitated refusal is not a reason to seek that status. The polite path of letting worried children take over, and the legalistic path of an emergency waiver, are both ruled out by the fact that he understands the decision. Petition the court today to declare incompetence and authorize surgery would treat a value choice as a legal defect. Let his adult children provide substituted consent because they are next of kin gives relatives authority they do not have while he retains capacity. Transfer him for an emergency psychiatry admission so the surgery can proceed mislabels a reasoned refusal as a psychiatric crisis; he is not psychotic or unable to care for himself because of mental illness. Ask a second surgeon to operate under a two-physician emergency waiver misuses an exception meant for a patient who cannot consent when delay threatens life and no surrogate is available."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-02",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 69-year-old woman with mild dementia is in the hospital for elective repair of a reducible, painless inguinal hernia. At 2 a.m. she was disoriented and pulled at her intravenous catheter. At 10 a.m. she is oriented, recalls the surgeon explanation of infection, recurrence, and nerve injury, and says she wants to decide after talking with her sister, who arrives this evening. The hernia is not incarcerated and there is no plan to operate before tomorrow. The night nurse says nighttime confusion permanently removed her authority. Her son is willing to sign immediately and says he does not want to bother her with details. She asks to speak for herself while she is clear."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Obtain her own consent during this lucid interval rather than accepting her son signature now",
            "Accept the son signature now because nighttime confusion permanently removes her authority",
            "Delay every discussion until a court declares her competent to sign",
            "Proceed tonight under an emergency waiver because she was confused overnight",
            "Cancel the repair permanently because any dementia eliminates consent",
        ],
        "correctAnswer": "Obtain her own consent during this lucid interval rather than accepting her son signature now",
        "explanation": (
            "Capacity can fluctuate. She is lucid now, the repair is elective, and the decision can wait until she has spoken with her sister. The appropriate step is to use this lucid interval and let her decide, not to transfer authority because of one confused night. Accept the son signature now because nighttime confusion permanently removes her authority treats a temporary delirium as a lasting loss of her voice. Delay every discussion until a court declares her competent to sign confuses a clinical capacity assessment with a judicial competence proceeding she does not need while she can decide. Proceed tonight under an emergency waiver because she was confused overnight invents an emergency: the hernia is reducible and painless, so delay until evening does not threaten her life. Cancel the repair permanently because any dementia eliminates consent is false; mild dementia does not erase capacity when she understands this operation and states a plan to decide."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-03",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 46-year-old man with schizophrenia is admitted with wet gangrene of the left foot. At baseline he takes his antipsychotic, lives alone, and has no current hallucinations or delusions. He names the diagnosis, states that refusal of amputation may lead to sepsis and death, and says he prefers death to amputation for a religious reason he has held for years. His reasoning stays the same when the risks are repeated. Psychiatry finds no current psychosis and confirms that he appreciates the consequences. He is not asking to die by any other means. His brother says schizophrenia means he cannot refuse and demands a court order for surgery."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Honor his refusal of amputation after documenting the capacity assessment",
            "Obtain a court order for involuntary amputation because schizophrenia negates capacity",
            "Proceed with surgery under an emergency psychiatry hold",
            "Ask the brother to sign as surrogate because a psychiatric diagnosis transfers authority",
            "Give extra antipsychotic medication and operate only after he agrees",
        ],
        "correctAnswer": "Honor his refusal of amputation after documenting the capacity assessment",
        "explanation": (
            "A psychiatric diagnosis does not by itself remove decision-making capacity. He understands the gangrene, appreciates that death may follow refusal, and gives a long-held religious reason. That assessment should be documented and his refusal honored. The legalistic demand for a court order is ruled out by a capacity exam that he passes. Obtain a court order for involuntary amputation because schizophrenia negates capacity treats the diagnosis as if it automatically voided capacity, which it does not. Proceed with surgery under an emergency psychiatry hold is not supported: he is not dangerous, gravely disabled, or acutely psychotic, and a hold is not a device to force an operation. Ask the brother to sign as surrogate because a psychiatric diagnosis transfers authority skips the patient who still has authority. Give extra antipsychotic medication and operate only after he agrees uses drugs to manufacture agreement rather than to treat a psychosis he does not currently have."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-04",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 58-year-old man is in septic shock from perforated diverticulitis. Blood pressure is 78/46 mm Hg after fluids, lactate is rising, and the surgeon says laparotomy cannot wait an hour. He is confused, pulls at lines, and says the surgeons are impostors and that nothing is wrong with his belly. He cannot repeat any risk and does not give a stable choice. No surrogate can be reached. A colleague suggests waiting for a court hearing so no one can accuse the team of operating without a signature."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Proceed with life-saving laparotomy under the emergency exception to consent",
            "Honor his statement that nothing is wrong because every refusal must be obeyed",
            "Wait for a court hearing before making an incision",
            "Ask the hospital attorney to serve as his surrogate decision maker",
            "Give haloperidol and delay the operation until he can sign the form",
        ],
        "correctAnswer": "Proceed with life-saving laparotomy under the emergency exception to consent",
        "explanation": (
            "He cannot understand, appreciate, or state a choice, no surrogate is available, and delay for a signature would likely be fatal. In that narrow emergency, treatment proceeds under implied consent. His words are the product of delirium, not an informed refusal. Honor his statement that nothing is wrong because every refusal must be obeyed would let a patient who cannot appreciate a perforation decline a life-saving operation. Wait for a court hearing before making an incision mistakes a judicial competence process for the emergency exception and would cost him the hour he does not have. Ask the hospital attorney to serve as his surrogate decision maker invents a surrogate; an attorney for the hospital is not his decision maker. Give haloperidol and delay the operation until he can sign the form treats the paperwork as more urgent than source control of septic shock."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-05",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 4,
        "scenario": (
            "A 16-year-old girl asks to be seen alone. For two months she has had low mood, loss of interest, poor sleep, and falling grades. She denies suicidal ideation, a plan, self-harm, and abuse. She agrees to psychotherapy and to call if she develops thoughts of suicide. She says that if you tell her parents she will never come back. Her mother is in the waiting room and says that because she pays the insurance she has a right to every word of the interview. The girl is willing for you to say only that she was seen and is safe."
        ),
        "stem": "Which of the following is the most appropriate response?",
        "options": [
            "Keep the interview confidential, encourage her to involve a parent later, and arrange care",
            "Disclose the full interview to the mother because minors cannot hold confidentiality",
            "Refuse treatment until a parent signs a release of every psychotherapy note",
            "Tell the mother the depression diagnosis so she can monitor moods at home",
            "Report the girl to child protective services for being withdrawn at school",
        ],
        "correctAnswer": "Keep the interview confidential, encourage her to involve a parent later, and arrange care",
        "explanation": (
            "An adolescent may expect confidentiality for ordinary mental health care when there is no imminent danger and no abuse. She has no suicidal plan and no safety exception applies, so the interview stays private, she is encouraged to involve a parent when she is ready, and treatment is arranged. Paying for insurance does not give a parent the content of this visit. Disclose the full interview to the mother because minors cannot hold confidentiality overstates the law and would predictably drive her away from care. Refuse treatment until a parent signs a release of every psychotherapy note conditions care on a waiver she has already rejected and is not required here. Tell the mother the depression diagnosis so she can monitor moods at home is still a breach; monitoring can be offered through the adolescent, not by disclosing over her objection. Report the girl to child protective services for being withdrawn at school invents neglect from a voluntary disclosure of depression."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-06",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 5,
        "scenario": (
            "A 15-year-old boy is seen alone at his request. He has written a farewell note and describes a plan to die tonight by taking a bottle of acetaminophen that is in his backpack. He can show you the bottle. He begs you to keep the promise, made at a prior visit, that everything he says stays in the room, and he says he will never trust a doctor again if you tell his father. He is medically stable at this moment and is not intoxicated. His father is in the waiting room. He refuses to stay if you involve any adult."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Break confidentiality, stay with him, and inform his father so emergency care can proceed",
            "Keep the promise of absolute confidentiality and send him home with a crisis hotline",
            "Ask him to return tomorrow with a parent if he still feels suicidal",
            "Leave a voicemail for the school principal and take no further protective step",
            "Document his request for secrecy and discharge him because he is not yet poisoned",
        ],
        "correctAnswer": "Break confidentiality, stay with him, and inform his father so emergency care can proceed",
        "explanation": (
            "A specific suicidal plan with means is an exception to adolescent confidentiality. The promise of privacy yields to the duty to protect him. He should not be left alone, his father should be told, and emergency psychiatric care should proceed even though he objects. Keep the promise of absolute confidentiality and send him home with a crisis hotline preserves trust on paper and leaves a planned overdose in his backpack. Ask him to return tomorrow with a parent if he still feels suicidal delays protection past the night he has identified. Leave a voicemail for the school principal and take no further protective step notifies the wrong person and does not secure him now. Document his request for secrecy and discharge him because he is not yet poisoned waits for medical injury instead of preventing a stated plan that is ready to happen tonight."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-07",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 14-year-old girl is seen alone for abdominal pain. She discloses that her stepfather has been sexually abusing her for six months. She has no life-threatening injury today, and a pregnancy test is negative. She says that if you tell anyone she will claim she made it up, and she asks you not to call her mother because her mother does not believe her. The stepfather is not in the clinic. A senior resident suggests waiting for a forensic examination to confirm physical findings before deciding whether a report is justified."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Report the suspected abuse to child protective services without waiting for her consent",
            "Honor her request for confidentiality because she is an adolescent",
            "Confront the stepfather at the next visit and report only if he confesses",
            "Tell the mother and leave the decision to report entirely to her",
            "Delay any report until a forensic examination confirms physical findings",
        ],
        "correctAnswer": "Report the suspected abuse to child protective services without waiting for her consent",
        "explanation": (
            "Suspected child sexual abuse is a mandatory report. Adolescent confidentiality does not cover abuse, and the reporter does not need the child consent, a parent permission, the alleged abuser confession, or proof on examination. A reasonable suspicion is enough, and she has given a clear disclosure. Honor her request for confidentiality because she is an adolescent applies the ordinary privacy rule to a fact pattern that is an explicit exception. Confront the stepfather at the next visit and report only if he confesses warns the alleged abuser and withholds a report that does not depend on his admission. Tell the mother and leave the decision to report entirely to her shifts a legal duty onto a parent the patient already believes will not act. Delay any report until a forensic examination confirms physical findings confuses investigation with the threshold for reporting; many abused adolescents have no confirmatory physical finding."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-08",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 15-year-old girl has purulent cervical discharge. Nucleic acid amplification testing confirms Chlamydia trachomatis. She is not pregnant. She says her only partner is a 16-year-old classmate and that the encounters were consensual, with no force, payment, or adult involved. She asks to be treated without her parents being told because they would punish her for being sexually active. She can describe how the antibiotic is taken and why partners need treatment. The portal would automatically release the diagnosis to the parent account unless you block it."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Treat the infection and do not notify her parents of the diagnosis",
            "Refuse antibiotics until a parent signs a consent form",
            "Call her mother before writing any prescription because she is under 16",
            "Treat her but release the visit diagnosis to her parents through the portal",
            "Report the sexual activity to child protective services solely because she is 15",
        ],
        "correctAnswer": "Treat the infection and do not notify her parents of the diagnosis",
        "explanation": (
            "Minors can consent to diagnosis and treatment of a sexually transmitted infection, and that care is kept confidential. She should be treated, partner treatment discussed, and her parents not notified. The consensual same-age relationship she describes is not, by itself, a child-abuse report. Refuse antibiotics until a parent signs a consent form withholds indicated treatment to satisfy a signature the minor-consent rule does not require. Call her mother before writing any prescription because she is under 16 uses age as a blanket bar and will predictably stop her from accepting care. Treat her but release the visit diagnosis to her parents through the portal defeats confidentiality after the fact. Report the sexual activity to child protective services solely because she is 15 treats consensual peer contact, with no adult, force, or exploitation described, as if it were the abuse exception."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-09",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 16-year-old girl comes alone asking for prenatal care. Office testing confirms pregnancy at about 8 weeks. She wants to continue the pregnancy. She is hemodynamically stable, has no vaginal bleeding, and denies suicidal ideation. She says her parents have told her they would expel her from the home if she were pregnant, and she asks that they not be told. She can explain that prenatal visits, laboratories, and ultrasound are meant to protect her health and the pregnancy. A clerk says no prenatal laboratory test can be drawn without a parent signature."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Provide prenatal care under her own consent and do not disclose the pregnancy to her parents",
            "Require a parent signature before any prenatal laboratory test",
            "Notify her parents because pregnancy care is excluded from minor consent",
            "Contact the father of the baby to obtain consent for her obstetric care",
            "Refuse to see her until she agrees to a family meeting",
        ],
        "correctAnswer": "Provide prenatal care under her own consent and do not disclose the pregnancy to her parents",
        "explanation": (
            "A minor may consent to pregnancy-related care, and that information is not automatically shared with her parents. She wants to continue the pregnancy and understands the purpose of prenatal care, so care starts under her consent and the pregnancy is not disclosed. Require a parent signature before any prenatal laboratory test blocks routine care with a formality the minor-consent rule removes. Notify her parents because pregnancy care is excluded from minor consent has the exclusion backward: pregnancy care is a core category minors may consent to. Contact the father of the baby to obtain consent for her obstetric care gives authority to someone who is not her decision maker and may breach her privacy. Refuse to see her until she agrees to a family meeting conditions indicated prenatal care on a disclosure she has reason to fear."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-10",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 17-year-old boy asks to start treatment for opioid use disorder. He has daily fentanyl use, clear withdrawal symptoms, and wants buprenorphine. He is not suicidal, not intoxicated today, and can describe the risks and benefits of medication and the need for follow-up. He says that if his parents are called he will leave and keep using. A colleague says federal controlled-substance rules require a parent signature before any minor may receive buprenorphine, and that without that signature the only legal step is to discharge him with a pamphlet or to notify police of illegal drug use."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Arrange substance use treatment under his consent without requiring parental notification",
            "Refuse medication until a parent signs because he is not yet 18",
            "Notify his parents over his objection before any treatment discussion",
            "Discharge him with a pamphlet because confidentiality and controlled substances cannot be reconciled",
            "Report him to the police for illegal drug use as a condition of starting care",
        ],
        "correctAnswer": "Arrange substance use treatment under his consent without requiring parental notification",
        "explanation": (
            "Minors may consent to substance use treatment, and parental notification is not a condition of that care. He has capacity for this decision, he is asking for evidence-based treatment, and calling his parents would, on these facts, drive him away. The legalistic claim that a controlled substance cannot be started without a parent signature is the trap. Refuse medication until a parent signs because he is not yet 18 withholds treatment the minor-consent rule was written to allow. Notify his parents over his objection before any treatment discussion breaches confidentiality and is likely to end the visit. Discharge him with a pamphlet because confidentiality and controlled substances cannot be reconciled is a false conflict; confidentiality and buprenorphine treatment can proceed together. Report him to the police for illegal drug use as a condition of starting care punishes the disclosure that treatment depends on and is not a therapeutic or legal prerequisite."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-11",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "An 81-year-old woman with advanced Alzheimer disease is admitted with aspiration pneumonia. Three years ago, while she still had capacity, she completed a written directive and told her daughter, who is her designated health care agent, that if she could not recognize her family and could not eat, she did not want a feeding tube. She now recognizes no one and has no safe swallow. The daughter says she cannot watch her mother starve, asks you to place a gastrostomy tube, and states that as agent she has the legal right to override the old paper. There is no new statement from the patient."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Decline the feeding tube and follow the patient prior written directive",
            "Place the gastrostomy tube because an agent current wish overrides a prior directive",
            "Place the tube under a best-interest standard because nutrition is always beneficial",
            "Seek a court order authorizing the tube over her written refusal",
            "Start a 30-day tube trial because withholding food differs legally from withdrawing it",
        ],
        "correctAnswer": "Decline the feeding tube and follow the patient prior written directive",
        "explanation": (
            "The agent role is to apply substituted judgment: what the patient wanted, not what the agent now finds bearable. This patient left a written directive and a specific oral statement refusing a tube in exactly this circumstance. Artificial nutrition is a medical treatment she refused. The daughter grief does not create new authority to reverse that refusal. Place the gastrostomy tube because an agent current wish overrides a prior directive reverses the hierarchy; the directive constrains the agent. Place the tube under a best-interest standard because nutrition is always beneficial uses the wrong standard, because known wishes take priority over a best-interest guess, and nutrition is not automatically beneficial near the end of life. Seek a court order authorizing the tube over her written refusal asks a court to defeat a clear directive rather than to enforce it. Start a 30-day tube trial because withholding food differs legally from withdrawing it relies on a distinction ethics does not draw; withholding and withdrawing unwanted life-sustaining treatment are equivalent, and a trial she already refused is not required."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-12",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 70-year-old man remains unresponsive after a witnessed cardiac arrest. Neurologic prognosis for meaningful recovery is poor. He never named a surrogate, never stated wishes about life support, and has no advance directive. Two siblings disagree: one wants every machine continued, the other wants extubation today. Both say they have no idea what he would have wanted. No spouse, children, or other relatives exist. The older sibling says birth order should settle the question in favor of indefinite ventilation."
        ),
        "stem": "Which of the following is the most appropriate approach?",
        "options": [
            "Use the best-interest standard and an ethics consultation to resolve the sibling conflict",
            "Apply substituted judgment by assuming the older sibling knew him better",
            "Continue mechanical ventilation indefinitely because disagreement must favor life support",
            "Let the older sibling decide because birth order creates priority when wishes are unknown",
            "Withdraw support immediately without discussing burdens and benefits",
        ],
        "correctAnswer": "Use the best-interest standard and an ethics consultation to resolve the sibling conflict",
        "explanation": (
            "Substituted judgment asks what this patient would have chosen. Nobody knows, so that standard cannot be honestly applied. The decision then rests on best interest: the benefits and burdens of continued support for him, not the siblings distress alone. When equal surrogates conflict, an ethics consultation is the appropriate process rather than an invented hierarchy. Apply substituted judgment by assuming the older sibling knew him better pretends to know wishes both siblings deny having heard. Continue mechanical ventilation indefinitely because disagreement must favor life support treats conflict as a reason never to weigh burdens. Let the older sibling decide because birth order creates priority when wishes are unknown invents a legal rank the facts do not provide. Withdraw support immediately without discussing burdens and benefits skips the best-interest analysis and the conflict-resolution step the disagreement requires."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-13",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 66-year-old man cannot communicate after a large intracranial hemorrhage. Five years ago he executed a durable power of attorney for health care naming a close friend as his agent. The document is in the chart. He had told the friend he would not want prolonged ventilation if he could not recover meaningful interaction. The clinicians believe that outcome is not realistic. His wife, from whom he is not divorced, demands a tracheostomy and says a spouse outranks a friend no matter what the paper says. The friend asks that ventilation not be prolonged."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Follow the designated agent decision, which applies the patient stated wishes",
            "Follow the wife because marriage automatically cancels a durable power of attorney",
            "Poll the extended family and adopt the majority view",
            "Ask a court to appoint the wife before any decision because the agent is not a relative",
            "Continue ventilation by default until the wife and the friend sign a joint form",
        ],
        "correctAnswer": "Follow the designated agent decision, which applies the patient stated wishes",
        "explanation": (
            "A valid designation selects the decision maker. The friend is the agent and is applying the patient own statement against prolonged ventilation if meaningful interaction cannot be recovered. Marriage does not silently cancel that document. Follow the wife because marriage automatically cancels a durable power of attorney is the legalistic trap; the paper exists so that a spouse does not automatically outrank a chosen agent. Poll the extended family and adopt the majority view replaces a designated decision maker with a vote. Ask a court to appoint the wife before any decision because the agent is not a relative seeks a guardian the patient already made unnecessary by naming an agent. Continue ventilation by default until the wife and the friend sign a joint form gives the wife a veto the designation does not give her and delays a decision the agent is authorized to make."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-14",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 5,
        "scenario": (
            "A 54-year-old man received another patient morning dose of metoprolol because of a labeling error. His heart rate fell to 48 beats per minute, he felt briefly lightheaded, the dose was held, and he was monitored. By afternoon his heart rate and blood pressure are back to his baseline and he is comfortable. The charge nurse says no lasting harm was done, telling him will only make him angry and could cause a lawsuit, and the note should describe a vasovagal episode. He is awake and asks why he felt faint after the morning medicines."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Tell him a medication error occurred, what was done, and how he is being monitored",
            "Document a vasovagal episode so the record matches a harmless story",
            "Disclose the error only if he later develops heart block",
            "Ask the nurse to apologize alone and keep the physician out of the conversation",
            "Offer a settlement payment before explaining what happened",
        ],
        "correctAnswer": "Tell him a medication error occurred, what was done, and how he is being monitored",
        "explanation": (
            "The wrong drug reached the patient and caused transient bradycardia. An error that reaches a patient is disclosed even when the outcome is now back to baseline. He should hear what happened, what was done, and how he is being watched. Hiding it to avoid anger or a lawsuit is the trap these facts rule out. Document a vasovagal episode so the record matches a harmless story falsifies the chart and deceives him. Disclose the error only if he later develops heart block makes disclosure depend on a later complication instead of on the error that already occurred. Ask the nurse to apologize alone and keep the physician out of the conversation abandons the physician duty to disclose and singles out one colleague. Offer a settlement payment before explaining what happened substitutes money for the explanation he is already requesting and can look like an attempt to buy silence."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-15",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A resident discovers that a patient received 10 times the intended dose of an antibiotic because of an order-entry error. The patient is stable, the team has not yet spoken with him, and the original note correctly describes the dose given. Risk management advises deleting that note and replacing it with a note that the intended dose was given, and also changing the medication administration record, before the family requests the chart. The resident asks whether a late addendum admitting the error would only create liability."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Preserve the original note, add a timed addendum, disclose the error, and file a safety report",
            "Delete the original note so the chart shows only the intended dose",
            "Leave the inaccurate possibility uncorrected and avoid any addendum that admits an error",
            "Alter the medication administration record to match the order that should have been written",
            "Ask the patient to sign a waiver releasing the team from any duty to explain",
        ],
        "correctAnswer": "Preserve the original note, add a timed addendum, disclose the error, and file a safety report",
        "explanation": (
            "The original entry is an accurate record of what happened and must stay. New facts or a correction belong in a timed addendum. The patient is told the truth, and a safety report addresses the system. Cleaning the chart to reduce liability is the trap. Delete the original note so the chart shows only the intended dose destroys the record and hides an error that reached the patient. Leave the inaccurate possibility uncorrected and avoid any addendum that admits an error confuses honesty with silence; an addendum does not rewrite history, it completes it, and disclosure is still required. Alter the medication administration record to match the order that should have been written falsifies the dose that was actually given. Ask the patient to sign a waiver releasing the team from any duty to explain tries to contract out of a duty that cannot be waived before he even knows what happened."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-16",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "You are the resident in the operating room for an elective colectomy. The attending surgeon arrives with slurred speech, the smell of alcohol on his breath, and an unsteady gait while he reviews the consent. The patient is already anesthetized. A colleague says the attending does this sometimes, that starting the case will avoid humiliating him, and that a second surgeon can assist closely enough to make it safe. The attending says he is fine and asks everyone to keep this among the team so the schedule is not delayed."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Stop him from operating and notify the chief of service or physician health program now",
            "Allow him to operate with a second surgeon watching so the schedule is not delayed",
            "Wait until after the case and then suggest he cut back on drinking",
            "Accept his promise to drink only on weekends and tell leadership nothing",
            "Transfer the anesthetized patient to another hospital without explaining why",
        ],
        "correctAnswer": "Stop him from operating and notify the chief of service or physician health program now",
        "explanation": (
            "An impaired physician must not care for patients. Alcohol intoxication with slurred speech and an unsteady gait is present-tense impairment, the patient is anesthetized, and the case has not started in his hands. He is removed from the operation now, a qualified surgeon takes over or the case is delayed, and the chief of service or physician health program is notified. Collegial silence is the trap. Allow him to operate with a second surgeon watching so the schedule is not delayed leaves an impaired operator in control for the sake of the board. Wait until after the case and then suggest he cut back on drinking exposes this patient to harm and replaces a report with private advice. Accept his promise to drink only on weekends and tell leadership nothing relies on a promise that does not make him safe today. Transfer the anesthetized patient to another hospital without explaining why moves the patient recklessly and still fails to report the impaired surgeon."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-17",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A fellow resident tells you she has been drinking a pint of vodka every night. Two days ago she drove to the hospital still feeling buzzed and covered a ward shift. This morning she is sober, steady, and about to start another inpatient shift. She asks you to keep the story a secret between friends and says she will quit on her own. She does not want the program director or the physician health service involved. No patient has yet been identified as harmed. She plans to drive home after tonight shift."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Remove her from duty until evaluated and inform the program director or physician health service",
            "Keep her confidence because she is sober at this moment",
            "Watch her patients quietly while she works the shift",
            "Report her to the state police before speaking with any clinical supervisor",
            "Wait to act until a patient is harmed",
        ],
        "correctAnswer": "Remove her from duty until evaluated and inform the program director or physician health service",
        "explanation": (
            "She has already come to work impaired and intends to keep working and driving. A private promise to quit is not a safeguard. She should be relieved of clinical duty until she is evaluated, and the program director or physician health service must be informed so patients are protected and she can get help. Keep her confidence because she is sober at this moment uses this morning sobriety to erase a pattern of working while buzzed. Watch her patients quietly while she works the shift is informal supervision that hides the impairment instead of removing it. Report her to the state police before speaking with any clinical supervisor jumps to a criminal report and skips the clinical safety step that has to happen before tonight shift. Wait to act until a patient is harmed uses injury as the threshold; the duty to act begins when impairment threatens care, not after a bad outcome."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-18",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 42-year-old woman who is a Jehovah Witness is bleeding from a peptic ulcer. Hemoglobin is 4.8 g/dL. She is alert and oriented. She repeats back that she may die without blood and refuses red cells, platelets, and plasma for a religious reason she has held for 20 years. She accepts crystalloid, iron, and endoscopy. Her husband urges you to transfuse her once she is sedated for endoscopy, saying she will forgive you. He offers to sign a transfusion consent. She hears him and says again that she refuses blood even if she loses consciousness during the procedure."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Do not transfuse blood products and proceed with the other measures she has accepted",
            "Transfuse once she is sedated because consent for endoscopy covers blood",
            "Seek an emergency court order to override a capacitated adult religious refusal",
            "Ask her husband to sign a transfusion consent that supersedes her decision",
            "Promise to respect her refusal and transfuse if she loses consciousness during endoscopy",
        ],
        "correctAnswer": "Do not transfuse blood products and proceed with the other measures she has accepted",
        "explanation": (
            "A capacitated adult may refuse blood even when refusal may be fatal. She understands the risk, states a long-held religious reason, and extends the refusal to a later loss of consciousness. The team uses the treatments she accepts and does not transfuse. Transfuse once she is sedated because consent for endoscopy covers blood smuggles in a product she specifically excluded; sedation is not permission. Seek an emergency court order to override a capacitated adult religious refusal asks a court to do what a capacity assessment already forbids. Ask her husband to sign a transfusion consent that supersedes her decision gives a spouse no power to overrule a capacitated patient. Promise to respect her refusal and transfuse if she loses consciousness during endoscopy is a deception: she has already refused transfusion for that exact moment, and loss of consciousness does not cancel a refusal she made while capacitated."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-19",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 6-year-old boy, whose parents are Jehovah Witnesses, is in hemorrhagic shock after trauma. Hemoglobin is 5.1 g/dL and he is tachycardic despite crystalloid. The parents refuse all blood products and ask for saline only. They are devoted and are not abusive in any other way. There is not time for a completed trial before he needs transfusion, although the hospital attorney can be notified while care proceeds. The child is too young to understand the decision and is asked by a relative to sign a refusal form."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Transfuse the child while notifying the legal authorities as required",
            "Honor the parents refusal exactly as you would for a capacitated adult",
            "Delay transfusion until a full trial is completed even if he arrests",
            "Ask the child to sign a refusal form",
            "Discharge the family so they can seek care that matches their beliefs",
        ],
        "correctAnswer": "Transfuse the child while notifying the legal authorities as required",
        "explanation": (
            "Parents cannot refuse life-saving treatment for a child. Blood is indicated now, so he is transfused, and the legal process is started in parallel rather than used as a reason to wait through an arrest. This is the opposite of the capacitated adult who refuses blood. Honor the parents refusal exactly as you would for a capacitated adult imports an adult rule into a decision the child cannot make and the parents cannot impose. Delay transfusion until a full trial is completed even if he arrests prefers a finished hearing to survival when an emergency authorization path exists. Ask the child to sign a refusal form treats a 6-year-old in shock as if he had capacity. Discharge the family so they can seek care that matches their beliefs abandons a child who needs blood in this emergency department."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-20",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 5,
        "scenario": (
            "A 38-year-old woman has chronic abdominal pain. Examination, laboratories, and imaging have shown no dangerous cause. She has decision-making capacity and asks for a real strong medicine, even an injection. A resident proposes injecting saline and telling her it is a potent new analgesic, arguing that a placebo response could help and that saline has almost no medical risk. She has not been told that a placebo is being considered and has not agreed to one. The resident also suggests documenting that a new analgesic was given so her expectations stay high, or asking her husband for permission to deceive her."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Do not give a deceptive placebo; explain the findings and offer honest symptom treatment",
            "Inject saline and call it a potent new analgesic because the intention is beneficent",
            "Inject saline and call it a potent new analgesic because the risk is negligible",
            "Write in the chart that a new analgesic was given so her expectations are reinforced",
            "Ask her husband for permission to deceive her so a surrogate preserves her autonomy",
        ],
        "correctAnswer": "Do not give a deceptive placebo; explain the findings and offer honest symptom treatment",
        "explanation": (
            "A placebo in clinical care requires the patient knowledge and agreement. Calling saline a potent new analgesic is a lie, even if the motive is relief and the fluid is physiologically harmless. She should hear the evaluation results and be offered honest treatment of the symptom. Inject saline and call it a potent new analgesic because the intention is beneficent uses a good motive to justify deception. Inject saline and call it a potent new analgesic because the risk is negligible ignores that the harm is the lie and the corrupted consent, not the saline. Write in the chart that a new analgesic was given so her expectations are reinforced falsifies the record to prop up the same deception. Ask her husband for permission to deceive her so a surrogate preserves her autonomy is incoherent: she has capacity, so a husband cannot consent to a deception, and deceiving her does not preserve autonomy."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-21",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 5,
        "scenario": (
            "A 47-year-old woman who speaks only Spanish is about to learn that her breast biopsy shows invasive carcinoma. Her 11-year-old daughter is bilingual, is in the room, and says she always translates for her mother and has already looked up the word for cancer. A professional interpreter can be on the telephone within a few minutes. The daughter asks you to speak quickly so she can get back to school. The mother has not yet been told the diagnosis. There is no airway emergency or other instability that requires speech in the next minute."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Use a professional interpreter and do not have the child interpret the diagnosis",
            "Let the daughter interpret because she is bilingual and the mother trusts her",
            "Let the daughter interpret to avoid a short delay",
            "Ask the daughter to interpret only the word cancer and then continue in English",
            "Write the diagnosis in English and ask the child to read it aloud at home",
        ],
        "correctAnswer": "Use a professional interpreter and do not have the child interpret the diagnosis",
        "explanation": (
            "A child should not interpret a new cancer diagnosis when a professional interpreter is minutes away. Using the daughter burdens her with grave news, risks an inaccurate translation, and may keep the mother from asking questions. The short wait is appropriate because the patient is stable. Let the daughter interpret because she is bilingual and the mother trusts her prefers familiarity over a qualified interpreter. Let the daughter interpret to avoid a short delay treats a few minutes as if they were an emergency that justified a child interpreter. Ask the daughter to interpret only the word cancer and then continue in English still uses the child for the central disclosure and then excludes the mother from the rest of the conversation. Write the diagnosis in English and ask the child to read it aloud at home moves the same inappropriate role out of the clinic and leaves the mother without a chance to ask questions of the physician."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-22",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A capacitated patient is scheduled for carotid endarterectomy this afternoon. The attending surgeon who will perform the operation tells a third-year medical student to have her sign the consent form because the risks are on the sticker and the attending is in the laboratory. The student has never seen an endarterectomy and cannot answer questions about stroke risk. The patient asks whether she will be awake and what happens if she has a stroke during the operation. She signed a general hospital consent on admission. The circulating nurse offers to read the sticker aloud."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "The attending surgeon returns and conducts the informed consent discussion before any signature",
            "The student obtains the signature because a signed form is the consent",
            "The circulating nurse reads the sticker so the attending can remain in the laboratory",
            "No further consent is needed because she signed a general hospital consent on admission",
            "The student answers the stroke question from a textbook and then has her sign",
        ],
        "correctAnswer": "The attending surgeon returns and conducts the informed consent discussion before any signature",
        "explanation": (
            "Informed consent is a discussion by someone who understands the procedure and will perform it, covering the nature, benefits, risks, and alternatives, and answering this patient questions. A sticker and a signature are not that discussion. The attending surgeon returns and conducts the informed consent discussion before any signature. The student obtains the signature because a signed form is the consent confuses the form, which is evidence, with the consent, which is the understanding. The circulating nurse reads the sticker so the attending can remain in the laboratory delegates a discussion the nurse is not offering as the operating surgeon and leaves the stroke question unanswered by the person who should answer it. No further consent is needed because she signed a general hospital consent on admission treats an admission form as permission for a specific operation and its particular risks. The student answers the stroke question from a textbook and then has her sign still has an unqualified person obtain consent for a procedure the student does not perform."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-23",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 29-year-old man in the emergency psychiatry area says he will shoot his supervisor, whom he names, tomorrow morning in the office parking lot. He describes the gun in his car and the time the supervisor arrives. He refuses voluntary hospitalization. He says you cannot tell anyone because this is therapy. He is calm enough to give these details and does not appear intoxicated. A no-harm contract is offered by a colleague as a way to discharge him without calling anyone. He will not identify a family member who could remove the gun."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Warn law enforcement or the identified supervisor and pursue an involuntary hold",
            "Keep absolute confidentiality because the threat was made during a psychiatric interview",
            "Schedule outpatient therapy next week without warning anyone",
            "Ask him to sign a no-harm contract and then discharge him",
            "Notify his employer only of a generic stress leave without mentioning the threat",
        ],
        "correctAnswer": "Warn law enforcement or the identified supervisor and pursue an involuntary hold",
        "explanation": (
            "A credible threat aimed at an identified person, with a plan, a weapon, and a time, creates a duty to protect. Confidentiality yields. Protective steps include warning law enforcement or the named supervisor and pursuing hospitalization over his objection. Keep absolute confidentiality because the threat was made during a psychiatric interview treats therapy privacy as absolute when this is the classic exception. Schedule outpatient therapy next week without warning anyone leaves the named person exposed tomorrow morning. Ask him to sign a no-harm contract and then discharge him substitutes a piece of paper for protection; a contract does not remove a gun or a stated plan. Notify his employer only of a generic stress leave without mentioning the threat withholds the information that would let the intended victim take the warning seriously."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-24",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "A 34-year-old man in weekly therapy says that people at work annoy him so much he could scream and that the world is unfair. He denies any plan, weapon, named target, or intent to harm a particular person. He has no history of violence. He agrees to keep coming and to call if he develops a plan. A colleague says every mention of anger triggers a duty to warn the police and to warn every coworker whose name appears in the notes, and that the safe clinic response is involuntary hospitalization or termination of therapy."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Continue assessment and treatment without a duty-to-warn notification",
            "Notify the police that he is a danger to the public",
            "Warn every coworker whose name appears in the therapy notes",
            "Hospitalize him involuntarily for mentioning anger",
            "Terminate therapy so the clinic is not liable",
        ],
        "correctAnswer": "Continue assessment and treatment without a duty-to-warn notification",
        "explanation": (
            "A duty to warn requires a serious threat to an identifiable victim, not irritation expressed without a plan, a weapon, or a target. He should stay in treatment, and the clinician keeps assessing for a plan. The legalistic impulse to notify everyone is ruled out by the absence of those elements. Notify the police that he is a danger to the public overcalls a vague complaint into a public warning he does not meet. Warn every coworker whose name appears in the therapy notes broadcasts confidential material about people he has not threatened. Hospitalize him involuntarily for mentioning anger uses anger, without danger to self or others or grave disability, as if it met the standard for a hold. Terminate therapy so the clinic is not liable abandons a patient who is engaged in care and has no plan."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-25",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 4,
        "scenario": (
            "A 36-year-old man has a new diagnosis of human immunodeficiency virus infection and a detectable viral load. He understands transmission. He refuses to tell his wife, with whom he continues to have unprotected sex, and he asks you to tell her that his visits are for kidney stones if she calls. She is not your patient. He has decision-making capacity and is medically ready to start antiretroviral therapy. He says he will stop coming if you involve anyone. A partner-services nurse is available through the health department."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Decline to lie, urge him to inform his wife, and notify public health if he will not",
            "Agree to tell the wife he has kidney stones so he will keep coming to clinic",
            "Promise permanent secrecy and take no further step",
            "Call the wife yourself before giving him any chance to disclose",
            "Withhold antiretroviral therapy until he brings his wife to an appointment",
        ],
        "correctAnswer": "Decline to lie, urge him to inform his wife, and notify public health if he will not",
        "explanation": (
            "You do not deceive the wife. He is urged to tell her promptly. If he refuses, the public health department can carry out partner notification. His own treatment is not held hostage to that conversation. Agree to tell the wife he has kidney stones so he will keep coming to clinic is a lie told to preserve the relationship, and the facts rule it out. Promise permanent secrecy and take no further step leaves a sexual partner at ongoing risk after he has refused to warn her. Call the wife yourself before giving him any chance to disclose skips the step in which he is asked to disclose and makes the physician the first caller. Withhold antiretroviral therapy until he brings his wife to an appointment uses needed medicine as leverage and can worsen both his health and the risk of transmission."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-26",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "communication",
        "difficulty": 4,
        "scenario": (
            "A 33-year-old woman, capacitated and financially independent, discloses that her boyfriend hit her last night. She has a bruise on her arm, is not elderly, and is not dependent on him for basic care. No children live in the home. She says she is not ready to involve the police and that she has a safe place to stay tonight with her sister. She asks you not to file a police report. She accepts a written hotline number and a safety plan. Her boyfriend is in the waiting room and does not know what she has said."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Provide safety planning and resources without filing a police report against her wishes",
            "File a police report because intimate-partner violence is reported like child abuse",
            "Report her to child protective services even though no child lives in the home",
            "Refuse further medical care until she leaves the relationship",
            "Invite the boyfriend in from the waiting room to discuss the bruise together",
        ],
        "correctAnswer": "Provide safety planning and resources without filing a police report against her wishes",
        "explanation": (
            "A capacitated, nondependent adult who discloses intimate-partner violence is offered safety planning, resources, and follow-up. She is not a child and not a vulnerable elder, no child lives in the home, and she has a safe place tonight. Filing a police report against her stated wishes is the legalistic trap that confuses this situation with mandatory child-abuse reporting. File a police report because intimate-partner violence is reported like child abuse applies the child-protection statute to an adult who can decide. Report her to child protective services even though no child lives in the home invents a child victim. Refuse further medical care until she leaves the relationship punishes her for not leaving and abandons ongoing care. Invite the boyfriend in from the waiting room to discuss the bruise together exposes her disclosure to the person who hit her and can increase the danger."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-27",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 4,
        "scenario": (
            "An 86-year-old woman depends on her son for bathing, finances, and medications. She is brought in with stage 3 pressure ulcers, an empty donepezil bottle that should have been refilled weeks ago, and visible fear when the son speaks. She whispers that you must not report him because he will put her in a home and she would rather stay. She can state the year and can name you. The son will not leave the room until you ask him to step out. Adult protective services accepts reports of suspected abuse or neglect of dependent older adults."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Report suspected elder abuse or neglect to adult protective services",
            "Keep her disclosure secret because she has decision-making capacity",
            "Honor her request exactly as you would for a nondependent adult who declines a police report",
            "Confront the son and close the case if he promises to reposition her",
            "Document the ulcers as unavoidable and take no protective action",
        ],
        "correctAnswer": "Report suspected elder abuse or neglect to adult protective services",
        "explanation": (
            "She is a dependent older adult with findings that suggest neglect or abuse: advanced pressure ulcers, a medication that was not supplied, and fear of the caregiver. Suspected elder abuse is reported to adult protective services. Her wish to avoid a residential move does not cancel that duty, even if she can state the year. Keep her disclosure secret because she has decision-making capacity confuses capacity for ordinary choices with the mandatory-report duty owed to a vulnerable elder. Honor her request exactly as you would for a nondependent adult who declines a police report imports the intimate-partner rule for an independent adult into elder neglect. Confront the son and close the case if he promises to reposition her warns the caregiver and replaces an investigation with a promise. Document the ulcers as unavoidable and take no protective action ignores the empty medication bottle and her fear and leaves her in the same care."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "eth-28",
        "blueprintDomain": "social-sciences",
        "subjectId": "ethics",
        "taskCategory": "professionalism",
        "difficulty": 5,
        "scenario": (
            "A 7-year-old boy has newly diagnosed acute lymphoblastic leukemia with a high expected cure rate if chemotherapy is started. He now has fever and neutropenia. His parents refuse chemotherapy and request only prayer. They are devoted, the home is otherwise safe, and they say parental authority is absolute, the same as an adult refusal of care. He is too young to understand chemotherapy. They ask to take him home tonight. Child protective services and the hospital attorney are available, and antibiotics for febrile neutropenia are ready."
        ),
        "stem": "Which of the following is the most appropriate next step?",
        "options": [
            "Begin emergency treatment as needed and seek legal authority to provide chemotherapy",
            "Accept the parents refusal because parental autonomy equals an adult refusal of care",
            "Discharge him to prayer without notifying child protective services or a court",
            "Wait for the parents to change their minds while neutropenia goes untreated",
            "Ask the 7-year-old to sign consent for chemotherapy",
        ],
        "correctAnswer": "Begin emergency treatment as needed and seek legal authority to provide chemotherapy",
        "explanation": (
            "Parents may not refuse life-saving treatment of a child when the expected benefit is high. Febrile neutropenia is treated now, and legal authority is sought so chemotherapy can proceed. Parental devotion does not extend adult refusal rules to a child. Accept the parents refusal because parental autonomy equals an adult refusal of care is the legalistic trap; an adult may refuse for himself, and these parents may not refuse a high-cure therapy for him. Discharge him to prayer without notifying child protective services or a court abandons a child with a treatable cancer and skips the report that medical neglect requires. Wait for the parents to change their minds while neutropenia goes untreated risks death from infection during a delay that is not medically acceptable. Ask the 7-year-old to sign consent for chemotherapy assigns the decision to a child who cannot understand it; the remedy is emergency care and a legal process, not his signature."
        ),
        "ref": "ama-ethics",
    },
    {
        "id": "dev-01",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 22-month-old girl had a normal prenatal course. She sat at 6 months, walked at 12 months, and used several single words by 15 months. Over the past three months she has stopped using those words, lost purposeful hand use, and wrings her hands together in the midline for long periods. Head circumference was at the 50th percentile at 9 months and is now at the 10th percentile, crossing downward. Hearing testing last month was normal. There is no history of abuse and no new sibling. Motor skills she had already mastered are slipping rather than merely slow to appear."
        ),
        "stem": "Which of the following best interprets this developmental course?",
        "options": [
            "Loss of skills she had already attained, indicating regression rather than simple delay",
            "Isolated speech delay in a child who has not yet had a chance to develop language",
            "Autism spectrum disorder as a static social delay without loss of purposeful hand use",
            "Normal separation anxiety after a developmental plateau and a new sibling",
            "Global developmental delay in a child who never attained motor or language milestones",
        ],
        "correctAnswer": "Loss of skills she had already attained, indicating regression rather than simple delay",
        "explanation": (
            "Delay means a skill has not been acquired on time. Regression means a skill that was present is lost. She walked, used words, and used her hands, and those abilities are now gone, with decelerating head growth and hand wringing. That pattern is regression, classically concerning for Rett syndrome in a girl, not a child who is merely late. Hearing is normal, so the language loss is not deafness. Isolated speech delay in a child who has not yet had a chance to develop language ignores words she already had and the loss of hand use. Autism spectrum disorder as a static social delay without loss of purposeful hand use does not fit acquired microcephaly, hand wringing, and loss of skills that were already attained. Normal separation anxiety after a developmental plateau and a new sibling requires a stressor and a temporary behavioral change, not loss of walking-era skills and head-growth failure; there is no new sibling. Global developmental delay in a child who never attained motor or language milestones describes a child who was always behind, which this history contradicts."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-02",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 4-year-old boy was fully toilet trained by day and by night for eight months. Two weeks after his sister was born he began wetting the bed four nights a week. He has no dysuria, no daytime polyuria, and no polydipsia. Daytime continence is preserved. Growth is tracking at the same percentiles. Gait, lower-extremity reflexes, and sacral skin are normal. His parents worry that bedwetting means a global developmental delay and ask for a medication tonight. He is otherwise playing, talking in sentences, and attending preschool."
        ),
        "stem": "Which of the following best interprets the new bedwetting?",
        "options": [
            "Transient regression of a previously mastered skill during a psychosocial stress",
            "Primary nocturnal enuresis because he never achieved nighttime continence",
            "Global developmental delay requiring a cognitive diagnosis before any reassurance",
            "Diabetes mellitus as the leading explanation despite no polyuria or polydipsia",
            "Spinal cord tethering as the leading explanation despite a normal gait and exam",
        ],
        "correctAnswer": "Transient regression of a previously mastered skill during a psychosocial stress",
        "explanation": (
            "He had already been dry for eight months, so the skill was mastered. Losing it for a short time after a sibling birth, with a normal exam and no urinary or endocrine red flags, is regression under stress, not failure ever to develop. Reassurance and watchful follow-up fit the facts better than a new disease label. Primary nocturnal enuresis because he never achieved nighttime continence is the wrong category: primary enuresis means he was never dry for a sustained period, and he was. Global developmental delay requiring a cognitive diagnosis before any reassurance overreads one lost skill in a child who speaks in sentences, plays, and attends preschool. Diabetes mellitus as the leading explanation despite no polyuria or polydipsia would be suggested by excessive thirst and urine, which are absent, and would not spare daytime continence in this story. Spinal cord tethering as the leading explanation despite a normal gait and exam would be suggested by gait change, reflex changes, or a sacral finding, none of which are present."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-03",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 12-year-old girl has had breast development for 18 months and is now Tanner breast stage 3. Pubic hair has been present for 6 months and is Tanner stage 2. She has not had menses. Height velocity was rapid over the past year and is now slowing. Her mother is worried that pubic hair is supposed to come first and that periods should have started before breasts. There is no virilization and no galactorrhea. Bone age is 12 years, in keeping with her pubertal stage. Thelarche began after age 8."
        ),
        "stem": "Which of the following best interprets this sequence?",
        "options": [
            "Normal female puberty in which thelarche precedes pubarche and menarche follows the growth spurt",
            "Disordered puberty because pubarche must precede thelarche",
            "Primary amenorrhea workup now because menses should precede breast development",
            "Central precocious puberty because breast development began before age 13",
            "Peripheral androgen excess because any pubic hair means an adrenal tumor",
        ],
        "correctAnswer": "Normal female puberty in which thelarche precedes pubarche and menarche follows the growth spurt",
        "explanation": (
            "In girls, gonadarche starts with thelarche. Pubarche follows, the growth spurt occurs around mid-puberty, and menarche usually comes about two to two and a half years after breast budding, often near Tanner stage 4. Breast budding at about age 10 and a half, pubic hair later, a growth spurt, bone age matching chronologic age, and no menses yet at 18 months after thelarche is an ordinary sequence. Disordered puberty because pubarche must precede thelarche reverses the order: breast development, not pubic hair, is the first sign of ovarian puberty. Primary amenorrhea workup now because menses should precede breast development uses an impossible order; primary amenorrhea is considered at about age 15 or three years after thelarche, not before breasts. Central precocious puberty because breast development began before age 13 misstates the threshold: precocious puberty in girls is secondary sexual development before age 8, and age 10 and a half is within the normal window. Peripheral androgen excess because any pubic hair means an adrenal tumor overreads normal pubarche; a tumor would virilize and advance growth and bone age out of proportion, which is not described."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-04",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 7-year-old boy has adult-type axillary odor and Tanner stage 2 pubic hair. Testicular volume is 2 mL on each side, and the penis is prepubertal. Height velocity is normal for age. Bone age is 7 years 6 months. He has no headache, no cafe-au-lait spots, and no exposure to testosterone gel. A parent believes puberty has started in the normal male order and that pubic hair is the first sign, with testicular growth expected later. Serum studies are still pending."
        ),
        "stem": "Which of the following best interprets the source of these changes?",
        "options": [
            "Adrenal androgens without activation of the hypothalamic-pituitary-gonadal axis",
            "Central precocious puberty driven by gonadotropins, which would enlarge the testes",
            "Normal male gonadarche in which pubic hair comes first and the testes enlarge later",
            "Klinefelter syndrome, which presents with tall stature and small firm testes after puberty",
            "Constitutional delay, which presents with absent pubic hair and a delayed bone age",
        ],
        "correctAnswer": "Adrenal androgens without activation of the hypothalamic-pituitary-gonadal axis",
        "explanation": (
            "True male puberty, gonadarche, begins with testicular enlargement to about 4 mL or more, because luteinizing hormone drives the Leydig cells and follicle-stimulating hormone enlarges the tubules. Pubic hair and apocrine odor with testes still at 2 mL mean the androgens are coming from the adrenal zona reticularis, as in premature adrenarche, not from a pubertal pituitary. Bone age and height velocity are essentially normal, which argues against a rapidly progressive adrenal tumor. Central precocious puberty driven by gonadotropins, which would enlarge the testes, is ruled out by prepubertal testicular volume. Normal male gonadarche in which pubic hair comes first and the testes enlarge later reverses the sequence: testicular growth is first, and pubic hair is not. Klinefelter syndrome, which presents with tall stature and small firm testes after puberty, is a later hypergonadotropic picture, not isolated pubic hair at age 7 with a normal bone age. Constitutional delay, which presents with absent pubic hair and a delayed bone age, is a late-bloomer pattern, the opposite of early pubic hair."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-05",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 3-year-old boy who was born at 28 weeks walks on his toes, scissors his legs when he tries to run, and has brisk deep-tendon reflexes with a few beats of clonus at the ankles. Stroking the sole makes the great toe extend. When his head is turned to one side, the arm and leg on that side extend and the opposite limbs flex, and this fencing posture is obligatory rather than brief. A relative says babies do those things and that he will outgrow the reflexes if the family waits until school age. He is not hypotonic."
        ),
        "stem": "Which of the following best interprets the persistent reflexes?",
        "options": [
            "Persistent primitive reflexes indicating an upper motor neuron lesion",
            "A normal residual of infancy that should be observed until school age",
            "A lower motor neuron lesion, which would abolish reflexes and produce flaccid weakness",
            "Isolated delay of walking with an intact corticospinal tract",
            "A cerebellar sign, which would present with hypotonia and hyporeflexia rather than clonus",
        ],
        "correctAnswer": "Persistent primitive reflexes indicating an upper motor neuron lesion",
        "explanation": (
            "The asymmetric tonic neck reflex and the extensor plantar response are normal early in infancy and should be gone well before age 3. An obligatory fencing response, an upgoing toe, toe walking, scissoring, brisk reflexes, and clonus together mean the corticospinal tract is not inhibiting the primitive pattern. That is an upper motor neuron picture, often cerebral palsy after prematurity, not a reflex he will simply outgrow. A normal residual of infancy that should be observed until school age ignores how late and how obligatory these responses are. A lower motor neuron lesion, which would abolish reflexes and produce flaccid weakness, is the opposite of clonus and hyperreflexia. Isolated delay of walking with an intact corticospinal tract would not add an obligatory primitive reflex, a Babinski sign, and spasticity. A cerebellar sign, which would present with hypotonia and hyporeflexia rather than clonus, does not fit a child who is spastic and hyperreflexic rather than floppy."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-06",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "An 8-year-old child agrees that two identical cups hold the same amount of water. After one cup is poured into a tall thin glass, she says the amount is unchanged because it could be poured back. She lines sticks up from shortest to longest without help. Asked what makes a pendulum swing faster, she changes the weight, the string length, and the push all at once and cannot say which variable matters. She will not reason about a world in which gravity is absent. She is past the age of simple pretend play and attends second grade."
        ),
        "stem": "Which of the following best interprets these tasks?",
        "options": [
            "Concrete operational stage: conservation and seriation are present, but she cannot isolate hypothetical variables",
            "Formal operational stage: she should already isolate one pendulum variable at a time",
            "Preoperational stage: conservation of liquid is expected to fail, yet appearance still dominates her answer",
            "Sensorimotor stage: seriation is achieved before object permanence and does not require conservation",
            "Trust versus mistrust: the pendulum result is an attachment finding rather than a cognitive stage",
        ],
        "correctAnswer": "Concrete operational stage: conservation and seriation are present, but she cannot isolate hypothetical variables",
        "explanation": (
            "Conservation of liquid and seriation of sticks are concrete operational achievements, typical of the early school years. The pendulum task requires holding other variables constant and testing one at a time, which is formal operational and usually appears later. A nearby younger stage would fail the conservation she just passed. She is therefore in the concrete operational stage. Formal operational stage: she should already isolate one pendulum variable at a time describes the stage she has not reached; changing every variable at once is exactly the failure. Preoperational stage: conservation of liquid is expected to fail, yet appearance still dominates her answer does not fit, because she said the amount was unchanged and cited reversibility, so appearance did not dominate. Sensorimotor stage: seriation is achieved before object permanence and does not require conservation reverses development; object permanence is an infant achievement, and seriation comes much later. Trust versus mistrust: the pendulum result is an attachment finding rather than a cognitive stage imports an Erikson psychosocial crisis into a reasoning task about volume and variables."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-07",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 4-year-old boy pretends a wooden block is a truck and talks about his grandmother, who is not in the room. When two equal rows of coins are spread so that one row looks longer, he insists that the longer-looking row has more coins. On a three-mountain model he points to his own view when asked what a doll seated on the opposite side sees. He does search under a cloth for a toy he watched you hide. His sentences are clear, and he is not yet in school."
        ),
        "stem": "Which of the following best interprets these tasks?",
        "options": [
            "Preoperational stage: symbolic play is present, but conservation and another person viewpoint fail",
            "Concrete operational stage: he would pass conservation of number and the three-mountain task",
            "Formal operational stage: pretend play appears only after abstract hypothetical reasoning",
            "Sensorimotor stage: he would not yet show symbolic play about an absent person",
            "Concrete operational success: finding a hidden toy means he can already conserve number",
        ],
        "correctAnswer": "Preoperational stage: symbolic play is present, but conservation and another person viewpoint fail",
        "explanation": (
            "Symbolic pretend play and language about an absent person mark the preoperational years. Failing conservation of number, because the spread-out row looks like more, and failing the three-mountain task, because he reports only his own viewpoint, are the limits of that stage. A concrete operational child nearby in age would pass both of those tasks. Searching under a cloth shows object permanence, which he already achieved earlier and which does not move him into the next stage. Concrete operational stage: he would pass conservation of number and the three-mountain task is what he did not do. Formal operational stage: pretend play appears only after abstract hypothetical reasoning reverses the order; pretend play is early, and hypothetical reasoning is adolescent. Sensorimotor stage: he would not yet show symbolic play about an absent person fits an infant, not a child who talks about his grandmother and pretends with a block. Concrete operational success: finding a hidden toy means he can already conserve number treats object permanence as if it were conservation, which his coin answer shows he lacks."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-08",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 14-month-old infant plays with toys while her mother sits nearby and sometimes brings a toy back to show her. When the mother steps out of the room, the infant cries and crawls to the door. When the mother returns, the infant reaches to be picked up, calms within about a minute, and goes back to the toys. She had resisted being held by a stranger a few minutes earlier. The mother has been the consistent caregiver since birth. The examiner wonders whether crying at the door means the attachment is insecure."
        ),
        "stem": "Which of the following best interprets the reunion behavior?",
        "options": [
            "Secure attachment: she protests the separation and calms, then returns to exploration",
            "Avoidant attachment: little protest and little seeking of comfort on reunion",
            "Ambivalent attachment: she would remain inconsolable and angry after the caregiver returns",
            "Disorganized attachment: freezing or contradictory approach and fear of the caregiver",
            "Disinhibited social engagement: she would accept comfort equally from the stranger",
        ],
        "correctAnswer": "Secure attachment: she protests the separation and calms, then returns to exploration",
        "explanation": (
            "Secure attachment uses the caregiver as a base. The infant explores while the mother is present, protests when she leaves, seeks contact when she returns, is comforted quickly, and resumes play. Crying at the door is the protest, not evidence against security. She also distinguishes her mother from a stranger. Avoidant attachment: little protest and little seeking of comfort on reunion is the pattern she did not show; an avoidant infant would keep playing and would not reach to be picked up. Ambivalent attachment: she would remain inconsolable and angry after the caregiver returns does not fit a child who calms within a minute. Disorganized attachment: freezing or contradictory approach and fear of the caregiver would look like approaching and then freezing or showing fear, which is not described. Disinhibited social engagement: she would accept comfort equally from the stranger is excluded by her resistance to the stranger and her selective comfort from her mother."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-09",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 3-year-old boy spent his first two years moving between institutions and had no consistent caregiver. In the exam room he climbs into the examiner lap within a minute, asks to go home with the examiner, and does not look back at the foster parent who brought him. He greeted the receptionist with the same immediate familiarity. He speaks in sentences and points to show the foster parent a toy, so social communication is not absent. There is no motor regression and no fever. The foster parent says this happens with every new adult. He is not afraid of the examiner."
        ),
        "stem": "Which of the following best interprets this approach to strangers?",
        "options": [
            "Disinhibited social engagement after early absence of a selective attachment figure",
            "Secure attachment, because friendliness with adults means the separation did no harm",
            "Normal stranger anxiety, which would make him cling to the foster parent and refuse the examiner",
            "Autism spectrum disorder, which would reduce social approach rather than produce indiscriminate approach",
            "Avoidant attachment limited to one caregiver, which would not include leaving with a stranger just met",
        ],
        "correctAnswer": "Disinhibited social engagement after early absence of a selective attachment figure",
        "explanation": (
            "After early care with no stable attachment figure, some children approach any adult, sit in a stranger lap, and are willing to leave with someone they just met. That indiscriminate pattern, repeated with the receptionist and the examiner, and without checking back with the foster parent, is disinhibited social engagement. Preserved sentences and pointing make a primary social-communication disorder less likely. Secure attachment, because friendliness with adults means the separation did no harm, misreads indiscriminate friendliness as security; a secure child prefers a familiar caregiver and uses that person as a base. Normal stranger anxiety, which would make him cling to the foster parent and refuse the examiner, is the opposite of climbing into a new lap. Autism spectrum disorder, which would reduce social approach rather than produce indiscriminate approach, is unlikely when he is socially eager, points to show toys, and speaks in sentences. Avoidant attachment limited to one caregiver, which would not include leaving with a stranger just met, describes coolness toward a specific caregiver, not a willingness to depart with every new adult."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-10",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 14-year-old boy has not started puberty. Testicular volume is 3 mL on each side. Height has tracked at the 5th percentile with a normal prepubertal velocity. Bone age is 11 years. His father did not shave until age 17 and was short until late in high school. The boy identifies coffee, smoke, and soap by smell without difficulty. There is no gynecomastia. Luteinizing hormone and follicle-stimulating hormone are low but appropriate for the bone age. He is worried that something is permanently wrong."
        ),
        "stem": "Which of the following best interprets the delayed puberty?",
        "options": [
            "Constitutional delay of growth and puberty, with bone age delayed in keeping with late maturation",
            "Central precocious puberty, which would show an advanced bone age and enlarged testes",
            "Kallmann syndrome, which would include anosmia from failed migration of olfactory neurons",
            "Klinefelter syndrome, which would show small firm testes, tall stature, and high gonadotropins",
            "Familial short stature, which would show a bone age equal to chronologic age and puberty on time",
        ],
        "correctAnswer": "Constitutional delay of growth and puberty, with bone age delayed in keeping with late maturation",
        "explanation": (
            "Constitutional delay is a late but intact maturational clock. Height tracks at a low percentile, velocity is normal for the prepubertal state, bone age is delayed toward the height age, a parent was a late bloomer, smell is intact, and gonadotropins fit the bone age rather than a broken axis. Puberty is expected to arrive late and then proceed. Central precocious puberty, which would show an advanced bone age and enlarged testes, is the opposite problem: early development, not absent development at 14. Kallmann syndrome, which would include anosmia from failed migration of olfactory neurons, is excluded by normal smell of coffee, smoke, and soap. Klinefelter syndrome, which would show small firm testes, tall stature, and high gonadotropins, is a primary testicular problem with elevated follicle-stimulating hormone, not low gonadotropins appropriate for a delayed bone age and a late-bloomer father. Familial short stature, which would show a bone age equal to chronologic age and puberty on time, fits short parents with a mature skeleton, not bone age 11 at chronologic age 14."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-11",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 7-year-old girl developed breast buds six months ago and is now Tanner breast stage 3. Height velocity over the recent interval is 9 cm per year. Bone age is 10 years. After gonadotropin-releasing hormone stimulation, luteinizing hormone rises into the pubertal range. She has no cafe-au-lait macule, no exposure to estrogen cream, and no vaginal bleeding. Headache and visual symptoms are absent. A relative calls this either a harmless early breast bud or a late-bloomer pattern."
        ),
        "stem": "Which of the following best interprets the early breast development?",
        "options": [
            "Central precocious puberty from early gonadotropin release, with bone age advanced",
            "Premature thelarche, which is isolated breast development with a normal bone age and normal growth velocity",
            "Constitutional delay, which delays bone age and postpones puberty rather than advancing them",
            "McCune-Albright syndrome, which is gonadotropin-independent and would not produce a pubertal luteinizing hormone rise",
            "Premature adrenarche, which adds pubic hair from adrenal androgens without a pubertal luteinizing hormone response",
        ],
        "correctAnswer": "Central precocious puberty from early gonadotropin release, with bone age advanced",
        "explanation": (
            "Breast development before age 8, rapid linear growth, and a bone age advanced to 10 years mean puberty is not only early but skeletally consequential. A pubertal luteinizing hormone rise after gonadotropin-releasing hormone stimulation shows the pituitary has been activated, so the process is central. Premature thelarche, which is isolated breast development with a normal bone age and normal growth velocity, is a toddler pattern of breast buds without a growth spurt or an advanced skeleton, unlike Tanner stage 3 and 9 cm per year. Constitutional delay, which delays bone age and postpones puberty rather than advancing them, cannot describe a 7-year-old who is already mid-pubertal. McCune-Albright syndrome, which is gonadotropin-independent and would not produce a pubertal luteinizing hormone rise, also brings cafe-au-lait macules and fibrous dysplasia, and the luteinizing hormone would stay prepubertal. Premature adrenarche, which adds pubic hair from adrenal androgens without a pubertal luteinizing hormone response, does not produce progressive breast development driven by a luteinizing hormone rise."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-12",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 17-year-old boy has no facial or axillary hair, a high voice, and testicular volume of 2 mL on each side. He cannot smell coffee or smoke and says he has never noticed odors. Luteinizing hormone and follicle-stimulating hormone are low, and testosterone is low. Karyotype is 46,XY. There is no gynecomastia. When he hops on one foot, the other foot moves with it. A clinician suggests this is only a late bloomer, or that small testes with low testosterone must be Klinefelter syndrome."
        ),
        "stem": "Which of the following best interprets the missing puberty?",
        "options": [
            "Failed migration of gonadotropin-releasing hormone neurons with the olfactory axons",
            "Klinefelter syndrome, which is primary hypogonadism with high gonadotropins and a 47,XXY line",
            "Androgen insensitivity, which produces a phenotypic female because the receptor cannot respond",
            "Constitutional delay alone, which preserves the sense of smell and eventually triggers puberty",
            "5-alpha-reductase deficiency, which virilizes the body at puberty under testosterone itself",
        ],
        "correctAnswer": "Failed migration of gonadotropin-releasing hormone neurons with the olfactory axons",
        "explanation": (
            "Gonadotropin-releasing hormone neurons migrate from the olfactory placode along olfactory axons. When that migration fails, puberty never starts from lack of gonadotropin-releasing hormone, the gonadotropins and testosterone stay low, and smell is lost. Mirror movements are part of the same Kallmann picture. The 46,XY karyotype and absent gynecomastia fit hypogonadotropic hypogonadism. Klinefelter syndrome, which is primary hypogonadism with high gonadotropins and a 47,XXY line, would raise follicle-stimulating hormone and show an extra X, and smell would be normal. Androgen insensitivity, which produces a phenotypic female because the receptor cannot respond, does not produce a male phenotype with low testosterone. Constitutional delay alone, which preserves the sense of smell and eventually triggers puberty, cannot explain anosmia or synkinesia at age 17. 5-alpha-reductase deficiency, which virilizes the body at puberty under testosterone itself, allows a testosterone-mediated puberty and does not remove the sense of smell or suppress gonadotropins from birth of the axis."
        ),
        "ref": "langman-embryo",
    },
    {
        "id": "dev-13",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 15-year-old girl is 142 cm tall and has a webbed neck, widely spaced nipples, and a coarctation of the aorta that was repaired in infancy. Breasts are Tanner stage 1, she has had no menarche, follicle-stimulating hormone is high, and estradiol is low. Ultrasound shows a small uterus and streak gonads. Karyotype is 45,X. She asks why puberty did not start. A relative wonders whether the problem is an androgen receptor, an extra X in the testes, or a missing gonadotropin-releasing hormone signal."
        ),
        "stem": "Which mechanism best accounts for the absent puberty?",
        "options": [
            "Ovarian dysgenesis with early loss of oocytes, so estrogen is not produced and gonadotropins rise",
            "Androgen receptor resistance, which would leave testosterone unable to act in a 46,XY fetus",
            "Seminiferous tubule hyalinization from an extra X chromosome, as in Klinefelter syndrome",
            "Failed migration of gonadotropin-releasing hormone neurons, which would lower follicle-stimulating hormone",
            "Excess antimullerian hormone from functioning testes, which would remove the uterus",
        ],
        "correctAnswer": "Ovarian dysgenesis with early loss of oocytes, so estrogen is not produced and gonadotropins rise",
        "explanation": (
            "A 45,X karyotype leads to loss of oocytes and streak gonads. Without ovarian estrogen, breasts and menses do not develop, and follicle-stimulating hormone rises because there is no feedback. A uterus is present because she never had testes to secrete antimullerian hormone. Short stature, neck webbing, and coarctation are the surrounding Turner phenotype, but the absent puberty itself is ovarian failure. Androgen receptor resistance, which would leave testosterone unable to act in a 46,XY fetus, produces a phenotypic female with testes, breasts from aromatized testosterone, and no uterus. Seminiferous tubule hyalinization from an extra X chromosome, as in Klinefelter syndrome, is a 47,XXY male problem, not a short girl with streak gonads. Failed migration of gonadotropin-releasing hormone neurons, which would lower follicle-stimulating hormone, is Kallmann syndrome; her follicle-stimulating hormone is high, not low. Excess antimullerian hormone from functioning testes, which would remove the uterus, is incompatible with a visible uterus and streak gonads."
        ),
        "ref": "langman-embryo",
    },
    {
        "id": "dev-14",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "An 18-year-old man is tall, with long arms, bilateral gynecomastia, and firm testes measuring about 4 mL. Two semen analyses show azoospermia. Luteinizing hormone and follicle-stimulating hormone are high, testosterone is low-normal, and a Barr body is present on a buccal smear. Smell is normal. Karyotype is 47,XXY. He has completed a male puberty that is incomplete at the testes. He wants to know why there are no sperm."
        ),
        "stem": "Which mechanism best accounts for the azoospermia?",
        "options": [
            "Hyalinization and fibrosis of the seminiferous tubules caused by the extra X chromosome",
            "Failed migration of gonadotropin-releasing hormone neurons, which would suppress both gonadotropins",
            "Androgen receptor mutation, which would produce breasts in a phenotypic female without a uterus",
            "45,X gonadal dysgenesis, which produces short stature, streak gonads, and a female phenotype",
            "5-alpha-reductase deficiency, which blocks dihydrotestosterone but does not add a Barr body",
        ],
        "correctAnswer": "Hyalinization and fibrosis of the seminiferous tubules caused by the extra X chromosome",
        "explanation": (
            "An extra X chromosome progressively destroys the seminiferous tubules by hyalinization and fibrosis, so sperm are absent and the testes stay small and firm. Follicle-stimulating hormone rises because inhibin and spermatogenesis fail, and Leydig cell dysfunction leaves testosterone low-normal with a high luteinizing hormone. The Barr body is the extra X. Gynecomastia reflects the altered testosterone-to-estrogen balance. Smell is normal, so this is not a migration defect. Failed migration of gonadotropin-releasing hormone neurons, which would suppress both gonadotropins, would lower luteinizing hormone and follicle-stimulating hormone, not raise them. Androgen receptor mutation, which would produce breasts in a phenotypic female without a uterus, is androgen insensitivity, not a tall man with testes and a Barr body. 45,X gonadal dysgenesis, which produces short stature, streak gonads, and a female phenotype, is Turner syndrome. 5-alpha-reductase deficiency, which blocks dihydrotestosterone but does not add a Barr body, does not create an XXY karyotype, high gonadotropins from tubular sclerosis, or gynecomastia as the main picture."
        ),
        "ref": "langman-embryo",
    },
    {
        "id": "dev-15",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 16-year-old adolescent who has been raised as a girl has primary amenorrhea. Breasts are Tanner stage 4. Axillary and pubic hair are scant. The vagina ends in a blind pouch, and ultrasound shows no uterus. Gonads consistent with testes are undescended. Karyotype is 46,XY. Serum testosterone is in the adult male range, luteinizing hormone is elevated, and estradiol is measurable from peripheral conversion. She has no cyclic pelvic pain. Height is above average, and there is no webbed neck."
        ),
        "stem": "Which mechanism best accounts for the breasts and the absent uterus?",
        "options": [
            "Androgen receptor defect: testosterone is aromatized to estrogen, while antimullerian hormone still suppresses the uterus",
            "Mullerian agenesis: a 46,XX karyotype, normal female testosterone, and normal pubic hair",
            "45,X ovarian dysgenesis: no spontaneous breast development, high follicle-stimulating hormone, and low estradiol",
            "5-alpha-reductase deficiency: the phenotype virilizes at puberty and breasts do not develop",
            "Kallmann syndrome: gonadotropins and testosterone are low, and a uterus would still be absent only if testes were present",
        ],
        "correctAnswer": "Androgen receptor defect: testosterone is aromatized to estrogen, while antimullerian hormone still suppresses the uterus",
        "explanation": (
            "Complete androgen insensitivity is a 46,XY androgen receptor defect. The testes still secrete antimullerian hormone, so the uterus does not form, and they secrete testosterone, which cannot act on hair follicles or external male genitalia. Peripheral aromatization of that testosterone to estradiol produces breasts. Luteinizing hormone is high because androgen feedback at the receptor fails. That single mechanism accounts for both the breast development and the absent uterus. Mullerian agenesis: a 46,XX karyotype, normal female testosterone, and normal pubic hair removes the uterus but leaves ovaries, female-range testosterone, and normal sexual hair, unlike male-range testosterone and scant hair. 45,X ovarian dysgenesis: no spontaneous breast development, high follicle-stimulating hormone, and low estradiol is Turner syndrome, with streak gonads, short stature, and a uterus. 5-alpha-reductase deficiency: the phenotype virilizes at puberty and breasts do not develop, because testosterone action is intact and only dihydrotestosterone was missing in fetal life. Kallmann syndrome: gonadotropins and testosterone are low, and a uterus would still be absent only if testes were present, but low testosterone would not create Tanner stage 4 breasts or a male-range testosterone level."
        ),
        "ref": "langman-embryo",
    },
    {
        "id": "dev-16",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 20-month-old girl has fallen from the 50th percentile to the 5th percentile for weight over four months. Height remains near the 50th percentile. She drinks large volumes of juice and eats little protein or fat. Development and the neurologic examination are normal. There is no diarrhea and no fever. Midparental height is average. A recent bone-age film is not delayed. Her parents ask whether this pattern means she needs growth hormone or has precocious puberty because a cousin was treated for early puberty."
        ),
        "stem": "Which of the following best interprets the growth pattern?",
        "options": [
            "Inadequate calories, which slow weight gain before they slow linear growth",
            "Growth hormone deficiency, which slows linear growth and bone age while weight is relatively preserved",
            "Constitutional delay, which is a later pubertal pattern with a delayed bone age and a late-bloomer family",
            "Precocious puberty, which accelerates height velocity and advances the bone age",
            "Hypothyroidism as the best fit, which would slow height at least as early as weight and delay the bone age",
        ],
        "correctAnswer": "Inadequate calories, which slow weight gain before they slow linear growth",
        "explanation": (
            "When intake is short, weight percentile falls first and height is spared until the deficit is prolonged. Juice instead of protein and fat, a drop from the 50th to the 5th percentile for weight, height still at the 50th, and a bone age that is not delayed match inadequate calories. Growth hormone deficiency, which slows linear growth and bone age while weight is relatively preserved, would pull height down and delay the skeleton, often with a chubby appearance, not an isolated weight drop. Constitutional delay, which is a later pubertal pattern with a delayed bone age and a late-bloomer family, is not a diagnosis at 20 months with an on-time bone age and average parents. Precocious puberty, which accelerates height velocity and advances the bone age, speeds linear growth rather than dropping weight. Hypothyroidism as the best fit, which would slow height at least as early as weight and delay the bone age, would not leave height on the 50th percentile and the bone age on time in a child whose diet is plainly short on calories."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "dev-17",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 6-year-old girl has two large cafe-au-lait macules with ragged borders, breast development, and one episode of vaginal bleeding. Bone age is 9 years. A femur radiograph shows fibrous dysplasia. After gonadotropin-releasing hormone stimulation, luteinizing hormone stays in the prepubertal range, while estradiol is high. She has not used estrogen cream or other exogenous hormones. There is no headache. A consultant suggests this is early activation of the pituitary and would respond to a long-acting gonadotropin-releasing hormone agonist."
        ),
        "stem": "Which of the following best interprets the early bleeding and breast development?",
        "options": [
            "Peripheral precocious puberty from gonadotropin-independent ovarian estrogen secretion",
            "Central precocious puberty, which would show a pubertal luteinizing hormone rise after stimulation",
            "Premature thelarche, which would not advance bone age, cause bleeding, or include fibrous dysplasia",
            "Constitutional delay, which delays skeletal maturation rather than advancing it",
            "A pituitary process that continuous gonadotropin-releasing hormone agonist therapy would suppress",
        ],
        "correctAnswer": "Peripheral precocious puberty from gonadotropin-independent ovarian estrogen secretion",
        "explanation": (
            "Cafe-au-lait macules with ragged borders, fibrous dysplasia, and early estrogen effects form the McCune-Albright pattern. Activating Gs signaling in the ovary produces estradiol without a pituitary signal. The prepubertal luteinizing hormone after stimulation, the high estradiol, vaginal bleeding, and bone age of 9 years at chronologic age 6 show peripheral, gonadotropin-independent precocious puberty. Central precocious puberty, which would show a pubertal luteinizing hormone rise after stimulation, is excluded by the flat luteinizing hormone response. Premature thelarche, which would not advance bone age, cause bleeding, or include fibrous dysplasia, is only isolated breast tissue in a younger child with a normal skeleton. Constitutional delay, which delays skeletal maturation rather than advancing it, is a late bone age, not bone age 9 at age 6. A pituitary process that continuous gonadotropin-releasing hormone agonist therapy would suppress is the wrong mechanism: continuous agonist exposure downregulates pituitary receptors and can treat central puberty, but it cannot turn off an ovary that is secreting estrogen on its own."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "dev-18",
        "blueprintDomain": "human-development",
        "subjectId": "physiology",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "An infant with atypical external genitalia was raised as a girl. At age 13 the voice deepens, the phallus enlarges, muscle mass increases, and breasts do not develop. Imaging shows no uterus. Karyotype is 46,XY. The ratio of testosterone to dihydrotestosterone is markedly elevated. The child and parents are distressed that a body that looked female in infancy is masculinizing now. Smell is normal, and gonadotropins are in a pubertal male range rather than suppressed."
        ),
        "stem": "Which mechanism best accounts for the infantile appearance and the pubertal virilization?",
        "options": [
            "5-alpha-reductase deficiency: dihydrotestosterone was lacking in utero, while puberty proceeds under testosterone",
            "Complete androgen insensitivity: breasts develop at puberty and the phallus does not virilize",
            "45,X gonadal dysgenesis: a uterus is present, stature is short, and testosterone does not virilize the phenotype",
            "Kallmann syndrome: the pubertal testosterone rise fails and anosmia is expected",
            "21-hydroxylase deficiency: a 46,XX fetus is virilized in utero and a uterus is present",
        ],
        "correctAnswer": "5-alpha-reductase deficiency: dihydrotestosterone was lacking in utero, while puberty proceeds under testosterone",
        "explanation": (
            "External male genitalia in the fetus depend on dihydrotestosterone, made from testosterone by 5-alpha-reductase. Without that enzyme the newborn looks female or atypical, while testes still make antimullerian hormone, so there is no uterus, and the Wolffian ducts can respond to testosterone. At puberty the testosterone rise, which does not require dihydrotestosterone for muscle, voice, and phallic growth, virilizes the adolescent and does not produce breasts. An elevated testosterone-to-dihydrotestosterone ratio is the laboratory counterpart. Complete androgen insensitivity: breasts develop at puberty and the phallus does not virilize, because the receptor itself is absent and testosterone is aromatized to estrogen. 45,X gonadal dysgenesis: a uterus is present, stature is short, and testosterone does not virilize the phenotype, which is Turner syndrome rather than a 46,XY adolescent with no uterus. Kallmann syndrome: the pubertal testosterone rise fails and anosmia is expected, so it cannot explain deepening voice and phallic growth with a normal sense of smell. 21-hydroxylase deficiency: a 46,XX fetus is virilized in utero and a uterus is present, the mirror image of a 46,XY adolescent who virilizes only at puberty and has no uterus."
        ),
        "ref": "langman-embryo",
    },
]
