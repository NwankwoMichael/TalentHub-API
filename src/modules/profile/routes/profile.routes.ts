import { Router } from "express";
import { protectRoute } from "../../../shared/middleware/protectRoute.js";
import { restrictTo } from "../../../shared/middleware/restrictTo.js";
import {
  validateBody,
  validateParams,
} from "../../../shared/middleware/validate.js";
import {
  CreateProfileSchema,
  ProfileUserParamSchema,
  UpdateProfileSchema,
} from "../dto/profile.dto.js";
import {
  createMyProfile,
  updateMyProfile,
  getMyProfile,
  getCandidateProfile,
  deleteMyProfile,
} from "../controllers/profile.controllers.js";

const profileRouter = Router();

profileRouter.use(protectRoute);

profileRouter.post(
  "/me",
  restrictTo("CANDIDATE"),
  validateBody(CreateProfileSchema),
  createMyProfile,
);

profileRouter.get("/me", restrictTo("CANDIDATE"), getMyProfile);

profileRouter.patch(
  "/me",
  restrictTo("CANDIDATE"),
  validateBody(UpdateProfileSchema),
  updateMyProfile,
);

profileRouter.delete("/me", restrictTo("CANDIDATE"), deleteMyProfile);

profileRouter.get(
  "/:userId",
  restrictTo("EMPLOYER", "ADMIN"),
  validateParams(ProfileUserParamSchema),
  getCandidateProfile,
);

export { profileRouter };
