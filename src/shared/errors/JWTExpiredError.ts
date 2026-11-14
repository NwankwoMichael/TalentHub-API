import { AppError, type AppErrorOptions } from "./appError.js";

export class JWTExpiredError extends AppError {
  constructor(
    message: string = "Your token has expired. please log in again.",
    options?: AppErrorOptions,
  ) {
    super(401, message, {
      code: "TOKEN_EXPIRED",
      ...options,
    });
  }
}
