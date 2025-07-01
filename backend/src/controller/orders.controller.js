import { Books } from "../models/books.models.js";
import { Orders } from "../models/orders.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//1.Lets say this is for COD
const placeOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user.id;

  const { items, address } = req.body;

  let totalAmount = 0;

  //iterate in items array
  for (const item of items) {
    //find the book
    const book = await Books.findById(item.book);

    if (!book) {
      return res.status(404).json({ message: `Book not found: ${item.book}` });
    }

    //if stock is less than quantity give by us
    if (book.stock < item.quantity) {
      return res.status(400).json({
        message: `Number of stock for ${book.name} are less than required quantity`,
      });
    }

    totalAmount += book.price * quantity;
  }

  for (const item of items) {
    const book = await Books.findById(item.book);
    book.stock = book.stock - item.quantity;
    await book.save();
  }

  //create the order
  const order = await Orders.create({
    userId,
    items,
    total: totalAmount,
    address,
    paymentStatus: "pending", // for simplicity (assume prepaid)
    status: "processing",
  });

  res.status(201).json({
    success: true,
    message: "COD order placed successfully",
    orderId: order._id,
  });
});

// Get all orders of the authenticated user
export const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Orders.find({ userId }).populate(
    "items.book",
    "name price"
  );
  res.status(200).json({ success: true, orders });
});

// Get specific order details for a user
export const getOrderDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  //get the Order by id and userId when found it will populate that book id and get the details like id , name and price of that book
  const order = await Orders.findOne({ _id: id, userId }).populate(
    "items.book",
    "name price"
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({ success: true, order });
});

//2. For online payments

//creating razor pay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
