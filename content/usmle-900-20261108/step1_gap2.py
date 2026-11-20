"""Remaining Step 1 endocrine and multisystem items, plus one musculoskeletal item."""

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
    "msk-skin", "anatomy", "Median nerve hand of benediction",
    4,
    "A man tries to make a fist and the index and middle fingers stay extended while the ring and little fingers flex. Sensation is reduced on the palmar thumb, index, and middle fingers. The injury is at the elbow, not the wrist. A student calls it an ulnar claw because the hand looks abnormal.",
    "Which nerve, and why is the elbow level important?",
    [
        "The median nerve, which supplies the forearm finger flexors to digits 2 and 3; an ulnar claw is the opposite posture and is worse when the ulnar nerve fails more proximally for different muscles",
        "The ulnar nerve, because digits 4 and 5 are the ones that stay extended",
        "The radial nerve, because extended fingers mean wrist extensors",
        "A wrist-level median injury produces the same loss of finger flexion",
        "Benediction on attempting a fist is the resting claw of an ulnar palsy",
    ],
    "The median nerve, which supplies the forearm finger flexors to digits 2 and 3; an ulnar claw is the opposite posture and is worse when the ulnar nerve fails more proximally for different muscles",
    "When the median nerve is out at the elbow, flexor digitorum superficialis and the median half of profundus are weak, so the patient cannot flex digits 2 and 3 when asked to make a fist. That active posture is the 'hand of benediction.' An ulnar claw is a resting posture of digits 4 and 5 from lost intrinsics, and those fingers are the ones that still flexed here. The radial nerve extends the wrist and MCP joints; it is not this sensory pattern. At the wrist the median nerve has already given off the forearm flexors, so a carpal-tunnel lesion does not block finger flexion. The test was an attempted fist, not the resting ulnar claw.",
    "guyton-14",
)

# 20 reproductive/endocrine
ENDO = []

def E(topic, diff, scenario, question, options, key, expl, ref="guyton-14", subject="physiology"):
    add("reproductive-endocrine", subject, topic, diff, scenario, question, options, key, expl, ref)

E(
    "Glucokinase versus hexokinase",
    4,
    "A student is asked why the liver can take up glucose only when the blood level is high after a meal, while muscle and brain phosphorylate glucose even when the level is low. She says both tissues use the same hexokinase with the same Km. A rare mutation of the beta-cell glucose sensor causes mild fasting hyperglycemia inherited from one parent.",
    "Which enzyme is the high-Km sensor?",
    [
        "Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate, so it works when glucose is high; hexokinase has a low Km and is product-inhibited",
        "Hexokinase is the high-Km liver enzyme",
        "Glucokinase is switched off by insulin",
        "A glucokinase mutation lowers fasting glucose",
        "Brain hexokinase stops working at normal glucose so the brain depends on glucokinase",
    ],
    "Glucokinase in liver and beta cells has a high Km and is not inhibited by glucose-6-phosphate, so it works when glucose is high; hexokinase has a low Km and is product-inhibited",
    "Glucokinase (hexokinase IV) is the liver and beta-cell enzyme. Its high Km means it is active when glucose is abundant after a meal, and product inhibition does not shut it off, so the liver can keep taking glucose up to store glycogen. Hexokinase in muscle and brain has a low Km, works at fasting glucose, and is inhibited by glucose-6-phosphate. Calling them the same enzyme misses the sensor role. Glucokinase is induced in the fed state; it is not turned off by insulin. Heterozygous glucokinase mutations cause stable mild hyperglycemia (MODY2), not hypoglycemia. The brain relies on low-Km hexokinase so it is fed at ordinary glucose levels.",
)

