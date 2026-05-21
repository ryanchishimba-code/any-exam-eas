const MIN_AGE = 18;

export function isAtLeast18(dateOfBirth: Date): boolean {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }
  return age >= MIN_AGE;
}

export const MINIMUM_AGE = MIN_AGE;
