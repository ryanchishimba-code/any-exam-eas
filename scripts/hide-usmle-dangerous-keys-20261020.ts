#!/usr/bin/env node
/**
 * Hide live items with dangerous keys (dry run by default).
 *
 *   npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts
 *   npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts --apply
 *
 * Backup on apply: qbi_dangerous_hide_backup_20261021
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { cleanOptionText } from "@/lib/question-format";

const BACKUP_TABLE = "qbi_dangerous_hide_backup_20261021";

const REVIEW_ONLY_CATEGORIES = new Set(["clinical_recheck_ldl160"]);

const prisma = new PrismaClient();

type Row = {
  id: string;
  fieldId: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
};

type Hit = {
  id: string;
  fieldId: string;
  category: string;
  reason: string;
  stemExcerpt: string;
  options: string[];
  correctAnswer: string;
  uncertain?: boolean;
};

function stemText(r: Row): string {
  return `${r.scenario ?? ""}\n${r.question}`.trim();
}

function parseOptionsPayload(raw: string): {
  options: string[];
  distractorRationale: Record<string, string>;
} {
  const empty = { options: [] as string[], distractorRationale: {} as Record<string, string> };
  try {
    const j = JSON.parse(raw) as unknown;
    if (Array.isArray(j)) return { options: j.map(String), distractorRationale: {} };
    if (j && typeof j === "object") {
      const o = j as { options?: unknown[]; distractorRationale?: Record<string, string> };
      return {
        options: Array.isArray(o.options) ? o.options.map((x) => String(x)) : [],
        distractorRationale:
          o.distractorRationale && typeof o.distractorRationale === "object"
            ? o.distractorRationale
            : {},
      };
    }
  } catch {
    /* ignore */
  }
  return empty;
}

function parseOptions(raw: string): string[] {
  return parseOptionsPayload(raw).options;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function answerInOptions(answer: string, opts: string[]): boolean {
  const a = norm(answer);
  return opts.some((o) => norm(o) === a || norm(o).includes(a) || a.includes(norm(o)));
}

function keyMatches(answer: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(answer));
}

function stemHas(stem: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(stem));
}

function optsHave(opts: string[], patterns: RegExp[]): boolean {
  return opts.some((o) => patterns.some((re) => re.test(o)));
}

function makeHit(
  r: Row,
  category: string,
  reason: string,
  uncertain = false
): Hit {
  return {
    id: r.id,
    fieldId: r.fieldId,
    category,
    reason,
    stemExcerpt: excerpt(stemText(r)),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
    uncertain,
  };
}

function parseAgeYears(stem: string): number | null {
  return parseNumberFromText(stem, [
    /\b(\d{1,3})[- ]year[- ]old\b/i,
    /\bage[:\s]+(\d{1,3})\s*(?:years?)?\b/i,
  ]);
}

