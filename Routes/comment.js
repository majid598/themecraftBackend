import express from "express";
import { 
  postComment, 
  getComments, 
  getAllComments, 
  approveComment,
  addReply,
  approveReply
} from "../Controllers/comment.js";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/:itemId", getComments);

// User routes
router.post("/:itemId", isAuthenticated, postComment);
router.post("/reply/:commentId", isAuthenticated, addReply);

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllComments);
router.put("/approve/:id", isAuthenticated, isAdmin, approveComment);
router.put("/approve-reply/:commentId/:replyId", isAuthenticated, isAdmin, approveReply);

export default router; 