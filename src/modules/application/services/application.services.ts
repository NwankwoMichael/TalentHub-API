import { ApplicationStatus, JobStatus, Prisma } from "@prisma/client";

import { prisma } from "../../../shared/config/prisma.js";

import { NotFoundError } from "../../../shared/errors/notfoundError.js";
import { BadRequestError } from "../../../shared/errors/badRequestError.js";
import { ForbiddenError } from "../../../shared/errors/forbiddenError.js";

import { logger } from "../../../shared/lib/logger.js";

import { CompanyServices } from "../../company/services/company.services.js";

import { findJobByIdDB } from "../../job/repositories/job.repositories.js";

import type { UserResponse } from "../../auth/types/user.auth.types.js";

import { ProfileServices } from "../../profile/services/profile.services.js";

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

import {
  createApplicationDB,
  findApplicationByCandidateAndJobDB,
  findApplicationByIdDB,
  findJobApplicationsDB,
  findUserApplicationsDB,
  updateApplicationStatusDB,
  withdrawApplicationDB,
  deleteApplicationDB,
} from "../repositories/application.repositories.js";

import type { JobData } from "../../job/types/jobs.types.js";
import { ConflictError } from "../../../shared/errors/conflictError.js";

const profileServices = new ProfileServices();
const companyServices = new CompanyServices();

type JobLookupErrorMode = "NOT_FOUND" | "BAD_REQUEST";

export class ApplicationServices {
  async verifyJobExists(
    jobId: string,
    errorMode: JobLookupErrorMode = "NOT_FOUND",
  ): Promise<JobData> {
    const job = await findJobByIdDB(jobId);

    if (!job) {
      if (errorMode === "BAD_REQUEST") {
        logger.error("Associated job not found");
        throw new BadRequestError("Associated job not found");
      }

      logger.error("Job does not exist");
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  async ensureNotAlreadyApplied(userId: string, jobId: string): Promise<void> {
    const existingApplication = await findApplicationByCandidateAndJobDB(
      userId,
      jobId,
    );

    if (existingApplication) {
      logger.error("You alreasy applied for this job");

      throw new BadRequestError("You already applied to this job");
    }
  }

  async checkApplicationByIdExists(
    applicationId: string,
  ): Promise<ApplicationData> {
    const application = await findApplicationByIdDB(applicationId);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    return application;
  }

  async applyToJobs(
    userId: string,
    jobId: string,
    data: CreateApplicationInput,
  ): Promise<ApplicationData> {
    const job = await this.verifyJobExists(jobId);

    if (job.status !== JobStatus.ACTIVE) {
      logger.error("Job is not ACTIVE");
      throw new BadRequestError("This job is no longer accepting applications");
    }

    const profile = await profileServices.verifyCandidateReadyToApply(userId);

    await this.ensureNotAlreadyApplied(userId, jobId);

    try {
      return await createApplicationDB(userId, jobId, data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError("You have already applied to this job");
      }
      throw error;
    }
  }

  async getMyApplicationsService(userId: string, query: ApplicationQuery) {
    const { applications, total } = await findUserApplicationsDB(userId, query);

    return {
      applications,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getJobApplicationsService(
    jobId: string,
    query: ApplicationQuery,
    currentUser: UserResponse,
  ) {
    const job = await this.verifyJobExists(jobId);

    await companyServices.verifyCompanyOwnership(
      job.companyId,
      currentUser.id,
      currentUser.role,
    );

    const { applications, total } = await findJobApplicationsDB(jobId, query);

    return {
      applications,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async updateApplicationStatusService(
    applicationId: string,
    updatefield: UpdateApplicationStatusInput,
    currentUser: UserResponse,
  ) {
    const application = await this.checkApplicationByIdExists(applicationId);

    if (application.status === ApplicationStatus.WITHDRAWN) {
      throw new BadRequestError(
        "Cannot update the status of a withdrawn application",
      );
    }

    const job = await this.verifyJobExists(application.jobId, "BAD_REQUEST");

    await companyServices.verifyCompanyOwnership(
      job.companyId,
      currentUser.id,
      currentUser.role,
    );

    return await updateApplicationStatusDB(applicationId, updatefield);
  }

  async withdrawApplicationService(
    applicationId: string,
    userId: string,
  ): Promise<void> {
    const application = await this.checkApplicationByIdExists(applicationId);

    if (application.userId !== userId) {
      throw new ForbiddenError("Access denied");
    }

    if (application.status === ApplicationStatus.WITHDRAWN) {
      throw new BadRequestError("Application has already been withdrawn");
    }

    if (
      application.status === ApplicationStatus.HIRED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      throw new BadRequestError(
        `Cannot withdraw an application that already been ${application.status.toLowerCase()}`,
      );
    }

    await withdrawApplicationDB(applicationId);
  }

  async deleteApplicationService(applicationId: string): Promise<void> {
    return await deleteApplicationDB(applicationId);
  }
}

export const applicationServices = new ApplicationServices();
