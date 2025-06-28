import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //So this will be an array of books
    items: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        quantity: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Orders = mongoose.model("Orders", orderSchema);
