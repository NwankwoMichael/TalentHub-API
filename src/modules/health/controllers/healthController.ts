import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../shared/config/prisma.js";
import { catchAsync } from "../../../shared/utils/catchAsync.js";
import { DatabaseError } from "../../../shared/errors/databaseError.js";
import { logger } from "../../../shared/lib/logger.js";

export const getHealth = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      success: true,
      message: "TalentHub API is running",
    });
  },
);

export const getDBHealthStatus = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    await prisma.$queryRaw`SELECT 1`.catch((err) => {
      const errMsg =
        err instanceof Error
          ? err.message
          : "prisma error: Failed to connect with DB";

      logger.error(`Health check database connection failed`);

      throw new DatabaseError(errMsg, {
        success: false,
        status: "DOWN",
        timestamp: new Date().toISOString(),
        services: {
          database: "DISCONNECTED",
        },
      });
    });

    res.status(200).json({
      success: true,
      status: "UP",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  },
);
