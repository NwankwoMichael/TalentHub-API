import { generateSlug } from "../../../shared/config/slugs/generateSlug.js";
import { logger } from "../../../shared/lib/logger.js";
import { ForbiddenError } from "../../../shared/errors/forbiddenError.js";
import { NotFoundError } from "../../../shared/errors/notfoundError.js";

import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../dto/company.dto.js";

import {
  createCompanyDB,
  findCompanyById,
  findCompanyBySlug,
  findCompanies,
  findCompaniesByOwner,
  updateCompanyDB,
  deleteCompanyDB,
  countActiveCompanyJobs,
  findCompanyByOwner,
} from "../repositories/company.repositories.js";

import type { CompanyData } from "../types/companyTypes.js";
import type { UserRole } from "@prisma/client";
import { UnauthorizedError } from "../../../shared/errors/unauthorizedError.js";

export class CompanyServices {
  async verifyCompanyOwnerShip(
    companyId: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<CompanyData> {
    const company = await findCompanyById(companyId);

    if (!company) {
      logger.error("No company matching provided company ID was found");

      throw new NotFoundError("Company not found");
    }

    if (company.ownerId !== requesterId && requesterRole !== "ADMIN") {
      logger.error("Only company owner or ADMIN can commit an update");
      throw new ForbiddenError("Access forbidden");
    }

    return company;
  }

  async createCompanyService(
    ownerId: string,
    data: CreateCompanyInput,
  ): Promise<CompanyData> {
    const slug = generateSlug(data.name);

    const company = await createCompanyDB({ ...data, slug, ownerId });

    return company;
  }

  async getCompanyByIdService(companyId: string): Promise<CompanyData> {
    const company = await findCompanyById(companyId);

    if (!company) {
      logger.error("No company matching provided company ID was found");

      throw new NotFoundError("Company not found");
    }

    return company;
  }

  async getCompanyBySlugService(slug: string): Promise<CompanyData> {
    const company = await findCompanyBySlug(slug);

    if (!company) {
      logger.error("No company matching provided company slug was found");

      throw new NotFoundError("Company not found");
    }

    return company;
  }

  async getCompaniesByOwnerService(ownerId: string): Promise<CompanyData[]> {
    return await findCompaniesByOwner(ownerId);
  }

  async getCompanyByOwnerService(ownerId: string): Promise<CompanyData | null> {
    return await findCompanyByOwner(ownerId);
  }

  async listCompaniesService(page = 1, limit = 20): Promise<CompanyData[]> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const companiesList = await findCompanies(skip, safeLimit);

    return companiesList;
  }

  async updateCompanyService(
    companyId: string,
    requesterId: string,
    requesterRole: UserRole,
    data: UpdateCompanyInput,
  ): Promise<CompanyData> {
    const company = await this.verifyCompanyOwnerShip(
      companyId,
      requesterId,
      requesterRole,
    );

    const slug =
      data.name && data.name !== company.name
        ? generateSlug(data.name)
        : undefined;

    const updatedCompany = await updateCompanyDB(companyId, {
      ...data,
      ...(slug !== undefined && { slug }),
    });

    return updatedCompany;
  }

  async deleteCompanyService(
    companyId: string,
    requesterId: string,
    requesterRole: string,
  ) {
    await this.verifyCompanyOwnerShip(companyId, requesterId, requesterRole);

    if (requesterRole !== "ADMIN") {
      const activeJobsCount = await countActiveCompanyJobs(companyId);

      if (activeJobsCount > 0) {
        throw new UnauthorizedError(
          "Cannot delete a company with active job listings. Close all active jobs first.",
        );
      }
    }
    await deleteCompanyDB(companyId);
  }
}
