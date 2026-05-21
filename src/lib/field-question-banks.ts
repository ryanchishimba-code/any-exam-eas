import type { BankItem } from "./question-bank";

function item(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correctAnswer: string,
  explanation: string,
  solutionSteps?: string[],
  tags: string[] = []
): BankItem {
  return { subjectId, question, options, correctAnswer, explanation, solutionSteps, tags };
}

/** Questions tagged by subject — only served when that subject is selected */
export const FIELD_QUESTION_BANKS: Record<string, BankItem[]> = {
  mathematics: [
    // Calculus only
    item("calculus", "What is the derivative of f(x) = x²?", ["2x", "x", "x²", "2"], "2x", "Power rule: d/dx(xⁿ) = n·xⁿ⁻¹.", [
      "Identify the function f(x) = x²",
      "Apply the power rule: d/dx(xⁿ) = n·xⁿ⁻¹",
      "Here n = 2, so the derivative is 2·x²⁻¹ = 2x",
    ], ["derivative"]),
    item("calculus", "What is the derivative of sin(x)?", ["cos(x)", "−cos(x)", "sin(x)", "−sin(x)"], "cos(x)", "d/dx sin x = cos x.", [
      "Recall the standard derivative: d/dx[sin(x)] = cos(x)",
      "No chain rule is needed because the argument is x",
      "Therefore the derivative is cos(x)",
    ], ["derivative"]),
    item("calculus", "∫ 2x dx equals:", ["x² + C", "2x² + C", "x + C", "2 + C"], "x² + C", "Reverse power rule.", [
      "Recognize ∫ 2x dx as integration of a power function",
      "Use ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C with n = 1",
      "∫ 2x dx = 2 · x²/2 + C = x² + C",
    ], ["integral"]),
    item("calculus", "The limit of (sin x)/x as x → 0 is:", ["1", "0", "∞", "undefined"], "1", "Standard limit used in calculus.", ["limit", "high-yield"]),
    item("calculus", "The chain rule is used to differentiate:", ["Composite functions", "Only polynomials", "Only constants", "Definite integrals only"], "Composite functions", "If y = f(g(x)), use chain rule.", ["derivative"]),
    item("calculus", "A function has a local maximum where f′(x) = 0 and:", ["f″(x) < 0", "f″(x) > 0", "f(x) = 0", "f″(x) = 0 always"], "f″(x) < 0", "Second derivative test.", ["applications"]),
    item("calculus", "∫₀¹ x dx equals:", ["1/2", "1", "0", "2"], "1/2", "Area under y = x from 0 to 1.", ["integral"]),
    item("calculus", "Which rule applies to ∫ x·eˣ dx?", ["Integration by parts", "Partial fractions only", "Substitution only", "No rule — cannot integrate"], "Integration by parts", "Product of polynomial and exponential.", ["integral"]),
    item("calculus", "The derivative of ln(x) for x > 0 is:", ["1/x", "x", "ln(x)", "eˣ"], "1/x", "Standard logarithmic derivative.", ["derivative"]),
    item("calculus", "An infinite series converges if its sequence of partial sums:", ["Has a finite limit", "Always increases", "Oscillates forever", "Equals zero"], "Has a finite limit", "Definition of series convergence.", ["series"]),
    // Algebra
    item("algebra", "Solve for x: 2x + 6 = 14", ["x = 4", "x = 10", "x = 2", "x = 8"], "x = 4", "2x = 8 → x = 4.", ["linear"]),
    item("algebra", "What is the slope of y = −3x + 7?", ["−3", "7", "3", "−7"], "−3", "Slope-intercept form y = mx + b.", ["linear"]),
    item("algebra", "The quadratic formula is:", ["x = (−b ± √(b² − 4ac)) / 2a", "x = b/2a", "x = −c/b", "x = a + b + c"], "x = (−b ± √(b² − 4ac)) / 2a", "Solves ax² + bx + c = 0.", ["quadratic", "high-yield"]),
    item("algebra", "Factoring x² − 9 gives:", ["(x − 3)(x + 3)", "(x − 9)(x + 9)", "x(x − 9)", "(x − 3)²"], "(x − 3)(x + 3)", "Difference of squares.", ["factoring"]),
    // Geometry
    item("geometry", "The area of a circle with radius r is:", ["πr²", "2πr", "πr", "r²"], "πr²", "A = πr².", ["area"]),
    item("geometry", "In a right triangle with legs 3 and 4, the hypotenuse is:", ["5", "7", "12", "25"], "5", "3-4-5 triple.", ["pythagorean"]),
    // Trigonometry
    item("trigonometry", "sin²θ + cos²θ equals:", ["1", "0", "sin 2θ", "tan θ"], "1", "Pythagorean identity.", ["identity", "high-yield"]),
    item("trigonometry", "cos(0°) equals:", ["1", "0", "−1", "undefined"], "1", "Unit circle value.", ["unit circle"]),
    // Statistics
    item("statistics", "The mean of 2, 4, 6, 8, 10 is:", ["6", "5", "8", "4"], "6", "Sum 30 / 5 = 6.", ["descriptive"]),
    item("statistics", "In a normal distribution, about 68% of data fall within:", ["±1 standard deviation", "±2 standard deviations", "The median only", "The mode only"], "±1 standard deviation", "Empirical rule.", ["probability"]),
  ],
  biology: [
    item("cell-biology", "The powerhouse of the cell is the:", ["Mitochondrion", "Nucleus", "Ribosome", "Golgi"], "Mitochondrion", "ATP production via oxidative phosphorylation.", ["organelles"]),
    item("genetics", "DNA replication is semiconservative, meaning:", ["One old and one new strand per duplex", "Two new strands only", "RNA only", "No parental DNA"], "One old and one new strand per duplex", "Meselson-Stahl experiment.", ["DNA"]),
  ],
  chemistry: [
    item("general", "Avogadro's number is approximately:", ["6.02 × 10²³", "3.00 × 10⁸", "1.60 × 10⁻¹⁹", "9.81"], "6.02 × 10²³", "Particles per mole.", ["high-yield"]),
    item("organic", "Methane (CH₄) has hybridization:", ["sp³", "sp²", "sp", "dsp³"], "sp³", "Tetrahedral → sp³.", ["bonding"]),
  ],
  physics: [
    item("mechanics", "Newton's second law: F equals:", ["ma", "mv", "m/a", "m + a"], "ma", "ΣF = ma.", ["high-yield"]),
    item("em", "Ohm's law states V equals:", ["IR", "I/R", "R/I", "I + R"], "IR", "Voltage = current × resistance.", ["circuits"]),
  ],
  medicine: [
    item("anatomy", "Blood belongs to which primary tissue type?", ["Epithelial", "Connective", "Muscle", "Nervous"], "Connective", "Blood is fluid connective tissue.", ["histology", "high-yield"]),
    item("physiology", "ADH increases water reabsorption by inserting:", ["Aquaporin-2", "Na/K pump only", "Cl channels", "Bicarbonate exchangers"], "Aquaporin-2", "Collecting duct permeability.", ["renal"]),
  ],
  nursing: [
    item("fundamentals", "First priority in ABCDE assessment is:", ["Airway", "Breathing", "Circulation", "Disability"], "Airway", "Airway before breathing.", ["NCLEX"]),
  ],
  engineering: [
    item("statics", "Stress is defined as:", ["Force / Area", "Force × Area", "Mass / Volume", "Length / Time"], "Force / Area", "σ = F/A.", ["mechanics"]),
  ],
  law: [
    item("torts", "Negligence foreseeability relates most to:", ["Duty", "Breach only", "Damages only", "Strict liability"], "Duty", "Duty includes foreseeable risk.", ["torts"]),
  ],
  business: [
    item("finance", "Current ratio equals:", ["Current assets / Current liabilities", "Net income / Sales", "Debt / Equity", "Cash / Inventory"], "Current assets / Current liabilities", "Liquidity ratio.", ["ratios"]),
  ],
  history: [
    item("world-history", "The Enlightenment emphasized:", ["Reason and individual rights", "Divine right only", "Feudalism only", "Isolationism"], "Reason and individual rights", "Intellectual movement.", ["modern"]),
  ],
  psychology: [
    item("intro", "Classical conditioning was pioneered by:", ["Pavlov", "Skinner", "Freud", "Piaget"], "Pavlov", "Conditioned reflexes in dogs.", ["learning"]),
  ],
  "computer-science": [
    item("algorithms", "Binary search on n sorted elements is:", ["O(log n)", "O(n)", "O(n²)", "O(1)"], "O(log n)", "Halving search space.", ["high-yield"]),
  ],
  "middle-school": [
    item("pre-algebra", "3/4 + 1/2 in simplest form:", ["5/4", "4/6", "2/3", "1/4"], "5/4", "3/4 + 2/4 = 5/4.", ["fractions"]),
  ],
  "high-school": [
    item("ap-biology", "Photosynthesis produces:", ["Glucose and O₂", "CO only", "N₂", "Methane"], "Glucose and O₂", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.", ["biology"]),
  ],
};
