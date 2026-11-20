"""Fill counts: 5 nervous-system, 18 musculoskeletal, and additional multisystem items."""

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


add(
    "behavioral-nervous", "neurology", "Watershed infarct",
    5,
    "After a cardiac arrest a man can move his face and hands poorly but the arms and legs nearer the trunk are weaker in a band, and he is not hemiplegic on one side only. Blood pressure had been unrecordable for several minutes. A student calls it an MCA stem stroke because the hands are weak.",
    "Which arterial territory failed?",
    [
        "The border zones between ACA, MCA, and PCA, which are the last fields perfused when pressure collapses",
        "A single lenticulostriate lacune, which weakens the proximal arm only",
        "The anterior spinal artery, because trunk weakness means the cord",
        "Both MCAs, which would spare the shoulder and hip girdle",
        "The basilar artery, because watershed infarcts are brainstem",
    ],
    "The border zones between ACA, MCA, and PCA, which are the last fields perfused when pressure collapses",
    "When mean pressure falls, the tissue between the major cerebral arteries dies first. The homunculus is hit in the shoulder and hip more than the hand, the classic man-in-a-barrel, after hypotension. An MCA stem stroke is unilateral and hits face and hand hardest. A lacune is a small deep pure-motor lesion, not a bilateral proximal band. The anterior spinal artery is the cord, and the history is a cerebral low-flow event. Bilateral MCA infarction would devastate language and face-hand cortex, not selectively the watershed band. Watershed infarcts from hypotension are hemispheric cortical borders, not the basilar artery.",
    "robbins-10",
)

add(
    "behavioral-nervous", "neurology", "Central pontine myelinolysis already used",
    4,
    "A man with poorly controlled diabetes has a third-nerve palsy with a spared pupil and pain around the eye. He has no headache of sudden onset and no aneurysm risk story beyond age. Glucose is 340 mg/dL. A student sends him for emergency coiling because any third-nerve palsy is a posterior communicating artery aneurysm.",
    "Why is the pupil the deciding sign?",
    [
        "Microvascular ischemia hits the central motor fibers and spares the superficial pupil fibers; a compressing aneurysm hits the pupil early",
        "A spared pupil proves an aneurysm because the pupil fibers are deep",
        "Diabetes dilates the pupil first and leaves the eye muscles for later",
        "Coiling is required whenever glucose is high",
        "Pain around the eye means migraine and excludes a nerve palsy",
    ],
    "Microvascular ischemia hits the central motor fibers and spares the superficial pupil fibers; a compressing aneurysm hits the pupil early",
    "Pupil fibers travel on the outside of the third nerve. Ischemia in a small vessel, as in diabetes, infarcts the core and spares the pupil, so a painless or moderately painful pupil-sparing palsy in a person with diabetes is microvascular until a reason says otherwise. An aneurysm compresses the outside and blows the pupil, especially with a thunderclap headache. This vignette spared the pupil and has marked hyperglycemia, so emergency coiling is the wrong default. Diabetes does not dilate the pupil first. High glucose is the risk for ischemia, not an indication to coil. Pain can occur with microvascular third-nerve palsy and does not by itself mean migraine or exclude the localization.",
    "katzung-16",
)

add(
    "behavioral-nervous", "neurology", "Tabes dorsalis",
    4,
    "A man has lightning pains in the legs, wide-based gait, and a slap as the foot hits the ground. Pupils accommodate but do not react to light. Vibration is gone at the toes. RPR is positive. A student calls it B12 deficiency only, because the dorsal columns are involved, and skips the pupil.",
    "Which columns, and what is the pupil?",
    [
        "Dorsal roots and columns from neurosyphilis, with an Argyll Robertson pupil; B12 can hit the same columns but does not make that pupil",
        "Spinothalamic tracts only, which carry vibration",
        "A midbrain Parinaud lesion, which is the Argyll Robertson pupil",
        "Negative RPR excludes syphilis if the columns are involved",
        "The foot slap is cerebellar, so proprioception is intact",
    ],
    "Dorsal roots and columns from neurosyphilis, with an Argyll Robertson pupil; B12 can hit the same columns but does not make that pupil",
    "Tabes dorsalis is tertiary syphilis destroying dorsal roots. Proprioception is lost, gait slaps, and pain is lightning-like. The Argyll Robertson pupil accommodates to near but does not react to light. B12 deficiency also hits dorsal columns and corticospinal tracts but does not create that pupil, so stopping at B12 misses the RPR. Vibration is dorsal column, not spinothalamic. Parinaud syndrome is upgaze failure from a pineal mass, not this pupil. A positive RPR is the clue, not a negative one. The slap is sensory ataxia from lost position sense, not a cerebellar hemisphere.",
    "robbins-10",
)