function tokenSet(text: string): Set<string> {
  const stop = new Set([
    "the",
    "and",
    "with",
    "for",
    "patient",
    "present",
    "history",
    "year",
    "old",
    "man",
    "woman",
    "male",
    "female",
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stop.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function excerpt(text: string, n = 140): string {
  return text.replace(/\s+/g, " ").trim().slice(0, n);
}

function parseNumberFromText(text: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const v = Number.parseFloat(m[1]);
      if (Number.isFinite(v)) return v;
    }
  }
  return null;
}

function maintenanceMlPerHour(weightKg: number): number {
  if (weightKg <= 0) return 0;
  if (weightKg <= 10) return weightKg * 4;
  if (weightKg <= 20) return 40 + (weightKg - 10) * 2;
  return 60 + (weightKg - 20);
}

function cockcroftGault(
  age: number,
  weightKg: number,
  scr: number,
  female: boolean
): number {
  const base = ((140 - age) * weightKg) / (72 * scr);
  return Math.round(base * (female ? 0.85 : 1));
}

function parseMlHr(answer: string): number | null {
  const m = answer.match(/(\d+(?:\.\d+)?)\s*mL\s*\/\s*h(?:r)?/i);
  return m ? Number.parseFloat(m[1]) : null;
}

function parseCrClAnswer(answer: string): number | null {
  const m = answer.match(/(\d+(?:\.\d+)?)\s*mL\s*\/\s*min/i);
  return m ? Math.round(Number.parseFloat(m[1])) : null;
}

const LIVE_VACCINE =
  /\b(MMR|measles[,\s]+mumps|varicella|yellow fever|live attenuated|rotavirus|FluMist|intranasal influenza)\b/i;
const DEFER_VACCINE_ANSWER =
  /\b(MMR|measles[,\s]+mumps|rubella vaccine|varicella vaccine|administer the measles|live vaccine)\b/i;

const REPERFUSION_OPT =
  /\b(PCI|percutaneous coronary|coronary angiography|cardiac catheterization|cath lab|primary PCI|reperfusion|fibrinolysis|thrombolysis)\b/i;

const ASPIRIN_KEY =
  /^aspirin\b|administer aspirin|aspirin 325|dual antiplatelet|clopidogrel/i;

function isStemiContext(text: string): boolean {
  return /\bSTEMI\b|ST[- ]segment elevation|ST elevation in/i.test(text);
}

function categoryFebrileLiveVaccine(r: Row): Hit | null {
  const stem = stemText(r);
  const blob = `${stem}\n${r.correctAnswer}`;
  const infant9mo =
    /\b9[- ]month|\b8[- ]month|\b10[- ]month/i.test(stem) ||
    (/\b9\s*months?\b/i.test(stem) && /\binfant\b/i.test(stem));
  const acuteFebrile =
    /\b(fever|febrile|acutely ill|high fever|temperature of 10[0-4]|39\.|40\.|103|104)\b/i.test(stem);
  if (!infant9mo || !acuteFebrile) return null;
  if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer) && !LIVE_VACCINE.test(r.correctAnswer)) {
    const opts = parseOptions(r.options);
    if (!opts.some((o) => DEFER_VACCINE_ANSWER.test(o))) return null;
    // keyed wrong option among choices
    if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer)) return null;
  }
  if (!DEFER_VACCINE_ANSWER.test(r.correctAnswer) && !/\bMMR\b/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "febrile_live_vaccine",
    reason: "Acutely febrile infant keyed to live/MMR vaccination (should defer).",
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
}

function categoryStemiAspirinOverReperfusion(r: Row): Hit | null {
  const stem = stemText(r);
  if (!isStemiContext(stem)) return null;
  const opts = parseOptions(r.options);
  const hasReperfusionOpt = opts.some((o) => REPERFUSION_OPT.test(o));
  if (!hasReperfusionOpt) return null;
  if (!ASPIRIN_KEY.test(r.correctAnswer)) return null;
  if (REPERFUSION_OPT.test(r.correctAnswer)) return null;
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "stemi_aspirin_over_reperfusion",
    reason: "STEMI context but keyed aspirin/antiplatelet without reperfusion/PCI.",
    stemExcerpt: excerpt(stem),
    options: opts,
    correctAnswer: r.correctAnswer,
  };
}

function categoryStemiNoReperfusionOption(r: Row): Hit | null {
  const stem = stemText(r);
  if (!isStemiContext(stem)) return null;
  const opts = parseOptions(r.options);
  if (opts.length < 3) return null;
  if (opts.some((o) => REPERFUSION_OPT.test(o))) return null;
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "stemi_no_reperfusion_option",
    reason: "STEMI context but option list lacks PCI/angiography/reperfusion.",
    stemExcerpt: excerpt(stem),
    options: opts,
    correctAnswer: r.correctAnswer,
    uncertain: true,
  };
}

