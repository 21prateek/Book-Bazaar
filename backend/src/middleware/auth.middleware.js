import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { User } from "../models/user.models.js";
dotenv.config();

async function authMiddleware(req, res, next) {
  const expireTime = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decodedAccessToken.id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid access token", success: false });
      }

      const newAccessToken = user.generateAccessToken();

      res.cookie("accessToken", newAccessToken, expireTime);

      req.user = { id: user._id, role: user.role };

      return next();
    }

    if (refreshToken) {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedRefreshToken.id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid access token", success: false });
      }

      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      user.refreshToken = newRefreshToken;

      res.cookie("accessToken", newAccessToken, expireTime);
      res.cookie("refreshToken", newRefreshToken, expireTime);

      req.user = { id: user._id, role: user.role };
      return next();
    }

    //if none found then just show this
    return res.status(401).json({
      message: "Authentication failed unauthorized user",
      success: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function checkAdmin(req, res, next) {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid access token", success: false });
  }

  console.log(user.role);

  if (user.role === "ADMIN") {
    return next();
  }

  return res.status(400).json({
    message: "Only admin can add or delete",
    success: false,
  });
}

export { authMiddleware, checkAdmin };
