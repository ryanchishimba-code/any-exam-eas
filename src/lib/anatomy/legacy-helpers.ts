export function isBioDigitalAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_BIODIGITAL_APP_ID?.trim());
}
