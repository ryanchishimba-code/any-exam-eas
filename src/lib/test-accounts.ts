/** Internal QA / load-test inboxes — never created via public signup. */
export function isInternalTestEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized.endsWith("@anyexameasy.test") ||
    normalized.endsWith("@loadtest.anyexameasy.test")
  );
}
