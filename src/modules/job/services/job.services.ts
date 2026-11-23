import type { UserRole } from "@prisma/client";
import { generateSlug } from "../../../shared/config/slugs/generateSlug.js";
import { logger } from "../../../shared/lib/logger.js";
import { NotFoundError } from "../../../shared/errors/notfoundError.js";
import { ValidationError } from "../../../shared/errors/validationError.js";
import { CompanyServices } from "../../company/services/company.services.js";

import type {
  CreateJobInput,
  UpdateJobInput,
  ListJobsQuery,
} from "../dto/job.dto.js";

import {
  createJobDB,
  findJobByIdDB,
  findJobBySlugDB,
  findJobsDB,
  findJobsByCompanyDB,
  updateJobDB,
  deleteJobDB,
  countActiveApplicationsDB,
  countAllApplicationsDB,
} from "../repositories/job.repositories.js";

import type { JobData } from "../types/jobs.types.js";

const companyServices = new CompanyServices();

export class JobServices {
  async verifyJobOwnership(
    jobId: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<JobData> {
    const job = await findJobByIdDB(jobId);

    if (!job) {
      logger.error("No job matching provided job ID was found");
      throw new NotFoundError("Job not found");
    }

    await companyServices.verifyCompanyOwnership(
      job.companyId,
      requesterId,
      requesterRole,
    );

    return job;
  }

  async createJobService(
    requesterId: string,
    requesterRole: UserRole,
    data: CreateJobInput,
  ): Promise<JobData> {
    await companyServices.verifyCompanyOwnership(
      data.companyId,
      requesterId,
      requesterRole,
    );

    const slug = generateSlug(data.title);

    return await createJobDB({ ...data, slug });
  }

  async getJobByIdService(jobId: string): Promise<JobData> {
    const job = await findJobByIdDB(jobId);

    if (!job) {
      logger.error("No job matching provided job ID was found");
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  async getJobBySlugService(slug: string): Promise<JobData> {
    const job = await findJobBySlugDB(slug);

    if (!job) {
      logger.error("No job matching provided job slug was found");
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  async listJobsService(query: ListJobsQuery): Promise<JobData[]> {
    const { page, limit, ...filters } = query;
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    return findJobsDB(filters, skip, safeLimit);
  }

  async getJobsByCompanyService(companyId: string): Promise<JobData[]> {
    await companyServices.getCompanyByIdService(companyId);

    return await findJobsByCompanyDB(companyId);
  }

  async updateJobService(
    jobId: string,
    requesterId: string,
    requesterRole: UserRole,
    data: UpdateJobInput,
  ): Promise<JobData> {
    const job = await this.verifyJobOwnership(
      jobId,
      requesterId,
      requesterRole,
    );

    const effectiveMin =
      data.salaryMin !== undefined ? data.salaryMin : job.salaryMin;

    const effectiveMax =
      data.salaryMax !== undefined ? data.salaryMax : job.salaryMax;

    if (
      effectiveMin !== null &&
      effectiveMax !== null &&
      effectiveMax < effectiveMin
    ) {
      throw new ValidationError(
        "Maximum salary cannot be less than minimum salary",
      );
    }

    const slug =
      data.title && data.title !== job.title
        ? generateSlug(data.title)
        : undefined;

    return await updateJobDB(jobId, {
      ...data,
      ...(slug !== undefined && { slug }),
    });
  }

  async deleteJobService(
    jobId: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<void> {
    await this.verifyJobOwnership(jobId, requesterId, requesterRole);

    // Since onDelete: Cascade is omitted, block delete if any application exists

    const applicationsCount = await countAllApplicationsDB(jobId);

    if (applicationsCount > 0) {
      throw new ValidationError(
        "Cannot delete a job that already has applications. Mark its status as CLOSED instead.",
      );
    }

    await deleteJobDB(jobId);
  }
}
