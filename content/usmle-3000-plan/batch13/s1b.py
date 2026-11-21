"""Step 1 items 11-45."""

from lib import item

FDA = "FDA prescribing information, 2024 labels, for the named drug's mechanism."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step1", **k)

ITEMS = []

def add(n, **k):
    ITEMS.append(Q(n, **k))

add(11, sex="m", system="blood-lymph-immune", weight=11, topic="g6pd", diff=3, subject="pharmacology",
  takeaway="Primaquine and dapsone can hemolyze red cells that lack glucose-6-phosphate dehydrogenase. The bite cells appear after the oxidative drug.",
  citation=FDA,
  scenario="A 30-year-old man starts primaquine. Three days later hemoglobin falls from 14 to 9 g/dL. The smear shows bite cells. He had been well before the first dose.",
  question="Which red-cell pathway failed?",
  correct=W("The pentose-phosphate pathway, so oxidative drug stress hemolyzed the cells",
            "Primaquine and dapsone can hemolyze red cells that lack glucose-6-phosphate dehydrogenase. The bite cells appear after the oxidative drug. The pathway normally regenerates glutathione. Without it, the drug's oxidant stress bursts the cells."),
  wrongs=[
    W("Sickle polymerization, because every hemolysis is sickle cell", "Bite cells after this drug are oxidative, not sickle forms."),
    W("Spectrin deficiency as the drug's target", "Spectrin is hereditary spherocytosis, not this drug effect."),
    W("Iron loss in the urine as the only mechanism", "The smear shows damaged cells, not simple iron lack."),
    W("Folate trapping", "Folate deficiency does not make bite cells in three days."),
  ])

add(12, sex="f", system="blood-lymph-immune", weight=11, topic="spherocytosis", diff=2, subject="pathology",
  takeaway="Hereditary spherocytosis is a membrane-cytoskeleton defect. Splenectomy stops the hemolysis because the spleen is what removes the spheres.",
  citation="Standard hematology correlation in Williams Hematology, current teaching consistent with ASH review material, 2021.",
  scenario="A 22-year-old woman has anemia, a high bilirubin, spherocytes, and a family history of the same. Her spleen is enlarged. A classmate says the liver is making the spheres and the spleen is incidental.",
  question="Why does removing the spleen stop the hemolysis?",
  correct=W("The spleen is the filter that destroys the poorly deformable spheres",
            "Hereditary spherocytosis is a membrane-cytoskeleton defect. Splenectomy stops the hemolysis because the spleen is what removes the spheres. The liver did not create the shape. The membrane protein did."),
  wrongs=[
    W("The spleen produces the abnormal spectrin", "Spectrin is a red-cell protein, not a spleen product."),
    W("Splenectomy replaces the missing enzyme in the pentose pathway", "That enzyme defect is a different hemolysis."),
    W("The spheres are parasites that only live in the spleen", "The cells are her own red cells."),
    W("Bilirubin is made in the spleen, so removal cures the anemia by stopping bilirubin", "Bilirubin is a result of hemolysis, not the cause of the anemia."),
  ])

add(13, sex="m", system="blood-lymph-immune", weight=11, topic="sickle-hydroxyurea", diff=2, subject="pharmacology",
  takeaway="Hydroxyurea raises fetal hemoglobin, which slows polymerization of sickle hemoglobin.",
  citation=FDA,
  scenario="A 19-year-old man with sickle cell disease starts hydroxyurea after repeated pain crises. Fetal hemoglobin later rises from 4 percent to 15 percent. Crisis frequency falls.",
  question="Which hemoglobin change explains the fewer crises?",
  correct=W("More fetal hemoglobin, which interferes with polymer formation",
            "Hydroxyurea raises fetal hemoglobin, which slows polymerization of sickle hemoglobin. The rise from 4 to 15 percent is the therapeutic change. The drug is not a painkiller. It changes the hemoglobin mix."),
  wrongs=[
    W("More hemoglobin S, which is less likely to polymerize", "Hemoglobin S is what polymerizes. The drug does not increase it as the benefit."),
    W("Less fetal hemoglobin, so cells become larger", "Fetal hemoglobin went up, not down."),
    W("Direct dissolution of existing polymers in the spleen", "The benefit is fewer new polymers because of fetal hemoglobin."),
    W("Iron chelation", "Hydroxyurea is not a chelator."),
  ])

