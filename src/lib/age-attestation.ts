/** Placeholder DOB for accounts that attest 18+ without collecting birth date (DB column is NOT NULL). */
export const AGE_ATTESTATION_PLACEHOLDER_DOB = new Date("1990-01-01");

export function ageAttestationDateIso(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function formatAgeVerificationForConsent(input: {
  dateOfBirth: Date;
  metadata: Record<string, unknown> | null;
}): string {
  const meta = input.metadata;
  if (meta?.dateOfBirthProvided === false && typeof meta.ageAttestedAt === "string") {
    return `18+ attestation (${meta.ageAttestedAt})`;
  }
  return input.dateOfBirth.toISOString().slice(0, 10);
}