function categoryMaintenance72(r: Row): Hit | null {
  const stem = stemText(r);
  if (!/\bmaintenance\b/i.test(stem) && !/\bfluid\b/i.test(stem)) return null;
  const weight = parseNumberFromText(stem, [
    /\b(\d+(?:\.\d+)?)\s*kg\b/i,
    /\bweight[:\s]+(\d+(?:\.\d+)?)\s*kg/i,
  ]);
  if (weight !== 7) return null;
  const expected = maintenanceMlPerHour(7);
  const keyed = parseMlHr(r.correctAnswer);
  if (keyed !== 70 && keyed !== expected) {
    const opt70 = parseOptions(r.options).find((o) => /70\s*mL\s*\/\s*hr/i.test(o));
    if (!opt70 || r.correctAnswer !== opt70) return null;
  }
  if (r.correctAnswer !== "70 mL/hr" && !/70\s*mL\s*\/\s*hr/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "maintenance_fluids_7kg_70",
    reason: `7 kg maintenance keyed 70 mL/hr (4-2-1 expects ${expected} mL/hr).`,
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
}

function categoryCockcroftMismatch(r: Row): Hit | null {
  const blob = `${stemText(r)}\n${r.explanation}`;
  if (!/\bCockcroft|creatinine clearance|CrCl\b/i.test(blob)) return null;

  const age = parseNumberFromText(blob, [
    /\b(\d{1,3})[- ]year[- ]old\b/i,
    /\bage[:\s]+(\d{1,3})\b/i,
  ]);
  const weight = parseNumberFromText(blob, [
    /\b(\d+(?:\.\d+)?)\s*kg\b/i,
    /\bweight[:\s]+(\d+(?:\.\d+)?)\s*kg/i,
  ]);
  const scr = parseNumberFromText(blob, [
    /\bSCr[:\s]+(\d+(?:\.\d+)?)/i,
    /\bserum creatinine[:\s]+(\d+(?:\.\d+)?)/i,
    /\bcreatinine(?:\s+of)?[:\s]+(\d+(?:\.\d+)?)\s*mg/i,
  ]);
  const female = /\b(woman|female|she|her)\b/i.test(blob) && !/\b(man|male|he|his)\b/i.test(blob);

  const keyed = parseCrClAnswer(r.correctAnswer);
  if (keyed == null) return null;

  if (age != null && scr != null && scr > 0) {
    if (weight == null && keyed === 90) {
      return {
        id: r.id,
        fieldId: r.fieldId,
        category: "cockcroft_no_weight_key_90",
        reason: "Cockcroft item without weight in stem; keyed 90 mL/min (likely ~62 if weight missing).",
        stemExcerpt: excerpt(stemText(r)),
        options: parseOptions(r.options),
        correctAnswer: r.correctAnswer,
        uncertain: true,
      };
    }
    if (weight != null) {
      const computed = cockcroftGault(age, weight, scr, female);
      const delta = Math.abs(computed - keyed);
      if (delta > 3) {
        return {
          id: r.id,
          fieldId: r.fieldId,
          category: "cockcroft_key_mismatch",
          reason: `Cockcroft-Gault computed ~${computed} mL/min vs keyed ${keyed}.`,
          stemExcerpt: excerpt(stemText(r)),
          options: parseOptions(r.options),
          correctAnswer: r.correctAnswer,
        };
      }
    }
  }
  return null;
}

function categoryHsCrpLdl(r: Row): Hit | null {
  const stem = stemText(r);
  const blob = `${stem}\n${r.correctAnswer}`;
  const ldl160 = /\bLDL[^0-9]{0,20}160\b/i.test(blob) || /\bLDL[^0-9]{0,20}of 160\b/i.test(blob);
  const onStatin = /\b(statin|atorvastatin|rosuvastatin|simvastatin|pravastatin)\b/i.test(blob);
  if (!ldl160 || !onStatin) return null;
  if (!/\b(high-sensitivity C-reactive protein|hs-CRP|hs CRP)\b/i.test(r.correctAnswer)) {
    return null;
  }
  return {
    id: r.id,
    fieldId: r.fieldId,
    category: "hs_crp_ldl_statin",
    reason: "hs-CRP keyed as best next step for LDL 160 on statin (not initial risk test).",
    stemExcerpt: excerpt(stem),
    options: parseOptions(r.options),
    correctAnswer: r.correctAnswer,
  };
}

const CDC_PID_REGIMEN =
  /\b(ceftriaxone|cefotetan|cefoxitin|levofloxacin|ofloxacin|metronidazole|doxycycline|azithromycin)\b/i;

// --- PANCE ---
function categoryPanceDiOverDm(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  const childPoly =
    /\b4[- ]year|\bfour[- ]year/i.test(stem) &&
    /\b(polyuria|polydipsia|bedwetting|enuresis)\b/i.test(stem);
  if (!childPoly) return null;
  const opts = parseOptions(r.options);
  if (!keyMatches(r.correctAnswer, [/diabetes insipidus/i])) return null;
  if (!optsHave(opts, [/diabetes mellitus|type 1 diabetes|insulin/i])) return null;
  return makeHit(
    r,
    "pance_child_polyuria_di_over_dm",
    "4yo polyuria/polydipsia keyed diabetes insipidus over diabetes mellitus."
  );
}

function categoryPanceNeuropathyFootCare(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\b(painful|burning|neuropathy|paresthesia|numbness|tingling)\b/i.test(stem)) return null;
  if (!/\bdiabet/i.test(stem)) return null;
  const opts = parseOptions(r.options);
  if (
    !keyMatches(r.correctAnswer, [
      /foot care|foot-care|proper foot|diabetic foot education|educate on foot/i,
    ])
  ) {
    return null;
  }
  if (!optsHave(opts, [/gabapentin|pregabalin|duloxetine|amitriptyline/i])) return null;
  return makeHit(
    r,
    "pance_neuropathy_footcare_over_gabapentin",
    "Painful diabetic neuropathy keyed foot-care education over gabapentin/pregabalin."
  );
}

