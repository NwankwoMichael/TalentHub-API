import { Router } from "express";
import { authRouter } from "../../modules/auth/routes/authRoutes.js";
import { companyRouter } from "../../modules/company/routes/company,routes.js";
import { jobRouter } from "../../modules/job/routes/job.routes.js";
import { applicationRouter } from "../../modules/application/routes/application.routes.js";

const talentHubAPIRouter = Router();

talentHubAPIRouter.use("/auth", authRouter);
talentHubAPIRouter.use("/company", companyRouter);
talentHubAPIRouter.use("/job", jobRouter);
talentHubAPIRouter.use("/application", applicationRouter);

export { talentHubAPIRouter };
