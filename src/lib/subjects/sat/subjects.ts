import type { SubjectArea } from "../types";

export const SAT_SUBJECTS: SubjectArea[] = [
  {
    id: "sat-math",
    label: "SAT Math",
    textbookRefs: "OpenStax Algebra, College Algebra, Khan Academy SAT Math",
    examHints: "linear equations, systems, quadratics, data analysis, geometry, trigonometry",
    keywords: ["algebra", "geometry", "statistics", "sat math", "word problem"],
    focusPlaceholder: "e.g. Systems of linear equations",
  },
  {
    id: "sat-reading",
    label: "SAT Reading & Writing",
    textbookRefs: "College Board SAT Suite, OpenStax Writing Guide",
    examHints: "evidence-based reading, rhetoric, grammar, transitions, vocabulary in context",
    keywords: ["reading comprehension", "grammar", "rhetoric", "evidence", "main idea"],
    focusPlaceholder: "e.g. Command of Evidence",
  },
  {
    id: "sat-adaptive",
    label: "Digital SAT (Adaptive)",
    textbookRefs: "College Board Digital SAT specifications",
    examHints: "module difficulty adaptation, multistage testing concepts, timing strategy",
    keywords: ["adaptive", "digital sat", "module", "timing"],
    focusPlaceholder: "e.g. Module 2 harder route prep",
  },
];
