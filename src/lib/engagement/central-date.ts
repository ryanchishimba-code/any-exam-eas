import { CENTRAL_TIMEZONE } from "./config";

/** Calendar date in US Central (YYYY-MM-DD). */
export function centralDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CENTRAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function centralDateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00.000Z`);
}

export function formatCentralTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIMEZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
}