E(
    "PFK-1 and fructose-2,6-bisphosphate",
    5,
    "In the fed state, fructose-2,6-bisphosphate is high in the liver and glycolysis runs. In fasting, glucagon raises cAMP and the bifunctional enzyme switches. A student says fructose-2,6-bisphosphate inhibits PFK-1, and that glucagon increases glycolysis.",
    "What does fructose-2,6-bisphosphate do to PFK-1, and what does glucagon do to it?",
    [
        "It activates PFK-1, pushing glycolysis; glucagon, via phosphorylation of the bifunctional enzyme, lowers fructose-2,6-bisphosphate so gluconeogenesis can proceed",
        "It inhibits PFK-1, so the fed state is gluconeogenesis",
        "Glucagon raises fructose-2,6-bisphosphate",
        "PFK-1 is the gluconeogenic enzyme that makes glucose from lactate",
        "The bifunctional enzyme is only in muscle, so the liver does not switch",
    ],
    "It activates PFK-1, pushing glycolysis; glucagon, via phosphorylation of the bifunctional enzyme, lowers fructose-2,6-bisphosphate so gluconeogenesis can proceed",
    "Fructose-2,6-bisphosphate is the feed-forward activator of phosphofructokinase-1, the committed step of glycolysis, and it inhibits fructose-1,6-bisphosphatase. In the fed state insulin favors the kinase half of PFK-2 and the activator rises. Glucagon phosphorylates the bifunctional enzyme, the phosphatase half wins, the activator falls, and the liver makes glucose. The student reversed both arrows. PFK-1 is glycolytic, not the enzyme that releases free glucose. The liver is exactly where this switch matters for blood glucose; muscle PFK-2 is regulated differently and does not run gluconeogenesis.",
)

E(
    "Pyruvate dehydrogenase cofactors",
    4,
    "A man with alcohol use disorder is given glucose and becomes confused with lactic acidosis and a low transketolase activity that corrects when a cofactor is added. Pyruvate is high. A student replaces biotin because carboxylases use it, and another gives riboflavin only.",
    "Which cofactor is missing for both pyruvate dehydrogenase and transketolase?",
    [
        "Thiamine pyrophosphate; without it pyruvate cannot enter the TCA cycle and the pentose pathway's transketolase fails",
        "Biotin, the cofactor for pyruvate dehydrogenase",
        "Cobalamin, which is required for the decarboxylation of pyruvate",
        "Pyridoxine, the cofactor that adds the acetyl group to coenzyme A",
        "Glucose loading is safe before this vitamin because the enzymes do not use it",
    ],
    "Thiamine pyrophosphate; without it pyruvate cannot enter the TCA cycle and the pentose pathway's transketolase fails",
    "Pyruvate dehydrogenase needs thiamine, lipoic acid, CoA, FAD, and NAD. Thiamine deficiency blocks pyruvate entry, lactate rises, and transketolase in the pentose pathway is the lab that improves when thiamine is added. Biotin is for carboxylases such as pyruvate carboxylase, not the dehydrogenase. B12 is for methylmalonyl-CoA mutase and methionine synthase. Pyridoxine is transamination. Giving glucose before thiamine drives the blocked enzyme and can precipitate Wernicke injury.",
    "katzung-16",
)

E(
    "Insulin versus glucagon fasting",
    4,
    "After 24 hours without food, a healthy student's insulin is low and glucagon is high. The liver is exporting glucose and making ketones. Muscle is using fatty acids. A classmate says the brain is using fatty acids directly and that insulin should be high because starvation is a stress.",
    "What does the liver export, and what can the brain use?",
    [
        "The liver releases glucose from glycogen and gluconeogenesis and exports ketone bodies; the brain uses glucose and, later, ketones, not free fatty acids",
        "Muscle glycogen keeps the blood glucose normal for days",
        "High insulin in fasting drives ketogenesis",
        "Fatty acids cross the blood-brain barrier as the main fuel on day one",
        "Glucagon stores glycogen",
    ],
    "The liver releases glucose from glycogen and gluconeogenesis and exports ketone bodies; the brain uses glucose and, later, ketones, not free fatty acids",
    "Low insulin and high glucagon turn on hepatic glycogenolysis, gluconeogenesis, and ketogenesis. Muscle glycogen is for the muscle; it does not maintain blood glucose because muscle lacks glucose-6-phosphatase. Fatty acids are a fuel for muscle but do not meaningfully feed the brain. Ketones do. Insulin is low in fasting; high insulin would suppress ketogenesis and is the fed state. Glucagon promotes glycogen breakdown, not storage.",
)

