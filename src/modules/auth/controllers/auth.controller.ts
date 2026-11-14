import type { Request, Response, NextFunction } from "express";
import { type RegisterInput } from "../dto/register/register.validation.dto.js";
import { AuthService } from "../services/auth.services.js";
import { type LoginInput } from "../dto/login/login.validation.dto.js";
import { catchAsync } from "../../../shared/utils/catchAsync.js";

const authService = new AuthService();

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;

    const newUser = await authService.registerUser({
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  },
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: existingUser.id,
        userEmail: existingUser.email,
        token: existingUser.accessToken,
      },
    });
  },
);