function categoryPanceAsthmaPefLaba(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\basthma\b/i.test(stem)) return null;
  const pef60 =
    /\bPEF[^.]{0,30}60\s*%|\bpeak expiratory flow[^.]{0,40}60\s*%|\b60\s*%\s*of\s*(predicted|personal best)/i.test(
      stem
    );
  if (!pef60) return null;
  if (!keyMatches(r.correctAnswer, [/LABA|long[- ]acting beta|salmeterol|formoterol|add.*beta/i])) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/oral corticosteroid|prednisone|systemic steroid|methylprednisolone/i])) {
    return null;
  }
  return makeHit(
    r,
    "pance_asthma_pef60_laba_over_steroids",
    "Acute asthma PEF ~60% keyed add LABA over oral/systemic steroids."
  );
}

function categoryPanceAntidepressantCharcoal(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\b(overdose|ingestion|suicidal)\b/i.test(stem)) return null;
  if (!/\b(SSRI|SNRI|antidepressant|sertraline|fluoxetine|citalopram|venlafaxine)\b/i.test(stem)) {
    return null;
  }
  if (!/\b(drowsy|lethargic|somnolent|altered mental|GCS|unresponsive)\b/i.test(stem)) return null;
  if (!keyMatches(r.correctAnswer, [/activated charcoal|charcoal/i])) return null;
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/supportive|observation|monitor|airway|N-acetylcysteine|naloxone/i])) return null;
  return makeHit(
    r,
    "pance_antidepressant_od_charcoal_over_supportive",
    "Drowsy antidepressant overdose keyed activated charcoal over supportive care."
  );
}

function categoryPanceIvIronFerritin500(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const blob = `${stemText(r)}\n${r.correctAnswer}`;
  if (!/\bferritin\b/i.test(blob)) return null;
  const ferritin = parseNumberFromText(blob, [/\bferritin[^0-9]{0,25}(\d+(?:\.\d+)?)/i]);
  if (ferritin == null || ferritin < 400) return null;
  if (!keyMatches(r.correctAnswer, [/IV iron|intravenous iron|iron infusion|ferric carboxymaltose/i])) {
    return null;
  }
  return makeHit(
    r,
    "pance_iv_iron_high_ferritin",
    `IV iron keyed with ferritin ${ferritin} (typically avoid when replete).`
  );
}

function categoryPanceAsMechanicalBack(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\b(ankylosing spondylitis|\bAS\b|sacroiliitis|HLA-B27)\b/i.test(stem)) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /mechanical back|muscle strain|lumbar strain|degenerative disc|facet/i,
    ])
  ) {
    return null;
  }
  const inflammatory =
    /\b(worse with rest|improves with exercise|morning stiffness|nocturnal pain|better with activity)\b/i.test(
      stem
    );
  if (!inflammatory) return null;
  return makeHit(
    r,
    "pance_as_keyed_mechanical_back",
    "Inflammatory back pattern keyed mechanical back pain over AS/spondyloarthropathy."
  );
}

function categoryPancePrepBeforeHivTest(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  const prepContext =
    /\bPrEP\b|pre-exposure prophylaxis|emtricitabine.*tenofovir|tenofovir.*emtricitabine|Truvada\b/i.test(
      `${stem}\n${r.correctAnswer}`
    );
  if (!prepContext) return null;
  const hivStatusKnown =
    /\b(HIV negative|HIV positive|known HIV|documented HIV|recent HIV test|HIV antibody (?:negative|positive))\b/i.test(
      stem
    );
  if (hivStatusKnown) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /start PrEP|initiate PrEP|prescribe.*tenofovir|emtricitabine|Truvada|begin pre-exposure/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/HIV test|HIV screening|fourth generation|antigen/i])) return null;
  return makeHit(
    r,
    "pance_prep_before_hiv_test",
    "PrEP keyed before documented HIV test."
  );
}

function categoryPancePidNoCdcRegimen(r: Row): Hit | null {
  if (r.fieldId !== "pance") return null;
  const stem = stemText(r);
  if (!/\b(PID|pelvic inflammatory|salpingitis|cervicitis with.*fever)\b/i.test(stem)) return null;
  const opts = parseOptions(r.options);
  if (opts.length < 3) return null;
  const anyCdc = opts.some((o) => {
    const hasGon = /ceftriaxone|cefotetan|cefoxitin/i.test(o);
    const hasOther = /doxycycline|metronidazole|levofloxacin|ofloxacin|azithromycin/i.test(o);
    return hasGon && hasOther;
  });
  if (anyCdc) return null;
  return makeHit(
    r,
    "pance_pid_no_cdc_regimen",
    "PID item with no CDC-concordant antibiotic regimen in options.",
    true
  );
}

