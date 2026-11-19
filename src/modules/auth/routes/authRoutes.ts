import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateBody } from "../../../shared/middleware/validate.js";
import { RegisterSchema } from "../dto/register/register.validation.dto.js";
import { LoginSchema } from "../dto/login/login.validation.dto.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(RegisterSchema), registerUser);
authRouter.post("/login", validateBody(LoginSchema), loginUser);
