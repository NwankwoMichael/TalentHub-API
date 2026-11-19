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

companyRouter.use(protectRoute);

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
companyRouter.get("/owner/me", restrictTo("EMPLOYER", "ADMIN"), getMyCompanies);
companyRouter.get(
  "/owner/:ownerId",
  restrictTo("ADMIN"),
  validateParams(CompanyOwnerIdParamSchema),
  getMyCompany,
);

companyRouter.get("/:id", validateParams(CompanyIdParamSchema), getCompanyById);

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
