import { Books } from "../models/books.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//adding books
const addBook = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, description, author, price, publisher, genre, stock } =
    req.body;

  const existingBook = await Books.findOne({
    name,
    author,
  });

  if (existingBook) {
    return res.status(400).json({
      message: "Book already exist",
      success: false,
    });
  }

  const date = new Date(); //as it want date in 21/01/2025 , we can also do date.now() while creating it but we only want DD/MM/YY

  const book = await Books.create({
    createdBy: userId,
    name,
    description,
    author,
    price,
    publisher,
    genre,
    publishedDate: date,
    stock,
  });

  res.status(200).json({
    message: "Added book to the library",
    success: true,
    book: {
      name: book.name,
      description: book.description,
      author: book.author,
      price: book.price,
      publisher: book.publisher,
      genre: book.genre,
      publishedDate: book.publishedDate,
      stock: book.stock,
    },
  });
});

//filtered book or all books
const allBooks = asyncHandler(async (req, res) => {
  //also get some data on which bases we can filter our books
  const { genre, author, name } = req.query; // also encodeURIComponent(genre or author or name) while doing frontend request

  //   console.log(genre, author, name);

  const filter = {};

  if (genre && genre.trim() !== "") filter.genre = new RegExp(genre, "i"); //"i" means case-insensitive, matches both uppercase and lowercase, so genre will be the data type in query which we get while searching, so genre/i
  if (author && author.trim() !== "") filter.author = new RegExp(author, "i");
  if (name && name.trim() !== "") filter.name = new RegExp(name, "i");

  const filteredBooks = await Books.find(filter);

  if (filteredBooks.length === 0) {
    return res.status(404).json({
      message: "No books found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Books found",
    success: true,
    filteredBooks,
  });
});

//get book by id
const bookId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Books.findById(id);

  if (!book) {
    return res.status(404).json({
      message: "No book found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Book found",
    success: true,
    book: {
      name: book.name,
      description: book.description,
      author: book.author,
      price: book.price,
      publishedDate: book.publishedDate,
      publisher: book.publisher,
      genre: book.genre,
      stock: book.stock,
      totalReviews: book.totalReviews,
      averageRating: book.averageRating,
    },
  });
});

//update book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const book = await Books.findById(id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
      success: false,
    });
  }

  //now update only those fields, get the key , and with that update that key value with the given data , like if updateData= {price:2000} then, convert into keys array[price], then iterate on that array book[price]=updateData[price]
  Object.keys(updateData).forEach((data) => {
    book[data] = updateData[data];
  });

  await book.save();

  res.status(200).json({
    message: "Update book data",
    success: true,
    book: {
      name: book.name,
      description: book.description,
      author: book.author,
      price: book.price,
      publishedDate: book.publishedDate,
      publisher: book.publisher,
      genre: book.genre,
      stock: book.stock,
      totalReviews: book.totalReviews,
      averageRating: book.averageRating,
    },
  });
});

//buy book
const buyBook = asyncHandler(async (req, res) => {
  const { id } = req.params; // Book ID
  const { quantity } = req.body; // Quantity being purchased

  //if quantity is not there or less than 1
  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid quantity",
    });
  }

  const book = await Books.findById(id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  //if quantity is greater than data base stocks
  if (book.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${book.stock} left in stock`,
    });
  }

  //decrease those quantity
  book.stock -= quantity;
  await book.save();

  res.status(200).json({
    success: true,
    message: `Congrats you bought a book`,
    remainingStock: book.stock, //after buying stock of that book
    book: {
      id: book._id,
      name: book.name,
      stock: book.stock,
    },
  });
});

//delete book
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Books.findByIdAndDelete(id);

  res.status(200).json({
    message: `Deleted ${book.name} by ${book.author}`,
    success: true,
    book,
  });
});

export { addBook, allBooks, bookId, updateBook, buyBook, deleteBook };
