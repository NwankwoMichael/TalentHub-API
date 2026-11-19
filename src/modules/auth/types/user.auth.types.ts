import { UserRole, UserStatus } from "@prisma/client";
import type { User } from "@prisma/client";

export type UserData = User;

export type UserResponse = {
  id: User["id"];
  email: User["email"];
  role: User["role"];
  status: User["status"];
};

export type LoginResponse = UserResponse & {
  accessToken: string;
};

export type UserRegisterInput = {
  email: User["email"];
  password: User["password"];
  role: User["role"];
};

export type UserLoginInput = {
  email: User["email"];
  password: User["password"];
};

export type TokenPayload = {
  userId: User["id"];
  email: User["email"];
  role: User["role"];
};
