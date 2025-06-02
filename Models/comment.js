import mongoose, { model, Types } from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentId: {
      type: Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: Types.ObjectId,
      ref: "Item",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    replies: [replySchema]
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || model("Comment", commentSchema); 