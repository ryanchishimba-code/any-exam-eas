import { z } from "zod";
import { CONVERSION_EVENTS, type ConversionEventName } from "./conversion-types";

const eventNames = Object.values(CONVERSION_EVENTS) as [
  ConversionEventName,
  ...ConversionEventName[],
];

export const conversionBeaconSchema = z.object({
  eventName: z.enum(eventNames),
  properties: z.record(z.unknown()).default({}),
  sessionId: z.string().max(120).optional(),
});

export type ConversionBeaconInput = z.infer<typeof conversionBeaconSchema>;
