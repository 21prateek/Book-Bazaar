import express from "express";
import { validate } from "../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "../validation/user.validation.js";
import {
  apiKey,
  login,
  logout,
  profile,
  register,
  userVerification,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/verify/:token", userVerification);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/api-key", authMiddleware, apiKey);
authRouter.get("/me", authMiddleware, profile);
