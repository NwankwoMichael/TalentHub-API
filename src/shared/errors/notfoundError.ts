import { AppError, type AppErrorOptions } from "./appError.js";

export class NotFoundError extends AppError {
  constructor(
    message: string = "Resource not found",
    options?: AppErrorOptions,
  ) {
    super(404, message, { code: "NOT_FOUND", ...options });
  }
}