// --- FNP (aanp-fnp) ---
function categoryFnpMenopause70Bleed(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\b70[- ]year|\bseventy[- ]year/i.test(stem) && !/\bage[^0-9]{0,10}70\b/i.test(stem)) {
    return null;
  }
  const gynConcern =
    /\b(bleeding|vaginal bleed|postmenopausal|uterine bleed|irregular period|menstrual cycle)\b/i.test(
      stem
    );
  if (!gynConcern) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /menopause transition|perimenopause|normal menopause|expected menopause/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/endometrial|biopsy|ultrasound|hyperplasia|cancer|hysteroscopy|hyperthyroid/i])) {
    return null;
  }
  return makeHit(
    r,
    "fnp_70yo_bleeding_menopause_transition",
    "70yo gynecologic symptoms keyed menopause transition over serious pathology workup."
  );
}

function categoryFnpChildMenstrualAnovulatory(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  const young =
    /\b5[- ]year|\bfive[- ]year|\b6[- ]year|\b7[- ]year|\b8[- ]year/i.test(stem) ||
    (parseAgeYears(stem) != null && parseAgeYears(stem)! <= 8);
  if (!young) return null;
  if (!/\b(menstrual|menarche|vaginal bleeding|uterine bleeding)\b/i.test(stem)) return null;
  if (!keyMatches(r.correctAnswer, [/anovulatory|dysfunctional uterine|normal menstrual/i])) {
    return null;
  }
  return makeHit(
    r,
    "fnp_child_menstrual_anovulatory",
    "Young child menstrual bleeding keyed anovulatory cycles (age-impossible)."
  );
}

function categoryFnpAgeImpossibleStem(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  const age = parseAgeYears(stem);
  const key = r.correctAnswer;
  const male = /\b(man|male|boy|he|his)\b/i.test(stem) && !/\b(woman|female|girl|she|her)\b/i.test(stem);

  if (male && keyMatches(key, [/anovulatory|menopause|prenatal|obstetric|labor and delivery/i])) {
    return makeHit(r, "fnp_age_impossible_stem", "Male patient keyed to female-only gynecologic answer.", true);
  }
  if (age != null && age < 10 && keyMatches(key, [/anovulatory|menopause|perimenopause|HRT for menopause/i])) {
    return makeHit(
      r,
      "fnp_age_impossible_stem",
      "Prepubertal age keyed to adult menstrual/menopause answer.",
      true
    );
  }
  if (age != null && age >= 65 && keyMatches(key, [/puberty|menarche|normal adolescent menstrual/i])) {
    return makeHit(r, "fnp_age_impossible_stem", "Older adult keyed to pediatric puberty answer.", true);
  }
  return null;
}

function categoryFnpThunderclapHtnOverSah(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\b(thunderclap|sudden severe headache|worst headache)\b/i.test(stem)) return null;
  if (!keyMatches(r.correctAnswer, [/hypertensive (crisis|emergency)|lower blood pressure|IV labetalol|nicardipine/i])) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/subarachnoid|SAH|CT angiography|lumbar puncture|aneurysm/i])) return null;
  return makeHit(
    r,
    "fnp_thunderclap_htn_over_sah",
    "Thunderclap headache keyed hypertensive crisis over SAH workup."
  );
}

function categoryFnpBilateralWheezeCroup(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\b(bilateral wheez|wheezing bilaterally|expiratory wheez)\b/i.test(stem)) return null;
  if (!/\b(adult|elderly|\d{2}[- ]year)\b/i.test(stem)) return null;
  if (keyMatches(r.correctAnswer, [/croup|laryngotracheobronchitis|barking cough|epiglottitis/i])) {
    return makeHit(
      r,
      "fnp_bilateral_wheeze_croup",
      "Adult bilateral wheezing keyed viral croup (pediatric diagnosis)."
    );
  }
  return null;
}

function categoryFnpPostcoitalAbxUtiMan(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  const male =
    /\b(man|male|he|his)\b/i.test(stem) && !/\b(woman|female|she)\b/i.test(stem);
  if (!male) return null;
  if (!/\bUTIs?\b|urinary tract infection|dysuria|pyuria/i.test(stem)) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /post[- ]?coital|prophylaxis after intercourse|single dose.*after sex/i,
    ])
  ) {
    return null;
  }
  return makeHit(
    r,
    "fnp_postcoital_prophylaxis_man_uti",
    "Post-coital antibiotic prophylaxis keyed for man with UTIs."
  );
}

