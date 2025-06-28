import mongoose, { Schema, Types } from "mongoose";

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
  },
  publishedDate: {
    type: Date,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
  },
});

export const Books = mongoose.model("Books", bookSchema);
