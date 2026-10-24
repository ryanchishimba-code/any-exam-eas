"use client";

import { useCallback, useEffect, useId, useState } from "react";
import dynamic from "next/dynamic";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";

const FreeQuizPlayer = dynamic(
  () =>
    import("@/components/marketing/free-quiz/FreeQuizPlayer").then((mod) => mod.FreeQuizPlayer),
  { ssr: false, loading: () => <p className="bl-free-quiz__status" role="status">Loading questions…</p> }
);

function hashOpensQuiz(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hash.replace(/^#/, "") === "quiz";
}

export function BoardFreeQuizSection({ board }: { board: FreeQuizBoardSlug }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activated, setActivated] = useState(false);

  const openPanel = useCallback(() => {
    setOpen(true);
    setActivated(true);
  }, []);

  useEffect(() => {
    if (hashOpensQuiz()) openPanel();
    const onHash = () => {
      if (hashOpensQuiz()) openPanel();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [openPanel]);

  return (
    <section
      id="quiz"
      className="bl-section bl-section--tight bl-free-quiz"
      aria-labelledby={`${panelId}-heading`}
    >
      <h2 id={`${panelId}-heading`}>Free 10-question quiz</h2>
      <p className="bl-section-lede">
        Student-eligible items from the live bank. No account required.
      </p>
      <div className="bl-card bl-free-quiz__shell">
        <button
          type="button"
          className="bl-free-quiz__toggle"
          aria-expanded={open}
          aria-controls={`${panelId}-panel`}
          onClick={() => {
            if (!open) setActivated(true);
            setOpen((value) => !value);
          }}
        >
          <span>{open ? "Hide quiz" : "Open quiz"}</span>
        </button>
        {open ? (
          <div id={`${panelId}-panel`} className="bl-free-quiz__panel">
            {activated ? <FreeQuizPlayer board={board} /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
