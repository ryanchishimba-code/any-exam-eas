# USMLE Step 1 — musculoskeletal, skin, and subcutaneous tissue.
# Foundational-science interpretation items. No database calls.

ITEMS = [
    {
        "id": "s1-msk-001",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 71-year-old woman with a femoral-neck T-score of -3.2 and a prior vertebral "
            "compression fracture starts a daily subcutaneous bone medication. She has never "
            "received radiation, has no history of Paget disease or skeletal malignancy, and "
            "her baseline calcium was 9.4 mg/dL with a normal parathyroid hormone and a "
            "normal alkaline phosphatase. Six weeks later she reports mild nausea. Repeat "
            "laboratories show calcium 10.9 mg/dL, phosphate 3.1 mg/dL, creatinine 0.8 mg/dL, "
            "and a clear rise in serum procollagen type I N-terminal propeptide. She is not "
            "taking extra calcium beyond a dietary source. Which agent best accounts for the "
            "simultaneous rise in serum calcium and the bone-formation marker?"
        ),
        "question": "Which agent best accounts for the simultaneous rise in serum calcium and the bone-formation marker?",
        "options": [
            "Teriparatide",
            "Alendronate",
            "Denosumab",
            "Raloxifene",
            "Calcitonin",
        ],
        "correctAnswer": "Teriparatide",
        "explanation": (
            "Teriparatide is a recombinant parathyroid hormone 1-34 fragment. Intermittent "
            "exposure favors osteoblast activity, so formation markers such as procollagen "
            "type I N-terminal propeptide rise, and a mild increase in serum calcium is an "
            "expected pharmacologic effect from increased bone turnover and increased renal "
            "calcium reabsorption. That laboratory direction is the opposite of a pure "
            "antiresorptive effect. Alendronate is wrong because a nitrogen-containing "
            "bisphosphonate inhibits osteoclasts and suppresses, rather than raises, bone-"
            "formation markers, and it tends to lower serum calcium. Denosumab is wrong "
            "because RANKL blockade rapidly suppresses osteoclasts and can cause "
            "hypocalcemia, not a formation-marker surge with hypercalcemia. Raloxifene is "
            "wrong because this selective estrogen receptor modulator slows resorption "
            "modestly and does not produce a rising formation marker or this calcium rise. "
            "Calcitonin is wrong because it inhibits osteoclasts and lowers serum calcium, "
            "and tachyphylaxis limits any sustained anabolic signal."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-002",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 74-year-old woman has taken oral alendronate for seven years after a vertebral "
            "fracture. For three months she has had aching pain in the right thigh that is "
            "worse with weight bearing and was present before any fall. She then feels a "
            "crack while stepping off a curb, without high-energy trauma. Radiographs show a "
            "transverse fracture of the subtrochanteric femoral shaft, almost no comminution, "
            "and focal thickening, or beaking, of the lateral cortex at the fracture site. "
            "The femoral neck and intertrochanteric region are intact. Calcium, phosphate, "
            "and parathyroid hormone are normal. Which interpretation of this fracture "
            "pattern is most accurate?"
        ),
        "question": "Which interpretation of this fracture pattern is most accurate?",
        "options": [
            "Atypical femoral fracture related to long-term bisphosphonate use",
            "Typical osteoporotic intertrochanteric fragility fracture",
            "Osteoid osteoma of the femoral cortex",
            "Conventional osteosarcoma of the distal femoral metaphysis",
            "Incomplete stress fracture confined to the medial femoral neck",
        ],
        "correctAnswer": "Atypical femoral fracture related to long-term bisphosphonate use",
        "explanation": (
            "Long-term suppression of bone remodeling by a bisphosphonate allows microdamage "
            "to accumulate. The resulting atypical femoral fracture is a transverse or short "
            "oblique break of the subtrochanteric shaft or diaphysis, with lateral cortical "
            "beaking, minimal comminution, and a prodrome of thigh pain. That radiographic "
            "pattern, not the mere history of osteoporosis, is what classifies the injury. "
            "Typical osteoporotic intertrochanteric fragility fracture is wrong because those "
            "fractures sit in the intertrochanteric region, are often spiral or comminuted, "
            "and lack lateral cortical beaking of the shaft. Osteoid osteoma of the femoral "
            "cortex is wrong because a nidus produces nocturnal pain relieved by nonsteroidal "
            "drugs and does not snap into a transverse shaft fracture. Conventional "
            "osteosarcoma of the distal femoral metaphysis is wrong because osteosarcoma "
            "forms tumor osteoid, often with a sunburst periosteal reaction and a soft-tissue "
            "mass in the metaphysis, not a beaked transverse shaft fracture. Incomplete "
            "stress fracture confined to the medial femoral neck is wrong because medial-neck "
            "compression fractures of runners are a different site and lack subtrochanteric "
            "lateral beaking."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-003",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 66-year-old woman begins alendronate for osteoporosis. She asks how the drug "
            "changes the cell that resorbs bone. A bone-biopsy teaching slide from a patient "
            "on a nitrogen-containing bisphosphonate shows osteoclasts that have lost their "
            "ruffled border and are undergoing apoptosis. The drug binds hydroxyapatite and "
            "is released in the acid environment under the osteoclast. Which molecular action "
            "best explains the loss of that ruffled border?"
        ),
        "question": "Which molecular action best explains the loss of that ruffled border?",
        "options": [
            "Inhibition of farnesyl pyrophosphate synthase in the osteoclast mevalonate pathway",
            "Antibody blockade of RANKL on the osteoblast surface",
            "Agonism at the parathyroid hormone receptor on osteoblasts",
            "Calcimimetic activation of the parathyroid calcium-sensing receptor",
            "Direct neutralization of sclerostin in osteocytes",
        ],
        "correctAnswer": "Inhibition of farnesyl pyrophosphate synthase in the osteoclast mevalonate pathway",
        "explanation": (
            "Nitrogen-containing bisphosphonates inhibit farnesyl pyrophosphate synthase. "
            "Osteoclasts then cannot prenylate small GTPases that organize the cytoskeleton, "
            "so the ruffled border fails and the cell undergoes apoptosis. Binding to "
            "hydroxyapatite concentrates the drug where resorption is occurring. Antibody "
            "blockade of RANKL on the osteoblast surface is wrong because that is the action "
            "of denosumab, a monoclonal antibody, not a bisphosphonate that must be "
            "internalized by the osteoclast. Agonism at the parathyroid hormone receptor on "
            "osteoblasts is wrong because that is teriparatide, an anabolic regimen, not an "
            "osteoclast poison. Calcimimetic activation of the parathyroid calcium-sensing "
            "receptor is wrong because cinacalcet lowers parathyroid hormone secretion and "
            "does not dismantle the osteoclast ruffled border. Direct neutralization of "
            "sclerostin in osteocytes is wrong because that is romosozumab, which increases "
            "bone formation through Wnt signaling rather than blocking the mevalonate pathway."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-004",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 69-year-old woman received denosumab 60 mg subcutaneously every six months for "
            "three years and then missed more than a year of doses after moving. She now has "
            "acute mid-back pain. Imaging shows several new vertebral compression fractures "
            "at levels that were intact on a film one year earlier. She has never taken a "
            "bisphosphonate. Serum calcium is normal, and there is no malignancy. Which "
            "property of denosumab best explains this rebound vertebral injury after the "
            "doses were stopped?"
        ),
        "question": "Which property of denosumab best explains this rebound vertebral injury after the doses were stopped?",
        "options": [
            "It is a circulating antibody and is not incorporated into bone mineral",
            "It binds hydroxyapatite and suppresses resorption for many years",
            "It is a parathyroid hormone analog that exhausts the osteoblast pool",
            "It permanently deletes osteoblast precursors in the marrow",
            "It blocks the calcium-sensing receptor only during an intravenous infusion",
        ],
        "correctAnswer": "It is a circulating antibody and is not incorporated into bone mineral",
        "explanation": (
            "Denosumab is a monoclonal antibody against RANKL. It is not incorporated into "
            "hydroxyapatite. When injections stop and the antibody is cleared, osteoclast "
            "precursors see a surge of RANKL, remodeling rebounds above baseline, and "
            "multiple vertebral fractures can follow a prolonged gap. It is a circulating "
            "antibody and is not incorporated into bone mineral, which is why the effect "
            "ends, unlike a drug that sits in the skeleton. It binds hydroxyapatite and "
            "suppresses resorption for many years is wrong because that persistence describes "
            "bisphosphonates, which this patient never took. It is a parathyroid hormone "
            "analog that exhausts the osteoblast pool is wrong because teriparatide is the "
            "parathyroid hormone analog and is anabolic while it is given. It permanently "
            "deletes osteoblast precursors in the marrow is wrong because denosumab targets "
            "the RANKL signal for osteoclasts and does not ablate osteoblasts. It blocks the "
            "calcium-sensing receptor only during an intravenous infusion is wrong because "
            "that description fits a calcimimetic concept, whereas denosumab is a "
            "subcutaneous RANKL antibody and does not act on the calcium-sensing receptor."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-005",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 78-year-old man with osteoporosis has an estimated glomerular filtration rate "
            "of 22 mL/min. Intravenous zoledronate was avoided because of the low filtration "
            "rate. Denosumab is being considered because the antibody is not cleared by the "
            "kidney. Today he reports perioral tingling. Laboratories show serum calcium "
            "7.3 mg/dL, albumin 4.0 g/dL, phosphate 3.4 mg/dL, 25-hydroxyvitamin D 18 ng/mL, "
            "parathyroid hormone 180 pg/mL, alkaline phosphatase 116 U/L, and hemoglobin "
            "11.4 g/dL. He has not yet received the injection. Which finding means the RANKL "
            "antibody should be withheld until the abnormality is corrected?"
        ),
        "question": "Which finding means the RANKL antibody should be withheld until the abnormality is corrected?",
        "options": [
            "Uncorrected serum calcium of 7.3 mg/dL",
            "Glomerular filtration rate of 22 mL/min",
            "Parathyroid hormone of 180 pg/mL",
            "Alkaline phosphatase of 116 U/L",
            "Hemoglobin of 11.4 g/dL",
        ],
        "correctAnswer": "Uncorrected serum calcium of 7.3 mg/dL",
        "explanation": (
            "Denosumab stops osteoclast-mediated calcium release. If the serum calcium is "
            "already low, the next dose can precipitate dangerous hypocalcemia, especially "
            "when vitamin D is low and glomerular filtration is reduced. Uncorrected serum "
            "calcium of 7.3 mg/dL is therefore the finding that flips the plan from giving "
            "the antibody today to repleting calcium and vitamin D first. Glomerular "
            "filtration rate of 22 mL/min is wrong as a reason to withhold denosumab, "
            "because lack of renal clearance is why the antibody is often chosen when a "
            "bisphosphonate is unsuitable; the low filtration rate does not itself prohibit "
            "the dose once calcium is safe. Parathyroid hormone of 180 pg/mL is wrong "
            "because secondary hyperparathyroidism is expected in this degree of chronic "
            "kidney disease and is not the immediate contraindication. Alkaline phosphatase "
            "of 116 U/L is wrong because a near-normal alkaline phosphatase does not predict "
            "acute hypocalcemia from the injection. Hemoglobin of 11.4 g/dL is wrong because "
            "mild anemia neither contraindicates denosumab nor identifies the calcium risk."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-006",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 73-year-old man has an enlarging skull, progressive hearing loss, and a warm "
            "right femur. Alkaline phosphatase is 920 U/L. Calcium, phosphate, and "
            "parathyroid hormone are normal. Radiographs show cotton-wool sclerosis of the "
            "skull and a blade-of-grass lytic front in the femur. A clinician considers "
            "teriparatide because a friend described it as a bone-building injection. The "
            "patient has no esophageal disease and has never had jaw osteonecrosis. Which "
            "adverse outcome is the reason to avoid teriparatide in this patient?"
        ),
        "question": "Which adverse outcome is the reason to avoid teriparatide in this patient?",
        "options": [
            "Osteosarcoma in bone that is already turning over abnormally",
            "Pill esophagitis from prolonged mucosal contact",
            "Osteonecrosis of the jaw after a dental extraction",
            "Acute hypocalcemia in the first days of therapy",
            "Atypical subtrochanteric femoral fracture with lateral beaking",
        ],
        "correctAnswer": "Osteosarcoma in bone that is already turning over abnormally",
        "explanation": (
            "This is Paget disease: isolated high alkaline phosphatase, normal calcium, and "
            "expanded bone. Teriparatide is avoided in Paget disease, prior skeletal "
            "radiation, open growth plates, and unexplained alkaline phosphatase elevation "
            "because of concern for osteosarcoma, seen in rodent toxicology and biologically "
            "plausible in pagetic bone that already has chaotic remodeling. Osteosarcoma in "
            "bone that is already turning over abnormally is the specific reason to reject "
            "the anabolic analog here. Pill esophagitis from prolonged mucosal contact is "
            "wrong because that injury is caused by oral bisphosphonates such as alendronate "
            "taken while recumbent, not by subcutaneous teriparatide. Osteonecrosis of the "
            "jaw after a dental extraction is wrong because that risk is attached to potent "
            "antiresorptives, bisphosphonates and denosumab, not to parathyroid hormone "
            "analog therapy. Acute hypocalcemia in the first days of therapy is wrong "
            "because teriparatide tends to raise calcium slightly. Atypical subtrochanteric "
            "femoral fracture with lateral beaking is wrong because that pattern follows "
            "prolonged antiresorptive exposure, not anabolic parathyroid hormone therapy."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-007",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 64-year-old woman has a vertebral fracture and a T-score of -2.8. She wants a "
            "medicine that also lowers the risk of an estrogen-receptor-positive breast "
            "cancer, which affected her sister. Her own history includes an unprovoked deep-"
            "vein thrombosis treated with anticoagulation for six months last year. She has "
            "severe hot flashes. Renal function and serum calcium are normal, and she can "
            "stand upright to swallow a tablet. Which adverse effect makes raloxifene the "
            "wrong selection in this history?"
        ),
        "question": "Which adverse effect makes raloxifene the wrong selection in this history?",
        "options": [
            "Venous thromboembolism",
            "Osteonecrosis of the jaw",
            "Esophageal ulceration",
            "Osteosarcoma",
            "Symptomatic hypocalcemia",
        ],
        "correctAnswer": "Venous thromboembolism",
        "explanation": (
            "Raloxifene is a selective estrogen receptor modulator that acts as an agonist on "
            "bone and as an antagonist in breast tissue, so it can reduce vertebral fractures "
            "and lower the risk of invasive breast cancer. The same estrogen-agonist effect "
            "on coagulation increases venous thromboembolism. A recent unprovoked deep-vein "
            "thrombosis makes that adverse effect the finding that removes raloxifene from "
            "the choice, regardless of the breast-cancer family history. Osteonecrosis of "
            "the jaw is wrong because that complication is associated with bisphosphonates "
            "and denosumab, not with raloxifene. Esophageal ulceration is wrong because pill "
            "esophagitis is the classic local injury from oral bisphosphonates, and this "
            "patient can stand upright in any case. Osteosarcoma is wrong because that "
            "concern belongs to teriparatide in predisposed bone, not to a selective estrogen "
            "receptor modulator. Symptomatic hypocalcemia is wrong because raloxifene does "
            "not shut down osteoclasts potently enough to produce the hypocalcemia seen with "
            "denosumab or intravenous bisphosphonates."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-008",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 70-year-old woman with osteoporosis was prescribed weekly alendronate. She has "
            "been swallowing the tablet with a sip of water and then returning to bed "
            "because of morning dizziness. Ten days later she has sudden odynophagia and "
            "retrosternal pain without heartburn history, thrush, or immunosuppression. She "
            "takes no other new medicines. Endoscopy shows a single discrete ulcer in the "
            "mid-esophagus with normal surrounding mucosa and no vesicles, plaques, or "
            "salmon-colored tongues. Which mechanism best accounts for this esophageal injury?"
        ),
        "question": "Which mechanism best accounts for this esophageal injury?",
        "options": [
            "Direct mucosal contact from a retained bisphosphonate tablet",
            "Candida albicans plaques in an immunosuppressed host",
            "Cytomegalovirus linear ulcers with viral inclusions",
            "Eosinophilic rings from food allergy",
            "Barrett metaplasia from long-standing acid reflux",
        ],
        "correctAnswer": "Direct mucosal contact from a retained bisphosphonate tablet",
        "explanation": (
            "Oral bisphosphonates are caustic if they linger against esophageal mucosa. "
            "Failure to take alendronate with a full glass of water and to remain upright "
            "lets the tablet sit in the mid-esophagus and produce a contact ulcer. Direct "
            "mucosal contact from a retained bisphosphonate tablet matches the timing, the "
            "single discrete ulcer, and the dosing error. Candida albicans plaques in an "
            "immunosuppressed host are wrong because thrush and white plaques are absent and "
            "she is not immunosuppressed. Cytomegalovirus linear ulcers with viral "
            "inclusions are wrong because those large shallow ulcers occur in profound "
            "immunodeficiency and show cytomegalic inclusions on biopsy, which this "
            "immunocompetent patient does not suggest. Eosinophilic rings from food allergy "
            "are wrong because eosinophilic esophagitis produces rings, furrows, and a "
            "history of atopy or food impaction, not an acute solitary ulcer after a new "
            "tablet. Barrett metaplasia from long-standing acid reflux is wrong because "
            "Barrett esophagus is salmon-colored columnar metaplasia from chronic reflux, "
            "and she has no reflux history and a normal surrounding mucosa."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-009",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 67-year-old man with gout and chronic kidney disease, estimated glomerular "
            "filtration rate 38 mL/min, develops community-acquired pneumonia. He is started "
            "on clarithromycin. The next morning he has an acute first metatarsophalangeal "
            "flare and is given his usual colchicine regimen without a dose reduction. "
            "Within two days he has profuse watery diarrhea, diffuse weakness, and a falling "
            "leukocyte count and platelet count. Creatine kinase is rising. He is not taking "
            "azathioprine, allopurinol, febuxostat, probenecid, or pegloticase. Which "
            "interaction best explains this toxicity?"
        ),
        "question": "Which interaction best explains this toxicity?",
        "options": [
            "Clarithromycin raising colchicine levels through CYP3A4 and P-glycoprotein",
            "Allopurinol blocking metabolism of azathioprine to cause marrow failure",
            "Febuxostat added to a statin producing rhabdomyolysis",
            "Probenecid blocking renal excretion of penicillin",
            "Pegloticase generating hydrogen peroxide in G6PD deficiency",
        ],
        "correctAnswer": "Clarithromycin raising colchicine levels through CYP3A4 and P-glycoprotein",
        "explanation": (
            "Colchicine is a substrate of CYP3A4 and P-glycoprotein, and it blocks microtubule "
            "polymerization in neutrophils and in rapidly dividing gut and marrow cells. "
            "Clarithromycin inhibits both clearance pathways. In a patient whose glomerular "
            "filtration rate is already low, an unreduced colchicine dose plus clarithromycin "
            "produces diarrhea, pancytopenia, and neuromyopathy. Clarithromycin raising "
            "colchicine levels through CYP3A4 and P-glycoprotein is the interaction that fits "
            "the drugs he actually received. Allopurinol blocking metabolism of azathioprine "
            "to cause marrow failure is wrong because he takes neither allopurinol nor "
            "azathioprine; that interaction is real but it is not this case. Febuxostat "
            "added to a statin producing rhabdomyolysis is wrong because febuxostat was not "
            "started and the dominant early feature is cholera-like diarrhea with marrow "
            "suppression from colchicine. Probenecid blocking renal excretion of penicillin "
            "is wrong because probenecid is not on the medication list and penicillin level "
            "changes do not cause this diarrheal marrow syndrome. Pegloticase generating "
            "hydrogen peroxide in G6PD deficiency is wrong because pegloticase was not given "
            "and would present with hemolysis, not isolated colchicine toxicity."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-010",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 54-year-old man of Han Chinese ancestry has two gout flares each year and a "
            "visible olecranon tophus. Serum urate is 9.1 mg/dL, glomerular filtration rate "
            "is 78 mL/min, and he has no kidney stones. He has never taken a urate-lowering "
            "drug. The decision is made to start urate-lowering therapy with antiinflammatory "
            "prophylaxis. Before any allopurinol tablet is dispensed, which plan matches the "
            "requirement that applies to this ancestry?"
        ),
        "question": "Before any allopurinol tablet is dispensed, which plan matches the requirement that applies to this ancestry?",
        "options": [
            "Test HLA-B*5801 and avoid allopurinol if that allele is present",
            "Start allopurinol at 300 mg daily without HLA testing",
            "Choose probenecid as the required first-line urate-lowering drug",
            "Start pegloticase infusions as initial urate-lowering therapy",
            "Use febuxostat for every patient and never consider allopurinol",
        ],
        "correctAnswer": "Test HLA-B*5801 and avoid allopurinol if that allele is present",
        "explanation": (
            "The 2020 American College of Rheumatology gout guideline strongly recommends "
            "HLA-B*5801 testing before allopurinol in patients of Southeast Asian descent, "
            "explicitly including Han Chinese, Korean, and Thai patients, and in African "
            "American patients, because the allele marks a high risk of allopurinol "
            "hypersensitivity, severe cutaneous adverse reaction, and drug reaction with "
            "eosinophilia. A positive test means allopurinol is not used and another "
            "urate-lowering drug is chosen. Test HLA-B*5801 and avoid allopurinol if that "
            "allele is present is the plan this ancestry requires. Start allopurinol at "
            "300 mg daily without HLA testing is wrong because 300 mg is too high a start "
            "for anyone and skipping the allele test ignores the strong recommendation in "
            "Han Chinese patients. Choose probenecid as the required first-line urate-"
            "lowering drug is wrong because a xanthine oxidase inhibitor, with allopurinol "
            "preferred once it is safe to use, is first-line, and probenecid is not mandated "
            "by ancestry. Start pegloticase infusions as initial urate-lowering therapy is "
            "wrong because pegloticase is reserved for refractory gout, not initial therapy. "
            "Use febuxostat for every patient and never consider allopurinol is wrong "
            "because allopurinol remains the preferred first-line agent when HLA-B*5801 is "
            "absent; febuxostat is an alternative, not a universal replacement."
        ),
        "ref": "acr-gout-2020",
    },
    {
        "id": "s1-msk-011",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 49-year-old man has a serum urate of 9.6 mg/dL on a chemistry panel drawn for "
            "a life-insurance examination. He has never had joint pain, podagra, a red hot "
            "joint, a kidney stone, or a detectable tophus. Radiographs of the feet, done "
            "because a relative has gout, show no erosions. Blood pressure and renal "
            "function are normal, and he takes no diuretic. He asks whether he should start "
            "a urate-lowering tablet because the number looks high. Which interpretation of "
            "this laboratory result is correct?"
        ),
        "question": "Which interpretation of this laboratory result is correct?",
        "options": [
            "No urate-lowering drug is indicated for asymptomatic hyperuricemia",
            "Start allopurinol now because the serum urate exceeds 9 mg/dL",
            "Start febuxostat as preferred initial therapy despite no flares",
            "Start probenecid to prevent a first attack of gout",
            "Start daily colchicine indefinitely as urate-lowering therapy",
        ],
        "correctAnswer": "No urate-lowering drug is indicated for asymptomatic hyperuricemia",
        "explanation": (
            "Asymptomatic hyperuricemia is a laboratory finding without gout flares, tophi, "
            "radiographic gout, or uric acid stones. The 2020 American College of "
            "Rheumatology guideline strongly recommends against pharmacologic urate-lowering "
            "therapy in that setting. A serum urate above 9 mg/dL can support urate-lowering "
            "therapy after a patient already has gout, including after a first flare when "
            "other conditions are present, but it does not convert a person who has never "
            "had gout into a treatment candidate. No urate-lowering drug is indicated for "
            "asymptomatic hyperuricemia. Start allopurinol now because the serum urate "
            "exceeds 9 mg/dL is wrong because that threshold is not an indication in the "
            "absence of gout. Start febuxostat as preferred initial therapy despite no "
            "flares is wrong because febuxostat is not indicated for asymptomatic "
            "hyperuricemia and is not preferred over allopurinol when therapy is indicated. "
            "Start probenecid to prevent a first attack of gout is wrong because a uricosuric "
            "is not used to treat an asymptomatic laboratory value. Start daily colchicine "
            "indefinitely as urate-lowering therapy is wrong because colchicine has no "
            "urate-lowering effect and prophylaxis is used only when urate-lowering therapy "
            "is being started for gout."
        ),
        "ref": "acr-gout-2020",
    },
    {
        "id": "s1-msk-012",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 70-year-old woman has three documented gout flares in the past year and "
            "several subcutaneous tophi on the fingers. Serum urate is 9.4 mg/dL. Estimated "
            "glomerular filtration rate is 24 mL/min. She has no history of allopurinol "
            "hypersensitivity, she is not of a high-risk HLA-B*5801 ancestry, and she is not "
            "taking azathioprine. Antiinflammatory prophylaxis is planned. Which initial "
            "urate-lowering plan is most appropriate?"
        ),
        "question": "Which initial urate-lowering plan is most appropriate?",
        "options": [
            "Allopurinol started at 50 mg daily and titrated to a serum urate below 6 mg/dL",
            "Probenecid as first-line therapy because the filtration rate is low",
            "Allopurinol started at 300 mg daily to reach the target faster",
            "Pegloticase as the first urate-lowering drug because tophi are present",
            "Febuxostat preferred over allopurinol solely because of stage 4 chronic kidney disease",
        ],
        "correctAnswer": "Allopurinol started at 50 mg daily and titrated to a serum urate below 6 mg/dL",
        "explanation": (
            "Tophi and frequent flares are strong indications for urate-lowering therapy. "
            "The 2020 American College of Rheumatology guideline strongly recommends "
            "allopurinol as the preferred first-line agent even when chronic kidney disease "
            "is stage 3 or worse, started low, at or under 100 mg daily and lower still in "
            "advanced kidney disease, and titrated to a serum urate below 6 mg/dL. "
            "Allopurinol started at 50 mg daily and titrated to a serum urate below 6 mg/dL "
            "matches that recommendation in a patient whose filtration rate is 24 mL/min. "
            "Probenecid as first-line therapy because the filtration rate is low is wrong "
            "because uricosurics need adequate renal function to increase uric acid "
            "excretion and are not preferred when the filtration rate is this low. "
            "Allopurinol started at 300 mg daily to reach the target faster is wrong because "
            "a full starting dose in advanced kidney disease raises the risk of "
            "hypersensitivity; the target is reached by titration, not by a large first "
            "dose. Pegloticase as the first urate-lowering drug because tophi are present is "
            "wrong because pegloticase is for gout that remains refractory after appropriately "
            "dosed oral therapy, and the guideline recommends against it as first-line "
            "treatment. Febuxostat preferred over allopurinol solely because of stage 4 "
            "chronic kidney disease is wrong because kidney disease is not a reason to "
            "displace allopurinol from its preferred first-line position."
        ),
        "ref": "acr-gout-2020",
    },
    {
        "id": "s1-msk-013",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 58-year-old man with a renal transplant takes azathioprine and tacrolimus. A "
            "clinic that does not have his medication list starts allopurinol 200 mg daily "
            "for tophaceous gout. Three weeks later he has fever, mouth ulcers, and "
            "cellulitis. The leukocyte count is 0.8 x 10^3/uL, hemoglobin is 7.9 g/dL, and "
            "platelets are 32 x 10^3/uL. The graft is functioning, and he has not received "
            "colchicine, febuxostat, probenecid, or chemotherapy. Which mechanism best "
            "explains the pancytopenia?"
        ),
        "question": "Which mechanism best explains the pancytopenia?",
        "options": [
            "Allopurinol blocking xanthine oxidase raises 6-mercaptopurine from azathioprine",
            "Tacrolimus alone causing dose-independent aplastic anemia",
            "Probenecid blocking tubular secretion of azathioprine",
            "Colchicine microtubule toxicity in the marrow",
            "A gout flare suppressing all three blood cell lines",
        ],
        "correctAnswer": "Allopurinol blocking xanthine oxidase raises 6-mercaptopurine from azathioprine",
        "explanation": (
            "Azathioprine is converted to 6-mercaptopurine, which is inactivated in part by "
            "xanthine oxidase. Allopurinol inhibits that enzyme, so cytotoxic thioguanine "
            "nucleotides accumulate and the marrow fails. The usual response is to avoid the "
            "combination or to cut the thiopurine dose drastically before any overlap. "
            "Allopurinol blocking xanthine oxidase raises 6-mercaptopurine from azathioprine "
            "is the mechanism that fits the new prescription and the three-line cytopenia "
            "with mucositis. Tacrolimus alone causing dose-independent aplastic anemia is "
            "wrong because tacrolimus was a stable drug and its characteristic problems are "
            "nephrotoxicity, neurotoxicity, and tremor, not this abrupt pancytopenia after "
            "allopurinol was added. Probenecid blocking tubular secretion of azathioprine is "
            "wrong because probenecid was never started. Colchicine microtubule toxicity in "
            "the marrow is wrong because he did not receive colchicine, which would also "
            "feature prominent diarrhea. A gout flare suppressing all three blood cell lines "
            "is wrong because acute gout is a neutrophilic synovitis and does not empty the "
            "marrow."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-014",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 19-year-old man from a Mediterranean family receives rasburicase for tumor "
            "lysis after chemotherapy for lymphoma. Uric acid falls, but within hours he has "
            "back pain and dark urine. Hemoglobin drops from 12.1 to 7.4 g/dL, indirect "
            "bilirubin and lactate dehydrogenase rise, haptoglobin is undetectable, and the "
            "smear shows bite cells and blister cells. Glucose-6-phosphate dehydrogenase "
            "activity, measured later, is very low. He did not receive allopurinol, "
            "febuxostat, probenecid, or pegloticase. Which mechanism accounts for the "
            "hemolysis?"
        ),
        "question": "Which mechanism accounts for the hemolysis?",
        "options": [
            "Hydrogen peroxide from uric acid breakdown in G6PD-deficient red cells",
            "Immune thrombocytopenia from an antibody against platelets",
            "Xanthine nephropathy caused by allopurinol in tumor lysis",
            "Febuxostat inhibition of xanthine oxidase causing methemoglobin only",
            "Probenecid-induced autoimmune hemolysis in the spleen",
        ],
        "correctAnswer": "Hydrogen peroxide from uric acid breakdown in G6PD-deficient red cells",
        "explanation": (
            "Rasburicase is a recombinant uricase that converts uric acid to allantoin and, "
            "in doing so, generates hydrogen peroxide. Erythrocytes deficient in glucose-6-"
            "phosphate dehydrogenase cannot regenerate NADPH and glutathione fast enough to "
            "detoxify that oxidant stress, so hemoglobin denatures and intravascular "
            "hemolysis follows. Hydrogen peroxide from uric acid breakdown in G6PD-deficient "
            "red cells is why rasburicase is contraindicated in G6PD deficiency. Immune "
            "thrombocytopenia from an antibody against platelets is wrong because the smear "
            "and hemolysis labs show red-cell destruction, and thrombocytopenia is not the "
            "described event. Xanthine nephropathy caused by allopurinol in tumor lysis is "
            "wrong because allopurinol was not given; xanthine precipitation is a renal "
            "issue, not bite-cell hemolysis. Febuxostat inhibition of xanthine oxidase "
            "causing methemoglobin only is wrong because febuxostat was not administered and "
            "does not generate hydrogen peroxide the way a uricase does. Probenecid-induced "
            "autoimmune hemolysis in the spleen is wrong because probenecid is not part of "
            "this regimen and would not produce oxidant bite cells within hours of rasburicase."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-015",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 61-year-old man has had two gout flares and has passed two uric acid kidney "
            "stones, the most recent last month. Serum urate is 8.7 mg/dL and glomerular "
            "filtration rate is 72 mL/min. He takes low-dose aspirin for coronary disease. A "
            "colleague suggests a uricosuric drug so that the kidney will dump uric acid. A "
            "24-hour urine already shows high uric acid excretion. Which initial "
            "urate-lowering choice fits the stone history?"
        ),
        "question": "Which initial urate-lowering choice fits the stone history?",
        "options": [
            "Allopurinol",
            "Probenecid",
            "Pegloticase",
            "Colchicine monotherapy",
            "Low-dose aspirin",
        ],
        "correctAnswer": "Allopurinol",
        "explanation": (
            "Uric acid stones mean the urinary concentration of uric acid is already high "
            "enough to crystallize. A xanthine oxidase inhibitor such as allopurinol lowers "
            "urate production and therefore lowers both serum and urinary uric acid, which "
            "is the rational direction when stones are present. Allopurinol is the initial "
            "choice that fits. Probenecid is wrong because it blocks proximal reabsorption "
            "of urate and further raises urinary uric acid, increasing the chance of stones; "
            "low-dose aspirin also blunts its uricosuric effect. Pegloticase is wrong "
            "because a uricase infusion is reserved for refractory tophaceous gout after oral "
            "urate-lowering therapy fails, not for a first agent in a patient who can take "
            "allopurinol. Colchicine monotherapy is wrong because colchicine does not lower "
            "the serum urate and cannot treat the stone risk, although it may be added later "
            "as prophylaxis when a urate-lowering drug is begun. Low-dose aspirin is wrong "
            "because low-dose aspirin reduces urate excretion and can raise the serum urate; "
            "it is not a treatment for gout or for uric acid stones."
        ),
        "ref": "katzung-16",
    },
    {
        "id": "s1-msk-016",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 76-year-old woman has acute pain and swelling of the right knee. She is "
            "afebrile. Radiographs show calcification of the menisci and of the triangular "
            "fibrocartilage of the wrist. Serum urate is 5.2 mg/dL. Synovial fluid contains "
            "many neutrophils and crystals that are both needle-shaped and rhomboid. When "
            "the long axis of a crystal lies parallel to the axis of the red compensator, "
            "the crystal is blue. Gram stain and culture are negative, and synovial glucose "
            "is normal. A student sees the needle shapes and stops. Which crystal is "
            "actually present?"
        ),
        "question": "Which crystal is actually present?",
        "options": [
            "Calcium pyrophosphate dihydrate",
            "Monosodium urate",
            "Hydroxyapatite",
            "Calcium oxalate",
            "Cholesterol crystals",
        ],
        "correctAnswer": "Calcium pyrophosphate dihydrate",
        "explanation": (
            "Birefringence is defined by the color when the long axis is parallel to the "
            "compensator. Blue in that orientation is positive birefringence and identifies "
            "calcium pyrophosphate dihydrate. Those crystals may be rhomboid or rod-shaped, "
            "so a needle shape alone never proves gout. Chondrocalcinosis of the meniscus "
            "and triangular fibrocartilage supports the same diagnosis. Calcium "
            "pyrophosphate dihydrate is the crystal in this fluid. Monosodium urate is wrong "
            "because urate needles are yellow, not blue, when they lie parallel to the "
            "compensator, which is negative birefringence, and the serum urate here is not "
            "required to be high for that distinction. Hydroxyapatite is wrong because basic "
            "calcium phosphate clumps are not seen on routine polarized light and need a "
            "calcium stain such as alizarin red. Calcium oxalate is wrong because oxalate "
            "crystals are envelope-shaped, occur in oxalosis or ethylene glycol poisoning, "
            "and are not the chondrocalcinosis crystal of an elderly knee. Cholesterol "
            "crystals are wrong because they are large plates with notched corners in "
            "chronic effusions, not the acute positively birefringent crystals of "
            "pseudogout."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-017",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 62-year-old man with prior podagra has fever, a hot first metatarsophalangeal "
            "joint, and a hot knee. Synovial fluid from the knee shows a leukocyte count of "
            "92,000/uL with 96 percent neutrophils. Needle-shaped crystals are yellow when "
            "their long axis is parallel to the compensator. The gram stain also shows "
            "clusters of gram-positive cocci, and the culture later grows Staphylococcus "
            "aureus. Serum glucose in the joint fluid is low. Which interpretation is "
            "required before treatment is chosen?"
        ),
        "question": "Which interpretation is required before treatment is chosen?",
        "options": [
            "Concurrent gout and Staphylococcus aureus septic arthritis",
            "Gout alone because crystals exclude a bacterial infection",
            "Pseudogout because every needle-shaped crystal is calcium pyrophosphate",
            "Gonococcal arthritis based only on a hot joint and fever",
            "Osteoarthritis because the patient is older than 60 years",
        ],
        "correctAnswer": "Concurrent gout and Staphylococcus aureus septic arthritis",
        "explanation": (
            "Yellow needles aligned parallel to the compensator are negatively birefringent "
            "monosodium urate, so gout is present. Gram-positive cocci in clusters that grow "
            "Staphylococcus aureus, a leukocyte count above 50,000, and low synovial glucose "
            "mean the same joint is infected. Crystals do not sterilize an effusion, and "
            "gout and septic arthritis coexist often enough that culture is mandatory. "
            "Concurrent gout and Staphylococcus aureus septic arthritis is the reading that "
            "must drive drainage and antibiotics as well as gout care. Gout alone because "
            "crystals exclude a bacterial infection is wrong because nothing about urate "
            "crystals cancels a positive gram stain. Pseudogout because every needle-shaped "
            "crystal is calcium pyrophosphate is wrong because shape is not the discriminator; "
            "these crystals are yellow when parallel, which is urate, not the blue-parallel "
            "pattern of calcium pyrophosphate. Gonococcal arthritis based only on a hot "
            "joint and fever is wrong because Neisseria gonorrhoeae is a gram-negative "
            "diplococcus and is often absent on joint gram stain, whereas these organisms "
            "are gram-positive clusters. Osteoarthritis because the patient is older than "
            "60 years is wrong because osteoarthritic fluid is noninflammatory, usually "
            "under a few thousand cells, and never grows Staphylococcus aureus."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-018",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 55-year-old man has bronze skin, new diabetes, and a serum ferritin of "
            "2100 ng/mL with transferrin saturation of 72 percent. He has chronic stiffness "
            "of the second and third metacarpophalangeal joints. Hand radiographs show "
            "hook-like osteophytes of those metacarpophalangeal heads and joint-space "
            "narrowing without marginal erosions. The knees show meniscal chondrocalcinosis, "
            "and a prior flare yielded rhomboid crystals that were blue when parallel to the "
            "compensator. Anti-cyclic citrullinated peptide antibody is negative, and "
            "insulin-like growth factor 1 is normal. Which paired diagnosis best fits?"
        ),
        "question": "Which paired diagnosis best fits?",
        "options": [
            "Hereditary hemochromatosis with calcium pyrophosphate deposition",
            "Primary osteoarthritis of the distal interphalangeal joints",
            "Seropositive rheumatoid arthritis with pannus",
            "Tophaceous gout with monosodium urate needles",
            "Acromegaly with spade-like phalangeal tufts",
        ],
        "correctAnswer": "Hereditary hemochromatosis with calcium pyrophosphate deposition",
        "explanation": (
            "Iron overload produces a distinctive arthropathy of the second and third "
            "metacarpophalangeal joints, with hook-like osteophytes, and it is a classic "
            "driver of calcium pyrophosphate deposition. Bronze skin, diabetes, and a very "
            "high ferritin with high transferrin saturation identify hereditary "
            "hemochromatosis. Positively birefringent rhomboids confirm the crystal. "
            "Hereditary hemochromatosis with calcium pyrophosphate deposition is the pair "
            "that unifies the skin, endocrine, and joint findings. Primary osteoarthritis "
            "of the distal interphalangeal joints is wrong because ordinary osteoarthritis "
            "favors the distal interphalangeal joints and the first carpometacarpal joint, "
            "not hook-like osteophytes at the metacarpophalangeal joints with systemic iron "
            "overload. Seropositive rheumatoid arthritis with pannus is wrong because the "
            "citrullinated-peptide antibody is negative and the films show osteophytes "
            "rather than marginal erosions. Tophaceous gout with monosodium urate needles "
            "is wrong because the crystals are blue when parallel, which is calcium "
            "pyrophosphate, not negatively birefringent urate, and tophi are not described. "
            "Acromegaly with spade-like phalangeal tufts is wrong because insulin-like "
            "growth factor 1 is normal and acromegaly does not raise ferritin or stain the "
            "skin bronze."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-019",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 79-year-old woman has months of swelling of the dominant shoulder with modest "
            "pain and marked weakness. The humeral head sits high on radiographs, consistent "
            "with a chronic rotator cuff tear, and the glenoid is eroded. Aspiration yields "
            "a large blood-tinged effusion. Polarized microscopy shows no birefringent "
            "crystals. Clumps in the fluid stain red with alizarin. Gram stain and culture "
            "are negative. She is afebrile, and there is no villous synovial mass on "
            "imaging. Which material is deposited in this joint?"
        ),
        "question": "Which material is deposited in this joint?",
        "options": [
            "Hydroxyapatite",
            "Monosodium urate",
            "Calcium pyrophosphate dihydrate",
            "Hemosiderin from pigmented villonodular synovitis",
            "Ordinary hematoma from a rotator cuff tear alone",
        ],
        "correctAnswer": "Hydroxyapatite",
        "explanation": (
            "Basic calcium phosphate, of which hydroxyapatite is the principal form, causes "
            "Milwaukee shoulder: an older woman, a destroyed rotator cuff, a large "
            "blood-tinged effusion, and nonbirefringent clumps that stain with alizarin red. "
            "The crystals are too small to show the polarized-light colors used for urate "
            "and pyrophosphate. Hydroxyapatite is the deposit. Monosodium urate is wrong "
            "because urate is brightly birefringent and yellow when parallel to the "
            "compensator, and it does not require an alizarin stain. Calcium pyrophosphate "
            "dihydrate is wrong because those crystals are rhomboid or rod-shaped and blue "
            "when parallel, and they are visible on polarized light, which was negative "
            "here. Hemosiderin from pigmented villonodular synovitis is wrong because that "
            "tumor-like synovial proliferation shows villous fronds loaded with hemosiderin "
            "in a younger adult and is not an alizarin-positive crystal disease. Ordinary "
            "hematoma from a rotator cuff tear alone is wrong because a cuff tear explains "
            "weakness and a high-riding humerus but not alizarin-positive clumps and "
            "glenoid erosion from a crystal-associated destructive arthropathy."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-020",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 72-year-old woman has acute wrist pain. Radiographs show calcification of the "
            "triangular fibrocartilage. Synovial fluid shows rhomboid crystals that are blue "
            "when parallel to the compensator, a negative gram stain, and a normal glucose. "
            "Serum urate is 4.8 mg/dL and ferritin is normal. Additional laboratories show "
            "calcium 11.6 mg/dL, phosphate 2.1 mg/dL, parathyroid hormone 98 pg/mL, "
            "creatinine 0.9 mg/dL, and a high 24-hour urinary calcium. 1,25-dihydroxyvitamin "
            "D is upper-normal. Which underlying disorder is driving the crystal arthritis?"
        ),
        "question": "Which underlying disorder is driving the crystal arthritis?",
        "options": [
            "Primary hyperparathyroidism",
            "Sarcoidosis with extrarenal vitamin D activation",
            "Hypoparathyroidism",
            "Hereditary hemochromatosis",
            "Primary gout with monosodium urate",
        ],
        "correctAnswer": "Primary hyperparathyroidism",
        "explanation": (
            "Blue-parallel rhomboids and triangular-fibrocartilage calcification establish "
            "calcium pyrophosphate deposition. Among the diseases that promote that "
            "deposition, primary hyperparathyroidism is recognized by high calcium, low "
            "phosphate, high parathyroid hormone, and high urinary calcium. Primary "
            "hyperparathyroidism is the driver. Sarcoidosis with extrarenal vitamin D "
            "activation is wrong because granulomatous production of 1,25-dihydroxyvitamin D "
            "raises calcium while suppressing parathyroid hormone, and the parathyroid "
            "hormone here is high, not suppressed. Hypoparathyroidism is wrong because it "
            "lowers calcium and is not a cause of chondrocalcinosis flares. Hereditary "
            "hemochromatosis is wrong because ferritin is normal and the laboratory signature "
            "is iron overload with metacarpophalangeal hook osteophytes, not this parathyroid "
            "pattern. Primary gout with monosodium urate is wrong because the crystals are "
            "positively birefringent calcium pyrophosphate and the serum urate is not "
            "elevated; urate crystals would be yellow when parallel to the compensator."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-021",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 48-year-old man has his first attack of severe pain, redness, and swelling at "
            "the first metatarsophalangeal joint. He is afebrile and has no urethral "
            "discharge. Aspiration shows needle-shaped crystals that are yellow when aligned "
            "parallel to the compensator. Gram stain and culture are negative. A simultaneous "
            "serum urate is 5.1 mg/dL. A colleague discards the diagnosis of gout because "
            "the serum urate is inside the reference range. Which statement is the correct "
            "reading of these results?"
        ),
        "question": "Which statement is the correct reading of these results?",
        "options": [
            "A normal serum urate does not exclude an acute gout flare",
            "The normal serum urate proves these needles are calcium pyrophosphate",
            "A normal serum urate means the joint must be septic",
            "Hyperuricemia measured during the flare is required to diagnose gout",
            "Cellulitis is the diagnosis because the serum urate is normal",
        ],
        "correctAnswer": "A normal serum urate does not exclude an acute gout flare",
        "explanation": (
            "Crystal identification diagnoses gout. Negatively birefringent needles that are "
            "yellow when parallel to the compensator are monosodium urate. During an acute "
            "flare the serum urate can fall into the reference range, so a single normal "
            "value does not erase crystals sitting in the joint. A normal serum urate does "
            "not exclude an acute gout flare. The normal serum urate proves these needles "
            "are calcium pyrophosphate is wrong because calcium pyrophosphate is blue when "
            "parallel, and the color here is yellow. A normal serum urate means the joint "
            "must be septic is wrong because the gram stain and culture are negative and "
            "sepsis is not diagnosed by a urate level. Hyperuricemia measured during the "
            "flare is required to diagnose gout is wrong because the diagnostic standard is "
            "the crystal, and hyperuricemia may be absent at the moment of the attack. "
            "Cellulitis is the diagnosis because the serum urate is normal is wrong because "
            "cellulitis does not put negatively birefringent needles into an aspirated joint."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-022",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 46-year-old man has painful oral erosions and flaccid blisters on the scalp "
            "and trunk. Gentle pressure shears the epidermis from perilesional skin. Biopsy "
            "shows a suprabasal split, acantholysis, and a row of basal keratinocytes still "
            "attached to the basement membrane, the so-called tombstone pattern. Direct "
            "immunofluorescence shows IgG and C3 deposited in a net-like pattern around "
            "keratinocytes. There is no linear band at the basement membrane and no granular "
            "IgA in the dermal papillae. Salt-split skin is not needed. Which autoantibody "
            "target best fits this immunofluorescence pattern?"
        ),
        "question": "Which autoantibody target best fits this immunofluorescence pattern?",
        "options": [
            "Desmoglein 3",
            "BP180 hemidesmosomal antigen",
            "Epidermal transglutaminase with granular IgA",
            "Linear IgA along the basement membrane",
            "Type VII collagen on the dermal floor of salt-split skin",
        ],
        "correctAnswer": "Desmoglein 3",
        "explanation": (
            "Pemphigus vulgaris is caused by IgG against desmoglein 3, the desmosomal cadherin "
            "that holds keratinocytes together, including in mucosa. Loss of that adhesion "
            "produces a flaccid intraepidermal blister, oral erosions, a positive Nikolsky "
            "sign, suprabasal acantholysis, and the net-like, or fishnet, immunofluorescence "
            "pattern around keratinocytes. Desmoglein 3 is the target that matches. BP180 "
            "hemidesmosomal antigen is wrong because bullous pemphigoid antibodies bind the "
            "hemidesmosome and lay down a linear band of IgG and C3 along the basement "
            "membrane, with a subepidermal blister of tense bullae in an older adult. "
            "Epidermal transglutaminase with granular IgA is wrong because that pattern is "
            "dermatitis herpetiformis, with granular IgA in the dermal papillae and "
            "intensely pruritic vesicles on extensor skin, tied to celiac disease. Linear "
            "IgA along the basement membrane is wrong because linear IgA bullous dermatosis "
            "shows a linear IgA band, often after vancomycin, not a net of IgG. Type VII "
            "collagen on the dermal floor of salt-split skin is wrong because that is "
            "epidermolysis bullosa acquisita, a subepidermal linear IgG disease that localizes "
            "to the dermal side of salt-split skin, not an intraepidermal fishnet."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-023",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 81-year-old woman has weeks of severe pruritus followed by tense bullae on "
            "the flexor forearms, thighs, and abdomen. Mucosae are spared, and Nikolsky sign "
            "is negative. Biopsy shows a subepidermal blister filled with eosinophils. "
            "Direct immunofluorescence shows a linear band of IgG and C3 along the basement "
            "membrane zone. On salt-split skin the immunoreactants bind the epidermal roof, "
            "not the dermal floor. She takes no vancomycin. Which diagnosis does the roof "
            "localization establish?"
        ),
        "question": "Which diagnosis does the roof localization establish?",
        "options": [
            "Bullous pemphigoid against BP180",
            "Epidermolysis bullosa acquisita against type VII collagen",
            "Pemphigus vulgaris against desmoglein 3",
            "Dermatitis herpetiformis with granular papillary IgA",
            "Linear IgA bullous dermatosis from vancomycin",
        ],
        "correctAnswer": "Bullous pemphigoid against BP180",
        "explanation": (
            "Both bullous pemphigoid and epidermolysis bullosa acquisita can show linear IgG "
            "at the basement membrane, so the linear pattern alone does not separate them. "
            "Salt-split skin places pemphigoid antigens, including BP180, on the epidermal "
            "roof and type VII collagen on the dermal floor. Roof staining, tense bullae, "
            "eosinophils, spared mucosa, and a negative Nikolsky sign establish bullous "
            "pemphigoid against BP180. Epidermolysis bullosa acquisita against type VII "
            "collagen is wrong because those immunoreactants bind the dermal floor of "
            "salt-split skin, and milia and scarring are more typical. Pemphigus vulgaris "
            "against desmoglein 3 is wrong because that disease is intraepidermal, flaccid, "
            "Nikolsky-positive, and shows a net-like IgG pattern around keratinocytes rather "
            "than a linear basement-membrane band. Dermatitis herpetiformis with granular "
            "papillary IgA is wrong because the deposit is granular IgA in dermal papillae, "
            "not linear IgG on the epidermal roof. Linear IgA bullous dermatosis from "
            "vancomycin is wrong because the immunofluorescence would be linear IgA, often "
            "in a string-of-pearls clinical pattern, and this patient takes no vancomycin "
            "and has linear IgG and C3."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-024",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 36-year-old man has months of burning pruritus with grouped vesicles on the "
            "elbows, knees, and buttocks. He has mild bloating but no oral ulcers and no "
            "tense bullae. Direct immunofluorescence of perilesional skin shows granular IgA "
            "deposited in the tips of the dermal papillae. Serum IgA against tissue "
            "transglutaminase is positive. Duodenal biopsy shows villous blunting. A "
            "vancomycin exposure is absent, and there is no net-like IgG around "
            "keratinocytes. Which diagnosis links the skin immunofluorescence to the bowel "
            "biopsy?"
        ),
        "question": "Which diagnosis links the skin immunofluorescence to the bowel biopsy?",
        "options": [
            "Dermatitis herpetiformis",
            "Bullous pemphigoid",
            "Pemphigus foliaceus",
            "Linear IgA bullous dermatosis",
            "Scabies infestation",
        ],
        "correctAnswer": "Dermatitis herpetiformis",
        "explanation": (
            "Dermatitis herpetiformis is the cutaneous expression of gluten sensitivity. IgA "
            "against epidermal transglutaminase deposits as granules in the dermal papillae, "
            "neutrophils collect there, and patients develop intensely pruritic grouped "
            "vesicles on extensor surfaces. Most have celiac disease even when bowel symptoms "
            "are mild, with IgA tissue transglutaminase antibodies and villous blunting. "
            "Dermatitis herpetiformis is the link. Bullous pemphigoid is wrong because it "
            "produces tense bullae in older adults and a linear band of IgG and C3 along the "
            "basement membrane, not granular papillary IgA. Pemphigus foliaceus is wrong "
            "because it is an IgG disease against desmoglein 1, with superficial acantholysis "
            "and a net-like immunofluorescence pattern, and it has no tie to villous "
            "blunting. Linear IgA bullous dermatosis is wrong because the IgA is laid down "
            "as a line along the basement membrane, classically after vancomycin, not as "
            "granules in the papillae, and the bowel is not a celiac lesion. Scabies "
            "infestation is wrong because scabies shows mites and burrows in web spaces with "
            "nocturnal itch, and immunofluorescence is negative for granular papillary IgA."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-025",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 2-year-old boy has fever, conjunctivitis, and tender erythema that began "
            "around the mouth and in the axillae and now shears off with light touch. Large "
            "sheets of superficial skin detach, but the lips and oral cavity are not "
            "eroded. A culture from the nares grows Staphylococcus aureus. Histology shows a "
            "split just beneath the stratum granulosum without full-thickness epidermal "
            "necrosis. Direct immunofluorescence is negative. He has received no new "
            "anticonvulsant, allopurinol, or sulfonamide. Which mechanism produces this "
            "pattern of splitting?"
        ),
        "question": "Which mechanism produces this pattern of splitting?",
        "options": [
            "Exfoliative toxin cleaving desmoglein 1 in staphylococcal scalded skin",
            "Drug-induced full-thickness necrosis of toxic epidermal necrolysis",
            "IgG against desmoglein 3 in pemphigus vulgaris",
            "IgG against desmoglein 1 in pemphigus foliaceus",
            "Linear IgG against BP180 in bullous pemphigoid",
        ],
        "correctAnswer": "Exfoliative toxin cleaving desmoglein 1 in staphylococcal scalded skin",
        "explanation": (
            "Staphylococcal exfoliative toxin cleaves desmoglein 1, the same cadherin lost in "
            "pemphigus foliaceus. The split is superficial, just under the stratum "
            "granulosum. Mucosa is spared because desmoglein 3 remains and holds mucosal "
            "epithelium together. Children, a staphylococcal focus, a positive Nikolsky "
            "sign limited to skin, and negative immunofluorescence define staphylococcal "
            "scalded-skin syndrome. Exfoliative toxin cleaving desmoglein 1 in "
            "staphylococcal scalded skin is the mechanism. Drug-induced full-thickness "
            "necrosis of toxic epidermal necrolysis is wrong because toxic epidermal "
            "necrolysis destroys the full epidermis down to the dermal-epidermal junction, "
            "involves mucosa, follows a drug in older patients, and is not a superficial "
            "toxin split in a toddler. IgG against desmoglein 3 in pemphigus vulgaris is "
            "wrong because that antibody produces a suprabasal split, fishnet "
            "immunofluorescence, and prominent oral erosions, none of which are present, and "
            "immunofluorescence here is negative. IgG against desmoglein 1 in pemphigus "
            "foliaceus is wrong because the molecular target is the same cadherin but the "
            "disease is autoimmune, immunofluorescence-positive, and typically adult, not a "
            "toxin-mediated negative-immunofluorescence illness in a toddler with "
            "staphylococcal carriage. Linear IgG against BP180 in bullous pemphigoid is "
            "wrong because pemphigoid is a subepidermal eosinophil-rich blister with linear "
            "basement-membrane immunofluorescence in the elderly."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-026",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 24-year-old motorcyclist is thrown onto the road. The right shoulder is "
            "forced down while the head is forced to the opposite side. The arm hangs "
            "internally rotated, the elbow is extended, and the wrist is flexed. He cannot "
            "initiate shoulder abduction, cannot externally rotate the humerus, and cannot "
            "flex the elbow. The biceps reflex is absent. Sensation is lost over the lateral "
            "arm and lateral forearm. Finger flexion, interosseous function, and grip are "
            "intact. There is no ptosis or miosis. He can retract the scapula, and the "
            "scapula does not wing when he pushes against a wall. Which site of injury fits "
            "every finding?"
        ),
        "question": "Which site of injury fits every finding?",
        "options": [
            "Upper trunk of the brachial plexus",
            "Lower trunk of the brachial plexus",
            "C5 root avulsion proximal to the dorsal scapular nerve",
            "Posterior cord of the brachial plexus",
            "Axillary nerve alone",
        ],
        "correctAnswer": "Upper trunk of the brachial plexus",
        "explanation": (
            "The waiter's-tip posture is loss of shoulder abduction and external rotation "
            "(suprascapular nerve to supraspinatus and infraspinatus, plus the axillary "
            "contribution to deltoid) together with loss of elbow flexion (musculocutaneous "
            "nerve) and the biceps reflex. Those fibers travel in the upper trunk, C5 and "
            "C6. Intact rhomboids mean the dorsal scapular nerve, which leaves the C5 root "
            "before the trunk forms, is spared, and intact serratus anterior means the long "
            "thoracic nerve from the roots is spared. Intact intrinsics and the absence of "
            "Horner syndrome keep C8 and T1 out of the lesion. Upper trunk of the brachial "
            "plexus is the site. Lower trunk of the brachial plexus is wrong because a lower "
            "trunk lesion weakens finger flexion and intrinsics and can add Horner syndrome, "
            "while shoulder abduction and elbow flexion would remain. C5 root avulsion "
            "proximal to the dorsal scapular nerve is wrong because rhomboid retraction "
            "would be lost and scapular winging from serratus weakness would be expected; "
            "both are preserved, so the lesion is distal to those root branches. Posterior "
            "cord of the brachial plexus is wrong because the posterior cord supplies the "
            "axillary and radial nerves, so deltoid and wrist extension suffer, but biceps "
            "and infraspinatus are not posterior-cord muscles and would be spared. Axillary "
            "nerve alone is wrong because an isolated axillary lesion spares infraspinatus "
            "external rotation, biceps flexion, and the biceps reflex."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-027",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "During a difficult vertex delivery, a newborn's arm is pulled sharply overhead. "
            "The hand rests in a claw, with hyperextension at the metacarpophalangeal joints "
            "and flexion at the interphalangeal joints of the fourth and fifth digits. Grasp "
            "is weak, and the intrinsic muscles of the hand do not function. Sensation is "
            "reduced along the medial arm, medial forearm, and medial hand. The infant also "
            "has ptosis and a small pupil on the same side. Shoulder abduction and elbow "
            "flexion are strong, and the biceps reflex is present. Which lesion accounts for "
            "the claw and the ocular signs together?"
        ),
        "question": "Which lesion accounts for the claw and the ocular signs together?",
        "options": [
            "Lower trunk including the T1 white ramus",
            "Upper trunk at Erb point",
            "Posterior cord in the axilla",
            "Median nerve at the elbow",
            "Isolated C7 root",
        ],
        "correctAnswer": "Lower trunk including the T1 white ramus",
        "explanation": (
            "A lower-trunk lesion takes out C8 and T1 contributions to the median and ulnar "
            "nerves, so finger flexion and all intrinsics fail and the hand claws. Horner "
            "syndrome means the T1 white ramus communicans, the preganglionic sympathetic "
            "outflow, is included. Preserved shoulder abduction and elbow flexion show that "
            "C5 and C6 are working. Lower trunk including the T1 white ramus is the lesion. "
            "Upper trunk at Erb point is the easy answer for any birth plexus injury, and it "
            "fails because an upper-trunk palsy produces the waiter's tip, with lost "
            "abduction and elbow flexion, and it does not produce a claw or a Horner pupil. "
            "Posterior cord in the axilla fails because the posterior cord deficit is deltoid "
            "and radial-innervated extension, not a medial-hand claw with Horner syndrome. "
            "Median nerve at the elbow fails because a median lesion can weaken thumb and "
            "index flexion but cannot cause Horner syndrome or sensory loss on the medial "
            "arm, which is the medial cutaneous territory of T1. Isolated C7 root fails "
            "because C7 loss affects triceps and wrist flexion more than a complete intrinsic "
            "claw, and a single C7 root does not interrupt the T1 sympathetic ramus."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-028",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 30-year-old man fractures the midshaft of the humerus. He cannot extend the "
            "wrist or the fingers, and the brachioradialis reflex is absent. Sensation is "
            "lost in the dorsal first web space. Triceps strength and the triceps reflex are "
            "preserved. Deltoid bulk and abduction are normal, and sensation over the lateral "
            "shoulder is intact. Elbow flexion and the biceps reflex are normal. He does not "
            "have neck pain. Which single nerve lesion fits the spared triceps and the lost "
            "dorsal sensation?"
        ),
        "question": "Which single nerve lesion fits the spared triceps and the lost dorsal sensation?",
        "options": [
            "Radial nerve in the spiral groove",
            "Posterior cord of the brachial plexus",
            "C7 nerve root",
            "Posterior interosseous nerve",
            "Axillary nerve",
        ],
        "correctAnswer": "Radial nerve in the spiral groove",
        "explanation": (
            "Branches to the triceps leave the radial nerve in the axilla, proximal to the "
            "spiral groove. A lesion in the groove, where the nerve contacts the mid-humeral "
            "shaft, therefore spares triceps while knocking out brachioradialis, wrist and "
            "finger extensors, and the dorsal cutaneous territory that includes the first web "
            "space. Radial nerve in the spiral groove is the site. Posterior cord of the "
            "brachial plexus is the easy answer when wrist drop is taken to mean every radial "
            "deficit is a cord lesion; it fails because a posterior cord lesion also weakens "
            "deltoid through the axillary nerve and usually weakens triceps, both of which "
            "are intact. C7 nerve root fails because triceps is a C7 muscle and the triceps "
            "reflex would be lost, often with wrist-flexor weakness and a middle-finger "
            "sensory change, and the patient has no neck pain. Posterior interosseous nerve "
            "fails because that deep motor branch causes finger drop without cutaneous "
            "sensory loss; this patient has a clear sensory deficit in the dorsal first web, "
            "so the lesion is proximal to the split into the posterior interosseous and "
            "superficial sensory branches but distal to the triceps branches. Axillary nerve "
            "fails because the axillary nerve supplies deltoid and a patch of skin over the "
            "lateral shoulder, both of which function normally, and it does not extend the wrist."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-029",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 7-year-old boy falls onto an outstretched hand and sustains a supracondylar "
            "fracture of the humerus. After reduction he cannot make a circle with the thumb "
            "and index finger. The interphalangeal joint of the thumb and the distal "
            "interphalangeal joint of the index finger stay extended when he pinches. "
            "Sensation on the palm, the thenar eminence, and the palmar surfaces of the "
            "thumb, index, and middle fingers is completely intact. Thenar abduction is "
            "present. He has no ulnar claw and no wrist drop. Which nerve has been injured?"
        ),
        "question": "Which nerve has been injured?",
        "options": [
            "Anterior interosseous nerve",
            "Median nerve inside the carpal tunnel",
            "Median nerve trunk at the elbow",
            "Ulnar nerve in the Guyon canal",
            "Posterior interosseous nerve",
        ],
        "correctAnswer": "Anterior interosseous nerve",
        "explanation": (
            "The anterior interosseous nerve is a pure motor branch of the median nerve in "
            "the forearm. It supplies flexor pollicis longus, the lateral half of flexor "
            "digitorum profundus, and pronator quadratus. Loss of the first two muscles "
            "destroys the circle pinch and leaves no cutaneous deficit, because the anterior "
            "interosseous nerve has no sensory fibers. Anterior interosseous nerve is the "
            "injured nerve. Median nerve inside the carpal tunnel fails because carpal tunnel "
            "compression causes palmar digital sensory loss and thenar weakness, and the long "
            "flexors of the thumb and index finger are forearm muscles whose bellies are "
            "proximal to the tunnel, so a failed circle pinch is not a carpal-tunnel lesion. "
            "Median nerve trunk at the elbow fails because a complete median lesion at the "
            "elbow would add sensory loss on the palm and digits and weakness of flexor "
            "digitorum superficialis and the thenar muscles; intact sensation and thenar "
            "abduction exclude the parent trunk. Ulnar nerve in the Guyon canal fails "
            "because a Guyon lesion weakens interossei and adductor pollicis and changes "
            "sensation on the palmar fourth and fifth digits, not the thumb-index flexors. "
            "Posterior interosseous nerve fails because that radial motor branch extends the "
            "fingers and thumb and does not flex them."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-030",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 27-year-old cyclist crashes and fractures the hook of the hamate. He has "
            "weakness of finger abduction and adduction, a positive Froment sign when he "
            "pinches a sheet of paper, and numbness on the palmar surfaces of the fourth and "
            "fifth digits. Sensation on the dorsal ulnar hand is preserved. Flexor carpi "
            "ulnaris is strong, and flexion of the distal interphalangeal joints of the "
            "fourth and fifth digits is strong. There is no neck pain, no Horner syndrome, "
            "and no median-distribution sensory loss. Which localization do the spared dorsal "
            "sensation and the spared forearm ulnar muscles require?"
        ),
        "question": "Which localization do the spared dorsal sensation and the spared forearm ulnar muscles require?",
        "options": [
            "Ulnar nerve in the Guyon canal",
            "Ulnar nerve in the cubital tunnel",
            "C8 nerve root",
            "Lower trunk of the brachial plexus",
            "Median nerve in the carpal tunnel",
        ],
        "correctAnswer": "Ulnar nerve in the Guyon canal",
        "explanation": (
            "The dorsal cutaneous branch of the ulnar nerve leaves in the distal forearm, "
            "proximal to the Guyon canal, and flexor carpi ulnaris plus the medial half of "
            "flexor digitorum profundus are supplied in the forearm. A lesion at the hook of "
            "the hamate can therefore abolish palmar digital sensation and intrinsic motor "
            "function while leaving dorsal ulnar sensation and those forearm muscles intact. "
            "Ulnar nerve in the Guyon canal is the site. Ulnar nerve in the cubital tunnel is "
            "the easy answer for any ulnar claw, and it fails because an elbow lesion would "
            "numb the dorsal ulnar hand and weaken flexor carpi ulnaris and the medial "
            "profundus. C8 nerve root fails because a root lesion produces neck pain and "
            "weakness beyond one distal canal, including forearm finger flexors, and it is "
            "not caused by a hamate fracture. Lower trunk of the brachial plexus fails "
            "because a lower-trunk lesion adds medial-arm sensory loss and can add Horner "
            "syndrome, neither of which is present. Median nerve in the carpal tunnel fails "
            "because carpal tunnel symptoms occupy the thumb, index, and middle fingers and "
            "the thenar muscles, not the ulnar intrinsics and the fourth and fifth digits."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-031",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 22-year-old soccer player is struck on the lateral knee, fracturing the neck "
            "of the fibula. He has a foot drop. Ankle dorsiflexion and great-toe extension "
            "are absent. Eversion of the foot is also absent. Sensation is lost on the dorsum "
            "of the foot and the lateral leg. Inversion of the plantarflexed foot is "
            "preserved, ankle plantarflexion is strong, and the Achilles reflex is present. "
            "Hamstring strength is normal, and the patellar reflex is normal. Which nerve "
            "lesion does the added loss of eversion identify?"
        ),
        "question": "Which nerve lesion does the added loss of eversion identify?",
        "options": [
            "Common fibular nerve at the fibular neck",
            "Deep fibular nerve alone",
            "Tibial nerve in the popliteal fossa",
            "Sciatic nerve in the pelvis",
            "L4 nerve root",
        ],
        "correctAnswer": "Common fibular nerve at the fibular neck",
        "explanation": (
            "The common fibular nerve wraps the fibular neck and then divides. Its deep "
            "branch dorsiflexes the ankle and extends the toes, and its superficial branch "
            "everts the foot through fibularis longus and brevis and supplies the dorsum of "
            "the foot. Loss of both dorsiflexion and eversion, with sensory loss on the "
            "dorsum, localizes to the common trunk. Inversion is spared because tibialis "
            "posterior is tibial-innervated. Common fibular nerve at the fibular neck is the "
            "lesion. Deep fibular nerve alone is the easy answer for any foot drop, and it "
            "fails because a pure deep fibular lesion would spare eversion. Tibial nerve in "
            "the popliteal fossa fails because a tibial lesion would weaken plantarflexion "
            "and inversion and numb the sole, while dorsiflexion would remain. Sciatic nerve "
            "in the pelvis fails because a pelvic sciatic lesion weakens hamstrings and both "
            "the tibial and fibular divisions, so plantarflexion would be lost along with "
            "dorsiflexion. L4 nerve root fails because an L4 root lesion reduces the "
            "patellar reflex and weakens inversion, with sensory loss on the medial leg, "
            "rather than knocking out eversion at the fibular neck."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-032",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 45-year-old warehouse worker with a body-mass index of 36 kg/m2 wears a tight "
            "tool belt. For two months he has had burning pain over the anterolateral right "
            "thigh that worsens after long shifts and improves when he loosens the belt. "
            "Examination shows altered sensation in a palm-sized patch on the lateral thigh. "
            "Hip flexion, knee extension, and thigh adduction are full. The patellar reflex "
            "is symmetric. There is no back pain, no weakness below the knee, and no saddle "
            "anesthesia. Which nerve is compressed?"
        ),
        "question": "Which nerve is compressed?",
        "options": [
            "Lateral femoral cutaneous nerve",
            "Femoral nerve",
            "Obturator nerve",
            "L2 nerve root",
            "Sciatic nerve",
        ],
        "correctAnswer": "Lateral femoral cutaneous nerve",
        "explanation": (
            "The lateral femoral cutaneous nerve passes under the inguinal ligament near the "
            "anterior superior iliac spine and is purely sensory to the anterolateral thigh. "
            "Compression there, from a belt, obesity, or pregnancy, produces meralgia "
            "paresthetica: burning lateral-thigh pain with no motor loss and a normal "
            "patellar reflex. Lateral femoral cutaneous nerve is the compressed nerve. "
            "Femoral nerve fails because a femoral neuropathy weakens quadriceps knee "
            "extension, reduces the patellar reflex, and changes sensation on the anterior "
            "thigh and the medial leg through the saphenous nerve. Obturator nerve fails "
            "because the obturator nerve supplies thigh adduction and a medial-thigh sensory "
            "strip, and adduction is full. L2 nerve root fails because an L2 root lesion is "
            "painful in the back and weakens hip flexion through iliopsoas, which is strong "
            "here. Sciatic nerve fails because a sciatic lesion weakens the hamstrings and "
            "the muscles below the knee and changes sensation on the posterior thigh, leg, "
            "and foot, none of which is involved."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-033",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 19-year-old man has a closed tibial shaft fracture placed in a tight cast. Six "
            "hours later he has pain out of proportion to the injury and pain when the "
            "examiner passively plantarflexes the ankle and toes. The anterior leg is wooden "
            "to palpation. He cannot dorsiflex the ankle or extend the toes. Sensation is "
            "lost specifically in the first web space. Sensation on the sole of the foot is "
            "intact, and he can still plantarflex the ankle when pain allows a brief test. "
            "Eversion is relatively preserved compared with dorsiflexion. Which compartment "
            "and nerve does the first-web sensory loss identify?"
        ),
        "question": "Which compartment and nerve does the first-web sensory loss identify?",
        "options": [
            "Anterior compartment and the deep fibular nerve",
            "Lateral compartment and the superficial fibular nerve",
            "Deep posterior compartment and the tibial nerve",
            "Superficial posterior compartment and the sural nerve",
            "Anterior thigh compartment and the femoral nerve",
        ],
        "correctAnswer": "Anterior compartment and the deep fibular nerve",
        "explanation": (
            "The anterior compartment of the leg contains tibialis anterior, extensor "
            "hallucis longus, extensor digitorum longus, the deep fibular nerve, and the "
            "anterior tibial artery. Passive plantarflexion stretches those dorsiflexors and "
            "reproduces the pain of compartment syndrome. The deep fibular nerve is the only "
            "nerve that supplies the skin of the first web space, so that sensory finding "
            "places the ischemia in the anterior compartment. Anterior compartment and the "
            "deep fibular nerve is the localization. Lateral compartment and the superficial "
            "fibular nerve fails because the superficial fibular nerve everts the foot and "
            "supplies the dorsum of the foot while sparing the first web space, and eversion "
            "is relatively preserved. Deep posterior compartment and the tibial nerve fails "
            "because a deep posterior syndrome hurts when the toes are passively extended, "
            "weakens toe flexion and inversion, and numbs the sole through the tibial nerve, "
            "which is intact. Superficial posterior compartment and the sural nerve fails "
            "because that compartment is gastrocnemius and soleus, the deficit is ankle "
            "plantarflexion, and the sural nerve is a sensory nerve to the lateral foot, not "
            "the first web. Anterior thigh compartment and the femoral nerve fails because "
            "the femoral nerve extends the knee and supplies the anterior thigh, far from a "
            "tibial fracture and a first-web deficit."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-034",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 52-year-old woman who types for long shifts wakes at night with burning pain "
            "in the thumb, index finger, and middle finger of the dominant hand. Shaking the "
            "hand helps. Thenar abduction is weak, and Phalen maneuver reproduces the "
            "paresthesias. Two-point discrimination is reduced on the palmar surfaces of "
            "those digits. Sensation on the palm over the thenar eminence is normal. She can "
            "flex the distal phalanx of the thumb and the index finger. There is no neck "
            "pain, the brachioradialis reflex is present, and the ulnar digits are spared. "
            "Which site does the spared thenar-palm sensation require?"
        ),
        "question": "Which site does the spared thenar-palm sensation require?",
        "options": [
            "Median nerve inside the carpal tunnel",
            "Median nerve proximal to the carpal tunnel",
            "Anterior interosseous nerve",
            "Ulnar nerve in the Guyon canal",
            "C6 nerve root",
        ],
        "correctAnswer": "Median nerve inside the carpal tunnel",
        "explanation": (
            "The palmar cutaneous branch of the median nerve arises in the distal forearm and "
            "crosses superficial to the flexor retinaculum, so it is spared when the median "
            "nerve is compressed inside the carpal tunnel. Digital sensory branches and the "
            "recurrent thenar motor branch travel through the tunnel and are affected. "
            "Nocturnal paresthesias in the thumb, index, and middle fingers with a spared "
            "thenar palm therefore localize inside the tunnel. Median nerve inside the "
            "carpal tunnel is the site. Median nerve proximal to the carpal tunnel is the "
            "easy answer whenever median symptoms are mentioned, and it fails because a "
            "proximal lesion, as in the pronator region, would numb the thenar palm and often "
            "weaken the forearm muscles that flex the thumb and index tips. Anterior "
            "interosseous nerve fails because that branch is pure motor to flexor pollicis "
            "longus and the lateral profundus, produces an abnormal pinch, and has no sensory "
            "symptoms at all. Ulnar nerve in the Guyon canal fails because Guyon canal "
            "symptoms involve the fourth and fifth digits and the interossei, which are "
            "spared. C6 nerve root fails because a C6 root lesion causes neck pain, a reduced "
            "brachioradialis reflex, and sensory loss that includes the dorsal thumb, not a "
            "purely palmar nocturnal thenar-motor pattern with a spared palm."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-035",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "anatomy",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 21-year-old rugby player sustains an anterior dislocation of the glenohumeral "
            "joint. After reduction he cannot abduct the arm between about 15 and 90 degrees, "
            "and the deltoid contour is flat. Sensation is lost over a patch on the lateral "
            "upper arm. The first 15 degrees of abduction are preserved, and external "
            "rotation against resistance by infraspinatus is largely preserved. Elbow flexion "
            "and the biceps reflex are normal. Wrist extension is normal. The scapula does "
            "not wing. Which nerve injury do the preserved infraspinatus and biceps identify?"
        ),
        "question": "Which nerve injury do the preserved infraspinatus and biceps identify?",
        "options": [
            "Axillary nerve",
            "Upper trunk of the brachial plexus",
            "Suprascapular nerve",
            "Radial nerve",
            "Long thoracic nerve",
        ],
        "correctAnswer": "Axillary nerve",
        "explanation": (
            "The axillary nerve, from the posterior cord, winds around the surgical neck and "
            "supplies deltoid, teres minor, and the skin of the lateral upper arm. Anterior "
            "dislocation or a surgical-neck fracture injures it. Initiation of abduction by "
            "supraspinatus can remain, while deltoid abduction and the regimental-badge "
            "sensation are lost. Preserved infraspinatus and biceps show that the "
            "suprascapular and musculocutaneous pathways are intact. Axillary nerve is the "
            "injury. Upper trunk of the brachial plexus is the easy answer after shoulder "
            "trauma with weak abduction, and it fails because an upper trunk lesion also "
            "knocks out infraspinatus through the suprascapular nerve and biceps through the "
            "musculocutaneous nerve, both of which work here. Suprascapular nerve fails "
            "because a suprascapular lesion weakens supraspinatus and infraspinatus, so the "
            "first 15 degrees of abduction and external rotation fail, while deltoid "
            "sensation stays intact. Radial nerve fails because a radial lesion causes wrist "
            "drop and dorsal-hand sensory loss, and wrist extension is normal. Long thoracic "
            "nerve fails because a long thoracic lesion wings the scapula through serratus "
            "anterior paralysis and does not numb the lateral upper arm or flatten the deltoid."
        ),
        "ref": "guyton-14",
    },
    {
        "id": "s1-msk-036",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "An 11-year-old boy has fever, a hemoglobin of 10.2 g/dL, and an erythrocyte "
            "sedimentation rate of 88 mm/h. Night pain is localized to the midshaft of the "
            "femur, not the metaphysis. Radiographs show a permeative diaphyseal lesion with "
            "a laminated onion-skin periosteal reaction. Biopsy shows sheets of uniform small "
            "round blue cells whose cytoplasm stains with periodic acid-Schiff and is "
            "digested by diastase. Membranous CD99 is positive. Cytogenetics show t(11;22) "
            "with an EWSR1-FLI1 fusion. Blood cultures are negative, and there is no adrenal "
            "mass and no elevation of urinary catecholamines. Which diagnosis does the "
            "diaphyseal onion-skin pattern plus this fusion establish?"
        ),
        "question": "Which diagnosis does the diaphyseal onion-skin pattern plus this fusion establish?",
        "options": [
            "Ewing sarcoma",
            "Conventional osteosarcoma",
            "Acute hematogenous osteomyelitis",
            "Osteoid osteoma",
            "Metastatic neuroblastoma",
        ],
        "correctAnswer": "Ewing sarcoma",
        "explanation": (
            "Ewing sarcoma is a diaphyseal small round blue-cell tumor of children and "
            "adolescents. Onion-skin periosteal layering, fever, and a high sedimentation "
            "rate mimic infection, but glycogen-rich cytoplasm, membranous CD99, and the "
            "EWSR1-FLI1 fusion from t(11;22) establish the sarcoma. The diaphyseal location "
            "is the radiographic feature that moves the reader away from the usual "
            "metaphyseal osteosarcoma of adolescence. Ewing sarcoma is the diagnosis. "
            "Conventional osteosarcoma fails because osteosarcoma arises in the metaphysis, "
            "produces tumor osteoid, and often shows a sunburst reaction, and it does not "
            "carry EWSR1-FLI1. Acute hematogenous osteomyelitis fails because infection "
            "produces neutrophils and a positive culture, classically in the metaphysis, not "
            "a clonal glycogen-positive tumor with this translocation. Osteoid osteoma fails "
            "because an osteoid osteoma is a tiny cortical nidus whose nocturnal pain is "
            "relieved by nonsteroidal drugs, without systemic small round cells. Metastatic "
            "neuroblastoma fails because neuroblastoma occurs in younger children, usually "
            "has an adrenal primary, raises catecholamines, and is driven by N-MYC rather "
            "than by t(11;22); this child has a primary bone tumor and normal catecholamines."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-037",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 17-year-old male distance runner has six months of tibial pain that wakes him "
            "every night and disappears within half an hour of taking ibuprofen. He has no "
            "fever. The leukocyte count, erythrocyte sedimentation rate, and C-reactive "
            "protein are normal. Computed tomography shows an 8 mm round radiolucent nidus in "
            "the tibial cortex surrounded by dense sclerosis. There is no soft-tissue mass, "
            "no onion-skin layering, and no linear cortical crack. The nidus is not in the "
            "posterior elements of the spine. Which lesion does the nidus size and the drug "
            "response identify?"
        ),
        "question": "Which lesion does the nidus size and the drug response identify?",
        "options": [
            "Osteoid osteoma",
            "Acute osteomyelitis",
            "Ewing sarcoma",
            "Osteoblastoma",
            "Tibial stress fracture",
        ],
        "correctAnswer": "Osteoid osteoma",
        "explanation": (
            "An osteoid osteoma is a small benign bone-forming tumor, usually under 1.5 cm, "
            "seated in the cortex of a long-bone diaphysis in an adolescent or young man. The "
            "nidus secretes prostaglandins, which is why the pain is nocturnal and is "
            "strikingly abolished by a nonsteroidal anti-inflammatory drug, while systemic "
            "inflammatory markers stay normal. Osteoid osteoma is the lesion. Acute "
            "osteomyelitis fails because bone infection produces fever and raised "
            "inflammatory markers and does not form an 8 mm prostaglandin-secreting cortical "
            "nidus that vanishes with ibuprofen. Ewing sarcoma fails because Ewing sarcoma "
            "is a permeative diaphyseal malignancy with onion-skin periosteum, systemic "
            "symptoms, and small round cells, not a tiny sclerotic nidus. Osteoblastoma "
            "fails because an osteoblastoma is the histologic relative whose nidus is "
            "typically larger than 2 cm, often sits in the posterior elements of the spine, "
            "and is not reliably switched off by nonsteroidal drugs. Tibial stress fracture "
            "fails because a stress fracture is a linear cortical lucency or periosteal "
            "reaction with activity-related pain, not a round nidus whose pain is "
            "specifically nocturnal and abolished by ibuprofen."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-038",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 15-year-old boy has deep shoulder pain. The radiograph is read first as an "
            "epiphyseal lytic lesion, and a student calls it a giant cell tumor because the "
            "lesion touches the end of the bone. The same film shows that the proximal "
            "humeral growth plate is still open. Inside the epiphysis there is a geographic "
            "lytic lesion with punctate chicken-wire calcifications. He has no fever, and "
            "the film does not suggest an abscess. Which diagnosis does the open physis "
            "require?"
        ),
        "question": "Which diagnosis does the open physis require?",
        "options": [
            "Chondroblastoma",
            "Giant cell tumor of bone",
            "Conventional osteosarcoma",
            "Clear cell chondrosarcoma",
            "Brodie abscess",
        ],
        "correctAnswer": "Chondroblastoma",
        "explanation": (
            "Chondroblastoma is the epiphyseal cartilage tumor of an adolescent whose growth "
            "plate is still open. Chicken-wire calcification is the classic matrix. The open "
            "physis is the single radiographic fact that removes giant cell tumor from the "
            "differential, because giant cell tumor occurs only after the plate has closed. "
            "Chondroblastoma is the diagnosis the open plate requires. Giant cell tumor of "
            "bone fails because giant cell tumor is a locally aggressive epiphyseal lesion of "
            "adults roughly 20 to 40 years old, after physeal closure, and it does not show "
            "chicken-wire chondroid matrix. Conventional osteosarcoma fails because "
            "osteosarcoma is metaphyseal, forms osteoid, and lifts the periosteum into a "
            "Codman triangle or sunburst, rather than sitting as a geographic epiphyseal "
            "lesion with punctate cartilage calcification. Clear cell chondrosarcoma fails "
            "because that rare epiphyseal malignancy occurs in adults, not in a 15-year-old "
            "with an open plate and benign chicken-wire calcification. Brodie abscess fails "
            "because a Brodie abscess is a subacute metaphyseal osteomyelitis with a "
            "sclerotic rim and no chondroid chicken-wire matrix."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-039",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 34-year-old woman has knee pain for four months. The distal femoral and "
            "proximal tibial growth plates are closed. Radiographs show an expansile lytic "
            "lesion centered in the distal femoral epiphysis, extending to the subchondral "
            "bone, with a soap-bubble appearance and no rings-and-arcs cartilage matrix. She "
            "has no fever. Biopsy shows mononuclear stromal cells and numerous "
            "osteoclast-type giant cells; the stromal cells express RANKL. Fluid-fluid levels "
            "are not the dominant feature, and there is no ground-glass matrix. Which tumor "
            "fits the closed physis and this histology?"
        ),
        "question": "Which tumor fits the closed physis and this histology?",
        "options": [
            "Giant cell tumor of bone",
            "Chondroblastoma",
            "Aneurysmal bone cyst",
            "Chondrosarcoma",
            "Nonossifying fibroma",
        ],
        "correctAnswer": "Giant cell tumor of bone",
        "explanation": (
            "After physeal closure, a lytic lesion that reaches the subchondral bone of a "
            "long-bone epiphysis in a young adult is a giant cell tumor until proved "
            "otherwise. The neoplastic cells are the mononuclear stromal cells that express "
            "RANKL and recruit the osteoclast-type giant cells seen on the slide. Giant cell "
            "tumor of bone fits the closed plates and the histology. Chondroblastoma fails "
            "because chondroblastoma occurs while the growth plate is still open, in "
            "adolescents, and shows chicken-wire calcification rather than a soap-bubble "
            "lesion in a 34-year-old. Aneurysmal bone cyst fails because an aneurysmal bone "
            "cyst is an eccentric, expansile, blood-filled lesion of younger patients with "
            "fluid-fluid levels, and it is not defined by RANKL-positive stromal cells "
            "centered on a closed epiphysis. Chondrosarcoma fails because chondrosarcoma "
            "produces cartilage matrix with rings and arcs, tends to occur in older adults, "
            "and favors the pelvis and proximal skeleton over a purely lytic epiphyseal soap "
            "bubble. Nonossifying fibroma fails because a nonossifying fibroma is an "
            "incidental eccentric cortical metaphyseal lesion of children, not an epiphyseal "
            "tumor that reaches the articular surface in an adult."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-040",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 28-year-old man has had a painless bony bump on the distal femur since "
            "adolescence. Old films showed continuity of the cortical and medullary bone of "
            "the femur with the stalk of the bump, and the cartilage cap measured 4 mm. Over "
            "the past four months the site has become painful and has enlarged after skeletal "
            "maturity. Magnetic resonance imaging now shows a cartilage cap 2.8 cm thick with "
            "irregularity of the underlying cortex. There is no sunburst periosteal reaction "
            "and no separate soft-tissue mass with peripheral zoning. Which interpretation "
            "does the new cap thickness require?"
        ),
        "question": "Which interpretation does the new cap thickness require?",
        "options": [
            "Secondary chondrosarcoma arising in an osteochondroma",
            "Benign osteochondroma with a clinically insignificant cap",
            "Conventional intramedullary osteosarcoma",
            "Myositis ossificans",
            "Ewing sarcoma",
        ],
        "correctAnswer": "Secondary chondrosarcoma arising in an osteochondroma",
        "explanation": (
            "An osteochondroma is a bony excrescence whose cortex and medulla are continuous "
            "with the parent bone and whose cap is cartilage. In an adult, new pain plus a "
            "cartilage cap thicker than about 2 cm indicates malignant transformation to "
            "secondary chondrosarcoma. The cap thickness is the radiographic feature that "
            "changes a previously benign exostosis into a malignancy. Secondary "
            "chondrosarcoma arising in an osteochondroma is the required interpretation. "
            "Benign osteochondroma with a clinically insignificant cap fails because a cap "
            "of a few millimeters can be insignificant, whereas 2.8 cm of cap with new pain "
            "after skeletal maturity is the transformation threshold, not a stable benign "
            "cap. Conventional intramedullary osteosarcoma fails because osteosarcoma forms "
            "tumor osteoid in the metaphysis, often with a sunburst reaction, rather than "
            "thickening the cartilage cap of an exostosis. Myositis ossificans fails because "
            "myositis ossificans shows peripheral zoning of mature bone in muscle after "
            "trauma and is separate from the medullary cavity. Ewing sarcoma fails because "
            "Ewing sarcoma is a diaphyseal small round cell tumor of children with onion-skin "
            "periosteum and an EWSR1 fusion, not a thickened cartilage cap on a known "
            "osteochondroma."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-041",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 19-year-old football player took a direct blow to the anterior thigh six weeks "
            "ago. A firm mass has enlarged at the site. Radiographs show a rim of mature "
            "bone at the periphery of the mass with a more lucent center, separated from the "
            "femoral cortex by a thin cleavage plane. The femur itself has no medullary "
            "lesion, no sunburst periosteum, and no continuity of its marrow into the mass. "
            "He has no night sweats or fever. Which diagnosis does the peripheral zoning "
            "pattern establish?"
        ),
        "question": "Which diagnosis does the peripheral zoning pattern establish?",
        "options": [
            "Myositis ossificans",
            "Conventional osteosarcoma",
            "Parosteal osteosarcoma",
            "Soft-tissue Ewing sarcoma",
            "Simple hematoma without ossification",
        ],
        "correctAnswer": "Myositis ossificans",
        "explanation": (
            "Myositis ossificans is heterotopic bone that forms in muscle after trauma. It "
            "matures from the outside in, so radiographs show a peripheral rim of organized "
            "bone and a lucent center, often with a cleavage plane from the cortex. That "
            "zoning is the feature that separates it from a sarcoma, and early biopsy of the "
            "cellular center can be misleading. Myositis ossificans is the diagnosis. "
            "Conventional osteosarcoma fails because osteosarcoma is an intramedullary "
            "metaphyseal tumor that ossifies from the center outward, often with sunburst "
            "periosteum and a soft-tissue mass in continuity with abnormal marrow. Parosteal "
            "osteosarcoma fails because parosteal osteosarcoma is a surface bone-forming "
            "tumor, classically on the posterior distal femur of an adult, stuck onto the "
            "cortex, without the short post-traumatic history and the outside-in zoning of "
            "myositis ossificans. Soft-tissue Ewing sarcoma fails because a soft-tissue Ewing "
            "sarcoma is a small round cell mass without a peripheral shell of mature bone. "
            "Simple hematoma without ossification fails because a hematoma can follow a blow "
            "but does not lay down a radiographic rim of mature peripheral bone."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-042",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "An 8-year-old child falls from a swing and cannot use the left arm. Radiographs "
            "show a pathologic fracture through a centrally located, unilocular radiolucent "
            "lesion in the proximal humeral metaphysis. The cortex is thinned but not "
            "destroyed by a soft-tissue mass. A fragment of cortex lies in the dependent "
            "portion of the lesion, the fallen-fragment sign. There is no ground-glass "
            "matrix, no eccentric ballooning with fluid levels, and no onion-skin periosteal "
            "reaction. The child was asymptomatic before the fall. Which lesion does the "
            "fallen fragment identify?"
        ),
        "question": "Which lesion does the fallen fragment identify?",
        "options": [
            "Unicameral bone cyst",
            "Aneurysmal bone cyst",
            "Ewing sarcoma",
            "Fibrous dysplasia",
            "Nonossifying fibroma",
        ],
        "correctAnswer": "Unicameral bone cyst",
        "explanation": (
            "A unicameral, or simple, bone cyst is a fluid-filled central metaphyseal lesion "
            "of children, classically in the proximal humerus. When it fractures, a piece of "
            "cortex falls to the bottom of the fluid cavity. That fallen-fragment sign is "
            "the radiographic feature that identifies the cyst. Unicameral bone cyst is the "
            "lesion. Aneurysmal bone cyst fails because an aneurysmal bone cyst is eccentric "
            "and expansile, shows fluid-fluid levels, and does not produce a fallen-fragment "
            "sign inside a central unilocular cavity. Ewing sarcoma fails because Ewing "
            "sarcoma is a permeative diaphyseal malignancy with onion-skin periosteum and "
            "systemic symptoms, not an asymptomatic central cyst revealed by a fallen "
            "cortical fragment. Fibrous dysplasia fails because fibrous dysplasia has a "
            "ground-glass matrix and may bow a long bone, without a dependent cortical "
            "fragment inside a fluid cavity. Nonossifying fibroma fails because a "
            "nonossifying fibroma is an eccentric cortical metaphyseal lesion that is usually "
            "an incidental finding and does not show a fallen fragment in a central cyst."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-043",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 70-year-old man has worsening back pain, anemia, and a creatinine of "
            "2.6 mg/dL. Serum calcium is 11.7 mg/dL, parathyroid hormone is suppressed, and "
            "alkaline phosphatase is normal. Skull films show multiple punched-out lytic "
            "lesions. A bone scan shows no increased uptake at those lesions. The peripheral "
            "smear shows rouleaux formation, and serum protein electrophoresis shows a "
            "monoclonal spike. Prostate-specific antigen is normal. Which disease does the "
            "normal alkaline phosphatase and the cold bone scan identify?"
        ),
        "question": "Which disease does the normal alkaline phosphatase and the cold bone scan identify?",
        "options": [
            "Multiple myeloma",
            "Osteoblastic prostate cancer metastases",
            "Paget disease of bone",
            "Primary hyperparathyroidism",
            "Osteolytic breast cancer with an osteoblastic reaction",
        ],
        "correctAnswer": "Multiple myeloma",
        "explanation": (
            "Myeloma activates osteoclasts without a meaningful osteoblastic response, so "
            "alkaline phosphatase stays normal and the lesions are cold on a technetium bone "
            "scan. Punched-out lytic bone lesions, hypercalcemia, renal failure from light "
            "chains, rouleaux, and a monoclonal spike complete the picture. The normal "
            "alkaline phosphatase is the laboratory feature that separates this purely "
            "osteolytic process from blastic metastases. Multiple myeloma is the disease. "
            "Osteoblastic prostate cancer metastases fail because osteoblastic metastases "
            "raise alkaline phosphatase, light up on a bone scan, and are accompanied by a "
            "high prostate-specific antigen, which is normal here. Paget disease of bone "
            "fails because Paget disease produces a very high alkaline phosphatase with "
            "normal calcium and expanded, mixed lytic-sclerotic bone, not a monoclonal spike "
            "and rouleaux. Primary hyperparathyroidism fails because parathyroid hormone "
            "would be high, not suppressed, and the bone disease is subperiosteal resorption "
            "and brown tumors rather than innumerable cold skull lesions with a monoclonal "
            "protein. Osteolytic breast cancer with an osteoblastic reaction fails because "
            "an osteoblastic reaction raises alkaline phosphatase and produces hot spots on "
            "the bone scan, and it does not create rouleaux or a serum monoclonal spike."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-044",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 48-year-old woman has ninety minutes of morning stiffness and symmetric "
            "swelling of the metacarpophalangeal and proximal interphalangeal joints. The "
            "distal interphalangeal joints are spared. Ulnar deviation is beginning. "
            "Anti-cyclic citrullinated peptide antibody and rheumatoid factor are positive. "
            "Radiographs show marginal erosions and periarticular osteopenia without "
            "osteophytes. She has no spinal pain, no crystals on a prior aspiration, and no "
            "fatigable weakness of the eyelids. Which mechanism is destroying these joints?"
        ),
        "question": "Which mechanism is destroying these joints?",
        "options": [
            "Synovial pannus with RANKL-mediated marginal osteoclast erosion",
            "Mechanical cartilage fibrillation with osteophyte formation",
            "Neutrophilic ingestion of negatively birefringent needles",
            "Entheseal inflammation at spinal ligament insertions",
            "Anti-acetylcholine receptor blockade at the neuromuscular junction",
        ],
        "correctAnswer": "Synovial pannus with RANKL-mediated marginal osteoclast erosion",
        "explanation": (
            "Rheumatoid arthritis is a synovial disease. CD4 T cells and macrophages drive "
            "fibroblast-like synoviocytes to form pannus, which releases matrix "
            "metalloproteinases and RANKL. Osteoclasts then cut marginal erosions where "
            "pannus meets bone. Symmetric metacarpophalangeal and proximal interphalangeal "
            "disease, distal interphalangeal sparing, prolonged morning stiffness, and "
            "anti-cyclic citrullinated peptide antibodies identify that mechanism. Synovial "
            "pannus with RANKL-mediated marginal osteoclast erosion is the mechanism. "
            "Mechanical cartilage fibrillation with osteophyte formation fails because that "
            "is osteoarthritis, which produces osteophytes, subchondral sclerosis, and "
            "Heberden nodes at the distal interphalangeal joints, a distribution spared "
            "here. Neutrophilic ingestion of negatively birefringent needles fails because "
            "that is gout, and no urate crystals were found. Entheseal inflammation at "
            "spinal ligament insertions fails because that is the mechanism of ankylosing "
            "spondylitis, a disease of the sacroiliac joints and spine in a younger patient, "
            "not of the small joints of the hands. Anti-acetylcholine receptor blockade at "
            "the neuromuscular junction fails because that is myasthenia gravis, which "
            "causes fatigable weakness rather than erosive synovitis."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-045",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 68-year-old man has bony enlargement of the distal interphalangeal joints and "
            "pain at the base of the thumb. His knees ache after walking and loosen within "
            "about ten minutes of waking. The erythrocyte sedimentation rate is normal, and "
            "anti-cyclic citrullinated peptide antibody is negative. Knee radiographs show "
            "joint-space narrowing, subchondral sclerosis, osteophytes, and subchondral "
            "cysts. There are no marginal erosions, no chondrocalcinosis, and no organisms "
            "on any prior aspiration. Which mechanism best accounts for the cartilage loss?"
        ),
        "question": "Which mechanism best accounts for the cartilage loss?",
        "options": [
            "Chondrocyte-driven matrix metalloproteinase degradation of type II collagen",
            "CD4 T-cell pannus invading marginal bone",
            "IgM rheumatoid factor complexes as the primary cartilage event",
            "Monosodium urate activation of the NLRP3 inflammasome",
            "Bacterial seeding of the synovial membrane",
        ],
        "correctAnswer": "Chondrocyte-driven matrix metalloproteinase degradation of type II collagen",
        "explanation": (
            "Osteoarthritis begins in cartilage. Chondrocytes respond to mechanical load by "
            "releasing matrix metalloproteinases that degrade type II collagen and "
            "proteoglycan. The joint then forms osteophytes, subchondral sclerosis, and "
            "subchondral cysts. Distal interphalangeal Heberden nodes, first "
            "carpometacarpal pain, brief stiffness, and a normal sedimentation rate match "
            "that noninflammatory mechanism. Chondrocyte-driven matrix metalloproteinase "
            "degradation of type II collagen is the mechanism. CD4 T-cell pannus invading "
            "marginal bone fails because pannus and marginal erosions define rheumatoid "
            "arthritis, which targets metacarpophalangeal and proximal interphalangeal "
            "joints and spares the distal interphalangeal joints that are enlarged here. "
            "IgM rheumatoid factor complexes as the primary cartilage event fails because "
            "rheumatoid factor is not the driver of osteoarthritis and the citrullinated-"
            "peptide antibody is negative. Monosodium urate activation of the NLRP3 "
            "inflammasome fails because that pathway produces acute gout, and there is no "
            "chondrocalcinosis stand-in and no crystal history. Bacterial seeding of the "
            "synovial membrane fails because septic arthritis is an acute hot joint with "
            "organisms, not years of osteophytes and a normal sedimentation rate."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-046",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pharmacology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 44-year-old woman has four months of symmetric synovitis in twelve joints, "
            "including the metacarpophalangeal joints and wrists, with two hours of morning "
            "stiffness. Anti-cyclic citrullinated peptide antibody is strongly positive and "
            "C-reactive protein is persistently high. Disease activity is moderate to high. "
            "She has never taken a disease-modifying drug. Liver enzymes, hepatitis "
            "serologies, blood counts, and creatinine are normal. She is not pregnant, uses "
            "reliable contraception, and does not drink alcohol. There is no interstitial "
            "lung disease. Which initial disease-modifying therapy is indicated?"
        ),
        "question": "Which initial disease-modifying therapy is indicated?",
        "options": [
            "Methotrexate monotherapy",
            "Etanercept monotherapy",
            "Long-term prednisone monotherapy",
            "Hydroxychloroquine monotherapy",
            "Colchicine monotherapy",
        ],
        "correctAnswer": "Methotrexate monotherapy",
        "explanation": (
            "For a disease-modifying-drug-naive patient with moderate-to-high rheumatoid "
            "arthritis activity, the 2021 American College of Rheumatology guideline "
            "strongly recommends methotrexate monotherapy over a biologic or targeted "
            "synthetic drug as the initial regimen, and over hydroxychloroquine or "
            "sulfasalazine. Methotrexate inhibits dihydrofolate reductase, is titrated to "
            "an effective weekly dose, and is paired with folic acid. This patient has no "
            "contraindication. Methotrexate monotherapy is the indicated start. Etanercept "
            "monotherapy fails because a TNF inhibitor is not preferred initial monotherapy "
            "ahead of methotrexate in a naive patient with moderate-to-high activity. "
            "Long-term prednisone monotherapy fails because glucocorticoids may bridge a "
            "flare briefly, while long-term glucocorticoid use is discouraged and is not a "
            "disease-modifying substitute for methotrexate. Hydroxychloroquine monotherapy "
            "fails because hydroxychloroquine is the conditional choice for low disease "
            "activity, not for this moderate-to-high presentation. Colchicine monotherapy "
            "fails because colchicine is used for crystal arthritis and has no role as "
            "initial disease-modifying therapy for rheumatoid arthritis."
        ),
        "ref": "acr-ra-2021",
    },
    {
        "id": "s1-msk-047",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 61-year-old woman with twenty years of seropositive rheumatoid arthritis "
            "develops occipital pain and electric shocks into both arms when she nods "
            "forward. Knee jerks and biceps jerks are brisk, and plantar responses are "
            "upgoing. Flexion radiographs of the neck show an increased interval between "
            "the anterior arch of the atlas and the dens. The sacroiliac joints are normal, "
            "the lumbar spine shows no syndesmophytes, and there is no flowing anterior "
            "ossification of the thoracic spine. She has no adolescent curve history. Which "
            "lesion explains the neurologic findings?"
        ),
        "question": "Which lesion explains the neurologic findings?",
        "options": [
            "Pannus and transverse-ligament laxity at the atlantoaxial joint",
            "Lumbar syndesmophytes of ankylosing spondylitis",
            "Flowing anterior osteophytes of diffuse idiopathic skeletal hyperostosis",
            "Idiopathic adolescent thoracic scoliosis",
            "Sacral insufficiency fracture",
        ],
        "correctAnswer": "Pannus and transverse-ligament laxity at the atlantoaxial joint",
        "explanation": (
            "Rheumatoid synovitis concentrates at the cervical spine, especially the "
            "atlantoaxial joint, where pannus and laxity of the transverse ligament let the "
            "dens shift and compress the cord in flexion. Occipital pain, Lhermitte-like "
            "shocks, hyperreflexia, and a widened atlantodental interval are that lesion. "
            "Pannus and transverse-ligament laxity at the atlantoaxial joint is the "
            "explanation. Lumbar syndesmophytes of ankylosing spondylitis fail because "
            "ankylosing spondylitis ossifies spinal ligaments and fuses the sacroiliac "
            "joints in a younger patient; this patient's sacroiliac joints and lumbar spine "
            "are clear, and rheumatoid arthritis is the disease that targets C1-C2. Flowing "
            "anterior osteophytes of diffuse idiopathic skeletal hyperostosis fail because "
            "that condition preserves disc spaces, forms bulky anterior osteophytes, and "
            "does not produce a widened atlantodental interval from pannus. Idiopathic "
            "adolescent thoracic scoliosis fails because she has no curve history from "
            "adolescence and the neurologic level is a C1-C2 slip. Sacral insufficiency "
            "fracture fails because a sacral fracture causes pelvic pain, not flexion-"
            "triggered arm shocks and long-tract signs from the craniocervical junction."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-048",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 23-year-old sexually active woman has three days of fever, migratory pain in "
            "the wrists and ankles, and tenosynovitis on the dorsum of one hand. A few "
            "pustules sit on the distal extremities. The left knee then becomes hot. "
            "Synovial fluid contains 62,000 leukocytes per microliter. Gram stain of the "
            "fluid shows no organisms, and the joint culture remains negative, as do blood "
            "cultures. No crystals are seen. Nucleic acid amplification from the cervix is "
            "positive for Neisseria gonorrhoeae. There is no preceding diarrheal illness, "
            "no keratoderma, and no uveitis. Which infection is this syndrome?"
        ),
        "question": "Which infection is this syndrome?",
        "options": [
            "Disseminated gonococcal infection",
            "Staphylococcus aureus septic arthritis",
            "Acute gout",
            "Calcium pyrophosphate deposition",
            "Reactive arthritis",
        ],
        "correctAnswer": "Disseminated gonococcal infection",
        "explanation": (
            "Disseminated gonococcal infection produces the triad of migratory "
            "polyarthralgia, tenosynovitis, and a sparse pustular rash, then a purulent "
            "joint. The synovial gram stain and culture are often negative, so the "
            "diagnosis rests on nucleic acid amplification from a mucosal site. "
            "Disseminated gonococcal infection is the syndrome. Staphylococcus aureus "
            "septic arthritis fails because staphylococcal septic arthritis usually shows "
            "gram-positive cocci in clusters and a positive joint culture, without this "
            "pustular tenosynovitis prodrome. Acute gout fails because gout puts negatively "
            "birefringent needles in the fluid, and no crystals were seen in this young "
            "patient. Calcium pyrophosphate deposition fails because pseudogout shows "
            "positively birefringent rhomboids and chondrocalcinosis in an older adult, not "
            "a cervical nucleic acid test positive for Neisseria gonorrhoeae. Reactive "
            "arthritis fails because reactive arthritis follows chlamydia or a diarrheal "
            "infection and may add uveitis, keratoderma, and circinate balanitis, while the "
            "mucosal test here specifically identifies Neisseria gonorrhoeae rather than a "
            "sterile post-infectious arthritis."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-049",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 10-year-old boy steps on a nail that passes through the sole of a rubber "
            "sneaker into the foot beneath the first metatarsal head. The wound is irrigated "
            "in an urgent-care clinic. Five days later the forefoot is swollen and warm, he "
            "is febrile, and the erythrocyte sedimentation rate and C-reactive protein are "
            "high. Magnetic resonance imaging shows osteomyelitis of the metatarsal head. He "
            "has no sickle cell disease, no cat or dog bite, and no rose-thorn exposure with "
            "ascending nodules. Which organism is classically inoculated by this mechanism?"
        ),
        "question": "Which organism is classically inoculated by this mechanism?",
        "options": [
            "Pseudomonas aeruginosa",
            "Staphylococcus aureus as the sneaker-specific organism",
            "Salmonella associated with sickle cell disease",
            "Pasteurella multocida",
            "Sporothrix schenckii",
        ],
        "correctAnswer": "Pseudomonas aeruginosa",
        "explanation": (
            "A puncture wound through the foam or rubber sole of a sneaker inoculates "
            "Pseudomonas aeruginosa into bone. The resulting osteomyelitis is the classic "
            "association of that mechanism, distinct from ordinary hematogenous "
            "staphylococcal osteomyelitis of the metaphysis. Pseudomonas aeruginosa is the "
            "organism. Staphylococcus aureus as the sneaker-specific organism fails because "
            "Staphylococcus aureus is the most common cause of osteomyelitis overall, but it "
            "is not the organism singled out by a nail through a sneaker. Salmonella "
            "associated with sickle cell disease fails because the Salmonella association is "
            "with infarcted bone in sickle cell disease, which this child does not have. "
            "Pasteurella multocida fails because Pasteurella is inoculated by cat and dog "
            "bites, not by a nail and a rubber sole. Sporothrix schenckii fails because "
            "sporotrichosis follows a thorn or splinter in a gardener and produces "
            "ascending lymphocutaneous nodules, not acute osteomyelitis of a metatarsal "
            "head after a sneaker puncture."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-050",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 13-year-old girl is sent for evaluation of scoliosis found at a school "
            "screening. The curve is a left thoracic curve of 28 degrees. Abdominal reflexes "
            "are absent on the left and present on the right. Limb proportions are normal, "
            "there is no frontal bossing, and there are no cafe-au-lait macules or axillary "
            "freckles. She has no calf enlargement, no Gowers sign, and no back pain. "
            "Strength is otherwise full. Which interpretation of this curve is required?"
        ),
        "question": "Which interpretation of this curve is required?",
        "options": [
            "Intraspinal pathology such as syringomyelia requiring MRI",
            "Typical idiopathic adolescent scoliosis without neurologic imaging",
            "Achondroplasia",
            "Duchenne muscular dystrophy",
            "Neurofibromatosis type 1 dystrophic scoliosis",
        ],
        "correctAnswer": "Intraspinal pathology such as syringomyelia requiring MRI",
        "explanation": (
            "Idiopathic adolescent scoliosis is typically a right thoracic curve in a child "
            "with a normal neurologic examination. A left thoracic curve is atypical, and "
            "asymmetric loss of abdominal reflexes is a sign of an intraspinal process such "
            "as syringomyelia, often with Chiari malformation. That combination requires "
            "magnetic resonance imaging rather than routine observation. Intraspinal "
            "pathology such as syringomyelia requiring MRI is the interpretation. Typical "
            "idiopathic adolescent scoliosis without neurologic imaging fails because the "
            "curve direction is left, not the usual right thoracic pattern, and the reflex "
            "asymmetry is a neurologic abnormality. Achondroplasia fails because "
            "achondroplasia is rhizomelic short-limb dwarfism with frontal bossing and "
            "spinal stenosis, and this girl's proportions and face are normal. Duchenne "
            "muscular dystrophy fails because Duchenne muscular dystrophy affects boys, "
            "with calf pseudohypertrophy, proximal weakness, and a long C-shaped "
            "neuromuscular curve, none of which are present. Neurofibromatosis type 1 "
            "dystrophic scoliosis fails because dystrophic curves are short and sharply "
            "angled and occur with cafe-au-lait macules, axillary freckling, or "
            "neurofibromas, which are absent."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-051",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 4-year-old child was a normal length at birth and has a normal face, without "
            "frontal bossing or midface hypoplasia. When walking began, a waddling gait, "
            "ligamentous laxity, and short limbs became obvious. Spine films show "
            "kyphoscoliosis. Radiographs show delayed, irregular epiphyses and flared "
            "metaphyses. There have been no recurrent fractures, the sclerae are white, the "
            "clavicles are present, and the fontanelles closed on time. Genetic testing "
            "identifies a pathogenic variant in COMP. Which diagnosis does the normal face "
            "plus this gene establish?"
        ),
        "question": "Which diagnosis does the normal face plus this gene establish?",
        "options": [
            "Pseudoachondroplasia",
            "Achondroplasia",
            "Thanatophoric dysplasia",
            "Osteogenesis imperfecta",
            "Cleidocranial dysostosis",
        ],
        "correctAnswer": "Pseudoachondroplasia",
        "explanation": (
            "Pseudoachondroplasia is caused by mutations in COMP, the gene for cartilage "
            "oligomeric matrix protein. Length is normal at birth, the face is normal, and "
            "short-limb disproportion, ligamentous laxity, kyphoscoliosis, and combined "
            "epiphyseal and metaphyseal dysplasia appear as the child begins to walk. The "
            "normal face is what excludes the more famous FGFR3 dwarfism. "
            "Pseudoachondroplasia is the diagnosis. Achondroplasia fails because "
            "achondroplasia is an FGFR3 disorder present at birth, with frontal bossing, "
            "midface hypoplasia, trident hands, foramen magnum stenosis, and lumbar "
            "stenosis, not a normal face and a COMP variant. Thanatophoric dysplasia fails "
            "because thanatophoric dysplasia is a lethal perinatal FGFR3 disorder with "
            "telephone-receiver femurs and a tiny chest, not a walking 4-year-old. "
            "Osteogenesis imperfecta fails because osteogenesis imperfecta is a type I "
            "collagen disease with fractures, often blue sclerae, and wormian bones, and "
            "the sclerae here are white with no fracture history. Cleidocranial dysostosis "
            "fails because cleidocranial dysostosis is a RUNX2 disorder with absent "
            "clavicles, delayed fontanelle closure, and extra teeth, and the clavicles and "
            "fontanelles here are normal."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-052",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 4,
        "scenario": (
            "A 12-year-old child has six cafe-au-lait macules larger than 5 mm, axillary "
            "freckling, and two cutaneous neurofibromas. The thoracic spine has a short, "
            "sharply angled scoliosis spanning four vertebrae, with penciling of the "
            "adjacent ribs on the concavity. There is no upward lens dislocation, no "
            "aortic-root dilation, no calf pseudohypertrophy, and no rhizomelic limb "
            "shortening. Which scoliosis pattern is this?"
        ),
        "question": "Which scoliosis pattern is this?",
        "options": [
            "Dystrophic scoliosis of neurofibromatosis type 1",
            "Idiopathic adolescent scoliosis",
            "Neuromuscular scoliosis of Duchenne muscular dystrophy",
            "Marfan syndrome",
            "Achondroplasia",
        ],
        "correctAnswer": "Dystrophic scoliosis of neurofibromatosis type 1",
        "explanation": (
            "Neurofibromatosis type 1, from loss of neurofibromin, produces cafe-au-lait "
            "macules, axillary freckling, and neurofibromas. Its dystrophic scoliosis is a "
            "short, sharply angled curve, often with vertebral scalloping and penciled ribs, "
            "and it behaves differently from a long idiopathic curve. Dystrophic scoliosis "
            "of neurofibromatosis type 1 is the pattern. Idiopathic adolescent scoliosis "
            "fails because idiopathic curves are longer, lack neurocutaneous findings, and "
            "do not pencil the ribs. Neuromuscular scoliosis of Duchenne muscular dystrophy "
            "fails because Duchenne muscular dystrophy causes calf pseudohypertrophy and "
            "proximal weakness in boys and a long C-shaped curve, without cafe-au-lait "
            "macules or neurofibromas. Marfan syndrome fails because Marfan syndrome is a "
            "fibrillin-1 disorder with upward ectopia lentis and aortic-root dilation, and "
            "those findings are absent; cafe-au-lait macules and neurofibromas are not part "
            "of Marfan syndrome. Achondroplasia fails because achondroplasia is rhizomelic "
            "dwarfism from FGFR3 with frontal bossing and spinal stenosis, not a short "
            "angular curve in a child with neurofibromas."
        ),
        "ref": "robbins-10",
    },
    {
        "id": "s1-msk-053",
        "exam": "USMLE Step 1",
        "stepLevel": "step1",
        "subjectId": "pathology",
        "blueprintDomain": "msk-skin",
        "taskCategory": "interpretation",
        "difficulty": 5,
        "scenario": (
            "A 70-year-old man says his hats no longer fit, and he has progressive hearing "
            "loss and aching in a bowed femur. Radiographs show cotton-wool sclerosis of the "
            "skull and a blade-of-grass lytic front advancing down the femur. Alkaline "
            "phosphatase is 860 U/L. Serum calcium, phosphate, and parathyroid hormone are "
            "normal. Hemoglobin is normal, there is no monoclonal protein, and a skull film "
            "does not show punched-out holes. Bone biopsy shows mosaic lamellar bone with "
            "irregular cement lines. Which disease does the isolated alkaline phosphatase "
            "elevation identify?"
        ),
        "question": "Which disease does the isolated alkaline phosphatase elevation identify?",
        "options": [
            "Paget disease of bone",
            "Osteomalacia",
            "Primary hyperparathyroidism",
            "Multiple myeloma",
            "Primary osteoporosis",
        ],
        "correctAnswer": "Paget disease of bone",
        "explanation": (
            "Paget disease passes through lytic, mixed, and sclerotic phases of chaotic "
            "remodeling. The laboratory signature is an isolated rise in alkaline "
            "phosphatase with normal calcium, phosphate, and parathyroid hormone. Enlarging "
            "hat size, hearing loss from bony compression of the eighth nerve, a blade-of-"
            "grass front, cotton-wool skull, and mosaic cement lines confirm it. Paget "
            "disease of bone is the disease. Osteomalacia fails because osteomalacia from "
            "vitamin D deficiency lowers calcium and phosphate, raises parathyroid hormone, "
            "and produces Looser zones rather than mosaic bone with a normal calcium. "
            "Primary hyperparathyroidism fails because primary hyperparathyroidism raises "
            "calcium and parathyroid hormone and causes subperiosteal bone resorption, not "
            "an isolated alkaline phosphatase rise with normal calcium. Multiple myeloma "
            "fails because myeloma keeps alkaline phosphatase normal, punches out cold lytic "
            "lesions, and adds anemia, hypercalcemia, and a monoclonal protein, all absent "
            "here. Primary osteoporosis fails because osteoporosis has normal calcium and a "
            "normal alkaline phosphatase, thins trabeculae without enlarging the skull, and "
            "does not produce mosaic cement lines or a blade-of-grass lytic front."
        ),
        "ref": "robbins-10",
    },
]

