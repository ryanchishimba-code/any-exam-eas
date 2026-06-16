import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** MSK rehabilitation — highest-yield NPTE-PT musculoskeletal domain. */
export const MSK_REHABILITATION_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Musculoskeletal content is the largest NPTE-PT category (~20%). Items test examination findings, special tests, exercise dosage, manual therapy indications, and post-operative progression for shoulder, spine, hip, and knee conditions.",
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
