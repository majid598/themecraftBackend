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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    emailUpdates: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);
const subscriber = mongoose.Schema(
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

export const Subscriber =
  mongoose.models.Subscriber || model("Subscriber", subscriber);
