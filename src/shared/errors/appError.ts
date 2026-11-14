export interface AppErrorOptions {
  code?: string | undefined;
  errors?: Record<string, unknown> | undefined;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly code?: string | undefined;
  public readonly errors?: Record<string, unknown> | undefined;

  constructor(statusCode: number, message: string, options?: AppErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    if (options?.code !== undefined) {
      this.code = options?.code;
    }

    if (options?.errors !== undefined) this.errors = options?.errors;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}
