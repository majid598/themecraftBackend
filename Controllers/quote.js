import { TryCatch } from "../Middlewares/error.js";
import { Quote } from "../Models/qoute.js";
import ErrorHandler from "../Utils/utility.js";

const quote = TryCatch(async (req, res, next) => {
  const { email, name, phone, lookingFor, budget, about, companyName } =
    req.body;

  if (!email || !name || !phone || !lookingFor || !budget || !about) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const quote = await Quote.create({
    name,
    phone,
    email,
    companyName,
    lookingFor,
    budget,
    about,
  });

  res.status(201).json({
    success: true,
    message: "Thanks for reach out us! we'll reply soon",
    quote,
  });
});

export { quote };
