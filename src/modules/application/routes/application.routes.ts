import { Router } from "express";
import { protectRoute } from "../../../shared/middleware/protectRoute.js";
import { restrictTo } from "../../../shared/middleware/restrictTo.js";
import {
  validateBody,
  validateParams,
  validateQueries,
} from "../../../shared/middleware/validate.js";
import {
  ApplicationParamSchema,
  ApplicationQuerySchema,
  UpdateApplicationStatusSchema,
} from "../dto/application.dto.js";
import {
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/application.controllers.js";

const applicationRouter = Router();

applicationRouter.use(protectRoute);

applicationRouter.get(
  "/me",
  restrictTo("CANDIDATE"),
  validateQueries(ApplicationQuerySchema),
  getMyApplications,
);

applicationRouter.patch(
  "/:applicationId/status",
  restrictTo("EMPLOYER", "ADMIN"),
  validateParams(ApplicationParamSchema),
  validateBody(UpdateApplicationStatusSchema),
  updateApplicationStatus,
);

applicationRouter.patch(
  "/:applicationId/withdraw",
  restrictTo("CANDIDATE"),
  validateParams(ApplicationParamSchema),
  withdrawApplication,
);

export { applicationRouter };
