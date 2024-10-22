import { hash } from "bcrypt";
import mongoose, { model, Types } from "mongoose";
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
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile: {
      url: String,
      public_id: String,
    },
    verificationToken: { type: String },
    verified: {
      type: Boolean,
      default: false,
    },
    selectedLeng: {
      type: String,
      enum: ["English", "urdu"],
      default: "English",
    },
    phone: String,
    about: String,
    googleId: String,
    downloads: [{ type: Types.ObjectId, ref: "Item" }],
    favorites: [{ type: Types.ObjectId, ref: "Item" }],
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", schema);