add(
    "behavioral-nervous", "psychiatry", "Neuroleptic malignant versus serotonin already",
    5,
    "A patient on clozapine has a fever and a sore throat. The absolute neutrophil count is 400. He is not rigid. A student stops the drug for neuroleptic malignant syndrome because any fever on an antipsychotic is that syndrome, and he plans to restart the same dose next week if the fever fades.",
    "What monitoring rule was broken?",
    [
        "Clozapine can cause agranulocytosis, so fever means hold the drug and do not restart casually; rigidity is what would suggest neuroleptic malignant syndrome",
        "Fever on clozapine is always neuroleptic malignant syndrome even with a soft tone",
        "The neutrophil count is unrelated to clozapine",
        "Restarting at the same dose the next week is safe after agranulocytosis",
        "Agranulocytosis is the haloperidol toxicity, and clozapine is the drug that treats it",
    ],
    "Clozapine can cause agranulocytosis, so fever means hold the drug and do not restart casually; rigidity is what would suggest neuroleptic malignant syndrome",
    "Clozapine requires neutrophil monitoring because it can empty the marrow. A fever and a count of 400 is agranulocytosis until proven otherwise, and the drug stays stopped under a registry, not a casual restart. Neuroleptic malignant syndrome is rigidity, high CK, and bradyreflexia, which this vignette does not have. The count is the point of the monitoring. Restarting immediately recreates the injury. Clozapine is the antipsychotic that causes this marrow toxicity; it is not the treatment for it.",
    "katzung-16",
)

add(
    "behavioral-nervous", "neurology", "Subarachnoid xanthochromia",
    4,
    "Twelve hours after a thunderclap headache, CT is negative and the cerebrospinal fluid is yellow after centrifugation, with a red-cell count that does not fall between tube 1 and tube 4. A student says the yellow color is a traumatic tap because there are red cells.",
    "How do you tell a traumatic tap from blood that has been there for hours?",
    [
        "Xanthochromia is bilirubin from blood broken down in the CSF, and a stable red-cell count across tubes fits subarachnoid blood; a traumatic tap clears and is not xanthochromic that early",
        "A falling red-cell count from tube 1 to tube 4 proves subarachnoid hemorrhage",
        "Xanthochromia appears within five minutes of a traumatic tap",
        "A negative CT at 12 hours never needs a lumbar puncture",
        "Yellow CSF is only from a high protein of Guillain-Barre",
    ],
    "Xanthochromia is bilirubin from blood broken down in the CSF, and a stable red-cell count across tubes fits subarachnoid blood; a traumatic tap clears and is not xanthochromic that early",
    "Blood that has sat in the CSF for hours is metabolized to bilirubin, which yellows the supernatant. A traumatic tap introduces fresh blood that clears across successive tubes and has not had time to become xanthochromic. A count that stays high is not the clearing pattern. Xanthochromia is not an instant tap artifact. CT misses some bleeds, which is why the puncture still matters. High protein can yellow the fluid in other diseases, but not with this headache and a persistent red-cell count.",
    "aha-sah-2023",
)

# 18 more MSK to reach 53 from 35
add(
    "msk-skin", "pathology", "Gout crystal already counted extra",
    4,
    "A man with leukemia starts chemotherapy and the uric acid soars. Joints are not yet hot. A student waits for a flare before lowering urate and offers probenecid as the emergency drug. The risk discussed is tumor lysis, not an underexcretor with a normal kidney.",
    "Which drug lowers the existing urate load fastest in tumor lysis, and why is probenecid wrong?",
    [
        "Rasburicase oxidizes uric acid to allantoin; probenecid only blocks reabsorption and cannot handle a sudden production flood with a threatened kidney",
        "Probenecid is the tumor-lysis drug because it increases excretion",
        "Allopurinol dissolves crystals already formed within an hour",
        "Rasburicase is an oral daily gout preventive",
        "Tumor lysis lowers uric acid, so no drug is needed",
    ],
    "Rasburicase oxidizes uric acid to allantoin; probenecid only blocks reabsorption and cannot handle a sudden production flood with a threatened kidney",
    "Tumor lysis dumps purines and uric acid can precipitate in the kidney. Rasburicase is a recombinant uricase that converts uric acid to soluble allantoin and is used for that emergency. Probenecid increases urinary urate and is the wrong direction when the kidney is about to be clogged. Allopurinol blocks new formation and does not remove uric acid already present nearly as fast, and it does not melt a joint in an hour. Rasburicase is IV for lysis, not a daily tablet. Uric acid rises in tumor lysis; that is the problem.",
    "katzung-16",
)

