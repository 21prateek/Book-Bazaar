import { z } from "zod";

const addBookSchema = z.object({
  name: z.string().min(3, "Name should be greater than 3"),
  description: z.string(),
  author: z.string(),
  price: z.number(),
  publisher: z.string(),
  genre: z.string(),
  stock: z.number(),
});

const reviewSchema = z.object({
  comments: z.string().max(100),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating should be greater than 1")
    .max(5, "Rating should be less than 5"),
});

export { addBookSchema, reviewSchema };
