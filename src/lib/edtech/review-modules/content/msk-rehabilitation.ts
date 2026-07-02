import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** MSK rehabilitation — highest-yield NPTE-PT musculoskeletal domain. */
export const MSK_REHABILITATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Musculoskeletal content is the largest NPTE-PT category (~28%). Items test examination findings, special tests, exercise dosage, manual therapy indications, and post-operative progression for shoulder, spine, hip, and knee conditions.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Shoulder: impingement vs rotator cuff tear — painful arc, weakness with cuff tears",
        "Spine: centralization with repeated movements suggests discogenic pain amenable to directional preference",
        "Knee: ACL rehab phased by graft healing, ROM milestones, and quad activation",
        "Hip: post-THA posterior precautions vs anterior approach restrictions differ by surgeon protocol",
        "Outcome measures: DASH, LEFS, Oswestry — know when each applies",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Rotator cuff: scapular stabilization + progressive loading; avoid painful overhead early",
        "Lumbar radiculopathy: extension or flexion bias per assessment; avoid peripheralization",
        "TKA: patellar mobilization, quad sets, ROM goals; monitor swelling and extension lag",
        "Manual therapy: joint mobilization grades matched to irritability and stage of healing",
        "Return-to-sport after ACL: hop tests, symmetry, and psychological readiness",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Shoulder differential — exam findings and first-line care",
          headers: ["Condition", "Hallmark finding", "Key intervention"],
          rows: [
            ["Subacromial impingement", "Painful arc 60–120°, + Hawkins-Kennedy", "Scapular stabilization, posture, activity modification"],
            ["Full-thickness cuff tear", "+ Drop arm, weakness > pain", "Progressive loading; surgical referral if functional loss"],
            ["Adhesive capsulitis", "Global passive ROM loss (ER lost first)", "Mobilization, stretching, time-based staging"],
            ["AC joint sprain", "Point tenderness, + cross-body adduction", "Relative rest, scapular/cuff strengthening"],
          ],
        },
        {
          caption: "Total hip arthroplasty precautions by surgical approach",
          headers: ["Approach", "Avoid", "Typical focus"],
          rows: [
            ["Posterolateral", "Flexion >90°, adduction, internal rotation", "Bridging to functional mobility within precautions"],
            ["Anterior", "Extension, external rotation, adduction", "Early gait; watch hip extension in terminal stance"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Shoulder special-test cluster flow: painful arc → Hawkins-Kennedy → empty can → drop arm",
        "ACL rehab timeline: protect graft → restore ROM/quad control → strengthen → agility/plyometrics → return-to-sport testing",
        "Lumbar directional-preference map: centralization = continue; peripheralization = stop and reassess",
        "Irritability ladder linking high/moderate/low irritability to mobilization grade and exercise dose",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "More mobilization is always better — match grade to irritability; high irritability needs gentle, pain-free dosing",
        "Avoid all loading after a rotator cuff injury — progressive loading is therapeutic; protect, don't needlessly immobilize",
        "Stretch through radicular leg pain — peripheralization signals the wrong direction; stop and reassess",
        "One set of THA precautions fits all — restrictions depend on the surgical approach and surgeon protocol",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Empty can is less provocative than full can for supraspinatus testing in impingement",
        "Red-flag back pain → refer before aggressive manual therapy",
        "Closed-chain exercises improve patellofemoral tolerance in early knee rehab",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Examine → classify irritability → match intervention intensity",
        "Post-op protocols are surgeon-specific — know common precautions",
        "Functional outcome measures anchor goal writing and discharge",
      ],
    },
  ],
};
