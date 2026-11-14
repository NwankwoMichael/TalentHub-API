import { AppError, type AppErrorOptions } from "./appError.js";

export class ConflictError extends AppError {
  constructor(
    message: string = "Resource already exists",
    options?: AppErrorOptions,
  ) {
    super(409, message, {
      code: "CONFLICT_ERROR",
      ...options,
    });
  }
}