E(
    "Cori cycle",
    4,
    "During a sprint, muscle makes lactate. The liver turns that lactate back into glucose and sends it out. A student says the muscle itself runs gluconeogenesis and that the liver makes lactate as its main export during a sprint.",
    "Which tissue releases lactate, and which makes the glucose?",
    [
        "Muscle (and red cells) release lactate; the liver uses lactate for gluconeogenesis, the Cori cycle",
        "The liver releases lactate and muscle makes glucose",
        "Lactate is a dead-end that cannot re-enter metabolism",
        "Gluconeogenesis in muscle supplies the blood glucose of a sprint",
        "The cycle costs no ATP, so it is free energy",
    ],
    "Muscle (and red cells) release lactate; the liver uses lactate for gluconeogenesis, the Cori cycle",
    "Anaerobic glycolysis in muscle ends at lactate. The liver, which has the gluconeogenic enzymes including glucose-6-phosphatase, rebuilds glucose and returns it. Muscle cannot release free glucose. Lactate is a substrate, not a dead end. Assigning gluconeogenesis to muscle is the trap. The cycle costs ATP in the liver, which is why it shifts the energy burden off the exercising muscle rather than creating free energy.",
)

E(
    "HMG-CoA reductase regulation",
    4,
    "A man on a statin has less endogenous cholesterol made in the liver. LDL receptors on the liver increase. A student says statins block absorption of dietary cholesterol in the gut, and that less intracellular cholesterol would decrease LDL receptors.",
    "What enzyme is blocked, and why do LDL receptors rise?",
    [
        "HMG-CoA reductase is blocked; the hepatocyte senses less cholesterol and puts more LDL receptors on the surface, clearing LDL from blood",
        "Statins inhibit PCSK9 as their only action",
        "Blocking the reductase raises intracellular cholesterol",
        "LDL receptors fall when synthesis is blocked, so blood LDL rises",
        "The enzyme blocked is lipoprotein lipase",
    ],
    "HMG-CoA reductase is blocked; the hepatocyte senses less cholesterol and puts more LDL receptors on the surface, clearing LDL from blood",
    "The committed step of cholesterol synthesis is HMG-CoA reductase. Statins inhibit it. Lower cholesterol in the liver cell activates SREBP, which increases LDL-receptor expression, and blood LDL falls. That is not a block of intestinal absorption (ezetimibe) and not a direct PCSK9 inhibitor, although low cholesterol biology intersects that pathway. Synthesis falls, so intracellular cholesterol falls, it does not rise. Fewer receptors would raise blood LDL, the opposite of the drug's effect. Lipoprotein lipase clears chylomicrons and VLDL triglycerides.",
    "katzung-16",
)

E(
    "Familial hypercholesterolemia",
    4,
    "A 12-year-old has tendon xanthomas and an LDL cholesterol of 420 mg/dL. A parent had a heart attack at 40. Triglycerides are normal. A student calls it familial chylomicronemia because the number is high, and expects pancreatitis rather than coronary disease as the childhood emergency.",
    "What is missing, and which lipid is high?",
    [
        "LDL receptors are absent or defective, so LDL cannot be cleared; triglycerides are not the particle in trouble",
        "Lipoprotein lipase is missing, so chylomicrons cause pancreatitis",
        "HDL is the particle that is markedly high",
        "Tendon xanthomas are the sign of low LDL",
        "The inheritance is autosomal recessive only, so a parent should be unaffected",
    ],
    "LDL receptors are absent or defective, so LDL cannot be cleared; triglycerides are not the particle in trouble",
    "Familial hypercholesterolemia is LDL-receptor (or apoB, or PCSK9) disease. LDL stays in the blood, tendons collect cholesterol, and coronary disease comes early. Heterozygotes already have very high LDL; homozygotes are worse. Chylomicronemia is lipoprotein lipase or apoC-II deficiency: sky-high triglycerides, pancreatitis, and eruptive xanthomas, not this LDL number with normal triglycerides. HDL is not the elevated particle. Xanthomas mean cholesterol is high. A parent with early disease fits dominant inheritance.",
    "robbins-10",
)

E(
    "Ketone use",
    4,
    "On day three of a fast, a student's brain is using ketone bodies. The liver is making them but a biopsy discussion says the liver cannot oxidize them for its own ATP in the same way. A student says the liver lacks HMG-CoA synthase, which is why ketones are made in muscle.",
    "Why can the liver not consume the ketones it exports?",
    [
        "The liver lacks thiophorase (succinyl-CoA:acetoacetate CoA transferase), so it cannot turn acetoacetate into acetoacetyl-CoA",
        "The liver lacks HMG-CoA synthase, so it cannot make ketones",
        "Muscle is the only tissue that makes ketone bodies",
        "The brain cannot use ketones at any time",
        "Ketogenesis is turned on by insulin",
    ],
    "The liver lacks thiophorase (succinyl-CoA:acetoacetate CoA transferase), so it cannot turn acetoacetate into acetoacetyl-CoA",
    "Hepatocytes make acetoacetate and beta-hydroxybutyrate from HMG-CoA and export them. They lack the transferase that other tissues use to activate acetoacetate, so the liver does not burn its own ketones. HMG-CoA synthase is present in liver mitochondria and is required to make ketones; saying the liver lacks it reverses production and consumption. Muscle uses ketones and fatty acids; it is not the factory. After a couple of days the brain does use ketones, which spares glucose. Ketogenesis is a low-insulin, high-glucagon state.",
)

