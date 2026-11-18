# Biostatistics and reading the literature

> **Study aid only.** This is the largest single MCQ range on Step 3, about 11–13%. It is also a Day 1 competency. The vocabulary is the same as the Step 1 chapter. The items are abstracts, ads, and “what do you tell the patient.”

## What this chapter covers

How to read a stem that is a paper, and how to say the result in absolute terms. You do not need a new formula list. You need the habit of asking “of whom” and “did a person feel this, or did a lab move.”

## The framework

Read in this order. What was the question. Who was studied. What was done. What happened to patients. How sure is the estimate. Who paid for it, and does that change the outcome they chose.

| They give you | You say |
| --- | --- |
| Sensitivity and specificity | Properties of the test. They do not depend on prevalence. |
| Predictive values | They do depend on prevalence. A positive test in a rare disease is usually a false positive. |
| Relative risk | Cohort. Incidence exposed over incidence unexposed. |
| Odds ratio | Case-control, or a logistic model. Not an incidence. |
| Absolute risk reduction | The difference a person can understand. Number needed to treat is 1 divided by that difference. |
| Confidence interval crossing 1 (for a ratio) or 0 (for a difference) | The result has not excluded “no effect.” |
| A tiny p value and a tiny effect | Statistically detectable. Maybe not worth the harm. |
| A negative small trial | Uninformative if it was underpowered. Not proof of safety. |
| Surrogate outcome (a lab, a plaque) | Not a stroke or a death until someone shows it tracks one. |
| Lead-time or length-time bias | Screening looks better than it is. |
| Intention to treat | Keeps people in the group they were assigned to. Per-protocol flatters the drug. |

Drug ads in the stem are biased teachers. Look for the comparator (placebo versus the real alternative), the outcome (a scale versus a hospitalization), and the harm column, which is often in the footnote. A “50% reduction” from 2% to 1% is one person in a hundred.

Diagnosis items that use a test ask whether the test changes management. A test that cannot move you off the treatment you were going to give is not the next step. That is practice-based learning wearing a calculator.

## High-yield atlas

Biostatistics is the largest single MCQ range on Step 3, about 11 to 13 percent, and it is a Day 1 habit. Read a stem that is a paper in this order: the question, who was studied, what was done, what happened to patients, how sure the estimate is, and who paid. The arithmetic below uses hypothetical numbers. They are teaching examples. They are not results of a named trial.

### A 2-by-2 that does not move when the town changes

Sensitivity and specificity are properties of the test. They do not care how rare the disease is. Predictive values do. Build the table before you speak.

|  | Disease | No disease |
| --- | --- | --- |
| Positive test | 90 | 10 |
| Negative test | 10 | 890 |

Sensitivity is 90 of 100 people with disease, 90 percent. Specificity is 890 of 900 people without disease, about 99 percent. In this town the disease is common enough that a positive test is right 90 of 100 times. Move to a town where only 10 people have the disease and the same test still finds 9 of them, but the false positives, at a 1 percent false-positive rate among 990 well people, are about 10. Positive predictive value falls to 9 of 19. The test did not get worse. The town got rarer.

**Vignette.** A screening test is 99 percent sensitive and 95 percent specific. A speaker says that a positive test in a rare disease is therefore almost certainly a true case.
**Reasoning.** Specificity of 95 percent means 5 false positives per 100 well people. If the disease is rare, those false positives outnumber the true cases. The diagnosis the speaker skipped is a low positive predictive value. The trap is equating specificity with “a positive test means you have it.”
**NBME trap.** They change the prevalence and claim the sensitivity changed. Sensitivity stays. The predictive value moves.
**Hook.** Sensitivity lives in the disease column. Predictive value lives in the town.
**CCS.** You will not order a test on CCS that cannot change the next order. The same idea is this table in prose.

### Risk, odds, and the headline that says “half”

A hypothetical trial: 2 heart attacks per 100 people on placebo, 1 per 100 on the drug. Absolute risk reduction is 1 per 100. Relative risk is 1/2, so the relative reduction is half. Number needed to treat is 1 divided by the absolute reduction, which is 100. The headline “cuts events in half” is true and is the wrong sentence to lead with. Tell the person: about one in a hundred is spared an event, and ninety-nine take the drug without that benefit.

