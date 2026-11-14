import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({
    error: "Email is required or invalid",
  }),

  password: z
    .string({ error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
