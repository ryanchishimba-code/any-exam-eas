import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";

/** Desktop-only product frame. Decorative — the form column carries the offer. */
export function AuthProductVisual() {
  return (
    <aside className="aee-auth-visual" aria-hidden="true">
      <div className="aee-auth-visual-card">
        <p className="aee-auth-visual-kicker">Today</p>
        <p className="aee-auth-visual-title">NCLEX</p>
        <p className="aee-auth-visual-copy">
          {TRIAL_LIFETIME_QUESTIONS} practice questions across all six boards, with Roadmaps and
          Deep Dives beside the set.
        </p>
        <div className="aee-auth-visual-pills">
          <span>Question bank</span>
          <span>Roadmaps</span>
          <span>Deep Dives</span>
        </div>
      </div>
    </aside>
  );
}
