import {
  findUserByEmail,
  createUser,
  findAuthUserById,
} from "../repositories/auth.repository.js";

import {
  hashPassword,
  verifyPassword,
} from "../../../shared/utils/password.js";

import { generateJwtToken } from "../../../shared/lib/jwt.js";

import type { RegisterInput } from "../dto/register/register.validation.dto.js";

import type { LoginInput } from "../dto/login/login.validation.dto.js";
import type { LoginResponse, UserResponse } from "../types/types.js";
import { ConflictError } from "../../../shared/errors/conflictError.js";
import { UnauthorizedError } from "../../../shared/errors/unauthorizedError.js";
import { ForbiddenError } from "../../../shared/errors/forbiddenError.js";
import { checkUserStatus } from "../../../shared/utils/checkUserStatus.js";

export class AuthService {
  async registerUser(
    data: Omit<RegisterInput, "passwordConfirm">,
  ): Promise<UserResponse> {
    if (data.role === "ADMIN") {
      throw new ForbiddenError("Public admin registration is forbidden.");
    }

    const normalizeEmail = data.email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizeEmail);

    if (existingUser) {
      throw new ConflictError("Email is already registered.");
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await createUser({
      email: normalizeEmail,
      password: hashedPassword,
      role: data.role,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };
  }

  async loginUser(data: LoginInput): Promise<LoginResponse> {
    const normalizeEmail = data.email.toLowerCase().trim();

    const user = await findUserByEmail(normalizeEmail);

    if (!user?.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    checkUserStatus(user);

    const accessToken = generateJwtToken(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      accessToken,
    };
  }

  async verifyActiveUser(userId: string): Promise<UserResponse> {
    const user = await findAuthUserById(userId);

    if (!user) {
      throw new UnauthorizedError(
        "User belonging to this token no longer exists.",
      );
    }

    checkUserStatus(user);

    return user;
  }
}
