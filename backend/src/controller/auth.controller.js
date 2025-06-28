import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailContent, sendMail } from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiKey } from "../models/apiKeys.models.js";

dotenv.config();

const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;

  const exisitngUser = await User.findOne({
    email,
  });

  if (exisitngUser)
    return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({
    username,
    fullname,
    password,
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "User cannot be creater",
      success: false,
    });
  }

  const { unhashedToken, hashedToken, tokenExpirey } =
    user.generateTemporaryToken();

  user.verificationToken = hashedToken;
  user.verificationTokenExpiry = tokenExpirey;

  await user.save();

  sendMail({
    email: user.email,
    subject: "Verificating account",
    mailGenContent: emailContent(
      user.username,
      `http://localhost:3000/api/v1/user/verify/${unhashedToken}`
    ),
  });

  res.status(200).json({
    message: "Sent verification token to your email",
    success: true,
  });
});

const userVerification = asyncHandler(async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({
      message: "No token found for verification",
      success: false,
    });
  }

  //user has hashed token in db and in email we have sent unhashed so if we hash it will convert itself into hashed token , but hashing process should be same for both
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: Date.now() }, //if the database date is greater than current date then it means it has not expired yes
  });

  if (!user) {
    return res.status(400).json({
      message: "No user found for verification",
      success: false,
    });
  }

  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    message: `Hello, ${user.fullname} you have been verified`,
    success: true,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "No user found",
      success: false,
    });
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    return res.status(400).json({
      message: "Password incorrect",
      success: false,
    });
  }

  if (!user.isEmailVerified) {
    res.status(400).json({
      message: "Verify your email",
    });
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;

  await user.save();

  const expireTime = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, expireTime);
  res.cookie("refreshToken", refreshToken, expireTime);

  res.status(200).json({
    message: "Your are logged in",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findOne({
    _id: id,
  });

  if (!user) {
    return res.json({
      status: false,
      message: "Unauthorized logout",
    });
  }

  user.refreshToken = null;

  await user.save();

  res.cookie("accessToken", "", { httpOnly: true });
  res.cookie("refreshToken", "", { httpOnly: true });
  return res.status(200).json({
    success: true,
    message: "Logged out sucessfully",
  });
});

const apiKey = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Invalidate all old keys if needed
  await ApiKey.deleteMany({ user: userId });

  const key = crypto.randomBytes(32).toString("hex");

  const newApiKey = await ApiKey.create({
    user: userId,
    key,
  });

  res.status(201).json({
    message: "API key generated successfully",
    success: true,
    key: newApiKey.key,
  });
});

const profile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const getUser = await User.findOne({
    _id: userId,
  }).select(["-password", "-refreshToken"]);

  if (!getUser) {
    return res.status(400).json({
      message: "User not found",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    user: getUser,
  });
});

export { register, userVerification, login, logout, apiKey, profile };