E(
    "Carnitine deficiency hypoglycemia",
    5,
    "A child has hypoketotic hypoglycemia when ill, elevated CK, and low free carnitine. Medium-chain fats are tolerated better than long-chain fats. A student gives him a high long-chain fat diet because fats are the treatment for a fasting problem, and says ketones should be high if hypoglycemia is real.",
    "Why are ketones low, and why are long-chain fats the wrong meal?",
    [
        "Long-chain fatty acids cannot enter mitochondria without carnitine, so the liver cannot make ketones and the muscle cannot oxidize fat; medium chains bypass the shuttle",
        "High ketones are required to diagnose a fatty-acid oxidation defect",
        "Carnitine carries glucose, so low carnitine blocks glycolysis only",
        "A high long-chain fat load restocks carnitine",
        "Medium-chain fats need more carnitine than palmitate",
    ],
    "Long-chain fatty acids cannot enter mitochondria without carnitine, so the liver cannot make ketones and the muscle cannot oxidize fat; medium chains bypass the shuttle",
    "Carnitine is required for the shuttle of long-chain acyl groups. Without it, beta oxidation fails, ketones are not made, glucose is the only fuel and runs out, and muscle is weak. That is hypoketotic hypoglycemia, the opposite of a high-ketone diabetic state. Carnitine does not carry glucose. Eating more long-chain fat gives substrate he cannot oxidize. Medium-chain fatty acids enter mitochondria without the carnitine shuttle, which is why they are the fat that is tolerated.",
)

E(
    "MCAD deficiency",
    5,
    "A toddler who had a viral illness and stopped eating is found lethargic. Glucose is 30 mg/dL, urine ketones are absent, and the acylcarnitine profile shows medium-chain species. He had seemed well between illnesses. A student treats this as ordinary diabetic ketoacidosis because the child is ill and hypoglycemic.",
    "What cannot be oxidized, and why is the illness the trigger?",
    [
        "Medium-chain acyl-CoA dehydrogenase is missing, so medium-chain fats stall and ketones are not made when fasting removes carbohydrate",
        "Insulin is high, as in diabetic ketoacidosis, and ketones should be large",
        "The defect appears only after a high-carbohydrate meal",
        "MCAD deficiency raises ketones higher than DKA",
        "Between illnesses he should be chronically hypoglycemic every hour",
    ],
    "Medium-chain acyl-CoA dehydrogenase is missing, so medium-chain fats stall and ketones are not made when fasting removes carbohydrate",
    "MCAD deficiency blocks beta oxidation in the middle of the chain. When an illness stops feeding, hepatic ketogenesis fails and glucose falls without ketones, which can cause sudden death. Diabetic ketoacidosis has high ketones and, usually, high glucose. The danger is fasting, not a carbohydrate load. Ketones are inappropriately low, not higher than DKA. Between fasts he can look well, which is why the newborn screen and the illness history matter.",
    "robbins-10",
)

E(
    "Urea cycle CPS1 versus OTC",
    4,
    "Two infants have high ammonia and low BUN after protein feeds. Infant A has low orotic acid. Infant B, a boy, has high orotic acid and no megaloblastic anemia. A student treats both as orotic aciduria with uridine and says the urea cycle is intact because orotic acid is a pyrimidine.",
    "Which enzyme is out in the boy?",
    [
        "Ornithine transcarbamylase; carbamoyl phosphate spills into orotic acid. Infant A is earlier, carbamoyl phosphate synthetase I, so orotic acid is not made",
        "Both lack orotidine decarboxylase, the megaloblastic disease",
        "Arginase deficiency raises orotic acid and BUN",
        "OTC deficiency lowers orotic acid",
        "Uridine monotherapy clears the ammonia in OTC deficiency",
    ],
    "Ornithine transcarbamylase; carbamoyl phosphate spills into orotic acid. Infant A is earlier, carbamoyl phosphate synthetase I, so orotic acid is not made",
    "If carbamoyl phosphate is made but cannot enter the urea cycle at OTC, it leaks into pyrimidine synthesis and orotic acid rises, with hyperammonemia and no megaloblastic anemia. If CPS-I itself fails, carbamoyl phosphate is not made, so orotic acid stays low and ammonia still rises. Hereditary orotic aciduria is a later pyrimidine-synthesis defect with megaloblastic anemia and no ammonia storm. Arginase is the last urea-cycle step and does not present this way with a high BUN; BUN is low when the cycle is blocked. OTC deficiency raises, not lowers, orotic acid. Uridine does not fix the ammonia.",
)

