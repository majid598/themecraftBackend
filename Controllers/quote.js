import { TryCatch } from "../Middlewares/error.js";
import { Quote } from "../Models/qoute.js";
import ErrorHandler from "../Utils/utility.js";
import { sendQuoteEmail } from "../Emails/emails.js";

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

  // Send email notification
  await sendQuoteEmail(quote);

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out to us! We'll reply soon",
    quote,
  });
});

export { quote };
