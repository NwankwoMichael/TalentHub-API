import { z } from "zod";

export const SlugSchema = z
  .string({
    error: "Slug is required",
  })
  .min(2, "Slug must be at least 2 characters")
  .max(120, "Slug cannot exceed 120 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphen",
  );