Number needed to harm is the same arithmetic on a bad outcome. If a hypothetical adverse event rises from 1 per 100 to 3 per 100, the absolute increase is 2 per 100 and the number needed to harm is 50. Put the two numbers in the same conversation.

Odds are not risks. A case-control study cannot hand you an incidence. It can hand you an odds ratio. A cohort, or a trial, can hand you a risk. Do not call an odds ratio a relative risk unless the outcome is rare and you have said why the approximation is close.

**Vignette.** An advertisement says “50 percent reduction” and the table shows 2 per 100 versus 1 per 100. The patient asks if half of people are saved.
**Reasoning.** No. One person in a hundred is the absolute difference. The diagnosis of the error is relative-risk counseling. The trap is repeating the headline because the arithmetic of “half” felt simple.
**NBME trap.** They compute number needed to treat as 1 divided by the relative risk. It is 1 divided by the absolute difference. Here that is 100, not 2.
**Hook.** Half of a small number is still a small number. Say the small number.

### Intervals, p values, and a small trial that proved nothing

A confidence interval that crosses 1 for a ratio, or 0 for a difference, has not excluded “no effect.” A hypothetical small trial reports a relative risk of 0.6 with an interval from 0.2 to 1.8 and a p value of 0.22. That interval includes a large benefit and a large harm. The trial was too small to answer the question. It did not prove the treatment is useless. Absence of evidence is not evidence of absence.

A huge trial can find a tiny effect with a p value under the conventional 0.05 and an interval that excludes the null. That result is statistically detectable. It may still not be worth the harm. The cutoff 0.05 is a convention. It is not clinical importance.

Type I error is calling an effect real when it is not. Type II error is missing an effect that is there. Power is the chance of finding an effect of a stated size if it exists. A negative trial with no power calculation is uninformative, not reassuring.

**Vignette.** A 40-person trial of a supplement shows no significant difference in strokes. The interval runs from a large benefit to a large harm. A blog says the supplement is proven safe.
**Reasoning.** The trial could not see a meaningful effect. Safety is not established. The diagnosis is an underpowered negative study. The trap is “p greater than 0.05” read as “no effect” and as “no harm.”
**NBME trap.** They see p = 0.04 on a surrogate lab and tell the patient the drug prevents strokes. A lab is not a stroke. Statistical significance does not pick the outcome.
**Hook.** A wide interval is an unanswered question. A tiny p on a tiny effect is a different disappointment.

### Intention to treat, surrogates, and bias that makes screening look kind

Intention to treat keeps people in the group they were assigned to, whether they took the drug or not. Per-protocol analysis keeps only the people who complied. It flatters the drug. If a stem offers both and the per-protocol result is prettier, the intention-to-treat result is the one that respects the assignment.

A surrogate outcome is a lab, a plaque, or a pressure. A patient-important outcome is a stroke, a death, a hospitalization, or a day the person can feel. Do not tell a patient the lab change prevents an event the trial did not count.

Lead-time bias: screening finds the disease earlier, so survival from diagnosis looks longer even if the date of death does not move. Length-time bias: screening finds the slow, pleasant diseases and misses the ones that kill between screens. Both make a screening program look better than it is. A randomized trial of screening, with death as the outcome, is the design that can escape them. A survival curve that starts at diagnosis cannot.

Confounding is a third variable that is associated with the exposure and the outcome. Randomization handles confounding in expectation. It does not fix a bad outcome choice, a tiny sample, or a lost cohort. Recall bias lives in case-control studies when people who got sick remember exposures more vividly. Observer bias lives where the person who knows the assignment also judges a soft outcome. Blinding is the remedy for that one.

**Vignette.** A screening program boasts that five-year survival after diagnosis rose from 50 percent to 90 percent. Deaths per 100,000 people did not change.
**Reasoning.** Earlier diagnosis without later death is lead time. The diagnosis of the error is lead-time bias. The trap is adopting the program because survival from diagnosis improved.
**NBME trap.** They call a per-protocol analysis “more accurate” because it includes only people who took the drug. It answers a different question and it flatters.
**Hook.** Survival from the day you found it can be a trick. Deaths in the population are harder to trick.

### Grades, and a test that cannot change the order

