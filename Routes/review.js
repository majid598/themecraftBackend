import express from "express";
import { postReview, getReviews } from "../Controllers/review.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, postReview);
router.get("/:itemId", getReviews);

export default router;
