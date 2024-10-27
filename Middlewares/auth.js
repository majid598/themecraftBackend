import jwt from "jsonwebtoken";
import ErrorHandler from "../Utils/utility.js";
import { TryCatch } from "../Middlewares/error.js";

export const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["themeCraft-token"] || req.header("token");

  if (!token) {
    return next(new ErrorHandler("Please log in first", 404));
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodeData._id; // Assuming _id is in the token payload
  next();
});
