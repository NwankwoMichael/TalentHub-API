import { Router } from "express";

import { healthRouter } from "../../modules/health/routes/healthRouter.js";

export const talenthubSystemRouter = Router();

talenthubSystemRouter.use(healthRouter);
