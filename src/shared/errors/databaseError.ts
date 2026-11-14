import { AppError, type AppErrorOptions } from "./appError.js";

export class DatabaseError extends AppError {
  constructor(
    message: string = "Database operation failed",
    options?: AppErrorOptions,
  ) {
    super(500, message, { code: "DATABASE_ERROR", ...options });
  }
}
