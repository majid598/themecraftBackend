import mongoose, { model } from "mongoose";

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
    image: {
      id: Number,
      type: String,
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
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.models.Item || model("Item", schema);
