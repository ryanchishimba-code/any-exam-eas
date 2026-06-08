"use client";

import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Brain,
  HeartPulse,
  Lightbulb,
  Pill,
  Shield,
  Target,
} from "lucide-react";
import { DRUG_CLASSES } from "@/lib/drugs300/drug-classes";
import { cn } from "@/lib/utils";

const SAMPLE_CARDS = [
  {
    id: "metformin",
    generic: "Metformin",
    brand: "Glucophage®",
    classId: "endocrine" as const,
    rotate: "-rotate-[7deg]",
    offset: "translate-x-[-8%] translate-y-[6%]",
    z: "z-[1]",
    scale: "scale-[0.92]",
    fields: [
      { icon: Target, label: "Type 2 diabetes", tone: "violet" },
      { icon: AlertTriangle, label: "GI upset, B12", tone: "amber" },
    ],
  },
  {
    id: "lisinopril",
    generic: "Lisinopril",
    brand: "Prinivil®",
    classId: "cardiovascular" as const,
    rotate: "rotate-0",
    offset: "translate-y-[-4%]",
    z: "z-[3]",
    scale: "scale-100",
    fields: [
      { icon: HeartPulse, label: "HTN, HFrEF", tone: "rose" },
      { icon: AlertTriangle, label: "Dry cough, ↑ K⁺", tone: "amber" },
    ],
    featured: true,
  },
  {
    id: "amoxicillin",
    generic: "Amoxicillin",
    brand: "Amoxil®",
    classId: "antibiotics" as const,
    rotate: "rotate-[7deg]",
    offset: "translate-x-[8%] translate-y-[6%]",
    z: "z-[2]",
    scale: "scale-[0.94]",
    fields: [
      { icon: Shield, label: "Bacterial infections", tone: "sky" },
      { icon: AlertTriangle, label: "Rash, diarrhea", tone: "amber" },
    ],
  },
] as const;

const CLASS_DOTS = DRUG_CLASSES.filter((c) => c.id !== "all").slice(0, 6);

type Props = {
  className?: string;
  variant?: "panel" | "feature";
};

export function Top500DrugsVisual({ className, variant = "panel" }: Props) {
  return (
    <figure
      className={cn(
        "aee-top500-visual relative overflow-hidden",
        variant === "feature" ? "aee-top500-visual--feature" : "aee-top500-visual--panel",
        className
      )}
      aria-label="Top 500 pharmacology flashcards with color-coded drug classes"
    >
      <div className="aee-top500-visual__mesh pointer-events-none" aria-hidden />
      <div className="aee-top500-visual__glow aee-top500-visual__glow--teal" aria-hidden />
      <div className="aee-top500-visual__glow aee-top500-visual__glow--violet" aria-hidden />
      <div className="aee-top500-visual__glow aee-top500-visual__glow--sky" aria-hidden />

      <div className="aee-top500-visual__badge" aria-hidden>
        <Pill className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span>500 drugs</span>
      </div>

      <div className="aee-top500-visual__stage">
        {SAMPLE_CARDS.map((card) => {
          const drugClass = DRUG_CLASSES.find((c) => c.id === card.classId)!;
          return (
            <article
              key={card.id}
              className={cn(
                "aee-top500-visual__card",
                card.rotate,
                card.offset,
                card.z,
                card.scale,
                card.featured && "aee-top500-visual__card--featured"
              )}
              style={{ "--card-accent": drugClass.color } as CSSProperties}
            >
              <div
                className="aee-top500-visual__card-bar"
                style={{ backgroundColor: drugClass.color }}
                aria-hidden
              />
              <div className="aee-top500-visual__card-icon" aria-hidden>
                <Pill className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <p className="aee-top500-visual__generic">{card.generic}</p>
              <p className="aee-top500-visual__brand">{card.brand}</p>
              <span
                className="aee-top500-visual__class-pill"
                style={{
                  backgroundColor: `${drugClass.color}18`,
                  color: drugClass.color,
                  borderColor: `${drugClass.color}40`,
                }}
              >
                {drugClass.shortLabel}
              </span>
              <ul className="aee-top500-visual__fields">
                {card.fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <li key={field.label} className={`aee-top500-visual__field aee-top500-visual__field--${field.tone}`}>
                      <Icon className="h-3 w-3 shrink-0" strokeWidth={2.25} aria-hidden />
                      <span>{field.label}</span>
                    </li>
                  );
                })}
              </ul>
              {card.featured ? (
                <p className="aee-top500-visual__mnemonic">
                  <Lightbulb className="h-3 w-3 shrink-0" aria-hidden />
                  <span>Lisinopril — ACE the pressure</span>
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <ul className="aee-top500-visual__classes" aria-hidden>
        {CLASS_DOTS.map((cls) => (
          <li key={cls.id} title={cls.label}>
            <span className="aee-top500-visual__class-dot" style={{ backgroundColor: cls.color }} />
            <span className="aee-top500-visual__class-label">{cls.shortLabel}</span>
          </li>
        ))}
      </ul>

      <div className="aee-top500-visual__footer">
        <Brain className="h-3 w-3 text-violet-500" aria-hidden />
        <span>Generic · Brand · MOA · Adverse effects</span>
      </div>

      <figcaption className="sr-only">
        Vibrant pharmacology flashcards for Metformin, Lisinopril, and Amoxicillin with
        color-coded therapeutic classes
      </figcaption>
    </figure>
  );
}
