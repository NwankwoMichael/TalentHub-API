import { z } from "zod";
import { UserRole } from "@prisma/client";

export const RegisterSchema = z
  .object({
    email: z.email({ error: "Email is required or invalid" }),

    password: z
      .string({
        error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" }),

    passwordConfirm: z.string({ error: "Passowrd confirmation is required" }),

    role: z.enum(UserRole, {
      error: "Role must be either ADMIN, EMPLOYER, or CANDIDATE",
    }),
  })

  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
