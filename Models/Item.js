import mongoose, { model, Types } from "mongoose";

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    title2: {
      type: String,
      required: true,
    },
    image: {
      id: Number,
      imageType: String,
    },
    desc1: String,
    desc2: String,
    features: [String],
    inTheBox: [String],
    lbPlg: [String],
    zipFile: String,
    domain: String,
    category: String,
    downloads: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.models.Item || model("Item", schema);
