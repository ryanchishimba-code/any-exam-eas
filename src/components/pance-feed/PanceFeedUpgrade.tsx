import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { STUDY_FEEDS, type StudyFeedBoard } from "@/lib/study-feed/catalog";

/** Signed-in learners without a paid plan. No card text is rendered here. */
export function PanceFeedUpgrade({ board = STUDY_FEEDS.pance }: { board?: StudyFeedBoard }) {
  const back = encodeURIComponent(board.href);
  return (
    <div className="pf-gate" data-testid={`${board.testId}-upgrade`}>
      <div className="pf-gate-card">
        <p className="pf-gate-kicker">Paid plan</p>
        <h1>{board.label}</h1>
        <p>
          Swipe a full-screen deck of {board.label.replace(" Feed", "")} cards. Got it, Review
          again, and the card you last saw stay in sync on every device with a paid plan.
        </p>
        <div className="pf-gate-actions">
          <Link className="pf-gate-primary" href={`${ROUTES.upgrade}?return=${back}`}>
            Upgrade
          </Link>
          <Link className="pf-gate-secondary" href={`${ROUTES.pricing}?paywall=1`}>
            Compare plans
          </Link>
          <Link className="pf-gate-text" href={ROUTES.dashboard}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
