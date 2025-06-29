import { Books } from "../models/books.models.js";
import { Review } from "../models/reviews.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { comments, rating } = req.body;

  const user = await User.findById(userId);
  const book = await Books.findById(id);

  if (!user || !book) {
    return res.status(404).json({
      message: "User or Book not found",
      success: false,
    });
  }

  const review = await Review.create({
    bookId: id,
    userId,
    comments,
    rating,
  });

  if (!review) {
    return res.status(400).json({
      message: "Cannot create review",
      success: false,
    });
  }

  //for book average rating, take all the book in an array and then just sum all the rating
  const ratings = await Review.find({ bookId: id });

  const totalRating = ratings.reduce((acc, cur) => acc + cur.rating, 0);

  //then just calculate average rating and just update the total reviews
  book.averageRating = totalRating / ratings.length;
  book.totalReviews = ratings.length;
  await book.save();

  res.status(200).json({
    message: `${user.name} create a review on ${book.name}`,
    success: true,
    review: {
      name: user.name,
      book: book.name,
      comments,
      rating,
    },
  });
});

const allReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Books.findById(id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
      success: false,
    });
  }

  const reviews = await Review.find({
    bookId: id,
  }).populate("userId", "name"); //so populate will help us to get that particular name or other data for that particular userId who ever has written that review, so it will give all userId data like name , so it will contain userId:{_id:...,name:...}

  if (reviews.length === 0) {
    return res.status(404).json({
      message: "No reviews found",
      success: false,
    });
  }

  res.status(200).json({
    message: `${book.name} reviews`,
    success: true,
    reviews: {
      name: book.name,
      review: reviews,
      totalReviews: reviews.length, //it will contain all review so it will be total number of reviews of a particular book
    },
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { id } = req.params; // this is review id

  //get the review
  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({
      message: "Review not found",
      success: false,
    });
  }

  //if the current user id is not equal to the review user id and if role of user is not admin then it means you are not allowed to delete and if the role of user is admin but userId does not matches than we are allowed to delete and then userId are same then also we are allowed o deleted
  if (review.userId !== userId && userRole === "ADMIN") {
    return res.status(403).json({
      message: "You are not authorized to delete this review",
      success: false,
    });
  }

  await review.deleteOne();

  //get book and then update the total review and average
  const book = await Books.findById(review.bookId);
  const allReview = await Review.find({ bookId: review.bookId });

  //if there are no review then just make then 0 and save
  if (allReview === 0) {
    book.averageRating = 0;
    book.totalReviews = 0;
  } else {
    const totalRating = allReview.reduce((acc, cur) => acc + cur.rating, 0);
    book.averageRating = totalRating / allReview.length;
    book.totalReviews = remainingReviews.length;
  }

  await book.save();

  res.status(200).json({
    message: "Review deleted successfully",
    success: true,
  });
});

export { addReview, allReview, deleteReview };
