"""Nine items to close the Step 1 counts."""

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
    "reproductive-endocrine",
    "physiology",
    "Somogyi versus dawn",
    5,
    "A man with type 1 diabetes has high morning glucose. At 3 a.m. his glucose is 48 mg/dL and he wakes sweaty. A second patient has a 3 a.m. glucose of 160 mg/dL and a higher value at 7 a.m. A student raises the bedtime insulin for both.",
    "Who needs less night insulin, and who is showing a dawn rise?",
    [
        "The first has rebound hyperglycemia after nocturnal hypoglycemia, so night insulin should fall; the second has a dawn rise in counter-regulatory hormones and may need more basal insulin",
        "Both need a higher bedtime dose",
        "The 3 a.m. low means the dawn phenomenon and more insulin",
        "The 3 a.m. high means rebound from an unmeasured low",
        "Morning highs are always from too little dinner carbohydrate",
    ],
    "The first has rebound hyperglycemia after nocturnal hypoglycemia, so night insulin should fall; the second has a dawn rise in counter-regulatory hormones and may need more basal insulin",
    "The Somogyi effect is overnight hypoglycemia followed by counter-regulatory hormones that overshoot, so the morning glucose is high because the night dose was too strong. You lower it. The dawn phenomenon is an early-morning growth-hormone and cortisol rise with no preceding low, so basal insulin may need to go up. Raising both doses would worsen the first patient's nights. A 3 a.m. low is not the dawn phenomenon. A 3 a.m. high was never a hidden low. Dinner carbohydrate is not the separator these two clock times provide.",
    "ada-2026",
)

