import { prisma } from "../../../shared/config/prisma.js";

export async function findProfileByUserIdDB(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
    select: { id: true, resume_Url: true },
  });
}
