import { prisma } from "../../../shared/config/prisma.js";
import { logger } from "../../../shared/lib/logger.js";

import type {
  UserData,
  UserRegisterInput,
  UserLoginInput,
} from "../types/types.js";

export async function findUserByEmail(
  userEmail: string,
): Promise<UserData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    logger.info(err);
    throw err;
  }
}

export async function createUser(body: UserRegisterInput): Promise<UserData> {
  const user = await prisma.user.create({
    data: { email: body.email, password: body.password, role: body.role },
  });

  return user;
}

export async function findUserById(userId: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function findAuthUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
}
