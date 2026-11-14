import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";

export const restrictTo = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.currentUser) {
      return next(new UnauthorizedError("Authentication required."));
    }

    if (!allowedRoles.includes(req.currentUser.role)) {
      return next(
        new ForbiddenError(
          "You do not have permission to perform this action.",
        ),
      );
    }
    next();
  };
};

/**
 * 
 * Example route usage:typescript
router.post(
  "/jobs",
  protectRoute,
  restrictTo(UserRole.EMPLOYER, UserRole.ADMIN),
  createJob,
);
 */