function categoryFnpT1dTeenMonitorMore(r: Row): Hit | null {
  if (r.fieldId !== "aanp-fnp") return null;
  const stem = stemText(r);
  if (!/\b(type 1 diabetes|T1D|insulin[- ]dependent)\b/i.test(stem)) return null;
  if (!/\b(teen|adolescent|\d{2}[- ]year).*\b(diabetic|diabetes)\b/i.test(stem)) return null;
  if (!/\b(hyperglycemia|DKA|ketones|polyuria|weight loss|symptomatic)\b/i.test(stem)) return null;
  if (/insulin|IV fluid|isotonic|DKA|bicarbonate infusion/i.test(r.correctAnswer)) {
    return null;
  }
  if (
    !keyMatches(r.correctAnswer, [
      /^monitor\b|increase frequency of (?:blood )?glucose|check glucose more|glucose monitoring only/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/insulin adjustment|increase insulin|basal bolus|DKA protocol|insulin drip/i])) {
    return null;
  }
  return makeHit(
    r,
    "fnp_t1d_teen_monitor_over_treatment",
    "Symptomatic T1D teen keyed monitor more over insulin/DKA management."
  );
}

// --- NAPLEX (pharmacy) ---
function categoryNaplexLevothyroxinePregnancyUnchanged(r: Row): Hit | null {
  if (r.fieldId !== "pharmacy") return null;
  const stem = stemText(r);
  if (!/\b(pregnan|trimester|gestation)\b/i.test(stem)) return null;
  if (!/\b(levothyroxine|synthroid|hypothyroid)\b/i.test(stem)) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /continue unchanged|no change|same dose|maintain current dose|do not adjust/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/increase|dose adjustment|monitor TSH|raise dose/i])) return null;
  return makeHit(
    r,
    "naplex_levothyroxine_pregnancy_unchanged",
    "Pregnancy hypothyroidism keyed continue levothyroxine unchanged (usually increase)."
  );
}

function categoryNaplexTemplateFrankenstein(r: Row): Hit | null {
  if (r.fieldId !== "pharmacy") return null;
  const { options, distractorRationale } = parseOptionsPayload(r.options);
  if (options.length < 3) return null;

  if (!answerInOptions(r.correctAnswer, options)) {
    return makeHit(
      r,
      "naplex_template_mismatch",
      "Keyed answer text not present in option list (template mismatch).",
      true
    );
  }

  const rationaleKeys = Object.keys(distractorRationale);
  if (rationaleKeys.length >= 3) {
    let aligned = 0;
    for (const key of rationaleKeys) {
      if (options.some((o) => norm(o) === norm(key) || norm(o).includes(norm(key)))) aligned++;
    }
    if (aligned / rationaleKeys.length < 0.34) {
      return makeHit(
        r,
        "naplex_template_mismatch",
        "Distractor rationale keys do not match option texts (template mismatch).",
        true
      );
    }
  }

  const stem = stemText(r);
  const stemTok = tokenSet(stem);
  const expTok = tokenSet(r.explanation.slice(0, 600));
  const keyedTok = tokenSet(r.correctAnswer);
  if (
    stemTok.size > 10 &&
    keyedTok.size > 2 &&
    jaccard(stemTok, keyedTok) < 0.02 &&
    jaccard(stemTok, expTok) < 0.03 &&
    !options.some((o) => jaccard(stemTok, tokenSet(o)) > 0.08)
  ) {
    return makeHit(
      r,
      "naplex_template_mismatch",
      "Keyed answer appears unrelated to stem (cross-template).",
      true
    );
  }

  return null;
}

function categoryNaplexEdAsthmaNebOverSteroid(r: Row): Hit | null {
  if (r.fieldId !== "pharmacy") return null;
  const stem = stemText(r);
  if (!/\b(asthma|wheez|bronchospasm)\b/i.test(stem)) return null;
  if (!/\b(emergency|ED|acute exacerbation|status asthmaticus)\b/i.test(stem)) return null;
  if (
    !keyMatches(r.correctAnswer, [
      /nebulizer|albuterol|ipratropium|beta-agonist|repeat bronchodilator/i,
    ])
  ) {
    return null;
  }
  const opts = parseOptions(r.options);
  if (!optsHave(opts, [/systemic corticosteroid|prednisone|methylprednisolone|oral steroid/i])) {
    return null;
  }
  return makeHit(
    r,
    "naplex_ed_asthma_neb_over_steroids",
    "ED asthma exacerbation keyed more nebulizer over systemic steroids."
  );
}

