import { z } from "zod";

export const CreateProfileSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(10, { error: "Bio must be at least 10 characters" })
    .max(1000, { error: "Bio cannot exceed 1000 characters" })
    .optional(),

  location: z
    .string()
    .trim()
    .min(3, { error: "Location must be at least 3 characters" })
    .max(100, { error: "Location cannot exceed 100 characters" })
    .optional(),

  years_of_experience: z
    .int({
      error: "Years of experience must be a whole number",
    })
    .min(0, { error: "Years of experience cannot be negative" })
    .max(60, { error: "Years of experience cannot exceed 60" })
    .optional(),

  resume_Url: z
    .httpUrl({ error: "Resume URL must be a valid HTP/HTTPS URL" })
    .optional(),

  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, { error: "Skill cannot be empty" })
        .max(50, { error: "Skill cannot exceed 50 characters" }),
    )
    .min(1, { error: "Please add at least one skill" })
    .max(30, { error: "You can list up to 30 skills" })
    .refine(
      (skills) =>
        new Set(skills.map((skill) => skill.toLowerCase())).size ===
        skills.length,
      { error: "Duplicate skills are not allowed" },
    ),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export const ProfileUserParamSchema = z.object({
  userId: z.uuid({ error: "Invalid User ID format" }),
});

export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ProfileUserParam = z.infer<typeof ProfileUserParamSchema>;
