import { z } from "zod";

import {
  JobLocation,
  JobType,
  JobExperienceLevel,
  JobStatus,
} from "@prisma/client";

import { SlugSchema } from "../../../shared/config/slugs/slugParamSchema.js";

const BaseJobSchema = z.object({
  companyId: z.uuid({ error: "Valid company ID is required" }),

  title: z
    .string({ error: "Job title is required" })
    .min(2, "Job title must be at least 3 characters")
    .max(150, "Job title cannot exceed 120 characters"),

  description: z
    .string({ error: "Job description is required" })
    .min(
      50,
      "Please provide a detailed job description of at least 30 characters",
    )
    .max(5000, "Job description cannot exceed 5000 characters"),

  salaryMin: z
    .int({ error: "Minimum salary must be a whole number" })
    .positive("Minimum salary must be greater than 0")
    .nullish(),

  salaryMax: z
    .int({ error: "Maximum salary must be a whole number" })
    .positive("Maximum salary must be greater than 0")
    .nullish(),

  location: z.enum(JobLocation, {
    error: "Please select a valid job location (REMOTE, HYBRID, ONSITE",
  }),

  workType: z.enum(JobType, {
    error: "Please select a valid work type (FULLTIME, PARTTIME, CONTRACT",
  }),

  experienceLevel: z.enum(JobExperienceLevel, {
    error: "Please select a valid experience level",
  }),
});

export const CreateJobSchema = BaseJobSchema.refine(
  (data) => {
    if (data.salaryMin != null && data.salaryMax != null) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: "Maximum salary cannot be less than minimum salary",
    path: ["salaryMax"],
  },
);

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = BaseJobSchema.omit({ companyId: true })
  .extend({
    status: z.enum(JobStatus, {
      error: "Invalid job status",
    }),
  })
  .partial()
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "Maximum salary cannot be less than minimum salary",
      path: ["salaryMax"],
    },
  );

export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

export const JobIdParamSchema = z.object({
  id: z.uuid({ error: "Invalid job ID format" }),
});

export type JobIdParamInput = z.infer<typeof JobIdParamSchema>;

export const JobSlugParamSchema = z.object({
  slug: SlugSchema,
});

export type JobSlugParamInput = z.infer<typeof JobSlugParamSchema>;

export const ListJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().min(1).optional(),
  location: z.enum(JobLocation).optional(),
  workType: z.enum(JobType).optional(),
  experienceLevel: z.enum(JobExperienceLevel).optional(),
  companyId: z.uuid({ error: "Invalid company ID format" }).optional(),
});

export type ListJobsQuery = z.infer<typeof ListJobsQuerySchema>;
