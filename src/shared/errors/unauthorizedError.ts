import { AppError, type AppErrorOptions } from "./appError.js";

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Authentication required",
    options?: AppErrorOptions,
  ) {
    super(401, message, {
      code: "UNAUTHORIZED",
      ...options,
    });
  }
}
