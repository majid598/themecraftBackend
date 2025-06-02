import express from "express";
import {
    addReply,
    approveComment,
    approveReply,
    getAllComments,
    getComments,
    postComment
} from "../Controllers/comment.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/:itemId", getComments);

// User routes
router.post("/:itemId", isAuthenticated, postComment);
router.post("/reply/:commentId", isAuthenticated, addReply);

// Admin routes
router.get("/", getAllComments);
router.put("/approve/:id", isAuthenticated, approveComment);
router.put("/approve-reply/:commentId/:replyId", isAuthenticated, approveReply);

export default router; 