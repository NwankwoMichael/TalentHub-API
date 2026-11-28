import { AppError, type AppErrorOptions } from "./appError.js";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", options?: AppErrorOptions) {
    super(400, message, {
      code: "BAD_REQUEST",
      ...options,
    });
  }
}
