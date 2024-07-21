import { hash } from "bcrypt";
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
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile: {
      url: String,
      public_id: String
    },
    verificationToken: { type: String },
    verified: {
      type: Boolean,
      default: false
    },
    selectedLeng: {
      type: String,
      enum: ["English", "urdu"],
      default: "English"
    },
    role: {
      type: String,
      enum: ["seller", "user"],
      default: "user"
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
    googleId: String,
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
