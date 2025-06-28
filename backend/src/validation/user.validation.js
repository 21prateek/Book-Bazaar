import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const registerSchema = z.object({
  username: z.string().min(3),
  fullname: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password should be at least of 6 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and symbol"
    ),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password should be at least of 6 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and symbol"
    ),
});

export const changePasswordSchema = z.object({
  passowrd: z
    .string()
    .min(6, "Password should be at least of 6 characters")
    .regex(
      passwordRegex,
      "Password must include uppercase, lowercase, number, and symbol"
    ),
});