E(
    "Porphyria acute",
    5,
    "A woman is given a barbiturate for a procedure and then has abdominal pain, dark urine, and weakness in the arms. Hyponatremia is present. Porphobilinogen is high in the urine. A student calls it lead poisoning because both affect heme, and offers a sulfonamide as a safe extra drug.",
    "Which enzyme is low, and why did the barbiturate trigger the attack?",
    [
        "Porphobilinogen deaminase is low in acute intermittent porphyria; CYP inducers increase ALA synthase and flood the pathway proximal to the block",
        "Ferrochelatase is the enzyme of acute intermittent porphyria, and the urine is red from lead",
        "Barbiturates inhibit ALA synthase, so they treat the attack",
        "Sulfonamides are safe because they do not induce hepatic ALA synthase",
        "Photosensitivity is required for acute intermittent porphyria",
    ],
    "Porphobilinogen deaminase is low in acute intermittent porphyria; CYP inducers increase ALA synthase and flood the pathway proximal to the block",
    "Acute intermittent porphyria is a partial block of porphobilinogen deaminase. Inducers of hepatic ALA synthase, such as barbiturates, push more substrate into the pathway, ALA and PBG rise, and the attack is abdominal pain, neuropsychiatric change, and a motor neuropathy, often with SIADH. Lead inhibits ferrochelatase and ALA dehydratase and causes a different, chronic picture with anemia and stippling. Barbiturates worsen, not treat, the attack. Sulfonamides are also inducers and are avoided. Acute intermittent porphyria does not make the skin-photosensitizing porphyrins; that is a later-pathway porphyria.",
    "katzung-16",
)

E(
    "CAH nonclassic",
    4,
    "A young woman has hirsutism, acne, and irregular menses. 17-hydroxyprogesterone rises high after cosyntropin. Blood pressure and potassium are normal. She was not a salt-wasting infant. A student diagnoses an androgen-secreting tumor because hair is male-pattern, and expects a suppressed 17-hydroxyprogesterone.",
    "What is partially blocked?",
    [
        "21-hydroxylase is partially deficient, so ACTH drives 17-hydroxyprogesterone and androgens without frank salt wasting",
        "11-beta hydroxylase, because she is normotensive",
        "An adrenal adenoma, which raises 17-hydroxyprogesterone after ACTH as its classic test",
        "Aromatase excess, which virilizes",
        "Complete 21-hydroxylase deficiency, which presents as an adult with normal infancy",
    ],
    "21-hydroxylase is partially deficient, so ACTH drives 17-hydroxyprogesterone and androgens without frank salt wasting",
    "Nonclassic congenital adrenal hyperplasia is a milder 21-hydroxylase defect. Cortisol is almost adequate, aldosterone holds, and the backed-up 17-hydroxyprogesterone and androgens cause a PCOS-like picture. The ACTH stimulation test unmasks the marker. An androgen tumor would not give this enzyme-specific rise in 17-hydroxyprogesterone. 11-beta deficiency tends to raise blood pressure via DOC. Aromatase excess would increase estrogen, not androgens. Complete salt-wasting disease presents in infancy, not as a normotensive adult.",
)

