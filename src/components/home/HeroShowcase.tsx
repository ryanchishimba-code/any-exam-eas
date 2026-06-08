"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_IMAGE_ALT, HERO_IMAGE_PATH } from "@/lib/hero-assets";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full">
      <motion.figure
        className="aee-showcase-frame aee-showcase-frame-vibrant aee-showcase-frame-impact"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="relative aspect-[4/5] max-h-[480px] sm:aspect-[5/6]">
          <Image
            src={HERO_IMAGE_PATH}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 460px"
            className="object-cover object-center"
          />
          <div className="aee-showcase-overlay-vibrant" aria-hidden />
        </div>
      </motion.figure>

      <motion.div
        className="aee-showcase-float-card aee-showcase-float-card--questions absolute -left-2 top-10 z-10 sm:-left-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        aria-hidden
      >
        <p className="text-3xl font-extrabold tracking-tight text-teal-700">
          {MARKETING_QUESTION_COUNTS.total}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Questions
        </p>
      </motion.div>
    </div>
  );
}
