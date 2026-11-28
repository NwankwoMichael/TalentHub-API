import type { Profile, Prisma } from "@prisma/client";

export type ProfileData = Profile;

export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        email: true;
        role: true;
        status: true;
      };
    };
  };
}>;

export type ProfileResponse = ProfileData & { isComplete: boolean };
