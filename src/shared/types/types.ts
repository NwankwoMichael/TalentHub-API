import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export interface JwtUserPayload {
  id: string;
  role: UserRole;
}
