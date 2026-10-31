import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const RETURN = encodeURIComponent(ROUTES.panceFeed);

/** Signed-in learners without a paid plan. No card text is rendered here. */
export function PanceFeedUpgrade() {
  return (
    <div className="pf-gate" data-testid="pance-feed-upgrade">
      <div className="pf-gate-card">
        <p className="pf-gate-kicker">Paid plan</p>
        <h1>PANCE Feed</h1>
        <p>
          Swipe a full-screen deck of PANCE cards. Got it, Review again, and the card you
          last saw stay in sync on every device with a paid plan.
        </p>
        <div className="pf-gate-actions">
          <Link className="pf-gate-primary" href={`${ROUTES.upgrade}?return=${RETURN}`}>
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
