import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "netbanking"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
