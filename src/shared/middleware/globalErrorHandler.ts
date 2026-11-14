import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";
import { AppError } from "../errors/appError.js";

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code && { code: err.code }),
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  logger.error({ err }, "CRITICAL UNHANDLED ERROR");

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
