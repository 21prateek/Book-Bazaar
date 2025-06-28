import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Books",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

export const Review = mongoose.model("Review", reviewSchema);