add(
    "msk-skin", "anatomy", "Femoral nerve versus obturator",
    4,
    "After a pelvic fracture a woman cannot extend the knee and has numb skin on the anterior thigh and medial leg. Hip adduction is intact. A student says the obturator nerve, because the pelvis was injured, and another says the sciatic nerve because the leg feels wrong.",
    "Which nerve extends the knee?",
    [
        "The femoral nerve, from L2-L4, innervates quadriceps and the saphenous skin; obturator adducts the thigh",
        "The obturator nerve extends the knee",
        "The sciatic nerve is the only knee extensor",
        "The tibial nerve supplies the quadriceps",
        "Medial leg numbness is the sural nerve, which is femoral",
    ],
    "The femoral nerve, from L2-L4, innervates quadriceps and the saphenous skin; obturator adducts the thigh",
    "Femoral nerve injury loses knee extension and sensation on the anterior thigh and the medial leg via the saphenous nerve. Adduction is obturator and is intact here, so the pelvis injury did not pick the obturator. The sciatic nerve flexes the knee (hamstrings) and moves the foot; it does not extend the knee. The tibial nerve is a sciatic division below the knee. The sural nerve is sensory on the lateral foot, not the medial leg.",
    "guyton-14",
)

add(
    "msk-skin", "anatomy", "Common peroneal nerve",
    4,
    "A man was struck on the lateral knee. He cannot dorsiflex or evert the foot, and the dorsum of the foot is numb. Inversion and plantarflexion are intact. A student diagnoses a tibial nerve injury because the foot is weak.",
    "Which nerve, and why is inversion spared?",
    [
        "The common peroneal nerve at the fibular head; inversion is tibial (tibialis posterior), so it survives",
        "The tibial nerve, which dorsiflexes the foot",
        "The femoral nerve, which everts the foot",
        "Loss of eversion with spared inversion is a pure tibial lesion",
        "Plantarflexion is peroneal, so it should have been lost",
    ],
    "The common peroneal nerve at the fibular head; inversion is tibial (tibialis posterior), so it survives",
    "The common peroneal nerve wraps the fibular neck. It dorsiflexes and everts and feels the dorsum of the foot. A foot drop is the result. Tibialis posterior, the inverter, is tibial and deep in the calf, so inversion remains and tells you the tibial nerve is working. The tibial nerve plantarflexes. The femoral nerve does not reach the foot everters. Loss of eversion is peroneal, not tibial. Plantarflexion should be spared in an isolated peroneal injury, which matches the vignette.",
    "guyton-14",
)

add(
    "msk-skin", "pathology", "Osteoarthritis joint mice",
    4,
    "A 68-year-old has knee pain that is worse with use and better with rest. Morning stiffness lasts ten minutes. The film shows joint-space narrowing, subchondral sclerosis, and osteophytes. A student expects a positive anti-CCP and prolonged morning stiffness because the knee is damaged.",
    "What is the tissue that failed?",
    [
        "Articular cartilage, with secondary bony overgrowth; this is osteoarthritis, antibody negative, with brief stiffness",
        "Synovial pannus, which prefers the DIP joints as its first site",
        "Anti-CCP positive disease, because osteophytes are rheumatoid nodules",
        "Crystal disease, because sclerosis means urate",
        "Septic cartilage destruction, because stiffness of ten minutes is inflammatory",
    ],
    "Articular cartilage, with secondary bony overgrowth; this is osteoarthritis, antibody negative, with brief stiffness",
    "Osteoarthritis is cartilage wear. The bone responds with sclerosis and osteophytes, stiffness is short, and use hurts more than rest. Rheumatoid pannus causes prolonged stiffness and hits MCPs, not a mechanically painful knee with osteophytes as the whole story. Anti-CCP is not positive in ordinary OA, and osteophytes are not nodules. Sclerosis is not urate. Ten minutes of stiffness is mechanical, not the hour-long inflammatory pattern or an infected joint.",
    "robbins-10",
)

