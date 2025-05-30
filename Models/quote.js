import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: false
    },
    phone: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export const Quote = mongoose.model("Quote", quoteSchema); 