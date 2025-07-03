import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getOrderDetails,
  placeOrder,
} from "../controller/orders.controller";

export const orderRouter = express.Router();

orderRouter.get("/", authMiddleware, getAllOrders);
orderRouter.post("/cash", authMiddleware, placeOrder);
orderRouter.post("/:id", authMiddleware, getOrderDetails);
