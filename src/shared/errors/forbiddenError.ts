import { AppError, type AppErrorOptions } from "./appError.js";

export class ForbiddenError extends AppError {
  constructor(message: string = "Access Forbidden", options?: AppErrorOptions) {
    super(403, message, {
      code: "FORBIDDEN",
      ...options,
    });
  }
}
