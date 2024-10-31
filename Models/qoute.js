import mongoose, { model } from "mongoose";
import validator from "validator";

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    companyName: String,
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
  {
    timestamps: true,
  }
);

export const Quote = mongoose.models.Quote || model("Quote", schema);