add(
    "multisystem",
    "pathology",
    "Hyper IgM class switch",
    5,
    "A boy has severe sinopulmonary infections and a low IgG and IgA with a high or normal IgM. He cannot make germinal centers. CD40 ligand is the protein under discussion. A student says he has Bruton disease because he is a boy with low immunoglobulin, and expects all isotypes including IgM to be absent.",
    "What interaction failed?",
    [
        "T-cell CD40 ligand cannot tell B cells to class-switch, so IgM stays and other isotypes do not appear",
        "Bruton tyrosine kinase is gone, so IgM is absent too",
        "The defect is neutrophil oxidase, so immunoglobulins are normal",
        "CD40 ligand excess causes the high IgM",
        "Class switching is a T-cell-independent event that does not need CD40",
    ],
    "T-cell CD40 ligand cannot tell B cells to class-switch, so IgM stays and other isotypes do not appear",
    "Hyper-IgM syndrome is often X-linked CD40 ligand deficiency. B cells can make IgM but cannot switch to IgG, IgA, or IgE, and germinal centers fail, so opportunistic infections occur as well as pyogenic ones. Bruton disease loses all B cells and all isotypes, including IgM. Chronic granulomatous disease is an oxidase defect with normal immunoglobulin amounts. The ligand is missing, not excessive. Class switch requires T-cell help through CD40; it is not purely T-independent.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Selective IgA deficiency",
    4,
    "A patient has recurrent sinus infections and a history of anaphylaxis during a blood transfusion. IgA is undetectable. IgG and IgM are normal. A student says he needs IVIG as the only replacement, and that the transfusion reaction was ABO incompatibility because he wheezed.",
    "Why the transfusion reaction?",
    [
        "He has made IgG against the IgA present in donor blood; IVIG also contains some IgA and is not a simple replacement",
        "IgA deficiency removes IgG as well",
        "ABO mismatch is the usual cause of anaphylaxis with a normal IgA",
        "IgM is the antibody that reacts to donor IgA",
        "Selective IgA deficiency presents with no infections",
    ],
    "He has made IgG against the IgA present in donor blood; IVIG also contains some IgA and is not a simple replacement",
    "The most common primary immunodeficiency is selective IgA deficiency. Mucosal infections and giardia are typical, and some patients form anti-IgA IgG. Donor blood contains IgA and can trigger anaphylaxis. Washed cells are used. Standard IVIG contains traces of IgA and can do the same, and it does not replace IgA at the mucosa anyway. Other isotypes are present, which is why it is selective. ABO hemolysis is fever, back pain, and hemoglobinuria, not isolated anaphylaxis with absent IgA. The pathogenic antibody is IgG against IgA, not IgM. Infections do occur.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Bruton agammaglobulinemia",
    4,
    "A boy is well for the first months of life and then has recurrent pneumonias and otitis after maternal antibody fades. B cells are absent. Tonsils are tiny. T cells are present. A sister is healthy. A student expects viral and fungal infections as the dominant problem and a low T-cell count.",
    "Which kinase, and which infections?",
    [
        "Bruton tyrosine kinase blocks B-cell maturation; pyogenic bacteria dominate after maternal IgG wanes, and T-cell infections are not the lead",
        "Adenosine deaminase, so T and B cells are both absent from birth",
        "Fungal disease is the classic Bruton infection",
        "Tonsils are enlarged",
        "The disease is autosomal and his sister should be equally affected",
    ],
    "Bruton tyrosine kinase blocks B-cell maturation; pyogenic bacteria dominate after maternal IgG wanes, and T-cell infections are not the lead",
    "X-linked agammaglobulinemia is a block from pro-B to pre-B cell because Bruton tyrosine kinase is gone. There are no B cells, no tonsils, and no immunoglobulin of his own. Maternal IgG protects early, then bacteria with capsules take over. T cells work, so viruses and fungi are not the signature the way they are in SCID. ADA deficiency empties T and B cells. Fungal disease points away from a pure B-cell defect. Tonsils are absent, not big. A healthy sister fits X-linked inheritance.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Chediak-Higashi",
    4,
    "A child has recurrent pyogenic infections, partial albinism, and giant granules in neutrophils. Platelets do not function well and he bruises. A student calls it chronic granulomatous disease because of the infections, and expects a normal burst test to be the only abnormality, with no pigment finding.",
    "What trafficking step failed?",
    [
        "Microtubule polymerization and lysosomal trafficking fail, so granules are giant and melanosomes and neutrophil granules do not deliver; the oxidative burst itself can be present",
        "NADPH oxidase is absent, so albinism is required",
        "CD18 is absent, so there is no pus and the granules are normal size",
        "Giant granules mean the cells kill bacteria better",
        "Albinism here is oculocutaneous albinism type 1 with a normal immune system",
    ],
    "Microtubule polymerization and lysosomal trafficking fail, so granules are giant and melanosomes and neutrophil granules do not deliver; the oxidative burst itself can be present",
    "Chediak-Higashi is LYST dysfunction. Secretory lysosomes, melanosomes, and neutrophil granules do not traffic, so partial albinism, giant granules, infections, and a bleeding platelet defect travel together. A later accelerated phase looks like hemophagocytosis. CGD is the oxidase, without this pigment and granule picture. Leukocyte adhesion deficiency has no pus and normal-sized granules. The granules do not improve killing; they fail to deliver. Ordinary albinism does not fill neutrophils with giant granules.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Job syndrome",
    5,
    "A child has coarse facies, retained baby teeth, recurrent staphylococcal abscesses that are oddly cold, eczema, and a very high IgE. Eosinophils are up. A student says the abscesses are cold because the bacteria are dead, and that IgE this high means acute allergy only.",
    "Which cytokine signal failed, and why are the abscesses cold?",
    [
        "STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses lack the usual heat; IgE is markedly high",
        "NADPH oxidase has failed",
        "The cold abscess means good neutrophil recruitment",
        "IgE is low in this syndrome",
        "Retained teeth are unrelated to the immune defect",
    ],
    "STAT3 and Th17 signaling fail, so neutrophil recruitment is poor and staphylococcal abscesses lack the usual heat; IgE is markedly high",
    "Hyper-IgE syndrome is STAT3. Th17 cells do not form, IL-17 does not call neutrophils properly, and staphylococcal abscesses are 'cold.' IgE and eosinophils are high, eczema is present, and nonimmune connective-tissue findings include retained primary teeth, coarse face, and fractures. This is not the oxidase defect of CGD. Cold means poor inflammation, not better recruitment. IgE is high, which is the name of the syndrome. The dental finding is part of the STAT3 phenotype, not a coincidence.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Wiskott-Aldrich",
    5,
    "A boy has eczema, thrombocytopenia with small platelets, and recurrent infections. IgM is low and IgA and IgE are high. A maternal uncle died of bleeding and infection. A student says the platelets are large, as in Bernard-Soulier, and that the inheritance is autosomal.",
    "What cytoskeletal link failed, and what do the platelets look like?",
    [
        "WASP, which links receptors to the actin cytoskeleton, is gone; platelets are small, and the triad is eczema, microthrombocytopenia, and infections",
        "Platelets are giant and the gene is autosomal",
        "IgM is high and IgE is low",
        "The disease is pure B-cell failure without a bleeding problem",
        "A healthy maternal uncle would be the expected family pattern",
    ],
    "WASP, which links receptors to the actin cytoskeleton, is gone; platelets are small, and the triad is eczema, microthrombocytopenia, and infections",
    "Wiskott-Aldrich is X-linked WASP. Actin remodeling fails in immune synapses and platelets. The classic triad is eczema, thrombocytopenia with small platelets, and infections, with low IgM and high IgA and IgE, and a risk of lymphoma. Bernard-Soulier platelets are giant. IgM is low, not high. Bleeding is part of the disease, not absent. Diseased uncles on the mother's side fit X-linkage; a healthy one would not be the teaching family.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Delayed hemolytic transfusion",
    4,
    "A woman who was transfused years ago during a pregnancy gets a unit of blood. She is fine that day. A week later her hemoglobin has fallen, the bilirubin is up, and the direct antiglobulin test is positive. She did not have fever and back pain during the transfusion. A student calls it acute ABO hemolysis because any post-transfusion anemia is immediate complement lysis.",
    "What kind of antibody returned?",
    [
        "An anamnestic IgG against a minor red-cell antigen, too low to detect on the crossmatch, rose over days and caused extravascular hemolysis",
        "ABO IgM, which always waits a week",
        "TRALI, because the hemoglobin fell",
        "The crossmatch would have been incompatible if any antibody memory existed",
        "A positive direct antiglobulin test a week later means the unit was never given",
    ],
    "An anamnestic IgG against a minor red-cell antigen, too low to detect on the crossmatch, rose over days and caused extravascular hemolysis",
    "Delayed hemolytic reactions are memory IgG against antigens such as Kidd or Duffy. The titer was below detection at the crossmatch, exposure boosts it, and days later coated cells are removed outside the vessels. It is not the immediate intravascular ABO disaster. ABO IgM acts in minutes. TRALI is pulmonary edema, not a falling hemoglobin with a positive Coombs test. A negative crossmatch does not prove there was never any memory; the antibody can be below the threshold. The positive direct antiglobulin test is the coated donor cells still circulating.",
    "robbins-10",
)