E(
    "Aromatase deficiency",
    5,
    "A pregnant woman virilizes in the third trimester. The baby is a 46,XX infant with ambiguous genitalia. Later the child is tall with delayed bone age closure and has no breast development at puberty, and FSH is high. A student calls this androgen insensitivity because androgens seem high.",
    "What cannot be made, and why did the mother virilize?",
    [
        "Estrogen cannot be made from androgens; fetal androgens spill into the mother, the XX fetus is virilized, and puberty cannot grow breasts or close plates",
        "Androgen receptors are absent, so an XX infant virilizes",
        "5-alpha reductase is absent in an XX fetus",
        "The mother has a luteoma that makes estrogen, which virilizes",
        "Bone age advances rapidly because estrogen is the hormone that keeps plates open",
    ],
    "Estrogen cannot be made from androgens; fetal androgens spill into the mother, the XX fetus is virilized, and puberty cannot grow breasts or close plates",
    "Aromatase converts androgens to estrogens in the placenta and the ovary. Without it, androgens accumulate, the mother virilizes during pregnancy, and a genetic female is born virilized. At puberty there is no estrogen to develop breasts or to fuse epiphyses, so she is tall, and gonadotropins rise. Androgen insensitivity is an XY individual who looks female. 5-alpha reductase deficiency is an XY fetus. A luteoma can virilize a mother but does not delete the child's aromatase for life. Estrogen closes growth plates; its absence delays fusion.",
    "langman-embryo",
)

E(
    "Progesterone challenge",
    4,
    "A woman with amenorrhea has a normal FSH, a normal prolactin, and bleeds after a short course of progesterone. A student says she has no uterus, and another says her estrogen is low because she bled.",
    "What did the bleed prove?",
    [
        "The uterus is present and has been primed by estrogen; progesterone withdrawal shed the lining, so the amenorrhea is anovulation, not an absent uterus",
        "Bleeding after progesterone means estrogen was absent",
        "A bleed proves she is pregnant",
        "FSH must be high if she bleeds",
        "An absent uterus still bleeds when progesterone is given",
    ],
    "The uterus is present and has been primed by estrogen; progesterone withdrawal shed the lining, so the amenorrhea is anovulation, not an absent uterus",
    "A progesterone challenge works only if endometrium exists and estrogen has proliferated it. Withdrawal bleeding means both. The missing piece is ovulation and a corpus luteum, the common PCOS pattern, not Müllerian agenesis. Bleeding means estrogen was present, not absent. It is not a pregnancy test. FSH is not driven up by a withdrawal bleed. No uterus, no bleed.",
)

E(
    "hCG and TSH",
    5,
    "A woman with hyperemesis at 10 weeks has a low TSH, a slightly high free T4, and no goiter or eye disease. hCG is very high. A student starts methimazole for Graves disease and plans a year of treatment. Antibodies to the TSH receptor are negative.",
    "Why is the TSH low?",
    [
        "hCG weakly stimulates the TSH receptor in early pregnancy; this gestational thyrotoxicosis is transient and is not Graves disease",
        "She has Graves disease because any low TSH in pregnancy is antibody-driven",
        "Methimazole is required for the entire pregnancy when hCG is the stimulus",
        "hCG suppresses the thyroid directly, so T4 should be low",
        "Negative TSH-receptor antibodies confirm Graves disease",
    ],
    "hCG weakly stimulates the TSH receptor in early pregnancy; this gestational thyrotoxicosis is transient and is not Graves disease",
    "The alpha subunit of hCG resembles TSH. Very high hCG, as in hyperemesis or twins or a molar pregnancy, can raise thyroid hormone a little and suppress TSH. There are no eye findings and no stimulating antibody. It settles as hCG falls. Treating it as Graves disease with a year of methimazole exposes the fetus without a Graves diagnosis. hCG stimulates, it does not suppress, the gland, which is why T4 is up. Negative antibodies argue against Graves disease, they do not confirm it.",
    "ata-hyper-2016",
)

E(
    "Wolff-Chaikoff",
    4,
    "A man is given a large iodine load before an imaging study. For a short time his thyroid hormone production falls, then it escapes. A student says iodine always increases hormone synthesis in proportion to the dose, and that escape means the gland was destroyed.",
    "What happened?",
    [
        "Excess iodide transiently inhibits organification, the Wolff-Chaikoff effect, and a healthy gland then escapes; failure to escape can cause hypothyroidism where iodine is suddenly high",
        "Iodide only increases synthesis, with no inhibitory concentration",
        "Escape means permanent ablation",
        "The effect is due to TSH-receptor antibodies",
        "Organification is stimulated by a huge iodine load",
    ],
    "Excess iodide transiently inhibits organification, the Wolff-Chaikoff effect, and a healthy gland then escapes; failure to escape can cause hypothyroidism where iodine is suddenly high",
    "A large iodide load blocks organification of iodine for a time. The gland then downregulates the iodide trap and escapes, and synthesis resumes. People with underlying thyroid disease may not escape and become hypothyroid, which is why amiodarone and contrast matter. More iodine is not linearly more hormone. Escape is recovery of synthesis, not destruction. Antibodies are Graves disease, not this pharmacologic effect. The point of the effect is inhibition of organification, not stimulation.",
    "ata-hyper-2016",
)

