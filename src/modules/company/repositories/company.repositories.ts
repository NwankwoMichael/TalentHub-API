import { prisma } from "../../../shared/config/prisma.js";

import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../dto/company.dto.js";

import type { CompanyData } from "../types/companyTypes.js";

export async function createCompanyDB(
  data: CreateCompanyInput & { slug: string; ownerId: string },
): Promise<CompanyData> {
  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      industry: data.industry,
      website: data.website,
      headquarters: data.headquarters,
      size: data.size,
      logoUrl: data.logoUrl ?? null,
      foundedYear: data.foundedYear ?? null,
      ownerId: data.ownerId,
    },
  });
  return company;
}

export async function findCompanyById(
  companyId: string,
): Promise<CompanyData | null> {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  return company;
}

export async function findCompanyBySlug(
  companySlug: string,
): Promise<CompanyData | null> {
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
  });

  return company;
}

export async function updateCompanyDB(
  companyId: string,
  updateField: UpdateCompanyInput & { slug?: string },
): Promise<CompanyData> {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      ...(updateField.name !== undefined && { name: updateField.name }),
      ...(updateField.slug !== undefined && { slug: updateField.slug }),
      ...(updateField.description !== undefined && {
        description: updateField.description,
      }),
      ...(updateField.industry !== undefined && {
        industry: updateField.industry,
      }),
      ...(updateField.website !== undefined && {
        website: updateField.website,
      }),
      ...(updateField.headquarters !== undefined && {
        headquarters: updateField.headquarters,
      }),
      ...(updateField.size !== undefined && { size: updateField.size }),
      ...(updateField.logoUrl !== undefined && {
        logoUrl: updateField.logoUrl,
      }),
      ...(updateField.foundedYear !== undefined && {
        foundedYear: updateField.foundedYear,
      }),
    },
  });

  return company;
}

export async function countActiveCompanyJobs(
  companyId: string,
): Promise<number> {
  return prisma.job.count({
    where: {
      companyId,
      status: "ACTIVE",
    },
  });
}

export async function findCompaniesByOwner(
  companyOwnerId: string,
): Promise<CompanyData[]> {
  const companies = await prisma.company.findMany({
    where: { ownerId: companyOwnerId },
    orderBy: { createdAt: "desc" },
  });
  return companies;
}

export async function findCompanyByOwner(
  companyOwnerId: string,
): Promise<CompanyData | null> {
  const company = await prisma.company.findFirst({
    where: { ownerId: companyOwnerId },
  });

  return company || null;
}

export async function deleteCompanyDB(companyId: string): Promise<void> {
  await prisma.company.delete({
    where: { id: companyId },
  });
}

export async function findCompanies(
  skip = 0,
  take = 20,
): Promise<CompanyData[]> {
  const companies = await prisma.company.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  return companies;
}