add(
    "multisystem",
    "pathology",
    "Graft versus host",
    4,
    "A man two weeks after an allogeneic marrow transplant has a rash on the palms and soles, diarrhea, and a rising bilirubin. The donor cells are attacking. A student says this is host-versus-graft rejection of the marrow, and that the skin, gut, and liver are spared in graft-versus-host disease.",
    "Which direction is the attack?",
    [
        "Donor T cells recognize host tissues; skin, gut, and liver are the targets of acute graft-versus-host disease",
        "The host immune system is rejecting the graft, which is why the rash is host-versus-graft",
        "Graft-versus-host disease spares the liver",
        "The reaction is antibody against neutrophils only",
        "Palms and soles are spared, so this rash is not graft-versus-host",
    ],
    "Donor T cells recognize host tissues; skin, gut, and liver are the targets of acute graft-versus-host disease",
    "In graft-versus-host disease the transplanted immune system attacks the immunosuppressed host. Acute disease hits skin (often palms and soles), the gut (diarrhea), and the liver (bilirubin). Host-versus-graft is rejection of the organ, the opposite arrow, and would look like loss of the graft rather than this triad. The liver is a classic target. This is T-cell mediated tissue injury, not isolated antineutrophil antibody. Palm and sole involvement is typical, not a reason to exclude the diagnosis.",
    "robbins-10",
)
