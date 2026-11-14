import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate } from "../../../shared/middleware/validate.js";
import { RegisterSchema } from "../dto/register/register.validation.dto.js";
import { LoginSchema } from "../dto/login/login.validation.dto.js";

export const authRouter = Router();

authRouter.post("/auth/register", validate(RegisterSchema), registerUser);
authRouter.post("/auth/login", validate(LoginSchema), loginUser);