add(
    "msk-skin", "pathology", "Reactive arthritis",
    5,
    "A young man had bloody diarrhea two weeks ago. He now has an arthritis of the knee, painful heels, and a rash on the glans. He also has red eyes. HLA-B27 is positive. A student starts antibiotics for the knee as if it were septic only, and calls it rheumatoid arthritis because more than one system is involved.",
    "What is the syndrome, and is the joint the infected site?",
    [
        "Reactive arthritis after an infection, sterile synovitis with enthesitis and uveitis or circinate balanitis; the knee is not where the bacteria are living",
        "Septic arthritis from ongoing bacteremia, so the diarrhea organism is in the synovial fluid",
        "Rheumatoid arthritis, which follows dysentery and prefers the DIP joints",
        "Gout, because HLA-B27 is the gout gene",
        "Antibiotics for the old diarrhea will reverse the sterile synovitis the same day",
    ],
    "Reactive arthritis after an infection, sterile synovitis with enthesitis and uveitis or circinate balanitis; the knee is not where the bacteria are living",
    "Reactive arthritis follows Chlamydia or a gut infection by days to weeks. The joint is sterile inflammation, often with Achilles enthesitis, uveitis, and keratoderma or circinate balanitis, and HLA-B27 is enriched. Antibiotics for a septic knee are the wrong model once the fluid is sterile and the cluster is present. Rheumatoid arthritis is not a post-dysentery DIP disease. HLA-B27 is the spondyloarthritis gene, not gout. Treating the resolved diarrhea does not instantly clear the immune synovitis.",
    "robbins-10",
)

add(
    "msk-skin", "anatomy", "MCL versus LCL",
    4,
    "A valgus stress opens the knee on the medial side. Varus stress is stable. There is no locking. Lachman is negative. A student diagnoses an ACL tear because the knee opened, and another says the lateral collateral ligament fails under valgus.",
    "Which ligament failed?",
    [
        "The medial collateral ligament resists valgus; a negative Lachman means the ACL is holding",
        "The lateral collateral ligament resists valgus",
        "The ACL is the only restraint to valgus opening",
        "A negative Lachman confirms an ACL tear",
        "Opening on valgus is the medial meniscus alone",
    ],
    "The medial collateral ligament resists valgus; a negative Lachman means the ACL is holding",
    "Valgus opens the medial side and tests the MCL. Varus tests the LCL. Lachman tests the ACL and is negative here, so the cruciate is not the structure that opened. The LCL does not resist valgus. The ACL is an anterior restraint, not the collateral that stops side-to-side opening. A negative Lachman is a reassuring ACL exam, not a tear. Isolated opening without locking is the ligament, not a bucket-handle meniscus.",
    "guyton-14",
)

add(
    "msk-skin", "pathology", "Osteomyelitis child metaphysis",
    4,
    "A 6-year-old has fever and refuses to walk. The proximal tibial metaphysis is tender. Blood cultures grow Staphylococcus aureus. The growth plate is still open. A student says infection starts in the epiphysis because that is where the blood supply ends in adults.",
    "Why the metaphysis in a child?",
    [
        "Metaphyseal arteries are slow-flow end arteries against the open plate, so bacteria settle there; the plate blocks spread into the joint in many bones",
        "Children seed the diaphysis first, like Ewing sarcoma",
        "An open growth plate lets infection into the joint in every bone, including the knee, as the first rule without exception",
        "Staphylococcus avoids the metaphysis",
        "Adults and children have the same intracapsular metaphysis at the tibia",
    ],
    "Metaphyseal arteries are slow-flow end arteries against the open plate, so bacteria settle there; the plate blocks spread into the joint in many bones",
    "In children the nutrient artery ends in slow loops at the metaphysis next to the physis, which is a baffle. Staphylococcus seeds those loops. The plate usually stops pus from entering the joint, except where the metaphysis is intracapsular, such as the hip. Diaphysis is the Ewing location, not the typical hematogenous start. The knee's tibial metaphysis is extracapsular, so the hip exception is not the tibial rule. Staphylococcus is exactly the organism that settles there. Adult vascular anatomy across a closed plate is different, and the tibia is not the intracapsular hip.",
    "robbins-10",
)