// --- NPTE-PT ---
function categoryNpteGlucoseMonitorAssistive(r: Row): Hit | null {
  if (r.fieldId !== "npte-pt") return null;
  const stem = stemText(r);
  if (!/\b(assistive device|adaptive equipment|most appropriate device)\b/i.test(stem)) return null;
  if (!keyMatches(r.correctAnswer, [/glucose monitor|blood glucose monitor|glucometer|CGM/i])) {
    return null;
  }
  return makeHit(
    r,
    "npte_glucose_monitor_assistive_device",
    "Glucose monitor keyed as primary assistive device (PT scope mismatch)."
  );
}

function templateFingerprint(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/[^a-z# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function audit(rows: Row[]) {
  const hits: Hit[] = [];
  const seen = new Set<string>();

  function add(hit: Hit | null) {
    if (!hit || seen.has(hit.id)) return;
    seen.add(hit.id);
    hits.push(hit);
  }

  for (const r of rows) {
    add(categoryFebrileLiveVaccine(r));
    add(categoryStemiAspirinOverReperfusion(r));
    add(categoryStemiNoReperfusionOption(r));
    add(categoryMaintenance72(r));
    add(categoryCockcroftMismatch(r));
    add(categoryHsCrpLdl(r));
    add(categoryPanceDiOverDm(r));
    add(categoryPanceNeuropathyFootCare(r));
    add(categoryPanceAsthmaPefLaba(r));
    add(categoryPanceAntidepressantCharcoal(r));
    add(categoryPanceIvIronFerritin500(r));
    add(categoryPanceAsMechanicalBack(r));
    add(categoryPancePrepBeforeHivTest(r));
    add(categoryPancePidNoCdcRegimen(r));
    add(categoryFnpMenopause70Bleed(r));
    add(categoryFnpChildMenstrualAnovulatory(r));
    add(categoryFnpAgeImpossibleStem(r));
    add(categoryFnpThunderclapHtnOverSah(r));
    add(categoryFnpBilateralWheezeCroup(r));
    add(categoryFnpPostcoitalAbxUtiMan(r));
    add(categoryFnpT1dTeenMonitorMore(r));
    add(categoryNaplexLevothyroxinePregnancyUnchanged(r));
    add(categoryNaplexTemplateFrankenstein(r));
    add(categoryNaplexEdAsthmaNebOverSteroid(r));
    add(categoryNpteGlucoseMonitorAssistive(r));
  }

  // Explicit recheck id (LDL 160 lifestyle — not hs-CRP; note if still live)
  const recheckId = "cmr8j9r9t02kd1yloj44dqg23";
  const recheck = rows.find((r) => r.id === recheckId);
  if (recheck && !seen.has(recheckId)) {
    hits.push({
      id: recheckId,
      fieldId: recheck.fieldId,
      category: "clinical_recheck_ldl160",
      reason:
        "On clinical-recheck queue: LDL 160 may warrant statin discussion (ACC/AHA enhancer); not auto-hide.",
      stemExcerpt: excerpt(stemText(recheck)),
      options: parseOptions(recheck.options),
      correctAnswer: recheck.correctAnswer,
      uncertain: true,
    });
    seen.add(recheckId);
  }

  const hideSet = new Set(
    hits
      .filter(
        (h) =>
          !h.uncertain &&
          !REVIEW_ONLY_CATEGORIES.has(h.category)
      )
      .map((h) => h.id)
  );

  const nearCopies: { fingerprint: string; category: string; ids: string[] }[] = [];
  const byFp = new Map<string, { category: string; ids: string[] }>();
  for (const h of hits) {
    if (h.uncertain || REVIEW_ONLY_CATEGORIES.has(h.category)) continue;
    const fp = `${h.category}|${templateFingerprint(h.stemExcerpt)}`;
    const cur = byFp.get(fp) ?? { category: h.category, ids: [] };
    cur.ids.push(h.id);
    byFp.set(fp, cur);
  }
  for (const [fp, v] of byFp) {
    if (v.ids.length >= 2) nearCopies.push({ fingerprint: fp, category: v.category, ids: v.ids });
  }

  return { hits, hideSet, nearCopies };
}

async function boardCounts(qaPassedOnly: boolean): Promise<Record<string, number>> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT "fieldId", COUNT(*)::bigint AS n
    FROM "QuestionBankItem"
    WHERE active = true ${qaPassedOnly ? 'AND "qaPassed" = true' : ""}
    GROUP BY "fieldId"
  `)) as { fieldId: string; n: bigint }[];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.fieldId] = Number(r.n);
  return out;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "fieldId", scenario, question, options, "correctAnswer", explanation
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true
  `)) as Row[];

  const beforeTotal = rows.length;
  const beforeBoard = await boardCounts(true);
  const { hits, hideSet, nearCopies } = audit(rows);

  const byCategory: Record<string, Hit[]> = {};
  for (const h of hits) {
    (byCategory[h.category] ??= []).push(h);
  }

  const afterTotal = beforeTotal - hideSet.size;
  const afterBoard = { ...beforeBoard };
  for (const id of hideSet) {
    const h = hits.find((x) => x.id === id)!;
    afterBoard[h.fieldId] = (afterBoard[h.fieldId] ?? 0) - 1;
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`live qaPassed scanned: ${beforeTotal}`);
  console.log(`would hide (qaPassed=false): ${hideSet.size}`);
  console.log(`after total: ${afterTotal}`);
  const printHit = (h: Hit, tag: string) => {
    console.log(
      `    ${h.id} [${h.fieldId}] ${tag} key=${JSON.stringify(h.correctAnswer.slice(0, 60))} | ${h.reason}`
    );
    console.log(`      stem: ${h.stemExcerpt}…`);
    console.log(
      `      options: ${h.options.map((o) => cleanOptionText(o).slice(0, 50)).join(" | ")}`
    );
  };

  console.log("\nper-category counts (would hide):");
  for (const [cat, list] of Object.entries(byCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    const hideList = list.filter((h) => hideSet.has(h.id));
    if (hideList.length === 0) continue;
    console.log(`  ${cat}: ${hideList.length} hide (${list.length} matched)`);
    console.log(`    ids: ${hideList.map((h) => h.id).join(", ")}`);
    for (const h of hideList.slice(0, 5)) printHit(h, "HIDE");
    if (hideList.length > 5) console.log(`    … +${hideList.length - 5} more`);
  }

  const reviewHits = hits.filter(
    (h) => h.uncertain || REVIEW_ONLY_CATEGORIES.has(h.category)
  );
  if (reviewHits.length) {
    console.log("\nclinical review only (not in hide set):");
    const reviewByCat: Record<string, Hit[]> = {};
    for (const h of reviewHits) (reviewByCat[h.category] ??= []).push(h);
    for (const [cat, list] of Object.entries(reviewByCat).sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`  ${cat}: ${list.length}`);
      console.log(`    ids: ${list.map((h) => h.id).join(", ")}`);
      for (const h of list.slice(0, 3)) printHit(h, "REVIEW");
      if (list.length > 3) console.log(`    … +${list.length - 3} more`);
    }
  }

  if (nearCopies.length) {
    console.log("\nnear-copy template families (>=2 ids):");
    for (const nc of nearCopies) {
      console.log(`  ${nc.category}: ${nc.ids.join(", ")}`);
    }
  }

  console.log(`\nbackup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/hide-usmle-dangerous-keys-20261020.ts --apply");

  console.log("\nper-category per-board hide counts:");
  const catBoard: Record<string, Record<string, number>> = {};
  for (const h of hits) {
    if (!hideSet.has(h.id)) continue;
    (catBoard[h.category] ??= {})[h.fieldId] = (catBoard[h.category][h.fieldId] ?? 0) + 1;
  }
  for (const [cat, boards] of Object.entries(catBoard).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${cat}: ${JSON.stringify(boards)}`);
  }

  console.log("\nper-board live qaPassed before -> after:");
  for (const field of Object.keys(beforeBoard).sort()) {
    const b = beforeBoard[field] ?? 0;
    const a = afterBoard[field] ?? 0;
    if (b !== a) console.log(`  ${field}: ${b} -> ${a}`);
  }
  const unchanged = Object.keys(beforeBoard).filter((f) => beforeBoard[f] === afterBoard[f]);
  if (unchanged.length) console.log(`  unchanged boards: ${unchanged.length}`);

  if (!apply) {
    console.log("\nNo writes.");
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  for (const id of hideSet) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "${BACKUP_TABLE}"
      SELECT q.*, now() AS backed_up_at
      FROM "QuestionBankItem" q
      WHERE q.id = $1
        AND NOT EXISTS (SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = q.id)
      `,
      id
    );
    await prisma.questionBankItem.update({
      where: { id },
      data: { qaPassed: false },
    });
  }

  console.log(`\nApplied hide to ${hideSet.size} rows. Backup: ${BACKUP_TABLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
