"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingSectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  align?: "left" | "center";
  alt?: boolean;
};

export function LandingSection({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  innerClassName = "",
  align = "left",
  alt = false,
}: LandingSectionProps) {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id={id}
      className={cn(
        "aee-flagship-section scroll-mt-24",
        alt && "aee-flagship-section--alt",
        className
      )}
    >
      <motion.div className={cn("aee-flagship-inner", innerClassName)} {...motionProps}>
        <header
          className={cn(
            "aee-flagship-header",
            align === "center" && "aee-flagship-header--center mx-auto max-w-2xl text-center"
          )}
        >
          {eyebrow ? (
            <p className="aee-flagship-eyebrow">{eyebrow}</p>
          ) : null}
          <h2 className="aee-flagship-title">{title}</h2>
          {subtitle ? <p className="aee-flagship-subtitle">{subtitle}</p> : null}
        </header>
        {children}
      </motion.div>
    </section>
  );
}
