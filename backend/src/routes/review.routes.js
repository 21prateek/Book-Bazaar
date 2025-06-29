import express from "express";
import { validate } from "../middleware/validation.middleware.js";
import { reviewSchema } from "../validation/book.validation.js";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {
  addReview,
  allReview,
  deleteReview,
} from "../controller/review.controller";

export const reviewRouter = express.Router();

reviewRouter.post(
  "/:id/reviews",
  validate(reviewSchema),
  authMiddleware,
  addReview
);
reviewRouter.get("/:id/reviews", authMiddleware, allReview);
reviewRouter.delete("/:id", authMiddleware, checkAdmin, deleteReview);
