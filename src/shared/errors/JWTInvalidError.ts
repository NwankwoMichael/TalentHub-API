import { AppError, type AppErrorOptions } from "./appError.js";

export class JWTInvalidError extends AppError {
  constructor(
    message: string = "Invalid authentication token.",
    options?: AppErrorOptions,
  ) {
    super(401, message, { code: "TOKEN_INVALID", ...options });
  }
}
