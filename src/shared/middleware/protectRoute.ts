import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { JWTExpiredError } from "../errors/JWTExpiredError.js";
import { JWTInvalidError } from "../errors/JWTInvalidError.js";
import type { JwtUserPayload } from "../../shared/types/types.js";
import { env } from "../config/env.js";
import { AuthService } from "../../modules/auth/services/auth.services.js";

const authService = new AuthService();

export const protectRoute = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Access denied. Malformed token header.");
    }

    let decoded: JwtUserPayload;

    try {
      const secret = env.jwtAccessSecret;
      decoded = jwt.verify(token, secret) as JwtUserPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) throw new JWTExpiredError();

      if (error instanceof jwt.JsonWebTokenError) throw new JWTInvalidError();

      throw error;
    }

    const activeUser = await authService.verifyActiveUser(decoded.id);
    req.currentUser = activeUser;
    next();
  },
);
