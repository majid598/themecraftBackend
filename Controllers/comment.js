import { TryCatch } from "../Middlewares/error.js";
import { Comment } from "../Models/comment.js";
import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utility.js";

const postComment = TryCatch(async (req, res, next) => {
  const { comment } = req.body;
  const itemId = req.params.itemId;

  if (!comment || !itemId) {
    return next(new ErrorHandler("Comment is required", 400));
  }

  // Check if user has downloaded the template
  const user = await User.findById(req.user);
  if (!user.downloads.includes(itemId)) {
    return next(new ErrorHandler("You must download the template before commenting", 400));
  }

  const newComment = await Comment.create({
    user: req.user,
    item: itemId,
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Comment submitted successfully",
    comment: newComment,
  });
});

const addReply = TryCatch(async (req, res, next) => {
  const { reply } = req.body;
  const { commentId } = req.params;

  if (!reply) {
    return next(new ErrorHandler("Reply is required", 400));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  // Check if user has downloaded the template
  const user = await User.findById(req.user);
  if (!user.downloads.includes(comment.item)) {
    return next(new ErrorHandler("You must download the template before replying", 400));
  }

  comment.replies.push({
    user: req.user,
    commentId,
    reply,
  });

  await comment.save();

  res.status(201).json({
    success: true,
    message: "Reply added successfully",
    comment,
  });
});

const getComments = TryCatch(async (req, res, next) => {
  const { itemId } = req.params;

  const comments = await Comment.find({ 
    item: itemId,
    isApproved: true 
  })
  .populate("user", "name")
  .populate("replies.user", "name")
  .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    comments,
  });
});

const getAllComments = TryCatch(async (req, res, next) => {
  const comments = await Comment.find()
    .populate("user", "name")
    .populate("replies.user", "name")
    .populate("item", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    comments,
  });
});

const approveComment = TryCatch(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  comment.isApproved = true;
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment approved successfully",
    comment,
  });
});

const approveReply = TryCatch(async (req, res, next) => {
  const { commentId, replyId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  const reply = comment.replies.id(replyId);
  if (!reply) {
    return next(new ErrorHandler("Reply not found", 404));
  }

  reply.isApproved = true;
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Reply approved successfully",
    comment,
  });
});

export { 
  postComment, 
  getComments, 
  getAllComments, 
  approveComment,
  addReply,
  approveReply
}; 