add(14, sex="f", system="blood-lymph-immune", weight=11, topic="itp-antibody", diff=2, subject="pathology",
  takeaway="Immune thrombocytopenia is caused by antibodies against platelet glycoproteins, so platelets are destroyed and production can be impaired.",
  citation="ASH 2019 guidelines for immune thrombocytopenia, describing the antibody-mediated mechanism.",
  scenario="A 28-year-old woman has petechiae and platelets of 14,000. Hemoglobin and leukocytes are normal. The smear shows large platelets and no schistocytes.",
  question="What is the immune target?",
  correct=W("Platelet glycoproteins, such as IIb/IIIa",
            "Immune thrombocytopenia is caused by antibodies against platelet glycoproteins, so platelets are destroyed and production can be impaired. The other lines are normal, which argues against marrow failure. No schistocytes argues against microangiopathy."),
  wrongs=[
    W("ADAMTS13, as in thrombotic thrombocytopenic purpura", "That disease shows schistocytes, which are absent."),
    W("Factor VIII", "Factor VIII deficiency causes joint bleeding, not isolated thrombocytopenia."),
    W("Red-cell spectrin", "Spectrin disease is a hemolytic anemia."),
    W("The heparin-platelet factor 4 complex", "There is no heparin exposure in this vignette."),
  ])

add(15, sex="m", system="blood-lymph-immune", weight=11, topic="ttp", diff=3, subject="pathology",
  takeaway="Thrombotic thrombocytopenic purpura is a deficiency of ADAMTS13, so huge von Willebrand multimers make platelet thrombi. Platelet transfusion is not the treatment of the count.",
  citation="ISTH guidance on thrombotic thrombocytopenic purpura, 2020.",
  scenario="A 35-year-old man has platelets of 15,000, schistocytes, creatinine 2.1 mg/dL, and confusion. Coagulation times are normal. A classmate orders platelets to 50,000 as the only therapy.",
  question="Which protein is missing, and why are platelets alone the wrong plan?",
  correct=W("ADAMTS13 is missing. Plasma exchange, not platelet transfusion, is the disease treatment",
            "Thrombotic thrombocytopenic purpura is a deficiency of ADAMTS13, so huge von Willebrand multimers make platelet thrombi. Platelet transfusion is not the treatment of the count. Normal coagulation times separate this from disseminated intravascular coagulation. Transfusing platelets can feed the thrombi."),
  wrongs=[
    W("Factor VIII is missing, so platelets are the replacement", "Coagulation times would be abnormal in a factor deficiency of that size, and the smear would not show schistocytes as the main clue."),
    W("Spectrin is missing, so splenectomy tonight is the only care", "Spherocytes, not schistocytes and confusion, mark that disease."),
    W("ADAMTS13 is high, so more platelets are required to match it", "The enzyme is deficient, not high."),
    W("Immunoglobulin against glycoproteins, treated only by transfusion", "That is immune thrombocytopenia, which lacks schistocytes and organ failure."),
  ])

add(16, sex="m", system="blood-lymph-immune", weight=11, topic="hemophilia", diff=2, subject="pathology",
  takeaway="Hemophilia A is factor VIII deficiency. Bleeding into a joint with a prolonged PTT and a normal PT fits that factor, not platelets.",
  citation="NHF MASAC recommendations and standard coagulation teaching, 2020.",
  scenario="A 16-year-old boy has a swollen knee after a small twist. PT is normal, PTT is prolonged, and platelets are 250,000. He has had similar joint bleeds.",
  question="Which factor is missing?",
  correct=W("Factor VIII",
            "Hemophilia A is factor VIII deficiency. Bleeding into a joint with a prolonged PTT and a normal PT fits that factor, not platelets. Platelets are normal, so this is not a platelet-count problem. Factor VII would prolong the PT."),
  wrongs=[
    W("Factor VII", "Factor VII prolongs the PT, which is normal here."),
    W("von Willebrand factor as the only possibility", "That disease usually affects platelet function and is not limited to this PTT pattern in the same way, and the joint-bleed story in a boy is classic hemophilia."),
    W("Platelets, because the knee is a platelet-type bleed", "The platelet count is 250,000."),
    W("Fibrinogen, because every hemarthrosis is low fibrinogen", "Fibrinogen deficiency disturbs both PT and PTT more broadly."),
  ])

add(17, sex="f", system="blood-lymph-immune", weight=11, topic="cml", diff=2, subject="pharmacology",
  takeaway="Imatinib inhibits the BCR-ABL tyrosine kinase made by the Philadelphia chromosome.",
  citation=FDA,
  scenario="A 54-year-old woman has a very high leukocyte count, a left shift, and a low leukocyte alkaline phosphatase. Cytogenetics show a 9;22 translocation. She starts imatinib.",
  question="What does imatinib inhibit?",
  correct=W("The BCR-ABL kinase produced by the 9;22 fusion",
            "Imatinib inhibits the BCR-ABL tyrosine kinase made by the Philadelphia chromosome. The 9;22 translocation is that fusion. The drug is not a general alkylator. It targets the fusion kinase."),
  wrongs=[
    W("The retinoic-acid receptor of acute promyelocytic leukemia", "That receptor is a different disease and a different drug."),
    W("Dihydrofolate reductase", "That is the methotrexate target."),
    W("The proteasome", "That is a different targeted drug class."),
    W("Topoisomerase II as its only target", "Imatinib is a kinase inhibitor, not a topoisomerase poison."),
  ])

