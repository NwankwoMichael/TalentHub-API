import { prisma } from "../../../shared/config/prisma.js";

import type { Prisma } from "@prisma/client";

import type {
  CreateJobInput,
  ListJobsQuery,
  UpdateJobInput,
} from "../dto/job.dto.js";

import type { JobData } from "../types/jobs.types.js";

export async function createJobDB(
  data: CreateJobInput & { slug: string },
): Promise<JobData> {
  return await prisma.job.create({
    data: {
      companyId: data.companyId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      location: data.location,
      workType: data.workType,
      experienceLevel: data.experienceLevel,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
    },
  });
}

export async function findJobByIdDB(jobId: string): Promise<JobData | null> {
  return await prisma.job.findUnique({
    where: { id: jobId },
  });
}

export async function findJobBySlugDB(slug: string): Promise<JobData | null> {
  return await prisma.job.findUnique({
    where: { slug },
  });
}

export async function findJobsDB(
  filters: Omit<ListJobsQuery, "page" | "limit">,
  skip = 0,
  take = 20,
): Promise<JobData[]> {
  const where: Prisma.JobWhereInput = {
    status: "ACTIVE",
    ...(filters.companyId && { companyId: filters.companyId }),
    ...(filters.location && { location: filters.location }),
    ...(filters.workType && { workType: filters.workType }),
    ...(filters.experienceLevel && {
      experienceLevel: filters.experienceLevel,
    }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };

  return await prisma.job.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function findJobsByCompanyDB(
  companyId: string,
): Promise<JobData[]> {
  return await prisma.job.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateJobDB(
  jobId: string,
  updateField: UpdateJobInput & { slug?: string },
): Promise<JobData> {
  return await prisma.job.update({
    where: { id: jobId },
    data: {
      ...(updateField.title !== undefined && { title: updateField.title }),
      ...(updateField.slug !== undefined && { slug: updateField.slug }),
      ...(updateField.description !== undefined && {
        description: updateField.description,
      }),
      ...(updateField.salaryMin !== undefined && {
        salaryMin: updateField.salaryMin,
      }),
      ...(updateField.salaryMax !== undefined && {
        salaryMax: updateField.salaryMax,
      }),
      ...(updateField.location !== undefined && {
        location: updateField.location,
      }),
      ...(updateField.workType !== undefined && {
        workType: updateField.workType,
      }),
      ...(updateField.experienceLevel !== undefined && {
        experienceLevel: updateField.experienceLevel,
      }),
      ...(updateField.status !== undefined && { status: updateField.status }),
    },
  });
}

export async function deleteJobDB(jobId: string): Promise<void> {
  await prisma.job.delete({
    where: { id: jobId },
  });
}

export async function countActiveApplicationsDB(
  jobId: string,
): Promise<number> {
  return await prisma.application.count({
    where: {
      jobId,
      status: {
        in: ["PENDING", "REVIEWED", "INTERVIEW", "OFFERED"],
      },
    },
  });
}

export async function countAllApplicationsDB(jobId: string): Promise<number> {
  return await prisma.application.count({
    where: { jobId },
  });
}
