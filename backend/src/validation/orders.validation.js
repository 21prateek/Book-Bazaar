import { z } from "zod";

export const placeOrderSchema = z.object({
  address: z.string().min(1, "Address is required"),
  //So the array should be of at least 1 length and inside that element are object so we will also check for those, contains bookId and quantity of that particular book
  items: z
    .array(
      z.object({
        book: z.string().min(1, "Book ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order should have at least one item"),
});