add(18, sex="m", system="blood-lymph-immune", weight=11, topic="aml", diff=2, subject="pathology",
  takeaway="Auer rods are crystalline cytoplasmic inclusions in myeloid blasts and mark acute myeloid leukemia, not acute lymphoblastic leukemia.",
  citation="WHO classification of haematolymphoid tumours, 5th edition, 2022.",
  scenario="A 48-year-old man has anemia, low platelets, and circulating blasts. Several blasts contain needle-shaped cytoplasmic rods. A classmate calls the rods lymphoblasts.",
  question="What do the rods identify?",
  correct=W("Myeloid blasts, so this is acute myeloid leukemia",
            "Auer rods are crystalline cytoplasmic inclusions in myeloid blasts and mark acute myeloid leukemia, not acute lymphoblastic leukemia. Lymphoblasts do not make Auer rods. The rods are fused granules."),
  wrongs=[
    W("Lymphoblasts, so this is acute lymphoblastic leukemia", "Lymphoblasts do not contain Auer rods."),
    W("Plasma cells", "Plasma cells do not make these rods."),
    W("Sickled red cells", "The rods are inside blasts, not red cells."),
    W("Fungi, so start amphotericin before any leukemia therapy", "The rods are a cellular inclusion, not organisms."),
  ])

add(19, sex="m", system="blood-lymph-immune", weight=11, topic="tumor-lysis", diff=3, subject="pharmacology",
  takeaway="Rasburicase breaks down existing uric acid. Allopurinol only decreases formation of new uric acid.",
  citation=FDA,
  scenario="A 17-year-old boy with a new bulky lymphoma has uric acid 14 mg/dL, potassium 6.1 mEq/L, and phosphorus 8 mg/dL before chemotherapy. A classmate says allopurinol will rapidly destroy the uric acid already present.",
  question="Which drug lowers uric acid that is already in the blood?",
  correct=W("Rasburicase, because it oxidizes existing uric acid",
            "Rasburicase breaks down existing uric acid. Allopurinol only decreases formation of new uric acid. A level of 14 with a high potassium and phosphorus is established tumor lysis. Blocking xanthine oxidase does not clear what is already there."),
  wrongs=[
    W("Allopurinol, because it dissolves existing crystals within an hour", "Allopurinol prevents new production. It does not break down the current pool."),
    W("Furosemide as a uricase", "A loop diuretic is not a uric-acid enzyme."),
    W("Hydroxyurea, because it raises fetal hemoglobin and lowers uric acid", "Fetal hemoglobin is irrelevant to this uric acid."),
    W("No drug can lower uric acid once it exceeds 10", "Rasburicase is used for that situation."),
  ])

add(20, sex="f", system="gastrointestinal", weight=8, topic="wilson", diff=3, subject="pathology",
  takeaway="Wilson disease is low ceruloplasmin with copper deposition in liver and basal ganglia. Psychiatric change plus liver disease in a young adult is the clue.",
  citation="AASLD guidance on Wilson disease, 2022.",
  scenario="A 19-year-old woman has a new tremor, falling grades, and an ALT of 210 U/L. Ceruloplasmin is low. Slit-lamp exam is planned. A classmate calls this ordinary adolescent depression.",
  question="Which metal is being stored?",
  correct=W("Copper, because ceruloplasmin is low and the liver and brain are both involved",
            "Wilson disease is low ceruloplasmin with copper deposition in liver and basal ganglia. Psychiatric change plus liver disease in a young adult is the clue. Iron overload would not drop ceruloplasmin. Depression alone does not raise ALT to 210."),
  wrongs=[
    W("Iron, because every liver-and-brain illness is hemochromatosis", "Hemochromatosis is iron and does not lower ceruloplasmin."),
    W("Lead, because tremor means lead", "Lead does not lower ceruloplasmin or cause this hepatitis pattern."),
    W("No metal. The low ceruloplasmin is a lab curiosity", "Low ceruloplasmin is the transport clue for copper."),
    W("Zinc excess as the primary disease", "Zinc is a treatment, not the stored metal."),
  ])
