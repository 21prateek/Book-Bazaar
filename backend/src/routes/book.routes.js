import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { addBookSchema } from "../validation/book.validation.js";
import {
  addBook,
  allBooks,
  bookId,
  buyBook,
  deleteBook,
  updateBook,
} from "../controller/book.controller.js";

export const bookRouter = express.Router();

bookRouter.post(
  "/",
  validate(addBookSchema),
  authMiddleware,
  checkAdmin,
  addBook
);

bookRouter.get("/", authMiddleware, allBooks);
bookRouter.get("/:id", authMiddleware, bookId);
bookRouter.put("/update/:id", authMiddleware, checkAdmin, updateBook);
bookRouter.post("/buy/:id", authMiddleware, buyBook);
bookRouter.delete("/delete/:id", authMiddleware, checkAdmin, deleteBook);
