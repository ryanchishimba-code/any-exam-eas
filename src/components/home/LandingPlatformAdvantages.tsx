"use client";

import {
 BarChart3,
 BookOpenCheck,
 Calculator,
 FlaskConical,
 Map,
 GraduationCap,
 type LucideIcon,
} from "lucide-react";

export type PlatformAdvantage = {
 icon: LucideIcon;
 title: string;
 description: string;
};

export const LANDING_PLATFORM_ADVANTAGES: PlatformAdvantage[] = [
 {
 icon: Map,
 title: "Exam Roadmaps",
 description:
 "Blueprint-aligned Roadmaps for each exam show where you stand and what to study next — category by category.",
 },
 {
 icon: GraduationCap,
 title: "Deep Dive lessons",
 description:
 "Eight-section Review Modules on high-yield topics open straight from missed questions and weak-area cards.",
 },
 {
 icon: BookOpenCheck,
 title: "Questions you can trust",
 description:
 "Clinical vignettes with aligned stems, answer choices, and rationales written to teach — not just mark right or wrong.",
 },
 {
 icon: BarChart3,
 title: "Performance analytics",
 description:
 "Track accuracy by topic, spot weak areas early, and launch targeted practice from your dashboard.",
 },
 {
 icon: FlaskConical,
 title: "Normal lab values",
 description:
 "Quick-reference ranges in the Library so you can interpret stems without leaving your study session.",
 },
 {
 icon: Calculator,
 title: "Clinical calculators",
 description:
 "BMI, dosing by weight, IV flow rates, BSA, and more — with formulas and step-by-step math at your fingertips.",
 },
];

type Props = {
 variant?: "grid" | "compact";
 className?: string;
};

export function LandingPlatformAdvantages({ variant = "grid", className = "" }: Props) {
 if (variant === "compact") {
 return (
 <ul
 className={`aee-flagship-hero__advantages-compact ${className}`.trim()}
 aria-label="Platform highlights"
 >
 {LANDING_PLATFORM_ADVANTAGES.map(({ icon: Icon, title }) => (
 <li key={title} className="aee-flagship-hero__advantage-chip">
 <Icon className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" strokeWidth={2.25} aria-hidden />
 {title}
 </li>
 ))}
 </ul>
 );
 }

 return (
 <ul className={`aee-platform-advantages ${className}`.trim()}>
 {LANDING_PLATFORM_ADVANTAGES.map(({ icon: Icon, title, description }, i) => (
 <li
 key={title}
 className="aee-platform-advantage aee-reveal"
 style={{ animationDelay: `${i * 45}ms` }}
 >
 <span className="aee-platform-advantage__icon" aria-hidden>
 <Icon className="h-5 w-5 text-white" strokeWidth={2} />
 </span>
 <h3 className="aee-platform-advantage__title">{title}</h3>
 <p className="aee-platform-advantage__detail">{description}</p>
 </li>
 ))}
 </ul>
 );
}
