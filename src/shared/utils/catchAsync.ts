import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { AsyncRequestHandler } from "../types/types.js";

export const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
