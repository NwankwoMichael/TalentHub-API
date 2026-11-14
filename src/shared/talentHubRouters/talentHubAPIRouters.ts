import { Router } from "express";
import { authRouter } from "../../modules/auth/routes/authRoutes.js";

export const talentHubAPIRouter = Router();

talentHubAPIRouter.use(authRouter);
