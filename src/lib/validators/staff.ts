import { z } from "zod";
import { normalizeEmail } from "@/lib/validators/auth";

export const staffRoleSchema = z.enum([
  "user",
  "support_staff",
  "moderator",
  "admin",
  "super_admin",
]);

export const inviteStaffSchema = z.object({
  email: z.string().email().transform(normalizeEmail),
  name: z.string().trim().min(1, "Name is required.").max(120),
  role: staffRoleSchema.refine((r) => r !== "user", {
    message: "Choose a staff role (support staff or higher).",
  }),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/\d/, "Password must include a number.")
    .optional(),
});

export const updateStaffRoleSchema = z.object({
  role: staffRoleSchema,
});

export type StaffRoleValue = z.infer<typeof staffRoleSchema>;