_TOPICS = {
    "s1-msk-001": "Teriparatide raises calcium and formation markers",
    "s1-msk-002": "Atypical femoral fracture on a bisphosphonate",
    "s1-msk-003": "Bisphosphonate blockade of osteoclast prenylation",
    "s1-msk-004": "Denosumab rebound after a missed dose",
    "s1-msk-005": "Hypocalcemia withholds denosumab",
    "s1-msk-006": "Teriparatide avoided in Paget disease",
    "s1-msk-007": "Raloxifene and prior venous thrombosis",
    "s1-msk-008": "Alendronate pill esophagitis",
    "s1-msk-009": "Colchicine toxicity with clarithromycin",
    "s1-msk-010": "HLA-B*5801 before allopurinol",
    "s1-msk-011": "Asymptomatic hyperuricemia is not treated",
    "s1-msk-012": "Low-dose allopurinol first in chronic kidney disease",
    "s1-msk-013": "Allopurinol and azathioprine marrow failure",
    "s1-msk-014": "Rasburicase hemolysis in G6PD deficiency",
    "s1-msk-015": "Xanthine oxidase inhibitor when uric acid stones exist",
    "s1-msk-016": "Positive birefringence despite needle shapes",
    "s1-msk-017": "Gout crystals do not exclude septic arthritis",
    "s1-msk-018": "Hemochromatosis with calcium pyrophosphate",
    "s1-msk-019": "Hydroxyapatite Milwaukee shoulder",
    "s1-msk-020": "Hyperparathyroidism driving pseudogout",
    "s1-msk-021": "Normal serum urate during a gout flare",
    "s1-msk-022": "Pemphigus fishnet immunofluorescence",
    "s1-msk-023": "Bullous pemphigoid on the salt-split roof",
    "s1-msk-024": "Dermatitis herpetiformis granular IgA",
    "s1-msk-025": "Staphylococcal scalded skin versus necrolysis",
    "s1-msk-026": "Upper trunk with spared rhomboids",
    "s1-msk-027": "Lower trunk with Horner syndrome",
    "s1-msk-028": "Spiral-groove radial nerve",
    "s1-msk-029": "Anterior interosseous nerve",
    "s1-msk-030": "Ulnar nerve in the Guyon canal",
    "s1-msk-031": "Common fibular nerve at the fibular neck",
    "s1-msk-032": "Lateral femoral cutaneous nerve",
    "s1-msk-033": "Anterior leg compartment",
    "s1-msk-034": "Median nerve inside the carpal tunnel",
    "s1-msk-035": "Axillary nerve after shoulder dislocation",
    "s1-msk-036": "Ewing sarcoma diaphysis and fusion",
    "s1-msk-037": "Osteoid osteoma nidus",
    "s1-msk-038": "Chondroblastoma with an open physis",
    "s1-msk-039": "Giant cell tumor after physeal closure",
    "s1-msk-040": "Thick cartilage cap on an osteochondroma",
    "s1-msk-041": "Myositis ossificans zoning",
    "s1-msk-042": "Unicameral bone cyst fallen fragment",
    "s1-msk-043": "Myeloma with a normal alkaline phosphatase",
    "s1-msk-044": "Rheumatoid pannus and marginal erosions",
    "s1-msk-045": "Osteoarthritis cartilage matrix loss",
    "s1-msk-046": "Methotrexate before a TNF inhibitor",
    "s1-msk-047": "Rheumatoid atlantoaxial instability",
    "s1-msk-048": "Disseminated gonococcal infection",
    "s1-msk-049": "Pseudomonas after a sneaker puncture",
    "s1-msk-050": "Left thoracic curve and syringomyelia",
    "s1-msk-051": "Pseudoachondroplasia versus achondroplasia",
    "s1-msk-052": "Neurofibromatosis dystrophic scoliosis",
    "s1-msk-053": "Paget disease isolated alkaline phosphatase",
}
for _row in ITEMS:
    _row["blueprintTopic"] = _TOPICS[_row["id"]]
