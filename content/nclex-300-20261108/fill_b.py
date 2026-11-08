"""Additional unique NCLEX items. Imported for side effects on make_items.ITEMS."""
from make_items import NCSBN, CDC, TJC, AHA, SSC, ADA, ISMP, CDC_VAX, mcq, bow, matrix, ordered, sata, case

R, C, J, H, S, D, I, V = [NCSBN], [CDC, NCSBN], [TJC, NCSBN], [AHA, NCSBN], [SSC, NCSBN], [ADA, NCSBN], [ISMP, NCSBN], [CDC_VAX, NCSBN]

def add(area, topic, diff, scenario, question, options, key, why, wrong, refs):
    mcq(area, topic, diff, scenario, question, options, key, why, wrong, refs)

# Precautions cluster
pairs = [
("measles","airborne infection isolation and a respirator for staff","a surgical mask in a shared room"),
("pulmonary tuberculosis","airborne infection isolation and a respirator for staff","droplet precautions with the door open"),
("chickenpox in a contagious rash","airborne and contact precautions","standard precautions only"),
("influenza","droplet precautions and a surgical mask","airborne isolation as the only requirement"),
("pertussis","droplet precautions","contact precautions only"),
("mumps","droplet precautions","protective environment only"),
("MRSA in an open wound","contact precautions with gown and gloves","a mask as the only addition"),
("scabies","contact precautions and treatment of close contacts","airborne isolation"),
("localized shingles in an intact immune client","standard precautions covering the lesions","airborne isolation for every staff member"),
("disseminated shingles","airborne and contact precautions","standard precautions only"),
]
for name, right, wrong in pairs:
    add("safety-infection", f"{name} precautions", 4,
        f"A client is admitted with confirmed {name}. The charge nurse is assigning the room and the protective equipment.",
        "Which precaution plan is appropriate?",
        [right, wrong, "No precautions if the client is afebrile", "A shared room with an immunocompromised roommate"],
        right,
        f"{name} has a specific transmission route, and the equipment has to match that route.",
        "The other plans use the wrong route or place a vulnerable roommate at risk.",
        C)

# Delegation cluster
deleg = [
("a stable client who needs a urine specimen collected from a hat","Collect the specimen","Start a blood transfusion"),
("a stable client who needs help ambulating in the hall with a walker the nurse already cleared","Walk with the client","Teach a new insulin injection"),
("a stable client who needs a bed bath","Give the bed bath","Perform the admission assessment"),
("a stable client who needs lunch set up","Set up the lunch tray","Give the IV push opioid"),
("a stable client who needs a fingerstick only if the assistive person is trained and the nurse follows the result","Obtain the fingerstick and report it","Adjust the insulin dose"),
("a stable client who needs oral care","Provide oral care","Titrate the heparin infusion"),
("a stable client who needs linen changed","Change the linen","Insert a urinary catheter"),
("a stable client who needs to be turned","Turn the client","Evaluate a new complaint of chest pain"),
]
for task, right, wrong in deleg:
    add("management-of-care", "delegate "+task[:40], 4,
        f"The nurse is dividing work. One task is {task}. An assistive person and an RN are available.",
        "Which statement is the correct assignment?",
        [f"The assistive person may {right.lower()} because the client is stable and the nurse remains accountable", f"The assistive person should {wrong.lower()}", "The assistive person may take the unstable client in the next bed too", "The nurse does not need to follow up"],
        f"The assistive person may {right.lower()} because the client is stable and the nurse remains accountable",
        "Stable hygiene, ambulation already cleared, and collection tasks can be delegated. The nurse still assesses and follows up.",
        f"{wrong} is a nursing judgment or an invasive or titrated therapy.",
        R)

# Priority cluster
prios = [
("a client with a blood pressure of 78/42 and new confusion","the hypotensive confused client","a client asking for a blanket"),
("a client whose surgical drain just filled with bright red blood","the client with sudden bright-red drain output","a client who wants the television fixed"),
("a client reporting a new severe headache after a fall","the client with the new severe headache","a client waiting for a discharge prescription"),
("a client with a glucose of 42 mg/dL who is sweaty","the sweaty client with glucose 42 mg/dL","a client asking about tomorrow's menu"),
("a client with a sudden drop in oxygen saturation to 84 percent","the client whose saturation fell to 84 percent","a client who needs a routine linen change"),
("a postpartum client who just said the uterus feels boggy and the pad is soaked","the client with a boggy uterus and a soaked pad","a client requesting a sleep medication"),
("a client with a new rash and wheezing after a first antibiotic dose","the client who is wheezing after the antibiotic","a client who wants help choosing a meal"),
("a client who is vomiting blood","the client vomiting blood","a client asking for an extra pillow"),
]
for scene, right, wrong in prios:
    add("management-of-care", "priority "+right[:36], 5,
        f"Two call lights go on. One is {scene}. The other is {wrong}.",
        "Whom does the nurse see first?",
        [right[0].upper()+right[1:], wrong[0].upper()+wrong[1:], "Whichever light was pressed first", "The client closest to the desk regardless of the symptom"],
        right[0].upper()+right[1:],
        "The first client has a change that can threaten airway, breathing, circulation, or bleeding.",
        "Routine comfort and the order of the call light do not outrank that change.",
        R)

# Basic care cluster
basic = [
("A client on aspiration precautions is being fed.","Sit the client upright and keep them up for at least 30 minutes after the meal","Feed the client lying flat to reduce energy use"),
("A client has a stage 1 pressure injury on the heel.","Float the heel off the bed and keep pressure off it","Massage the heel every hour"),
("A client with heart failure is short of breath in bed.","Raise the head of the bed and give the prescribed oxygen","Lay the client flat to improve venous return"),
("A client has not had a bowel movement in 4 days and is uncomfortable. The nurse has an order for a stool softener.","Give the stool softener and encourage fluid and mobility as allowed","Give a large-volume tap-water enema without an order"),
("A client with chronic pain rates pain 8 out of 10 and has a PRN analgesic available.","Give the analgesic and reassess the pain","Tell the client to wait until the pain is unbearable"),
("A client with a new hearing aid says it whistles.","Recheck the fit and the volume and look for earwax blocking the mold","Turn the aid to maximum so the whistle means it works"),
("A client learning crutches is shown a 3-point gait.","Teach the gait the therapist prescribed and keep a belt on during practice","Let the client hop without a belt to build confidence"),
("A client with urinary incontinence is embarrassed.","Start a timed voiding plan and protect the skin","Limit all fluids for the day"),
]
for scenario, right, wrong in basic:
    add("basic-care-comfort", scenario[:40], 4, scenario+" The nurse is choosing the care.",
        "Which action is appropriate?",
        [right, wrong, "Skip the care until the next shift", "Document that the client refused without asking"],
        right, "The action matches comfort and safety for this problem.",
        "The other choices increase injury, pain, or skin breakdown.", R)

print("fill_b", "ok")
