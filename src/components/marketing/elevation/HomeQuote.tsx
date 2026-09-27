"use client";

import { useState } from "react";
import type { LandingSuccessStory } from "@/lib/landing/content";

/** One consented quote at a time. Renders nothing when the database has none. */
export function HomeQuote({ stories }: { stories: LandingSuccessStory[] }) {
  const approved = stories.filter((story) => story.quote && story.name);
  const [index, setIndex] = useState(0);
  if (approved.length === 0) return null;

  const story = approved[index % approved.length];
  if (!story) return null;

  function step(delta: number) {
    setIndex((current) => (current + delta + approved.length) % approved.length);
  }

  return (
    <section className="home-quote home-rise" aria-roledescription="carousel" aria-label="Student quotes">
      <figure>
        <blockquote>
          <p>“{story.quote}”</p>
        </blockquote>
        <figcaption>
          {story.name}
          {story.exam ? ` · ${story.exam}` : ""}
        </figcaption>
      </figure>
      {approved.length > 1 ? (
        <div className="home-quote__controls">
          <button type="button" aria-label="Previous quote" onClick={() => step(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Next quote" onClick={() => step(1)}>
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}
