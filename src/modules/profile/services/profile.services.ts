import { BadRequestError } from "../../../shared/errors/badRequestError.js";
import { ConflictError } from "../../../shared/errors/conflictError.js";
import { NotFoundError } from "../../../shared/errors/notfoundError.js";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "../dto/profile.dto.js";
import {
  createProfileDB,
  deleteProfileDB,
  findProfileByUserIdDB,
  updateProfileDB,
} from "../repositories/profile.repositories.js";
import type { ProfileData, ProfileResponse } from "../types/profile.types.js";

export class ProfileServices {
  isComplete(profile: ProfileData): boolean {
    return Boolean(
      profile.bio &&
      profile.location &&
      profile.years_of_experience !== null &&
      profile.resume_Url &&
      profile.skills.length > 0,
    );
  }

  async createProfile(
    userId: string,
    data: CreateProfileInput,
  ): Promise<ProfileData> {
    const existingProfie = await findProfileByUserIdDB(userId);
    if (existingProfie) {
      throw new ConflictError("Profile already exists for this user");
    }

    return await createProfileDB(userId, data);
  }

  async getProfileByUserIdService(userId: string): Promise<ProfileResponse> {
    const profile = await findProfileByUserIdDB(userId);

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }
    return { ...profile, isComplete: this.isComplete(profile) };
  }

  async updateProfileService(
    userId: string,
    updateFields: UpdateProfileInput,
  ): Promise<ProfileData> {
    await this.getProfileByUserIdService(userId);
    return await updateProfileDB(userId, updateFields);
  }

  async deleteProfileServices(userId: string): Promise<void> {
    await this.getProfileByUserIdService(userId);
    await deleteProfileDB(userId);
  }

  async verifyCandidateReadyToApply(userId: string): Promise<ProfileData> {
    const profile = await findProfileByUserIdDB(userId);

    if (!profile || !profile.resume_Url) {
      throw new BadRequestError(
        "Please complete your profile and upload a resume before applying",
      );
    }

    return profile;
  }
}

export const profileServices = new ProfileServices();