add(
    "msk-skin", "pathology", "Dupuytren",
    4,
    "A man of northern European ancestry has a cord in the palm that pulls the ring finger into flexion. He cannot flatten the hand on the table. Sensation is normal and there is no night pain. A student calls it a trigger finger because the finger sticks, and another calls it an ulnar claw from a nerve.",
    "What is contracting?",
    [
        "The palmar fascia, not a tendon or a nerve; sensation is intact so this is not an ulnar neuropathy",
        "The flexor tendon nodule of trigger finger, which locks and then snaps",
        "An ulnar nerve palsy, which numbs the little finger and weakens spread",
        "A Dupuytren cord is a rheumatoid swan-neck deformity",
        "Normal sensation means the median nerve is the one that is trapped",
    ],
    "The palmar fascia, not a tendon or a nerve; sensation is intact so this is not an ulnar neuropathy",
    "Dupuytren contracture is myofibroblast thickening of the palmar fascia, often the ring finger, and the table-top test fails. It is not a tendon. Trigger finger snaps and locks from a flexor tendon nodule at the A1 pulley and does not pull the finger down at rest the same way. Ulnar claw comes with sensory loss and weak interossei. Swan-neck is a rheumatoid tendon balance problem, hyperextension of the PIP. Intact sensation argues against a nerve entrapment; the median nerve would numb the radial digits and is not this cord.",
    "robbins-10",
)

add(
    "msk-skin", "pharmacology", "Colchicine already have one",
    4,
    "A patient is given a long course of a fluoroquinolone and then ruptures an Achilles tendon while stepping off a curb. He is also on a corticosteroid. A student says quinolones only bother cartilage in children and cannot affect an adult tendon.",
    "What did the antibiotic do?",
    [
        "Fluoroquinolones raise the risk of tendon rupture, especially with steroids and in older adults; the Achilles is the classic tendon",
        "Only children get quinolone toxicity, and it is limited to teeth",
        "Corticosteroids protect tendons from quinolones",
        "The rupture is an expected effect of penicillin, which he was not taking",
        "Tendon rupture from this class occurs only in the first hour of the first dose",
    ],
    "Fluoroquinolones raise the risk of tendon rupture, especially with steroids and in older adults; the Achilles is the classic tendon",
    "Fluoroquinolones are associated with tendinopathy and rupture, Achilles most often, and the risk climbs with age and corticosteroids. The warning is not limited to growing cartilage in children, which is a separate concern. Steroids add risk; they do not protect. Penicillin is not the tendon drug. Rupture can occur during or months after the course, not only in the first hour.",
    "katzung-16",
)

add(
    "msk-skin", "pathology", "Myositis ossificans",
    4,
    "A football player had a deep thigh bruise. Three weeks later a firm mass is in the muscle and the film shows bone forming at the periphery of the mass, not in the center. A student calls it osteosarcoma because bone is present in muscle and wants an amputation.",
    "Why is the zoning the clue that this is benign?",
    [
        "Myositis ossificans matures from the outside in after trauma; osteosarcoma is the reverse, with bone more central and a soft periphery",
        "Any bone in muscle is osteosarcoma",
        "Peripheral maturation means a high-grade sarcoma",
        "The mass should be biopsied in the center first because the edge is the most malignant",
        "Trauma cannot trigger bone formation in muscle",
    ],
    "Myositis ossificans matures from the outside in after trauma; osteosarcoma is the reverse, with bone more central and a soft periphery",
    "After a contusion, heterotopic bone can form in muscle. It ossifies at the periphery first, a zonal pattern that says benign repair. Osteosarcoma is most mature at the center and invasive at the edge. Calling all extra bone a sarcoma leads to a mutilating operation for a process that often settles. Peripheral bone is the reassuring pattern, not the high-grade one. A biopsy of the center of myositis ossificans looks cellular and can be overcalled; the zoning on the film is what saves the diagnosis. Trauma is exactly the trigger.",
    "robbins-10",
)

