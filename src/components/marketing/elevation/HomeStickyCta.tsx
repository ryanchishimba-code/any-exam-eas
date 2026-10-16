"use client";

import { useEffect, useState } from "react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

/** Mobile-only bar. Hidden while the hero or closing CTA is already on screen. */
export function HomeStickyCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const hero = document.querySelector(".home-hero__actions");
    const close = document.querySelector(".home-close");
    if (!hero) return;

    let heroVisible = true;
    let closeVisible = false;

    const update = () => {
      setShow(mq.matches && !heroVisible && !closeVisible);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = Boolean(entry?.isIntersecting);
        update();
      },
      { threshold: 0.2 }
    );
    heroObserver.observe(hero);

    let closeObserver: IntersectionObserver | null = null;
    if (close) {
      closeObserver = new IntersectionObserver(
        ([entry]) => {
          closeVisible = Boolean(entry?.isIntersecting);
          update();
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.15 }
      );
      closeObserver.observe(close);
    }

    mq.addEventListener("change", update);
    update();

    return () => {
      heroObserver.disconnect();
      closeObserver?.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="home-sticky">
      <LandingCta href={LANDING_TRIAL_HREF} ctaName="home_sticky_trial" location="home_sticky">
        {label}
      </LandingCta>
    </div>
  );
}
