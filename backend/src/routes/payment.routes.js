import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPaymentOnline,
  verifyPaymentAndPlaceOrder,
} from "../controller/orders.controller.js";

export const paymentRouter = express.Router();

paymentRouter.post("/create", authMiddleware, createPaymentOnline);
paymentRouter.post("/verify", authMiddleware, verifyPaymentAndPlaceOrder);
