import { prisma } from "../../../shared/config/prisma.js";

import type {
  CreateProfileInput,
  ProfileUserParam,
  UpdateProfileInput,
} from "../dto/profile.dto.js";

import type { ProfileData, ProfileWithUser } from "../types/profile.types.js";

export async function createProfileDB(
  userId: string,
  data: CreateProfileInput,
): Promise<ProfileData> {
  return await prisma.profile.create({
    data: {
      userId,
      skills: data.skills,
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.years_of_experience !== undefined && {
        years_of_experience: data.years_of_experience,
      }),
      ...(data.resume_Url !== undefined && { resume_Url: data.resume_Url }),
    },
  });
}

export async function findProfileByUserIdDB(
  userId: string,
): Promise<ProfileData | null> {
  return await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, email: true, role: true, status: true },
      },
    },
  });
}

export async function updateProfileDB(
  userId: string,
  data: UpdateProfileInput,
): Promise<ProfileData> {
  return await prisma.profile.update({
    where: { userId },
    data: {
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.years_of_experience !== undefined && {
        years_of_experience: data.years_of_experience,
      }),
      ...(data.resume_Url !== undefined && { resume_Url: data.resume_Url }),
      ...(data.skills !== undefined && { skills: data.skills }),
    },
  });
}

export async function deleteProfileDB(userId: string): Promise<void> {
  await prisma.profile.delete({
    where: { userId },
  });
}
