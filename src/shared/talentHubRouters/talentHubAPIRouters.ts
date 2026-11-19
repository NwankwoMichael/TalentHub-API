import { Router } from "express";
import { authRouter } from "../../modules/auth/routes/authRoutes.js";
import { companyRouter } from "../../modules/company/routes/company,routes.js";

const talentHubAPIRouter = Router();

talentHubAPIRouter.use("/auth", authRouter);
talentHubAPIRouter.use("/company", companyRouter);

export { talentHubAPIRouter };
