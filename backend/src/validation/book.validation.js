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

export { addBookSchema };
