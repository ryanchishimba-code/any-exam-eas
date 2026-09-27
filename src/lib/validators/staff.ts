import { z } from "zod";
import { normalizeEmail } from "@/lib/validators/auth";
import { passwordSchema } from "@/lib/validators/password-policy";

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
  password: passwordSchema.optional(),
});

export const updateStaffRoleSchema = z.object({
  role: staffRoleSchema,
});

export type StaffRoleValue = z.infer<typeof staffRoleSchema>;