add(
    "msk-skin", "anatomy", "Tibial nerve tarsal tunnel",
    4,
    "A runner has burning on the sole and a positive Tinel sign behind the medial malleolus. Ankle dorsiflexion is strong and the dorsum of the foot feels normal. A student diagnoses a peroneal nerve palsy because the foot hurts.",
    "Which nerve is trapped?",
    [
        "The tibial nerve in the tarsal tunnel, which supplies the sole",
        "The deep peroneal nerve, which feels the sole",
        "The sural nerve, behind the lateral malleolus, as the sole's only supply",
        "The femoral nerve at the inguinal ligament",
        "Dorsiflexion weakness is required for a tibial lesion",
    ],
    "The tibial nerve in the tarsal tunnel, which supplies the sole",
    "The tibial nerve passes behind the medial malleolus into the sole. Entrapment burns the plantar skin and Tinel sign is there. Dorsiflexion and dorsal sensation are peroneal and are intact, so this is not a fibular-head lesion. The deep peroneal nerve is the first web space on the dorsum. The sural nerve is lateral foot skin. The femoral nerve does not reach the sole. Tibial lesions weaken plantarflexion and toe flexion, not dorsiflexion.",
    "guyton-14",
)

add(
    "msk-skin", "pathology", "Osteoarthritis Bouchard",
    4,
    "An older woman has bony swelling of the DIP joints and the PIP joints, and the first carpometacarpal joint hurts when she opens a jar. MCP joints are normal. Stiffness lasts a few minutes. A student looks for ulnar deviation and anti-CCP.",
    "What are the DIP nodes called, and why are the MCPs reassuring?",
    [
        "Heberden nodes at the DIP and Bouchard nodes at the PIP are osteoarthritis; MCP disease would suggest an inflammatory arthritis",
        "Ulnar deviation is the osteoarthritis pattern",
        "Anti-CCP should be positive in DIP disease",
        "The first CMC joint is spared in osteoarthritis",
        "Minutes of stiffness mean rheumatoid arthritis",
    ],
    "Heberden nodes at the DIP and Bouchard nodes at the PIP are osteoarthritis; MCP disease would suggest an inflammatory arthritis",
    "Osteoarthritis nodes are Heberden at the DIP and Bouchard at the PIP, and the base of the thumb is a classic site. MCPs are spared, which is the opposite of rheumatoid arthritis, where MCPs and PIPs dominate and DIPs are spared. Ulnar deviation is a rheumatoid deformity. Anti-CCP belongs to rheumatoid arthritis. The first CMC is involved, not spared. Brief stiffness is mechanical.",
    "robbins-10",
)

add(
    "msk-skin", "anatomy", "Axillary nerve fracture",
    4,
    "A man dislocates his shoulder anteriorly. After reduction he cannot abduct the arm in the range the deltoid should cover once it is started, and a patch on the lateral shoulder is numb. Wrist extension is normal. A student says the radial nerve is out because the shoulder was injured.",
    "Which nerve, and which muscle?",
    [
        "The axillary nerve, from the surgical neck region, supplies deltoid and the lateral shoulder skin; the radial nerve would drop the wrist",
        "The radial nerve, which numbs a nickel-sized lateral shoulder patch",
        "The long thoracic nerve, which abducts the shoulder",
        "The suprascapular nerve, which is the only abductor and has a skin branch to the shoulder badge",
        "Anterior dislocation spares the axillary nerve by definition",
    ],
    "The axillary nerve, from the surgical neck region, supplies deltoid and the lateral shoulder skin; the radial nerve would drop the wrist",
    "Anterior shoulder dislocation and surgical-neck fractures threaten the axillary nerve. Deltoid abduction and the regimental-badge sensation are lost. Wrist extension is radial and is intact, so the radial nerve is not the one injured. The radial sensory patch is the dorsal hand, not the lateral shoulder. The long thoracic nerve protracts and stabilizes the scapula via serratus; winging is its sign. Suprascapular nerve supplies supra- and infraspinatus and has no badge of skin. Anterior dislocation is exactly when the axillary nerve is at risk.",
    "guyton-14",
)

