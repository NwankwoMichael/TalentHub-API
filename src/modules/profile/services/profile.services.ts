import { BadRequestError } from "../../../shared/errors/badRequestError.js";
import { findProfileByUserIdDB } from "../repositories/profile.repositories.js";

export class ProfileServices {
  async verifyCandidateReadyToApply(userId: string) {
    const profile = await findProfileByUserIdDB(userId);

    if (!profile || !profile.resume_Url) {
      throw new BadRequestError(
        "Please complete your profile and upload a resume before applying",
      );
    }

    return profile;
  }
}
