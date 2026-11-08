"""Shared constructors for the hidden PANCE 200 pack."""

VERSION = "pance-200-20261108-v1"

CATALOG = {
    "aad-acne-2024": (
        "Reynolds RV et al. Guidelines of care for the management of acne vulgaris. J Am Acad Dermatol 2024",
        "https://pubmed.ncbi.nlm.nih.gov/38300170/",
    ),
    "kdigo-ckd-2024": (
        "KDIGO CKD Work Group. KDIGO 2024 Clinical Practice Guideline for CKD. Kidney Int 2024",
        "https://pubmed.ncbi.nlm.nih.gov/38490803/",
    ),
    "ada-ckd-2026": (
        "American Diabetes Association. 11. Chronic Kidney Disease and Risk Management: Standards of Care in Diabetes 2026. Diabetes Care 2026",
        "https://doi.org/10.2337/dc26-s011",
    ),
    "aua-mh-2025": (
        "Barocas DA et al. Updates to Microhematuria: AUA/SUFU Guideline (2025). J Urol 2025",
        "https://www.auajournals.org/doi/10.1097/JU.0000000000004490",
    ),
    "aua-stone-2026": (
        "American Urological Association. Medical Management of Kidney Stones: AUA Guideline (2026). J Urol 2026",
        "https://www.auajournals.org/doi/10.1097/JU.0000000000005227",
    ),
    "nccpa-2025": (
        "NCCPA. Content Blueprint for the PANCE, effective January 2025. NCCPA 2025",
        "https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf",
    ),
    "acc-vhd-2020": (
        "Otto CM et al. 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease. Circulation 2021",
        "https://pubmed.ncbi.nlm.nih.gov/33332150/",
    ),
    "aha-hf-2022": (
        "Heidenreich PA et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation 2022",
        "https://pubmed.ncbi.nlm.nih.gov/35363499/",
    ),
    "idsa-asb-2019": (
        "Nicolle LE et al. Clinical Practice Guideline for the Management of Asymptomatic Bacteriuria: 2019 Update by IDSA. Clin Infect Dis 2019",
        "https://pubmed.ncbi.nlm.nih.gov/30895288/",
    ),
    "cdc-sti-2021": (
        "Workowski KA et al. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recomm Rep 2021",
        "https://www.cdc.gov/std/treatment-guidelines/epididymitis.htm",
    ),
    "uspstf-psa-2018": (
        "US Preventive Services Task Force. Screening for Prostate Cancer: US Preventive Services Task Force Recommendation Statement. JAMA 2018",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/prostate-cancer-screening",
    ),
    "aha-htn-2025": (
        "Jones DW et al. 2025 AHA/ACC Guideline for the Management of High Blood Pressure in Adults. J Am Coll Cardiol 2025",
        "https://pubmed.ncbi.nlm.nih.gov/40815242/",
    ),
    "ats-cap-2019": (
        "Metlay JP et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. ATS/IDSA Guideline. Am J Respir Crit Care Med 2019",
        "https://pubmed.ncbi.nlm.nih.gov/31573350/",
    ),
    "idsa-cdi-2021": (
        "IDSA and SHEA. 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults. Clin Infect Dis 2021",
        "https://pubmed.ncbi.nlm.nih.gov/34164674/",
    ),
    "chest-vte-2021": (
        "Stevens SM et al. Antithrombotic Therapy for VTE Disease: Second Update of the CHEST Guideline. Chest 2021",
        "https://journal.chestnet.org/article/S0012-3692(21)01506-3/fulltext",
    ),
    "gold-2026": (
        "Global Initiative for Chronic Obstructive Lung Disease. Global Strategy for the Diagnosis, Management, and Prevention of COPD, 2026 report",
        "https://goldcopd.org/2026-gold-report-and-pocket-guide/",
    ),
    "uspstf-crc-2021": (
        "US Preventive Services Task Force. Screening for Colorectal Cancer. JAMA 2021",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
    ),
    "uspstf-lung-2021": (
        "US Preventive Services Task Force. Screening for Lung Cancer. JAMA 2021",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening",
    ),
    "gina-2025": (
        "Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2025",
        "https://ginasthma.org/reports/",
    ),
    "bts-pleural-2023": (
        "Roberts ME et al. British Thoracic Society Guideline for pleural disease. Thorax 2023",
        "https://pubmed.ncbi.nlm.nih.gov/37433578/",
    ),
    "fleischner-2017": (
        "MacMahon H et al. Guidelines for Management of Incidental Pulmonary Nodules Detected on CT Images. Radiology 2017",
        "https://pubmed.ncbi.nlm.nih.gov/28240562/",
    ),
    "cholesterol-2018": (
        "Grundy SM et al. 2018 AHA/ACC Guideline on the Management of Blood Cholesterol. Circulation 2019",
        "https://pubmed.ncbi.nlm.nih.gov/30423391/",
    ),
    "aortic-2022": (
        "Isselbacher EM et al. 2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease. Circulation 2022",
        "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001106",
    ),
    "pericardial-2015": (
        "Adler Y et al. 2015 ESC Guidelines for the diagnosis and management of pericardial diseases. Eur Heart J 2015",
        "https://pubmed.ncbi.nlm.nih.gov/26320112/",
    ),
    "acc-bleed-2020": (
        "Tomaselli GF et al. 2020 ACC Expert Consensus Decision Pathway on Bleeding in Patients on Oral Anticoagulants. J Am Coll Cardiol 2020",
        "https://pubmed.ncbi.nlm.nih.gov/32680646/",
    ),
    "acog-preeclampsia-2020": (
        "ACOG Practice Bulletin No. 222. Gestational Hypertension and Preeclampsia. Obstet Gynecol 2020",
        "https://pubmed.ncbi.nlm.nih.gov/32443079/",
    ),
    "esc-pe-2019": (
        "Konstantinides SV et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. Eur Heart J 2020",
        "https://pubmed.ncbi.nlm.nih.gov/31504429/",
    ),
    "aua-stone-surg-2016": (
        "American Urological Association. Surgical Management of Stones: AUA Guideline. J Urol 2016",
        "https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-surgical-treatment-guideline",
    ),
    "cdc-syphilis-2021": (
        "Workowski KA et al. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis. MMWR 2021",
        "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm",
    ),
    "cdc-pid-2021": (
        "Workowski KA et al. Sexually Transmitted Infections Treatment Guidelines, 2021. Pelvic inflammatory disease. MMWR 2021",
        "https://www.cdc.gov/std/treatment-guidelines/pid.htm",
    ),
    "phs-pep-2025": (
        "US Public Health Service. 2025 Guidelines for Occupational Exposures to HIV and Post-exposure Prophylaxis. Infect Control Hosp Epidemiol 2025",
        "https://pubmed.ncbi.nlm.nih.gov/41569270/",
    ),
    "cdc-flu-2025": (
        "CDC. Influenza Antiviral Medications: Summary for Clinicians, 2025-2026. CDC 2025",
        "https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html",
    ),
    "acr-contrast-2023": (
        "American College of Radiology. ACR Manual on Contrast Media, metformin and iodinated contrast. ACR 2023",
        "https://www.acr.org/Clinical-Resources/Contrast-Manual",
    ),
    "ada-soc-2026": (
        "American Diabetes Association. Standards of Care in Diabetes 2026. Diabetes Care 2026",
        "https://diabetesjournals.org/care/issue/49/Supplement_1",
    ),
    "atls-2018": (
        "American College of Surgeons Committee on Trauma. Advanced Trauma Life Support, 10th edition. ACS 2018",
        "https://www.facs.org/quality-programs/trauma/education/advanced-trauma-life-support/",
    ),
    "aha-svt-2015": (
        "Page RL et al. 2015 ACC/AHA/HRS Guideline for the Management of Adult Patients With Supraventricular Tachycardia. Circulation 2016",
        "https://pubmed.ncbi.nlm.nih.gov/26399663/",
    ),
    "uspstf-aaa-2019": (
        "US Preventive Services Task Force. Screening for Abdominal Aortic Aneurysm. JAMA 2019",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening",
    ),
    "aua-bph-2021": (
        "Sandhu JS et al. Management of Lower Urinary Tract Symptoms Attributed to Benign Prostatic Hyperplasia: AUA Guideline Amendment 2023. J Urol 2023",
        "https://www.auajournals.org/doi/10.1097/JU.0000000000003698",
    ),
}


def refs(*keys):
    out = []
    for key in keys:
        label, url = CATALOG[key]
        out.append({"label": label, "url": url})
    return out


def item(subject, task, topic, diff, scenario, question, options, key, why, wrong, *ref_keys):
    return {
        "fieldId": "pance",
        "subjectId": subject,
        "taskCategory": task,
        "blueprintTopic": topic,
        "difficulty": diff,
        "scenario": scenario,
        "question": question,
        "options": options,
        "correctAnswer": key,
        "explanation": f"{key} is correct. {why} Incorrect alternatives: {wrong}",
        "references": refs(*ref_keys),
        "active": False,
        "qaPassed": False,
        "generationVersion": VERSION,
        "itemType": "vignette",
    }
