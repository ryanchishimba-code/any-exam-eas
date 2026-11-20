"""Step 1 musculoskeletal and skin items."""

ITEMS = []


def add(topic, diff, subject, scenario, question, options, key, expl, ref="robbins-10"):
    assert key in options and len(set(options)) == 5
    ITEMS.append(
        {
            "blueprintDomain": "msk-skin",
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
    "Allopurinol and azathioprine",
    5,
    "pharmacology",
    "A man with gout and a kidney transplant is started on allopurinol for tophi. He already takes azathioprine. Two weeks later his white count crashes and he has mouth ulcers. The gout pain is better. A student says the cytopenia is from colchicine, which he is not taking, or that allopurinol only affects uric acid and cannot touch a transplant drug.",
    "Why did the marrow fail?",
    [
        "Allopurinol blocks xanthine oxidase, which normally inactivates 6-mercaptopurine from azathioprine, so the active metabolite soars",
        "Allopurinol induces CYP3A4 and lowers azathioprine levels, so the marrow finding is unrelated",
        "The interaction is with penicillin, not a thiopurine",
        "Tophi mean he needed a higher azathioprine dose, which is why the count fell",
        "Xanthine oxidase inhibition reduces 6-MP effect, so leukopenia means a different drug was stopped",
    ],
    "Allopurinol blocks xanthine oxidase, which normally inactivates 6-mercaptopurine from azathioprine, so the active metabolite soars",
    "Azathioprine becomes 6-mercaptopurine, and xanthine oxidase helps clear it. Allopurinol blocks that enzyme, the thiopurine level rises, and the marrow dies. This is a classic lethal interaction. Induction of CYP would lower levels, the opposite of marrow failure. The interacting drug is the thiopurine, not penicillin. Raising azathioprine because of tophi would be a second error; the tophi are why allopurinol was added, and the dose of azathioprine must be cut sharply or the drug changed. Blocking xanthine oxidase increases, not reduces, 6-MP effect.",
    "katzung-16",
)

add(
    "Do not start allopurinol alone in a hot joint",
    4,
    "pharmacology",
    "A man has a red hot first toe. Needle-shaped negatively birefringent crystals are in the joint and the gram stain is negative. A clinician starts allopurinol today and no anti-inflammatory. The next day the toe is worse. He has no azathioprine on his list. Serum uric acid was normal during the attack.",
    "Why did the toe flare, and what should have come first?",
    [
        "A sudden drop in urate destabilizes crystals; treat the flare with an anti-inflammatory first, and a normal uric acid during an attack does not exclude gout",
        "A normal uric acid rules out gout, so the crystals were artifact",
        "Allopurinol is an anti-inflammatory and should calm the joint within hours",
        "Negative birefringence means pseudogout, so allopurinol is the correct specific drug",
        "Gram-negative stain means antibiotics are unnecessary only if allopurinol is started",
    ],
    "A sudden drop in urate destabilizes crystals; treat the flare with an anti-inflammatory first, and a normal uric acid during an attack does not exclude gout",
    "Starting urate-lowering therapy during an unprotected flare can mobilize crystals and worsen pain. An NSAID, colchicine, or a steroid covers the flare; allopurinol is prevention, not the acute drug, and if it is started it needs cover. Uric acid often falls during an acute attack, so a normal level does not throw out crystals you already saw. Allopurinol is not an anti-inflammatory. Pseudogout is rhomboid and positively birefringent. A negative gram stain supports a crystal diagnosis only together with the crystals; it is not a reason that allopurinol treats infection.",
    "acr-gout-2020",
)

add(
    "Pseudogout versus gout",
    4,
    "pathology",
    "An older woman has a swollen knee after a parathyroidectomy left her calcium unstable. Crystals are rhomboid and blue when parallel to the compensator. The joint fluid gram stain is negative and the glucose is normal. She has no podagra. A student calls it gout because the knee is hot.",
    "Which crystal, and which associated disease fits the neck surgery?",
    [
        "Calcium pyrophosphate; pseudogout tracks with hyperparathyroidism and the birefringence is positive, the opposite of urate",
        "Monosodium urate, because any hot knee in an older adult is gout",
        "Cholesterol crystals from osteoarthritis, which are strongly negatively birefringent needles",
        "Hydroxyapatite, which is easy to see as rhomboids on plain light microscopy",
        "Septic arthritis, because a hot knee with crystals cannot also be infected so the gram stain was enough",
    ],
    "Calcium pyrophosphate; pseudogout tracks with hyperparathyroidism and the birefringence is positive, the opposite of urate",
    "CPPD crystals are rhomboid and positively birefringent (blue when aligned with the compensator). They favor the knee and associate with hyperparathyroidism, hemochromatosis, and age. Urate needles are negatively birefringent and yellow when parallel, and they love the first toe. A hot joint is not specific. Cholesterol crystals are not this birefringence pattern. Hydroxyapatite is not brightly visible on compensated polarized light the way these are. Crystals do not rule out infection; a gram stain and culture still matter, but this vignette's crystal and the parathyroid history are CPPD.",
    "robbins-10",
)

add(
    "Septic arthritis must be tapped",
    5,
    "pathology",
    "A 62-year-old with a prosthetic knee has fever and a joint he cannot move. He has had gout before. A clinician starts colchicine and skips a tap because the last attack looked the same. The skin over the joint is hot and he looks ill. There is no rash of gonorrhea and no recent viral illness.",
    "What is the danger of treating this as gout without fluid?",
    [
        "A septic joint, including around hardware, destroys cartilage in hours and can look like a crystal flare; fluid for gram stain and culture has to come before assuming crystals",
        "Colchicine covers Staphylococcus, so the tap can wait a week",
        "Prosthetic joints do not get infected after the first month",
        "Fever means the diagnosis is gout, because infection does not cause fever",
        "Gonorrhea is the only organism that infects a knee, and he has no rash so infection is impossible",
    ],
    "A septic joint, including around hardware, destroys cartilage in hours and can look like a crystal flare; fluid for gram stain and culture has to come before assuming crystals",
    "You cannot tell a septic knee from a crystal flare by history, especially in someone who has had both risks. Cartilage dies quickly and hardware infections need a tap, culture, and often surgery. Colchicine does not treat bacteria. Prostheses remain infected risk forever, not only in the first month. Fever fits infection at least as well as gout. Staphylococcus and streptococci infect native and prosthetic knees; gonorrhea is a cause in younger sexually active patients, not the only organism, and absence of a rash does not clear the joint.",
    "robbins-10",
)

add(
    "Pemphigus versus bullous pemphigoid",
    5,
    "pathology",
    "Patient A is 45 with flaccid blisters, a positive Nikolsky sign, and oral erosions. Immunofluorescence shows net-like IgG around keratinocytes. Patient B is 78 with tense blisters, a negative Nikolsky sign, and a linear band of IgG and C3 at the basement membrane. He has no oral lesions. A student uses steroids the same way and says the antibody target is identical.",
    "Which proteins were attacked?",
    [
        "A is desmoglein inside the epidermis; B is hemidesmosome proteins at the basement membrane",
        "Both are hemidesmosomes, which is why Nikolsky is positive in both",
        "A is a subepidermal split, so the blisters should be tense",
        "B is desmoglein 3, the mucosal pemphigus target",
        "Immunofluorescence that is linear means the antibody is between keratinocytes",
    ],
    "A is desmoglein inside the epidermis; B is hemidesmosome proteins at the basement membrane",
    "Pemphigus vulgaris antibodies hit desmoglein, the glue between keratinocytes. The split is shallow, blisters are flaccid, the roof shears off (Nikolsky), the mouth is involved, and immunofluorescence is a net around cells. Bullous pemphigoid antibodies hit hemidesmosomes. The split is under the epidermis, blisters are tense, Nikolsky is negative, the mouth is usually spared, and immunofluorescence is a line at the base. The targets are not the same, which is why the exams look different. A positive Nikolsky and flaccid bullae are intraepidermal, not subepidermal. Desmoglein 3 is the pemphigus mucosal antigen, not pemphigoid. A linear band is the basement membrane, not the net of pemphigus.",
    "robbins-10",
)

add(
    "Dermatitis herpetiformis",
    4,
    "pathology",
    "A man has intensely itchy grouped vesicles on the elbows and knees. Skin biopsy immunofluorescence shows granular IgA in the dermal papillae. He has chronic bloating. A student calls it herpes simplex because the vesicles are grouped, and another calls it bullous pemphigoid because IgA and IgG are both antibodies.",
    "What is the associated gut disease, and why is the immunofluorescence specific?",
    [
        "Celiac disease; IgA against epidermal transglutaminase sits in the papillae, and the gut disease is gluten",
        "Herpes simplex, which deposits granular IgA",
        "Bullous pemphigoid, which is granular IgA at the papillae",
        "Dermatitis herpetiformis is IgG around keratinocytes",
        "The gut disease is ulcerative colitis, treated with gluten loading",
    ],
    "Celiac disease; IgA against epidermal transglutaminase sits in the papillae, and the gut disease is gluten",
    "Dermatitis herpetiformis is the skin of celiac disease. Granular IgA in the dermal papillae is the finding, and the itch is out of proportion to what you see. Gluten drives it. Herpes simplex is a virus, not an IgA papillary deposit. Pemphigoid is linear IgG and C3 at the basement membrane. Net-like IgG is pemphigus. Ulcerative colitis is not this rash, and gluten is removed, not loaded.",
    "robbins-10",
)

add(
    "Brachial plexus Erb versus Klumpke",
    5,
    "anatomy",
    "Newborn A was stuck at the shoulder and keeps the arm adducted, internally rotated, and the elbow extended, with an intact hand. Newborn B was pulled up by the arm and has a clawed hand and, on the same side, a small pupil and a mild ptosis. A student says both are C5-C6 because both followed a delivery.",
    "Which roots, and why the pupil?",
    [
        "A is upper trunk C5-C6; B is lower trunk C8-T1, and T1 sympathetics to the eye are torn with it",
        "A is C8-T1 because the elbow is extended",
        "B is an isolated oculomotor palsy from birth trauma",
        "Both are radial nerve injuries in the axilla",
        "A Horner syndrome means the upper trunk, because the sympathetics exit at C5",
    ],
    "A is upper trunk C5-C6; B is lower trunk C8-T1, and T1 sympathetics to the eye are torn with it",
    "Erb palsy is the waiter's-tip posture: loss of shoulder abduction and external rotation and of elbow flexion, from C5-C6, typically shoulder dystocia. Klumpke is the claw hand of the intrinsic muscles, C8-T1, from upward traction, and the T1 white ramus to the cervical sympathetics is why the pupil is small. Same delivery story does not mean the same roots. An extended elbow is weak biceps, an upper trunk sign. The pupil in this setting is a Horner syndrome, not a third-nerve palsy, which would dilate the pupil and paralyze the eye. The radial nerve does not claw the hand or shrink the pupil. Sympathetics for the eye leave the cord around T1, not C5.",
    "guyton-14",
)

add(
    "Radial versus ulnar versus median",
    4,
    "anatomy",
    "Patient A cannot extend the wrist and has sensory loss on the back of the hand after a mid-humerus fracture. Patient B cannot spread the fingers and has numb little finger after an elbow injury. Patient C cannot oppose the thumb and has numb index and middle fingers, worse at night.",
    "Which nerves?",
    [
        "A radial, B ulnar, C median",
        "A ulnar, B radial, C musculocutaneous",
        "A median, because wrist drop is a median nerve sign",
        "B median, because finger spread is the thenar pad",
        "C ulnar, because night hand pain is the ulnar tunnel",
    ],
    "A radial, B ulnar, C median",
    "The radial nerve runs in the spiral groove and extends the wrist and fingers; a humeral shaft fracture drops the wrist and numbs the dorsal hand. The ulnar nerve supplies interossei, so spread is lost, and it feels the little finger. The median nerve supplies thenar opposition and the palmar thumb-index-middle sensation; night pain is carpal tunnel. Swapping radial and ulnar swaps wrist drop and claw. Wrist drop is not median. Finger spread is dorsal interossei, ulnar, not thenar. Night symptoms in the median digits are carpal tunnel, not the ulnar nerve at Guyon canal.",
    "guyton-14",
)

add(
    "Osteoid osteoma",
    4,
    "pathology",
    "A teenage boy has a dull thigh pain that is worse at night and gone after ibuprofen. Imaging shows a small cortical nidus with a lot of surrounding bone. He has no fever and a normal white count. A student calls it osteomyelitis because night pain means infection, and another calls it osteosarcoma because he is young.",
    "What is the lesion, and why does the NSAID response matter?",
    [
        "Osteoid osteoma; the nidus makes prostaglandin, which is why NSAIDs abolish the night pain, and the lesion is small and benign",
        "Osteosarcoma, which is relieved completely by one dose of ibuprofen and has a tiny nidus",
        "Ewing sarcoma, which is a small nidus without an onion-skin reaction as its classic film",
        "Osteomyelitis, because any night pain with a normal white count is infection",
        "Osteochondroma, a cartilage-capped projection that hurts at night and vanishes with NSAIDs",
    ],
    "Osteoid osteoma; the nidus makes prostaglandin, which is why NSAIDs abolish the night pain, and the lesion is small and benign",
    "Osteoid osteoma is a small benign nidus of osteoid. Prostaglandins drive the night pain, so NSAIDs are dramatically effective, which is the clinical clue. Osteosarcoma is a large destructive metaphyseal mass, not an NSAID-cured nidus. Ewing sarcoma is a diaphyseal small-round-cell tumor with onion-skin periosteum and systemic symptoms. Osteomyelitis has fever, an elevated count or inflammatory markers, and does not vanish with one anti-inflammatory. Osteochondroma is a bony spur with a cartilage cap, usually painless unless the stalk is bumped.",
    "robbins-10",
)

add(
    "Osteosarcoma versus Ewing",
    5,
    "pathology",
    "Teen A has a destructive mass at the distal femur metaphysis, a sunburst periosteal reaction, and a Codman triangle. Teen B has a diaphyseal femoral lesion, fever, onion-skin periosteum, and a translocation involving the EWS gene. Both are limping. A student calls both osteomyelitis because teens get bone pain.",
    "Which cells, and which one is related to the marrow round-cell family?",
    [
        "A is malignant osteoid from osteosarcoma; B is a small round blue cell Ewing tumor",
        "Both make osteoid, and the EWS translocation is the osteosarcoma gene",
        "B is osteoid osteoma because it is in the femur",
        "A is Ewing because sunburst means layers of periosteum",
        "Codman triangle is specific for infection and excludes tumor",
    ],
    "A is malignant osteoid from osteosarcoma; B is a small round blue cell Ewing tumor",
    "Osteosarcoma is a metaphyseal tumor of teenagers that makes osteoid, lifts periosteum into a Codman triangle, and throws a sunburst of bone. Ewing sarcoma is a diaphyseal neuroectodermal small round cell tumor, t(11;22) EWS-FLI1, with onion-skin periosteum and fever that mimics osteomyelitis. They are not the same gene or the same matrix. Location in the femur does not make Ewing an osteoid osteoma. Sunburst is osteosarcoma; onion skin is Ewing. A Codman triangle is periosteum lifted by tumor or sometimes infection, not a finding that clears a mass of being cancer.",
    "robbins-10",
)

add(
    "Giant cell tumor",
    4,
    "pathology",
    "A 28-year-old woman has knee pain. The film shows a lytic lesion reaching the epiphysis of the distal femur, abutting the joint, with a soap-bubble look. She is skeletally mature. A student calls it osteosarcoma because it is near the knee, and another calls it a unicameral bone cyst because it is lucent.",
    "Where must this tumor be, and why is age a clue?",
    [
        "Giant cell tumor sits in the epiphysis of a closed-growth-plate adult; osteosarcoma prefers the metaphysis of a teenager",
        "Giant cell tumor is diaphyseal in children with open plates",
        "A soap-bubble epiphyseal lesion is an osteoid osteoma nidus",
        "Unicameral cysts reach the articular surface in 30-year-olds",
        "Epiphyseal location means Ewing sarcoma",
    ],
    "Giant cell tumor sits in the epiphysis of a closed-growth-plate adult; osteosarcoma prefers the metaphysis of a teenager",
    "Giant cell tumor of bone is the epiphyseal lucent lesion of young adults after the plate closes, often around the knee. The 'soap bubble' is the description. Osteosarcoma is metaphyseal and makes bone in adolescents. An osteoid osteoma is a tiny cortical nidus, not a bubbly epiphyseal mass. Simple cysts are metaphyseal in children and do not cross to the joint like this. Ewing is diaphyseal.",
    "robbins-10",
)

add(
    "Osteochondroma",
    4,
    "pathology",
    "A 16-year-old has a hard painless bump on the distal femur that points away from the knee. The cap is cartilage and is continuous with the marrow cavity. It has not grown since he stopped growing. A student wants a radical resection because every cartilage cap is a chondrosarcoma.",
    "What is the lesion, and when does the cap become worrying?",
    [
        "It is an osteochondroma, a benign growth-plate cartilage rest; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma",
        "Any cartilage cap is chondrosarcoma at diagnosis",
        "Continuity with the marrow means osteosarcoma",
        "Painful night nidus is the usual presentation",
        "The lesion points toward the joint if it is benign",
    ],
    "It is an osteochondroma, a benign growth-plate cartilage rest; a thick or growing cap after skeletal maturity raises concern for chondrosarcoma",
    "Osteochondroma is a bony spur capped by cartilage, continuous with the medullary canal, aimed away from the joint, and it stops growing when the plate closes. Malignant change is uncommon and is suspected if the cap thickens or growth continues in an adult, not because cartilage is present at all. Marrow continuity is the benign osteochondroma feature, not osteosarcoma. Night pain relieved by NSAIDs is osteoid osteoma. Benign osteochondromas point away from the physis/joint.",
    "robbins-10",
)

add(
    "Sickle Salmonella osteomyelitis",
    4,
    "microbiology",
    "A child with sickle cell disease has a swollen, tender femur and fever. Blood cultures grow a gram-negative rod that produces hydrogen sulfide. He has had prior pain crises. A student treats this as a vaso-occlusive crisis only, because fever can occur in crisis, and names Staphylococcus as the only bone organism in sickle cell disease.",
    "Which organism is classic here, and why is 'just a crisis' unsafe?",
    [
        "Salmonella; infarcted gut and bone in sickle cell disease make Salmonella osteomyelitis the classic gram-negative, and fever plus focal bone findings need more than fluids",
        "Staphylococcus is the only organism, so a gram-negative rod is a contaminant",
        "Pseudomonas from a nail through a sneaker, which is this patient's exposure",
        "Crisis fluid alone treats bacterial osteomyelitis",
        "Hydrogen sulfide production is the lab signature of Streptococcus",
    ],
    "Salmonella; infarcted gut and bone in sickle cell disease make Salmonella osteomyelitis the classic gram-negative, and fever plus focal bone findings need more than fluids",
    "Most osteomyelitis is still Staphylococcus, but sickle cell disease is the exception people are tested on: Salmonella. Functional asplenia and infarcted bone are the setup. A focal hot bone with fever is not written off as a pain crisis. A gram-negative rod that makes H2S is Salmonella, not a contaminant you ignore. Pseudomonas is the sneaker puncture, which is not the history. Fluids do not treat osteomyelitis. Streptococcus does not give the H2S Salmonella signature.",
    "robbins-10",
)

add(
    "Compartment syndrome",
    5,
    "anatomy",
    "A young man has a tibial fracture in a cast. Pain is severe and worse when the toes are stretched. The foot is pale only late. Pulses are still present. A student says pulses must be lost before you open the compartments, and offers more opioid instead.",
    "What is dying, and why are pulses the wrong trigger?",
    [
        "Muscle and nerve inside a closed compartment are ischemic at pressures well below arterial pressure, so pulses can remain; pain on passive stretch is the sign to open the cast and the fascia",
        "Absent pulses are required before fasciotomy",
        "Pain relieved by a reasonable opioid dose excludes compartment syndrome",
        "The artery is blocked, which is why pulses stay normal",
        "Stretching the toes should relieve ischemic muscle pain",
    ],
    "Muscle and nerve inside a closed compartment are ischemic at pressures well below arterial pressure, so pulses can remain; pain on passive stretch is the sign to open the cast and the fascia",
    "Compartment pressure can collapse capillaries and kill muscle while arterial pulses persist, because arterial pressure is higher than the compartment. Pain out of proportion and pain on passive stretch come first; pulselessness is late. Waiting for a lost pulse waits too long. Opioids that do not touch the pain are a clue, not a treatment. Pulses are present precisely because the artery is not yet occluded. Passive stretch hurts; it does not relieve the ischemia.",
    "guyton-14",
)

add(
    "Scaphoid fracture",
    4,
    "anatomy",
    "A man fell on an outstretched hand and has pain in the anatomic snuffbox. Initial radiographs are normal. He is told it is a sprain and not immobilized. Two months later the proximal pole of the scaphoid is sclerotic.",
    "Why did the proximal pole die?",
    [
        "The scaphoid's blood supply enters distally and runs retrograde, so a waist fracture isolates the proximal pole",
        "The distal pole is the one that necroses because blood enters proximally",
        "A normal first film excludes a scaphoid fracture",
        "Avascular necrosis of the scaphoid is from a radial artery laceration only",
        "Snuffbox pain is the lunate, which has a rich dual supply that never necroses",
    ],
    "The scaphoid's blood supply enters distally and runs retrograde, so a waist fracture isolates the proximal pole",
    "Radial artery branches enter the scaphoid from the distal end. A fracture through the waist cuts the proximal fragment off its blood, and avascular necrosis follows. The distal pole is the side that still has vessels. Early films miss scaphoid fractures, which is why snuffbox tenderness is immobilized even when the x-ray is normal. The mechanism is intraosseous retrograde flow, not only a cut artery in the open wound. The lunate can necrose (Kienbock) but snuffbox tenderness is the scaphoid, and the lunate is not immune.",
    "guyton-14",
)

add(
    "Supracondylar fracture",
    5,
    "anatomy",
    "A child falls off a swing and has a swollen elbow. The hand is pale and the radial pulse is weak. He cannot flex the index finger well when asked to make the OK sign, and sensation is reduced on the palmar index finger. A student says the ulnar nerve is the one at risk because the elbow is the ulnar groove.",
    "Which artery and nerve are in danger?",
    [
        "The brachial artery and the anterior interosseous branch of the median nerve, in a supracondylar humerus fracture",
        "The ulnar nerve and the ulnar artery, because all elbow injuries hit the cubital tunnel",
        "The radial nerve in the spiral groove, which flexes the index finger",
        "The axillary nerve, which supplies the OK sign",
        "A weak pulse is normal after any pediatric elbow sprain and needs no reduction",
    ],
    "The brachial artery and the anterior interosseous branch of the median nerve, in a supracondylar humerus fracture",
    "Supracondylar fractures displace the distal fragment and stretch the brachial artery and the median nerve where they cross the elbow. The anterior interosseous nerve is motor to flexor pollicis longus and flexor digitorum profundus to the index, so the OK sign fails, often without a dramatic sensory loss, though palmar sensation can suffer if the main median nerve is involved. The ulnar nerve is the risk at the medial epicondyle and the cubital tunnel, not the classic supracondylar vascular injury. The radial nerve extends the wrist; it does not flex the index tip. The axillary nerve is shoulder abduction and the lateral shoulder patch. A weak pulse with pallor is ischemia until the fracture is reduced.",
    "guyton-14",
)

add(
    "SCFE versus Perthes",
    5,
    "pathology",
    "Boy A is 13, overweight, and has a weeks-long limp with the hip held in external rotation. The ice-cream scoop of the femoral head has slipped off the neck. Boy B is 6, thinner, and has a painless limp with a flattened femoral head. A student orders the same immediate pinning story for both and calls both infection.",
    "Which child has a slip that can threaten the blood supply if missed, and which has osteonecrosis of the epiphysis as the disease itself?",
    [
        "A is slipped capital femoral epiphysis and needs urgent stabilization; B is Legg-Calve-Perthes, idiopathic osteonecrosis in a younger child",
        "Both are septic hips and need drainage tonight",
        "B is the SCFE because he is younger",
        "A can bear weight so the slip is stable and follow-up in six months is fine",
        "Perthes disease is a slipped epiphysis on the x-ray",
    ],
    "A is slipped capital femoral epiphysis and needs urgent stabilization; B is Legg-Calve-Perthes, idiopathic osteonecrosis in a younger child",
    "SCFE is an adolescent, often heavy, whose proximal femoral epiphysis slides. Even a stable-seeming slip is pinned so it does not go on and so osteonecrosis is limited. Perthes is younger children, the head itself necroses and flattens, and the treatment is containment, not the same emergency pin. Infection is a different acute picture. Age runs the other way: SCFE is the teenager. Delayed follow-up of a slip risks further displacement. The Perthes film is a collapsed head, not a slip off the neck.",
    "robbins-10",
)

add(
    "Osteoporosis versus osteomalacia",
    4,
    "pathology",
    "Woman A is 72, has a vertebral compression fracture, normal calcium, normal phosphate, normal PTH, and a low DEXA T-score. Woman B has bone pain, low vitamin D, low calcium, low phosphate, high PTH, and Looser zones. A student says both have weak bone so both get the same vitamin D lecture and neither has a mineralization problem.",
    "Which matrix is normal, and which is unmineralized?",
    [
        "A has normally mineralized bone that is simply less of it; B has osteoid that never mineralized because vitamin D and mineral were short",
        "Both have unmineralized osteoid",
        "A has osteomalacia because the T-score is low",
        "B has osteoporosis because calcium is low",
        "PTH is low in vitamin D deficiency",
    ],
    "A has normally mineralized bone that is simply less of it; B has osteoid that never mineralized because vitamin D and mineral were short",
    "Osteoporosis is less bone of normal composition, so calcium and phosphate labs are normal and the T-score is low; fractures are vertebral and hip. Osteomalacia is soft bone: vitamin D deficiency drops calcium and phosphate, PTH rises, and osteoid does not mineralize, with Looser zones. They are not the same lecture. A low T-score without mineral abnormalities is osteoporosis, not osteomalacia. Low calcium is the osteomalacia direction, not the definition of osteoporosis. Vitamin D deficiency raises PTH; it does not suppress it.",
    "robbins-10",
)

add(
    "Paget disease",
    4,
    "pathology",
    "An older man has a large skull, hearing loss, and a warm bowed tibia. Calcium is normal. Alkaline phosphatase is very high and the other liver enzymes are normal. A student calls it prostate cancer because ALP can rise in bone metastases, and he wants a PSA only.",
    "What is the bone doing, and which later tumor is the rare fear?",
    [
        "Chaotic osteoclast then osteoblast activity makes woven bone and a huge ALP; osteosarcoma is the rare late tumor, and isolated ALP with this shape is Paget disease",
        "Paget disease lowers ALP because bone is quiet",
        "Hearing loss means the cranial nerves are compressed by a meningioma as the usual Paget story is false",
        "Normal calcium excludes Paget disease",
        "Prostate metastases bow one tibia and spare the calcium while isolating ALP from the rest of the liver panel as their classic first sign",
    ],
    "Chaotic osteoclast then osteoblast activity makes woven bone and a huge ALP; osteosarcoma is the rare late tumor, and isolated ALP with this shape is Paget disease",
    "Paget disease is disordered resorption and formation. The bone is vascular and mosaic, ALP from osteoblasts is high, and calcium stays normal unless the patient is immobilized. Skull enlargement compresses cranial nerve VIII. A late risk is osteosarcoma in pagetic bone. ALP is high, not low. The hearing loss is foraminal crowding from bone, which is part of the disease. Normal calcium is expected. Prostate cancer can raise ALP when it is in bone, but the enlarged skull and bowed warm tibia are the Paget pattern, not a reason to stop at PSA.",
    "robbins-10",
)

add(
    "Bisphosphonate adverse effects",
    4,
    "pharmacology",
    "A woman on alendronate for osteoporosis is told to take it upright with water and to wait before breakfast. She has severe reflux. After years of IV zoledronic acid for a different indication she develops exposed jaw bone after an extraction, and a classmate has an atypical femoral fracture. A student says these drugs build a lot of normal new bone and can be taken lying down.",
    "How do they work, and why the instructions?",
    [
        "They bind hydroxyapatite and kill osteoclasts, so turnover falls; esophageal irritation is why she stays upright, and long use rarely causes osteonecrosis of the jaw and atypical fractures because bone becomes too quiet",
        "Bisphosphonates activate osteoclasts, which is why the jaw dies",
        "They can be swallowed lying down because they are not acidic to the esophagus",
        "Atypical femoral fractures mean the dose is too low",
        "Osteonecrosis of the jaw is the expected effect of a two-week course",
    ],
    "They bind hydroxyapatite and kill osteoclasts, so turnover falls; esophageal irritation is why she stays upright, and long use rarely causes osteonecrosis of the jaw and atypical fractures because bone becomes too quiet",
    "Bisphosphonates stop osteoclasts. Bone density rises because resorption falls, not because a burst of healthy formation occurs. The pill can ulcerate the esophagus, so she stays up and takes it on an empty stomach. Years of potent drug, especially IV, plus a dental extraction, is the jaw osteonecrosis setting. Suppressed turnover is also why an atypical femur fracture, a stress fracture of too-quiet bone, occurs. They do not activate osteoclasts. Lying down is exactly the wrong instruction. An atypical fracture is over-suppression, not under-dosing. Jaw osteonecrosis is rare and late, not a two-week effect.",
    "katzung-16",
)

add(
    "Denosumab versus teriparatide",
    5,
    "pharmacology",
    "A woman cannot take a bisphosphonate. One option is a RANKL antibody. Another is a daily PTH analog. She has a history of skeletal radiation. A student says both drugs are anabolic and both are safe after radiation, and that stopping the antibody has no rebound.",
    "Which drug builds bone by a pulse of PTH, and which risk fits the antibody?",
    [
        "Teriparatide is intermittent PTH and is anabolic, and it is avoided after skeletal radiation or Paget disease because of osteosarcoma concern; denosumab blocks RANKL, and stopping it can rebound fractures",
        "Denosumab is a PTH analog",
        "Teriparatide blocks RANKL",
        "Both may be used freely after radiation to bone",
        "Continuous high PTH and once-daily teriparatide have the same anabolic effect",
    ],
    "Teriparatide is intermittent PTH and is anabolic, and it is avoided after skeletal radiation or Paget disease because of osteosarcoma concern; denosumab blocks RANKL, and stopping it can rebound fractures",
    "A daily pulse of PTH analog favors osteoblasts. Continuous PTH, as in hyperparathyroidism, favors resorption. That is why teriparatide is anabolic and why it is not the same as a high PTH disease. It carries a rodent osteosarcoma signal, so radiation and Paget disease are avoidance settings. Denosumab is a monoclonal antibody against RANKL, so osteoclasts are not activated. It is antiresorptive. When it is stopped, turnover rebounds and vertebral fractures can follow, so it is not a drug you halt without a plan. Calling both anabolic and both radiation-safe swaps them.",
    "katzung-16",
)

add(
    "Polymyalgia versus myositis",
    5,
    "pathology",
    "A 74-year-old woman cannot lift her shoulders because of pain and stiffness in the morning. Strength testing once she is past the pain is actually normal. CK is normal and ESR is 90. She has a new headache. A student diagnoses polymyositis and orders a muscle biopsy first, and skips the headache.",
    "What is the disease pair, and why is the biopsy the wrong first move?",
    [
        "Polymyalgia rheumatica with possible giant-cell arteritis; the muscle is not necrotic so CK is normal, and the headache needs steroids promptly to protect vision rather than a wait for biopsy of muscle",
        "Polymyositis, because shoulder pain means inflamed muscle and CK should be ignored",
        "Statin myopathy, because the ESR is high",
        "A normal CK excludes vasculitis",
        "Giant-cell arteritis is a disease of people under 50",
    ],
    "Polymyalgia rheumatica with possible giant-cell arteritis; the muscle is not necrotic so CK is normal, and the headache needs steroids promptly to protect vision rather than a wait for biopsy of muscle",
    "Polymyalgia is pain and stiffness of shoulders and hips in an older adult, with a high ESR and a normal CK, because the muscle itself is not the inflamed tissue. Giant-cell arteritis travels with it. A new headache is a vision-threatening arteritis until proven otherwise, and steroids are not delayed for a muscle biopsy. Polymyositis has true weakness and a high CK. Statin myopathy raises CK and does not raise the ESR into this range as its signature. A normal CK is expected in vasculitis of this type and does not clear the temporal artery. Giant-cell arteritis is a disease of older adults.",
    "robbins-10",
)

add(
    "Ankylosing spondylitis",
    4,
    "pathology",
    "A 24-year-old man has low back pain that is worse in the morning, better with movement, and wakes him in the second half of the night. Chest expansion is reduced. He had a red eye last year. A student calls it a herniated disc because he is young, and orders bed rest.",
    "Which HLA and which spinal finding fit, and why is rest wrong?",
    [
        "HLA-B27; the entheses and sacroiliac joints are inflamed, and activity helps, whereas a disc is worse with sitting and flexion and is not a systemic eye disease",
        "HLA-DR4, the rheumatoid association, as the cause of sacroiliitis",
        "Rest is the treatment of inflammatory back pain",
        "Anterior uveitis means infection, so the back pain is septic",
        "Reduced chest expansion is asthma, unrelated to the spine",
    ],
    "HLA-B27; the entheses and sacroiliac joints are inflamed, and activity helps, whereas a disc is worse with sitting and flexion and is not a systemic eye disease",
    "Ankylosing spondylitis is an HLA-B27 spondyloarthritis. Inflammation is at entheses and the sacroiliac joints, morning stiffness improves with use, and anterior uveitis is the eye clue. Costovertebral fusion limits chest expansion. A disc herniation is mechanical, worse with flexion and sitting, and has no uveitis. HLA-DR4 is rheumatoid arthritis, a peripheral synovial disease. Bed rest stiffens inflammatory back pain further. One red eye in this pattern is uveitis, not a reason to call the spine septic. The chest finding is thoracic spine and rib joint fusion.",
    "robbins-10",
)

add(
    "Rheumatoid versus osteoarthritis",
    4,
    "pathology",
    "Patient A has morning stiffness for two hours, boggy MCP and PIP joints, and spares the DIPs. Rheumatoid factor and anti-CCP are positive. Patient B is 70, has DIP Heberden nodes, a short-lived morning ache, and a knee that hurts with walking. A student says both are wear-and-tear and both should have a positive anti-CCP.",
    "Which joint and which antibody separate them?",
    [
        "A is synovial pannus of rheumatoid arthritis, MCP and PIP, anti-CCP specific; B is cartilage loss of osteoarthritis at DIPs and the knee, antibody negative",
        "Osteoarthritis hits the MCP joints and lasts all morning",
        "Anti-CCP is the osteoarthritis screening test",
        "Rheumatoid arthritis prefers the DIP joints",
        "Heberden nodes are rheumatoid nodules",
    ],
    "A is synovial pannus of rheumatoid arthritis, MCP and PIP, anti-CCP specific; B is cartilage loss of osteoarthritis at DIPs and the knee, antibody negative",
    "Rheumatoid arthritis is an autoimmune synovitis. Pannus invades cartilage, morning stiffness is prolonged, MCPs and PIPs are involved, DIPs are spared, and anti-CCP is specific. Osteoarthritis is mechanical cartilage failure: DIPs, PIPs, first CMC, knees, and hips, with brief stiffness and bony nodes, and no anti-CCP. Wear-and-tear does not explain an hour of stiffness and boggy MCPs. Anti-CCP is not an OA test. DIPs are the OA joint, not the rheumatoid one. Heberden nodes are osteophytes, not rheumatoid nodules.",
    "acr-ra-2021",
)

add(
    "Gout crystal color",
    4,
    "pathology",
    "A fellow remembers 'yellow when parallel' but swaps the crystal. Under the compensator, needles parallel to the axis are yellow and perpendicular needles are blue. The patient has podagra. Another slide of rhomboids from a knee turns blue when parallel.",
    "Which crystal is yellow when parallel?",
    [
        "Monosodium urate is negatively birefringent, yellow when parallel; calcium pyrophosphate is the blue-when-parallel rhomboid",
        "Calcium pyrophosphate is yellow when parallel",
        "Both crystals are yellow when parallel and the shape does not matter",
        "Urate is positively birefringent",
        "The color depends on the gram stain, not the compensator",
    ],
    "Monosodium urate is negatively birefringent, yellow when parallel; calcium pyrophosphate is the blue-when-parallel rhomboid",
    "Negative birefringence means the crystal is yellow when its long axis is parallel to the compensator. That is urate, and the shape is a needle, and the toe is the joint. CPPD is positive, blue when parallel, and rhomboid, usually the knee. Swapping the color swaps the disease. Shape and color both matter. Urate is the negatively birefringent one. The compensator, not the gram stain, assigns the color.",
    "acr-gout-2020",
)

add(
    "Osteopetrosis",
    4,
    "pathology",
    "A child has fractures of brittle marble bone, cranial nerve crowding, and a low blood count. The marrow cavity is filled with unresorbed primary spongiosa. Carbonic anhydrase II is mentioned. A student says osteoclasts are overactive because the bones are dense.",
    "What failed, and why is the marrow crowded?",
    [
        "Osteoclasts cannot acidify the resorption pit without carbonic anhydrase II, so bone is not carved out and the marrow has no room",
        "Osteoblasts have failed, so bone is thin",
        "The disease is osteoporosis, which also fills the marrow with bone",
        "Cranial nerves are spared because the foramina widen",
        "Dense bone means resorption is increased",
    ],
    "Osteoclasts cannot acidify the resorption pit without carbonic anhydrase II, so bone is not carved out and the marrow has no room",
    "Osteoclasts need acid to dissolve hydroxyapatite. Carbonic anhydrase II supplies the protons. Without it, bone is made and not removed, foramina narrow, nerves are compressed, and the marrow cavity never opens, so pancytopenia follows. Osteoblasts are working; that is why bone accumulates. Osteoporosis is too little bone. Foramina get smaller, not larger. Density here is failed resorption, not extra resorption.",
    "robbins-10",
)

add(
    "Achondroplasia",
    4,
    "pathology",
    "A child has short limbs, a normal trunk, and a large head with frontal bossing. A parent has the same proportions. Intelligence is normal. The growth-plate cartilage fails to proliferate. A student calls it cretinism because both can be short, and another calls it osteogenesis imperfecta because the limbs are short.",
    "Which receptor is constitutively active?",
    [
        "FGFR3, which inhibits chondrocyte proliferation, is overactive; this is not a thyroid or collagen-brittle-bone disease",
        "A mutated collagen I gene, which causes blue sclerae and fractures as the main picture",
        "FGFR3 loss of function, which would lengthen the limbs",
        "Thyroid hormone receptor blockade, with delayed bone age as the only growth-plate lesion",
        "The trunk is short and the limbs are normal",
    ],
    "FGFR3, which inhibits chondrocyte proliferation, is overactive; this is not a thyroid or collagen-brittle-bone disease",
    "Achondroplasia is activating FGFR3. The receptor's normal job is to slow the growth plate, so a receptor stuck on makes short limbs (rhizomelic) with a relatively normal trunk and a large head. It is autosomal dominant. Cretinism is hypothyroidism, with delayed bones and a different body proportion and developmental delay. Osteogenesis imperfecta is collagen I, fractures, and blue sclerae, not this proportion with normal intelligence as the lead. Loss of FGFR3 would not suppress the plate. The limbs are the short part.",
    "robbins-10",
)

add(
    "Nursemaid elbow",
    4,
    "anatomy",
    "A toddler is yanked by the hand, then will not use the arm, and holds it slightly flexed and pronated. There is no swelling and radiographs are normal. A student orders an MRI for a supracondylar fracture because the child will not move the elbow.",
    "What slipped, and what is the maneuver?",
    [
        "The radial head slipped out of the annular ligament; supination and flexion reduce it",
        "The ulnar nerve dislocated and needs surgical transposition",
        "This is a scaphoid fracture, so a cast for two weeks without reduction is enough",
        "The distal humerus is displaced and the pulse must be checked as the only lesion",
        "Pronation is the reduction maneuver that seats the radial head",
    ],
    "The radial head slipped out of the annular ligament; supination and flexion reduce it",
    "Nursemaid's elbow is subluxation of the radial head from the annular ligament after longitudinal traction. The child refuses the arm, films are normal, and reduction is supination with flexion. The ulnar nerve is not out of its groove. A scaphoid fracture is a fall on the hand in an older child or adult, with snuffbox pain. A supracondylar fracture swells and threatens the pulse; a normal film and a traction history are the radial head. The reduction supinates; pronation is not the seating maneuver.",
    "guyton-14",
)

add(
    "Rotator cuff",
    4,
    "anatomy",
    "A 60-year-old cannot start abduction of the shoulder and has pain at night. When the arm is passively lifted past 30 degrees he can hold it up using the deltoid. Drop-arm test is positive. A student says the deltoid is torn because abduction is weak, and another says the subscapularis because that is the supraspinatus neighbor.",
    "Which tendon starts abduction?",
    [
        "Supraspinatus starts the first degrees of abduction; deltoid takes over after, so a cuff tear shows up when initiation fails",
        "Deltoid initiates abduction and supraspinatus only lifts past 90 degrees",
        "Subscapularis abducts the shoulder",
        "Biceps long head is the only abductor",
        "A positive drop-arm test means the axillary nerve is out and the cuff is intact",
    ],
    "Supraspinatus starts the first degrees of abduction; deltoid takes over after, so a cuff tear shows up when initiation fails",
    "Supraspinatus seats the humeral head and starts abduction. Past about 15 degrees the deltoid can continue, which is why passive assistance lets him hold the arm up and why he cannot begin the motion himself. Night pain and a drop when he lowers the arm are the cuff. The deltoid is working if he can hold the arm once it is up. Subscapularis internally rotates. The long head of biceps is a humeral-head depressor, not the abductor you are testing. Drop-arm is the cuff, not an isolated axillary nerve lesion, which would atrophy the deltoid and numb the lateral shoulder.",
    "guyton-14",
)

add(
    "ACL and unhappy triad",
    4,
    "anatomy",
    "A soccer player is clipped from the lateral side. The knee opens medially, the anterior drawer and Lachman tests are positive, and the joint locks. A student says the lateral collateral ligament is the one that opens with a valgus force, and that a positive Lachman is the posterior cruciate.",
    "Which three structures?",
    [
        "Medial collateral ligament, medial meniscus, and anterior cruciate ligament",
        "Lateral collateral, lateral meniscus, and posterior cruciate",
        "Anterior cruciate only, because Lachman ignores the collateral ligaments",
        "Posterior cruciate, because the tibia slides backward on a positive anterior drawer",
        "Medial collateral alone, because locking means a bone bruise and not a meniscus",
    ],
    "Medial collateral ligament, medial meniscus, and anterior cruciate ligament",
    "A lateral blow is a valgus force. It opens the medial side, tearing the medial collateral ligament, and can continue through the medial meniscus and the ACL. That is the unhappy triad. Lachman and anterior drawer pull the tibia forward, which is the ACL, not the PCL. The lateral collateral resists varus. A positive Lachman is not a collateral test, but the valgus opening is. Anterior drawer is forward, not backward. Locking and joint-line pain are the meniscus, not a bruise you can ignore.",
    "guyton-14",
)

add(
    "Osteogenesis imperfecta",
    4,
    "pathology",
    "A child has had several fractures with minimal force, blue sclerae, and hearing loss starting to appear. A parent was investigated for abuse. Teeth are imperfect. The collagen is type I. A student says the blue sclerae are from Ehlers-Danlos type collagen III and that child abuse is still the only explanation because the genes cannot break bone.",
    "Which collagen, and why is abuse the differential rather than the only answer?",
    [
        "Type I collagen is defective, so bone is brittle and sclerae are thin and blue; abuse must be considered but the systemic findings point to osteogenesis imperfecta",
        "Type III collagen, which causes hollow organs to rupture as the bone disease",
        "Type II collagen, the cartilage collagen of Stickler syndrome only",
        "Blue sclerae are diagnostic of copper deficiency",
        "Fractures with a genetic disease exclude any need to think about abuse",
    ],
    "Type I collagen is defective, so bone is brittle and sclerae are thin and blue; abuse must be considered but the systemic findings point to osteogenesis imperfecta",
    "Osteogenesis imperfecta is a type I collagen disease. Bone matrix is weak, sclerae show the choroid through thin collagen, teeth and hearing can fail. Multiple fractures raise abuse, and abuse is still considered, but blue sclerae, family pattern, and dental findings are the disease. Type III collagen is vascular Ehlers-Danlos, hollow-organ rupture. Type II is cartilage. Blue sclerae are not the copper-deficiency sign (that is Menkes kinky hair and vascular tortuosity). A genetic brittle-bone disease does not mean you never consider trauma; it means you do not stop there.",
    "robbins-10",
)

add(
    "Ehlers-Danlos vessel",
    4,
    "pathology",
    "A young man has translucent skin, easy bruising, and a ruptured colon during a minor illness. Hypermobile joints are present but the emergency is the vessel and the bowel. A student says this is the same type I collagen disease as brittle bones.",
    "Which collagen failed?",
    [
        "Type III collagen in vessels and hollow organs",
        "Type I collagen, so the next finding should be blue sclerae and a femoral fracture as the lead",
        "Type IV collagen, so the glomerulus is the organ that ruptured",
        "Fibrillin, so the lens should dislocate upward as the required companion",
        "Type II collagen, so the annulus of the disc is the only tissue at risk",
    ],
    "Type III collagen in vessels and hollow organs",
    "Vascular Ehlers-Danlos is type III collagen. Arteries and the bowel rupture, skin is thin, and bruising is easy. Classic hypermobile forms are other collagen types and are not the rupture disease. Type I is bone and sclera. Type IV is basement membrane, Goodpasture and Alport, not a colonic perforation. Fibrillin is Marfan syndrome. Type II is cartilage.",
    "robbins-10",
)

add(
    "Gout negative birefringence trap already used",
    4,
    "pharmacology",
    "A patient with recurrent gout and uric acid kidney stones is choosing a prevention drug. He under-excretes uric acid and his GFR is normal. He wants a drug that increases uric acid excretion. He has no history of overproduction from tumor lysis. A student offers probenecid and also offers it to a different patient whose GFR is 20 mL/min and who already makes stones.",
    "Who can use a uricosuric, and who should not?",
    [
        "Probenecid blocks proximal reabsorption of urate and can help an under-excretor with a normal kidney and no stones; it is a poor choice when GFR is low or when stones are already forming, where allopurinol lowers production",
        "Probenecid is safe in uric acid stone formers because it dissolves stones by raising urine urate",
        "Allopurinol increases uric acid excretion",
        "A GFR of 20 is the best setting for probenecid",
        "Under-excretors should receive rasburicase as daily oral therapy",
    ],
    "Probenecid blocks proximal reabsorption of urate and can help an under-excretor with a normal kidney and no stones; it is a poor choice when GFR is low or when stones are already forming, where allopurinol lowers production",
    "Probenecid inhibits URAT1, so less urate is reabsorbed and more appears in the urine. That helps someone who under-excretes, if the kidney works and the urine will not be flooded into new stones. Stones and a low GFR are reasons to use a xanthine oxidase inhibitor instead. Raising urine urate does not treat existing stones; it can make them. Allopurinol decreases production, it does not increase excretion. Probenecid needs a working tubule, so GFR 20 is the wrong patient. Rasburicase is an IV recombinant uricase for tumor lysis, not a daily gout pill.",
    "acr-gout-2020",
)

add(
    "Colchicine mechanism",
    4,
    "pharmacology",
    "A man takes colchicine for an acute gout flare and develops profuse diarrhea. The joint is improving. He asks how a drug that does not lower uric acid can help, and whether the diarrhea means he should double the dose. He is also on a strong CYP3A4 and P-glycoprotein inhibitor.",
    "What does colchicine bind, and why is the inhibitor dangerous?",
    [
        "It binds tubulin and blocks neutrophil migration; diarrhea is toxicity, and a strong CYP3A4 or P-gp inhibitor raises the level enough to cause marrow and muscle failure",
        "It inhibits xanthine oxidase, so diarrhea means uric acid is falling correctly",
        "Doubling the dose is the way to treat the diarrhea",
        "Colchicine is safe with any CYP inhibitor because it is renally inert",
        "Neutrophils use microtubules only for antibody production, which is irrelevant to the joint",
    ],
    "It binds tubulin and blocks neutrophil migration; diarrhea is toxicity, and a strong CYP3A4 or P-gp inhibitor raises the level enough to cause marrow and muscle failure",
    "Colchicine caps microtubules. Neutrophils cannot crawl into the joint, which is the anti-inflammatory effect, and it does not change the uric acid pool. The gut lining also depends on microtubules, so diarrhea is a dose-limiting toxicity, not a sign of success to chase with more drug. Clearance depends on CYP3A4 and P-glycoprotein; inhibitors such as clarithromycin can cause fatal marrow suppression and rhabdomyolysis. It is not a xanthine oxidase inhibitor. The dose is reduced or stopped when diarrhea starts, not doubled.",
    "katzung-16",
)

add(
    "Dermatomyositis rash",
    4,
    "pathology",
    "A woman has proximal weakness, a heliotrope rash on the eyelids, and scaly red papules on the knuckles. CK is high. She is 58 and has not had a cancer screen. A student calls it eczema of the hands and age-related weakness, and skips the malignancy question. A biopsy pattern discussed is perimysial inflammation.",
    "What are the knuckle lesions, and why does age matter?",
    [
        "Gottron papules with a heliotrope rash are dermatomyositis; in adults it is associated with malignancy, and the inflammation is perimysial and perifascicular, unlike endomysial polymyositis",
        "These rashes are psoriasis, and CK is high from a statin she is not taking",
        "Polymyositis has the heliotrope rash and no cancer link",
        "Perimysial inflammation is the polymyositis pattern",
        "Adult dermatomyositis does not change cancer screening",
    ],
    "Gottron papules with a heliotrope rash are dermatomyositis; in adults it is associated with malignancy, and the inflammation is perimysial and perifascicular, unlike endomysial polymyositis",
    "Gottron papules are the knuckle rash of dermatomyositis, and the violaceous eyelids are heliotrope. Proximal weakness and a high CK complete it. Adults with dermatomyositis have an increased rate of underlying cancer, so the age is a reason to look, not to call it eczema. Psoriasis does not raise CK or weaken the shoulders in this pattern. Polymyositis lacks the rash. The perimysial, perifascicular atrophy pattern is dermatomyositis; endomysial inflammation is polymyositis. Skipping screening misses the association.",
    "robbins-10",
)
