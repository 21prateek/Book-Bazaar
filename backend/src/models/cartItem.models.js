import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    default: 1,
  },
});

export const CartItem = mongoose.model("CartItem", cartSchema);
