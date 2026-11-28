import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const JobApplyParamsSchema = z.object({
  jobId: z.uuid({ error: "Invalid Job ID format" }),
});

export const CreateApplicationSchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .min(20, { error: "Cover letter must be at least 20 characters" })
    .max(5000, { error: "Cover letter cannot exceed 5000 characters" })
    .optional(),
});

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(
    [
      ApplicationStatus.PENDING,
      ApplicationStatus.REVIEWED,
      ApplicationStatus.INTERVIEW,
      ApplicationStatus.OFFERED,
      ApplicationStatus.HIRED,
      ApplicationStatus.REJECTED,
    ],
    { error: "Invalid application status" },
  ),
});

export const ApplicationParamSchema = z.object({
  applicationId: z.uuid({ error: "Invalid Application ID format" }),
});

export const ApplicationQuerySchema = z.object({
  status: z
    .enum(ApplicationStatus, { error: "Invalid status filter" })
    .optional(),
  jobId: z.uuid({ error: "Invalid Job ID format" }).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type JobApplyParams = z.infer<typeof JobApplyParamsSchema>;

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export type UpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;

export type ApplicationParams = z.infer<typeof ApplicationParamSchema>;

export type ApplicationQuery = z.infer<typeof ApplicationQuerySchema>;
