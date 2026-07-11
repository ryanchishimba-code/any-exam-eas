/**
 * Ensure Stripe webhook events match the configured API key mode.
 * Prevents test-mode checkouts from unlocking production accounts (and vice versa).
 */
export function expectedStripeLivemode(
  secretKey = process.env.STRIPE_SECRET_KEY ?? ""
): boolean | null {
  const key = secretKey.trim();
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return true;
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return false;
  return null;
}

export function stripeEventMatchesKeyMode(event: {
  livemode?: boolean;
}): { ok: true } | { ok: false; reason: string } {
  const expected = expectedStripeLivemode();
  if (expected == null) {
    return { ok: false, reason: "stripe_key_mode_unknown" };
  }
  if (Boolean(event.livemode) !== expected) {
    return {
      ok: false,
      reason: event.livemode ? "live_event_with_test_key" : "test_event_with_live_key",
    };
  }
  return { ok: true };
}
