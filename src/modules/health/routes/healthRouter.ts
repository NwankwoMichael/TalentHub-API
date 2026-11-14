import { Router } from "express";

import {
  getHealth,
  getDBHealthStatus,
} from "../controllers/healthController.js";

export const healthRouter = Router();

healthRouter.get("/health", getHealth);

healthRouter.get("/health/db", getDBHealthStatus);