USPSTF grade A or B: offer the service. Grade C: selective. Grade D: recommend against. Grade I: the evidence was not enough. Do not sell an I statement as a mandate, and do not sell a D as a controversy you can ignore. The screening ages in the prevention chapter are the A and B services. An I statement about the same disease in an older or younger band is not a secret yes.

A test that cannot move you off the treatment you were already going to give is not the next step. That is practice-based learning wearing a calculator. On CCS, do not order a send-out test while an unstable person waits for a drug you already know they need.

**Vignette.** A guideline gives an I statement for a supplement in healthy adults. A clinic posts that the task force “recommends” it.
**Reasoning.** I means insufficient. The diagnosis of the error is selling an I statement as a grade A. The trap is treating “we do not know” as “you should.”
**NBME trap.** They withhold a grade A service because a different age band has an I statement. Read the age in the stem against the age in the recommendation.
**Hook.** A and B you offer. D you do not. I you do not pretend.

### Reading the drug ad in the stem

Look for the comparator. Placebo is not the real alternative if a real alternative exists. Look for the outcome. A scale is not a hospitalization. Look for the harm column, which is often in the footnote. Then do the absolute arithmetic from the table, not from the headline. Funding is a reason to look harder at the outcome the authors chose. It does not invent a confidence interval, and it does not let you discard a well-run trial automatically.

Hazard ratios are rate ratios over time. They are not risk differences. A hazard ratio of 0.5 does not mean half the people were saved. You still need the absolute rates.

**Vignette.** A hazard ratio is 0.5 with an interval from 0.4 to 0.7. The control event rate is 2 per 1,000 per year. The speaker says half of patients are saved.
**Reasoning.** The relative rate is half. The absolute rate difference is about 1 per 1,000 per year. Number needed to treat for one year is about 1,000. The diagnosis of the error is a hazard ratio spoken as an absolute cure rate.
**NBME trap.** They treat a hazard ratio whose interval crosses 1 as a proven benefit because the point estimate was 0.7. The interval is the sentence. The point estimate is the middle of it.
**Hook.** A ratio without a baseline rate is not a counseling sentence.

### Diagnosis arithmetic you should be able to say out loud

Likelihood ratios connect a test result to the odds of disease. A useful positive likelihood ratio is high. A useful negative one is a small fraction. You do not need a nomogram on Step 3 as often as you need the direction: a result that barely moves the odds was not worth drawing if the next decision was already made.

A gold standard that is itself messy makes sensitivity and specificity messy. Spectrum bias makes a test look better in a study of very sick versus very well people than it will look in the office, where everyone is in the middle. That is why a test validated in the intensive care unit disappoints in clinic.

**Vignette.** A new blood test for a cancer was studied in people with advanced disease and in healthy students. Sensitivity and specificity are both beautiful. The clinic is full of tired middle-aged adults with vague symptoms.
**Reasoning.** The study population is not the clinic. The diagnosis of the error is spectrum bias. The trap is adopting the test because the abstract’s percentages were high.
**NBME trap.** They increase the cutoff to raise specificity and then claim sensitivity is unchanged. Moving a cutoff trades one for the other.
**Hook.** A test proven on the extremes will look worse in the middle, where you actually work.

### What to say to the person

Use absolute numbers. Say who was studied, because a trial of men over 70 does not automatically govern a woman of 40. Say the harm you saw in the table. Say what the trial did not measure. Offer the grade A service. Decline to sell the I statement. If the stem is a CCS case, order the test that changes today’s drug, and do not order a panel that would not change it.

## Sources for this atlas

Source: Standard evidence-based medicine. Every trial number in this chapter is hypothetical and is labeled as such. Do not cite these tables as published results.

