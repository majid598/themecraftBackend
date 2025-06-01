import { TryCatch } from "../Middlewares/error.js";
import { Item } from "../Models/Item.js";
import ErrorHandler from "../Utils/utility.js";

const postReview = TryCatch(async (req, res, next) => {
  const { rating, comment } = req.body;
  const itemId = req.params.itemId;

  if (!rating || !comment || !itemId) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5", 400));
  }

  const item = await Item.findById(itemId);
  if (!item) {
    return next(new ErrorHandler("Item not found", 404));
  }

  // Check if user has already reviewed
  const hasReviewed = item.reviews.some(
    (review) => review.user.toString() === req.user.toString()
  );

  if (hasReviewed) {
    return next(
      new ErrorHandler("You have already reviewed this template", 400)
    );
  }

  item.reviews.push({
    user: req.user,
    rating,
    comment,
  });

  await item.save();

  res.status(201).json({
    success: true,
    message: "Thanks for your feedback",
  });
});

const getReviews = TryCatch(async (req, res, next) => {
  const { itemId } = req.params;

  const item = await Item.findById(itemId).populate("reviews.user", "name");
  if (!item) {
    return next(new ErrorHandler("Template not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: item.reviews,
  });
});

const getAllReviews = TryCatch(async (req, res, next) => {
  const reviews = await Item.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reviews,
  });
});

const approveReview = TryCatch(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  review.isApproved = true;
  await review.save();

  res.status(200).json({
    success: true,
    message: "Review approved successfully",
    review,
  });
});

export { postReview, getReviews, getAllReviews, approveReview };