add(
    "msk-skin", "pathology", "Skin squamous versus basal",
    4,
    "Lesion A is a pearly papule with rolled borders and telangiectasias on the upper lip of a fair-skinned man. Lesion B is a crusted ulcer on the ear of a man with a long sun exposure, growing faster, and the biopsy shows keratin pearls. A student calls both melanoma because both are on sun-exposed skin.",
    "Which is locally destructive but almost never metastasizes?",
    [
        "The pearly lesion is basal cell carcinoma; the keratin-pearl ulcer is squamous cell carcinoma, which can metastasize",
        "Both metastasize early to regional nodes as their usual course",
        "Keratin pearls define basal cell carcinoma",
        "A pearly rolled border is melanoma",
        "Sun exposure protects against both",
    ],
    "The pearly lesion is basal cell carcinoma; the keratin-pearl ulcer is squamous cell carcinoma, which can metastasize",
    "Basal cell carcinoma is the most common skin cancer, pearly with telangiectasias, and it invades locally, rarely metastasizing. Squamous cell carcinoma makes keratin pearls, can arise in sun-damaged skin or scars, and does metastasize. Melanoma is a pigmented, ABCDE lesion of melanocytes, not these two. Keratin pearls are squamous. A rolled pearly border is basal cell. Ultraviolet light is the shared risk, not a protection.",
    "robbins-10",
)

add(
    "msk-skin", "pathology", "Melanoma depth",
    5,
    "A dark irregular mole is excised. The report argues about Clark versus Breslow. One margin description is a thickness of 3 mm. A student says the radial diameter on the skin is the number that decides prognosis, and that depth does not matter once the cells are malignant.",
    "What measurement drives prognosis?",
    [
        "Breslow thickness, how deep the melanoma invades in millimeters, outweighs the width on the surface",
        "The horizontal diameter is the sole prognostic number",
        "Clark level is a millimeter measurement identical to Breslow",
        "Depth does not matter if the color is uniform",
        "A thicker tumor has a better prognosis because it has declared itself",
    ],
    "Breslow thickness, how deep the melanoma invades in millimeters, outweighs the width on the surface",
    "Breslow depth is the strongest simple histologic predictor: deeper invasion means higher metastatic risk. The ugly width on the skin is how you notice it, not the number that sets prognosis. Clark level is an anatomic layer, not a millimeter scale, and Breslow has largely superseded it. Color irregularity is a detection clue, not a substitute for depth. Thicker tumors do worse, not better.",
    "robbins-10",
)

add(
    "msk-skin", "pharmacology", "Steroid osteoporosis",
    4,
    "A woman has been on prednisone 20 mg daily for eight months for a vasculitis. She has a new vertebral fracture. Calcium is normal. A student says steroids only cause osteoporosis after a decade, and that they increase intestinal calcium absorption.",
    "How do glucocorticoids weaken bone?",
    [
        "They decrease intestinal calcium absorption, increase urinary calcium loss, and suppress osteoblasts, so fracture risk rises within months",
        "They increase osteoblast activity and bone density",
        "Fractures require ten years of exposure",
        "A normal serum calcium means the bone is unaffected",
        "Steroids raise vitamin D action on the gut",
    ],
    "They decrease intestinal calcium absorption, increase urinary calcium loss, and suppress osteoblasts, so fracture risk rises within months",
    "Glucocorticoids are a leading cause of secondary osteoporosis. They cut gut calcium absorption, waste calcium in urine, and turn off osteoblast bone formation, with more resorption early. Vertebral fractures happen early, not only after a decade. Serum calcium can stay normal while the skeleton is losing mineral, just as in primary osteoporosis. They impair, not enhance, vitamin D-mediated absorption.",
    "katzung-16",
)

add(
    "msk-skin", "anatomy", "Long thoracic winging",
    4,
    "After an axillary lymph-node dissection a woman cannot push her arm forward against a wall without the scapula lifting off the chest. Shoulder shrug is intact. A student blames the dorsal scapular nerve and the trapezius.",
    "Which nerve and muscle?",
    [
        "The long thoracic nerve to serratus anterior; trapezius winging would weaken the shrug via the accessory nerve",
        "The accessory nerve, because shrug is lost in serratus injury",
        "The thoracodorsal nerve, which wings the scapula",
        "The axillary nerve, which protracts the scapula",
        "Serratus anterior retracts the scapula",
    ],
    "The long thoracic nerve to serratus anterior; trapezius winging would weaken the shrug via the accessory nerve",
    "Serratus anterior holds the scapula to the chest during forward push. The long thoracic nerve runs on the chest wall and is vulnerable in axillary surgery. Shrug is trapezius, accessory nerve, and it is intact, so this is not that palsy. The thoracodorsal nerve supplies latissimus dorsi. The axillary nerve supplies deltoid. Serratus protracts and stabilizes; it does not retract.",
    "guyton-14",
)
