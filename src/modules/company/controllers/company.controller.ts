import type { Request, Response, NextFunction } from "express";
import { CompanyServices } from "../services/company.services.js";
import { catchAsync } from "../../../shared/utils/catchAsync.js";
import {
  type CompanyIdParamInput,
  type CompanyOwnerIdParamInput,
  type CompanySlugParamInput,
  type CreateCompanyInput,
  type ListCompaniesQuery,
  type UpdateCompanyInput,
} from "../dto/company.dto.js";

const companyServices = new CompanyServices();

export const createCompany = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreateCompanyInput;
    const ownerId = req.currentUser!.id;

    const newCompany = await companyServices.createCompanyService(
      ownerId,
      data,
    );

    res.status(201).json({
      status: "success",
      data: { company: newCompany },
    });
  },
);

export const getCompanyById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params as CompanyIdParamInput;

    const company = await companyServices.getCompanyByIdService(id);

    res.status(200).json({
      status: "success",
      data: { company },
    });
  },
);

export const getCompanyBySlug = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { slug } = req.params as CompanySlugParamInput;

    const company = await companyServices.getCompanyBySlugService(slug);

    res.status(200).json({
      status: "success",
      data: { company },
    });
  },
);

export const listCompanies = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { page, limit } = res.locals.query as ListCompaniesQuery;

    const companies = await companyServices.listCompaniesService(page, limit);

    res.status(200).json({
      status: "success",
      results: companies.length,
      page,
      limit,
      data: { companies },
    });
  },
);

export const getMyCompanies = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const ownerId = req.currentUser!.id;

    const myCompanies =
      await companyServices.getCompaniesByOwnerService(ownerId);

    res.status(200).json({
      status: "success",
      results: myCompanies.length,
      data: { myCompanies },
    });
  },
);

export const getMyCompany = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { ownerId } = req.params as CompanyOwnerIdParamInput;

    const myCompany = await companyServices.getCompanyByOwnerService(ownerId);

    res.status(200).json({
      status: "success",
      data: { myCompany },
    });
  },
);

export const updateCompany = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params as CompanyIdParamInput;
    const data = req.body as UpdateCompanyInput;
    const { id: requesterId, role: requesterRole } = req.currentUser!;

    const updatedCompany = await companyServices.updateCompanyService(
      id,
      requesterId,
      requesterRole,
      data,
    );

    res.status(200).json({
      status: "success",
      data: { company: updatedCompany },
    });
  },
);

export const deleteCompany = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params as CompanyIdParamInput;
    const { id: requesterId, role: requesterRole } = req.currentUser!;

    await companyServices.deleteCompanyService(id, requesterId, requesterRole);

    res.status(204).send();
  },
);
