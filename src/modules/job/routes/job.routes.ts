import { Router } from "express";
import { protectRoute } from "../../../shared/middleware/protectRoute.js";
import { restrictTo } from "../../../shared/middleware/restrictTo.js";
import {
  validateBody,
  validateParams,
  validateQueries,
} from "../../../shared/middleware/validate.js";

import {
  CreateJobSchema,
  UpdateJobSchema,
  JobIdParamSchema,
  JobSlugParamSchema,
  ListJobsQuerySchema,
} from "../dto/job.dto.js";

import { CompanyIdParamSchema } from "../../company/dto/company.dto.js";

import {
  createJob,
  getJobById,
  getJobBySlug,
  getJobs,
  getJobsByCompany,
  updateJob,
  deleteJob,
} from "../controllers/job.controllers.js";

const jobRouter = Router();

jobRouter.get("/", validateQueries(ListJobsQuerySchema), getJobs);
jobRouter.get("/slug/:slug", validateParams(JobSlugParamSchema), getJobBySlug);
jobRouter.get(
  "/company/:id",
  validateParams(CompanyIdParamSchema),
  getJobsByCompany,
);
jobRouter.get("/:id", validateParams(JobIdParamSchema), getJobById);

jobRouter.use(protectRoute);

jobRouter.post(
  "/",
  restrictTo("EMPLOYER", "ADMIN"),
  validateBody(CreateJobSchema),
  createJob,
);

jobRouter.patch(
  "/:id",
  restrictTo("EMPLOYER", "ADMIN"),
  validateParams(JobIdParamSchema),
  validateBody(UpdateJobSchema),
  updateJob,
);

jobRouter.delete(
  "/:id",
  restrictTo("EMPLOYER", "ADMIN"),
  validateParams(JobIdParamSchema),
  deleteJob,
);

export { jobRouter };