Source: [USPSTF grade definitions](https://www.uspreventiveservicestaskforce.org/uspstf/about-uspstf/methods-and-processes/grade-definitions). A and B are offers. D is a recommendation against. I is not a mandate.

Source: [Step 3 content outline](https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-specifications). Biostatistics and epidemiology are about 11–13 percent of the MCQs.

## Worked set

Do these without looking up. The numbers are hypothetical.

**Vignette.** 80 people with disease test positive and 20 test negative. 100 people without disease test positive and 800 test negative.
**Reasoning.** Sensitivity is 80/100 = 80 percent. Specificity is 800/900, about 89 percent. Positive predictive value is 80/180, about 44 percent. The town is not rare, and the positive predictive value is still under half because specificity is only modest. The trap is calling the positive predictive value 80 percent because that was the sensitivity.
**Hook.** The positive row is the predictive value. The disease column is the sensitivity.

**Vignette.** A drug lowers a laboratory value. Strokes were not counted. The p value is 0.001.
**Reasoning.** This is a precise effect on a surrogate. You cannot tell the patient the drug prevents strokes. The trap is the tiny p value doing the counseling.
**Hook.** A lab is a lab until a trial counts the event the patient fears.

**Vignette.** Control event rate 10 per 100. Drug event rate 5 per 100. The harm, a bleed, rises from 1 per 100 to 4 per 100.
**Reasoning.** Absolute benefit 5 per 100, number needed to treat 20. Absolute harm 3 per 100, number needed to harm about 33. You can say both sentences. The trap is quoting only the relative reduction of half.
**Hook.** Benefit and harm get the same arithmetic. Then the person chooses.

**Vignette.** A case-control study of a rare cancer reports an odds ratio of 3. A reporter calls it “triple the incidence.”
**Reasoning.** A case-control study did not measure incidence. The odds ratio is not a risk you can turn into “triple the cases per year” without more information. The trap is the word triple.
**Hook.** No cohort, no incidence. Say odds.

**Vignette.** Assigned to drug: 200 people, including 40 who never filled it. The analysis drops those 40 and the benefit grows.
**Reasoning.** That is per protocol. Intention to treat keeps the 40. The prettier number is the flattered one. The trap is calling the dropouts “nonresponders you may ignore.”
**Hook.** Assignment is the group. Compliance is a different question.

**Vignette.** Screening finds cancers at a smaller size. Survival from the day of the scan is longer. Mortality in the county is unchanged.
**Reasoning.** Lead time, and possibly length time. The trap is a public campaign based on survival from diagnosis.
**Hook.** Earlier labels are not later deaths.

**Vignette.** A confidence interval for a difference in blood pressure is from −2 mm Hg to +6 mm Hg. The authors say the drug “did not affect pressure, so it is equivalent.”
**Reasoning.** The interval includes no change and also includes a 6 mm Hg rise. Equivalence was not shown. A trial shows equivalence only when the whole interval sits inside a margin someone defined beforehand. The trap is a nonsignificant p value spoken as proof of sameness.
**Hook.** “Not significant” is not “the same.”

**Vignette.** The task force gives a D recommendation for a screening test in asymptomatic adults. A specialist society likes the test.
**Reasoning.** For the exam’s preventive-services answer, the D means do not offer it as a screen. A specialist problem in a symptomatic person is a different stem. The trap is doing the screen because a society disagreed, when the question is the preventive service.
**Hook.** Grade D is a recommendation against. Read whether the stem is a screen or a symptom.

## Checklist

- [ ] Of whom, before the arithmetic.
- [ ] Absolute risk when you counsel.
- [ ] A confidence interval that includes the null is not a win.
- [ ] Surrogate outcomes are labeled as surrogate.
- [ ] An ad is not a guideline.

## Common traps

- Treating the p value as the probability the null is true.
- Number needed to treat computed from a relative risk.
- Applying a trial of 55-year-old men to an 85-year-old woman without saying the extrapolation.
- A feed card of formulas with no “of whom.” Memorize the question the formula answers, or the formula will be applied to the wrong margin of the table.

## Practice this in the Qbank

Do a block of abstract items in one sitting so the fatigue is real. Day 1 feels like that. For each miss, write the one line you misread (population, outcome, or interval). The Step 1 biostatistics chapter is the repair manual if the vocabulary itself is gone.

## Sources

Source: [Step 3 MCQ specifications](https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-and-specifications). Biostatistics and the literature are about 11–13%, and Day 1 practice-based learning is about 11–13% of that day’s competencies.

Source: [USMLE content outline](https://www.usmle.org/sites/default/files/2022-01/USMLE_Content_Outline_0.pdf). The biostatistics section is shared across Steps.

Source: Standard definitions of risk, bias, and interval estimation. They are not a substitute for a statistician on a real study.
