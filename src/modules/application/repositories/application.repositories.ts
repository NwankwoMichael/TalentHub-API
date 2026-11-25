import { prisma } from "../../../shared/config/prisma.js";

import { ApplicationStatus, type Prisma } from "@prisma/client";

import type {
  CreateApplicationInput,
  ApplicationQuery,
  UpdateApplicationStatusInput,
} from "../dto/application.dto.js";

import type {
  ApplicationData,
  ApplicationWithJob,
  ApplicationWithApplicant,
} from "../types/application.types.js";

export async function createApplicationDB(
  userId: string,
  jobId: string,
  data: CreateApplicationInput,
): Promise<ApplicationData> {
  return await prisma.application.create({
    data: {
      userId,
      jobId,
      ...(data.coverLetter !== undefined && { coverLetter: data.coverLetter }),
    },
  });
}

export async function findApplicationByIdDB(
  applicationId: string,
): Promise<ApplicationData | null> {
  return await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });
}

export async function findUserApplicationsDB(
  userId: string,
  query: ApplicationQuery,
): Promise<{ applications: ApplicationWithJob[]; total: number }> {
  const { status, jobId, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ApplicationWhereInput = {
    userId,
    ...(status && { status }),
    ...(jobId && { jobId }),
  };

  const [applications, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            workType: true,
            status: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return { applications, total };
}

export async function findJobApplicationsDB(
  jobId: string,
  query: ApplicationQuery,
): Promise<{ applications: ApplicationWithApplicant[]; total: number }> {
  const { status, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ApplicationWhereInput = {
    jobId,
    ...(status && { status }),
  };

  const [applications, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                bio: true,
                location: true,
                years_of_experience: true,
                resume_Url: true,
                skills: true,
              },
            },
          },
        },
      },
    }),
    prisma.application.count({ where }),
  ]);
  return { applications, total };
}

export async function updateApplicationStatusDB(
  applicationId: string,
  updateField: UpdateApplicationStatusInput,
): Promise<ApplicationData> {
  return await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: updateField.status,
    },
  });
}

export async function withdrawApplicationDB(
  applicationId: string,
): Promise<ApplicationData> {
  return await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.WITHDRAWN,
    },
  });
}

export async function deleteApplicationDB(
  applicationId: string,
): Promise<void> {
  await prisma.application.delete({
    where: { id: applicationId },
  });
}

export async function findApplicationByCandidateAndJobDB(
  userId: string,
  jobId: string,
): Promise<ApplicationData | null> {
  return prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
}
