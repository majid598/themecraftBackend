import mongoose, { model } from "mongoose";
import validator from "validator";

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    name: {
      type: String,
      required: true,
    },
    companyName: String,
    phone: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.models.Contact || model("Contact", schema);
