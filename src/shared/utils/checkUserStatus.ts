import type { UserStatus } from "@prisma/client";
import { ForbiddenError } from "../errors/forbiddenError.js";

export function checkUserStatus(user: { status: UserStatus }): void {
  if (user.status !== "ACTIVE") {
    throw new ForbiddenError("Access Forbiden. Account is not active.");
  }
}
