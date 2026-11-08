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
        "Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 report. Lancet Respir Med 2025",
        "https://pubmed.ncbi.nlm.nih.gov/41317736/",
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
        "https://ginasthma.org/",
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
