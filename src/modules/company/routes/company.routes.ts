import { Router } from "express";
import { restrictTo } from "../../../shared/middleware/restrictTo.js";
import { protectRoute } from "../../../shared/middleware/protectRoute.js";
import {
  validateBody,
  validateParams,
  validateQueries,
} from "../../../shared/middleware/validate.js";
import {
  CompanyIdParamSchema,
  CompanyOwnerIdParamSchema,
  CompanySlugParamSchema,
  CreateCompanySchema,
  ListCompaniesQuerySchema,
  UpdateCompanySchema,
} from "../dto/company.dto.js";
import {
  listCompanies,
  getCompanyBySlug,
  getCompanyById,
  getMyCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
} from "../controllers/company.controller.js";

const companyRouter = Router();

// PUBLIC ROUTES (No authentication required)

companyRouter.get(
  "/",
  validateQueries(ListCompaniesQuerySchema),
  listCompanies,
);
companyRouter.get(
  "/slug/:slug",
  validateParams(CompanySlugParamSchema),
  getCompanyBySlug,
);

// Protected specific GET routes placed ABOVE ":id" to prevent route collision

companyRouter.get(
  "/owner/me",
  protectRoute,
  restrictTo("EMPLOYER", "ADMIN"),
  getMyCompanies,
);
companyRouter.get(
  "/owner/:ownerId",
  protectRoute,
  restrictTo("ADMIN"),
  validateParams(CompanyOwnerIdParamSchema),
  getMyCompany,
);

// PUBLIC DYNAMIC ":id" ROUTE (Comes AFTER all static/prefixed GET routes)

companyRouter.get("/:id", validateParams(CompanyIdParamSchema), getCompanyById);

// PROTECTED MUTATION ROUTES (Auth required for all below)
companyRouter.use(protectRoute);

companyRouter.post(
  "/",
  restrictTo("EMPLOYER"),
  validateBody(CreateCompanySchema),
  createCompany,
);

companyRouter.patch(
  "/:id",
  restrictTo("ADMIN", "EMPLOYER"),
  validateParams(CompanyIdParamSchema),
  validateBody(UpdateCompanySchema),
  updateCompany,
);

companyRouter.delete(
  "/:id",
  restrictTo("ADMIN", "EMPLOYER"),
  validateParams(CompanyIdParamSchema),
  deleteCompany,
);

export { companyRouter };
