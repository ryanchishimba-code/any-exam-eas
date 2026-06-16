/**
 * CI entry point for curated question-bank editorial QA.
 * Register new hand-crafted batches here after adding their assert* helper.
 */
import { describe, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-02";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-03";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-04";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_05 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-05";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_06 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-06";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_07 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-07";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_08 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-08";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_09 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-09";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_10 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-10";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_11 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-11";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_12 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-12";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_13 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-13";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_14 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-14";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_15 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-15";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_16 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-16";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_17 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-17";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_18 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-18";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_19 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-19";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_20 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-20";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_21 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-21";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_22 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-22";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_23 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-23";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_24 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-24";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_25 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-25";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_26 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-26";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_27 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-27";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_28 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-28";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_29 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-29";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_30 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-30";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_31 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-31";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_32 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-32";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_33 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-33";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_34 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-34";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_35 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-35";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_36 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-36";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_37 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-37";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_38 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-38";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_39 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-39";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_40 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-40";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_41 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-41";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_42 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-42";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_43 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-43";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";
import { assertMpjePhysicianEducatorQuality } from "./mpje-physician-educator-quality";
import { assertNaplexPhysicianEducatorQuality } from "./naplex-physician-educator-quality";
import { assertUsmlePhysicianEducatorQuality } from "./usmle-physician-educator-quality";
import { assertNclexCuratedSeedQuality } from "./nclex-curated-seeds-quality";
import { NCLEX_CURATED_QUALITY } from "./nclex-curated-quality";
import { assertNaplexSeedBatchQuality } from "./naplex-seed-qa";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { NAPLEX_CALC_CASES_V3 } from "./naplex-calc-cases-v3";
import { NAPLEX_AREA3_V3 } from "./naplex-area3-v3";
import { NAPLEX_VIGNETTE_SEEDS } from "./vignette-seeds";
import { assertPancePhysicianEducatorQuality } from "@/lib/exam-prep/pance/physician-educator-quality";
import { collectPanceSeedItems } from "@/lib/edtech/seeds/pance-seed-registry";

describe("Question seed QA gate", () => {
  it("USMLE physician-educator batch 01 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("USMLE physician-educator batch 02 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("USMLE physician-educator batch 03 (curated vignettes)", () => {
    assertUsmlePhysicianEducatorQuality(USMLE_PHYSICIAN_EDUCATOR_BATCH_03);
  });

  it("NAPLEX physician-educator batch 01 (curated pharmacy items)", () => {
    assertNaplexPhysicianEducatorQuality(NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("PANCE physician-educator seeds (clinical vignettes)", () => {
    assertPancePhysicianEducatorQuality(collectPanceSeedItems());
  });

  it("MPJE physician-educator batch 01 (curated jurisprudence items)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_01);
  });

  it("MPJE physician-educator batch 02 (DEA, HIPAA, USP 797, NY/PA/NJ)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_02);
  });

  it("MPJE physician-educator batch 03 (USP 795, ethics, transfers, CA/TX)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_03);
  });

  it("MPJE physician-educator batch 04 (REMS, DSCSA, tech scope, USP 800, FL/OH/IL)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_04);
  });

  it("MPJE physician-educator batch 05 (partial fills, validity, immunizations, GA/PA/NJ)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_05);
  });

  it("MPJE physician-educator batch 06 (labeling, counsel, inspections, PDMP, OK/MO/VA)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_06);
  });

  it("MPJE physician-educator batch 07 (substitution, DUR, emergency C-II, LTC, NC/MA/WA)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_07);
  });

  it("MPJE physician-educator batch 08 (EPCS, returns, whistleblower, inventory, AZ/CO/MN)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_08);
  });

  it("MPJE physician-educator batch 09 (telepharmacy, waste, tech registration, inspection, SC/TN/KY)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_09);
  });

  it("MPJE physician-educator batch 10 (central fill, transfers, emergency prep, PIC, WI/IN/MI)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_10);
  });

  it("MPJE physician-educator batch 11 (CPA, vaccines, DSCSA returns, intern, LA/AL/MS)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_11);
  });

  it("MPJE physician-educator batch 12 (MTM, shortage, security, UMPJE, UT/ID/NV)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_12);
  });

  it("MPJE physician-educator batch 13 (BUD, counseling refusal, payer audits, automation, HI/AK/MT)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_13);
  });

  it("MPJE physician-educator batch 14 (prescriber red flags, partial fills, DIR, harassment, NM/WY/ND)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_14);
  });

  it("MPJE physician-educator batch 15 (REMS follow-up, PAP, hazard comm, discipline, SD/NE/KS)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_15);
  });

  it("MPJE physician-educator batch 16 (recalls, opioid disposal, lab interface, relief, IA/AR/CT)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_16);
  });

  it("MPJE physician-educator batch 17 (503A office-use, expiration, social media, DUR, DE/RI/VT)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_17);
  });

  it("MPJE physician-educator batch 18 (shortages, veterinary, NPI fraud, closure, ME/NH/WV)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_18);
  });

  it("MPJE physician-educator batch 19 (503B, auxiliary labels, workers comp, tech ratio, MD/DC/PR)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_19);
  });

  it("MPJE physician-educator batch 20 (340B, MTM docs, interstate compounding, HIPAA breach, OK/PA/OH)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_20);
  });

  it("MPJE physician-educator batch 21 (DIR audits, take-back, OBRA substitution, negligence, GA/SC/NC)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_21);
  });

  it("MPJE physician-educator batch 22 (Ryan Haight, Med Sync, USP-800, anti-kickback, VA/WV/KY)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_22);
  });

  it("MPJE physician-educator batch 23 (PREP Act, lab interface, interchange, board consent, TN/MO/MS)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_23);
  });

  it("MPJE physician-educator batch 24 (DSCSA returns, EC, BUD audits, eRx retention, AZ/NM/UT)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_24);
  });

  it("MPJE physician-educator batch 25 (REMS follow-up, central fill, 503A office-use, whistleblower, CO/ID/WY)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_25);
  });

  it("MPJE physician-educator batch 26 (USP-797 BUD, importation, PBM appeals, PAP, NV/ND/SD)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_26);
  });

  it("MPJE physician-educator batch 27 (telehealth, OSHA, forgery, NDC billing, MT/AK/HI)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_27);
  });

  it("MPJE physician-educator batch 28 (LTC consultant, emergency C-II, transfer, security, OR/MA/NH)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_28);
  });

  it("MPJE physician-educator batch 29 (USP-800, conscience, C-II LTC partial, mail-order, MN/WI/IN)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_29);
  });

  it("MPJE physician-educator batch 30 (FDA recalls, immunization AE, EPCS fraud, workers comp, IL/MI/OH)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_30);
  });

  it("MPJE physician-educator batch 31 (HIPAA minimum necessary, inspection, naloxone, DIR, GA/PA/NJ)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_31);
  });

  it("MPJE physician-educator batch 32 (340B, MTM billing, samples, tech ratio, CA/TX/FL)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_32);
  });

  it("MPJE physician-educator batch 33 (anti-kickback, accumulator/PAP, Rx validity, closure, NY/PA/NJ)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_33);
  });

  it("MPJE physician-educator batch 34 (Ryan Haight, DSCSA returns, board consent, emergency supply, VA/NC/SC)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_34);
  });

  it("MPJE physician-educator batch 35 (PREP Act, lab critical values, interchange, whistleblower, TN/MO/MS)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_35);
  });

  it("MPJE physician-educator batch 36 (REMS deeper, central fill, 503A office-use, Med Sync billing, CO/ID/WY)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_36);
  });

  it("MPJE physician-educator batch 37 (DSCSA returns, intern/preceptor, MTM, shortage, ND/SD/MT)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_37);
  });

  it("MPJE physician-educator batch 38 (EPCS credentialing, LTC kit, inspection, pregnancy, UT/AZ/NM)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_38);
  });

  it("MPJE physician-educator batch 39 (workers comp/MSA, veterinary, reverse dist, social media, NE/KS/OK)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_39);
  });

  it("MPJE physician-educator batch 40 (Ryan Haight, USP-795, DIR, disaster prep, IA/MN/WI)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_40);
  });

  it("MPJE physician-educator batch 41 (340B, auxiliary/LEP, NPI fraud, Rx validity, AR/LA/MS)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_41);
  });

  it("MPJE physician-educator batch 42 (anti-kickback, USP-800, partial fill, counseling, NV/UT/ID)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_42);
  });

  it("MPJE physician-educator batch 43 (HIPAA breach, DEA inventory, Rx transfer, bloodborne, MA/CT/RI)", () => {
    assertMpjePhysicianEducatorQuality(MPJE_PHYSICIAN_EDUCATOR_BATCH_43);
  });

  it("NCLEX curated quality (high-yield vignettes)", () => {
    assertNclexCuratedSeedQuality(NCLEX_CURATED_QUALITY, "NCLEX_CURATED_QUALITY");
  });

  it("NAPLEX quality v2 seed batch (50 board-style items)", () => {
    assertNaplexSeedBatchQuality(NAPLEX_QUALITY_V2, "NAPLEX_QUALITY_V2");
  });

  it("NAPLEX calc cases v3 (constructed response)", () => {
    assertNaplexSeedBatchQuality(NAPLEX_CALC_CASES_V3, "NAPLEX_CALC_CASES_V3");
  });

  it("NAPLEX area 3 v3 vignettes", () => {
    assertNaplexSeedBatchQuality(NAPLEX_AREA3_V3, "NAPLEX_AREA3_V3");
  });

  it("NAPLEX vignette seeds", () => {
    assertNaplexSeedBatchQuality(NAPLEX_VIGNETTE_SEEDS, "NAPLEX_VIGNETTE_SEEDS");
  });
});
