import { UserRole, UserStatus } from "@prisma/client";

export type UserData = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
};

export type UserResponse = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type LoginResponse = UserResponse & {
  accessToken: string;
};

export type UserRegisterInput = {
  email: string;
  password: string;
  role: UserRole;
};

export type UserLoginInput = {
  email: string;
  password: string;
};

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

// export type SuccessfulRegistration = {
//   success: boolean;
//   message: string;
//   data: {
//     userId: string;
//     userRole: UserRole;
//   };
// };

// export type SuccessfulLogin = {
//   success: boolean;
//   message: string;
//   data: {
//     userId: string;
//     userEmail: string;
//     token: string;
//   };
// };