E(
    "Sick euthyroid",
    4,
    "A man in the intensive care unit has a low T3, a high reverse T3, a normal or low T4, and a TSH that is not high. He has no goiter. A student starts levothyroxine because any low T3 is hypothyroidism, and he expects a high TSH.",
    "What conversion changed?",
    [
        "Peripheral deiodinase shifts T4 toward reverse T3 instead of T3 during illness; the TSH is not elevated, so this is not primary hypothyroidism",
        "Primary hypothyroidism, because T3 is low and TSH should be ignored",
        "Reverse T3 is the active hormone, so a high level means hyperthyroidism",
        "Levothyroxine is required to correct reverse T3 in the ICU",
        "A high TSH is part of the sick-euthyroid pattern",
    ],
    "Peripheral deiodinase shifts T4 toward reverse T3 instead of T3 during illness; the TSH is not elevated, so this is not primary hypothyroidism",
    "In nonthyroidal illness, less T4 is converted to active T3 and more becomes inactive reverse T3. The pituitary is not driving a high TSH the way it does in primary hypothyroidism. Treating the number with levothyroxine is not the fix; the illness is. Reverse T3 is inactive. The pattern is an adaptive lab change, not a prescription. A high TSH would suggest real primary hypothyroidism and is not the usual sick-euthyroid picture.",
    "guyton-14",
)

E(
    "Congenital adrenal rest",
    4,
    "A newborn girl has ambiguous genitalia. 17-hydroxyprogesterone is extremely high. Blood pressure is low and potassium is high on day 10. A student says the karyotype must be 46,XY because she is virilized, and that she has too much aromatase.",
    "What is the karyotype likely to be, and why?",
    [
        "46,XX; excess adrenal androgens from 21-hydroxylase deficiency virilized a genetic female, and salt wasting shows aldosterone also failed",
        "46,XY with androgen insensitivity, which virilizes the external genitalia",
        "46,XX with aromatase excess, which makes androgens",
        "46,XY with 5-alpha reductase deficiency, which causes salt wasting",
        "A high 17-hydroxyprogesterone means an ovarian tumor in a neonate",
    ],
    "46,XX; excess adrenal androgens from 21-hydroxylase deficiency virilized a genetic female, and salt wasting shows aldosterone also failed",
    "A genetic female exposed to adrenal androgens in utero is virilized, and a sky-high 17-hydroxyprogesterone is 21-hydroxylase deficiency. Salt wasting and hyperkalemia mean the aldosterone path failed too. Androgen insensitivity is an XY baby who looks female, the opposite ambiguity. Aromatase excess would push toward estrogen. 5-alpha reductase deficiency is an under-virilized XY infant and does not waste salt. Neonates do not present with ovarian tumors that make this marker.",
)

E(
    "Sheehan syndrome",
    5,
    "A woman hemorrhaged at delivery and could not lactate. Months later she is fatigued, her periods have not returned, and she has lost axillary hair. Sodium is a bit low. ACTH and TSH are low, and cortisol is low. A student diagnoses primary adrenal failure because cortisol is low, and expects dark skin.",
    "Why is she pale rather than pigmented, and why no milk?",
    [
        "Pituitary infarction removed ACTH, TSH, and prolactin; low ACTH means no pigmentation, and no prolactin means no lactation",
        "Primary adrenal failure, which darkens the skin and raises ACTH",
        "She has Graves disease because TSH is low",
        "Prolactin is high after pituitary infarction, so lactation should be excessive",
        "The thyroid is primarily destroyed, so TSH is high",
    ],
    "Pituitary infarction removed ACTH, TSH, and prolactin; low ACTH means no pigmentation, and no prolactin means no lactation",
    "Sheehan syndrome is ischemic necrosis of an enlarged postpartum pituitary. Failure to lactate is the prolactin clue. Low ACTH causes secondary adrenal insufficiency without hyperpigmentation, because POMC products are low. TSH is low and the thyroid fails secondarily. Primary adrenal failure would raise ACTH and darken the skin, and aldosterone loss would be more prominent. A low TSH with a low free hormone is central, not Graves disease, which has a high hormone. Prolactin is lost, not high. Primary hypothyroidism would raise TSH.",
)
