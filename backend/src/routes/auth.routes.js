import express from "express";
import { validate } from "../middleware/validation.middleware.js";
import { registerSchema } from "../validation/user.validation.js";
import { register } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
