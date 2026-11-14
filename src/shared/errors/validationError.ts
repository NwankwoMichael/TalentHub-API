import { AppError, type AppErrorOptions } from "./appError.js";

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation Failed",
    options?: AppErrorOptions,
  ) {
    super(400, message, {
      code: "VALIDATION_ERROR",
      ...options,
    });
  }
}
