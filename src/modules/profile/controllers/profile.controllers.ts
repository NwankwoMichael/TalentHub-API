import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../shared/utils/catchAsync.js";

import { profileServices } from "../services/profile.services.js";

import type {
  CreateProfileInput,
  ProfileUserParam,
  UpdateProfileInput,
} from "../dto/profile.dto.js";

export const createMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.currentUser!;
    const data = req.body as CreateProfileInput;

    const profile = await profileServices.createProfile(userId, data);

    res.status(201).json({
      status: "success",
      data: {
        profile,
      },
    });
  },
);

export const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.currentUser!;

    const profile = await profileServices.getProfileByUserIdService(userId);

    res.status(200).json({
      status: "success",
      data: { profile },
    });
  },
);

export const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.currentUser!;
    const data = req.body as UpdateProfileInput;

    const profile = await profileServices.updateProfileService(userId, data);

    res.status(200).json({
      status: "success",
      data: { profile },
    });
  },
);

export const deleteMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.currentUser!;

    await profileServices.deleteProfileServices(userId);

    res.status(200).json({
      status: "success",
      message: "Profile deleted successfully",
    });
  },
);

export const getCandidateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params as ProfileUserParam;

    const profile = await profileServices.getProfileByUserIdService(userId);

    res.status(200).json({
      status: "success",
      data: { profile },
    });
  },
);
