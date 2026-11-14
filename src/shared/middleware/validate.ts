import type { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { ValidationError } from "../errors/validationError.js";

import { formatZodError } from "../errors/formatZodError.js";

export const validate =
  (schema: z.ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return next(
        new ValidationError("Invalid validation input", {
          errors: formatZodError(validation.error),
        }),
      );
    }

    req.body = validation.data;
    next();
  };
