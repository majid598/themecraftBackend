import { TryCatch } from "../Middlewares/error.js";
import { Quote } from "../Models/quote.js";
import ErrorHandler from "../Utils/utility.js";
import { sendQuoteEmail } from "../Emails/emails.js";

// Create new quote request
const quote = TryCatch(async (req, res, next) => {
  const { email, name, phone, lookingFor, budget, about, companyName } =
    req.body;

  if (!email || !name || !phone || !lookingFor || !budget || !about) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const quote = await Quote.create({
    user: req.user,
    name,
    phone,
    email,
    companyName,
    lookingFor,
    budget,
    about,
  });

  // Send email notification
  await sendQuoteEmail(quote);

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out to us! We'll reply soon",
    quote,
  });
});

// Get user's quotes
const myQuotes = TryCatch(async (req, res, next) => {
  const quotes = await Quote.find({ user: req.user }).sort({ createdAt: -1 });

  console.log(req.user);
  res.status(200).json({
    success: true,
    quotes,
  });
});

// Get all quotes (admin only)
const getAllQuotes = TryCatch(async (req, res, next) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    quotes,
  });
});

// Get single quote by ID
const getQuoteById = TryCatch(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorHandler("Quote not found", 404));
  }

  res.status(200).json({
    success: true,
    quote,
  });
});

// Update quote status
const updateQuoteStatus = TryCatch(async (req, res, next) => {
  const { status, adminResponse } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorHandler("Quote not found", 404));
  }

  // Update quote status and admin response
  quote.status = status;
  if (adminResponse) {
    quote.adminResponse = adminResponse;
  }
  quote.lastUpdatedBy = req.user;

  await quote.save();

  res.status(200).json({
    success: true,
    message: "Quote status updated successfully",
    quote,
  });
});

// Delete quote
const deleteQuote = TryCatch(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    return next(new ErrorHandler("Quote not found", 404));
  }

  // Check if user is the owner of the quote
  if (quote.user.toString() !== req.user.toString()) {
    return next(new ErrorHandler("Not authorized to delete this quote", 403));
  }

  await quote.deleteOne();

  res.status(200).json({
    success: true,
    message: "Quote deleted successfully",
  });
});

export { quote, myQuotes, getAllQuotes, getQuoteById, updateQuoteStatus, deleteQuote };
