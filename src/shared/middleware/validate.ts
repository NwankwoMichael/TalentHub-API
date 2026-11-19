import type { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { ValidationError } from "../errors/validationError.js";

import { formatZodError } from "../errors/formatZodError.js";

export const validateBody =
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

export const validateParams =
  (schema: z.ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.params);

    if (!validation.success) {
      return next(
        new ValidationError("Invalid route parameters", {
          errors: formatZodError(validation.error),
        }),
      );
    }

    Object.assign(req.params, validation.data);
    next();
  };

export const validateQueries =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validation = schema.safeParse(req.query);

    if (!validation.success) {
      return next(
        new ValidationError("Invalid query parameters", {
          errors: formatZodError(validation.error),
        }),
      );
    }
    res.locals.query = validation.data;
    next();
  };
