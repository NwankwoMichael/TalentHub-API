import { z } from "zod";
import { CompanySize } from "@prisma/client";
import { SlugSchema } from "../../../shared/config/slugs/slugParamSchema.js";

export const CreateCompanySchema = z.object({
  name: z
    .string({
      error: "Company name is required",
    })
    .min(2, "Company must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),

  description: z
    .string({ error: "Description is required" })
    .min(20, "Please provide a brief overview of at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  industry: z
    .string({ error: "Industry is required" })
    .min(2, "Industry is required"),

  website: z.httpUrl({
    error: "Please enter a valid URL (e.g., https://example.com)",
  }),

  headquarters: z
    .string({ error: "Headquarters location is required" })
    .min(2, "Headquarters is required"),

  size: z.enum(CompanySize, {
    error: "Please select a valid company size",
  }),

  logoUrl: z.httpUrl("logo must be a valid URL").nullish(),

  foundedYear: z.int().min(1800).max(new Date().getFullYear()).nullish(),
});

export const ListCompaniesQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(20),
});

export const CompanyIdParamSchema = z.object({
  id: z.uuid({ error: "Invalid company ID format" }),
});

export const CompanyOwnerIdParamSchema = z.object({
  ownerId: z.uuid({
    error: "Invalid companny owner ID format",
  }),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = CreateCompanySchema.partial();

export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;

export type ListCompaniesQuery = z.infer<typeof ListCompaniesQuerySchema>;

export const CompanySlugParamSchema = z.object({ slug: SlugSchema });

export type CompanySlugParamInput = z.infer<typeof CompanySlugParamSchema>;

export type CompanyIdParamInput = z.infer<typeof CompanyIdParamSchema>;

export type CompanyOwnerIdParamInput = z.infer<
  typeof CompanyOwnerIdParamSchema
>;
