import mongoose, { Types } from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    companyName: {
      type: String,
    },
    lookingFor: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    adminResponse: {
      type: String,
      default: "",
    },
    lastUpdatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Quote = mongoose.model("Quote", quoteSchema);
