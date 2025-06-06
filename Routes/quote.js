import express from "express";
import { quote, myQuotes, getAllQuotes, getQuoteById, deleteQuote } from "../Controllers/quote.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

// Create a new quote request
router.post("/new", isAuthenticated, quote);

// Get user's quotes
router.get("/my", isAuthenticated, myQuotes);

// Get all quotes (admin only)
router.get("/all", isAuthenticated, getAllQuotes);

// Get single quote by ID
router.get("/:id", isAuthenticated, getQuoteById);

// Delete quote
router.delete("/:id", isAuthenticated, deleteQuote);

export default router; 