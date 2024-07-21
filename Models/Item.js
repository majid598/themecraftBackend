import mongoose, { model } from "mongoose";

const schema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,

    },
    category: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        _id: false,
        public_id: String,
        url: String,
      }
    ],
    languages: {
      type: String,
      required: true
    },
    zip: {
      url: String,
      public_id: String
    },
    buyerId: String,
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.models.Item || model("Item", schema);
